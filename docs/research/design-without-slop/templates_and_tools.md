# Templates and tools for giving AI coding agents a design system (2025-2026)

**Contents:** [Google Stitch's DESIGN.md and similar open formats (design.md spec, awesome-design-md, W3C DTCG)](#google-stitchs-designmd-and-similar-open-formats-designmd-spec-awesome-design-md-w3c-dtcg) · [Popular design skills and taste packs: structure, claims, criticisms, evals](#popular-design-skills-and-taste-packs-structure-claims-criticisms-evals) · [Lint and checker tools that flag AI-slop tells](#lint-and-checker-tools-that-flag-ai-slop-tells) · [Designer write-ups on keeping AI output on-brand](#designer-write-ups-on-keeping-ai-output-on-brand) · [Sharing one design template across repos](#sharing-one-design-template-across-repos) · [Common skeleton most templates share](#common-skeleton-most-templates-share)


Researched 18 Nov 2026. Star counts are as the pages showed them in Oct-Nov 2026; several third-party pages give different (often lower or dated) counts, so treat them as rough adoption signals only. "Targets" says whether a pattern is aimed at landing/marketing pages or at product UI (data-dense app screens).

## Google Stitch's DESIGN.md and similar open formats (design.md spec, awesome-design-md, W3C DTCG)

### Takeaway
DESIGN.md (Google Labs, alpha, open-sourced April 2026) is now the de facto shared format: YAML token front matter plus ten ordered Markdown sections ending in "Do's and Don'ts", with a CLI that lints, diffs and exports tokens to W3C DTCG. W3C DTCG 2025.10 (first stable, 28 Oct 2025) is the token interchange layer underneath, not something agents read directly for intent.

### Cited Findings
**google-labs-code/design.md (Google Labs; spec for Stitch)**
- Two layers: machine-readable YAML tokens (between `---` fences at top, or fenced yaml blocks in sections) and a human-readable Markdown body of `##` sections — [GitHub](https://github.com/google-labs-code/design.md)
- YAML keys: `version`, `name`, `description`, `omitted`, `colors`, `typography`, `rounded`, `spacing`, `motion`, `components` — [GitHub](https://github.com/google-labs-code/design.md)
- Canonical section order (may omit, must keep order): 1 Overview (alias Brand & Style); 2 Colors; 3 Typography; 4 Layout (Layout & Spacing); 5 Elevation & Depth; 6 Shapes; 7 Motion & Micro-interaction; 8 Voice & Content Strategy; 9 Components; 10 Do's and Don'ts — [GitHub](https://github.com/google-labs-code/design.md)
- CLI `@google/design.md`: `lint` (structure, tokens, WCAG contrast; exit 1 on errors), `diff` (token/finding regressions between versions), `export` (`json-tailwind`, `css-tailwind`, `dtcg`), `spec` (emits the spec, optionally with lint rules, for pasting into agent prompts) — [GitHub](https://github.com/google-labs-code/design.md)
- Status alpha; ~28.9k stars; tokens "inspired by" W3C DTCG, exportable to it, not claimed fully compliant — [GitHub](https://github.com/google-labs-code/design.md)
- Open-sourced 21 April 2026 per secondary write-up — [MindWired AI, 23 Apr 2026](https://mindwiredai.com/2026/04/23/design-md-is-now-open-source-googles-new-file-format-that-makes-ai-build-your-brand-correctly/); Stitch docs at stitch.withgoogle.com/docs/design-md/overview (not fetched)
- Secondary sources disagree on section count (some say 9, a Japanese write-up describes 5) — reflects spec churn during alpha — [getdesign.md](https://getdesign.md/what-is-design-md); [note.com/kgsi](https://note.com/kgsi/n/n6c36d2db12e3?hl=en); [Medium, vignarajj](https://medium.com/@vignarajj/design-md-demystified-googles-open-format-for-consistent-ai-powered-ui-design-complete-guide-bd39809cd20e)

**VoltAgent/awesome-design-md (community library)**
- Collection of DESIGN.md files reverse-engineered from popular sites (Linear, Vercel, Stripe-style dev sites); layout `design-md/<site>/DESIGN.md` plus a preview file; copy one into project root. Counts vary by snapshot (55+ to 68 files); reported ~40.7k stars ten days after launch, later 59.7k; browser gallery at getdesign.md — [BetterStack guide](https://betterstack.com/community/guides/ai/design-md-ai/); [OSS Insight](https://ossinsight.io/analyze/VoltAgent/awesome-design-md); [Banani guide](https://www.banani.co/blog/design-md-guide)
- Targets: mostly marketing/brand sites of dev-tool companies; extracts the look, not product-specific screen rules.

**W3C DTCG (Design Tokens Community Group)**
- First stable spec 2025.10 published 28 Oct 2025: Format, Color and Resolver modules. A community group report, not a W3C Standard; core format "stable for production use" — [W3C announcement](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/); [Format Module 2025.10](https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/); [DTCG FAQ](https://www.designtokens.org/faq/)
- UI UX Pro Max can also output `tokens.json` (DTCG) and `tokens.css` alongside its Markdown master file — [GitHub](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)

**Figma's equivalents**
- Figma Make reads `Guidelines.md` first; Figma recommends it as an entry point that links to `overview-components.md` and per-component guideline files ("BEFORE using ANY component, you MUST read its guidelines file first"), and to include complete code snippets — [Figma developer docs](https://developers.figma.com/docs/code/write-design-system-guidelines/); [Figma help](https://help.figma.com/hc/en-us/articles/33665861260823)
- Figma MCP's `create_design_system_rules` skill analyses the codebase, then writes rules into CLAUDE.md / AGENTS.md (32 KiB limit for Codex) / `.cursor/rules/figma-design-system.mdc` — [Figma MCP docs](https://developers.figma.com/docs/figma-mcp-server/skill-create-design-system-rules); [custom rules](https://developers.figma.com/docs/figma-mcp-server/add-custom-rules/)

### Inferences
- The convergent shape is: tokens (machine) + rationale prose (human/agent) + explicit don'ts, in one file, with the token half exportable to DTCG/Tailwind. DESIGN.md's lint/diff CLI is the only format here with a built-in check that the file itself is valid.
- DESIGN.md's ten sections are generic visual-identity sections; nothing in the spec covers data density, tables, number formatting or screen states, so product-UI teams must add those under Components/Layout or in separate files (Figma's per-component guideline files are the closest precedent).

### Gaps
- Could not fetch Stitch's own docs page; the exact release date of the spec repo is from a secondary source.
- No evidence found that DESIGN.md measurably improves output versus a plain prose brief.

## Popular design skills and taste packs: structure, claims, criticisms, evals

### Takeaway
Four packs dominate (Anthropic frontend-design, UI UX Pro Max, taste-skill, Impeccable), all with six-figure star counts reported; none publishes a controlled eval. Third-party tests are small, mostly landing pages, and mixed: one blind test found about half of 11 skills did not beat no skill; the only benchmark with a big uplift scored against the skill's own bans.

### Cited Findings
**Anthropic frontend-design (anthropics/skills)**
- Sections: Ground your designs in the subject matter; Design principles; Process (plan, review against brief, build, critique); Restraint and self-critique; More on writing in design — [SKILL.md](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md)
- Names specific AI defaults to avoid: cream + serif + terracotta (~#D97757); near-black + one acid-green/vermilion accent; broadsheet hairline layouts; "SaaS-card kit" (identical rounded cards, same soft shadow, gradient washes); template chrome (tracked all-caps eyebrows, middle-dot meta, tinted near-blacks #0B0B0B/#111, mono data labels, arrows on buttons); stat-hero template; accenting one headline word — [SKILL.md](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md)
- Process: compact plan (4-6 hex colours, type roles, wireframe layout, principles) reviewed against the brief before building; self-review via screenshots; quality floor (focus states, reduced motion, a11y) — [SKILL.md](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md)
- Benchmark: 18/18 assertions with skill vs 5/18 (28%) without over 3 tasks (landing, analytics-dashboard sidebar, pricing), one run each; assertions are things the skill itself bans (no Inter, no purple, non-standard layout, CSS vars, a keyframe animation, "intentional aesthetic"); grading method/blindness not stated; 24 stars — [dani-z benchmark](https://github.com/dani-z/frontend-design-skill-benchmark). Note the dashboard task was the one where the baseline did best (4/6).
- Paralect test: moved page off Claude's default look, self-checked at three widths; criticised for inventing copy, clients and prices; ~3 min — [Paralect](https://www.paralect.com/skills/top-design-skills)

**UI UX Pro Max (nextlevelbuilder/ui-ux-pro-max-skill)**
- Searchable databases: 80 styles, 192 palettes/product types, 74 font pairings, 25 chart types, 34 landing patterns, 130 UX guidelines, 192 industry reasoning rules; BM25 ranking + JSON decision rules; outputs pattern, style, colours, type, effects, anti-patterns and a pre-delivery checklist — [GitHub](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- Persistence: `--persist` writes `design-system/<project>/MASTER.md` with optional `pages/*.md` overrides; optional `preview.html`, DTCG `tokens.json`, `tokens.css` — [GitHub](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- ~151k stars; installs to ~two dozen agents via CLI or Claude Code marketplace; explicitly covers dashboards (SaaS, ops, healthcare analytics) but landing pages are the main examples; README itself says its before/after is "not an official demo, benchmark, or runtime test" — [GitHub](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- Criticism: "most generic page in the test" though accessible (tap targets, focus, contrast) — [Paralect](https://www.paralect.com/skills/top-design-skills); scored 56/100 in another review — [Medium, hii_mohit](https://medium.com/@hii_mohit/9-best-ui-skills-for-claude-code-in-2026-i-tested-them-all-58fe42809376)

**taste-skill (Leonxlnx/taste-skill, v2.5.1)**
- Now one skill, `design-taste-frontend` (others moved to taste-skill-classics / imagegen-skills); ships `system.css`, `starter.html`, `library/palettes.json`, `library/type.json`, and check scripts (`gate`, `copy-lint`, `consistency`, `perf`, `shoot`) run in headless browser at four widths; classifies business type then deals palette, font pair, hero layout — [GitHub](https://github.com/Leonxlnx/taste-skill)
- Targets marketing/company websites; does not mention dashboards — [GitHub](https://github.com/Leonxlnx/taste-skill); Paralect: "not for dashboards" — [Paralect](https://www.paralect.com/skills/top-design-skills)
- ~118k stars. Its own changelog judged a new version 7.7 vs no-skill 7.8 on an Awwwards-style model-judged rubric; typical build 30-45 min and a few hundred thousand tokens — [Subframe, 24 Oct 2026](https://www.subframe.com/tips/best-claude-code-skills-for-ui-design)
- Earlier versions were known for numeric "dials" (e.g. design variance); the current README no longer mentions them — [GitHub](https://github.com/Leonxlnx/taste-skill)

**Impeccable (pbakaus/impeccable, Paul Bakaus)**
- 24 commands in groups: Steer (bolder, quieter, distill, colorize, typeset, layout, animate, delight, overdrive), Review (critique = scored UX review; audit = P0-P3 technical report), Finish (polish, harden, clarify, adapt, optimize, onboard), Set up (init, document, extract, shape, generate, live) — [GitHub](https://github.com/pbakaus/impeccable)
- `/impeccable init` writes `PRODUCT.md`; `/impeccable document` writes `DESIGN.md` from an existing UI; commits `.impeccable/config.json` and `design.json` — [GitHub](https://github.com/pbakaus/impeccable)
- ~112.7k stars; no benchmark, one anecdotal before/after; "strongest on interfaces that already exist"; dashboards not named — [GitHub](https://github.com/pbakaus/impeccable)
- Only skill of four that visibly changed an existing page's design; mentioned in 78 of 511 substantive Reddit threads (Jul-Oct 2026) — [Subframe](https://www.subframe.com/tips/best-claude-code-skills-for-ui-design) (Subframe sells a competing product)
- Found real mobile bugs and fixed them without changing the look — [Paralect](https://www.paralect.com/skills/top-design-skills)

**Others in Paralect's test** (same landing-page brief, fresh session, one run each, qualitative, not stated as blind, no-skill baseline included): Emil Kowalski's skills (motion/interaction only, 21 justified changes); Hallmark (Nutlope; most restrained, only one labelling sample data); huashu-design (three directions per run; ~8.5 min, ~$4.20 vs ~$1); designer-skills (Owl-Listener; 16 prioritised issues, 33 plugins flood the agent) — [Paralect](https://www.paralect.com/skills/top-design-skills). Paralect's star counts (e.g. 180K for frontend-design) disagree with other sources.

**Blind test**
- "Which Claude Code Design Skill to Use: I Tested 11 Blind, and Half Did Not Beat Using None"; per search snippet the no-skill Opus page finished 5th of 12 — [Medium, ianodad](https://ianodad.medium.com/which-claude-code-design-skill-to-use-i-tested-11-blind-and-half-did-not-beat-using-none-4d9d5c3bf2d7) (page returned 403; method not verified)
- Anthropic frontend-design removed nearly all generic tells at ~1.6x the cost of no skill, single brief — [SkillGild](https://skillgild.dev/learn/claude-code-frontend-design-skills) (snippet only)
- Claude Code's skill-creator has built-in blind A/B comparison (separate Claude judges two outputs without labels) — [InnovAItion Partners](https://innovaitionpartners.com/blog/claude-agent-skills-2.0-the-beginners-guide-to-the-updated-skill-creator); a user found an early no-skill lead came from a flawed scoring rubric — [note.com/renkon40](https://note.com/renkon40/n/nf65f5179feaf?hl=en)

### Inferences
- Skills split into three jobs: generators (UI UX Pro Max, taste-skill), principle/ban lists (frontend-design), and reviewers/finishers (Impeccable, Emil Kowalski, designer-skills). Reviewers advertised for existing UIs fit a product app better than landing-page generators.
- Every published "eval" is n=1-3 briefs, mostly landing pages, often judged by the author or a model against the skill's own bans. There is no credible evidence of measured uplift on data-dense product screens.
- Several bans conflict across packs (e.g. Hallmark's cream/serif/one-accent sits close to frontend-design's bans), so stacking packs can produce contradictory instructions.

### Gaps
- Could not read the ianodad blind test (403); ranking and judging method unknown.
- No eval found on dashboards or dense app UI specifically.

## Lint and checker tools that flag AI-slop tells

### Takeaway
Two kinds exist: taste linters that flag known AI tells (Impeccable detect, tastelint, uxskill lint, unslop) and design-system linters that block off-system styling (@shadcn/lint, eslint-plugin-better-tailwindcss). Only @shadcn/lint reports agent-run measurements. No dedicated Stylelint plugin found.

### Cited Findings
- **Impeccable detect**: 62 deterministic rules, no LLM; `npx impeccable detect src/` or a URL (needs Chrome); `--json`, `--github` annotations, exit 2 on findings; flags Inter-everywhere, purple-blue gradients, nested cards, grey text on colour, icon-tile above every heading, cramped padding, skipped headings; contrast/tiny-text checks need a rendered URL; in-agent hook scans files the agent edits — [GitHub](https://github.com/pbakaus/impeccable). Rule count cited elsewhere as 24, 41, 59 or 60 depending on date — [botmonster](https://botmonster.com/web-dev/impeccable-design-detector-rules-59-ai-design-tells/); [seunghyeonlab, May 2026](https://seunghyeonlab.blogspot.com/2026/05/impeccable-design-linter-that-catches.html)
- **tastelint** (bayuh85): 17 rules — High: gradient-wash, hype-phrase, nested-card, gray-on-gray; Medium: stock-sans, glass-panel, feature-trio, violet-default, gradient-text, radius-inflation, shadow-bloat, center-gravity, emoji-heading, filler-copy; Low: blur-orb, emoji-icon, empty-cta. Scans HTML/CSS/SCSS/JSX/TSX/Vue/Svelte/MDX/Tailwind; `tastelint scan src --fail-under 90`; SARIF; inline disable comments — [DEV, Oct 2026](https://dev.to/bayuh85/tastelint-a-linter-that-fails-the-build-when-your-coding-agent-ships-the-purple-gradient-landing-3p5c)
- **@shadcn/lint**: ESLint/Oxlint plugin for Tailwind v4 (shadcn/ui not required); rules `no-restyle` (with per-component contracts), `no-raw-colors`, `no-arbitrary-values`, `no-inline-styles`, `no-unknown-classes`, `require-static-classes`; error messages suggest the fix from your own components; tested on 150+ agent task runs, nearly all reaching zero violations in one correction round, 10-48% cheaper than rules-only in Claude control runs (self-reported); ~3.4k stars — [GitHub](https://github.com/shadcn-ui/lint)
- **eslint-plugin-better-tailwindcss** `no-restricted-classes`: regex class blocklist with custom message — [dev-loop issue](https://github.com/choiyounggi/dev-loop/issues/248) (personal repo, unverified)
- **uxskill lint** (pip) flags purple-to-blue gradient in Tailwind and hex forms — [uxskill blog](https://uxskill.laithjunaidy.com/blog/why-ai-uses-purple-gradients.html); **unslop** checks AI-purple, gradient text, neon glow, emoji icons, hero-plus-three-cards — [unslop](https://ivanmisic.net/toolshed/plugins/unslop)
- Hand-rolled ESLint rules for copy and design quality are a common pattern — [jw.hn](https://jw.hn/eslint-copy-design-quality); open-design keeps an `anti-ai-slop.md` craft file — [nexu-io/open-design](https://github.com/nexu-io/open-design/blob/main/craft/anti-ai-slop.md)
- Screenshot critics: "critics judge rendered output, never the code"; a system critic judges only against design-system.md — [Claude Design Blueprint](https://claude-design-blueprint.vercel.app/) (community page); Anthropic's design-critique skill (knowledge-work-plugins) reviews screenshots/Figma — [Skillselion](https://skillselion.com/guides/design-review-skills-claude-code)

### Inferences
- Taste linters encode landing-page tells (hero, feature trio, gradients); for product UI the more useful gate is a system linter (raw colours, arbitrary values, restyled components) plus a project-specific ban list.
- Static source scans miss contrast and size; those need a rendered page.

### Gaps
- No Stylelint plugin for AI tells found. No evidence on false-positive rates for any taste linter.

## Designer write-ups on keeping AI output on-brand

### Takeaway
Practitioner advice converges on: a written system file up front, reference images, a screenshot-compare-fix loop (two or three rounds), and critique against the system rather than taste. Most sources are blogs and vendor posts; no first-party Vercel or Linear post was found in this pass.

### Cited Findings
- Screenshot loop: write, screenshot, hand back, fix; "three quick rounds"; a design-system.md prevents problems the loop only fixes after — [youcanbuildthings](https://youcanbuildthings.com/articles/claude-code-screenshot-loop-fix-ui/)
- Write, screenshot, diff against a reference; two passes is the "sweet spot" in the author's testing — [AIDesigner blog, 2026](https://www.aidesigner.ai/blog/claude-code-frontend-design)
- Folder pattern: DESIGN.md + references/ screenshots + a system critic — [Claude Design Blueprint](https://claude-design-blueprint.vercel.app/)
- Curated references moved design more than adding skills (vendor's own finding) — [Subframe, 24 Oct 2026](https://www.subframe.com/tips/best-claude-code-skills-for-ui-design)
- Multi-direction exploration: huashu-design returns three directions; the third was the most original, another fell back to the default look — [Paralect](https://www.paralect.com/skills/top-design-skills)
- Extracting a system from an existing UI: Impeccable `/impeccable document` and `extract` — [GitHub](https://github.com/pbakaus/impeccable); awesome-design-md files are extracted from live sites — [BetterStack](https://betterstack.com/community/guides/ai/design-md-ai/)
- Avoiding purple gradients via a system optimised for AI — [BrainGrid](https://www.braingrid.ai/blog/design-system-optimized-for-ai-coding); [DEV, alanwest](https://dev.to/alanwest/how-to-fix-the-ai-generated-look-in-your-frontend-1ahh)

### Inferences
- The loop (reference -> system file -> build -> rendered screenshot -> critique against system -> fix) is the shared workflow; the files above are inputs to its steps.

### Gaps
- Did not find first-party Vercel/v0, Linear or Figma blog posts on this in the time available; X threads not retrievable.

## Sharing one design template across repos

### Takeaway
The documented route is a Claude Code plugin marketplace (a git repo with `.claude-plugin/marketplace.json`) added per project; nothing found on git submodules for DESIGN.md.

### Cited Findings
- Marketplace repo holds `.claude-plugin/marketplace.json` and plugin folders each with `plugin.json` + `skills/`; external repos referenced via `source`; per repo run `claude plugin marketplace add org/marketplace --scope project` and commit `.claude/settings.json`; update with `/plugin marketplace update` — [Towards Data Science](https://towardsdatascience.com/how-to-govern-coding-agent-skills-across-repos-with-plugins/); [classmethod](https://dev.classmethod.jp/en/articles/claude-code-marketplace-source-external-repo/); [DEV, komandakycto](https://dev.to/komandakycto/stop-copy-pasting-ai-skills-between-repos-package-them-as-claude-code-plugins-509h)
- Packs ship multi-agent folders so one source serves many tools: Impeccable (`.claude/`, `.cursor/`, `.agents/`, `.github/`, ~18 tools) — [GitHub](https://github.com/pbakaus/impeccable); UI UX Pro Max `uipro init --ai <platform>` and agent-agnostic `.agents/plugins/marketplace.json` — [GitHub](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- Tokens shared as DTCG JSON across tools (Style Dictionary, Tokens Studio, Figma reported) — [codercops, secondary](https://blog.codercops.com/blog/design-tokens-2026-w3c-format-guide)

### Inferences
- Common split: shared skill/ban list/linter config via plugin or package; per-repo DESIGN.md/PRODUCT.md for the product's own look.

### Gaps
- No source on submodules or monorepo DESIGN.md inheritance (UI UX Pro Max's MASTER.md + page overrides is the nearest pattern).

## Common skeleton most templates share

### Takeaway
Across DESIGN.md, Figma Guidelines.md, UI UX Pro Max MASTER.md, Impeccable PRODUCT.md/DESIGN.md and frontend-design, the shared skeleton is: purpose -> tokens -> foundations -> components -> don'ts -> check.

### Cited Findings
- DESIGN.md order (Overview, Colors, Typography, Layout, Elevation, Shapes, Motion, Voice, Components, Do's and Don'ts) — [GitHub](https://github.com/google-labs-code/design.md)
- frontend-design: subject/brief first, plan, named bans, self-critique with screenshots — [SKILL.md](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md)
- UI UX Pro Max output: pattern, style, colours, type, effects, anti-patterns, pre-delivery checklist — [GitHub](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- Figma: entry file -> overview -> per-component files with code snippets — [Figma docs](https://developers.figma.com/docs/code/write-design-system-guidelines/)

### Inferences
Skeleton (synthesised):
1. Product and audience (what this is for; Impeccable PRODUCT.md, frontend-design "ground in subject").
2. Tokens in machine form (YAML front matter / DTCG JSON): colour roles, type scale, spacing, radius, elevation, motion.
3. Foundations in prose: colour use, typography, layout/grid/density, depth, shape, motion — each with the why.
4. Voice and words.
5. Components: allowed variants and what may be overridden (shadcn lint "contracts").
6. Never list: named anti-patterns, project-specific and generic AI tells.
7. Check: a pre-delivery checklist plus a runnable gate (DESIGN.md lint, a taste linter, a system linter, a rendered-screenshot critique).
- Product-UI additions missing from most templates: table/number density rules, empty/loading/error states, data formatting.

### Gaps
- No controlled evidence that any one skeleton beats another.
