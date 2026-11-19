# Videos C: what 13 YouTube guides teach about designing with Claude

**Contents:** [Per-video summaries and practices](#per-video-summaries-and-practices) · [What files or system do they set up before designing?](#what-files-or-system-do-they-set-up-before-designing) · [How do they avoid generic "AI slop" output?](#how-do-they-avoid-generic-ai-slop-output) · [How do they review and iterate?](#how-do-they-review-and-iterate) · [Which tools and skills do they name, and is there evidence they help?](#which-tools-and-skills-do-they-name-and-is-there-evidence-they-help) · [Cross-video: repeats, contradictions, product vs marketing](#cross-video-repeats-contradictions-product-vs-marketing)


Source note that matters for every section below: **all 13 videos come from one channel, UI Collective (presenter "Kirk", X @KirkMDesign).** They are not independent sources. When a practice "repeats" across videos, it is one creator saying it again, not separate people agreeing. Two videos are paid or partnered: F_xmadD8UAA says "This video is sponsored by Anthropic", and J8RYkSHb92E says "we again teamed up with Mobbin". Nearly every description carries a Mobbin affiliate link for 20% off. In ojS5pcjs3xQ, 8fva1VtacT8 and AGHqBAVyrQs he says Mobbin is not sponsoring that video.

The captions are machine-made. Fixes applied: "claw design" / "cloud design" → Claude Design; "cloud code" / "quad code" → Claude Code; "MOB and / Mobin / Mobbit" → Mobbin; "Higgs Field" / "Q Hexfield AI" → Higgsfield; "Stage Show" → Stageshow; "unslob" → Unslop; "Mistro AI" → Mistral AI; "Nana Banana / Net of Banana" → Nano Banana; "Google Anti-gravity" → Google Antigravity. The names are confirmed from each video's description links. The name "Apple design skill" was checked on the web: Emil Kowalski's repo has a skill named `apple-design`, described as "Apple's principles for interface design and fluid motion" ([github.com/emilkowalski/skills](https://github.com/emilkowalski/skills)). The model names as spoken ("Opus 5.5", "Opus 5", one "Opus 4.5", "GPT 5.5") are kept as heard and were not verified.

Timestamps link to the start of the caption block that holds the point, which can be up to about a minute before the exact words.

## Per-video summaries and practices

### Takeaway
One creator's workflow, stated again and again: design the most important widget first, not the whole page. Pull real-world patterns through the Mobbin MCP (a connector that gives Claude access to Mobbin's library of about 600,000 real app screens). Reduce "AI slop" with open-source skills used as named commands, chiefly Impeccable. Keep the designer's own critique in charge. For brand consistency, turn a brand guideline into a Claude skill. Marketing-site videos add a separate image → video → frames → scroll-animation pipeline.

### Cited Findings

#### 1. Give Claude a Senior Designer's Taste (3 FREE Skills): UI Collective, 16 Nov 2026, 13:24 (Bhc3CL-cQm0)
Summary: Three free open-source skills plus a bonus, each shown before and after, to lift AI-generated UI. His thesis: skills reach a polished result in fewer prompts and tokens than describing the result in words. But the designer still has to diagnose what is wrong; the skills cannot do the thinking.

**The "3 free skills", exactly as the video names them:**
1. **Stageshow** by Benji Taylor (described as head of design at X and SpaceX AI), installed from a command in an X post. It makes polished, animated UI mock-ups and bento-grid visuals — [0:28](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=28s)
2. **Emil Kowalski's skills**, specifically the **animate** skill and the **Apple design** skill (repo name `apple-design`). Guidelines for motion and micro-interactions — [3:14](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=194s)
3. **Impeccable** (impeccable.style). He names the **Taste skill** alongside it as a peer; Impeccable is his favourite — [7:13](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=433s)
- Bonus: **Unslop** (github.com/heydamir/unslop), for removing AI tells from dashboards and cards — [12:08](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=728s)

Practices:
- Screenshot only the weak region, then prompt: "Using the Stage Show skill create several distinct visual options to replace the attached visual. Show each option in context so I can compare." — [0:28](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=28s)
- More context and example designs you like give better output — [1:39](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=99s)
- Stageshow also works on any card or product visual, not just mobile heroes. Shown on a card before and after: drop shadow, highlighted elements, skeleton-style parts, better type — [1:39](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=99s), [2:51](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=171s)
- Motion prompts: "Using the Apple design skill, make the tray feel more intentional like on iOS. Preserve the before and after so we can compare." and "Using the animate skill, enhance the on-load animation." — [4:34](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=274s)
- Have Claude build a small replay harness that plays before and after side by side at 25% speed, to judge the motion — [4:34](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=274s), [5:43](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=343s)
- Evidence offered: he described the wanted motion to Claude without the skill, and the result "still wasn't close". He claims the skills get there first time with fewer tokens. This is one informal trial — [6:49](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=409s)
- Impeccable has a command per outcome (layout, colour, typeset, "quieter") — [7:13](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=433s)
- Critique first: list what is wrong yourself, then pick the command. Example list: the line graph gets in the way, too much text, things out of order, the metric label wraps over three lines — [8:21](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=501s), [9:21](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=561s)
- Ideally one change per prompt (he combines two only to save time) — [9:21](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=561s)
- Don't just type "distill card two". Example prompt: distil and clarify card two, cut the text to essentials, move the line graph next to its metrics, put the metrics in a logical order, refine the buttons, and say the card-one graph may be unnecessary — [10:34](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=634s)
- Impeccable added its own judgement, moving long text into an info tooltip — [11:36](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=696s)
- "Unslop this dashboard": removed graphs, simplified and harmonised colours — [12:08](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=728s)

#### 2. How to Fix AI Slop in Your App Designs (My Workflow): UI Collective, 11 Nov 2026, 33:29 (PZ6bYA6NsKo)
Summary: A full redo of a vibe-coded travel app, in this order: type scale, then colour usage, then layout (Mobbin pattern report), then manual critique by comment, then hero visual (Stageshow), then layout polish (Impeccable), then motion (animate), then spreading the look to other pages. He stresses that you can't go "zero to production grade in an hour". He also admits on camera that a skill failed silently.

- Audit type first. Signs of AI type: too many heading styles, and the steps between sizes are uneven — [1:25](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=85s)
- Type-scale prompt: "Create three distinct typography options, each with a complete mobile type scale… H1 through H6, paragraph large, medium, and small, caption. Use 16 pixel for paragraph medium… specify the font family, size, weight, line height, and letter spacing. Show each option in a way I can compare how the hierarchy reads on mobile." — [2:25](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=145s)
- Copy the winning option's specs and apply them across the app. He works in Claude Code's canvas; Paper (paper.design) is the alternative canvas for other tools — [3:30](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=210s)
- Keep the original files so you can compare before and after — [4:44](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=284s)
- Audit colour by role. In AI apps one accent (orange) does duty for actions, tags and non-action badges. "You can't just say fix the colors" — [6:16](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=376s)
- Colour skills: **Color Expert** (meodai/skill.color-expert: colour spaces, palettes, contrast); **Better Colors** (jakubkrehel/skills: audits colour systems, builds colour ramps, and maps each step to a role and token name); Impeccable's **colorize** and **quieter** — [7:20](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=440s), [9:22](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=562s)
- Try colour approaches on a couple of separated screens, not the whole app. Sometimes a manual fix is best — [9:22](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=562s)
- Prompt: "/impeccable quieter the two screens below using the existing palette". Then roll the result out to the other screens — [10:37](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=637s), [12:15](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=735s)
- Don't ask for "a brand new login screen". Go widget by widget — [15:14](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=914s)
- Mobbin MCP pattern report before any options: "create a pattern report on how apps across the travel industry or other industries ask users to choose preferences during onboarding… Compare how each pattern works, where it appears in the flow, and which patterns would fit best on my existing step two… Include Mobbin references." The output has rationale, trade-offs and a recommendation — [16:24](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=984s)
- Question the brief itself, for example whether two questions belong on one page. He split the onboarding into one question per page — [18:50](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=1130s), [19:55](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=1195s)
- Leave comments on the canvas as you go (for example "should be stacked like Apple/Google SSO buttons", "reduce corner radius of inputs"), and delete clutter such as icons by hand — [20:41](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=1241s), [22:00](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=1320s), [23:49](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=1429s)
- Stageshow prompt: "Look at the current sign up page. Use the stage show skill to create previews of the app's home screen. Match the look and feel of the existing UI… Present options separately on the canvas so we can choose one before updating" — [23:49](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=1429s)
- A caution he shows on camera: Stageshow failed partway through and Claude carried on without it, giving output that still "feel AI generated". He only noticed the next day — [24:52](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=1492s), [32:44](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=1964s)
- "Impeccable, adjust the layout" plus a plain rant with specifics: "drop height of inputs and buttons to 44 pixels", options on a separate part of the canvas — [26:26](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=1586s)
- Emil Kowalski's animate skill: "animate this page" — [30:06](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=1806s)
- Once one page is right, tell Claude to "apply the same type of visual thinking to the other pages in that flow", then refine. Iterating in Figma by hand is fine too — [31:19](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=1879s)

#### 3. How to Design Without Figma | AI Design Crash Course: UI Collective, 3 Nov 2026, 10:53 (uzQCZD3w3hs)
Summary: Claude Code's `/design` skill now gives a canvas you can edit, so he says Claude Design is no longer needed. Paper gives other agents a canvas. Desktop design goes widget by widget. Slop is reduced with Taste skill or Impeccable plus Mobbin MCP. Stageshow is for marketing visuals.

- In Claude Code, `/design` (he says it is "unique to Claude Code and unique to Anthropic") opens a canvas where you can drag elements and change colour and radius. Codex gives only a local HTML file. "You really don't need Claude Design anymore" — [0:32](https://www.youtube.com/watch?v=uzQCZD3w3hs&t=32s)
- Paper MCP sends any agent's designs to an editable canvas — [1:58](https://www.youtube.com/watch?v=uzQCZD3w3hs&t=118s)
- Mobile output is consistently better than desktop ("less space for AI to overthink"). For desktop, start with the most important widget: "Design four distinct variations of a full-width your fitness score widget for a desktop app. Explore different layouts, visual styles, and ways to present the score and supporting fitness metrics." — [2:54](https://www.youtube.com/watch?v=uzQCZD3w3hs&t=174s)
- Tweak the chosen widget, then "build a page based on the styling that we settled". This saves tokens — [4:16](https://www.youtube.com/watch?v=uzQCZD3w3hs&t=256s)
- AI slop "you can't escape". Clients have refused to pay for work with AI tells — [5:24](https://www.youtube.com/watch?v=uzQCZD3w3hs&t=324s)
- Named tells: rounded cards with a coloured left border, and an italic phrase in a different colour. Fix with Taste skill or Impeccable — [6:12](https://www.youtube.com/watch?v=uzQCZD3w3hs&t=372s)
- Mobbin MCP prompt: "Browse Mobbin and generate me a mobile app dashboard for a weight loss app that follows Airbnb's treatments". It pulled Airbnb screens for style and weight-loss dashboards for content — [6:53](https://www.youtube.com/watch?v=uzQCZD3w3hs&t=413s)
- Then audit the result with Impeccable or the **Front-End Design skill** (Anthropic's) to cut slop — [8:36](https://www.youtube.com/watch?v=uzQCZD3w3hs&t=516s)
- Stageshow before and after on a card, "for marketing pages or product demos" — [9:22](https://www.youtube.com/watch?v=uzQCZD3w3hs&t=562s)

#### 4. Design with Claude Code | 3 Workflows Worth Learning: UI Collective, 20 Oct 2026, 10:32 (F_xmadD8UAA). Sponsored by Anthropic
Summary: A persona-review skill built from persona documents and run against prototypes through Claude Code's browser. A "prompt for the prompt" to force structurally different widget variants. Expanded annotations for design reviews. Anthropic's design plugin's accessibility-review skill used for tab-order and reading-order reports.

- Persona skill prompt: "Read the attached persona documents and build a reusable skill that reviews UX flows from the perspective of the attached persona. Identify friction based on their goals, knowledge, behaviors, and constraints, then recommend prioritized improvements, ground findings in persona evidence, label assumptions, and avoid implying real user testing." — [0:19](https://www.youtube.com/watch?v=F_xmadD8UAA&t=19s)
- Claude Code drives a browser over the locally running prototype: invoke the skill and say "Audit the UX". Output is a summary plus a priority table. It is not a substitute for users; it is for "gaps in my thinking" — [1:59](https://www.youtube.com/watch?v=F_xmadD8UAA&t=119s)
- Prompt for a prompt: "I need to design a full-width net worth widget for a dashboard. Don't do any designs yet, but build me a prompt that will generate seven to eight high-quality variations in different style, data formats…". The result named variants such as composition bar, table, goal progress, allocation map and insight-led — [3:13](https://www.youtube.com/watch?v=F_xmadD8UAA&t=193s), [4:15](https://www.youtube.com/watch?v=F_xmadD8UAA&t=255s)
- Paste that prompt into `/design`, then "build a page around this composition bar" so the page adopts the widget's styling — [4:15](https://www.youtube.com/watch?v=F_xmadD8UAA&t=255s)
- For a design review: "expand the annotations to explain the rationale behind each design, including its strengths, limitations, and key trade-offs" — [5:36](https://www.youtube.com/watch?v=F_xmadD8UAA&t=336s)
- Run the persona skill against the variants: "audit the designs and provide a report" — [5:36](https://www.youtube.com/watch?v=F_xmadD8UAA&t=336s)
- Anthropic's design plugin: don't rely blindly on its research-synthesis or UX-copy skills. The **accessibility review** skill (`/accessibility-review`) is the one he values — [6:53](https://www.youtube.com/watch?v=F_xmadD8UAA&t=413s)
- Prompt: "Write the tab order and reading order only in a PDF format I can share with my developers". It ran for 15 minutes; he says that thoroughness beats asking a general AI — [8:51](https://www.youtube.com/watch?v=F_xmadD8UAA&t=531s)

#### 5. Design with Claude Code: A Crash Course: UI Collective, 29 Sep 2026, 17:15 (ljJuOxTsrtY)
Summary: Claude Code with `/design` beat Claude Design on the same prompt. Widget-first generation. Impeccable used as named commands, run only at the end because it is token-heavy. Mobbin used for a mood board, then a brand-guideline PDF, then a reusable Claude brand skill that keeps later screens on brand.

- Same settings-page prompt in both tools: the Claude Design output was "very clearly AI slop… super safe". Claude Code `/design` gave more "aspirational" layouts, such as a secondary settings sidebar. Developers also prefer Claude Code — [0:25](https://www.youtube.com/watch?v=ljJuOxTsrtY&t=25s), [1:38](https://www.youtube.com/watch?v=ljJuOxTsrtY&t=98s)
- The canvas includes "a very miniature design system" for each design — [1:38](https://www.youtube.com/watch?v=ljJuOxTsrtY&t=98s)
- Widget prompt: "Design four distinct net worth widgets for a personal finance app. Create only the widgets with no surrounding app UI. Explore different layouts, visual styles, typography, and data visualizations. Use consistent sample data across all four so the designs are easy to compare. Each should feel like unique direction, not just a color variation." — [3:15](https://www.youtube.com/watch?v=ljJuOxTsrtY&t=195s)
- Base the whole page on the chosen widget — [4:35](https://www.youtube.com/watch?v=ljJuOxTsrtY&t=275s)
- "You cannot eliminate AI slop", only reduce it — [5:35](https://www.youtube.com/watch?v=ljJuOxTsrtY&t=335s)
- Impeccable ("about 68,000 stars on GitHub", "the missing design vocabulary for AI agents"). Put the command as the first word, for example "quieter these cards". If the plugin marketplace fails, install it from the terminal — [6:41](https://www.youtube.com/watch?v=ljJuOxTsrtY&t=401s)
- Impeccable is "very token heavy", so run it at the end, once happy, not every iteration — [8:56](https://www.youtube.com/watch?v=ljJuOxTsrtY&t=536s)
- Mood-board prompt: "Browse Mobbin and generate a mood board for a health tech app. Highlighting UI patterns, color palettes, typography, and layout inspiration" — [11:27](https://www.youtube.com/watch?v=ljJuOxTsrtY&t=687s)
- From the chosen direction: "Create a brand guideline that defines the visual style including colors, typography, layouts, textures, and UI treatments. Explain how to apply these consistently… Make it available to download by PDF." — [12:29](https://www.youtube.com/watch?v=ljJuOxTsrtY&t=749s)
- Skill prompt: "turn the attached brand guideline PDF into a reusable Claude skill… Translate the direction to clear rules for colors, typography, spacing, layouts, textures, and UI components. Include practical examples, dos and don'ts, and a checklist to keep designs consistent." — [14:44](https://www.youtube.com/watch?v=ljJuOxTsrtY&t=884s)
- Invoking the skill keeps output on brand across new chats, so there is no need to re-describe or re-screenshot — [15:39](https://www.youtube.com/watch?v=ljJuOxTsrtY&t=939s)

#### 6. 3 AI Design Workflows That Save Me 10+ Hours a Week: UI Collective, 21 Sep 2026, 12:18 (j6rfwigv_1Y)
Summary: Simulated persona testing of three onboarding versions through a "flow home base" page, run in Google Antigravity. An accessibility audit of tab order and reading order turned into a PDF for developers. Targeted widget generation before pages.

- A launch page linking all the flows keeps the agent on track when it doubles back to re-check a flow — [2:05](https://www.youtube.com/watch?v=j6rfwigv_1Y&t=125s)
- Uses Google Antigravity because "it's way better at navigating designs in a browser" — [2:05](https://www.youtube.com/watch?v=j6rfwigv_1Y&t=125s)
- Two-step prompting. First set the persona and ask Claude to "confirm that you understand this persona. Then wait". Then: "Review each flow independently before comparing them… Explain what you believe is happening, what you expect to happen next, where you hesitate, what feels unclear, and your confidence from 1 to 5… Ignore visual aesthetics unless they directly affect usability… recommend which better supports the persona's goals, citing specific moments" — [3:33](https://www.youtube.com/watch?v=j6rfwigv_1Y&t=213s), [4:54](https://www.youtube.com/watch?v=j6rfwigv_1Y&t=294s)
- Accessibility prompt: "Audit this interface for keyboard tab order and screen reading order… focus is visible, no controls are skipped or create keyboard traps… clear headings, landmarks, labels, and content grouping. Flag any differences between the visual layout and the underlying content order… Distinguish what you tested directly from what you inferred. Do not make any changes yet." It was run on a dense dashboard with a high-density data table — [7:24](https://www.youtube.com/watch?v=j6rfwigv_1Y&t=444s)
- Then a PDF for developers. He claims 10 to 20 hours cut to 10 to 15 minutes (his estimate, not measured) — [8:26](https://www.youtube.com/watch?v=j6rfwigv_1Y&t=506s)
- Widget prompt: "Explore four creative directions for fitness app's weekly activity summary… Push the concepts apart through composition, style, chart treatments, and visual personality. Keep the underlying numbers identical. Leave out navigation, device frames, and other app elements." — [9:01](https://www.youtube.com/watch?v=j6rfwigv_1Y&t=541s), [10:02](https://www.youtube.com/watch?v=j6rfwigv_1Y&t=602s)
- Cut the weak variants and take the survivors to the design review; the team picks one, then page variants follow — [10:02](https://www.youtube.com/watch?v=j6rfwigv_1Y&t=602s)

#### 7. Designing With Claude: The No-Nonsense Guide: UI Collective, 25 Aug 2026, 17:17 (ojS5pcjs3xQ)
Summary: Claude Design and Claude Code `/design` give "very similar" output. Generate widget options, then take the chosen one into Figma and do the page thinking by hand. Impeccable via its commands. Mobbin for patterns, not copying. Strong warning against building a design system inside Claude. Instead train Claude with skills for each part of the design system and push to Figma via the Figma MCP, which gets "85% of the way".

- The same finance-dashboard prompt in both tools gave a very similar structure and quality. `/design` brings Claude Design's thinking and canvas into Claude Code, asks questions first, and offers tweaks for accent colour, light/dark theme and chart type — [0:22](https://www.youtube.com/watch?v=ojS5pcjs3xQ&t=22s), [1:42](https://www.youtube.com/watch?v=ojS5pcjs3xQ&t=102s)
- Widget prompt: "Give me four different options for a line graph showing how my investments have performed over time. Focus on different ways to lay out and present the data, not just different visual styles. And keep the overall design consistent across all four." — [3:08](https://www.youtube.com/watch?v=ojS5pcjs3xQ&t=188s), [4:24](https://www.youtube.com/watch?v=ojS5pcjs3xQ&t=264s)
- Screenshot the chosen widget, have Figma agents rebuild it as editable layers, then decide by hand what goes above and below it. "One prompting a perfect design… it's complete clickbait." — [5:26](https://www.youtube.com/watch?v=ojS5pcjs3xQ&t=326s)
- Impeccable: learn the commands, for example distil — [8:01](https://www.youtube.com/watch?v=ojS5pcjs3xQ&t=481s)
- Mobbin prompt: "Use Mobbin to identify common patterns and best practices for graph widgets and finance apps. Focus on how leading products structure, present, and interact with financial data. Then generate four options." Output: five repeating patterns, the source competitors, and rationale — [9:28](https://www.youtube.com/watch?v=ojS5pcjs3xQ&t=568s), [10:35](https://www.youtube.com/watch?v=ojS5pcjs3xQ&t=635s)
- Never copy a design one-for-one from Mobbin — [10:35](https://www.youtube.com/watch?v=ojS5pcjs3xQ&t=635s)
- Don't build a design system in Claude. A button set took 22 minutes and about 90,000 tokens. Variant names were unverified. A modal built from those components had mismatched button sizes — [11:50](https://www.youtube.com/watch?v=ojS5pcjs3xQ&t=710s), [12:59](https://www.youtube.com/watch?v=ojS5pcjs3xQ&t=779s), [14:06](https://www.youtube.com/watch?v=ojS5pcjs3xQ&t=846s)
- Preferred route: design in Claude, then push to Figma with the Figma MCP so it uses your components and tokens. Train Claude with separate skills for design-system rules, styles, when to use which token, component groups, and spacing and shape. "85% of the way there" — [14:06](https://www.youtube.com/watch?v=ojS5pcjs3xQ&t=846s)
- He finds "design sync"-type repository syncing weak at consuming a design system — [16:42](https://www.youtube.com/watch?v=ojS5pcjs3xQ&t=1002s)

#### 8. Use AI Like a Senior Designer (3 Workflows): UI Collective, 18 Aug 2026, 14:18 (Oo-5AWdQAt8)
Summary: Workflows he says come from senior designers at Meta, Google and others, who are not named. Build the pieces before the page, with dozens of variants of the key widget. Persona-lens flow review with a flow home base. AI drafts the reading order and a human places the annotations.

- Prompt: "I'm designing a banking dashboard where net worth is the primary widget. Create eight distinctively different versions of this widget exploring different layouts, chart styles, functionality, controls, insights, and ways of visualizing growth over time. Do not design the full dashboard… Each concept should have a clearly different format, visual approach, and color scheme…" — [0:20](https://www.youtube.com/watch?v=Oo-5AWdQAt8&t=20s), [1:47](https://www.youtube.com/watch?v=Oo-5AWdQAt8&t=107s)
- Screenshot the winner, rebuild it in Figma, apply the design system, design the rest by hand. Repeat the AI step only where stuck — [3:13](https://www.youtube.com/watch?v=Oo-5AWdQAt8&t=193s)
- Flow home base page plus a persona prompt in Antigravity (the same structure as video 6, with a senior financial adviser persona) — [5:16](https://www.youtube.com/watch?v=Oo-5AWdQAt8&t=316s), [6:27](https://www.youtube.com/watch?v=Oo-5AWdQAt8&t=387s), [7:58](https://www.youtube.com/watch?v=Oo-5AWdQAt8&t=478s)
- "Never just take an AI suggestion… as the full truth"; use it to find blind spots — [9:31](https://www.youtube.com/watch?v=Oo-5AWdQAt8&t=571s)
- Reading order: "identify the reading order based on this design" from a Figma MCP link, or from a screenshot if the MCP is unavailable — [10:13](https://www.youtube.com/watch?v=Oo-5AWdQAt8&t=613s), [11:23](https://www.youtube.com/watch?v=Oo-5AWdQAt8&t=683s)
- Mark it up by hand with CVS Health's Web Accessibility Annotation Kit (Figma Community). Never have AI annotate and ship — [12:24](https://www.youtube.com/watch?v=Oo-5AWdQAt8&t=744s), [13:25](https://www.youtube.com/watch?v=Oo-5AWdQAt8&t=805s)

#### 9. Turn Claude Into a SENIOR Designer in 3 Simple Steps: UI Collective, 4 Aug 2026, 18:10 (4vItmdk8F_M)
Summary: "Give AI taste" in three steps. (1) Connect MCPs: Mobbin for real patterns, Higgsfield for custom imagery. (2) Impeccable for design vocabulary. (3) Build your own brand-guideline skill: a "mini design system" of about 20 colours and about 6 components, because Impeccable is token-heavy, ignores rigid brand rules and is often blocked by enterprise compliance.

- The look of slop changes over time: it used to be purple-blue gradients and emojis; with Claude Design it is "beige backgrounds, specific type treatments, and cards that feel… out of place". Giving AI screenshots of things you like is "a very junior workflow" — [0:00](https://www.youtube.com/watch?v=4vItmdk8F_M&t=0s)
- Mobbin MCP, about 620,000 real shipped UIs, unlike Dribbble's "futuristic" shots. Connect it in the Claude desktop app under Customize → Connectors — [1:16](https://www.youtube.com/watch?v=4vItmdk8F_M&t=76s), [2:49](https://www.youtube.com/watch?v=4vItmdk8F_M&t=169s)
- Prompt: "I really like the connectors page within Mistral AI. Can you please build something similar?" It added its own improvements. A leftover tell: a drop-shadow glow — [4:03](https://www.youtube.com/watch?v=4vItmdk8F_M&t=243s)
- Higgsfield MCP for custom imagery: "create something with a similar feel, then use the Higgsfield MCP to generate a complementary background image. Use a gray palette instead of orange, so it feels inspired by the reference without being a one-to-one copy." — [5:09](https://www.youtube.com/watch?v=4vItmdk8F_M&t=309s), [6:55](https://www.youtube.com/watch?v=4vItmdk8F_M&t=415s)
- Impeccable: clarify, distil and so on. Don't say "fix this"; decide what you want changed. Example: "/impeccable distill this design" — [7:39](https://www.youtube.com/watch?v=4vItmdk8F_M&t=459s), [10:06](https://www.youtube.com/watch?v=4vItmdk8F_M&t=606s)
- Limits of Impeccable: token-intensive on lower plans, "not always the best at following a more rigid brand guideline", and compliance would stop you installing it at a bank — [11:28](https://www.youtube.com/watch?v=4vItmdk8F_M&t=688s)
- Prompt: "The product I'm building is a finance product in light mode. Minimal bright colors, soft neutral tones, plenty of white space. Please build me a brand guideline based on competitors in Mobbin, provide a locally ran version and a PDF version" — [11:28](https://www.youtube.com/watch?v=4vItmdk8F_M&t=688s), [13:10](https://www.youtube.com/watch?v=4vItmdk8F_M&t=790s)
- Skill prompt: "Build a Claude skill that ensures every UI design for Vantage stays aligned with the guideline in this document. The skill must be referenced whenever a Vantage interface is created or updated… prevent the work from drifting into the generic AI generated design patterns." — [14:14](https://www.youtube.com/watch?v=4vItmdk8F_M&t=854s)
- A full design system (about 80 colours, about 50 components) is too much for one skill and makes slop harder to avoid. Keep the skill as a mini system — [15:43](https://www.youtube.com/watch?v=4vItmdk8F_M&t=943s)
- Combined use: "Build me a dashboard for Vantage inspired by Stripe". Claude browsed Stripe via Mobbin and read the Vantage skill. Some AI tells remain — [15:43](https://www.youtube.com/watch?v=4vItmdk8F_M&t=943s), [17:25](https://www.youtube.com/watch?v=4vItmdk8F_M&t=1045s)

#### 10. Claude Code + Claude Design + Kling AI: Client-Ready Web Experiences: UI Collective, 23 Jun 2026, 15:06 (l7G97gNyM8k)
Summary: An Apple-style marketing section in which scrolling drives an exploded-iPhone video. Stills are made with Nano Banana in Higgsfield, the video with Kling 3.0 from a start frame and an end frame, the skeleton in Claude Design, then the work moves to Claude Code, where FFmpeg splits the video into frames and scroll steps through them. Deployed to Vercel.

- Screenshot a reference (Apple) to avoid "reinventing the wheel" — [0:50](https://www.youtube.com/watch?v=l7G97gNyM8k&t=50s)
- Nano Banana image generation at 16:9, re-prompted several times — [1:20](https://www.youtube.com/watch?v=l7G97gNyM8k&t=80s), [3:03](https://www.youtube.com/watch?v=l7G97gNyM8k&t=183s)
- Kling 3.0 with a start frame and an end frame — [4:13](https://www.youtube.com/watch?v=l7G97gNyM8k&t=253s)
- Claude Design is "really good at generating… a first design framework, better than… Claude Code or Google Antigravity first try". Then Share → Send to Claude Code → "run locally" — [5:21](https://www.youtube.com/watch?v=l7G97gNyM8k&t=321s), [6:22](https://www.youtube.com/watch?v=l7G97gNyM8k&t=382s)
- "Using FFmpeg, break this video out into individual frames… Do not add any text effects or scroll effects just yet." That is, staged prompts — [7:22](https://www.youtube.com/watch?v=l7G97gNyM8k&t=442s)
- Scroll-scrub prompt: frames advance with scroll, and the spec callouts appear in sync — [9:38](https://www.youtube.com/watch?v=l7G97gNyM8k&t=578s)
- Fix rounds use screenshots plus specific changes. He notes that piling several changes into one prompt is not ideal — [10:53](https://www.youtube.com/watch?v=l7G97gNyM8k&t=653s)
- "Introduce an onload effect that Apple would implement"; reverse the frames at the end — [12:50](https://www.youtube.com/watch?v=l7G97gNyM8k&t=770s)
- "Check this project and prepare it for Vercel… walk me through each step" — [13:45](https://www.youtube.com/watch?v=l7G97gNyM8k&t=825s)

#### 11. Claude Code + Google AI Image Gen: Build Apple-Style Websites in Minutes: UI Collective, 15 Jun 2026, 17:00 (8fva1VtacT8)
Summary: The same pipeline as video 10 for an Apple Watch landing page: a hover-to-fan-out watch and scroll-synced metrics. Mobbin screenshots serve as layout references for Claude Design.

- Claude Design for the skeleton "because you get a better output the first time", fed Mobbin screenshots of Apple pages: "Build me a landing page like Apple using the references attached. Only focus on the hero section… and the section beneath it… All light mode, no dark backgrounds." It is token-heavy, so do one draft there and move on — [1:02](https://www.youtube.com/watch?v=8fva1VtacT8&t=62s), [2:27](https://www.youtube.com/watch?v=8fva1VtacT8&t=147s)
- Send to Claude Code and run it locally — [3:18](https://www.youtube.com/watch?v=8fva1VtacT8&t=198s)
- Nano Banana Pro images, then Kling 3.0 from start and end frames. The start image's aspect ratio sets the video's, so make both 16:9 — [4:03](https://www.youtube.com/watch?v=8fva1VtacT8&t=243s), [6:43](https://www.youtube.com/watch?v=8fva1VtacT8&t=403s)
- FFmpeg frames. Hover-interaction prompt with "Use all the frames we extracted… and not just the first and last frames" — [9:10](https://www.youtube.com/watch?v=8fva1VtacT8&t=550s), [9:54](https://www.youtube.com/watch?v=8fva1VtacT8&t=594s)
- Expect timing tweaks (the first try was too slow) and edge artefacts — [11:12](https://www.youtube.com/watch?v=8fva1VtacT8&t=672s)
- Scroll-synced metrics: "each metric should align with the relevant Apple specification being shown in that frame" — [13:08](https://www.youtube.com/watch?v=8fva1VtacT8&t=788s)
- "Add Apple like load effects"; deploy to Vercel — [14:58](https://www.youtube.com/watch?v=8fva1VtacT8&t=898s), [15:21](https://www.youtube.com/watch?v=8fva1VtacT8&t=921s)

#### 12. Claude Code + 3D Animations: Build Client Ready Websites in Minutes: UI Collective, 9 Jun 2026, 15:13 (AGHqBAVyrQs)
Summary: A SpaceX-style hero with a rotating 3D Mars made through the Higgsfield MCP. The lesson is to settle the text layout before the imagery, and to carry the big 3D element into the next section's scroll.

- Start with the hero's text layout, not the 3D imagery; otherwise no type treatment fits the image — [0:39](https://www.youtube.com/watch?v=AGHqBAVyrQs&t=39s)
- References: Dribbble for "futuristic" heroes, Mobbin for "enterprise level" designs — [1:19](https://www.youtube.com/watch?v=AGHqBAVyrQs&t=79s)
- In Claude Design: "build me a hero section based on the attached design. Ignore all of the graphic elements and icons and only focus on the text… do not build me an entire site yet" — [2:10](https://www.youtube.com/watch?v=AGHqBAVyrQs&t=130s)
- Add Higgsfield as a custom connector (MCP URL) in Claude — [3:58](https://www.youtube.com/watch?v=AGHqBAVyrQs&t=238s)
- He admits the first prompt was too vague (Mars came out as a static image). The fix spelled out the details: 3D, rotating, behind the text, natural glow, "Mars is the most important part". "If you… actually described what you want you get a better first time output" — [6:59](https://www.youtube.com/watch?v=AGHqBAVyrQs&t=419s)
- Reference screenshot for the nav button style; staggered load effects on the text — [8:44](https://www.youtube.com/watch?v=AGHqBAVyrQs&t=524s)
- Carry the hero's 3D element into the next section's scroll. Ideally find an example animation, convert the MP4 to a GIF and have AI write the prompt from it — [9:46](https://www.youtube.com/watch?v=AGHqBAVyrQs&t=586s), [11:30](https://www.youtube.com/watch?v=AGHqBAVyrQs&t=690s)
- Resize the canvas to check the result is responsive — [12:49](https://www.youtube.com/watch?v=AGHqBAVyrQs&t=769s)
- Deploy to Vercel. Pushing to GitHub first is better for anything you will maintain. Lovable handles complex 3D sites poorly — [13:28](https://www.youtube.com/watch?v=AGHqBAVyrQs&t=808s)

#### 13. I Gave Claude Code & Codex Access to 600,000 UI Designs: UI Collective, 11 May 2026, 14:12 (J8RYkSHb92E). Partnered with Mobbin
Summary: Mobbin MCP setup and uses beyond making screens: pattern-based options with sources named, benchmarking an existing design, competitive reports, mood boards. Codex gives cheaper but image-only output. He lists the MCP's limits.

- The core problem: AI "guesses". It is "not an expert on type treatment… layout… information architecture" — [0:55](https://www.youtube.com/watch?v=J8RYkSHb92E&t=55s)
- Setup: Mobbin Settings → MCP → copy the command for your tool, paste it into Claude Code desktop to edit the MCP config, restart, and sign in on first use — [2:13](https://www.youtube.com/watch?v=J8RYkSHb92E&t=133s), [3:21](https://www.youtube.com/watch?v=J8RYkSHb92E&t=201s)
- Prompt: "I'm designing a dashboard for a banking application. Extract common patterns from Mobbin and generate me three options". The options named Starling, Monzo, Revolut and Mercury as inspiration. He wants each pattern tied to its source — [4:01](https://www.youtube.com/watch?v=J8RYkSHb92E&t=241s), [5:27](https://www.youtube.com/watch?v=J8RYkSHb92E&t=327s)
- Benchmarking: "compare this against all the other banking dashboards inside Mobbin. Come back with an analysis and recommendations and why". The output covered what every competitor has that we lack, ranked recommendations, and "what not to copy" — [6:29](https://www.youtube.com/watch?v=J8RYkSHb92E&t=389s)
- Competitive report (25+ screens; he says 4 hours cut to 5 to 10 minutes) — [7:43](https://www.youtube.com/watch?v=J8RYkSHb92E&t=463s)
- Mood board "with dozens of different looks and styles… so I can share with clients" (took about 8 minutes) — [9:29](https://www.youtube.com/watch?v=J8RYkSHb92E&t=569s)
- Codex with GPT 5.5 makes images, not clickable HTML; it is cheaper in time and tokens — [11:08](https://www.youtube.com/watch?v=J8RYkSHb92E&t=668s)
- Limits: no similar-screens feature, weak on single apps or flows, can't read your saved collections. Check the output isn't a near-copy — [12:37](https://www.youtube.com/watch?v=J8RYkSHb92E&t=757s)

### Inferences
- Every video's advice is one practitioner's demo on toy apps (travel, fitness, banking, health). None shows a dense production data screen at scale.
- The dates show the advice shifting. June videos route skeletons through Claude Design. August says the two tools are equivalent. From September he prefers Claude Code `/design`.

### Gaps
- No video shows the inside of the `/design` skill, Impeccable's rules, or a skill file's text. Only prompts and outputs are visible.
- No video gives Impeccable's full command list on screen in a way the captions record. Only distil, quieter, colorize, clarify, layout/adjust, bolder and typeset are named.

## What files or system do they set up before designing?

### Takeaway
The recurring setup: the Mobbin MCP connector; Impeccable (and sometimes the Taste, Stageshow, Emil Kowalski or colour skills) installed from the terminal; and, for brand consistency, a self-made Claude skill built from a brand-guideline PDF (a "mini design system"). For a real design system he prefers separate skills for each area plus the Figma MCP, not building components inside Claude. Persona documents become a review skill.

### Cited Findings
- The "3 free skills" are Stageshow (Benji Taylor), Emil Kowalski's skills (animate and Apple design), and Impeccable (Taste skill as the alternative), with Unslop as a bonus — [Bhc3CL-cQm0 0:28](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=28s), [3:14](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=194s), [7:13](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=433s), [12:08](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=728s)
- Brand guideline (mood board → PDF) → Claude skill with rules, examples, dos and don'ts and a checklist — [ljJuOxTsrtY 12:29](https://www.youtube.com/watch?v=ljJuOxTsrtY&t=749s), [14:44](https://www.youtube.com/watch?v=ljJuOxTsrtY&t=884s)
- A mini design system skill (about 20 colours, about 6 components: button, input, badge, segmented control, metric tile, transaction row, data table, empty state), "referenced whenever a Vantage interface is created or updated" — [4vItmdk8F_M 13:10](https://www.youtube.com/watch?v=4vItmdk8F_M&t=790s), [14:14](https://www.youtube.com/watch?v=4vItmdk8F_M&t=854s), [15:43](https://www.youtube.com/watch?v=4vItmdk8F_M&t=943s)
- For a full design system: separate skills (rules, styles, token usage, component groups, spacing and shape), then Figma MCP; gets about 85% — [ojS5pcjs3xQ 14:06](https://www.youtube.com/watch?v=ojS5pcjs3xQ&t=846s)
- Type scale settled first with a 16px body; colour roles audited, with Better Colors mapping steps to roles and token names — [PZ6bYA6NsKo 2:25](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=145s), [7:20](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=440s)
- Persona documents and a journey map → a reusable persona-review skill — [F_xmadD8UAA 0:19](https://www.youtube.com/watch?v=F_xmadD8UAA&t=19s)
- A flow home base page before any agent review — [j6rfwigv_1Y 2:05](https://www.youtube.com/watch?v=j6rfwigv_1Y&t=125s), [Oo-5AWdQAt8 5:16](https://www.youtube.com/watch?v=Oo-5AWdQAt8&t=316s)
- Canvas: Claude Code `/design`, or Paper MCP for other agents — [uzQCZD3w3hs 0:32](https://www.youtube.com/watch?v=uzQCZD3w3hs&t=32s), [1:58](https://www.youtube.com/watch?v=uzQCZD3w3hs&t=118s)

### Inferences
- The token or variable layer is barely covered. Only Better Colors (role and token names) and ojS5's design-system skills touch tokens. No video shows a tokens file.

### Gaps
- No video shows what the brand-guideline skill's file actually contains beyond a scroll-past.

## How do they avoid generic "AI slop" output?

### Takeaway
They don't claim to remove it, only to reduce it. The levers: (1) generate one key widget in several forced-different variants, not a whole page; (2) ground output in real shipped patterns (Mobbin), not invention; (3) apply anti-slop skills as specific named commands after you have diagnosed the problem; (4) a brand skill to stop drift; (5) the designer's own critique and manual edits, often in Figma.

### Cited Findings
- "You cannot eliminate AI slop" — [ljJuOxTsrtY 5:35](https://www.youtube.com/watch?v=ljJuOxTsrtY&t=335s); also [uzQCZD3w3hs 5:24](https://www.youtube.com/watch?v=uzQCZD3w3hs&t=324s), [ojS5pcjs3xQ 5:26](https://www.youtube.com/watch?v=ojS5pcjs3xQ&t=326s). Contradicted by the framing of [4vItmdk8F_M 0:00](https://www.youtube.com/watch?v=4vItmdk8F_M&t=0s) ("eliminate AI slop… in three simple steps")
- Named tells: purple-blue gradients, emojis, beige backgrounds, out-of-place cards ([4vItmdk8F_M 0:00](https://www.youtube.com/watch?v=4vItmdk8F_M&t=0s)); coloured left border on rounded cards and an italic phrase in another colour ([uzQCZD3w3hs 6:12](https://www.youtube.com/watch?v=uzQCZD3w3hs&t=372s)); glow and drop shadow ([4vItmdk8F_M 4:03](https://www.youtube.com/watch?v=4vItmdk8F_M&t=243s)); inconsistent type scale with too many headings ([PZ6bYA6NsKo 1:25](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=85s)); one accent colour on both actions and non-actions ([PZ6bYA6NsKo 6:16](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=376s)); gradients and "super bold font" ([J8RYkSHb92E 0:55](https://www.youtube.com/watch?v=J8RYkSHb92E&t=55s)); safe one-column layouts ([ljJuOxTsrtY 0:25](https://www.youtube.com/watch?v=ljJuOxTsrtY&t=25s))
- Forced divergence in prompts: "not just a color variation", "consistent sample data", "keep the underlying numbers identical", "different ways to lay out and present the data, not just different visual styles" — [ljJuOxTsrtY 3:15](https://www.youtube.com/watch?v=ljJuOxTsrtY&t=195s), [j6rfwigv_1Y 10:02](https://www.youtube.com/watch?v=j6rfwigv_1Y&t=602s), [ojS5pcjs3xQ 4:24](https://www.youtube.com/watch?v=ojS5pcjs3xQ&t=264s); or have Claude write the variant prompt first — [F_xmadD8UAA 3:13](https://www.youtube.com/watch?v=F_xmadD8UAA&t=193s)
- Command-first skill use, after your own diagnosis — [Bhc3CL-cQm0 10:34](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=634s), [4vItmdk8F_M 10:06](https://www.youtube.com/watch?v=4vItmdk8F_M&t=606s), [ljJuOxTsrtY 6:41](https://www.youtube.com/watch?v=ljJuOxTsrtY&t=401s)
- Mobbin grounding "inject[s] AI with particular taste" — [uzQCZD3w3hs 8:36](https://www.youtube.com/watch?v=uzQCZD3w3hs&t=516s)

### Inferences
- The most product-relevant anti-slop moves are structural (type scale, colour roles, widget-first, real patterns). The skills are a finishing pass.

### Gaps
- No video tests slop reduction blind or with any count or score.

## How do they review and iterate?

### Takeaway
Side-by-side before/after comparisons; several variants then a cut; comments left on the canvas; screenshot-annotated fix prompts; persona-lens agent reviews of running prototypes; expanded rationale and trade-off annotations for human design reviews; accessibility audits that separate "tested" from "inferred"; human sign-off before handoff.

### Cited Findings
- Before/after kept side by side, including a 25%-speed motion replay harness — [Bhc3CL-cQm0 4:34](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=274s), [PZ6bYA6NsKo 4:44](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=284s)
- Options placed separately on the canvas and chosen before changing the real page — [PZ6bYA6NsKo 23:49](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=1429s)
- Comments and manual deletion on the canvas — [PZ6bYA6NsKo 20:41](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=1241s)
- Screenshots plus a numbered change list — [l7G97gNyM8k 10:53](https://www.youtube.com/watch?v=l7G97gNyM8k&t=653s)
- Persona flow review with confidence scores from 1 to 5 — [j6rfwigv_1Y 3:33](https://www.youtube.com/watch?v=j6rfwigv_1Y&t=213s); persona skill audit — [F_xmadD8UAA 1:59](https://www.youtube.com/watch?v=F_xmadD8UAA&t=119s)
- Rationale, strengths, limitations and trade-offs annotations for design review — [F_xmadD8UAA 5:36](https://www.youtube.com/watch?v=F_xmadD8UAA&t=336s)
- Mobbin benchmark of an existing screen, including "what not to copy" — [J8RYkSHb92E 6:29](https://www.youtube.com/watch?v=J8RYkSHb92E&t=389s)
- Accessibility: "distinguish what you tested directly from what you inferred… do not make any changes yet" — [j6rfwigv_1Y 7:24](https://www.youtube.com/watch?v=j6rfwigv_1Y&t=444s); human annotation step — [Oo-5AWdQAt8 13:25](https://www.youtube.com/watch?v=Oo-5AWdQAt8&t=805s)
- Check that skills actually ran (Stageshow failed silently) — [PZ6bYA6NsKo 24:52](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=1492s)
- Responsive check by resizing — [AGHqBAVyrQs 12:49](https://www.youtube.com/watch?v=AGHqBAVyrQs&t=769s)

### Inferences
- Review is mostly the designer's eye. There is no automated screenshot-against-target check in any video.

### Gaps
- No rubric for judging "good" is ever stated beyond taste and the persona reports.

## Which tools and skills do they name, and is there evidence they help?

### Takeaway
Named: Claude Code `/design`, Claude Design, Codex, Google Antigravity, Paper (MCP), Figma (agents, MCP), Mobbin MCP, Higgsfield (MCP; Nano Banana, Kling 3.0), FFmpeg, Vercel, Lovable (advised against for 3D), Dribbble; skills Impeccable, Taste skill, Stageshow, Emil Kowalski animate / apple-design, Unslop, Color Expert, Better Colors, Anthropic Front-End Design, Anthropic design plugin's accessibility-review, and CVS Health's annotation kit. The evidence is single before/after demos by one presenter. There are no controls (one informal one), no measurements, and there are sponsor ties.

### Cited Findings
- The only stated control: the same motion described without the skill came out worse — [Bhc3CL-cQm0 6:49](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=409s)
- Same prompt in Claude Design and Claude Code: ljJuOxTsrtY says Claude Code is better ([0:25](https://www.youtube.com/watch?v=ljJuOxTsrtY&t=25s)); ojS5pcjs3xQ says they are similar ([0:22](https://www.youtube.com/watch?v=ojS5pcjs3xQ&t=22s))
- Impeccable's popularity: "about 68,000 stars" (a claim about popularity, not about how well it works) — [ljJuOxTsrtY 6:41](https://www.youtube.com/watch?v=ljJuOxTsrtY&t=401s)
- Costs and failures shown: Impeccable token-heavy ([ljJuOxTsrtY 8:56](https://www.youtube.com/watch?v=ljJuOxTsrtY&t=536s), [4vItmdk8F_M 11:28](https://www.youtube.com/watch?v=4vItmdk8F_M&t=688s)); accessibility skill took 15 minutes ([F_xmadD8UAA 8:51](https://www.youtube.com/watch?v=F_xmadD8UAA&t=531s)); button set took 22 minutes and about 90,000 tokens ([ojS5pcjs3xQ 12:59](https://www.youtube.com/watch?v=ojS5pcjs3xQ&t=779s)); Stageshow failed silently ([PZ6bYA6NsKo 24:52](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=1492s)); Mobbin MCP limits ([J8RYkSHb92E 12:37](https://www.youtube.com/watch?v=J8RYkSHb92E&t=757s))
- Time-saving claims are his own estimates: 10 to 20 hours cut to 10 to 15 minutes for the accessibility audit ([j6rfwigv_1Y 8:26](https://www.youtube.com/watch?v=j6rfwigv_1Y&t=506s)); 4 hours cut to 5 to 10 minutes for the competitive report ([J8RYkSHb92E 7:43](https://www.youtube.com/watch?v=J8RYkSHb92E&t=463s))
- Sponsorship: Anthropic ([F_xmadD8UAA](https://www.youtube.com/watch?v=F_xmadD8UAA)); Mobbin partnership ([J8RYkSHb92E 0:00](https://www.youtube.com/watch?v=J8RYkSHb92E&t=0s)); Mobbin affiliate link throughout. He quotes himself on Mobbin's home page ([4vItmdk8F_M 1:16](https://www.youtube.com/watch?v=4vItmdk8F_M&t=76s))
- Emil Kowalski's repo confirms `apple-design` and `animate` exist, along with 17 others, for example `review-animations` and `learn-taste` ([github.com/emilkowalski/skills](https://github.com/emilkowalski/skills))

### Inferences
- Treat the tool rankings as one person's informed opinion with a commercial interest in Mobbin.

### Gaps
- No independent or blind comparison exists in this set.

## Cross-video: repeats, contradictions, product vs marketing

### Takeaway
The most repeated advice: widget first, then the page (7 of 13). Then Impeccable used as named commands, and Mobbin for real patterns (6 each). Then "designer thinks, AI assists" (5). The main contradictions are which tool to start in, whether slop can be "eliminated", whether Impeccable is the answer, and whether reference screenshots are "junior". For a data-dense fantasy-esports product, the structural practices carry over (widget-first, pattern benchmarking, type and colour role audits, a brand skill, persona and accessibility reviews). The image/video/scroll pipeline and Stageshow are for marketing pages.

### Cited Findings

**Repeated practices (count = videos that state or demo it):**
- Most important widget first, several forced-different variants, then build the page around the chosen one: **7**: uzQCZD3w3hs [2:54](https://www.youtube.com/watch?v=uzQCZD3w3hs&t=174s), F_xmadD8UAA [3:13](https://www.youtube.com/watch?v=F_xmadD8UAA&t=193s), ljJuOxTsrtY [3:15](https://www.youtube.com/watch?v=ljJuOxTsrtY&t=195s), j6rfwigv_1Y [9:01](https://www.youtube.com/watch?v=j6rfwigv_1Y&t=541s), ojS5pcjs3xQ [3:08](https://www.youtube.com/watch?v=ojS5pcjs3xQ&t=188s), Oo-5AWdQAt8 [0:20](https://www.youtube.com/watch?v=Oo-5AWdQAt8&t=20s), PZ6bYA6NsKo [15:14](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=914s)
- Impeccable: **6**: Bhc3CL-cQm0, PZ6bYA6NsKo, uzQCZD3w3hs, ljJuOxTsrtY, ojS5pcjs3xQ, 4vItmdk8F_M. Taste skill: **2** (Bhc3CL-cQm0, uzQCZD3w3hs)
- Mobbin MCP prompted for patterns, reports or boards: **6** (PZ6bYA6NsKo, uzQCZD3w3hs, ljJuOxTsrtY, ojS5pcjs3xQ, 4vItmdk8F_M, J8RYkSHb92E). Mobbin used as a screenshot source in 3 more (Oo-5AWdQAt8, 8fva1VtacT8, AGHqBAVyrQs): **9** mention Mobbin in all
- The designer must diagnose, think and edit; AI must not do the thinking: **5** (Bhc3CL-cQm0 [8:21](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=501s), PZ6bYA6NsKo [13:26](https://www.youtube.com/watch?v=PZ6bYA6NsKo&t=806s), F_xmadD8UAA [6:53](https://www.youtube.com/watch?v=F_xmadD8UAA&t=413s), ojS5pcjs3xQ [5:26](https://www.youtube.com/watch?v=ojS5pcjs3xQ&t=326s), Oo-5AWdQAt8 [3:13](https://www.youtube.com/watch?v=Oo-5AWdQAt8&t=193s))
- Use a skill's specific command plus your own specifics, never "fix this": **5** (Bhc3CL-cQm0, PZ6bYA6NsKo, ljJuOxTsrtY, ojS5pcjs3xQ, 4vItmdk8F_M)
- Claude Code `/design` skill with canvas: **4** (uzQCZD3w3hs, F_xmadD8UAA, ljJuOxTsrtY, ojS5pcjs3xQ)
- Higgsfield for images and video: **4** (4vItmdk8F_M, l7G97gNyM8k, 8fva1VtacT8, AGHqBAVyrQs)
- Slop can only be reduced: **3** explicit (uzQCZD3w3hs, ljJuOxTsrtY, ojS5pcjs3xQ)
- Stageshow: **3** (Bhc3CL-cQm0, PZ6bYA6NsKo, uzQCZD3w3hs)
- Brand guideline or design system packaged as Claude skill(s): **3** (ljJuOxTsrtY, 4vItmdk8F_M, ojS5pcjs3xQ)
- Persona-lens agent review: **3** (F_xmadD8UAA, j6rfwigv_1Y, Oo-5AWdQAt8); flow home base **2**
- AI-drafted tab and reading order for developers, checked by a human: **3** (F_xmadD8UAA, j6rfwigv_1Y, Oo-5AWdQAt8)
- Claude Design for the first skeleton → Send to Claude Code → run locally: **3** (l7G97gNyM8k, 8fva1VtacT8, AGHqBAVyrQs)
- Don't copy Mobbin screens one-for-one: **3** (ojS5pcjs3xQ, 4vItmdk8F_M, J8RYkSHb92E)
- Before/after kept side by side: **3** (Bhc3CL-cQm0, PZ6bYA6NsKo, uzQCZD3w3hs)
- Vercel deploy prompt: **3**; Kling with start and end frames plus FFmpeg frame scrubbing: **2**
- Emil Kowalski animate skill: **2** (Bhc3CL-cQm0, PZ6bYA6NsKo)
- Impeccable is token-heavy: **2** (ljJuOxTsrtY, 4vItmdk8F_M)
- Screenshot to Figma (agents or MCP), then finish by hand: **2** (ojS5pcjs3xQ, Oo-5AWdQAt8)
- "Ideally one change per prompt" (then both break it): **2** (Bhc3CL-cQm0, l7G97gNyM8k)

**Contradictions:**
1. Starting tool. Claude Design gives a "better output the first time" for skeletons ([8fva1VtacT8 1:02](https://www.youtube.com/watch?v=8fva1VtacT8&t=62s), [l7G97gNyM8k 5:21](https://www.youtube.com/watch?v=l7G97gNyM8k&t=321s), [AGHqBAVyrQs 2:10](https://www.youtube.com/watch?v=AGHqBAVyrQs&t=130s); June) vs the two are "relatively similar" ([ojS5pcjs3xQ 1:42](https://www.youtube.com/watch?v=ojS5pcjs3xQ&t=102s); August) vs Claude Design is "very clearly AI slop" and Claude Code is better ([ljJuOxTsrtY 0:25](https://www.youtube.com/watch?v=ljJuOxTsrtY&t=25s); September) vs "you really don't need Claude Design anymore" ([uzQCZD3w3hs 0:32](https://www.youtube.com/watch?v=uzQCZD3w3hs&t=32s); November). This may reflect product updates over time rather than a true conflict.
2. Can slop be eliminated? "Eliminate AI slop… in three simple steps" ([4vItmdk8F_M 0:00](https://www.youtube.com/watch?v=4vItmdk8F_M&t=0s)) vs "you cannot eliminate AI slop" ([ljJuOxTsrtY 5:35](https://www.youtube.com/watch?v=ljJuOxTsrtY&t=335s)).
3. Impeccable as the answer ([Bhc3CL-cQm0 7:13](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=433s)) vs moving away from it: token cost, weak on rigid brand rules, enterprise compliance ([4vItmdk8F_M 11:28](https://www.youtube.com/watch?v=4vItmdk8F_M&t=688s)); and run it only at the end ([ljJuOxTsrtY 8:56](https://www.youtube.com/watch?v=ljJuOxTsrtY&t=536s)).
4. Reference screenshots are "a very junior workflow" ([4vItmdk8F_M 0:00](https://www.youtube.com/watch?v=4vItmdk8F_M&t=0s)) vs used as the main input in [8fva1VtacT8 1:02](https://www.youtube.com/watch?v=8fva1VtacT8&t=62s), [AGHqBAVyrQs 1:19](https://www.youtube.com/watch?v=AGHqBAVyrQs&t=79s), [l7G97gNyM8k 0:50](https://www.youtube.com/watch?v=l7G97gNyM8k&t=50s).
5. Loose prompts ("half the fun is seeing what it comes back with": [8fva1VtacT8 5:07](https://www.youtube.com/watch?v=8fva1VtacT8&t=307s), [AGHqBAVyrQs 8:44](https://www.youtube.com/watch?v=AGHqBAVyrQs&t=524s)) vs detailed diagnosis ([Bhc3CL-cQm0 10:34](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=634s)). The same video concedes detailed prompts work better first time ([AGHqBAVyrQs 6:59](https://www.youtube.com/watch?v=AGHqBAVyrQs&t=419s)).
6. Browser agent for persona tests: Google Antigravity is "way better" ([j6rfwigv_1Y 2:05](https://www.youtube.com/watch?v=j6rfwigv_1Y&t=125s)) vs Claude Code's browser in the Anthropic-sponsored video ([F_xmadD8UAA 0:19](https://www.youtube.com/watch?v=F_xmadD8UAA&t=19s)).
7. Design systems in Claude: Claude is "not built… to iterate on designs with your design system connected" ([ojS5pcjs3xQ 11:50](https://www.youtube.com/watch?v=ojS5pcjs3xQ&t=710s)) vs a brand skill keeps designs on brand ([ljJuOxTsrtY 15:39](https://www.youtube.com/watch?v=ljJuOxTsrtY&t=939s)). They reconcile by size: a mini system fits a skill, a full one does not ([4vItmdk8F_M 15:43](https://www.youtube.com/watch?v=4vItmdk8F_M&t=943s)).
8. Mobbin vs Dribbble: Mobbin is real and tested, Dribbble "futuristic" and unproven ([4vItmdk8F_M 1:16](https://www.youtube.com/watch?v=4vItmdk8F_M&t=76s)) vs Dribbble first for out-of-the-box heroes ([AGHqBAVyrQs 1:19](https://www.youtube.com/watch?v=AGHqBAVyrQs&t=79s)). This is consistent once split by product vs marketing.

**Product app vs marketing landing page (what the videos say):**
- Product-oriented demos in the videos: dashboards, widgets, onboarding, settings, data tables (F_xmadD8UAA, ljJuOxTsrtY, j6rfwigv_1Y, ojS5pcjs3xQ, Oo-5AWdQAt8, J8RYkSHb92E, PZ6bYA6NsKo, 4vItmdk8F_M). Unslop is pitched at "dashboards and cards" ([Bhc3CL-cQm0 12:08](https://www.youtube.com/watch?v=Bhc3CL-cQm0&t=728s)).
- Marketing-oriented: Stageshow "when you're building your marketing pages or product demos" ([uzQCZD3w3hs 9:22](https://www.youtube.com/watch?v=uzQCZD3w3hs&t=562s)); the Higgsfield/Kling/FFmpeg/Vercel videos (l7G97gNyM8k, 8fva1VtacT8, AGHqBAVyrQs); Dribbble for futuristic heroes ([AGHqBAVyrQs 1:19](https://www.youtube.com/watch?v=AGHqBAVyrQs&t=79s)).

### Inferences (my opinion, not the videos')
- **Suits a data-dense fantasy esports product:** widget-first variants with identical sample data (for example, a player price/points card or a fixtures row, compared with the same numbers); Mobbin pattern reports and benchmarking for tables, leaderboards and team pickers (with care: Mobbin is Western finance and consumer apps, and its patterns won't give a Korean or LCK feel); a type-scale audit with a fixed body size; colour-role audits (action vs status vs team colour), where Better Colors' role and token mapping fits a token setup; Impeccable distill / quieter / clarify and Unslop on busy dashboards, run late given the token cost; a compact brand/plate skill rather than the full system; persona-lens reviews (for example an FPL veteran or an LCK fan) as a gap-finder, not as evidence; tab and reading-order audits for dense tables with "tested vs inferred" separated.
- **Suits marketing landing pages:** Stageshow; Higgsfield, Nano Banana and Kling imagery; FFmpeg scroll-scrubbed video; "Apple-like load effects"; 3D heroes; Dribbble references; Vercel quick deploys.
- **Either, with care:** Emil Kowalski's animate and apple-design skills. For a product app, motion matters on trays, sheets and confirmations, not page-load showpieces.
- **Weak fit for a dense product:** loose "see what it comes back with" prompting, and "apply the same visual thinking to the other pages" bulk restyles, which risk drift across many screens.

### Gaps
- No video addresses non-Western or culture-specific visual identity, which matters for a Korean-themed product.
- No video shows a genuinely high-density data screen beyond a single data table in j6rfwigv_1Y, or how widget-first scales to a screen of many equal-weight tables.
