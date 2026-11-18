# What six YouTube guides teach about designing with Claude

**Contents:** [Per-video summaries and practices](#per-video-summaries-and-practices) · [Q1: What files or system do they set up before designing?](#q1-what-files-or-system-do-they-set-up-before-designing) · [Q2: How do they avoid generic "AI-looking" output?](#q2-how-do-they-avoid-generic-ai-looking-output) · [Q3: How do they review and iterate?](#q3-how-do-they-review-and-iterate) · [Q4: Which tools and skills do they name, and is there evidence they help?](#q4-which-tools-and-skills-do-they-name-and-is-there-evidence-they-help) · [Cross-video: repeated practices, contradictions, and fit for a data-dense app vs landing pages](#cross-video-repeated-practices-contradictions-and-fit-for-a-data-dense-app-vs-landing-pages)


Source note, for the report writer:
- All six videos come from **one channel, UI Collective (presenter Kirk, "KirkMDesign")**. That is one person's view, not six independent sources.
- He sells an academy and a design-system kit (collectivekit.co), runs a design-system agency, and carries a Mobbin 20%-off affiliate link in several descriptions. In one video he says Mobbin is "not paying me".
- Transcripts are YouTube machine captions. Fixes made: "quad/claw/cla code" → Claude Code, "claw design" → Claude Design, "Grock" → Grok, "Mobit/Maven/Mauvin/Mobbbin" → Mobbin, "anti-gravity" → Google Antigravity, "Sigma" → Figma, "Figma U skill" → `figma-use` skill, "Cling 3.0" → Kling 3.0, "Higsfield/Hicksfield" → Higgsfield, "Codeex" → Codex.
- Model names are as spoken and not checked: "Claude Fable 5", "Opus 4.8", "Opus 5", "GPT6 Astra", "Soulport/Saul 5.6", "Grok 4.5". (Fable does exist as a Claude model name in this environment.) "Cance 2.0" is probably Seedance 2.0. "pen.dev" is probably Pencil (pencil.dev). "rod spacing skill" is unresolved.
- Every timestamp below links to the video at that moment.

## Per-video summaries and practices

### Takeaway
Across six videos, one designer moves from "Figma skills and Claude Design aren't worth it yet" (March–April 2026) to a multi-tool workflow. In it, custom Claude skills that encode the design system do the heavy lifting for staying on brand, visual references steer the look, and cheap tools handle early exploration (May and September 2026).

### Cited Findings

#### 1. "Claude Code + Figma Design System (Designer Workflow Test)"
UI Collective, 27 Mar 2026, 8:48, id `-ttbXFWb8mg`

Summary: He connects the Figma connector to the Claude desktop app and installs two Figma community skills: `figma-use` (a prerequisite) and `figma-generate-design`. He then asks Claude Code to build a sign-up page in Figma from his published design system. Components were used, but many variables and text styles were not applied. His verdict: not worth adopting yet, because the effort outweighs the result.

Practices:
- Connect Figma via Claude desktop: Customize → Connectors → Figma → allow access. — [0:55](https://www.youtube.com/watch?v=-ttbXFWb8mg&t=55s)
- Install `figma-use` first. Other Figma skills "won't work as intended" without it. — [1:17](https://www.youtube.com/watch?v=-ttbXFWb8mg&t=77s)
- Upload skills under Customize → Skills. Keep the file named `skill.md`, never renamed. — [2:22](https://www.youtube.com/watch?v=-ttbXFWb8mg&t=142s), [3:01](https://www.youtube.com/watch?v=-ttbXFWb8mg&t=181s)
- If several design systems are published, paste the specific design system's Figma URL into the prompt. — [3:57](https://www.youtube.com/watch?v=-ttbXFWb8mg&t=237s)
- Write the prompt as a goal plus a "guidelines" list of explicit constraints: white background, form centred, form inside a card, "use input components and not field components". — [5:35](https://www.youtube.com/watch?v=-ttbXFWb8mg&t=335s)
- Review step: click element by element in Figma and check that each variable, text style and shadow style is applied. He found the surface variable, border variable, shadow style and subtext style missing. — [5:48](https://www.youtube.com/watch?v=-ttbXFWb8mg&t=348s)
- The design system must be published in the Figma workspace. Developers find Figma skills more useful than designers do. — [7:01](https://www.youtube.com/watch?v=-ttbXFWb8mg&t=421s)

#### 2. "Figma Skills Explained"
UI Collective, 31 Mar 2026, 17:08, id `9o-fe0noDFc`

Summary: Explains Figma skills as structured, reusable instruction files that teach AI how to work the Figma canvas. Shows a full install, including the reference sub-folders, then a test (an onboarding page that took 10 minutes, many variables missing), then an audit-and-fix loop. Results were "wildly inconsistent". The audit skill is the only one he would adopt now. He suggests writing your own skills to fill the gaps.

Practices:
- He finds Figma skills inconsistent and often slower than designing by hand, or than "a cursor rule or my own actual custom Claude skill". — [0:31](https://www.youtube.com/watch?v=9o-fe0noDFc&t=31s)
- A skill is a reusable structured file: upload once and the AI keeps it. — [1:55](https://www.youtube.com/watch?v=9o-fe0noDFc&t=115s)
- Download `figma-use`'s `SKILL.md` and every file in its `references/` folder, including the "working with design systems" sub-folder. Rebuild the GitHub folder structure inside the Claude app (he asks a Claude chat to place the files). — [3:43](https://www.youtube.com/watch?v=9o-fe0noDFc&t=223s), [6:12](https://www.youtube.com/watch?v=9o-fe0noDFc&t=372s)
- Add a spacing skill (hierarchical spacing with variables). In his own tests, spacing variables were applied "a little bit more consistently" with it installed. — [8:36](https://www.youtube.com/watch?v=9o-fe0noDFc&t=516s)
- Name skill files `SKILL.md` in capitals. — [9:48](https://www.youtube.com/watch?v=9o-fe0noDFc&t=588s)
- Put the Figma URL in the prompt and say "inside of Figma" explicitly. — [10:01](https://www.youtube.com/watch?v=9o-fe0noDFc&t=601s)
- Evidence against: the build took 10 minutes and "a ton of Claude tokens"; he could have done it in under 5 minutes. — [11:11](https://www.youtube.com/watch?v=9o-fe0noDFc&t=671s)
- Review loop: install the `audit design system` and `apply design system` skills. Give the link to the generated page, ask "please run an audit of this page", then "please fix the design". The audit was "pretty decent", but the fix still left variables and text styles unapplied. — [12:04](https://www.youtube.com/watch?v=9o-fe0noDFc&t=724s), [13:13](https://www.youtube.com/watch?v=9o-fe0noDFc&t=793s)
- The same workflow had once worked "perfectly" for him, which shows how variable it is. — [14:26](https://www.youtube.com/watch?v=9o-fe0noDFc&t=866s)
- Write custom skills to cover gaps: when to apply specific variables, design-token consistency, "when do you use a checkbox versus a radio button". — [14:26](https://www.youtube.com/watch?v=9o-fe0noDFc&t=866s)

#### 3. "Claude Design: The Complete Guide"
UI Collective, 20 Apr 2026, 31:58, id `eXlSgQmz02E`

Summary: A tour of Claude Design at launch:
- Prototype vs wireframe modes, the clarifying questions, and the novelty slider.
- Tweak controls, direct edit, and batched comments.
- Hand-off to Claude Code and a push to Figma.
- Importing a Figma design system.

Unconstrained output looked strong. The imported design system came back wrong (wrong fonts, type scale, extra radii), and designs built on it drifted (green primary button, wrong focus colour, emoji icons). He stresses token cost throughout.

Practices:
- Claude Design offers wireframe or high-fidelity. He skips wireframes ("I don't know any designers who wireframe anymore"). — [0:43](https://www.youtube.com/watch?v=eXlSgQmz02E&t=43s)
- Answer Claude Design's clarifying questions (product concept, audience, visual direction, steps, device). There is a "how novel/experimental" slider (he picked 8) and a choice of which tweaks to expose. — [2:18](https://www.youtube.com/watch?v=eXlSgQmz02E&t=138s)
- Tweaks panel: colour theme, accent, motion level, density, chart style. Useful for trying options. — [4:03](https://www.youtube.com/watch?v=eXlSgQmz02E&t=243s), [6:36](https://www.youtube.com/watch?v=eXlSgQmz02E&t=396s)
- His claim: "if you give AI total freedom … it produces really good results. But when you start adding guardrails like a design system, the results are not usually as good". Web layouts fare worse than mobile. — [6:09](https://www.youtube.com/watch?v=eXlSgQmz02E&t=369s)
- Iteration: use Edit mode for small direct changes (values, colours, font weights). For larger changes, leave comments on elements and send several at once. Be explicit, or Claude changes the wrong thing (his insights-card comment changed other cards). — [8:24](https://www.youtube.com/watch?v=eXlSgQmz02E&t=504s)
- "Hand off to Claude Code" copies a command. Paste it into a Claude Code session, then "push this design to Figma" with Figma MCP. That took about 7 minutes and the result was not fully responsive. — [12:18](https://www.youtube.com/watch?v=eXlSgQmz02E&t=738s)
- Don't drag in a multi-page Figma file (too many tokens). He finds the "start from sketch" feature pointless. — [13:27](https://www.youtube.com/watch?v=eXlSgQmz02E&t=807s)
- Design-system setup: the company name and blurb made no visible difference. Attach only the pages you need. Remove large page templates from a complex design system to cut tokens and time. — [15:12](https://www.youtube.com/watch?v=eXlSgQmz02E&t=912s), [16:23](https://www.youtube.com/watch?v=eXlSgQmz02E&t=983s)
- Review the extracted design system before using it:
  - fonts were missing and type styles invented ("displays" he doesn't have, wrong line heights and sizes)
  - extra radii appeared
  - only some components were captured

  He marked it "needs work" and gave a source of truth (a PNG of the type scale). The second pass was "a little bit more accurate". — [17:17](https://www.youtube.com/watch?v=eXlSgQmz02E&t=1037s), [21:05](https://www.youtube.com/watch?v=eXlSgQmz02E&t=1265s)
- Keep the design-system project separate from prototype projects. — [22:50](https://www.youtube.com/watch?v=eXlSgQmz02E&t=1370s)
- Drift seen with the design system applied: green primary buttons (green was success-only), a blue focus colour that isn't his, and emojis instead of icons. For small screens it's "quicker … to build them using my design system in Figma and then bring into Claude Code". — [24:55](https://www.youtube.com/watch?v=eXlSgQmz02E&t=1495s)
- Cost: he hit his usage limit mid-recording and had to upgrade his plan. — [21:05](https://www.youtube.com/watch?v=eXlSgQmz02E&t=1265s), [27:53](https://www.youtube.com/watch?v=eXlSgQmz02E&t=1673s)

#### 4. "Claude Design Isn't Just Design"
UI Collective, 21 Apr 2026, 9:59, id `B6yDicNiBWA`

Summary: Builds a fintech iPhone app in Claude Design, then uses its built-in "animated video" skill (Import → Skills and design systems) to make a 32-second promo video. He repeats this from exported Figma screens. Tips: keep Claude Design prompts general, attach only the screens you need, ask for side-by-side layout, and feed motion references as GIFs (from Mobbin) rather than describing them.

Practices:
- Claude Design asks questions anyway, so he answers "decide for me" where he has no view and picks "one polished version, iterate from here". — [0:51](https://www.youtube.com/watch?v=B6yDicNiBWA&t=51s)
- Built-in "animated video" skill for promo, App Store and stakeholder videos. — [2:07](https://www.youtube.com/watch?v=B6yDicNiBWA&t=127s)
- "The more information you give it in the prompt, it tends to just ignore it". He now writes more general prompts and lets the questions fill in detail. — [2:55](https://www.youtube.com/watch?v=B6yDicNiBWA&t=175s)
- Export is a zip with an HTML file; there is no MP4. — [4:07](https://www.youtube.com/watch?v=B6yDicNiBWA&t=247s)
- When using your own Figma work, "separate out the screens that you want … to avoid too many tokens being used". Choose which frames to attach. — [5:29](https://www.youtube.com/watch?v=B6yDicNiBWA&t=329s)
- Ask explicitly to see all screens side by side, or you get a one-screen-at-a-time prototype. — [7:04](https://www.youtube.com/watch?v=B6yDicNiBWA&t=424s)
- Moving from Figma into Claude always brings bugs that need polishing time. — [7:04](https://www.youtube.com/watch?v=B6yDicNiBWA&t=424s), [7:37](https://www.youtube.com/watch?v=B6yDicNiBWA&t=457s)
- Use visual references for motion (Mobbin's animation section). Convert screen recordings to GIF, because "it can't consume an MP4". Examples get "a better result first time" and save tokens. — [8:09](https://www.youtube.com/watch?v=B6yDicNiBWA&t=489s)

#### 5. "Designing With AI: Claude, Codex, Figma | Full Guide"
UI Collective, 4 May 2026, 1:27:43, id `j_ZPV10bu54`

Summary: Argues that "AI is not a tool, AI is a workflow" and builds one:
1. Google Stitch for cheap mid-fidelity exploration and stakeholder alignment.
2. Claude Design or Claude Code for the polished first draft.
3. Push to Figma, iterate in Codex (fewer tokens), then return to Claude.

The core of the video is teaching Claude the design system through custom skills: variables with usage descriptions, component groups studied one at a time, and type styles. It also shows Mobbin and ChatGPT image references as the main way to steer the look. He warns against letting AI build design-system foundations.

Practices:
- AI can't simply "import" a design system. You must "train AI on our design system … and then store that knowledge somewhere so you don't need to keep telling it every time". Generate multiple iterations across tools, and push and pull through Figma. — [0:53](https://www.youtube.com/watch?v=j_ZPV10bu54&t=53s)
- Claude vs Codex, his claims: Claude writes better code and is better with Figma auto layout and fill/hug; Codex uses "about three to four times fewer tokens". — [7:32](https://www.youtube.com/watch?v=j_ZPV10bu54&t=452s)
- Figma MCP gives access to read files. Figma skills teach how to use the canvas (variables, components). Install the `figma-use` bundle (as a plugin zip in Claude), and also `apply design system` and `audit design system`. The audit is "probably my favorite skill". — [9:16](https://www.youtube.com/watch?v=j_ZPV10bu54&t=556s)
- Installing the plugin does not connect the MCP; you must also connect the Figma connector. — [12:37](https://www.youtube.com/watch?v=j_ZPV10bu54&t=757s)
- Google Stitch: mobile results far better than desktop. The variations feature (count, creative range, what to vary, e.g. layout) gives quick alternatives. — [16:31](https://www.youtube.com/watch?v=j_ZPV10bu54&t=991s), [19:43](https://www.youtube.com/watch?v=j_ZPV10bu54&t=1183s)
- Use Stitch "for very, very early stage concepts without burning tokens": types of widgets, which data to show, chart formats, agreed with internal stakeholders first. — [21:29](https://www.youtube.com/watch?v=j_ZPV10bu54&t=1289s)
- Claude Design's output from the same prompt was "like senior level design", but one dashboard used 8% of his weekly Claude Design allowance. — [27:04](https://www.youtube.com/watch?v=j_ZPV10bu54&t=1624s)
- **Use the cheap step to make the Claude prompt precise**, e.g. "metrics along the top in four cards. These are the specific metrics … a performance chart … a line chart, not a bar chart, and here is why". The goal is "to reduce the number of edits you need". — [28:35](https://www.youtube.com/watch?v=j_ZPV10bu54&t=1715s)
- Ask Claude Design to "lay out the designs side by side so I can view them". The canvas is static, so changes go through select-and-edit or comments. — [29:38](https://www.youtube.com/watch?v=j_ZPV10bu54&t=1778s)
- His measured test of one batch of changes (light mode, a search bar, full width, swapped cards): Claude 12 minutes and 38,000 tokens; Codex 4 minutes and 17,000 tokens. He notes the starting points weren't identical. — [36:03](https://www.youtube.com/watch?v=j_ZPV10bu54&t=2163s), [38:01](https://www.youtube.com/watch?v=j_ZPV10bu54&t=2281s)
- Suggested loop: first draft in Claude → push to Figma → iterate in Codex → push to Figma → back to Claude. For one or two small changes, stay in Claude. — [38:26](https://www.youtube.com/watch?v=j_ZPV10bu54&t=2306s)
- Claude Design's design-system import still missed button variants and invented names ("ghost", "danger", "display"). It dropped heading and body sizes. "Just because you can import your design system in theory … it doesn't mean it's ready". — [42:05](https://www.youtube.com/watch?v=j_ZPV10bu54&t=2525s)
- AI-built type styles with variables were fine. An AI-built colour variable library missed disabled and other key variables. A button component took 6 minutes and 5.4k tokens, missed variants, and likely failed contrast. Use AI for complex layouts, modules and dialogs, not simple components. Start from a design-system template or build your own. — [45:32](https://www.youtube.com/watch?v=j_ZPV10bu54&t=2732s), [49:02](https://www.youtube.com/watch?v=j_ZPV10bu54&t=2942s), [52:03](https://www.youtube.com/watch?v=j_ZPV10bu54&t=3123s), [53:34](https://www.youtube.com/watch?v=j_ZPV10bu54&t=3214s)
- **Training order:** variables and styles first, then components and docs, then larger modules. Each step becomes a reusable skill. — [58:32](https://www.youtube.com/watch?v=j_ZPV10bu54&t=3512s)
- **Variables table** in Figma: token name, light value, dark value, and "a description of when it's used". Without the description, AI hallucinates the use cases. — [59:39](https://www.youtube.com/watch?v=j_ZPV10bu54&t=3579s)
- Prompt (paraphrased): "study all of the Figma variables inside this table … after coming to an elite understanding … build a Claude skill that will help train Claude on when to use different variables … do not include type styles … only focus on surface, border, text and icon". The output had one `.md` file per group, "common pairings", and a `SKILL.md` that routes between them. — [1:01:34](https://www.youtube.com/watch?v=j_ZPV10bu54&t=3694s), [1:03:32](https://www.youtube.com/watch?v=j_ZPV10bu54&t=3812s)
- **Type-styles skill**, so the AI doesn't invent off-scale sizes (e.g. 15px) that later can't be mapped to a style. — [1:04:44](https://www.youtube.com/watch?v=j_ZPV10bu54&t=3884s)
- Read the generated skill rather than assume it's right. Skill descriptions must be ≤1024 characters. — [1:07:10](https://www.youtube.com/watch?v=j_ZPV10bu54&t=4030s)
- **Components skill:** group components (form elements, navigation, data display). Tell Claude to master one group before moving to the next. Ask for one `.md` per group. Name "components, properties, variants" explicitly, or variants get missed. — [1:08:05](https://www.youtube.com/watch?v=j_ZPV10bu54&t=4085s)
- Name the skills in the prompt ("please reference the components, type and variables skills") so none is skipped. — [1:12:47](https://www.youtube.com/watch?v=j_ZPV10bu54&t=4367s), [1:18:47](https://www.youtube.com/watch?v=j_ZPV10bu54&t=4727s)
- Package the skills as zips so another tool (Codex) has the same rules. — [1:13:48](https://www.youtube.com/watch?v=j_ZPV10bu54&t=4428s)
- Always also give the design-system Figma link "in case it needs to reference it". — [1:14:57](https://www.youtube.com/watch?v=j_ZPV10bu54&t=4497s)
- **"AI always works better from visuals"** (his kitchen analogy). Take screenshots from Mobbin and "always feed AI multiple different examples". — [1:15:09](https://www.youtube.com/watch?v=j_ZPV10bu54&t=4509s), [1:16:48](https://www.youtube.com/watch?v=j_ZPV10bu54&t=4608s)
- Production prompt: reference screenshot + skills + design-system link + "do not push to Figma yet, simply generate it locally". Don't copy one example 1:1; several examples let it "find some synergies". — [1:17:24](https://www.youtube.com/watch?v=j_ZPV10bu54&t=4644s), [1:18:47](https://www.youtube.com/watch?v=j_ZPV10bu54&t=4727s)
- Drift seen anyway: it used the button component but overrode its radius to fully round. — [1:20:05](https://www.youtube.com/watch?v=j_ZPV10bu54&t=4805s)
- Build all the pages first, list everything wrong, then decide where to fix it. Don't fix one item at a time. — [1:21:15](https://www.youtube.com/watch?v=j_ZPV10bu54&t=4875s)
- Use ChatGPT image generation for alternative versions of a reference ("generate me some alternate options of a screen like this"). Feed the result back: "Here is another example I like. Can you tweak the design to match?" — [1:22:43](https://www.youtube.com/watch?v=j_ZPV10bu54&t=4963s), [1:24:26](https://www.youtube.com/watch?v=j_ZPV10bu54&t=5066s)
- Push to Figma with "remember to follow the design system and reference the type styles, variables and components rules". The result had styles and variables applied and the radius fixed. The drop shadow was missed "cuz I didn't include it in … those skills". — [1:25:14](https://www.youtube.com/watch?v=j_ZPV10bu54&t=5114s)
- Polish styles and variables in Figma before moving a design to another AI tool. — [1:26:36](https://www.youtube.com/watch?v=j_ZPV10bu54&t=5196s)

#### 6. "Design with AI - Full Guide (Tools, Workflows, Design Systems)"
UI Collective, 15 Sep 2026, 1:51:39, id `r-MPiu0E4W4`

Summary: The latest and longest guide. It opens with a same-prompt shoot-out (Grok, Claude Fable, Claude Opus, Codex, Stitch, Claude Design, Cursor, Figma AI). It covers canvas tools (Paper) and Mobbin MCP, which turns a mood board into an "aspirational" style skill. His standard process:
1. Iteration in ChatGPT images or Grok.
2. Prototype and self-QA in Google Antigravity.
3. Put it on brand with design-system skills in Claude Code.

Also: a documentation skill, Anthropic's design plugin accessibility audit, the Figma audit skill, a "design system rules and technical debt" skill, why AI can't build your design system, and a Higgsfield scroll-scrubbed hero.

Practices:
- No single tool does it all. He switched between four tools on a couple of pages. — [2:24](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=144s)
- No tool "one prompts an entire world-class UX". One-line demos usually hide hours of prep. — [5:24](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=324s)
- His test prompt (a wealth dashboard: client, cities, "white background, crisp typography, and a premium visual style", user goal). Results by his judgement:
  - Grok: 2 minutes, 47k tokens, "great"
  - Claude Fable: about 17 minutes, 128k tokens, "great"
  - Claude Opus: 8 minutes, 75k tokens, "average", "feels a little bit more AI generated"
  - Codex: 12 minutes, "average"
  - Claude Design: "one of the worst … I've ever gotten"
  - Stitch and Figma AI: poor

  [10:27](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=627s), [12:34](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=754s), [18:19](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=1099s)
- "Platform is not the same as model": the same model in Cursor looked more AI-generated than in its own platform. Use the native platform (e.g. Claude Code, not Cursor). — [17:05](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=1025s)
- Figma AI and Stitch do well only with their suggested system prompts or whole flows, not custom single screens. — [18:19](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=1099s)
- Canvas tools (Paper; Pencil, i.e. pen.dev) drive the design through MCP from Claude Code. One dashboard cost 155.4k tokens on Opus 5. — [23:07](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=1387s)
- ChatGPT images give cheap rough options, but they are flat images that must be rebuilt elsewhere. — [28:21](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=1701s)
- Claude Design wireframe mode, with Opus instead of Fable, is a cheap low-fidelity layout exploration (that day's result was poor). — [30:05](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=1805s)
- **Mobbin MCP** (connector in Claude): "find me some designs in Mobbin for a dashboard that has a lot of white space". — [31:33](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=1893s)
- In Claude Code: "build me a mood board for dashboard designs on Mobbin" gave 28 references in 4 styles (Bright Analytics, Dark & Dense, Financial & Portfolio, Workspace & Project). — [34:13](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=2053s)
- "Break down the visual direction of Bright Analytics into key themes" gave: surface and warmth, layout archetypes, colour and accent strategy, data-viz vocabulary, number and delta treatments, and density and rhythm. He exported it as a PDF. — [36:39](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=2199s)
- Your own custom skills are now worth more than Figma's community skills. — [38:05](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=2285s)
- Figma skills now come bundled as a plugin in Claude Code and Codex, but you must still connect the Figma MCP connector. — [38:44](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=2324s)
- Two kinds of skill:
  - **aspirational skills**: a look you aim for and may drift from, for when you have no design system
  - **design-system skills**: rules you must follow

  [40:18](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=2418s)
- Building an aspirational skill: "Build a skill around the design direction based in this PDF. Include competitor screenshots of the following companies which also fit this guideline". — [41:30](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=2490s)
- Toggle off unrelated skills so one client's or project's rules don't leak into another. Invoke the skill by name ("using that Bright Analytics skill, build me a pricing section"). Claude reported "six decisions … per the skill", and the result "matches pretty closely" to the references. — [43:10](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=2590s), [44:24](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=2664s)
- His process: iteration → prototyping → design-system integration. Iteration "rewards … options, not accuracy". — [45:45](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=2745s), [46:57](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=2817s)
- ChatGPT prompt: "Build me four different designs for dashboards with different data density. The product is a financial management application". It returned minimal, moderate, high and power-user density. Refine with requests such as "explore completely different formats of graphs" (all four used donut charts). — [48:49](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=2929s), [50:00](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=3000s)
- Grok Build (command-line tool) gives clickable, deployable versions of the same four-density prompt, plus "do not be influenced by other dashboards you've built". Ask for one dashboard at a time. Give it a ChatGPT image with "make this come to life and run locally". — [51:11](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=3071s), [54:37](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=3277s)
- **Build, look, fix:** "AI on its own, it's just good at building. You have to tell it what to look at". Google Antigravity drives a browser, screenshots its own output, resizes it for responsiveness, "pressure test[s] its own designs", and iterates. — [55:45](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=3345s)
- First prompt "run locally and study the current design patterns and treatments". Then: "Build an accounts page and run your own QA in the browser as you proceed. Before returning back to me, stress test the UI and ensure it meets the design standards of the overview page". — [59:09](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=3549s)
- Antigravity saves a session recording. If it skips QA, use its browser slash command with the local URL. Results vary run to run (his "roll the same dice" point). — [1:00:14](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=3614s)
- To bring it on brand, open the same folder in Claude Code, invoke the design-system skills, and prompt "make this design on brand with our design system. Do not yet push to Figma". The first result restyled with his components, but the grid was off and titles too large, because the type styles lacked usage guidelines. — [1:02:04](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=3724s)
- Documentation skill for consistency. The prompt asks Claude to study a component group's "properties, variants, attributes" and write usage guidelines, variations, properties, dos and don'ts, and accessibility, and to not push to Figma until the user is happy. Without a skill, "you're going to get different results each time". — [1:05:34](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=3934s), [1:07:08](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=4028s)
- **Anthropic's Claude "design" plugin.** He trusts only the accessibility review skill: on one Figma frame it found 22 issues (3 critical, 13 major, 6 minor) by WCAG pillar, plus a colour-contrast check, keyboard and screen-reader checks, and prioritised fixes. He would not trust its design-system management skill and finds UX writing of little value. — [1:09:40](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=4180s), [1:10:50](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=4250s)
- The Figma community `audit design system` skill is not in Figma's bundle (it's community-contributed), so install its `SKILL.md` by hand. It gave a critical/high/medium drift audit, better than ad-hoc audit prompts. — [1:12:28](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=4348s)
- **Design-system rules and technical-debt skill.** Write down the usage rules (e.g. radio buttons under four options, checkboxes above) and the debt you can't change (e.g. a default button colour pair that fails contrast), so AI doesn't "fix" them. Source the rules from "what is it you tell [a junior designer] about working with your design system?" — [1:15:22](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=4522s), [1:17:54](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=4674s)
- Variables skill from a table of variable, light value, dark value and description ("that description is the most important part"). Prompt: "Study the variables inside of this frame and build a skill around when to use particular variables". — [1:18:17](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=4697s), [1:21:40](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=4900s)
- Components: break them into categories; ideally one skill per category. Then "dialogue with it … go component by component" and add usage docs. — [1:22:23](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=4943s), [1:23:28](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=5008s)
- Type-styles skill, plus a catch-all "spacing and shape" skill for padding, gap, radius, border width and shadows. — [1:25:04](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=5104s)
- **Evidence shown:** a design built with the skills had spacing variables, surface variables, H3 and body text styles, gap variables and the button component applied in Figma. A Figma-agents design without the skills used raw shapes and wrong variables. "The design is not great, but looking great is not the point here. The point is adherence". — [1:26:38](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=5198s), [1:27:55](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=5275s)
- AI can't build a real design system. A type scale is fine "as long as you know the math". AI-made variable libraries are hard to understand (e.g. "surface subtle vs surface sunken") and handle dark mode wrongly. An AI-made table component was inflexible because it lacked cell and heading sub-components. — [1:28:29](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=5309s), [1:29:55](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=5395s), [1:33:50](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=5630s), [1:38:15](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=5895s)
- Interactive hero:
  1. Make start and end frames as images (Higgsfield, with Nano Banana).
  2. Make a video between them with Kling 3.0.
  3. Prompt: "Break out the video into individual frames using ffmpeg and swap out the background image with the frames. As the user scrolls, the frame should change and adjust the text around the car".

  [1:40:59](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=6059s), [1:46:47](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=6407s)
- Closing summary: Antigravity for QA, Grok for iteration, Claude for following the design system. — [1:50:31](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=6631s)

### Inferences
- The channel's stance changed over six months: from "Figma skills / Claude Design aren't worth it" (Mar–Apr) to "custom skills are where the value is" (Sep). The later videos carry more weight on current practice. The early ones explain why a design-system import alone fails.

### Gaps
- None of the videos uses the phrase "AI slop". The anti-generic advice is inferred from "feels AI generated" remarks and the reference-led practices.
- "rod spacing skill" (9o-fe0noDFc, 9:48) could not be resolved from the captions.

## Q1: What files or system do they set up before designing?

### Takeaway
Set-up has three layers:
1. **Connectors**: Figma MCP, later Mobbin MCP and Paper MCP.
2. **Figma community skills**: `figma-use` first, then generate-design, spacing, apply-design-system and audit-design-system.
3. **Custom Claude skills** built from your own material, at most one per concern:
   - variables, from a table with usage descriptions
   - components, grouped
   - type styles
   - spacing and shape
   - design-system rules and technical debt
   - an "aspirational" style skill from a reference mood board when there is no design system
   - a documentation skill

### Cited Findings
- Figma connector and `figma-use` as a prerequisite — [-ttbXFWb8mg 0:55](https://www.youtube.com/watch?v=-ttbXFWb8mg&t=55s), [9o-fe0noDFc 3:43](https://www.youtube.com/watch?v=9o-fe0noDFc&t=223s), [j_ZPV10bu54 9:16](https://www.youtube.com/watch?v=j_ZPV10bu54&t=556s), [r-MPiu0E4W4 38:44](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=2324s)
- Train in order (variables and styles → components and docs → modules) and store it as skills — [j_ZPV10bu54 58:32](https://www.youtube.com/watch?v=j_ZPV10bu54&t=3512s)
- Variables table with a "when used" description — [j_ZPV10bu54 59:39](https://www.youtube.com/watch?v=j_ZPV10bu54&t=3579s); [r-MPiu0E4W4 1:18:17](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=4697s)
- Component groups, one at a time — [j_ZPV10bu54 1:08:05](https://www.youtube.com/watch?v=j_ZPV10bu54&t=4085s); [r-MPiu0E4W4 1:22:23](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=4943s)
- Rules and technical-debt skill — [r-MPiu0E4W4 1:15:22](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=4522s)
- Aspirational skill from Mobbin themes and competitor screenshots — [r-MPiu0E4W4 41:30](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=2490s)
- Claude Design's own design-system import: review each tab and correct it with a source of truth — [eXlSgQmz02E 17:17](https://www.youtube.com/watch?v=eXlSgQmz02E&t=1037s)

### Inferences
- (My view) The design-system skills map closely onto a token file plus a per-component usage doc. The repeated lesson is that usage descriptions ("when to use") matter more than raw values.

### Gaps
- None shows a skill's full text on screen long enough to quote its structure, beyond the file layout (`SKILL.md` + per-group `.md` files + "common pairings").

## Q2: How do they avoid generic "AI-looking" output?

### Takeaway
Four things, by his account:
- Feed **visual references**: Mobbin screenshots or GIFs, ChatGPT-generated alternatives, several examples rather than one, never copied 1:1.
- Settle content and structure cheaply first, then give Claude a **precise brief** (which metrics, which chart type and why).
- Encode a look in an **aspirational skill**.
- Use the **native platform and a stronger model**.

### Cited Findings
- "AI always works better from visuals" — [j_ZPV10bu54 1:15:09](https://www.youtube.com/watch?v=j_ZPV10bu54&t=4509s)
- Multiple examples so it finds "synergies" rather than a copy — [j_ZPV10bu54 1:18:47](https://www.youtube.com/watch?v=j_ZPV10bu54&t=4727s), [1:20:05](https://www.youtube.com/watch?v=j_ZPV10bu54&t=4805s)
- Motion references as GIFs — [B6yDicNiBWA 8:09](https://www.youtube.com/watch?v=B6yDicNiBWA&t=489s)
- Precise brief after stakeholder alignment — [j_ZPV10bu54 28:35](https://www.youtube.com/watch?v=j_ZPV10bu54&t=1715s)
- Mood board → themes → skill — [r-MPiu0E4W4 34:13](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=2053s), [36:39](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=2199s), [41:30](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=2490s)
- Platform ≠ model; the model in Cursor "feels AI generated" — [r-MPiu0E4W4 17:05](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=1025s)
- Opus "feels a little bit more AI generated" than Fable — [r-MPiu0E4W4 12:34](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=754s)
- Iterate on options (four densities, different chart formats) before picking — [r-MPiu0E4W4 48:49](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=2929s)
- "Do not be influenced by other dashboards you've built" — [r-MPiu0E4W4 51:11](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=3071s)

### Inferences
- (My view) His idea of "generic" is mostly layout and widget sameness (standard cards, standard graphs, a uniform sidebar). He does not give a list of banned fonts or colours.

### Gaps
- No video gives an explicit anti-pattern list (e.g. "no purple gradients, no Inter") or a prompt wording aimed only at distinctiveness.

## Q3: How do they review and iterate?

### Takeaway
Review is mostly manual inspection: click through Figma layers to check that variables, styles and components are applied. Two automated aids exist: Figma's `audit design system` skill (drift report, then "fix") and Anthropic's accessibility-review skill. The only automated look-at-the-render loop shown is Google Antigravity's browser self-QA. Iteration happens through Claude Design comments and edits, Stitch or ChatGPT variations, and batching all fixes after every page is built.

### Cited Findings
- Element-by-element Figma check — [-ttbXFWb8mg 5:48](https://www.youtube.com/watch?v=-ttbXFWb8mg&t=348s), [9o-fe0noDFc 11:11](https://www.youtube.com/watch?v=9o-fe0noDFc&t=671s), [r-MPiu0E4W4 1:26:38](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=5198s)
- Audit then fix — [9o-fe0noDFc 12:04](https://www.youtube.com/watch?v=9o-fe0noDFc&t=724s); [r-MPiu0E4W4 1:12:28](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=4348s)
- Accessibility review skill: 22 findings — [r-MPiu0E4W4 1:10:50](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=4250s)
- Build, look, fix in a browser, with a stress-test prompt — [r-MPiu0E4W4 55:45](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=3345s), [59:09](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=3549s)
- Comments batched to Claude, and the need to be explicit — [eXlSgQmz02E 8:24](https://www.youtube.com/watch?v=eXlSgQmz02E&t=504s)
- Side-by-side canvas request — [B6yDicNiBWA 7:04](https://www.youtube.com/watch?v=B6yDicNiBWA&t=424s); [j_ZPV10bu54 29:38](https://www.youtube.com/watch?v=j_ZPV10bu54&t=1778s)
- Build all pages, list what's wrong, then choose the fix route — [j_ZPV10bu54 1:21:15](https://www.youtube.com/watch?v=j_ZPV10bu54&t=4875s)
- "Do not push to Figma yet" until it's reviewed — [j_ZPV10bu54 1:17:24](https://www.youtube.com/watch?v=j_ZPV10bu54&t=4644s); [r-MPiu0E4W4 1:02:04](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=3724s), [1:07:08](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=4028s)
- Review the generated skills themselves — [j_ZPV10bu54 1:07:10](https://www.youtube.com/watch?v=j_ZPV10bu54&t=4030s); [r-MPiu0E4W4 1:23:28](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=5008s)

### Inferences
- (My view) Claude Code can do the same build-look-fix loop with a browser or screenshot tool. He credits Antigravity only from his own experience ("Claude Code is probably going to get better at this").

### Gaps
- No structured critique rubric or multi-reviewer panel is shown; reviews are his own eye plus the audit skills.

## Q4: Which tools and skills do they name, and is there evidence they help?

### Takeaway
Named tools:
- **Anthropic:** Claude desktop (Connectors, Skills, Plugins), Claude Code, Claude Design (questions, tweaks, edit and comments, wireframe mode, design-system import, animated-video skill, hand-off to Claude Code), and the Claude "design" plugin (accessibility review).
- **Figma:** MCP, and the `figma-use`, generate-design, spacing, apply-design-system and audit-design-system skills.
- **References:** Mobbin (with its MCP), ChatGPT image generation.
- **Other generators:** Codex, Grok and Grok Build, Google Stitch, Google Antigravity, Cursor, Paper, Pencil, Higgsfield, Nano Banana, Kling, ffmpeg.

All evidence is single-run demos judged by eye, with a few token and time counts. He says himself that results vary run to run.

### Cited Findings
- Token and time figures:
  - Claude 12 minutes and 38k tokens vs Codex 4 minutes and 17k tokens for the same edits — [j_ZPV10bu54 38:01](https://www.youtube.com/watch?v=j_ZPV10bu54&t=2281s)
  - shoot-out table — [r-MPiu0E4W4 18:19](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=1099s)
  - Paper 155.4k tokens for one dashboard — [r-MPiu0E4W4 23:07](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=1387s)
  - Claude Design: one dashboard was 8% of weekly usage — [j_ZPV10bu54 27:04](https://www.youtube.com/watch?v=j_ZPV10bu54&t=1624s)
- Skills help adherence (a with/without comparison in Figma) — [r-MPiu0E4W4 1:26:38](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=5198s), [1:27:55](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=5275s); [j_ZPV10bu54 1:25:14](https://www.youtube.com/watch?v=j_ZPV10bu54&t=5114s)
- Figma skills alone: inconsistent, slower than by hand — [9o-fe0noDFc 11:11](https://www.youtube.com/watch?v=9o-fe0noDFc&t=671s), [14:26](https://www.youtube.com/watch?v=9o-fe0noDFc&t=866s); [-ttbXFWb8mg 7:01](https://www.youtube.com/watch?v=-ttbXFWb8mg&t=421s)
- Aspirational skill kept the draft close to the references (one run) — [r-MPiu0E4W4 44:24](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=2664s)
- Run-to-run variance ("roll the same dice") — [r-MPiu0E4W4 59:09](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=3549s)

### Inferences
- (My view) The evidence is anecdotal: n=1 per comparison, one judge, and a commercial interest in design systems and Mobbin. The adherence evidence (variables and styles actually bound in Figma) is the most objective item shown.

### Gaps
- No repeated trials, no blind comparison, and no user testing of the outputs.

## Cross-video: repeated practices, contradictions, and fit for a data-dense app vs landing pages

### Takeaway
The most repeated practices:
- connect Figma MCP plus skills
- name the design-system file or skills in the prompt
- inspect what was actually applied
- encode the design system as custom skills with usage descriptions
- lead with visual references
- spend cheap tokens on exploration and expensive ones on the build

The main contradictions concern Claude Design's quality, and whether adding a design system makes output worse or better.

### Cited Findings
Practices repeated across videos (count = number of the 6 videos):
- **Watch token and time cost; pick the tool by stage** — 6/6 (-ttb 7:01, 9o 11:11, B6 8:09, eX 10:44, j_ 38:26, r- 18:19)
- **Connect Figma MCP and install Figma skills (`figma-use` first)** — 5/6 (-ttb, 9o, eX 12:18, j_, r-)
- **Put the design-system Figma link or skill names explicitly in the prompt** — 4/6 (-ttb 3:57, 9o 10:01, j_ 1:14:57 / 1:18:47, r- 1:02:04)
- **Inspect applied variables, styles and components element by element** — 4/6 (-ttb 5:48, 9o 11:11, j_ 1:25:14, r- 1:26:38)
- **Custom skills that encode the design system or a look** — 3/6 (9o 14:26, j_ 1:01:34, r- 38:05)
- **`audit design system` skill for drift** — 3/6 (9o 12:04, j_ 11:34, r- 1:12:28)
- **Visual references over verbal description** (Mobbin, GIFs, ChatGPT images) — 3/6 (B6 8:09, j_ 1:15:09, r- 31:33)
- **Generate several variations or options first** — 3/6 (eX tweaks 7:37, j_ Stitch 19:43, r- 48:49)
- **Answer Claude Design's clarifying questions, or say "decide for me"** — 3/6 (eX 2:18, B6 0:51, j_ 24:45)
- **Claude Design's design-system import is incomplete or drifts; review it** — 2/6 (eX 17:17 / 24:55, j_ 42:05)
- **Attach only the frames you need, or trim the design system** — 2/6 (B6 5:29, eX 13:27 / 16:23)
- **Ask for screens side by side** — 2/6 (B6 7:04, j_ 29:38)
- **"Do not push to Figma yet" until reviewed** — 2/6 (j_ 1:17:24, r- 1:02:04 / 1:07:08)
- **Hand-off chain Claude Design → Claude Code → Figma** — 2/6 (eX 12:18, j_ 31:44)
- **Don't let AI build design-system foundations; a type scale is OK** — 2/6 (j_ 45:32–56:27, r- 1:28:29–1:40:58)
- **Group components and study one group at a time** — 2/6 (j_ 1:08:05, r- 1:22:23)
- **Variables table with a "when to use" description** — 2/6 (j_ 59:39, r- 1:18:17)
- **Review or dialogue over the generated skill** — 2/6 (j_ 1:07:10, r- 1:23:28)
- **No single tool; multi-tool workflow** — 2/6 (j_ 0:53, r- 2:24)

Contradictions:
- **Claude Design quality:**
  - "most AI designs do not look this good right away" — [eX 4:03](https://www.youtube.com/watch?v=eXlSgQmz02E&t=243s)
  - "like senior level design" — [j_ 27:04](https://www.youtube.com/watch?v=j_ZPV10bu54&t=1624s)
  - vs "one of the worst … I've ever gotten" — [r- 16:32](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=992s)
  - and its wireframes were "the worst set" — [r- 30:05](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=1805s)
- **Design system as guardrail:**
  - adding one makes output worse — [eX 6:09](https://www.youtube.com/watch?v=eXlSgQmz02E&t=369s), [26:30](https://www.youtube.com/watch?v=eXlSgQmz02E&t=1590s)
  - vs skills give "way closer" adherence — [r- 1:26:38](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=5198s), and on-brand output after pushing to Figma — [j_ 1:25:14](https://www.youtube.com/watch?v=j_ZPV10bu54&t=5114s)
  - These are partly reconcilable: the first uses Claude Design's import, the second custom skills in Claude Code. In r- he also concedes "the design is not great" while adherence is good.
- **Prompt length in Claude Design:**
  - "be a little bit more general", because detail gets ignored — [B6 2:55](https://www.youtube.com/watch?v=B6yDicNiBWA&t=175s)
  - vs give Claude Design very specific metrics and chart types to cut edits — [j_ 28:35](https://www.youtube.com/watch?v=j_ZPV10bu54&t=1715s)
- **Wireframing:**
  - "I don't know any designers who wireframe anymore" — [eX 0:43](https://www.youtube.com/watch?v=eXlSgQmz02E&t=43s)
  - vs mid-fi or wireframe exploration recommended — [j_ 28:35](https://www.youtube.com/watch?v=j_ZPV10bu54&t=1715s), [r- 30:05](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=1805s)
- **Google Stitch:**
  - the right tool for early alignment — [j_ 21:29](https://www.youtube.com/watch?v=j_ZPV10bu54&t=1289s)
  - vs "a waste of time mostly" — [r- 18:19](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=1099s)
- **Figma skills:**
  - "not worth" adopting — [-ttb 7:01](https://www.youtube.com/watch?v=-ttbXFWb8mg&t=421s), [9o 14:26](https://www.youtube.com/watch?v=9o-fe0noDFc&t=866s)
  - vs required to push structured designs to Figma, with the audit skill a "favourite" — [j_ 11:34](https://www.youtube.com/watch?v=j_ZPV10bu54&t=694s), [r- 38:44](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=2324s)
- **Iteration engine:**
  - Codex as the cheap iterator — [j_ 38:26](https://www.youtube.com/watch?v=j_ZPV10bu54&t=2306s)
  - vs Grok and ChatGPT for iteration, with Codex rated "average" — [r- 46:57](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=2817s)

### Inferences
Fit for a **data-dense product app** (e.g. a fantasy esports game). This is my own view, drawing on what the videos show:
- **Strong fit:**
  - variables skill with usage descriptions; components skill grouped, including a "data display" group (tables, tags, badges, avatars)
  - type-styles skill so numbers don't land on off-scale sizes; spacing and shape catch-all
  - rules and technical-debt skill ("when X vs Y")
  - audit-design-system skill; accessibility review (contrast and keyboard matter on dense tables)
  - build-look-fix browser QA with a "match the standards of the overview page" consistency prompt
  - "build all pages, then batch fixes"
  - the four-data-densities exploration prompt
  - Mobbin theme breakdown including "data viz vocabulary", "number and delta treatments" and "density and rhythm"
  - a precise brief naming the metrics and chart type with a reason

  Nearly every demo in these videos is a finance dashboard, so the advice was tested on data-dense screens rather than landing pages.
- **Caution for data-dense apps:**
  - Don't let AI design complex components such as tables: the inflexible table at [r- 1:38:15](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=5895s).
  - Unconstrained Claude Design looks good but drifts once a design system is applied.
- **Suits marketing or landing pages better:**
  - the Claude Design animated-video skill
  - the Higgsfield / Kling / ffmpeg scroll-scrubbed hero
  - the aspirational skill demo (a pricing section)
  - "total freedom produces good results"
  - a high novelty slider
  - ChatGPT and Grok image-led exploration of looks

  Visual impact matters more than design-system adherence on these pages.

### Gaps
- No video covers a game, sports or esports product, mobile-plus-desktop density trade-offs for tables, or live-data states (loading, empty, stale). How these practices transfer to a fantasy esports app is inference only.
- Single-creator source: no independent confirmation of any claim here.
