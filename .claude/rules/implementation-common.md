# Implementation Common Rules

Orchestrator + fix-agent shared conventions. Rules that belong to one specific agent (TDD flows, Done Checklist, reviewer checklists, output formats, severity calibration) live in that agent's system prompt — do not duplicate them here. Triage Principles stay here because the orchestrator reads them to audit fix-agent output, and the fix agent applies them when processing reviewer findings.

Read this file once at session start.

## Term Semantics

- **Pre-existing code/changes** — code that was already in `main` when the current feature branch diverged. Code newly added on the feature branch is never pre-existing, even after it has been committed on the branch.

## Shared Artifact Coordination

When BE and FE agents work in parallel on the same feature:

**The plan must explicitly define API contracts** (routes, HTTP methods, request/response DTOs, status codes). If vague, resolve before spawning agents.

**Backend owns (writes first):**
- Database migrations and seed data (including e2e seed SQL)
- API contracts: controller endpoints, request/response DTOs
- Backend entity definitions that inform frontend types

**Frontend consumes (writes after backend):**
- TypeScript types/interfaces mirroring backend DTOs
- API service hooks calling backend endpoints
- E2E test data expectations (values only — seed files are BE-owned)

Coordination rule: backend writes shared artifacts first. Frontend reads backend's output and adapts.

> **Note for this repo:** there is no backend in this repository. The frontend talks to a Spring Boot service hosted out-of-tree at `http://localhost:8080/...`. The "BE owns / FE consumes" rule is captured here for future ports; in this repo, treat the external API as fixed and adapt the FE.

## Triage Principles (fix agent)

Before fixing any reviewer findings:

1. **Read all reviewer outputs** for the current round.
2. **Deduplicate** — multiple findings may be symptoms of one root cause.
3. **Dismiss** findings that are incorrect, already addressed, or represent valid intentional choices. Each dismissal must record:
   - Finding reference (reviewer, round, finding number)
   - Clear rationale with evidence (rules file section, codebase pattern, plan decision)
4. **Prioritize** non-dismissed findings: Critical first; root cause over symptom patches; architectural fixes before surface fixes.
5. If reviewers contradict each other, resolve by referencing rules files and existing codebase patterns.
6. **Suggestions** are notes, not actions — do not fix unless trivial.

**Dismissal guardrail.** If >50% of findings in a round are dismissed, pause and reassess. Either reviewers are miscalibrated or dismissals are too aggressive.

**Abort threshold.** 5+ Critical findings in a single round:
1. Group by root cause. If 3+ share a root cause, fix the root cause.
2. Discard and restart implementation only if criticals are diverse across subsystems.
3. Never discard without analysis.

## Flaky Test Rule

If a test fails intermittently (passes on re-run without code changes), re-run up to 2 times to confirm. If still intermittent, mark it flaky in the final report — do not mask it with retries or relaxed assertions.

## Test Output Hygiene

Every agent that runs tests must use quiet modes by default. Verbose output wastes 50–200K tokens per run.

| Command | Default | When to use verbose |
|---------|---------|---------------------|
| Angular CLI build | `npm run build` (already non-interactive) | Only re-run with `--verbose` for a specific failure |
| Karma unit tests (single run) | `npm test -- --watch=false --browsers=ChromeHeadless --reporters=dots` | Switch to `--reporters=progress` (default) for a specific failing spec |
| Karma single spec | `npm test -- --watch=false --browsers=ChromeHeadless --reporters=dots --include='**/<spec>.spec.ts'` | Drop `--include` only when the failure may span multiple specs |

Never pipe a full test run's output back to the caller agent — return a digest: pass/fail/skip counts + the failure blocks only. Full output is for targeted debugging, not routine verification.

## Stall Detection

If an agent runs 3 full test cycles without progress (same tests failing, same errors), stop and report the blocker. Do not loop indefinitely.
