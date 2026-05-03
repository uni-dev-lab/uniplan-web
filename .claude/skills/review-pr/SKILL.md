---
name: review-pr
description: Review a GitHub pull request by creating a local worktree and dispatching the uniplan-web-fe-reviewer subagent
disable-model-invocation: true
argument-hint: <pr-number>
---

You are orchestrating a review of a GitHub pull request. The PR number is: $ARGUMENTS

Your role is a **thin dispatcher**: fetch PR metadata, prepare the worktree, classify the diff, spawn the `uniplan-web-fe-reviewer` subagent against the frontend slice, review the Other slice yourself, and merge findings into one review. Do not perform the frontend review yourself — the subagent pre-loads project rules and produces the FE findings.

This is a single-domain (frontend-only) repo. There is no backend in this repository, so dispatch is always `FE-only` (`uniplan-web-fe-reviewer`) plus an orchestrator-direct review of any Other-slice files (docs, CI workflows, `.claude/`, root configs).

> **CI override:** if the environment variable `CI=true` is set OR the invoking prompt explicitly says "running in CI / runner is already at the PR branch", **skip Step 2 (worktree creation) entirely**. In CI the runner has already checked out the PR branch into the working directory — set `<worktree-path>` to the current working directory (`git rev-parse --show-toplevel`) and proceed.

Follow these steps exactly:

## Step 1: Fetch PR metadata

Run:
```
gh pr view $ARGUMENTS --json number,title,body,baseRefName,headRefName,author,files
```

Extract the PR title, description, base branch, head branch, author, and list of changed files. Display a summary header like:

```
## PR #<number>: <title>
**Author:** <author>  |  **Base:** <base> <- <head>  |  **Files changed:** <count>
```

If the PR is not found, stop and inform the user.

## Step 2: Create a git worktree for the PR branch

**Skip this step if running in CI** (see CI override above). Otherwise: **always create the worktree — never skip this step locally, regardless of PR size or number of files changed.** The reviewer subagent reads source files from this worktree.

Run each command as a **separate Bash call**:

1. Get the repo root:
   ```
   git rev-parse --show-toplevel
   ```

2. Derive paths from the literal repo root captured above:
   - Normalize `<headRefName>` by replacing every `/` with `-` (e.g. `feature/add-course` → `feature-add-course`)
   - Worktree path: `<repo-root>/../uniplan-web-worktree/<normalized-branch>`

3. Ensure the worktrees directory exists:
   ```
   mkdir -p <repo-root>/../uniplan-web-worktree
   ```

4. Fetch the branch:
   ```
   git fetch origin <headRefName>
   ```

5. Check whether a worktree for this branch already exists:
   ```
   git worktree list
   ```
   - If one already exists, skip to Step 3 and use its path as `<worktree-path>`.

6. If not, create it. Use the branch name (not `origin/<headRefName>`) so git's DWIM behavior creates a local branch tracking the remote — passing `origin/<headRefName>` results in a detached HEAD:
   ```
   git worktree add <worktree-path> <headRefName>
   ```
   If a local branch with that name already exists and points elsewhere, fall back to explicit tracking:
   ```
   git worktree add --track -b <headRefName> <worktree-path> origin/<headRefName>
   ```

7. Install frontend dependencies in the new worktree (skip if reused):
   ```
   npm --prefix <worktree-path>/uniplanWeb ci
   ```
   Run this in the foreground — the FE reviewer doesn't need `node_modules` to read source, but having it installed lets you verify a finding by running `npm test --` if you decide to.

The literal `<worktree-path>` derived above is used in all subsequent steps.

## Step 3: Classify the diff by touched slice

From the `files` array returned in Step 1, classify the PR:

- **Frontend files** — any path starting with `uniplanWeb/`
- **Other files** — paths outside `uniplanWeb/` (`.github/`, `.claude/`, `CLAUDE.md`, `README*`, root configs)

Record which of the two buckets are non-empty:

- **FE slice** — non-empty whenever any file falls under `uniplanWeb/`. Dispatched to `uniplan-web-fe-reviewer`.
- **Other slice** — non-empty whenever any file falls outside `uniplanWeb/`. Reviewed by the orchestrator directly.

The two slices are independent; a PR can touch both.

Print one line announcing the classification and the dispatch plan, e.g.:
```
Diff scope: FE (12 files) + Other slice (2 files) — dispatching uniplan-web-fe-reviewer; orchestrator will review the Other slice directly.
```

## Step 4: Dispatch the FE reviewer

If the FE slice is non-empty, spawn `uniplan-web-fe-reviewer` via the `Agent` tool. Use this prompt template (substitute the literal values):

