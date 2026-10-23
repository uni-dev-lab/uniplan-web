# Frontend Rules — Angular 22 / TypeScript 6 / Angular Material 22

## On-demand Skills

Invoke these skills via the `Skill` tool **only when the task actually calls for them** — do not auto-load them for every frontend edit. The project frontend reviewer agent already carries the distilled ruleset.

- `web-design-guidelines` — explicit accessibility or UI audits.

## Stack

- Angular 22 (standalone components by default, no NgModules anywhere)
- Angular Material 22 + CDK (theme: `azure-blue` prebuilt)
- RxJS 7.8 — Observables/Subjects for async + cross-component state. **No TanStack Query, no Redux, no Zustand.** Angular `signal()` is used for local component state in some tables (e.g. `MajorTable`); cross-component state still goes through RxJS services.
- TypeScript 6 in `strict` mode plus `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noFallthroughCasesInSwitch`. Angular templates run with `strictTemplates` + `strictInputAccessModifiers`.
- Karma 6 + Jasmine 6 for unit tests. **No e2e runner is configured** — the README mentions `ng e2e` but no framework is wired up.
- ESLint (`angular-eslint` + `typescript-eslint`) via `npm run lint`, config in `uniplanWeb/eslint.config.js`.
- SCSS for styles. Selector prefix `app-`.
- Angular Router with lazy-loaded feature pages (see Routing below).
- i18n via `@ngx-translate/core` — default and fallback language `bg`, second language `en` (see i18n below).
- No auth integration in production code. `LoginAuthService` is a `localStorage` stub.

## Project Structure

```
uniplanWeb/                        # All Angular code lives here, not at repo root
├── public/
│   └── i18n/{bg,en}.json         # translation files
├── src/
│   ├── main.ts                   # bootstrapApplication(App, appConfig)
│   ├── styles.scss               # global styles
│   ├── environments/
│   │   └── environment.ts        # baseUrl for the backend API
│   ├── testing/
│   │   └── translate-testing.ts  # translateTestingProviders (alias @testing/*)
│   └── app/
│       ├── app.{ts,html,scss}    # root component
│       ├── app.config.ts         # providers (router, http, translate, zone CD)
│       ├── app.routes.ts         # "" → LayoutComponent with lazy child routes
│       ├── config/
│       │   └── endpoints.ts      # API_ENDPOINTS map built from environment.baseUrl
│       ├── layout-component/     # app shell: navmenu + <router-outlet>
│       ├── core/
│       │   ├── interfaces/       # <Entity>Elm types in <entity>-elm.ts,
│       │   │                     # view models, filter-option types
│       │   └── shared/           # cross-feature UI (add-form, edit-form,
│       │                         # delete-form, filters-form, input-filter,
│       │                         # add-button, navmenu-component, settings,
│       │                         # pipes/faculty-name-pipe)
│       ├── features/
│       │   ├── faculty/          # *-panel, *-options, *-table, *-add-form,
│       │   ├── major/            # *-edit-form, *-delete-form, *-filters,
│       │   ├── room/             # <feature>-service.ts
│       │   ├── student/
│       │   ├── university/       # service only
│       │   ├── home/             # panel only
│       │   └── not-found/        # panel only (** route)
│       └── services/             # cross-cutting services (auth stub, etc.)
├── angular.json
├── eslint.config.js
├── package.json
└── tsconfig.json
```

All `npm` / `ng` commands run from `uniplanWeb/`, not the repo root.

## File & Class Naming

- File and folder names are **kebab-case** and match the component selector minus the `app-` prefix:
  `app-faculty-add-form` ↔ `faculty-add-form/faculty-add-form.ts`.
- Class names are **PascalCase without the `Component` / `Service` suffix**:
  `FacultyAddForm` (not `FacultyAddFormComponent`), `MajorService` (not `MajorServiceService`). Legacy exceptions: `NavmenuComponent`, `LayoutComponent` — don't copy them.
