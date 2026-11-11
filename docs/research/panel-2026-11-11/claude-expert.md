# Claude news, November 2026, applied to LCK fantasy

**Contents:** [Do these first (top 10)](#do-these-first-top-10) · [1. What is new, with dates](#1-what-is-new-with-dates) · [2. A: How we build (the pipeline and harness)](#2-a-how-we-build-the-pipeline-and-harness) · [3. B: In the product](#3-b-in-the-product) · [4. Sources](#4-sources)

Checked 11 Nov 2026 against Anthropic's docs and the Claude Code changelog. Where I could not check something, I say so.

## Do these first (top 10)

1. **Keep the pinned builder and reviewer.** `claude-build.yml` runs `claude-opus-5-5` at `--effort medium`, and `review.yml` runs `claude-sonnet-5-5` at `--effort medium`. Both are current and the reviewer is still a different model. Next step: run one build at `medium` and one at `high` on the same issue, and compare pass rate and cost. S
2. **Write all new code to the 5.5 rules now.** The repo has no code yet, so nothing needs migrating. Opus 5.5 rejects `thinking: disabled`, rejects `tool_choice` `any` or `tool` (400 error), and returns text between tool calls in `thinking` blocks. S
3. **Add two safety settings for headless builds.** `permissions.denyInsteadOfPrompting` (v2.1.319) stops a build from hanging on a prompt. `permissions.blockWritesOutsideWorkingDirectories` (v2.1.314) stops writes outside the worktree. S
4. **Add a `REVIEW.md` to the repo.** Put the spec, "no hardcoding" and "data, never rules in code" checks in it. Claude Code Review reads it from the base branch. This only helps if Craig's plan includes Code Review (Team or Enterprise). Check that first. S
5. **Product: write match narratives once per series, never per manager.** Use Sonnet 5.5 at `medium`. The cost is about $0.02 per series, and about $0.08 a week for five series, whatever the number of managers. S
6. **Product: split by job.** Haiku 5.5 writes the facts-heavy per-manager text, about $0.45 per 1,000 managers a week. Sonnet 5.5 writes the voice. Use the Batch API for weekly recaps, which is half price. S
7. **Product: code computes every number.** The model writes sentences only, and each sentence cites stat IDs through structured outputs. A check in code rejects any number the input did not contain. S
8. **Product: do not use Fable 5.2 for the game.** It costs four times Opus 5.5 at the same token count, requires 30-day data retention, and is not eligible for zero data retention. M
9. **Try dynamic workflows for the weekly drift pass.** Fan out one check per file, then one adversarial checker, then one ranked list. It needs a `Workflow` allow rule in headless mode. Test it from a branch first, as the project's rules require. M
10. **Pilot scheduled tasks for the 01:37 UTC analyst sweep.** The feature is in research preview, so keep GitHub Actions as the runner and treat this as a trial only. M

---

## 1. What is new, with dates

### Model family (verified on platform.claude.com model pages)

| Model | Released | Input / output per MTok | Default effort | Context / max output | What it is for |
|---|---|---|---|---|---|
| Claude Fable 5.2 (`claude-fable-5-2`) | 9 Nov 2026 | $8 / $40 | `high` | 1M / 128K | Demanding reasoning and long agentic work. Mythos 5.2 has the same spec and price, but only for verified organisations. |
| Claude Opus 5.5 (`claude-opus-5-5`) | 22 Sep 2026 | $4 / $20 | `medium` | 1M / 128K | Long-running agentic coding and knowledge work. |
| Claude Sonnet 5.5 (`claude-sonnet-5-5`) | 28 Sep 2026 | $2 / $10 | `high` | 1M / 128K | Everyday coding, agents and content. Fast. |
| Claude Haiku 5.5 (`claude-haiku-5-5`) | 7 Oct 2026 | $0.10 / $0.50 for prompts up to 100K; $0.50 / $2.50 above | `medium` | 1M / 128K | High-volume, low-latency work: classification, extraction, routing, subagents. |

- Cache reads cost 0.05x base on Opus 5.5 and Sonnet 5.5, 0.1x on Haiku 5.5 (over 100K it is 0.05x), and 0.025x on Fable 5.2.
- The Batch API is 50% off input and output. Output up to 300K is in beta on the batch endpoint, with the header `output-300k-2026-03-24`.
- Adaptive thinking is always on for Opus 5.5 and Fable 5.2. You cannot turn it off.
- Opus 5.5 thinks more per turn at the same effort level than Opus 5. Re-run any effort sweep rather than copying the old setting.
- Fast mode on Opus 5.5 is `speed: "fast"` at premium pricing. It is available on the API and some clouds.
- Betas: per-message effort, compaction on demand (`compact-2026-09-04`), and inline tool definitions (`inline-tools-2026-09-15`).

### Claude Code (changelog, 26 Oct to 10 Nov 2026 only)

The changelog page was truncated, so I could not check September releases.

- **v2.1.321 (9 Nov):** Fable 5.2 became the default Fable model.
- **v2.1.319 (6 Nov):** `permissions.denyInsteadOfPrompting` denies a call that would wait on a prompt. This covers terminal sessions, subagents and teammates.
- **v2.1.316 (31 Oct):** `CLAUDE_CODE_SUBAGENT_EFFORT` sets the effort subagents run at.
- **v2.1.314 (30 Oct):** `permissions.blockWritesOutsideWorkingDirectories` stops Write, Edit and NotebookEdit outside the working directories.
- **v2.1.312 (27 Oct):** prompt and agent hooks run at most 24 at a time.

### Orchestration features

- **Dynamic workflows** (docs page `code.claude.com/docs/en/workflows`). Claude writes a JavaScript script that calls `agent()`, `pipeline()` and `parallel()`. Up to 16 agents run at once by default, and a run can use 1,000 agents in total. A run can resume from saved results. The bundled `/deep-research` uses this. Plans: all paid plans, the API, Bedrock, Vertex and Foundry. The page does not give a release date. Headless `claude -p` runs and the Agent SDK do not show the approval prompt, so you need a `Workflow` or `Workflow(<name>)` allow rule.
- **Agent teams** (`code.claude.com/docs/en/agent-teams`). Experimental. Turn on with `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`. Teammates message each other and share a task list. One team per session. No nested teams. Not available in `-p` or the SDK. Token cost is high.
- **Scheduled tasks**, formerly routines (`code.claude.com/docs/en/routines`). Research preview. Triggers: schedule, API POST, or GitHub events. Runs in the cloud, or on a self-hosted environment. Created at claude.ai/code/routines or with `/schedule`.
- **Code Review** (`code.claude.com/docs/en/code-review`). Team and Enterprise plans. Several agents review each PR, then a verifier removes false positives. Levels are Quick, Standard and Deep. Reads `REVIEW.md` and `CLAUDE.md` from the base branch. Cannot approve or block a PR.
- **`/code-review` and `/ultrareview`** run locally on any plan. `/ultrareview` needs a claude.ai sign-in.
- **Claude Code GitHub Action v1** (`code.claude.com/docs/en/github-actions`). Accepts a `prompt`, `claude_args` (for example `--model`, `--max-turns`), plugins, and workload identity federation. The action's scheduled runs are disabled after 60 days without repo activity, on public repos.
- **Memory.** Managed Agents memory stores are in beta (`agent-memory-2026-07-22`). The index also lists a "Dreams" page. I did not read it, so I cannot describe it.

### Not verified

- September 2026 Claude Code releases.
- Whether Batch and cache discounts stack. Check the pricing page.
- Fable's data-retention details beyond the model page.
- Korean token counts. The budget below assumes Korean costs about 1.5 to 2 times English in tokens. This is a guess until measured.
- The Dreams feature.
- The batch processing window.
- The claim that Opus 5.5 reads charts more precisely. That is Anthropic's claim, and I did not test it.

---

## 2. A: How we build (the pipeline and harness)


| # | Feature | Use here | Effort | Replaces or unlocks |
|---|---|---|---|---|
| A1 | Opus 5.5 default effort is `medium`, and it thinks more at a given level | Re-sweep `--effort` on the builder: `medium`, `high`, and maybe `xhigh`. Score each by verify pass and time | S | Stops a guessed effort level. Run from a branch first, as the project's rule says. |
| A2 | Reviewer on Sonnet 5.5, `--effort medium` | Keep. The reviewer must stay a different model from the builder. | S | Nothing to change |
| A3 | `denyInsteadOfPrompting` (v2.1.319) | Set it in the build's settings so a headless run denies rather than hangs | S | Silent hangs in `claude -p` |
| A4 | `blockWritesOutsideWorkingDirectories` (v2.1.314) | Set it so a builder cannot write outside its worktree. This matches the project's "builders work in different folders" rule. | S | Relies on hooks alone today |
| A5 | `REVIEW.md` for Code Review | Put the spec, `ARCHITECTURE.md` and "no hardcoding" rules in it. Use it only if the plan includes Code Review. | S | Duplicated review rules |
| A6 | Code Review (managed) in place of, or beside, `review.yml` | Keep `review.yml` while the `review-gate` needs its verdict line. Choose later, once the plan is known. | M | Maintenance of a custom reviewer |
| A7 | Dynamic workflow for the weekly drift pass | Fan out one checker per file, then an adversarial checker, then one ranked summary. Run it as a Craig-started job, or headless with a `Workflow` allow rule. Test it once from its branch. | M | A single long drift session with a growing context |
| A8 | Scheduled task for the 01:37 UTC analyst sweep | Pilot one daily job only. Keep GitHub Actions as the runner. The feature is in research preview. | M | Reliance on the cron for the sweep |
| A9 | Actions cron and the 60-day rule | If the repo is public, schedules stop after 60 days without activity. Confirm the repo's visibility and keep a heartbeat or a manual fallback. | S | The lead going silent |
| A10 | Agent teams for `/design`'s four reviewers | The four reviewers could challenge each other. Pilot once in an interactive session, watching cost. Do not use it in headless builds, because teams do not run there. | M | Independent reviewer panels (experimental) |
| A11 | Two `/deep-research` skills | Craig has a local `/deep-research` and a built-in workflow of the same name. Keep one. | S | Duplicate skills |
| A12 | `/deepen` on Fable 5.2 | The architecture pass reads the whole codebase, which suits the 1M window. It costs about four times Opus. Try once and compare findings. | S | Only a trial |
| A13 | Opus 5.5 streams text between tool calls as `thinking` blocks | Matters only if any tool shows build progress from the text stream. Set `thinking.display` if it does. | S | Silent progress logs |

Rules that already hold, and are worth keeping:

- Use only `claude-opus-5-5` and `claude-sonnet-5-5` in config. Do not hard-code older IDs.
- Keep `anthropics/claude-code-action` pinned to a SHA, as `claude-build.yml` does (v1.0.268).
- Keep the bot account, because GitHub does not trigger workflows from the default `GITHUB_TOKEN`.

---

## 3. B: In the product

The product is an AI narrative layer and novel mechanics, never a chatbot. Every number comes from code. The model writes words only.

### Cost assumptions

- **Per-manager weekly recap:** 3,000 input tokens, 300 output, no thinking.
- **Per-manager "why did my score move":** 1,500 in, 200 out.
- **Squad "why this swap" card:** 4,000 in, 300 out, two calls a manager-week.
- **Shared match narrative:** 4,000 in, 800 out per series. Five series a week is an assumption, not a schedule check.
- **Live summaries:** 40 calls per series, 1,000 in, 60 out, on Haiku.
- **Achievement stories:** 300 achievements, each written in Korean and English. 2,000 in, 500 out per text, once.
- Thinking adds output tokens. At `medium` effort, add roughly a third to these figures.

### Cost per 1,000 managers a week

| Use | Scope | Haiku 5.5 | Sonnet 5.5 | Opus 5.5 | Fable 5.2 | Notes |
|---|---|---|---|---|---|---|
| Personal weekly recap | Per manager | $0.45 (batch $0.23) | $9.00 (batch $4.50) | $18 (batch $9) | $36 (batch $18) | Haiku for facts; Sonnet for voice |
| "Why did my score move" | Per manager | $0.25 | $5.00 | $10 | not priced | Deterministic breakdown, then one sentence per line |
| Squad "why this swap" card | Per manager, 2 calls | $1.10 | $22 | not priced | not priced | Two suggestions a week at most |
| Match narrative | Per series, shared | about $0.08 a week in total | about $0.16 a week in total | about $0.16 a week in total | not priced | Written once for everyone. Flat in manager count. |
| Live commentary summaries | Per series, shared | about $0.03 a week in total | not priced | not priced | not priced | Haiku for latency |
| Achievement stories, one-off | 600 texts (KO and EN) | about $3 | $5.40 | $10.80 | not priced | Write once. Review with Opus. |

Cost by model, per manager-week, for the recap:
- Haiku 5.5 about $0.00045.
- Sonnet 5.5 about $0.009.
- Opus 5.5 about $0.018.
- Fable 5.2 about $0.036.

### Model choice

- **Haiku 5.5** for anything high-volume and factual: scoring explanations, live summaries, judging that the Korean and English texts match.
- **Sonnet 5.5** for prose voice: match narratives, the weekly recap.
- **Opus 5.5** for reviewing what gets written once, such as achievement texts, and for any one-off authoring.
- **Fable 5.2** only for a rare, large job. It is not zero-retention eligible, so check that before any user data goes near it.

### Ideas that fit the product

1. **Scout's notebook.** A weekly diary per team, written from its own match data. The model may cite stat IDs only. Achievements unlock from the same data.
2. **"Ryu sad face" check.** The model proposes achievement matches from event logs. A rule in code confirms each one before it counts.
3. **"Why did I lose 3 points."** A breakdown is computed in code. Haiku writes one sentence for each line.
4. **Korean and English parity.** Haiku checks that both versions carry the same numbers and names. Cheap, and it catches drift.
5. **Squad help without a chat box.** The optimiser proposes swaps. The model writes the reason for each swap. The manager accepts or rejects it with a tap.
6. **Batch the weekly recaps.** They run overnight, at half price.

### Build notes for the product

- Put the static LCK lore and rules in a long system prompt, and cache it. Caching needs at least 512 tokens.
- Use structured outputs for every generated line, so the code can check each line against its data.
- Use the Messages API from a Convex action. The Agent SDK and Managed Agents are not needed, because the game needs no sandbox.

---

## 4. Sources

Anthropic platform docs:
- https://platform.claude.com/docs/en/models/opus-5-5/overview
- https://platform.claude.com/docs/en/models/opus-5-5/whats-new-opus-5-5
- https://platform.claude.com/docs/en/models/fable-5-2/overview
- https://platform.claude.com/docs/en/models/sonnet-5-5/overview
- https://platform.claude.com/docs/en/models/haiku-5-5/overview
- https://platform.claude.com/docs/en/about-claude/pricing
- https://platform.claude.com/docs/en/build-with-claude/effort
- https://platform.claude.com/docs/en/managed-agents/memory
- https://platform.claude.com/llms.txt (index; used for the model list)

Claude Code docs and changelog:
- https://code.claude.com/docs/en/workflows
- https://code.claude.com/docs/en/agent-teams
- https://code.claude.com/docs/en/routines (now titled "Automate work with scheduled tasks")
- https://code.claude.com/docs/en/code-review
- https://code.claude.com/docs/en/github-actions
- https://code.claude.com/docs/en/changelog (read to v2.1.322 only)

Project files read:
- `origin/chore/build-pipeline`: `.github/workflows/claude-build.yml`, `review.yml`, `lead.yml`

Not read: `sub-agents.md`, the Opus 5.5 migration guide, the Dreams page, and the batch processing page.
