# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Working directory

The Angular project lives in [uniplanWeb/](uniplanWeb), not the repo root. All `npm` / `ng` commands must be run from `uniplanWeb/`. The repo root only holds `.github/` (CODEOWNERS + workflows), `.claude/`, this file and `.gitignore`.

## Common commands

Run from `uniplanWeb/`:

| Task | Command |
| --- | --- |
| Dev server (http://localhost:4200) | `npm start` (= `ng serve`) |
| Production build → `dist/` | `npm run build` |
| Watch build (development config) | `npm run watch` |
| Lint (ESLint via `angular-eslint`) | `npm run lint` (= `ng lint`) |
| Unit tests (Karma + Jasmine, headless Chrome) | `npm test` |
| Run a single spec | `npm test -- --include='**/major-service.spec.ts'` |
| Single run (CI-style, no watch) | `npm test -- --no-watch --browsers=ChromeHeadless` |
| Generate a component | `npx ng generate component features/<feature>/<name>` |

There is no e2e runner configured — the README mentions `ng e2e` but no framework is wired up. Production budgets: initial bundle 500 kB warn / 1 MB error; per-component styles 4 kB / 8 kB. ESLint config lives in [eslint.config.js](uniplanWeb/eslint.config.js); `@typescript-eslint/no-explicit-any` is temporarily `"warn"` (see issue #99) — don't add new `any`.

## Backend dependency

The backend is the Spring Boot `uniplan` repo (served under `/api`). The base URL comes from [environment.ts](uniplanWeb/src/environments/environment.ts) (`baseUrl: 'http://localhost:8080/api'`), and every resource URL is built in [config/endpoints.ts](uniplanWeb/src/app/config/endpoints.ts) (`API_ENDPOINTS.faculties`, `.majors`, `.courses`, `.universities`, `.rooms`). Services must use `API_ENDPOINTS` — never hardcode a URL. When wiring a new backend resource, add its entry to `endpoints.ts` first.

- There is no dev-server proxy and the backend has no CORS configuration, so browser calls from `localhost:4200` to `localhost:8080` can be blocked by CORS.
- The backend has a full `/students` API, but the Student feature is **not connected yet** — `ELEMENT_STUDENT_DATA` in [student-table.ts](uniplanWeb/src/app/features/student/student-table/student-table.ts) is a hardcoded list, and edit/delete only `console.log`.
- `GET /majors` returns only `{ id, facultyId, majorName }`; `MajorElm.courseId` / `courseType` / `courseSubtype` are not populated by it.
## Architecture

### Routing

Navigation uses the Angular Router. [app.routes.ts](uniplanWeb/src/app/app.routes.ts) has one parent route `""` → [`LayoutComponent`](uniplanWeb/src/app/layout-component/layout-component.ts) (navmenu + `<router-outlet>`), with lazy-loaded children via `loadComponent`: `home`, `faculty`, `major`, `student`, `room`, and a `**` → `NotFoundPanel` fallback. `""` redirects to `home`.

To add a new feature page:

1. Create a `<feature>-panel` component under `src/app/features/<feature>/`.
2. Add a child route in `app.routes.ts` (copy the `room` entry) — keep it before the `**` wildcard.
3. Add a link in [navmenu-component.html](uniplanWeb/src/app/core/shared/navmenu-component/navmenu-component.html) with `[routerLink]="'/<feature>'" routerLinkActive="active"`. Some menu items (Department, Teachers, Subjects, Settings, Login) are still placeholder `href="#"` links.

### Feature service refresh pattern

Each feature service (e.g. [faculty-service.ts](uniplanWeb/src/app/features/faculty/faculty-service.ts), [major-service.ts](uniplanWeb/src/app/features/major/major-service.ts), [room-service.ts](uniplanWeb/src/app/features/room/room-service.ts)) exposes `refreshNeeded = new Subject<void>()`. Mutating methods (`create*`, `edit*`, `delete*`) call `this.refreshNeeded.next()` in a `map`/`tap` after the HTTP response. Tables and panels subscribe to it (e.g. `merge(of(undefined), service.refreshNeeded).pipe(switchMap(...))` in `MajorPanel`) and refetch when it emits; panels also re-derive filter dropdowns this way. When adding a new mutation, preserve this contract or filters/tables will go stale. Use `takeUntilDestroyed()` or the `async` pipe for new subscriptions.

### Folder layout

- `src/app/config/endpoints.ts` — `API_ENDPOINTS` map (see Backend dependency).
- `src/environments/environment.ts` — `baseUrl` for the API.
- `src/app/layout-component/` — app shell (navmenu + router outlet).
- `src/app/core/interfaces/` — domain types named `<entity>-elm.ts` exporting `<Entity>Elm` (e.g. `MajorElm`), plus view-model / filter-option types (`room-view-model.ts`, `major-filter-options.ts`). One exception: `UniversityElm` is co-located inside [university-service.ts](uniplanWeb/src/app/features/university/university-service.ts). (Issue #87 proposes dropping the `Elm` suffix — until it lands, keep the current naming.)
- `src/app/core/shared/` — reusable UI pieces: `add-button`, `add-form`, `edit-form`, `delete-form`, `filters-form`, `input-filter`, `navmenu-component`, `settings` (language switcher, not routed yet), and `pipes/` ([`FacultyNamePipe`](uniplanWeb/src/app/core/shared/pipes/faculty-name-pipe.ts) maps a faculty id to its name). Feature-specific forms wrap the form shells via `imports` and a `saveClicked` output.
- `src/app/features/<feature>/` — `faculty`, `major`, `student`, `room`, plus `university` (service only), `home` and `not-found` (panels only). Each full feature owns its `*-service.ts` plus `*-panel`, `*-options`, `*-table`, `*-add-form`, `*-edit-form` / `*-edit`, `*-delete-form`, `*-filters` components (Room currently has only panel/options/table/add-form). Note the `*-service.ts` naming (with hyphen) is non-default Angular style — keep it consistent if you add a new service.
- `src/app/services/` — cross-cutting services. Currently just [login-auth-service.ts](uniplanWeb/src/app/services/login-auth-service.ts), which is a `localStorage`-backed stub (no real auth).
- `src/testing/translate-testing.ts` — `translateTestingProviders` for specs (imported as `@testing/translate-testing`, alias defined in `tsconfig.spec.json`).
- `public/i18n/{bg,en}.json` — translation files.

### In-memory filtering

Tables receive filter values as `@Input()` and filter their local data either via a getter (`MajorTable.filteredMajors`) or `applyFilters()` in `ngOnChanges` (`StudentTable`). The list of filter options is computed by a `static getFilterOptions(data, ...)` method on the table class and consumed by the feature panel (`MajorPanel`, `StudentPanel`) to feed the filter dropdowns. Keep both the static method and the in-memory filter logic in sync when adding a column.

### i18n

UI text is translated with `@ngx-translate/core` (configured in [app.config.ts](uniplanWeb/src/app/app.config.ts); default and fallback language `bg`, files loaded from `/i18n/<lang>.json`). Templates use the `translate` pipe (`{{ 'navmenu.home' | translate }}`), code uses `TranslateService.instant(...)`. **Every new user-facing string needs a key in both `bg.json` and `en.json`.** Specs that render translated templates must add `...translateTestingProviders` to `providers`.

### Dialogs

Add/edit/delete flows use `MatDialog`. The shared skeleton lives in `core/shared/{add,edit,delete}-form/` and exposes a `saveClicked` output that the feature-specific dialog wires to its own `save()`. Data flows in via `MAT_DIALOG_DATA`; `MatDialogRef.close(value)` returns the result. Width is typically `'400px'`.

## Conventions

- Angular 22 / Angular Material 22. Components are standalone by default — **don't add `standalone: true`** (it was removed in #19; six older files in `core/shared/` still carry it). Always declare explicit `imports: [...]`. There are no `NgModule`s — do not introduce one.
- Use `inject()` for dependencies, not constructor injection.
- Many components set `changeDetection: ChangeDetectionStrategy.Eager`; follow the surrounding feature when adding components. Signals (`signal()`) are already used in some tables (e.g. `MajorTable`).
- Selector prefix is `app-`. Class names are PascalCase **without** the `Component` suffix (e.g. `FacultyAddForm`, not `FacultyAddFormComponent`). File and folder names are kebab-case and match the selector minus the `app-` prefix. (Legacy exceptions: `NavmenuComponent`, `LayoutComponent`.)
- Tests live next to source as `*.spec.ts`. Most existing specs are scaffolds that only assert the component was created. Run the tests before claiming "tests pass" — don't assume.
- Default style is SCSS (configured in [angular.json](uniplanWeb/angular.json)). The Material theme is `azure-blue` (prebuilt).
- TypeScript runs in strict mode plus `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noFallthroughCasesInSwitch`. Angular templates run with `strictTemplates` + `strictInputAccessModifiers`. Don't loosen these.
- Templates use the built-in control flow (`@if` / `@for`). `*ngIf` / `*ngFor` were removed (#20) — don't reintroduce them.
- Prefer reactive forms (see `room-add-form`) for new forms; several older forms are still template-driven (`[(ngModel)]`, issue #17). Don't use `alert(...)` for validation — use `MatError` or a snackbar.
- The codebase contains Bulgarian domain values (e.g. `'редовно'` / `'задочно'` literals in [student-elm.ts](uniplanWeb/src/app/core/interfaces/student-elm.ts)). Don't translate these without confirmation — they are domain values, not UI copy. UI copy goes through i18n keys (see i18n above).

## Coding Conventions

Detailed rules live in [.claude/rules/](.claude/rules/) and are loaded by reviewer agents and CI:

- [.claude/rules/frontend.md](.claude/rules/frontend.md) — Angular 22 / Material 22 architecture, routing, i18n, RxJS state, accessibility, security, SCSS, anti-patterns, Karma testing.
- [.claude/rules/implementation-common.md](.claude/rules/implementation-common.md) — orchestrator-only: term semantics, triage principles, flaky-test rule, test output hygiene, stall detection. Read once per session if you're orchestrating fix-agent work.

There is no `e2e-test.md` because no e2e runner is configured. If Playwright (or another framework) is added, the rule should cover at least: selector priority (Role > Label > Placeholder > Text > Test ID > ARIA > CSS-as-last-resort), no `waitForLoadState('networkidle')` (it hangs in CI when the app polls), Page Object Model in `e2e/pages/`, and value-based assertions over presence-only.

## Project Subagents

One project-scoped Claude Code subagent lives under [.claude/agents/](.claude/agents/):

- `uniplan-web-fe-reviewer` — frontend reviewer (read-only); produces review findings against [.claude/rules/frontend.md](.claude/rules/frontend.md). Cannot edit code (no `Write`/`Edit`/`Agent` tools). System prompt carries the distilled ruleset so the agent doesn't need to re-read the rules file on every invocation.

Invoke via the `Agent` tool with `subagent_type: uniplan-web-fe-reviewer`. Used by the `/review-pr` skill and ad-hoc PR reviews. There is intentionally **no implementer agent** yet — the codebase is small enough that loading rules in `CLAUDE.md` is cheaper than dispatching a subagent for every implementation task. Revisit when the rules files outgrow what fits in the orchestrator's context budget.

## Project Skills

Two project-scoped skills live under [.claude/skills/](.claude/skills/):

- `review-pr` — single-pass PR review. Fetches PR metadata, creates a worktree (skipped in CI), classifies the diff into FE / Other slices, dispatches `uniplan-web-fe-reviewer` against the FE slice, reviews the Other slice itself, and merges findings into one consolidated review. Argument: `<pr-number>`.
- `create-worktree` — create or reuse a git worktree for a remote branch under `<repo-root>/../uniplan-web-worktree/<normalized-branch>`, then `npm ci` inside `uniplanWeb/` for the new worktree. Argument: `<branch-name>`.

## Bash Usage for Agents

These rules apply to **all agents in this project** (the orchestrator, the `uniplan-web-fe-reviewer`, anything spawned via the `Agent` tool):

- **Never use compound Bash commands** (chained with `&&`, `;`, or `||`). Run each command as a separate Bash tool call.
- **Never prefix commands with `cd <path> &&`** — that is a compound command. For git commands outside the cwd, use `git -C <path>`. For npm/ng, use `npm --prefix <path>` or run from the correct directory in a separate Bash call.
- **Never use shell redirect operators** (`>`, `>>`, `|`) in Bash commands. Let the Bash tool capture stdout directly. If output needs to be persisted, pass it through the `Write` tool.
- **Never write files outside the project directory.** No `/tmp`, no `~`, no absolute paths outside the worktree.

Why these rules: in `dontAsk` mode, permission allow-list patterns match the **full command string**. Compound commands and shell redirects break pattern matching and the harness rejects them, blocking autonomous work. The constraint is mechanical, not stylistic.

## GitHub Action setup (one-time)

The PR-review workflow at [.github/workflows/claude-code-review.yml](.github/workflows/claude-code-review.yml) is gated so only `@uni-dev-lab/reviewers` members can spend Claude tokens. Three layers of defense:

1. `workflow_dispatch` (built-in write-access gate).
2. An `authorize` job that checks team membership via `gh api`.
3. A `claude-review` job pinned to the `reviewers-only` GitHub environment, with `CLAUDE_CODE_OAUTH_TOKEN` scoped to that environment.

To enable, run once:

```bash
# 1. Create the gated environment
gh api -X PUT repos/uni-dev-lab/uniplan-web/environments/reviewers-only

# 2. Add the Claude OAuth token AS AN ENVIRONMENT SECRET (not repo-wide)
gh secret set CLAUDE_CODE_OAUTH_TOKEN \
  --repo uni-dev-lab/uniplan-web \
  --env reviewers-only

# 3. Add the read:org PAT for team-membership checks AS A REPO SECRET
gh secret set REVIEWERS_TEAM_READ_TOKEN \
  --repo uni-dev-lab/uniplan-web
```

Optionally add `@uni-dev-lab/reviewers` as a required reviewer on the `reviewers-only` environment for an extra manual-approval gate (Settings → Environments → reviewers-only → Required reviewers).

`REVIEWERS_TEAM_READ_TOKEN` must be a fine-grained PAT (or GitHub App installation token) with `read:org` scope on the `uni-dev-lab` org. The default `GITHUB_TOKEN` cannot read team membership, which is why a separate token is required.

## CI / Ownership

`.github/CODEOWNERS` assigns everything to `@uni-dev-lab/reviewers`. There are two GitHub Actions workflows:

- [ci.yml](.github/workflows/ci.yml) — "Angular CI", runs on every PR against `main` (working directory `uniplanWeb/`, Node version from `uniplanWeb/.nvmrc`): `npm ci` → `npm run lint` → `npm run test -- --no-watch --no-progress --browsers=ChromeHeadless --code-coverage` → `npm run build`. Lint, tests and build must all pass.
- [claude-code-review.yml](.github/workflows/claude-code-review.yml) — the gated PR-review workflow described above.
