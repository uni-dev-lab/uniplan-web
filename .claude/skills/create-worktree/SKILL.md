---
name: create-worktree
description: Create (or reuse) a git worktree for a given remote branch in a sibling uniplan-web-worktree directory
disable-model-invocation: false
argument-hint: <branch-name>
---

You are creating (or reusing) a git worktree for the branch: $ARGUMENTS

Follow these steps exactly. Run each step as a **separate Bash call** — do NOT combine them with `&&` or shell variables.

## Step 1: Get repo root

Run `git rev-parse --show-toplevel` and capture the output as the literal repo root path (e.g. `/Users/stoyan/projects/uni-dev-lab/uniplan-web`).

## Step 2: Derive paths

Using the literal repo root from Step 1:

- **Worktree base**: `<repo-root>/../uniplan-web-worktree` (e.g. `/Users/stoyan/projects/uni-dev-lab/uniplan-web-worktree`)
- **Normalized branch name**: replace every `/` with `-` in `$ARGUMENTS` (e.g. `feature/add-course` → `feature-add-course`)
- **Full worktree path**: `<worktree-base>/<normalized-branch>`

## Step 3: Create worktree base directory

Run `mkdir -p <repo-root>/../uniplan-web-worktree` using the literal repo root from Step 1.

## Step 4: Fetch branch

Run `git fetch origin $ARGUMENTS`.

## Step 5: Check for existing worktree

Run `git worktree list` and inspect the output to determine whether a worktree for this branch already exists.

## Step 6: Add worktree (if not already present)

- If no worktree exists for this branch, run: `git worktree add <worktree-path> $ARGUMENTS`
- If that fails because the branch is already checked out locally, run: `git worktree add <worktree-path> --detach origin/$ARGUMENTS`
- If a worktree already exists (detected in Step 5), skip this step and report "reused".

## Step 7: Print result

Print the absolute worktree path and state whether it was **created** or **reused**.

---

## Post-checkout: install dependencies (only when worktree was newly created)

**Skip this section entirely if the worktree was reused.**

The Angular project lives in `uniplanWeb/` inside the worktree, not at the worktree root. Run dependency install there:

```
npm --prefix <worktree-path>/uniplanWeb ci
```

Wait for it to finish before reporting the final result. There is no global `.env` to copy and no backend bootstrap step in this repo, so a single `npm ci` against the `uniplanWeb/` subdirectory is the entire post-checkout setup.
