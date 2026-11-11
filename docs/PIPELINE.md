# The build pipeline

Issues get built, reviewed and merged on GitHub without a chat session. It is ported from draft-platform and cut down for a repo with no app yet. Nothing runs until the setup steps at the end are done: every workflow says what is missing and stops green.

## The workflows

| Workflow | What it does |
|---|---|
| `verify.yml` | On every pull request and on main: `npm run verify` (skipped with a notice while there is no `package.json`) and actionlint over the workflows. Its job `verify` is a required check. |
| `review.yml` | Runs `.claude/agents/pr-reviewer.md` on Sonnet, read-only, once per pull request, and posts the verdict as one comment. |
| `review-gate.yml` | Sets the `review-landed` status: pending until the review is posted, and after a "look at these first" until the fix round's commit is in. A required check. |
| `lane-auto.yml` | Approves every pull request from this repo. Not one by anyone but Craig that touches `.claude/` or `.github/`, and not one labelled `lane:craig`. |
| `claude-build.yml` | Builds one issue on a branch with Opus, as the pipeline's account, opens the pull request and turns on auto-merge. Modes: `build`, `fix` (one round on a pull request), `rules-only` (asks open rules, writes no code). Unfinished work is kept as a draft on `wip/issue-N-*`. |
| `lead.yml` | Every half hour, and when a build ends: gives a red or flagged builder pull request one fix round, resumes an unfinished build once, starts the next ready issues (4 at a time), closes a stuck pull request, and rewrites the `Today` issue. At 01:37 UTC it sweeps 10 issues for open rules. |
| `drift-pass.yml` | Mondays: opens the `Weekly drift pass` issue over the week's merges and starts its build. |
| `branch-sweep.yml` | Sundays: deletes the branches of merged pull requests. |

Start a build by hand: `gh workflow run claude-build.yml --ref <branch> -f issue=<n>`. Test a pipeline change the same way from its branch before it merges, and `gh workflow run lead.yml --ref <branch> -f dry_run=true` for the lead.

Not ported: `look-gate.yml` (no screens yet), `release-check.yml` (no site yet), `CODEOWNERS` (no path waits for Craig yet), the nightly CI run, and `verify`'s build and smoke jobs. `verify.yml` has a comment where the last two go.

## Secrets and the variable

| Name | Used by | Without it |
|---|---|---|
| `CLAUDE_CODE_OAUTH_TOKEN` | `review.yml`, `claude-build.yml` | No review runs and `review-landed` passes, saying why. Nothing builds. |
| `BUILD_TOKEN` | `claude-build.yml`, `lead.yml`, `drift-pass.yml` | Nothing builds. A token of the pipeline's account (CBHelper180): it pushes, opens pull requests and starts builds, so CI runs on them and `lane-auto` can approve them. |
| `ANTHROPIC_API_KEY` (optional) | `claude-build.yml` | A build whose subscription run never started goes red instead of running again on the API key. |
| `HEALTHCHECKS_PING_URL` (optional) | `lead.yml` | No heartbeat: nothing emails Craig if the lead stops. |
| `PIPELINE_ON` (a variable, `true`) | `lead.yml`, `drift-pass.yml` | The schedule starts nothing, so no Actions minutes are spent. A run by hand still works. |

## The `main` ruleset

Named `main`, on the default branch, active:

- no deletion, no force push;
- a pull request with 1 approval, squash merge only, stale approvals not dismissed on push, no Code Owner review;
- required status checks, not strict: `verify`, `review-landed`. Add `smoke` when the app has one;
- bypass: the admin role, for pull requests only. Claude never uses it.

## Labels

