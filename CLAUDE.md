# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Working directory

The Angular project lives in [uniplanWeb/](uniplanWeb), not the repo root. All `npm` / `ng` commands must be run from `uniplanWeb/`. The repo root only holds `.github/CODEOWNERS` and `.gitignore`.

## Common commands

Run from `uniplanWeb/`:

| Task | Command |
| --- | --- |
| Dev server (http://localhost:4200) | `npm start` (= `ng serve`) |
| Production build → `dist/` | `npm run build` |
| Watch build (development config) | `npm run watch` |
| Unit tests (Karma + Jasmine, headless Chrome) | `npm test` |
| Run a single spec | `npm test -- --include='**/major-service.spec.ts'` |
| Single run (CI-style, no watch) | `npm test -- --watch=false --browsers=ChromeHeadless` |
| Generate a component | `npx ng generate component features/<feature>/<name>` |

There is no lint script and no e2e runner configured — the README mentions `ng e2e` but no framework is wired up. Production budgets: initial bundle 500 kB warn / 1 MB error; per-component styles 4 kB / 8 kB.

## Backend dependency

Every feature service hardcodes `http://localhost:8080/...` (faculties, majors, courses, universities). There is no environment file — to point at a different API you must edit the service files directly. The Student feature has no backend yet; `ELEMENT_STUDENT_DATA` in [student-table.ts](uniplanWeb/src/app/features/student/student-table/student-table.ts) is a hardcoded list.

## Architecture

### View switching is not the Angular router

[app.routes.ts](uniplanWeb/src/app/app.routes.ts) registers a single route (`""` → `LayoutComponent`); the router is effectively unused for in-app navigation. Instead:

- [`ViewService`](uniplanWeb/src/app/core/shared/main-panel/view.service.ts) holds a `BehaviorSubject<string>` of the current view (`'home' | 'faculty' | 'major' | 'student'`).
- [`NavmenuComponent`](uniplanWeb/src/app/core/shared/navmenu-component/navmenu-component.ts) calls `viewService.setView(...)` from click handlers.
- [`MainPanel`](uniplanWeb/src/app/core/shared/main-panel/main-panel.ts) subscribes to `currentView$` and its template uses `*ngIf="currentView === 'X'"` to swap feature panels.

To add a new feature view: register a string in `ViewService`, add a click handler in `NavmenuComponent`, and add an `*ngIf` block in [main-panel.html](uniplanWeb/src/app/core/shared/main-panel/main-panel.html). Do not add it to `app.routes.ts` unless you intend to migrate everything to the router.

### Feature service refresh pattern

Each feature service (e.g. [faculty-service.ts](uniplanWeb/src/app/features/faculty/faculty-service.ts), [major-service.ts](uniplanWeb/src/app/features/major/major-service.ts)) exposes `refreshNeeded = new Subject<void>()`. Mutating methods (`create*`, `edit*`, `delete*`) call `this.refreshNeeded.next()` inside a `map` after the HTTP response. Tables and panels subscribe to it in `ngOnInit` and refetch when it emits. `MainPanel` also re-derives filter dropdowns this way. When adding a new mutation, preserve this contract or filters/tables will go stale.

### Folder layout

- `src/app/core/interfaces/` — domain types named `<entity>.ts` exporting `<Entity>` (e.g. `student-profile.ts` → `StudentProfile`, `lector-profile.ts` → `LectorProfile`). One exception: `UniversityElm` is co-located inside [university-service.ts](uniplanWeb/src/app/features/university/university-service.ts).
- `src/app/core/shared/` — reusable UI shells: `add-button`, `add-form`, `edit-form`, `delete-form`, `filters-form`, `input-filter`, `main-panel` (with its `table` child), `navmenu-component`. Feature-specific forms wrap these via `imports` and an `@Output() saveClicked` event.
- `src/app/features/{faculty,major,student,university}/` — each feature owns its `*-service.ts` plus `*-options`, `*-table`, `*-add-form`, `*-edit-form`, `*-delete-form`, `*-filters` components. Note the `*-service.ts` naming (with hyphen) is non-default Angular style — keep it consistent if you add a new service in this layer.
- `src/app/services/` — cross-cutting services. Currently just [login-auth-service.ts](uniplanWeb/src/app/services/login-auth-service.ts), which is a `localStorage`-backed stub (no real auth).

### In-memory filtering

Tables receive filter values as `@Input()` and filter their local `dataSource` either via a getter (`MajorTable.filteredMajors`) or `applyFilters()` in `ngOnChanges` (`StudentTable`). The list of filter options is computed by a `static getFilterOptions(data, ...)` method on the table class and consumed by `MainPanel` to feed the filter dropdowns. Keep both the static method and the in-memory filter logic in sync when adding a column.

### Dialogs

Add/edit/delete flows use `MatDialog`. The shared skeleton lives in `core/shared/{add,edit,delete}-form/` and exposes a `@Output() saveClicked` that the feature-specific dialog wires to its own `save()`. Data flows in via `MAT_DIALOG_DATA`; `MatDialogRef.close(value)` returns the result. Width is typically `'400px'`.

## Conventions

- **All components are `standalone: true`** with explicit `imports: [...]`. There are no `NgModule`s — do not introduce one.
- Selector prefix is `app-`. Class names are PascalCase **without** the `Component` suffix (e.g. `FacultyAddForm`, not `FacultyAddFormComponent`). File and folder names are kebab-case and match the selector minus the `app-` prefix.
- Tests live next to source as `*.spec.ts`. Most existing specs are scaffolds — [app.spec.ts](uniplanWeb/src/app/app.spec.ts) currently asserts an `<h1>` that the template does not render, so `npm test` is not green out of the box. Be aware before claiming "tests pass".
- Default style is SCSS (configured in [angular.json](uniplanWeb/angular.json)). The Material theme is `azure-blue` (prebuilt).
- TypeScript runs in strict mode plus `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noFallthroughCasesInSwitch`. Angular templates run with `strictTemplates` + `strictInputAccessModifiers`. Don't loosen these.
- Code is currently a mix of `*ngIf` / `*ngFor` (legacy) and could be migrated to the new `@if` / `@for` control-flow syntax — but until the codebase has been swept end-to-end, follow the surrounding file's style rather than mixing both in one template.
- The codebase contains user-facing strings in Bulgarian (e.g. student data, `'редовно'` / `'задочно'` literals in [student-elm.ts](uniplanWeb/src/app/core/interfaces/student-elm.ts)). Don't translate these without confirmation — they are domain values, not UI copy.

## Coding Conventions

Detailed rules live in [.claude/rules/](.claude/rules/) and are loaded by reviewer agents and CI:

- [.claude/rules/frontend.md](.claude/rules/frontend.md) — Angular 20 / Material 20 architecture, RxJS state, accessibility, security, SCSS, anti-patterns, Karma testing.
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

`.github/CODEOWNERS` assigns everything to `@uni-dev-lab/reviewers`. The only GitHub Actions workflow today is the gated PR-review workflow above.
