# lck-fantasy

A free, season-long fantasy game for the LCK (League of Legends Champions Korea) that copies FPL's structure: a budget, a squad with a bench, weekly transfers, a captain, chips, global and supporter leagues.
Nothing is built yet: the repo holds docs and this working setup. The LCK Cup (January to March 2027) is the planned beta.

## The product is SPEC.md

- `SPEC.md` is the index and `spec/NN-*.md` each feature; both hold only Craig's answers. Wants no grill has settled live in `docs/to-grill.md`, never in `SPEC.md`; those, and any detail a spec file doesn't settle, each get a `/grill` before they are built.
- `docs/decisions.md` is the history: what Craig said in chat before the spec existed. It is not the spec.
- The build queue is the GitHub issues each grill ends in (`/grill` step 6).
- Don't assume features. `docs/research/` is background, never the product.

## Decided

- Opus plans and builds. The reviewer runs on a different model from the builder (`pr-reviewer`, on Sonnet).
- FPL's structure is the model: where a spec file is silent on how a part works, look at how FPL does it, then ask Craig.
- The LCK's facts (teams, rosters, splits, dates, series length) and every value Craig may tune (prices, points, chips, deadlines) are data, held per competition, never hardcoded.
- The theme is Korean: Korean feel, LCK culture. FPL gives the structure, never the look.
- The stack is in `ARCHITECTURE.md`: Craig picks services, Claude picks libraries, both with a reason.
- A screen's approved picture, once it has one in `docs/design/approved/<screen>/`, binds its layout. Pictures are drawn through `/design`, 1440 wide, and approved by Craig; the first design round also writes `docs/design/plate.md`, the look. No screen is built before its picture.

## Working

- How we build, in spirit: `docs/PHILOSOPHY.md` (ship small, keep it simple, never cut tests, no silent errors). The lines below are the enforced part. Tidying is fine only inside files the task already touches; anything else becomes an issue.
- One branch and one squash-merged PR per task, its branch starting `feat/`, `fix/`, `refactor/`, `docs/` or `chore/`. Enforced by `guard_bash.py`: no commit on `main`, no push to `main`, no force push, no staging everything, no word on Craig's private list, and no PR from a branch without one of those prefixes.
- A PR body is `## What` and a `Part of #n` or `Closes #n` line (`pr_body.py`). PRs ask nothing: small calls are stated as decided, real ones are asked in chat.
- `npm run verify` before every commit: the contents-list check and the hook tests (`/verify`). A doc over 100 lines opens with a contents list (`scripts/contents-lists.mjs`). `.claude/hooks/test.sh` checks every hook.
- One review round per PR. Once the pipeline is set up (`docs/PIPELINE.md`), `review.yml` runs `pr-reviewer` on every PR and posts its verdict; run `pr-reviewer` by hand only on a PR with no pipeline review. A builder tidies its own diff once first (`/refactor`).
- The build pipeline, once it is set up, is `docs/PIPELINE.md`: the workflows that build, review and merge an issue without a session, the labels (`lane:auto` is an issue the lead builds, `lane:craig` one that waits for Craig) and the `Today` issue, the lead's one report.
- Before adding a helper, hook, script, words or test fixture, search for its home and reuse it. Name every meaningful literal once, in one home.
- Talk is talk: an idea, a what-if or theory-crafting is filed, specced, built or shipped only after Craig says to (`guard_mode.py`).
- Where a spec file is silent, ask Craig: never build on a guessed rule, and never offer a rule only the code holds as a grill recommendation.
- Don't ask Craig what his standing answers already settle (small look details, fixes and upkeep): act and say so in one line. A question is asked once, five to a batch (`guard_ask.py`).
- Fewer words, in UK English: short replies, the shortest label on a screen, plain sentences. What Craig must decide goes first, with an example.
- Every PR or issue named to Craig gets its full GitHub URL.
- `ui-verifier` (an agent that shoots the built screens and reads them against their pictures) waits until there is an app to shoot.
- Add a rule here only after Claude gets something wrong, and add a hook rather than a rule where possible. `/retro` before clearing the chat finds those moments; `/wait-what` re-says a reply that didn't land; `/handover` writes the next session its start.
