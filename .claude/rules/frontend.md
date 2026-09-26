# Frontend Rules — Angular 20 / TypeScript 5 / Angular Material 20

## On-demand Skills

Invoke these skills via the `Skill` tool **only when the task actually calls for them** — do not auto-load them for every frontend edit. The project frontend reviewer agent already carries the distilled ruleset.

- `web-design-guidelines` — explicit accessibility or UI audits.

## Stack

- Angular 20 (standalone components, no NgModules anywhere)
- Angular Material 20 + CDK (theme: `azure-blue` prebuilt)
- RxJS 7.8 — Observables/Subjects for async + cross-component state. **No TanStack Query, no Redux, no Zustand, no Signals (yet).**
- TypeScript 5.8 in `strict` mode plus `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noFallthroughCasesInSwitch`. Angular templates run with `strictTemplates` + `strictInputAccessModifiers`.
- Karma 6 + Jasmine 5 for unit tests. **No e2e runner is configured** — the README mentions `ng e2e` but no framework is wired up.
- SCSS for styles. Selector prefix `app-`.
- No router-based navigation in the current codebase (see Architecture below).
- No i18n (English-only UI; some seeded domain strings are Bulgarian — see "Content & Typography").
- No auth integration in production code. `LoginAuthService` is a `localStorage` stub.

## Project Structure

```
uniplanWeb/                        # All Angular code lives here, not at repo root
├── src/
│   ├── main.ts                   # bootstrapApplication(App, appConfig)
│   ├── styles.scss               # global styles
│   └── app/
│       ├── app.{ts,html,scss}    # root component
│       ├── app.config.ts         # providers (router, http)
│       ├── app.routes.ts         # currently a single "" → LayoutComponent route
│       ├── core/
│       │   ├── interfaces/       # <Entity> types in <entity>.ts
│       │   └── shared/           # cross-feature UI shells (add-form, edit-form,
│       │                         # delete-form, filters-form, input-filter,
│       │                         # add-button, main-panel, navmenu-component)
│       ├── features/
│       │   ├── faculty/          # *-options, *-table, *-add-form, *-edit-form,
│       │   ├── major/            # *-delete-form, *-filters, faculty-service.ts
│       │   ├── student/
│       │   └── university/
│       └── services/             # cross-cutting services (auth stub, etc.)
├── angular.json
├── package.json
└── tsconfig.json
```

All `npm` / `ng` commands run from `uniplanWeb/`, not the repo root.

## File & Class Naming

- File and folder names are **kebab-case** and match the component selector minus the `app-` prefix:
  `app-faculty-add-form` ↔ `faculty-add-form/faculty-add-form.ts`.
- Class names are **PascalCase without the `Component` / `Service` suffix**:
  `FacultyAddForm` (not `FacultyAddFormComponent`), `MajorService` (not `MajorServiceService`).
- Feature service files are named `<feature>-service.ts` (single hyphen), not `<feature>.service.ts` — this is intentional and predates Angular's default. **Do not "fix" it.**
- Domain interface files are named `<entity>.ts` and export `<Entity>` (e.g. `student-profile.ts` → `StudentProfile`, `lector-profile.ts` → `LectorProfile`). One existing exception is `UniversityElm` co-located in `university-service.ts`.
- Test files live alongside source as `*.spec.ts`.

## Component Conventions

- **Every component must declare `standalone: true`** with an explicit `imports: []`. **Do not introduce `NgModule`s** — there are none in the codebase.
- Use `default` route + `*-table` / `*-options` / `*-{add,edit,delete}-form` / `*-filters` decomposition for new features (mirror `features/major/`).
- Selector prefix is `app-`. Default style language is SCSS (configured in `angular.json`).
- Shared form skeletons live in `core/shared/{add,edit,delete}-form/` and expose an `@Output() saveClicked` that the feature-specific dialog wires to its own `save()`. Wrap the skeleton; do not inline its template.
- Dialogs use `MatDialog` with width `'400px'`, data passed via `MAT_DIALOG_DATA`, result returned via `MatDialogRef.close(value)`.

### Component placement

- **`core/shared/`** — cross-feature primitives (form skeletons, the layout panel, the navmenu, generic table). No feature-specific logic here.
- **`features/<feature>/`** — every feature owns its options bar, table, dialog forms, filters bar, and service in a flat directory.
- **No barrel `index.ts` files.** Import directly from the source path.
- **No re-export shims** between features — if feature A needs a type from feature B's interface file, import from `core/interfaces/<entity>.ts` directly.

## View Switching (project-specific)

The Angular Router has a single `""` route → `LayoutComponent`; in-app navigation is **not** routed. Instead:

- [`ViewService`](../../uniplanWeb/src/app/core/shared/main-panel/view.service.ts) holds a `BehaviorSubject<string>` (current view: `'home' | 'faculty' | 'major' | 'student'`).
- `NavmenuComponent` calls `viewService.setView(...)` from click handlers.
- `MainPanel` subscribes to `currentView$` and switches feature panels with `*ngIf="currentView === 'X'"`.

