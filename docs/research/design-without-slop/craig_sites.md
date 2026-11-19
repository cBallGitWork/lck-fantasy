# Craig's five bookmarked design sites, judged for an anti-slop design template

**Contents:** [1. Oversight Supply: Sections (supply.madebyoversight.com/sections)](#1-oversight-supply-sections-supplymadebyoversightcomsections) · [2. GradientDeck UI (ui.gradientdeck.com)](#2-gradientdeck-ui-uigradientdeckcom) · [3. Subframe Motion (www.subframe.com/motion)](#3-subframe-motion-wwwsubframecommotion) · [4. Shipframe (getshipframe.com)](#4-shipframe-getshipframecom) · [5. Impeccable by Paul Bakaus (impeccable.style)](#5-impeccable-by-paul-bakaus-impeccablestyle) · [Overall ranking for the anti-slop template](#overall-ranking-for-the-anti-slop-template)


Context for the reader: the team wants a reusable template that stops Claude producing generic "AI slop" UI, for a data-dense product app (Flol, a fantasy LCK game: desktop first, mobile a priority, maybe native later). Pages were read on 18 Nov 2026 by fetch only; nothing was signed up for, bought or submitted.

## 1. Oversight Supply: Sections (supply.madebyoversight.com/sections)

### Takeaway
A paid-and-free library of 70 copy-paste website sections delivered as prompts with source code for AI builders (Claude Code listed). It is marketing-page material (heroes, pricing, 404s, scroll stories); almost nothing transfers to a data-dense game app, and it would push Claude towards landing-page tropes, not away from them.

### Cited Findings
- Maker: OversightStudio, LLC (footer, © 2026, info@madebyoversight.com). Same studio makes Shipframe (site 4). — [Oversight Sections](https://supply.madebyoversight.com/sections); [Shipframe](https://getshipframe.com/)
- Page claim: "70 sections · 41 free to copy." Categories: portfolio heroes, hero sections, scroll stories, pricing sections, 404 pages, template sections ("Studio Original" plus "Template section · From Evergrid"). — [Oversight Sections](https://supply.madebyoversight.com/sections)
- Workflow: pick a section, copy the prompt and code, paste into a builder; each prompt includes "the section's full source code". Builders listed: Claude Code, Cursor, v0, Windsurf, Lovable, Bolt. — [Oversight Sections](https://supply.madebyoversight.com/sections)
- Free sections need an account; Pro needs the Sections plan, "$15/mo", "cancel anytime". — [Oversight Sections](https://supply.madebyoversight.com/sections)
- Plans: Sections $15/month (every Pro section, 1 template credit a month); Sections + Templates $39/month (3 template credits, Webflow and Framer templates, Figma source "where available"); Lifetime $499 one-time; separate "Video skills" $9.99/month or $79.99/year. "Keep everything you unlock, even after cancelling." — [Oversight pricing](https://supply.madebyoversight.com/pricing)
- Licence: personal and client projects allowed; "No redistribution or resale of the template files". Refund wording conflicts: 14-day full refund on the plan vs "an unlocked design cannot be returned". — [Oversight pricing](https://supply.madebyoversight.com/pricing)
- Neither page states the framework of section code (React, Tailwind, HTML not named); templates are described as "clean semantic markup" with a "Copy Prompt" option. — [Oversight pricing](https://supply.madebyoversight.com/pricing)
- No Claude skill, DESIGN.md or design-system file is offered for sections. — [Oversight Sections](https://supply.madebyoversight.com/sections)

### Inferences
- Plugs in only as a one-off paste of a prompt into Claude Code; nothing persistent (no skill, rules, tokens). Not a template ingredient.
- Hero sections, scroll stories and pricing blocks are exactly the patterns Impeccable's detector flags as slop (badge above headline, oversized hero headline, hero metric layout). Useful at most for a future Flol marketing/landing page, not the app.
- Pro content is paywalled ($15/month); unread.

### Gaps
- Code format of a section and its licence for copied code are not stated on the pages read; the Terms page was not read.

## 2. GradientDeck UI (ui.gradientdeck.com)

### Takeaway
A free, no-account library of 1,295 DESIGN.md files, each extracted from a real website, meant to be dropped into a repo so Claude Code, Codex or Cursor builds in that site's colours, type and rules. Useful as reference and as a format example; risky to adopt wholesale (copies another brand's look, no licence stated).

### Cited Findings
- Claim: "Copy any site's DESIGN.md into your repo, and Claude Code, Codex or Cursor builds with its colors, type and rules." 1,295 files: 885 light, 275 dark, 135 mixed. "Free, no account." — [GradientDeck UI](https://ui.gradientdeck.com)
- Extras: browse by palette (/palettes) and typeface (/typefaces), an "Extended DESIGN.md" per site, agent endpoints /library.json and /llms.txt, "Request a site". — [GradientDeck UI](https://ui.gradientdeck.com)
- Maker not named beyond "© 2026 GradientDeck UI"; no licence stated. — [GradientDeck UI](https://ui.gradientdeck.com)
- Sample (Mollie): no YAML frontmatter, just a "**Theme:** light" line; H2 sections Colors, Typography, Spacing & Layout, Components, Do's and Don'ts, Elevation, Surfaces, Imagery, Layout, Similar Brands; colours as Name / Value / Role tables; about 180 lines. It admits "Source measurements are normalized; roles and recommendations are interpreted" and that HTML examples are reconstructions. — [Mollie DESIGN.md](https://ui.gradientdeck.com/styles/mollie/design.md)
- Its format differs from Google's DESIGN.md spec that Impeccable writes (YAML token frontmatter, eight fixed sections). — [Impeccable document](https://impeccable.style/docs/document); [Mollie DESIGN.md](https://ui.gradientdeck.com/styles/mollie/design.md)

### Inferences
- Fits a Claude workflow trivially (a markdown file in the repo, or llms.txt for an agent to search). Best use for Flol: mine dark, data-heavy sites (sports data, trading, esports) for token and density ideas, then write our own DESIGN.md. Copying one wholesale would trade "AI slop" for "someone else's brand" and conflicts with the Korean/LCK look Flol wants.
- Because the files are machine-extracted and loosely structured, Impeccable's DESIGN.md checks ("Color outside DESIGN.md" etc.) may not parse them; that is an inference, not tested.
- Suits product apps and marketing alike, since it is a token/rules file, not layouts.

### Gaps
- Licence and maker unknown; how extraction is done is not documented on pages read. Did not read /llms.txt or library.json.

## 3. Subframe Motion (www.subframe.com/motion)

### Takeaway
A free, open-source gallery of 309 React interaction and animation examples (plus WebGL shaders) from Subframe, reachable by an "Install Motion MCP" button. Unlike the others, many examples are product-UI micro-interactions (chart crosshair, range brush, rolling digits, tab rails, ledgers), so it is the most relevant of the four library sites to Flol, as a motion reference rather than a design system.

### Cited Findings
- Claims: "Really good motion design." "Open-source React animations, Motion components, and WebGL shaders available over MCP." "No account required." 309 examples in three filters: Components & interactions, Animation & motion, WebGL & shaders. — [Subframe Motion](https://www.subframe.com/motion)
- Example titles include Chart crosshair, Chart range brush, Normalized baseline, Quote tick, Filter builder, Windowed pagination, Expandable ledger, Digits on a roll, A number in motion, Status transfer, Sliding selection, Fluid tab rail, Upload queue, Notification deck. Many notes mention keyboard support (arrow keys, Home/End, Escape). No leaderboard example seen. — [Subframe Motion](https://www.subframe.com/motion)
- The page does not show the MCP install command, the MCP's tools, the code's dependencies, or a named licence (only "Open-source"); page text was truncated. — [Subframe Motion](https://www.subframe.com/motion)
- Subframe itself is a desktop app: "a design tool for your codebase, and a coding agent with a canvas"; canvas "is based on HTML & React"; Tailwind shown in inspector; "works best when used with React". Pricing: Free $0 (one project, limited AI credits, use your Claude or Codex subscription); Pro $20 per editor/month. Offers a "Subframe MCP to bring design context to your external agents". — [Subframe home](https://www.subframe.com/)
- A web search found no independent documentation of a "Subframe Motion MCP"; results were about the separate Motion (ex-Framer Motion) library's own MIT-licensed MCP and `npx motion-ai` skill. — [Motion README](https://raw.githubusercontent.com/motiondivision/motion/HEAD/README.md)

### Inferences
- Plugs into Claude Code as an MCP server Claude can query for a named interaction ("rolling number", "tab rail") and adapt; free, no account. Fits Flol's React app for points tickers, price changes, tab switches and chart inspection.
- Motion is where slop hides too (Impeccable flags bounce/elastic easing, pulsing dots, marquees); the template should still set motion rules (durations, easing, reduced-motion) and use this only as a source of patterns.
- The full Subframe app is a paid-optional design canvas; adopting it would be a tool choice for Craig, not needed to use the Motion library.

### Gaps
- Exact MCP endpoint/config, tool list, licence (MIT or other) and dependencies not visible on the fetched page; GitHub repo (github.com/SubframeApp/subframe) not read. Native (React Native) suitability unknown; examples are web React/WebGL.

## 4. Shipframe (getshipframe.com)

### Takeaway
Not a UI design resource: a browser tool for making App Store and Google Play screenshot sets, by Oversight Studio. Irrelevant to the anti-slop template; possibly useful much later if Flol ships a native app.

### Cited Findings
- "Turn raw screenshots into a polished App Store and Google Play set in minutes, right in your browser." "Shipframe is a product of Oversight Studio." — [Shipframe](https://getshipframe.com/)
- Offers "16 hand-tuned themes" (3 colour variants each), eight store export sizes in one ZIP (e.g. iPhone 6.9" 1320 × 2868, iPad 13" 2064 × 2752, Android 1080 × 1920) as flat RGB PNGs, device frames, 86 "glossy 3D objects", mesh gradients. "Everything renders on your device." — [Shipframe](https://getshipframe.com/)
- Pricing: Free (one export size, watermark); Pro "$19 one-time", "No subscription"; 14-day money-back. Checkout via oversight.lemonsqueezy.com. — [Shipframe](https://getshipframe.com/)
- No templates, components, design systems, skills, prompts or Claude files mentioned. — [Shipframe](https://getshipframe.com/)

### Inferences
- No place in a Claude Code / Claude Design workflow; it is a manual store-listing tool. Park it until a native app exists.

### Gaps
- None material to the question.

## 5. Impeccable by Paul Bakaus (impeccable.style)

### Takeaway
The only one of the five built for the stated goal: a free, Apache-2.0 design skill plus CLI for coding agents (Claude Code included) with 24 commands, a deterministic anti-slop detector (62 rules plus 6 design-review patterns), hooks that check every UI edit, and two context files it writes: PRODUCT.md (users, purpose, constraints) and DESIGN.md (Google's DESIGN.md format). It is the strongest candidate to be the backbone of the template, with caveats: web-only detector, telemetry on by default, and hooks that run outside model approval.

### Cited Findings

Who, licence, scale
- "Created by Paul Bakaus." Tagline "The missing design vocabulary for agents." — [Impeccable](https://impeccable.style/)
- "Impeccable's public skills, commands, CLI, and detection engine are free and open source", Apache 2.0; model/provider usage costs are separate. — [Impeccable FAQ](https://impeccable.style/faq); [GitHub](https://github.com/pbakaus/impeccable)
- GitHub showed 112.7k stars, 6.7k forks at read time. "Impeccable started from Anthropic's frontend-design skill." — [GitHub](https://github.com/pbakaus/impeccable)

Install routes
- `npx impeccable install` in the project (main route), then `/impeccable init`, then `/impeccable hooks on`. — [Impeccable](https://impeccable.style/)
- `npx skills add pbakaus/impeccable` ("Installs the shared skill"); Claude Code plugin: `/plugin marketplace add pbakaus/impeccable` then install from `/plugin`; ChatGPT/Codex plugin; built into GitHub Copilot (Settings → Experimental). Updates: `npx impeccable update` / `npx skills update impeccable`. — [Impeccable](https://impeccable.style/)
- Also: VS Code extension (skill without hook), Grok plugin, git submodule pinned for a team with `npx impeccable link`, manual copy (no Node; skips hook and subagents), Chrome extension. — [GitHub](https://github.com/pbakaus/impeccable)

Commands (24, grouped as on the docs page)
- Create: `/impeccable <request>` (e.g. "design a signup page…"), shape ("Turns an idea into a design brief"). Evaluate: audit ("Finds implementation problems and prioritizes the fixes"), critique. Refine: animate, bolder, colorize, delight, layout, overdrive, quieter, typeset. Simplify: adapt ("work on a different screen, device, or platform"), clarify, distill. Harden: harden ("usable when data, connections, or actions go wrong"), onboard, optimize, polish. System: document, extract ("Turns repeated UI patterns into shared components and styles"), generate (compare variations), init, live (Live Mode: pick elements in the running app and steer). — [Impeccable docs](https://impeccable.style/docs)
- README says the 24th command is a deprecated alias; audit covers accessibility, performance, theming, responsiveness; critique is a "scored UX review". — [GitHub](https://github.com/pbakaus/impeccable)

Detector
- "The catalog includes 62 detector rules and 6 patterns for design review." Modes: Source (no browser), Browser (rendered page via URL or Chrome extension), Design review (via critique). — [Impeccable slop catalogue](https://impeccable.style/slop)
- Rule groups: Your design system (4: font, colour, radius, font size "outside DESIGN.md"); Visual details (9, e.g. side-tab accent border, hairline border with wide shadow, glassmorphism, decorative grid lines); Typography (13, e.g. label above a heading, badge above main headline, oversized hero headline, italic serif display, "Overused font" such as Inter or Geist, flat hierarchy, tiny interface text); Colour (7, e.g. "AI color palette" of purple gradients and cyan on dark, gradient text, glowing dark-mode accents, cream/beige palette, gray text on colour); Layout (12, e.g. nested cards, identical card grids, hero metric layout, tiny numbered section labels, monotonous spacing, overflow, clipped popovers); Motion (4: pulsing status dot, blinking cursor, marquee, bounce/elastic easing); Copy (5: em-dash overuse, generic marketing claims, "not X, Y" forced contrast, "theater", repeated text); Imagery (4); General quality (10: low contrast vs WCAG AA, skipped heading level, tight line height, tiny body text, JS errors on load, etc.). — [Impeccable slop catalogue](https://impeccable.style/slop)
- "A finding is a reason to look closer: consider the page, the task, and any intentional design choices." — [Impeccable slop catalogue](https://impeccable.style/slop)
- CLI: `npx impeccable detect src/` or `npx impeccable detect http://localhost:3000`; JSON and GitHub-annotation output; exit code 2 = findings, 1 = could not scan; "No LLM, no API key." — [GitHub](https://github.com/pbakaus/impeccable); [Impeccable slop catalogue](https://impeccable.style/slop)

Hooks (Claude Code)
- PostToolUse after edits (broken images, overflow, legibility, gradient text, glow, design-system drift); Stop at turn end (broader check of touched UI files, de-duplicated). Installed into `.claude/settings.local.json`. File types: .tsx, .jsx, .html, .vue, .svelte, .astro, .css, .scss, .sass, .less, .ts, .js. Skipped when PRODUCT.md declares `ios`, `android` or `adaptive`. — [Impeccable hooks](https://impeccable.style/docs/hooks)
- Off switches: `/impeccable hooks off`, `npx impeccable install --no-hooks`, `IMPECCABLE_HOOK_DISABLED`. Config in `.impeccable/config.json` (`hook.perEditRules: "all"`, `hook.auditLog`), local overrides in gitignored `.impeccable/config.local.json`. Exceptions with reasons: `/impeccable hooks ignore-value overused-font Inter --reason "Brand font"`, which also applies to manual scans. — [Impeccable hooks](https://impeccable.style/docs/hooks)

Files it writes
- PRODUCT.md, by `/impeccable init`: reads the project first, confirms audience, situation, purpose, constraints, writes agreed facts and marks open decisions. Example headings (explicitly "a fictional example, not a required file template"): Users, Purpose, Constraints, Evidence on hand. init "does not choose a new palette or write DESIGN.md". Rerunning should "avoid reopening settled decisions". — [Impeccable init](https://impeccable.style/docs/init)
- DESIGN.md, by `/impeccable document`: follows the [Google Labs DESIGN.md spec](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md); YAML frontmatter holds token values (example `colors.action: "#263c32"`), Markdown body explains usage; eight sections in order: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts; keep generated headings so tools recognise them. Also writes `.impeccable/design.json` for Live Mode. `--seed` mode for projects with no visual system yet: runs a "direction workshop" and writes a marked starting record, no full token library. — [Impeccable document](https://impeccable.style/docs/document)

Designing approach
- Sorts work by "What did the visitor come to do?": Persuade (landing, pricing), Operate (dashboards, editors: "Make frequent actions easy to find and carry out"), Read, Experience. Mockup-first needs image generation and "loses detail"; code-first "builds within its natural visual range". — [Impeccable designing](https://impeccable.style/designing)

Stated limits
- "strongest on interfaces that already exist"; detector, live mode and hook are web-only, native iOS/Android gets guidance and audits only; live mode's Apply "can run the codex or claude CLI with approvals and sandboxing off"; "Hooks run outside model approval" in Claude Code; telemetry on by default, and design-direction fetching happens even with telemetry off. — [GitHub](https://github.com/pbakaus/impeccable)

### Inferences
- Plugs straight into Claude Code (plugin or npx). For a reusable template the useful parts are: the PRODUCT.md + DESIGN.md pair as the project's design memory, the deterministic detector as a CI gate (exit code 2), and the hook as an in-session check. The ignore-with-reason mechanism lets a team record deliberate exceptions instead of fighting the linter.
- Fits a data-dense product app: Operate mode, harden, clarify, adapt, typeset, distill and the quality rules (tiny text, contrast, overflow, clipped popovers, nested cards) suit dashboards. But the slop catalogue leans towards marketing tropes, and it gives little explicit guidance on tables or density, so a data-app template would need its own density rules on top.
- Overlap with Flol's existing setup: PRODUCT.md would duplicate SPEC.md, and DESIGN.md would overlap `docs/design/plate.md`; a team would need to choose one home per fact. Hooks writing to `.claude/settings.local.json` and running outside approval, plus default telemetry, are decisions for Craig before install.
- For a later native app the hooks switch off (PRODUCT.md `ios`/`android`), so web is where it pays.

### Gaps
- Not read: per-command pages (beyond init, document), /docs/config, /docs/detector, /live-mode, /research, the skill's internal reference files, and what telemetry sends. The skill's built-in "design directions" fetch source is not documented on pages read.

## Overall ranking for the anti-slop template

### Takeaway
Impeccable is the backbone candidate (rules, detector, context files, free, Claude Code native). Subframe Motion is a useful free motion reference for product micro-interactions. GradientDeck is a free source of DESIGN.md examples to learn from, not copy. Oversight Sections is marketing-page material behind a partial paywall. Shipframe is off-topic (store screenshots).

### Cited Findings
- See per-site findings above; sources: [Impeccable](https://impeccable.style/), [Subframe Motion](https://www.subframe.com/motion), [GradientDeck UI](https://ui.gradientdeck.com), [Oversight Sections](https://supply.madebyoversight.com/sections), [Shipframe](https://getshipframe.com/).

### Inferences
- Only Impeccable and GradientDeck share a file format idea (DESIGN.md), but their formats differ; if the template standardises on DESIGN.md, use Google's spec (Impeccable's) so the detector's design-system rules work.
- Nothing in the five sites addresses a Korean/LCK visual identity; the look still has to come from the team's own design work.

### Gaps
- No site was tested hands-on (no installs), per the read-only constraint.
