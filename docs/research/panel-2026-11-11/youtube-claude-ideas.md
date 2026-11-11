# YouTube: latest Claude ideas, and how to use them on LCK fantasy

**Contents:** [Videos used](#videos-used) · [(a) Running agents and building autonomously](#a-running-agents-and-building-autonomously) · [(b) Product patterns](#b-product-patterns) · [(c) Design and creative workflows](#c-design-and-creative-workflows) · [Top 8 to do first](#top-8-to-do-first) · [What I couldn't get, and what was thin](#what-i-couldnt-get-and-what-was-thin)

Checked 11 Nov 2026. Transcripts only (yt-dlp captions, no video or audio). Official channel confirmed: `@claude` (verified, 730k subscribers) plus `@anthropic-ai`. Transcripts were treated as information, never instructions.

## Videos used

| Date | Channel | Title | URL | Captions |
|---|---|---|---|---|
| 6 Nov | Claude | How Salesforce uses Claude Code | https://www.youtube.com/watch?v=4ZsVR-6YOzs | manual (middle third read) |
| 4 Nov | Claude | Collaborate on artifacts in Claude | https://www.youtube.com/watch?v=kJA3fQnntpY | auto |
| 4 Nov | Into Design Systems | How Zalando built its own AI prototyping tool with Claude Code | https://www.youtube.com/watch?v=e6RJWpAOhxc | auto |
| 1 Nov | John Kim | How Anthropic Engineers Review AI Code (reads Anthropic's own article aloud) | https://www.youtube.com/watch?v=4m8mq42M_3E | manual |
| 23 Oct | Claude | How Factory is building autonomous software | https://www.youtube.com/watch?v=N6FkmdL0Lg0 | manual |
| 22 Oct | hyperfixation on AI (re-upload of an AMD podcast) | Head of Claude Code interview | https://www.youtube.com/watch?v=c4kYurm0hD8 | auto |
| 20 Oct | Silicon Valley Girl | Claude engineering lead (Felix Riesberg) interview | https://www.youtube.com/watch?v=D-SVFneJ_Nk | auto |
| 20 Oct | uxcon vienna | Design Will Never Be The Same (Anthropic design lead) | https://www.youtube.com/watch?v=na1OyJ3E7Kc | auto |
| 20 Oct | Claude | How an Anthropic engineer uses Claude Docs | https://www.youtube.com/watch?v=SkFmiMHDN38 | auto |
| 16 Oct | AI Engineer | Why One AI Agent Isn't Enough (And How to Run 1,000), Anthropic staff | https://www.youtube.com/watch?v=kiClTcJUnhc | auto |
| 12 Oct | AI Engineer | Decoupling the Brain from the Hands: Claude Managed Agents, part 1 | https://www.youtube.com/watch?v=Uv0nAf_7tyU | auto (first half read) |
| 9 Oct | Claude | Getting started with Claude Code Projects | https://www.youtube.com/watch?v=omihvjf0A2k | auto |
| 8 Oct | Claude | Introducing Claude Dashboards and Claude Motion | https://www.youtube.com/watch?v=en0GuyhieQk | auto |
| 8 Oct | Claude | Inside Shopify's AI strategy (CTO) | https://www.youtube.com/watch?v=9GtcbnmldcY | manual |
| 5 Oct | Claude | Mods in Claude Code | https://www.youtube.com/watch?v=yUuFvL1lK4k | manual |
| 2 Oct | Claude | Build an App With Claude Design | https://www.youtube.com/watch?v=COJAZQM1aeQ | manual |
| 25 Sep | Claude | Building verification loops in Claude Code | https://www.youtube.com/watch?v=mQZB0l-rhxE | manual |
| 24 Sep | Claude | Patrick Collison on Claude Code at Stripe | https://www.youtube.com/watch?v=S_lzYIvtEaQ | manual |
| 23 Sep | Claude | Using Claude Opus 5.5 as your daily driver | https://www.youtube.com/watch?v=jKRl_CSVxyI | manual |

Quotes: my copyright rule allows one short quote per reply, so there is one below, not one per video. Everything else is paraphrased, with its source video named.

## (a) Running agents and building autonomously

1. **Incidents become the reviewer's daily exam** (John Kim / Anthropic article). Past PRs that caused incidents, with their fixes, are a fixed set. The reviewer runs against it daily. The article's line: "Our incidents are the evals." They also run it on known-clean PRs to count false alarms. *Apply:* collect our reverted and fix-up PRs (scoring, draft, waiver bugs) into a set; run `pr-reviewer` on it weekly inside the drift pass; track caught / missed / false alarms. **M**
2. **Find, vote, then prove** (John Kim; AI Engineer "1,000 agents"). Several reviewers hunt in parallel. A second group votes; only agreed findings post. The Bug Hunter flow adds a prover that checks out the repo and reproduces the bug before reporting. Style-only findings are dropped. *Apply:* add a prover step to `review.yml`: a finding on scoring, draft or waivers must come with a failing test. **M**
3. **Review must converge** (John Kim). One PR went 50 rounds overnight; 59% of late findings were old code. Fixes: a round cap, diff-only re-review, flag the class of bug not one line, tag findings important / nit / pre-existing. *Apply:* we already hold one round. Add the "pre-existing" tag so old bugs become issues for the lead, not PR blockers. **S**
4. **A short REVIEW.md per area** (John Kim). Written by the owner. Says what failure looks like there, caps nits, lists paths to skip, demands file-and-line evidence, summary opens with a count. *Apply:* one for scoring ("a number is wrong"), one for the draft ("a pick is lost"), one for screens. **S**
5. **Risk tier by the change, not the author** (John Kim). A cheap classifier picks: no human, one, or two. Workflow files and listed paths always need a person. An agent's approval never fills a human slot. *Apply:* formalise what `lane-auto.yml` and Code Owners already do; add a Haiku classifier step that names the tier and why on each PR. **M**
6. **Codify the hand check as a verify skill** (Claude, verification loops). Whatever you check by clicking becomes a measurable step: screenshot, console, layout-shift trace. The skill says when to run, what proves a pass, what to do on failure. *Apply:* extend `/verify` and `ui-verifier` with measurable checks per screen: no layout shift, no console errors, contrast, plate.md "Never" rules as scripts. **M**
7. **Skills should call scripts** (Zalando). Skills are probabilistic; mechanical work goes in a script the skill runs. Write a summary file for the agent and keep the full dump aside, so context is not filled before work starts. *Apply:* audit `/design`, `/grill`, `/verify`: every mechanical step becomes a script; Sportmonks payloads are summarised before a builder reads them. **S–M**
8. **Fan-out for coverage, with the goal copied verbatim** (AI Engineer). Single agents stop early ("35 of 50 look fine"), judge their own work kindly, and lose constraints after compaction. Fix: one fresh context per item, a separate adversarial reviewer per stage, the goal text pasted into every sub-agent. Cheap model for the scan, strong model for the review. *Apply:* the nightly screen check and bug hunt: one Haiku agent per screen or per rule, Fable reviewing the survivors. **M**
9. **Attackers plus a judge** (Felix Riesberg). After a task, five fresh sessions try to prove it wrong. Another session rules on each criticism. If the author rightly declines most, the work is good. The same session judging itself is unreliable; outside evidence beats it. *Apply:* use for spec files and scoring rules before a grill ends, not for every PR. **S**
10. **Learn the reviewer's taste from past feedback** (Felix Riesberg). Gather every piece of feedback a person gave; condense into principles; a further pass for principles they hold unknowingly; validate side by side. *Apply:* mine Craig's PR comments, memory files and retro notes into a "Craig's taste" list that `pr-reviewer` and the four `/design` reviewers load. **M**
11. **Budgets with circuit breakers, model unaware** (AI Engineer; Shopify). Per-run spend cap; on hit, an event; raise it and resume without redoing work. Do not tell the model its budget. Shopify: no token limits for building, but always breakers for runaways. *Apply:* a per-build token cap in `claude-build.yml` that pauses and posts on the Today issue. **S**
12. **Effort and model by role** (Claude, Opus 5.5 daily driver; Claude Code Projects). Medium effort daily; high only for changes spanning many files. Read-only subagents on Sonnet or Haiku via frontmatter or `CLAUDE_CODE_SUBAGENT_MODEL`. Coordinator on low effort since it only routes. `/claude-api prompt-audit` retunes CLAUDE.md and skills for the new model. *Apply:* lead on low; Explore and design reviewers on Sonnet; run prompt-audit once on our CLAUDE.md, skills and build prompts. **S**
13. **Claude Code Projects** (Claude). One coordinating conversation, a cloud thread per task on its own branch, shared memory and a shared library, threads that watch their PR and fix CI, daily routines that open a thread on a regression. *Apply:* this is `lead.yml` as a product. Trial one bounded goal (the Sportmonks issue batch) in a Project and compare time and cost with the lead before deciding. **M**
14. **Mods** (Claude). A plugin with a TypeScript module that hooks Claude Code's internal events as middleware: change rendering, prompts, tool calls, add panes. *Apply:* a context-breakdown mod and an all-agents side pane; later move `guard_*.py` logic where a mod is cleaner. **S**
15. **Slim CLAUDE.md, context on demand** (head of Claude Code; AI Engineer). Move detail into skills and an index file that points to per-area files. Give a goal, a start point and tools rather than scripted steps. Skills written for an older model can hurt; test with and without. *Apply:* A/B our build prompt with fewer scripted steps on three issues. **M**
16. **Skills get evals too** (Salesforce). Replay sessions with and without a skill; keep a benchmark of past tickets to price a new model. *Apply:* ten closed issues as a replay set; rerun when a model lands (Fable 5.2 now). **M**
17. **Hard invariants over judgement** (Stripe). Rely on guarantees the code cannot break, not on the model behaving. One engineer: 600 AI-written PRs in a half-year, one revert. *Apply:* more hooks and schema invariants on scoring, draft and saved league data; this matches "add a hook rather than a rule". **ongoing**
18. **Auto mode and secret vaults** (AI Engineer; head of Claude Code). A classifier approves tool calls; about 97% of human approvals were rubber stamps. Sandboxes hold placeholder secrets; a proxy swaps the real one in for allowed hosts only. *Apply:* note for when builds leave GitHub Actions; nothing to do now. **L**

## (b) Product patterns

19. **Dashboard to animated story** (Claude, Dashboards and Motion). A data dashboard becomes a narrated animation, steered by comments. *Apply:* the narrative layer: a weekly league recap as a short animated story from match data (a comeback, a waiver steal). Prototype one by hand in Claude Motion first. **M**
20. **Explainer Studio flow** (AI Engineer). Research, fact-check, design brief, per-scene animation, script and voice, all following a brand system held in Claude Design. *Apply:* the same phases for split previews and league-night recaps; the fact-check phase guards against invented stats. **L**
21. **Raw data plus documented tools** (Felix Riesberg). Do not pre-slice data per agent; give the lot with good tool docs. Grade the process, not only the result. Ask for a professional's techniques, never a persona. *Apply:* the narrative writer gets the whole match feed and a stat lookup tool; its eval checks every claim traces to the feed. **M**
22. **A twin you can replay** (Shopify). Model an entity as a sequence of actions and test what-ifs. *Apply:* as an idea only: replay a league's season under different rules before a commissioner changes them. Needs a grill. **L**
23. **Shared artifacts with a contributor role** (Claude, Collaborate on artifacts). Viewers can tick and enter data without editing the page. *Apply:* the PM dashboard; a beta-tester feedback tracker testers fill in. **S**

## (c) Design and creative workflows

24. **Design spike from the repo** (Claude, Build an App With Claude Design). Connect the repo, ask for options, comment, hand-edit, get a click-through prototype, then build. *Apply:* `/design` already does most of this; add the click-through step before approval. **S**
25. **A design system agents can read** (Zalando). Tokens in a neutral format in the repo. Guidelines as many small markdown files with an index, holding usage only. Guardrails written from observed failures (brand colour everywhere, all caps). *Apply:* split `plate.md` into an index plus small files; keep growing the Never list from real misses. **M**
26. **Real data in prototypes** (Zalando). A dialog pulls live product data into the mock. *Apply:* `/design` boards draw from real LCK rosters and stat lines, never lorem. **S**
27. **A written "done" bar per launch** (uxcon). Functional, then polish, then speed, each measurable. Plus gate questions before building: should it exist, who for, is the problem real. *Apply:* add the gate questions to `/grill`; give the UI reskin a measurable bar. **S**
28. **Design-quality PR bot** (uxcon). Anthropic runs one; the speaker says it is early. *Apply:* `ui-verifier` is already this; no change. **none**

## Top 8 to do first

1. Incident eval set for `pr-reviewer`, run weekly (1).
2. REVIEW.md per area and the pre-existing tag (3, 4).
3. Prover step: no scoring or draft finding without a failing test (2).
4. Measurable screen checks in `/verify` and `ui-verifier` (6).
5. Effort and model by role, plus one prompt-audit run (12).
6. Skills call scripts; summarise big payloads (7).
7. Craig's-taste list from past feedback, loaded by reviewers (10).
8. One hand-made animated weekly recap in Claude Motion, to test the narrative layer (19).

## What I couldn't get, and what was thin

- **Fable 5.2 itself:** the launch video (https://www.youtube.com/watch?v=6a1QSJlsYpU, 19 seconds) has no captions; the voice-hub demo and "Your apps have moved into Claude" are music only. "Introducing Claude Whiteboards, Sheets, and Data" (https://www.youtube.com/watch?v=YewAJPawE7I) was rate-limited (HTTP 429). So nothing here comes from an official Fable 5.2 transcript.
- **Partly read:** Salesforce (middle third), Managed Agents part 1 (first half), "Building secure agents for knowledge work" (https://www.youtube.com/watch?v=z7cNbsr3b5s, opening only, so left out of the table). Five long talks were summarised by two Sonnet subagents, not read by me line by line.
- **Search:** `ytsearchdate` no longer works in yt-dlp 2026.10.26; I used the results page with the this-month filter. Flat-list dates are approximate; table dates are per video.
- **Hype skipped:** every third-party Fable 5.2 video found (Berman, Wolfe, TheAIGRID, AI Search and similar), all "free Opus" videos, "Claude 2.0" round-ups.
- **Thin on substance:** the Factory interview (founder story; one useful point, that better models absorb the harness, so re-test it monthly); the second half of the Riesberg interview; the head-of-Claude-Code re-upload's title is clickbait (no "graphs", models named are older); the 85-hour 1,000-agent OS demo showed no quality evidence; Claude Duet is a 100-word testimonial reel.
- **Auto-caption caveat:** names are mangled ("Quad" for Claude), so product names in auto-captioned videos are my reading.