- Feature service files are named `<feature>-service.ts` (single hyphen), not `<feature>.service.ts` — this is intentional and predates Angular's default. **Do not "fix" it.**
- Domain interface files end in `-elm.ts` and export `<Entity>Elm` (e.g. `major-elm.ts` → `MajorElm`). One existing exception is `UniversityElm` co-located in `university-service.ts`. (Issue #87 proposes dropping the `Elm` suffix; until it lands, keep the current naming.)
- Test files live alongside source as `*.spec.ts`.

## Component Conventions

- Components are **standalone by default** in Angular 22. **Do not add `standalone: true`** — it was removed repo-wide (#19); a few older files in `core/shared/` still carry it and may be cleaned up when touched. Always declare an explicit `imports: []`. **Do not introduce `NgModule`s.**
- Use `inject()` for dependencies — not constructor-parameter injection.
- Decompose new features like `features/faculty/` / `features/major/`: `*-panel` (routed page) + `*-options` / `*-table` / `*-{add,edit,delete}-form` / `*-filters`.
- Selector prefix is `app-`. Default style language is SCSS (configured in `angular.json`).
- Existing components use `@Input()` / `@Output()` decorators. Migrating to `input()` / `output()` signal functions is tracked in #15 / #23 — match the surrounding feature until that migration lands; don't mix both styles in one component.
- Many components set `changeDetection: ChangeDetectionStrategy.Eager`. Follow the surrounding feature for new components.
- Shared form skeletons live in `core/shared/{add,edit,delete}-form/` and expose a `saveClicked` output that the feature-specific dialog wires to its own `save()`. Wrap the skeleton; do not inline its template.
- Dialogs use `MatDialog` with width `'400px'`, data passed via `MAT_DIALOG_DATA`, result returned via `MatDialogRef.close(value)`.
- To show a related entity's name instead of its id, use a pure pipe (see `FacultyNamePipe` in `core/shared/pipes/`).

### Component placement

- **`core/shared/`** — cross-feature primitives (form skeletons, navmenu, settings, pipes). No feature-specific logic here.
- **`features/<feature>/`** — every feature owns its panel, options bar, table, dialog forms, filters bar, and service in a flat directory.
- **No barrel `index.ts` files.** Import directly from the source path.
- **No re-export shims** between features — if feature A needs a type from feature B's interface file, import from `core/interfaces/<entity>-elm.ts` directly.

## Routing (project-specific)

Navigation uses the Angular Router. `app.routes.ts` has one parent route `""` → `LayoutComponent` (navmenu + `<router-outlet>`). Feature pages are **lazy-loaded children** via `loadComponent`: `home`, `faculty`, `major`, `student`, `room`, plus a `**` → `NotFoundPanel` fallback. `""` redirects to `home`.

**To add a new feature page:**

1. Create `features/<feature>/<feature>-panel/`.
2. Add a child route in `app.routes.ts` with `loadComponent: () => import(...).then(m => m.<Feature>Panel)` — copy the `room` entry and keep it **before** the `**` wildcard.
3. Add a nav link in `navmenu-component.html`: `<a [routerLink]="'/<feature>'" routerLinkActive="active" class="nav-link">`. Some items (Department, Teachers, Subjects, Settings, Login) are still placeholder `href="#"` links — replace the placeholder instead of adding a duplicate.

Do not reintroduce view-switching via a service or `@if` blocks in a layout template — the old `ViewService` / `MainPanel` approach was removed (#27).

## State Management — RxJS

There is no TanStack Query / Redux / Zustand layer. Cache invalidation is handled by an explicit `refreshNeeded` Subject in each feature service.

### `refreshNeeded` Subject pattern (project contract)

Each feature service exposes:

```typescript
refreshNeeded = new Subject<void>();
```

Mutating methods (`create*`, `edit*`, `delete*`) **must** call `this.refreshNeeded.next()` after the HTTP response, inside a `map` or `tap`:

```typescript
createFaculty(faculty: { ... }): Observable<void> {
  return this.http.post<void>(API_ENDPOINTS.faculties, faculty).pipe(
    tap(() => this.refreshNeeded.next()),
  );
}
```

Tables and panels subscribe to it and refetch their data on emission. The preferred shape (see `MajorPanel`) is:

```typescript
merge(of(undefined), this.service.refreshNeeded).pipe(
  switchMap(() => this.service.getAll()),
  takeUntilDestroyed(this.destroyRef),
).subscribe(...);
```

**When adding a new mutation, preserve this contract** or filters/tables will go stale silently.

### Subscription hygiene

- Use `takeUntilDestroyed()` or the `async` pipe in templates for long-lived subscriptions.
- Some older components still have bare `.subscribe()` calls on `refreshNeeded` without cleanup (e.g. `MajorTable`). **Do not introduce more.** If you touch one of these files, fix the subscription leak in the lines you're modifying.
- Prefer the `async` pipe in templates over manually calling `.subscribe()` in the component class when the data is only consumed by the template.

### HTTP

- The API base URL lives in `src/environments/environment.ts` (`baseUrl: 'http://localhost:8080/api'`). Every resource URL is defined in `src/app/config/endpoints.ts` as `API_ENDPOINTS.<resource>`. **Services must use `API_ENDPOINTS`; never hardcode a URL** in a service or component. When wiring a new backend resource, add its entry to `endpoints.ts` first.
- HTTP calls belong in the feature service, never directly in a component.
- Always type the response: `this.http.get<FacultyElm[]>(...)`. Some backend create/update endpoints (faculties, universities, categories) return no body — type those as `Observable<void>`.
- No `any`. `@typescript-eslint/no-explicit-any` is temporarily `"warn"` while backend DTOs settle (#99); treat new `any` as a defect anyway.
- The backend has no CORS configuration and there is no dev-server proxy — if calls fail in the browser with a CORS error, that's an environment problem, not a reason to change URLs.

## i18n

- UI text is translated with `@ngx-translate/core` (`provideTranslateService` in `app.config.ts`, files loaded from `/i18n/<lang>.json`). The `Settings` component switches language via `TranslateService.use(...)`.
- Templates use the `translate` pipe: `{{ 'navmenu.home' | translate }}`, also for attributes: `[attr.aria-label]="'features.edit' | translate"`. In code use `TranslateService.instant(...)` (e.g. snackbar messages).
- **Every new user-facing string must have a key in both `public/i18n/bg.json` and `public/i18n/en.json`.** No hardcoded UI copy in templates or `.ts` files.
- Reuse the shared `features.*` keys (`features.number-label`, `features.actions-label`, `features.edit`, `features.delete`, …) before adding feature-specific duplicates.
- Specs for components that use the `translate` pipe must include `...translateTestingProviders` (from `@testing/translate-testing`) in `providers`.

## Conditional Rendering & Templates

- Use the built-in control flow `@if` / `@for` / `@switch`. `*ngIf` / `*ngFor` were removed repo-wide (#20) — **do not reintroduce them.**
- `@for` must have a `track` expression (`track item.id` where possible).
- For event-handler bindings on non-interactive elements: don't. Use `<button>` / `<a>` (see Accessibility).
- Avoid `[innerHTML]` for any user-derived string. If you must render HTML, sanitize via `DomSanitizer` and add a comment explaining the source of the HTML.

## Forms

- For dialog-style add/edit/delete flows, wrap the shared `AddForm` / `EditForm` / `DeleteForm` in `core/shared/` and bind your component's `save()` to its `(saveClicked)` output. Do not duplicate the dialog chrome.
- Validation: **do not use `alert(...)` for validation feedback.** Existing code does this in some places (e.g. `student-add-form`); do not add more. Use `MatError` inside a `MatFormField` driven by a `FormControl` validator, and a `MatSnackBar` for success/failure of the HTTP call (see `room-add-form`).
- Use Reactive Forms (`FormControl` / `FormGroup` / `FormBuilder`) for new forms — `room-add-form` is the reference. Several older forms are still template-driven (`[(ngModel)]`); migrating them is tracked in #17.
- Mirror the backend's validation rules (required, max length, min/max numbers, email) in the form validators so the user sees errors before the request is sent.

## Accessibility

(Framework-agnostic.)

- Semantic HTML: `<main>`, `<nav>`, `<section>`, `<article>`. Don't use `<div>` for things that should be landmarks.
- Use `<button>` for actions, `<a [routerLink]>` for navigation. **Never** put click handlers on a bare `<div>` or `<span>`.
- Every `<img>` must have an `alt`. Decorative images get `alt=""`.
- Icon-only buttons need `aria-label` (Material `<button mat-icon-button>` included), translated via the `translate` pipe.
- Form controls need an associated `<label>` (`MatLabel` inside `MatFormField` is fine).
- Keep the focus ring. Do not write `outline: none` without supplying a visible `:focus-visible` replacement.
- Honor `prefers-reduced-motion` on any animation longer than ~200 ms.

## Security

- **Never use `[innerHTML]` with user-supplied or backend-supplied content** without `DomSanitizer.bypassSecurityTrustHtml`-with-explicit-justification.
- **Never call `bypassSecurityTrust*` on user input.** It exists for app-controlled HTML only.
- Tokens/PII must not be logged via `console.log` / `console.error`. The codebase has stray `console.log` / `console.error` calls — clean them up in any file you touch.
- The auth flow is a `localStorage` stub today. **Do not add token-handling logic that assumes a real auth provider** without first introducing the provider itself; placeholder code that "looks like auth" is worse than no code.
- Don't commit a changed `environment.ts` `baseUrl` from local testing.

## Styling — SCSS + Angular Material

The styling layer is plain SCSS plus Angular Material. There is no Tailwind CSS, no DaisyUI, no shadcn. RTL / logical-property rules don't apply (both UI languages are LTR).

- Component styles live in `<component>.scss` next to the template. Per-component-style budgets are 4 kB warn / 8 kB error (configured in `angular.json`) — keep components small. Shared panel styles live in `src/styles/_panel.scss`.
- Use Angular Material primitives over hand-rolled equivalents: `MatButton`, `MatIcon`, `MatTable`, `MatDialog`, `MatFormField`, `MatSelect`, `MatInputModule`, `MatSlideToggle`, `MatSnackBar`.
- The Material theme is the `azure-blue` prebuilt (configured in `angular.json` `styles[]`). Do not import a second theme.
- **Never `transition: all`** — list properties explicitly. Prefer animating `transform` / `opacity` (GPU-accelerated).
- For conditional styling, prefer `[ngClass]` / `[class.foo]="bar"` over manipulating `classList` imperatively.
- Use `tabular-nums` (`font-variant-numeric: tabular-nums`) on numbers compared visually (counts, faculty numbers, etc.).

## Performance

- **Derive in the template, don't store** — when a value is computed from inputs, prefer a getter, `computed()` or a pure pipe over duplicating it into a field set in `ngOnChanges`. Existing code uses several styles; pick the lighter one for new work.
- Heavy lists should use a stable `track` on `@for`.
- Every feature page must be lazy-loaded via `loadComponent` in `app.routes.ts` — don't import feature panels eagerly.
- Production budgets: initial bundle 500 kB warn / 1 MB error. Keep this in mind when adding dependencies.
- `provideZoneChangeDetection({ eventCoalescing: true })` is enabled — don't remove it.

## TypeScript

- Strict mode + `noImplicitOverride` + `noPropertyAccessFromIndexSignature` + `noImplicitReturns` + `noFallthroughCasesInSwitch` are on. Don't loosen them in `tsconfig.json`.
- **No `any`.** If a backend payload's shape is unclear, model it as `unknown` and narrow with a type guard, or check the DTO in the backend's Swagger UI (`http://localhost:8080/api/swagger-ui.html`).
- Interfaces must mirror the backend response DTO field names exactly (e.g. `facultyName`, `uniName`, `courseSubtype`).
- **No `!` non-null assertions on values that come from inputs, route params, or HTTP responses.** Use a default (`?? ''` / `?? []`) or an explicit guard. `!` is acceptable only for genuinely-unreachable cases inside the same function.
- Use `interface` for object shapes (DTOs, domain entities), `type` for unions / intersections.
- Prefer `Observable<T>` over `Promise<T>` for HTTP because the rest of the codebase pipes through RxJS — converting between the two is friction.

## Anti-patterns to flag in review

- Reintroducing an `NgModule`.
- Adding `standalone: true` to a new component (redundant in Angular 22).
- Constructor-parameter injection instead of `inject()`.
- Hardcoding a URL (in a component or a service) instead of using `API_ENDPOINTS` from `config/endpoints.ts`.
- HTTP calls made directly from a component instead of a feature service.
- Mutating service state without firing `refreshNeeded.next()`.
- Bare `.subscribe()` without `takeUntilDestroyed()` / unsubscribe and without `async` pipe in template (in new code).
- A new feature page that isn't a lazy-loaded route in `app.routes.ts`, or view switching via a service / `@if` in the layout instead of the router.
- A new nav link using `href="#"` or `(click)` instead of `[routerLink]` + `routerLinkActive`.
- Hardcoded user-facing text instead of a translation key, or a key added to only one of `bg.json` / `en.json`.
- `*ngIf` / `*ngFor` (removed repo-wide), or `@for` without `track`.
- `alert(...)` for validation errors.
- `console.log` / `console.error` left in committed code.
- `any` in a public method signature.
- `!` non-null assertions on inputs / route params / HTTP responses.
- `[innerHTML]` with non-static content.
- `<div (click)>` instead of `<button>` for an action.
- Missing `aria-label` on `mat-icon-button`.
- A new feature service named `<feature>.service.ts` (with the dot) instead of `<feature>-service.ts` — break of project convention.
- Class named `FooComponent` — repo convention is `Foo` (no suffix).

## Content & Typography

- Some domain values are Bulgarian (e.g. `'редовно'` / `'задочно'` in `student-elm.ts`, `'бакалавър'` / `'магистър'` course types, seeded student names in `student-table.ts`). **Do not translate these without confirmation** — they are domain values stored in the backend, not UI copy.
- Use the Unicode ellipsis `…` (not `...`) in loading states.
- Specific button labels: "Save", "Delete", "Add Faculty" — not "Submit" / "OK" (and their `bg.json` equivalents).
- Every list must have an empty state (`*matNoDataRow` in Material tables).

## Build & Verify

Run from `uniplanWeb/`:

```bash
npm ci                     # Install dependencies
npm start                  # Dev server (http://localhost:4200) — = ng serve
npm run lint               # ESLint — must pass with 0 errors
npm run build              # Production build — must pass with 0 errors
npm test -- --no-watch --browsers=ChromeHeadless --reporters=dots   # CI-style test run
```

CI (`.github/workflows/ci.yml`) runs `npm ci` → `npm run lint` → `npm run test -- --no-watch --no-progress --browsers=ChromeHeadless --code-coverage` → `npm run build` on every PR against `main`; all steps must pass. There is no `doctor` and no e2e command. Most existing `*.spec.ts` files are scaffolds that only assert creation — run the suite before claiming "tests pass".

## Testing

- Unit tests use Karma + Jasmine with `describe` / `it` / `beforeEach` / `expect`. Tests live next to source as `*.spec.ts`.
- Use `TestBed.configureTestingModule({ imports: [Component], providers: [...translateTestingProviders] })` for standalone components that render translated text.
- Mock services with `jasmine.createSpyObj` and provide them via `{ provide: ServiceClass, useValue: spy }`.
- For HTTP: use `provideHttpClient()` + `provideHttpClientTesting()` and `HttpTestingController` to assert request URL/method/body and supply a response. Assert URLs against `API_ENDPOINTS`, not string literals.
- For routed components, provide `provideRouter([])` when the template uses `routerLink`.
- For dialogs: spy on `MatDialog.open` rather than rendering the dialog.
- **Value-based assertions over presence-only.** `expect(el.textContent).toContain('Faculty A')` beats `expect(el).toBeTruthy()`.
- Cover the empty / loading / error / happy paths for any component that fetches data.