**To add a new feature view:** register the string in `ViewService`, add a click handler in `NavmenuComponent`, add an `*ngIf` block in `main-panel.html`. Do **not** add it to `app.routes.ts` unless you intend to migrate everything to the router (which is a separate decision). Future router migration is acceptable but must be done end-to-end, not piecemeal.

## State Management — RxJS

There is no TanStack Query / Redux / Zustand / Signals layer. Cache invalidation is handled by an explicit `refreshNeeded` Subject in each feature service.

### `refreshNeeded` Subject pattern (project contract)

Each feature service exposes:

```typescript
refreshNeeded = new Subject<void>();
```

Mutating methods (`create*`, `edit*`, `delete*`) **must** call `this.refreshNeeded.next()` after the HTTP response, inside a `map`:

```typescript
createFaculty(faculty: { ... }): Observable<FacultyElm> {
  return this.http.post<FacultyElm>(this.apiUrl, faculty).pipe(
    map((res) => {
      this.refreshNeeded.next();
      return res;
    }),
  );
}
```

Tables and panels subscribe to it in `ngOnInit` and refetch their data on emission. **When adding a new mutation, preserve this contract** or filters/tables will go stale silently.

### Subscription hygiene

- Always unsubscribe from long-lived Subjects in `ngOnDestroy`, or use `takeUntilDestroyed()` (Angular 16+) or the `async` pipe in templates.
- The codebase currently has bare `.subscribe()` calls without unsubscribe in several components (e.g. `MainPanel`, `MajorTable`). **Do not introduce more.** If you touch one of these files, opportunistically fix the subscription leak in the lines you're modifying.
- Prefer the `async` pipe in templates over manually calling `.subscribe()` in the component class when the data is only consumed by the template.

### HTTP

- Backend URLs are currently **hardcoded to `http://localhost:8080/...`** in each service. There is no environment file. If you need to change the API base, propose an `environments/` setup in the PR description rather than hardcoding a different URL.
- Always type the response: `this.http.get<FacultyElm[]>(...)`. Never use `any`.

## Conditional Rendering & Templates

- The codebase mixes legacy `*ngIf` / `*ngFor` with the new Angular 17+ `@if` / `@for` control-flow syntax. **Match the surrounding file's style** — do not mix both in one template. A repo-wide migration is its own task.
- For event-handler bindings on non-interactive elements: don't. Use `<button>` / `<a>` (see Accessibility).
- Avoid `[innerHTML]` for any user-derived string. If you must render HTML, sanitize via `DomSanitizer` and add a comment explaining the source of the HTML.
- Note: the React-specific `{condition && <JSX>}` falsy-leak rule does not apply here. Angular templates evaluate `*ngIf="value"` as boolean coercion and never render the `0`/`""` literal.

## Forms

- For dialog-style add/edit/delete flows, wrap the shared `AddForm` / `EditForm` / `DeleteForm` in `core/shared/` and bind your component's `save()` to its `(saveClicked)` output. Do not duplicate the dialog chrome.
- Validation: **do not use `alert(...)` for validation feedback.** Existing code does this in some places; do not add more. Use `MatError` inside a `MatFormField` driven by a `FormControl` validator, or surface inline error UI in the form skeleton.
- Prefer Reactive Forms (`FormControl` / `FormGroup` / `FormBuilder`) for any form with more than one field or any validation. Template-driven forms (`[(ngModel)]`) are acceptable for trivial single-field dialogs.

## Accessibility

(Framework-agnostic.)

- Semantic HTML: `<main>`, `<nav>`, `<section>`, `<article>`. Don't use `<div>` for things that should be landmarks.
- Use `<button>` for actions, `<a [routerLink]>` for navigation. **Never** put click handlers on a bare `<div>` or `<span>`.
- Every `<img>` must have an `alt`. Decorative images get `alt=""`.
- Icon-only buttons need `aria-label` (Material `<button mat-icon-button>` included).
- Form controls need an associated `<label>` (`MatLabel` inside `MatFormField` is fine).
- Keep the focus ring. Do not write `outline: none` without supplying a visible `:focus-visible` replacement.
- Honor `prefers-reduced-motion` on any animation longer than ~200 ms.

## Security

- **Never use `[innerHTML]` with user-supplied or backend-supplied content** without `DomSanitizer.bypassSecurityTrustHtml`-with-explicit-justification.
- **Never call `bypassSecurityTrust*` on user input.** It exists for app-controlled HTML only.
- Tokens/PII must not be logged via `console.log` / `console.error`. The codebase has stray `console.log` / `console.error` calls — clean them up in any file you touch.
- The auth flow is a `localStorage` stub today. **Do not add token-handling logic that assumes a real auth provider** without first introducing the provider itself; placeholder code that "looks like auth" is worse than no code.
- API URLs are hardcoded; don't commit a different one accidentally during testing.

## Styling — SCSS + Angular Material

The styling layer is plain SCSS plus Angular Material. There is no Tailwind CSS, no DaisyUI, no shadcn. RTL / logical-property rules don't apply (single-locale UI).

