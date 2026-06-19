# Setting up `REVIEWERS_TEAM_READ_TOKEN`

This guide walks through creating and installing the **`REVIEWERS_TEAM_READ_TOKEN`**
secret for the **Claude Code Review** workflow in
[`uni-dev-lab/uniplan-web`](https://github.com/uni-dev-lab/uniplan-web).

## TL;DR

> **This is a one-time setup, and only ONE person needs to do it.**
> The token is a single shared repository secret. It reads the membership of the
> `@uni-dev-lab/reviewers` team on behalf of *whoever* triggers the workflow, so
> once it's set it works for the whole team. **You do not each need your own token.**

The person who does this needs:

1. **Admin access** to the `uni-dev-lab/uniplan-web` repository (to add the secret), and
2. Membership in the **`uni-dev-lab`** org (to create a token that can read team membership).

---

## Why this token exists

The review workflow has a gate that checks whether the person triggering it is an
active member of `@uni-dev-lab/reviewers` *before* it spends any Claude tokens.

GitHub's built-in `GITHUB_TOKEN` **cannot read org team membership**, so the workflow
needs a separate token with `read:org` access. Until the secret is set, the workflow's
`authorize` job fails immediately with:

```
REVIEWERS_TEAM_READ_TOKEN secret is missing.
```

That's the safe default — it's not a bug, it just means setup hasn't been done yet.

---

## Step 1 — Create the token (fine-grained PAT)

1. On GitHub, click your **avatar** (top-right) → **Settings**.
2. In the left sidebar, scroll to the bottom → **Developer settings**.
3. **Personal access tokens** → **Fine-grained tokens**.
4. Click **Generate new token**.
5. Fill in:
   - **Token name**: `uniplan-web reviewers team read` (any clear name).
   - **Resource owner**: select **`uni-dev-lab`** (the organization — *not* your personal account).
   - **Expiration**: pick a date (e.g. 90 days). ⚠️ When it expires the workflow will
     start failing again — see [Maintenance](#maintenance) below.
   - **Repository access**: **Public repositories** (or **No repositories**) is fine —
     this token only needs *organization* read access, not repo access.
6. Expand **Permissions** → **Organization permissions** → find **Members** →
   set **Access: Read-only**.
   - This is the only permission required. Leave everything else as "No access".
7. Click **Generate token**.
8. **Copy the token now** (it starts with `github_pat_…`). GitHub shows it only once.
9. If your org requires approval for fine-grained tokens, the token stays **pending**
   until an org owner approves it (Org → Settings → Personal access tokens). The secret
   won't work until it's approved.

> **Classic-PAT alternative:** instead of a fine-grained token you can create a
> *classic* PAT with the **`read:org`** scope. If your org uses SAML SSO, click
> **Configure SSO** on the token and authorize it for `uni-dev-lab`.

---

## Step 2 — Add the token as a repository secret

You need **admin access** to the repo for this step.

### Option A — GitHub UI

1. Go to <https://github.com/uni-dev-lab/uniplan-web>.
2. **Settings** tab → left sidebar **Secrets and variables** → **Actions**.
3. On the **Secrets** tab, click **New repository secret**.
4. **Name**: `REVIEWERS_TEAM_READ_TOKEN`  *(must match exactly — case-sensitive)*
5. **Secret**: paste the token value from Step 1.
6. Click **Add secret**.

### Option B — GitHub CLI

```bash
gh secret set REVIEWERS_TEAM_READ_TOKEN --repo uni-dev-lab/uniplan-web
# paste the token value when prompted, then press Enter
```

---

## Step 3 — Verify it works

1. In the repo, open the **Actions** tab → select the **Claude Code Review** workflow.
2. Click **Run workflow**, enter any open PR number, and run it.
3. Open the run and check the **`authorize`** job. On success it prints:

   ```
   Actor '<your-username>' verified as active member of @uni-dev-lab/reviewers.
   ```

### If it still fails

| Message in the `authorize` job | What it means | Fix |
| --- | --- | --- |
| `REVIEWERS_TEAM_READ_TOKEN secret is missing.` | Secret not saved, or name misspelled. | Re-check the secret name in Step 2 — it must be exact. |
| `... is not an active member of @uni-dev-lab/reviewers.` | The person who triggered it isn't on the reviewers team, **or** the token can't read membership (pending approval / wrong permission / expired). | Confirm team membership; confirm the token has org **Members: Read-only** and is approved. |

---

## Who can run the workflow afterwards

Two separate things are needed per person:

- **To press "Run workflow":** the person needs **Write access** to the repo
  (GitHub's built-in rule for manually dispatched workflows).
- **To pass the gate:** that same person must be an **active member of
  `@uni-dev-lab/reviewers`**.

So make sure each reviewer who'll use this has **at least Write access** to the repo —
team membership alone doesn't grant it.

---

## Maintenance

- **Expiration:** when the token expires, the `authorize` job starts failing with the
  "not an active member" message. Regenerate the token (or extend it) and update the
  secret. Setting a calendar reminder a few days before expiry helps.
- **Rotation:** to rotate, generate a new token and overwrite the same secret name.
  No workflow changes are needed.

---

## What's next (separate from this token)

For the review job to actually *run* Claude after the gate passes, the repo also needs
a **`reviewers-only` GitHub environment** with a **`CLAUDE_CODE_OAUTH_TOKEN`** secret
attached to it. That's a separate one-time setup; if it's missing, the `claude-review`
job will fail with "Environment 'reviewers-only' not found". See the
[`CLAUDE.md` → GitHub Action setup](https://github.com/uni-dev-lab/uniplan-web/blob/main/CLAUDE.md)
section for the full picture.