```
Review PR #<number> — "<title>".

Context line (use verbatim in your output heading): PR #<number> review

Worktree path (read source files from here):
<worktree-path>

Base branch: <baseRefName>
Head branch: <headRefName>

Diff scope for this review: frontend code only (uniplanWeb/**)

Get the diff by running, from the worktree:
  git -C <worktree-path> diff origin/<baseRefName>...HEAD -- uniplanWeb/

Apply the diff-scope rule from your system prompt: only flag issues in newly
added or modified lines. Pre-existing issues go under "Pre-existing (out of
scope)". You may read surrounding code in the worktree for context.

Produce findings in the Review Output Format from your system prompt. If no
issues are found, state "No issues found."
```

Do **not** ask the subagent to modify state files or apply Ralph-Loop behavior — this is a single-pass PR review.

## Step 4b: Orchestrator review of the Other slice

Whenever the Other slice is non-empty, the orchestrator reviews those files directly — the FE reviewer is scoped to `uniplanWeb/` and will not look at them. Run this step in parallel with Step 4 whenever possible (subagent is spawned, orchestrator reads Other-slice files while it works).

Scope the Other slice by path prefix:

| Area                                   | What to check                                                                |
|----------------------------------------|------------------------------------------------------------------------------|
| `CLAUDE.md`, `*.md`, `README*`         | Accuracy vs. the code change, broken links, stale commands, rules drift      |
| `.claude/rules/*.md`                   | Consistency with each other, no drift between the rules and the agent prompts |
| `.claude/agents/*.md`                  | Tool list correctness, system-prompt drift from rules                        |
| `.claude/skills/**/SKILL.md`           | Step-by-step correctness, references to file paths that exist                |
| `.github/workflows/`                   | Job graph, permissions, secrets usage, no `--no-verify`-style bypasses, gating still intact |
| `.github/CODEOWNERS`                   | Path patterns valid, team handles correct                                    |
| Root configs (`.gitignore`, etc.)      | Secrets never committed, ignored paths correct                               |

Get the Other-slice diff by running, from the worktree (or current directory in CI):
```
git -C <worktree-path> diff origin/<baseRefName>...HEAD -- <other-paths>
```
where `<other-paths>` is the space-separated list of top-level paths in the slice.

Apply the same diff-scope rule as the subagent (only flag issues in newly added or modified lines). Apply the **Severity Calibration** from `.claude/rules/implementation-common.md`. Produce findings in the **Review Output Format** — they will be merged in Step 5.

If the Other slice is empty, skip this step.

## Step 5: Merge findings into a single PR review

After the subagent returns, combine its output **together with your own Other-slice findings from Step 4b** into one consolidated review.

- Read `.claude/rules/implementation-common.md` → **Severity Calibration** so the consolidated output matches the project standard.
- Preserve every finding from the subagent verbatim, grouped into the sections below. Fold in the Other-slice findings the orchestrator produced in Step 4b at the same severity they were flagged.
- When the subagent (or the Other-slice pass) returns "No issues found.", treat that stream as contributing zero findings (do not invent any).
- Cap **Suggestions** at three entries total across both streams — if more are returned, rank by impact and drop the rest.
- Add a **Summary** paragraph (2–3 sentences) describing what the PR does and your overall assessment, synthesized from the subagent output, the Other-slice review, and the PR metadata.
- Add a **Praise** section highlighting things done well; the subagent does not emit this, so write it yourself based on the diff and the subagent output.

Output format (use verbatim):

```
---

## Code Review: PR #<number> — <title>

### Summary
<2-3 sentence summary of what this PR does and your overall assessment>

### Critical (must fix)
<merged Critical findings; "None" if empty>

### Important (should fix)
<merged Important findings; "None" if empty>

### Minor (could fix)
<merged Minor findings; "None" if empty>

### Suggestions (max 3, does not block merge)
<top 3 suggestions; "None" if empty>

### Pre-existing (out of scope)
<merged Pre-existing findings; "None" if empty>

### Praise
<things done well — good patterns, thorough tests, clean code>

---
```

For each finding, preserve the subagent's `path/to/file:line` reference and description. Do not soften, rephrase, or drop findings.

## Step 6: Print implementation target

After the review output, always print the following block (substituting the literal worktree path from Step 2 — or "the runner working directory" if running in CI):

```
---
> **Implementation target:** `<worktree-path>`
> All file edits for this PR must be made inside the worktree above.
> Do **not** modify files in the main repository.
```

If the run is in CI, print "Implementation target: N/A (review-only run in CI)" instead.