| Label | Meaning | Made by |
|---|---|---|
| `lane:auto` | Checked by a grill: the lead builds it. | By hand (step 6) |
| `lane:craig` | Waits for Craig: never built, never auto-approved. | By hand (step 6) |
| `next` | Craig: build this first. | The lead |
| `build` | Craig's label on an issue starts its build at once. | By hand (step 6) |
| `rules:open` | The build asked questions. Craig's comment on the issue restarts it. | The build |
| `rules:clear` | The sweep found every rule settled: the lead builds it. | The build |
| `lead:stale` | Already built or out of date. | The build |
| `lead:stuck` | Its pull request stayed red and was closed. Take it off to build again. | The lead |
| `lead:fixed`, `lead:conflict-round`, `lead:resumed`, `lead:review-started` | The lead's own marks on pull requests: one round each. | The lead |
| `lead:board` | The `Today` issue. | The lead |
| `drift-pass` | The weekly drift pass's issue. | The drift pass |

The sweep only picks up an unlabelled issue whose body names a `spec/NN` file. Until the repo has spec files, an issue is built only with `lane:auto`, `next` or `build`.

## Setup, in order

Never print a secret: paste it at `gh secret set`'s prompt, or pipe it in.

1. Merge this pull request and `chore/working-harness` (the `pr-reviewer` brief and `npm run verify`).
2. **Craig's call: GitHub Pro, or a public repo.** On a private repo on the free plan GitHub refuses rulesets and auto-merge ("Upgrade to GitHub Pro or make this repository public"). Without them builds and reviews run, but nothing merges itself and no check is enforced.
3. Invite CBHelper180 to the repo with Write access, and accept as that account.
4. Set the secrets:
   - `gh secret set CLAUDE_CODE_OAUTH_TOKEN -R cBallGitWork/lck-fantasy` (from `claude setup-token`);
   - `gh secret set BUILD_TOKEN -R cBallGitWork/lck-fantasy`: a fine-grained token of CBHelper180 for this repo with read and write on Contents, Pull requests, Issues and Actions;
   - optional: `ANTHROPIC_API_KEY`, `HEALTHCHECKS_PING_URL`.
5. Repo settings:
   - `gh api -X PATCH repos/cBallGitWork/lck-fantasy -F allow_auto_merge=true -F allow_merge_commit=false -F allow_rebase_merge=false`
   - `gh api -X PUT repos/cBallGitWork/lck-fantasy/actions/permissions/workflow -f default_workflow_permissions=read -F can_approve_pull_request_reviews=true`
6. Labels: `for l in lane:auto lane:craig build next; do gh label create "$l" -R cBallGitWork/lck-fantasy --force; done`
7. The ruleset:

   ```sh
   gh api -X POST repos/cBallGitWork/lck-fantasy/rulesets --input - <<'EOF'
   {"name": "main", "target": "branch", "enforcement": "active",
    "conditions": {"ref_name": {"include": ["~DEFAULT_BRANCH"], "exclude": []}},
    "bypass_actors": [{"actor_id": 5, "actor_type": "RepositoryRole", "bypass_mode": "pull_request"}],
    "rules": [
     {"type": "deletion"}, {"type": "non_fast_forward"},
     {"type": "pull_request", "parameters": {"allowed_merge_methods": ["squash"],
      "required_approving_review_count": 1, "dismiss_stale_reviews_on_push": false,
      "require_code_owner_review": false, "require_last_push_approval": false,
      "required_review_thread_resolution": false}},
     {"type": "required_status_checks", "parameters": {"strict_required_status_checks_policy": false,
      "required_status_checks": [{"context": "verify"}, {"context": "review-landed"}]}}]}
   EOF
   ```
8. Fill in `review-landed` on the open pull requests: `gh workflow run review-gate.yml -R cBallGitWork/lck-fantasy`.
9. Test before switching on: `gh workflow run lead.yml -f dry_run=true`, then one real build, `gh workflow run claude-build.yml --ref main -f issue=<n>`. Check its time, its pull request, its review and that it merges itself.
10. Switch on: `gh variable set PIPELINE_ON --body true -R cBallGitWork/lck-fantasy`.

Cost to know: the repo is private, so Actions minutes count. The lead alone is about 49 short passes a day, roughly 1,500 minutes a month; a build is up to 75 minutes.
