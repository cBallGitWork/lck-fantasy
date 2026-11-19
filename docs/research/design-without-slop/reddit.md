# Claude UI design without slop: what Reddit users report (2025-2026)

**Contents:** [What people put in CLAUDE.md / DESIGN.md / design-system files to stop AI slop](#what-people-put-in-claudemd--designmd--design-system-files-to-stop-ai-slop) · [Skills and plugins: which are rated, which do nothing](#skills-and-plugins-which-are-rated-which-do-nothing) · [Reference-driven workflows](#reference-driven-workflows) · [Visual feedback loops](#visual-feedback-loops) · [Claude Design vs Claude Code for design](#claude-design-vs-claude-code-for-design) · [Model differences for design](#model-differences-for-design) · [Data-dense app UI vs marketing landing pages](#data-dense-app-ui-vs-marketing-landing-pages)


> **Read this first: access limit.** Reddit could not be read directly in this run. WebSearch refuses `reddit.com` ("domains are not accessible to our user agent"), WebFetch "is unable to fetch from www.reddit.com", a curl to Reddit's JSON was denied by the session's permission classifier, and Claude in Chrome blocks reddit.com ("not allowed due to safety restrictions"). Mirrors were not tried, because they would be a way round a block. So **almost nothing below is first-hand Reddit evidence**. It comes from blogs, GitHub repos and reviews that sometimes quote Reddit. Only two Reddit permalinks were found, both second-hand, through the awesome-claude-design repo. Thread counts and upvotes per practice are **not available**. A human with a browser, or a tool allowed to read Reddit, should check these findings against Reddit before relying on them.

## What people put in CLAUDE.md / DESIGN.md / design-system files to stop AI slop

### Takeaway
The anti-slop lists that circulate agree closely. Ban Inter/Roboto/Arial/system fonts, purple-to-indigo gradients, a centred hero with three-up cards, glassmorphism, card-in-card nesting and Lucide icon stacks. Pair the ban list with a positive DESIGN.md: a named aesthetic, tokens as CSS variables, and a fixed font stack. A ban list alone is reported to only shift the slop to a different default.

### Cited Findings
- Anthropic's frontend-aesthetics cookbook (21 Oct 2025, by Prithvi Rajasekaran) is the root source most lists copy. It says models "converge toward generic, 'on distribution' outputs" and gives three counter-strategies: target specific design dimensions, reference named inspirations, and explicitly call out the defaults to avoid. — [theadpharm, 1 May 2026](https://www.theadpharm.com/insights/claude-design-without-the-ai-slop-look)
- The cookbook's base fragment, as reproduced: avoid overused fonts (Inter, Roboto, Arial, system fonts), clichéd colour schemes, predictable layouts and cookie-cutter components; use brand-specific fonts, cohesive colours, purposeful animation and context-specific character. — [awesome-claude-design](https://github.com/rohitg00/awesome-claude-design)
- Fuller ban list, paraphrased from theadpharm:
  - Fonts: Inter, Roboto, Arial and system fonts. Space Grotesk is named as the next fallback the model reaches for.
  - Colour: purple gradient on white, pastel rainbow accents, indigo-to-violet hero washes.
  - Layout: centred hero, three-up feature cards, logo walls, pricing toggles, FAQ accordions.
  - Effects: generic glassmorphism, soft drop shadows, animated gradient blobs.
  - Components: shadcn-style default cards, Tailwind-default rounded buttons.

  Positive rules on the same list: a cohesive palette in CSS variables, dominant colours with sharp accents, and one orchestrated page-load motion. — [theadpharm](https://www.theadpharm.com/insights/claude-design-without-the-ai-slop-look)
- "Second-order slop": once you ban purple and Inter, Claude Design falls into its own default look. The repo lists each tell with a counter-rule:
  - Teal accent everywhere → pick a brand accent in DESIGN.md first.
  - Blinking status dot → forbid animated status indicators.
  - "Container soup" → cap nesting at two levels.
  - Default serif headline → specify font stack, weight and tracking.
  - Left accent bar on every card → reserve it for one semantic role.
  - Three-column hero feature grid → use another layout.
  - Lucide icon stack → one icon family, or type only.
  - Hero images that ignore tokens → constrain generation to DESIGN.md colours.

  — [awesome-claude-design](https://github.com/rohitg00/awesome-claude-design)
- The avoid-ai-design repo targets both the purple-gradient slop and the "tasteful" defaults that replace it: cream + terracotta, and mono chrome. — [funboy322/avoid-ai-design](https://github.com/funboy322/avoid-ai-design)
- Other lists also flag:
  - centred hero "floating in space" with one call to action
  - rows of three or six identical rounded cards
  - nested cards
  - gradient headline text
  - bounce or elastic easing
  - neon glow

  — [sailop anti-slop template](https://sailop.com/blog/anti-slop-prompt-template-2026); [925studios](https://www.925studios.co/blog/ai-slop-design-tells)
- Placebo rule: theadpharm calls "never converge across generations" placebo, because the model has no memory between sessions. Use per-generation theme locks and named aesthetic families instead. — [theadpharm](https://www.theadpharm.com/insights/claude-design-without-the-ai-slop-look)
- Test for a DESIGN.md: generate the same page with three different brand systems. If the outputs look alike, the file isn't being applied. — [theadpharm](https://www.theadpharm.com/insights/claude-design-without-the-ai-slop-look)
- Origin theory for purple: Tailwind's default indigo spread through tutorials and training data. The blog's "~90%" rate is its own estimate, not a measurement. — [chaiovercode Substack](https://chaiovercode.substack.com/p/why-does-ai-make-everything-blue)

### Inferences
- Lists that are only bans move the model to the next most likely default: Space Grotesk, cream/terracotta, teal, serif headlines. A working file needs both bans and positive commitments: exact fonts, hex tokens, a nesting cap and an icon family.
- All of these lists are about marketing pages. None addresses the tells of a data-dense app, such as stat tiles, KPI rows or sparkline cards.

### Gaps
- No Reddit-sourced CLAUDE.md quotes, thread counts or upvotes could be gathered (access blocked).
- I didn't check the claim that Anthropic's cookbook names these defaults against Anthropic's own page; it comes through secondary blogs.

## Skills and plugins: which are rated, which do nothing

### Takeaway
Anthropic's frontend-design skill is the most widely installed and the most often credited. One counter-report says it pushes towards loud, neon, overloaded UI. Taste Skill and UI UX Pro Max are the two community packs most often named. Roundups say to pick one of them as the main style engine, not both. No Reddit-backed ratings were reachable.

### Cited Findings
- frontend-design skill:
  - A Substack test found Claude Code without the plugin gave "a perfectly competent page". The plugin gave a bolder design than both that and Claude web. — [baremetaldigest](https://baremetaldigest.substack.com/p/the-design-gap-between-claude-web)
  - Snyk's roundup cites 277k+ installs (popularity, not a rating). — [awesome-claude-design](https://github.com/rohitg00/awesome-claude-design)
- Counter-evidence on frontend-design: a commenter on Habr (in Russian) said the skill pushed UI towards loud, overloaded, neon-heavy designs, and that plain Claude was more practical and minimal. — [Habr comments](https://habr.com/en/articles/1011524/comments)
- Taste Skill (Leonxlnx/taste-skill): a pack for layout, typography, motion and spacing, with three dials (variance, motion, density), style variants and a redesign-audit skill. One guide claims 99.2k GitHub stars (not checked). — [claudecodeclub](https://www.claudecodeclub.ai/free-resources/5-free-repos-claude-design-skills); [awesome-claude-design](https://github.com/rohitg00/awesome-claude-design)
- UI UX Pro Max is a searchable reference library: 50+ styles, 97 palettes, 57 font pairings, 99 UX guidelines, 25 chart types. Its pitch is that it replaces Claude's guess with a researched design system matched to your industry. — [claudecodeclub](https://www.claudecodeclub.ai/free-resources/5-free-repos-claude-design-skills)
- Advice from the same guide: use one of UI UX Pro Max and Taste Skill as the main style engine, not both. — [claudecodeclub](https://www.claudecodeclub.ai/free-resources/5-free-repos-claude-design-skills)
- Other named skills, without ratings:
  - Dammyjay93/interface-design (formerly claude-design-engineer, ~1.1k stars)
  - OneRedOak design-review (subagents plus Playwright accessibility checks)
  - ComposioHQ canvas-design
  - Hallmark (one-command slop audit)
  - avoid-ai-design (includes a zero-dependency scanner)

  — [awesome-claude-design](https://github.com/rohitg00/awesome-claude-design); [dev.to Hallmark](https://dev.to/rams901/hallmark-stop-ai-generated-ui-slop-in-one-command-in-2026-3p9n); [avoid-ai-design](https://github.com/funboy322/avoid-ai-design)

### Inferences
- The density dial in taste-skill matters most for a product UI. UI UX Pro Max's chart types are the only skill content found that touches data views.
- Star and install counts measure popularity, not quality. No head-to-head test was found.

### Gaps
- No Reddit "this skill does nothing" threads could be checked. The question of which skills are placebo stays open.

## Reference-driven workflows

### Takeaway
The approaches people cite most:
- Name two aesthetic families or brands to remix, not one.
- Write or borrow a DESIGN.md of tokens.
- In Claude Design, ingest the codebase so the design system is inferred from it.

Figma MCP is used to pull tokens into Claude Code.

### Cited Findings
- Remix two named aesthetic families or brands. Prompt with four inputs: goal, layout, content, constraints. Name specific components. — [theadpharm](https://www.theadpharm.com/insights/claude-design-without-the-ai-slop-look)
- The DESIGN.md library pattern: prompts by aesthetic family, plus remix recipes. One example, "personal dashboard OS in two prompts" (Jerrod Lew), is cited as evidence that one good DESIGN.md carries a lot. — [awesome-claude-design](https://github.com/rohitg00/awesome-claude-design)
- A data-dense dashboard DESIGN.md template exists. — [designmd.app](https://designmd.app/library/data-dense-dashboard)
- Claude Design can pull brand systems from a codebase or design files. The inferred system "can mis-deduce edge cases", so review the tokens before locking them. — [Wikipedia](https://en.wikipedia.org/wiki/Claude_(language_model)); [awesome-claude-design](https://github.com/rohitg00/awesome-claude-design)
- Designers use Figma MCP so Claude Code pulls the latest tokens. — [designwithai Substack](https://designwithai.substack.com/p/how-designers-can-use-claude-code)

### Inferences
- Codebase ingestion is expensive in Claude Design (see below). A hand-written DESIGN.md is the cheaper route to the same token lock.

### Gaps
- No Reddit evidence on Mobbin or Dribbble workflows was reachable.

## Visual feedback loops

### Takeaway
The standard loop is: write code, screenshot with Playwright or Puppeteer MCP, compare with the target, fix the top differences, repeat. Several skills package it. Evidence is from blogs and skill pages, not Reddit.

### Cited Findings
- Sylverstudios' loop: screenshot the route with Puppeteer MCP, compare with the design file, fix the top three differences, repeat until close. — [sylverstudios Substack](https://sylverstudios.substack.com/p/how-claude-code-and-mcp-helped-me)
- A Playwright MCP design workflow has Claude list visible flaws (contrast, alignment, hierarchy) on each screenshot. — [claude-codex.fr](https://claude-codex.fr/en/mcp/workflow-design-playwright/)
- The "Eyes" skill re-screenshots the changed area after each UI change and asks for explicit confirmation. — [mcpmarket Eyes](https://mcpmarket.com/tools/skills/visual-feedback-loop-eyes)
- Review agents: OneRedOak design-review runs subagents with Playwright, and design-review does "AI-slop detection". — [awesome-claude-design](https://github.com/rohitg00/awesome-claude-design)
- Lint-style scanners: avoid-ai-design ships a zero-dependency scanner for slop tells, and Hallmark audits in one command. — [avoid-ai-design](https://github.com/funboy322/avoid-ai-design); [Hallmark](https://dev.to/rams901/hallmark-stop-ai-generated-ui-slop-in-one-command-in-2026-3p9n)
- Cost: vision tokens on Opus 4.7 are said to cost "roughly 3x equivalent text", so screenshot loops eat usage. — [awesome-claude-design FAQ](https://github.com/rohitg00/awesome-claude-design)

### Gaps
- No reports of failure rates for these loops, such as the model calling its own screenshot fine.

## Claude Design vs Claude Code for design

### Takeaway
Claude Design launched on 17 Apr 2026 on Opus 4.7. It is praised for iterating on a canvas and for element-level inline comments. It is widely criticised for burning through quota and for its own recognisable default look. The common advice is to explore in Claude Design and build in Claude Code.

### Cited Findings
- Only Reddit evidence found: the r/ClaudeAI launch thread, [reddit.com/r/ClaudeAI/comments/1so3k1y](https://www.reddit.com/r/ClaudeAI/comments/1so3k1y/), 2,293 upvotes per the repo's timeline (Apr 2026, second-hand). It holds two opposing quotes:
  - Pushback: "Just tested it. This is only hype for people that never worked with real UX/UI designers. Another slop feature that will burn tokens."
  - Hype: "Would suck to be Figma right now."

  — [awesome-claude-design](https://github.com/rohitg00/awesome-claude-design)
- r/ClaudeCode on early Opus 4.7, [reddit.com/r/ClaudeCode/comments/1so9uta](https://www.reddit.com/r/ClaudeCode/comments/1so9uta/): "$120 of API credits, by god is it bad"; there were also reports of hallucinations on long tasks (Apr 2026, second-hand). — [awesome-claude-design](https://github.com/rohitg00/awesome-claude-design)
- Quota reports:
  - "two prompts ate 95% of my weekly limit", attributed to Reddit, no link. — [awesome-claude-design](https://github.com/rohitg00/awesome-claude-design)
  - HN reports about 95% of weekly usage gone in one sitting. — [awesome-claude-design](https://github.com/rohitg00/awesome-claude-design)
  - One Max 5x user spent 70% of a week's Design budget on codebase ingestion alone. — [modeinspect](https://modeinspect.com/compare/claude-design-alternatives)
  - PCWorld: 30 minutes locked a reviewer out for a week. — [awesome-claude-design](https://github.com/rohitg00/awesome-claude-design)
- XDA review (23 May 2026):
  - Verdict: "the best feature Anthropic's launched in a while".
  - Inline element comments are "the smoothest part".
  - Separate weekly limit, out by mid-week on Max 5x.
  - Manual edits regenerate in the background and use up allowance.
  - The author's skill-driven decks in Claude itself beat dedicated AI design tools.

  — [XDA](https://www.xda-developers.com/claude-design-is-the-best-feature-anthropics-launched-in-a-while-but-it-has-some-serious-limitations/)
- Limits were later moved onto the shared Claude pool, per one comparison page, not checked against Anthropic. — [modeinspect](https://modeinspect.com/compare/claude-design-alternatives)
- Quality critics:
  - Malewicz: "The designers it replaces are not the designers you were worried about replacing."
  - HN: "competent UI, but nothing mind-blowing"; output covers "leaf nodes, not the full design lifecycle".
  - Design Better podcast: not a "Figma-killer yet".

  — [awesome-claude-design](https://github.com/rohitg00/awesome-claude-design)
- Recommended flow: iterate in Claude Design with Tweaks and inline comments, keep sessions short, use a fresh project per brand, then hand off to Claude Code for production. — [theadpharm](https://www.theadpharm.com/insights/claude-design-without-the-ai-slop-look)

### Gaps
- No direct Reddit comparison threads (Design vs Code) could be read.

## Model differences for design

### Takeaway
Thin evidence. Claude Design ships on Opus 4.7. Sonnet 4.6 "works, produces weaker systems". Early Opus 4.7 drew complaints about hallucinations on long tasks. Nothing found on Fable or Opus 5.x for design.

### Cited Findings
- "Sonnet 4.6 works, produces weaker systems"; Opus 4.7 vision costs about 3x text. — [awesome-claude-design FAQ](https://github.com/rohitg00/awesome-claude-design)
- Early Opus 4.7 quality complaints in r/ClaudeCode (second-hand, see above). — [awesome-claude-design](https://github.com/rohitg00/awesome-claude-design)
- Codex vs Claude Code on a Figma-to-code task: Claude Code captured the design better but missed the yellow theme and some details. Codex was faster and cheaper. — [aicodingdaily / composio](https://dev.to/composiodev/claude-code-vs-codex-dev-workflow-comparison-4jjf)

### Gaps
- No sources found on Fable, or on Opus 5.x, for UI design.
- No Reddit model-comparison threads reachable.

## Data-dense app UI vs marketing landing pages

### Takeaway
Almost all the anti-slop material targets marketing pages: hero, feature grid, pricing, logo wall. Product UI advice is scarce. What exists says:
- density follows the task
- tables and sparklines over decorative charts
- every stat needs a comparison
- colour only for state

### Cited Findings
- Marketing-page tells: centred hero, three-up features, logo walls, pricing toggles, FAQ accordions, gradient blobs. — [theadpharm](https://www.theadpharm.com/insights/claude-design-without-the-ai-slop-look)
- For product or data UI:
  - A bare stat card is "almost meaningless"; add a comparison, target, trend or status.
  - Save strong colour for states and alerts.
  - Use sparklines next to key figures.
  - Dense rows are 36-40px, against 48-52px for comfortable scanning.
  - Cut metrics that don't trigger action.

  These are general design sources, not Claude-specific. — [setproduct](https://www.setproduct.com/blog/dashboard-ui-design); [atifullah](https://www.atifullah.com/blog/dashboard-design-rules); [designmd.app data-dense template](https://designmd.app/library/data-dense-dashboard)
- Container soup and accent bars on every card are Claude Design tells that matter most in app UI. Counter-rules: cap nesting at two levels, one semantic role for an accent bar. — [awesome-claude-design](https://github.com/rohitg00/awesome-claude-design)
- Taste Skill's density dial is the only skill control aimed at density. — [awesome-claude-design](https://github.com/rohitg00/awesome-claude-design)

### Inferences
- For a data-dense product, the marketing ban list (hero, feature grid) barely applies. What applies:
  - nesting cap
  - no stat-tile rows without comparison
  - one accent role
  - fixed row heights
  - tabular numbers
  - a screenshot loop against an approved picture

### Gaps
- No Reddit threads on Claude for dashboards or product UI were reachable. This split needs first-hand Reddit evidence before it is trusted.