- Component styles live in `<component>.scss` next to the template. Per-component-style budgets are 4 kB warn / 8 kB error (configured in `angular.json`) — keep components small.
- Use Angular Material primitives over hand-rolled equivalents: `MatButton`, `MatIcon`, `MatTable`, `MatDialog`, `MatFormField`, `MatSelect`, `MatInputModule`, `MatSlideToggle`.
- The Material theme is the `azure-blue` prebuilt (configured in `angular.json` `styles[]`). Do not import a second theme.
- **Never `transition: all`** — list properties explicitly. Prefer animating `transform` / `opacity` (GPU-accelerated).
- For conditional styling, prefer `[ngClass]` / `[class.foo]="bar"` over manipulating `classList` imperatively.
- Use `tabular-nums` (`font-variant-numeric: tabular-nums`) on numbers compared visually (counts, faculty numbers, etc.).

## Performance

- **Derive in the template, don't store** — when a value is computed from inputs, prefer a getter or pure pipe over duplicating it into a field set in `ngOnChanges`. Existing code uses both styles; pick the lighter one for new work.
- Heavy lists should use `trackBy` on `*ngFor` / `track` on `@for`.
- Lazy-load feature areas via `loadComponent` in routes once routing is reintroduced. Until then, this is N/A.
- Production budgets: initial bundle 500 kB warn / 1 MB error. Keep this in mind when adding dependencies.
- `provideZoneChangeDetection({ eventCoalescing: true })` is enabled — don't remove it.

## TypeScript

- Strict mode + `noImplicitOverride` + `noPropertyAccessFromIndexSignature` + `noImplicitReturns` + `noFallthroughCasesInSwitch` are on. Don't loosen them in `tsconfig.json`.
- **No `any`.** If a backend payload's shape is unclear, model it as `unknown` and narrow with a type guard.
- **No `!` non-null assertions on values that come from inputs, route params, or HTTP responses.** Use a default (`?? ''` / `?? []`) or an explicit guard. `!` is acceptable only for genuinely-unreachable cases inside the same function.
- Use `interface` for object shapes (DTOs, domain entities), `type` for unions / intersections.
- Prefer `Observable<T>` over `Promise<T>` for HTTP because the rest of the codebase pipes through RxJS — converting between the two is friction.

## Anti-patterns to flag in review

- Reintroducing an `NgModule` (no module-based components remain).
- Hardcoding a URL in a component instead of going through a feature service.
- Mutating service state without firing `refreshNeeded.next()`.
- Bare `.subscribe()` without unsubscribe and without `async` pipe in template (in new code).
- `alert(...)` for validation errors.
- `console.log` / `console.error` left in committed code.
- `any` in a public method signature.
- `!` non-null assertions on inputs / route params / HTTP responses.
- `[innerHTML]` with non-static content.
- `<div (click)>` instead of `<button>` for an action.
- Missing `aria-label` on `mat-icon-button`.
- A new feature added to `app.routes.ts` while the rest of the codebase still uses `ViewService` view switching (mismatched paradigms).
- Mixing `*ngIf` / `*ngFor` with `@if` / `@for` in the same template.
- A new feature service named `<feature>.service.ts` (with the dot) instead of `<feature>-service.ts` — break of project convention.
- Class named `FooComponent` — repo convention is `Foo` (no suffix).

## Content & Typography

- Some seeded domain strings are Bulgarian (e.g. `'редовно'` / `'задочно'` in `student-elm.ts`, student names in `student-table.ts`). **Do not translate these without confirmation** — they are domain values, not UI copy.
- Use the Unicode ellipsis `…` (not `...`) in loading states.
- Specific button labels: "Save", "Delete", "Add Faculty" — not "Submit" / "OK".
- Every list must have an empty state.

## Build & Verify

Run from `uniplanWeb/`:

```bash
npm ci                     # Install dependencies
npm start                  # Dev server (http://localhost:4200) — = ng serve
npm run build              # Production build — must pass with 0 errors
npm test -- --watch=false --browsers=ChromeHeadless --reporters=dots   # CI-style test run
```

There is no lint script, no `doctor`, and no e2e command. **Some existing `*.spec.ts` files are stubs and `app.spec.ts` is currently broken** — `npm test` is not green out of the box. Be aware before claiming "tests pass".

## Testing

- Unit tests use Karma + Jasmine with `describe` / `it` / `beforeEach` / `expect`. Tests live next to source as `*.spec.ts`.
- Use `TestBed.configureTestingModule({ imports: [Component] })` for standalone components.
- Mock services with `jasmine.createSpyObj` and provide them via `{ provide: ServiceClass, useValue: spy }`.
- For HTTP: use `HttpClientTestingModule` and `HttpTestingController` to assert request URL/method/body and supply a response.
- For dialogs: spy on `MatDialog.open` rather than rendering the dialog.
- **Value-based assertions over presence-only.** `expect(el.textContent).toContain('Faculty A')` beats `expect(el).toBeTruthy()`.
- Cover the empty / loading / error / happy paths for any component that fetches data.
