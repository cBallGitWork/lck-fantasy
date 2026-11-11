# Dev team review of PRs #5 and #8

**Contents:** [Verdicts](#verdicts) · [Findings, worst first](#findings-worst-first) · [Fit](#fit) · [Claude-expert suggestions](#claude-expert-suggestions)

## Verdicts

- **PR #5 `chore/working-harness`: merge after fixes** (findings 1, 6, 7; all small). Hooks are a clean port: `.claude/hooks/test.sh` passes locally ("hooks: all checks pass", about 210 checks, every hook wired and covered, including a no-Bash-guard negative test). No Convex/screen/ruleset leftovers; only dated "on another project" comments remain, which is fine.
- **PR #8 `chore/build-pipeline`: merge after fixes** (findings 2-5, 8), and **do not set `PIPELINE_ON`** until finding 3 is settled. Local actionlint is clean at warning level (one SC2016 info in `lead.yml:148`). Read-only checks: repo is private, no secrets, no variables, rulesets return 403 ("Upgrade to GitHub Pro or make this repository public").

## Findings, worst first

1. **#5 fails its own gate.** `npm run verify` in `~/lck-fantasy-harness` exits 1: `.claude/skills/grill/SKILL.md is over 100 lines and has no contents list in its first 30` (108 lines). CI never showed it because `verify.yml` is not on main yet. Fix: add a `**Contents:**` line under the title.
2. **`review-gate.yml:20-23` is broken on a private repo; it already failed on PR #8** (run 43002327708: `GraphQL: Resource not accessible by integration (repository.pullRequest.commits.nodes.0)`). The source repo is public so never hit it. Fix: add `contents: read`. Without it `review-landed` is never set and every PR hangs once it is required. Same class, likely but not proven: `lead.yml:60-64` reads `statusCheckRollup` with no `checks: read`/`statuses: read`; add both and prove with `lead.yml -f dry_run=true` straight after merge.
3. **The pipeline's "real guard" does not exist here.** `claude-build.yml:78-80` says the deny list is a speed bump and the ruleset plus lane-auto are the guard. True: `Bash(node:*)`, `npm:*`, `npx:*` (`:86`) let the builder run anything with `BUILD_TOKEN`, so `gh api`, merge and `.github/` denials are bypassable. On a free private repo there is no ruleset and no auto-merge, so a steered builder with Write access can push to main. `docs/PIPELINE.md:64` asks Craig "Pro or public" but nothing enforces it. Fix: have the `gate` step (`claude-build.yml:114`) and `lead.yml:120` refuse to start when `gh api repos/$REPO/rules/branches/main` is empty; recommend Pro, not public (see 4). Also state in `PIPELINE.md:68` that `BUILD_TOKEN` must never get the Workflows permission: that is what stops the builder editing the workflows that judge it.
4. **If the repo goes public, strangers can drive builds.** `lead.yml:302` sweeps any open issue whose body names `spec/NN`, with no author check; `claude-build.yml:90` tells the builder to take instructions from "the issue's body" whoever wrote it; the builder can then label it `rules:clear` and the lead builds and auto-merges it. Fix: filter `lead.yml:292-303` to issues authored by `$OWNER` (or labelled by him), and change the prompt to trust the body only when the owner wrote the issue. Harmless while private.
5. **`review-landed` can be forged.** `review-gate.yml:69` accepts any comment containing `*Reviewer: pr-reviewer`, by any author; the builder is allowed `gh pr comment` (`claude-build.yml:86`). `lead.yml:237` and `:269` have the same hole. Fix: `select(.author.login == "github-actions")` in all three.
6. **lane-auto's guard list misses what defines the gate.** `lane-auto.yml:34` guards only `.claude/` and `.github/`. A builder PR can set `"verify": "true"` in `package.json`, gut `scripts/contents-lists.mjs`, or rewrite `CLAUDE.md` (denied to the Edit tool, not to `node`), and still be approved. Fix: `GUARDS: '^(\.(claude|github)/|scripts/|package\.json$|CLAUDE\.md$)'`; narrow it when app code needs `package.json`.
7. **#5's `CLAUDE.md` does not know #8 exists.** `CLAUDE.md:28` says "Run `pr-reviewer` on a branch before its PR merges", which with `review.yml` means two reviews per PR. No line mentions `docs/PIPELINE.md`, the labels or the `Today` issue. `CLAUDE.md:8,19` name `SPEC.md`, `docs/to-grill.md`, `ARCHITECTURE.md`, which only arrive in #7. Fix: whichever of #5/#8 merges second adds one "Working" line pointing at `docs/PIPELINE.md` and rewords line 28 to "review.yml reviews every PR; run pr-reviewer by hand only when there is no pipeline run".
8. **Cost.** `lead.yml:40` runs 49 passes a day, about 1,500 of a free private repo's 2,000 Actions minutes a month (`PIPELINE.md:95`), before a single 75-minute build. When the minutes run out, `verify` stops too. `PIPELINE_ON` is enough as an off switch (skipped jobs cost nothing), but not as a budget. Fix: cut the cron to 3-4 a day (the `workflow_run` and `issues: labeled` triggers already wake it), `MAX_IN_FLIGHT: 4` to 1 or 2 (`:79`), and leave `ANTHROPIC_API_KEY` unset so a bad token can never spend real money.
9. **Merge-order trap with #7.** After #5 lands, `docs/research/backtest/tables.md` (196 lines) and `docs/research/scoring-backtest-2026.md` (179) from #7 have no contents list, so main's `verify` goes red. #5 already fixes the five older research docs; no textual conflict. Fix: add the two lists on #7 before it merges. #6 is clean.
10. **Branch names.** `pr_body.py:94` refuses `gh pr create` from a `claude/...` session worktree branch, and requires a `Part of #n` line while `guard_mode.py:44` gates `gh issue create` on Craig's go. Intended, and tested (`tests/guard_bash.sh:126`), but with one issue in the repo (#4) every autonomous PR must hang off #4 or stop. See "missing" below.
11. Small: `verify.yml:34,45` use `@v4` while the others pin SHAs (`claude-build.yml:15` claims all are pinned); `id-token: write` is unneeded in `claude-build.yml:43` and `review.yml:30` since a `github_token` is passed; `inputs.pr` (`claude-build.yml:94`) is not checked numeric as `ISSUE` is (`:110`); `BUILD_TOKEN` (`PIPELINE.md:68`) probably needs Commit statuses: read for the fix round's `gh pr checks`.

Secrets missing, as read: no `BUILD_TOKEN` or no model secret, nothing builds and runs stay green with a notice; no OAuth token, `review-landed` passes everything (fail-open by design, as is a crashed review); no Healthchecks, a notice. All sound. Triggers: builds start only from the owner's label, the owner's comment on a `rules:open` issue, or a dispatch (Write access). `pull_request_target` in lane-auto checks out nothing: safe. No `${{ }}` of user text inside a `run:`.

## Fit

Not too heavy to merge, too heavy to switch on. Keep now: hooks, `verify.yml`, `review.yml`, `review-gate.yml`, `lane-auto.yml`, `claude-build.yml` started by Craig's `build` label. Defer (leave merged but off, or cut): the lead's schedule and sweep, `drift-pass.yml` (nothing to drift), `branch-sweep.yml` (the "delete head branches" setting does it), `/deepen` (no codebase).

Missing for strong autonomous working:
- A build queue: one issue exists (#4). After #7 merges, run a grill to cut the first 5-10 issues from `SPEC.md`.
- A spec-to-issue label: `/grill` step 6 (`.claude/skills/grill/SKILL.md:88`) never says to add `lane:auto`, so the lead ignores its issues until the nightly sweep. Add that line.
- A standing-answers home: `docs/decisions.md` is history; `guard_ask.py:45-56` hard-codes two answer kinds. Fine for now.

## Claude-expert suggestions

Adopt now:
- A2: keep Opus builder, Sonnet reviewer, pinned action SHA (already so).
- A9: if Craig picks public, GitHub stops schedules after 60 quiet days; set `HEALTHCHECKS_PING_URL` so silence is noticed.
- A4 `blockWritesOutsideWorkingDirectories`: one line in `.claude/settings.json`, but check the key name against the docs first; I could not verify it, and it does not stop `node`.
- A11: remove the duplicate `/deep-research` skill (user-level, not this repo).

Defer:
- A3 `denyInsteadOfPrompting`: headless `-p` already denies unlisted tools; little gain.
- A1 effort sweep, A7 workflow drift pass, A8 scheduled-task sweep, A10 agent teams, A12 `/deepen` on Fable: nothing to measure until builds exist.
- A5/A6 `REVIEW.md` and managed Code Review: only on a Team plan.
- A13: nothing reads the text stream.
