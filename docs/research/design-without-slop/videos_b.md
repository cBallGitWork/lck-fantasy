# What eight UI Collective videos teach about designing with Claude

**Contents:** [Q0. Per-video breakdown: what each video teaches](#q0-per-video-breakdown-what-each-video-teaches) · [Q1. What files or systems do they set up before designing?](#q1-what-files-or-systems-do-they-set-up-before-designing) · [Q2. How do they avoid generic "AI slop"?](#q2-how-do-they-avoid-generic-ai-slop) · [Q3. How do they review and iterate?](#q3-how-do-they-review-and-iterate) · [Q4. Which tools and skills are named, and is there evidence they help?](#q4-which-tools-and-skills-are-named-and-is-there-evidence-they-help) · [Q5. Cross-video: repeated practices, contradictions, and fit for a data-dense app vs a landing page](#q5-cross-video-repeated-practices-contradictions-and-fit-for-a-data-dense-app-vs-a-landing-page)


Scope: eight transcripts in `~/.claude/yt-transcripts/` (YouTube machine captions, read in full). Mishearings fixed: "quad/claw code" = Claude Code, "claw design" = Claude Design, "Mobin" = Mobbin (spelling confirmed by the video descriptions), "Wick/WIKG" = WCAG, "Verscell" = Vercel, "Codeex" = Codex, "Grock" = Grok, "Figma UI skill" = the `figma-use` skill.

Source caveats that apply to everything below:
- **One creator, one channel.** All eight are from UI Collective (host Kirk, X handle KirkMDesign). There is no independent second view. The cross-video counts below measure how often he repeats himself, not agreement between people.
- **Commercial ties.** jO-wH4zgJV0 and 7AkUmYwTMOg say "This video is sponsored by Anthropic" and are tagged #ClaudePartner. lwOIVNRHndM and nbk0PMS0tos say "we again teamed up with Mobbin" and carry a 20%-off affiliate link. Every video promotes his paid academy, and several promote his design-system consultancy.
- **Evidence is demo-grade.** Each claim of improvement rests on one before/after run that he judges by eye on camera. No video shows a repeated or measured comparison.

Model names are given as the videos say them: Opus 4.6, 4.7, 4.8 and 5, with "Fable 5" named as online hype.

---

## Q0. Per-video breakdown: what each video teaches

### Takeaway
All eight videos carry one method: write Claude **skills** that hold the context (brand rules, design-system tokens and components, reference screenshots), build **one section at a time**, preview locally before pushing to Figma, and run an **audit skill** to catch drift. The longer, later videos turn this into a full pipeline: audit, direction, guardrails, build, QA, pitch.

### Cited Findings

#### 1. "Web Design with Claude Code: The Complete Guide"
UI Collective · 20 Jul 2026 · 1:11:10 · sponsored by Anthropic · https://www.youtube.com/watch?v=jO-wH4zgJV0

Summary: a full website workflow for an agency or in-house designer. The steps are: audit the old site → set a direction using Mobbin research → write a brand "guardrails" skill that holds reference screenshots → wireframe in Claude Design → build section by section in Claude Code → QA skill → deploy to Vercel → pitch deck built from a Claude Project. Its main claim is that slop comes from leaving decisions "open for interpretation by AI", so every decision should be written down first.

Practices:
- **Audit a live site visually.** Claude Code can now open a URL in its built-in browser (the globe icon) and look at the visuals, not just the code. Before that, he needed a screenshot tool he had built on the API. — [6:39](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=399s), [5:17](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=317s)
- **"Website audit" skill.** Prompt: produce a deliberately messy, exhaustive raw `website-audit.md`; "do not invent facts or analytics"; "clearly label assumptions"; "do not change the website". The generated skill expects 60–120 findings, with severity levels and rules that do not bend. — [8:28](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=508s)
- **Skills standardise the process,** so that different prompts from colleagues don't produce different results. — [9:46](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=586s)
- **A second skill turns the raw audit into a client-ready Word report** (executive summary, priorities, next steps). The detailed audit and the condensed report stay as separate steps. — [12:13](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=733s), [13:53](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=833s)
- **Connect the Mobbin MCP** (a reference library of real app and website screens) as a custom connector in the Claude desktop app. — [18:24](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=1104s)
- **Research prompt:** "research leading finance websites on Mobbin and identify the design patterns they have in common." — [19:35](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=1175s)
- **Moodboard from Mobbin** ("dozens of looks and feels"). He had to re-prompt for real images instead of links. — [20:38](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=1238s), [21:43](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=1303s)
- **Deep-dive on the chosen direction.** Break it into themes (fonts, type scale, colour, layout, imagery, "data and numbers", motion, voice), with what to lean into and what to hold back. — [22:36](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=1356s)
- **Competitive report** via Mobbin; save every artefact as you go. — [24:32](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=1472s)
- **Brief before building:** audience, primary message, conversion goal, page structure, design principles. — [25:43](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=1543s)
- **Brand guardrails skill.** Name it after the client so skills can be switched per client. Use the direction PDF "as a source of truth". The output is "an internal design instruction set for Claude", with no personas, competitor analysis or "unsupported assumptions". Keep adding to it as drift shows up. — [26:34](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=1594s), [27:43](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=1663s)
- **Put example screenshots inside the skill.** "A guardrail does not translate to an actual UI." He stores screenshots in an assets/examples folder and tells the skill to check them when building each section. — [29:55](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=1795s), [31:36](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=1896s)
- **"Translate, do not copy."** He corrected Claude when it matched a reference footer one-to-one. The rule now reads: look at all references, apply the treatment that fits, and swap brand-specific parts for the client's tokens. — [32:54](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=1974s)
- **You do the strategic thinking.** Don't let Claude decide how to address the audit findings, or you can't defend the design later. He keeps the audit out of the design skill and uses it in the QA skill instead. — [36:08](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=2168s), [37:12](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=2232s)
- **Don't load everything into one chat.** The context window overfills and Claude hallucinates. Skills carry context across fresh chats. — [38:12](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=2292s)
- **Pick any build order** (whole page then sections; section by section from the navbar; Claude Design then Claude Code; Figma then Claude Code). His own: Claude Design wireframe → Claude Code. — [39:45](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=2385s)
- **No wireframes for product dashboards.** Clients and stakeholders expect high fidelity. Wireframes are only for websites. — [42:00](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=2520s)
- **Build the Claude Design prompt from lines lifted out of the skill** (e.g. "Warm, never soft. Warmth is the accent, not the argument"). Add the audit's section needs and attach an image of the hex codes. Use the wireframe template. — [43:00](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=2580s), [43:22](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=2602s)
- **Why wireframe and not high fidelity in Claude Design:** its output has a recognisable "Claude Design look". A high-fidelity draft pulls Claude Code towards that look, while a wireframe lets the skill and references drive. Giving Claude Design the skill.md still looked like Claude Design, and Claude Design's skills aren't your skills. — [46:26](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=2786s), [48:19](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=2899s)
- **Keep a copy of every wireframe option;** send one to Claude Code. — [50:09](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=3009s)
- **"One-prompting a world-class website… does not really exist."** Expect iteration. — [51:38](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=3098s)
- **If the draft hugs the wireframe, say so:** "It's okay to drift away from the wireframe to explore new options." — [53:05](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=3185s)
- **Go section by section, hero first.** Use the Mobbin MCP to find new references that match the skill's look, then feed screenshots one section at a time. — [55:51](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=3351s), [57:11](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=3431s), [57:57](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=3477s)
- **2×2 grids "usually lead to something that looks a little bit AI generated".** — [59:10](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=3550s)
- **About five prompts after setup;** Opus runs can take up to 10 minutes. — [1:00:17](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=3617s)
- **Evidence for the guardrails:** an off-brand reference (Wise's green case study) came back on-brand in one prompt. — [1:01:12](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=3672s)
- **QA skill, run after each section.** It takes a screenshot; if it can't, it "stops and asks rather than guessing". It reports, then offers fixes and "never edits unprompted". Output is a pass/watch verdict table plus a saved .md. — [1:02:08](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=3728s), [1:03:04](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=3784s), [1:04:08](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=3848s)
- **Deploy to Vercel,** ideally through GitHub. — [1:04:59](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=3899s)
- **One Claude Project per client** holding all chats and files, then "summarise our journey" into a pitch deck. — [1:07:23](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=4043s), [1:09:02](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=4142s)

#### 2. "Claude Code for Designers: All the Ways to Use It"
UI Collective · 26 May 2026 · 51:38 · sponsored by Anthropic · https://www.youtube.com/watch?v=7AkUmYwTMOg

Summary: Claude Code is most useful for the work around design, not for drawing screens. Covered: component spec and developer handoff skills, Claude **Routines** that keep that documentation current, design-system consistency audits, accessibility checks, type scales and Figma variables, and a JSON token export. Also covered: where **not** to use AI (UI/UX critique, generating a whole variable library).

Practices:
- **Spend tokens on targeted jobs,** not daily iteration on screens ("expensive… takes a lot of time"). — [1:54](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=114s)
- **Use Opus for rare, thinking-heavy jobs** (writing documentation, spotting what changed). — [5:16](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=316s)
- **Component-spec skill sections:** what it is (one sentence), when to use, when not, variants, states, anatomy, Figma properties, do/don't, accessibility (keyboard and screen reader), related atom components. Claude added a fill-in template and two worked examples "so Claude knows the quality bar". — [6:23](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=383s), [7:35](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=455s)
- **Routine to update the docs, triggered by hand, never on a schedule,** "because design is an iterative process". Scheduled local routines only run while the computer is awake. — [9:33](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=573s), [10:37](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=637s)
- **Routine instructions:** link the exact Figma file; first identify what changed (new variants, renamed tokens…); draft in the existing format; "Do not edit anything in Figma"; update only after approval. — [11:51](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=711s)
- **Install Figma's skills:** `figma-use` (as a zip uploaded as a plugin), plus `audit-design-system` and `apply-design-system` as single skill.md files. The Figma plugin now in the directory bundles some of them. — [12:48](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=768s), [14:00](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=840s)
- **Build locally as HTML first, then push to Figma.** — [15:37](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=937s)
- **When running a routine, say "do not use any component… specific Claude skills".** Similarly named skills and routines get confused, so name them apart. — [17:55](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=1075s)
- **Developer handoff skill:** parts, sizing (width, height, padding, gap, radius), tokens, states, behaviour, accessibility, responsive rules, **edge cases (long text, missing content, overflow, empty states)**, composition. Agree the format with developers. — [19:52](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=1192s)
- **Don't ask AI for UI or UX feedback.** It lacks your project context and creates "a never-ending cycle". Ask your team or a design community instead. — [25:59](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=1559s)
- **Do use AI to audit for consistency** ("winner winner"). Not worth it: audits for progress, or for accidental changes ("lock your layers"). — [27:00](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=1620s)
- **`audit-design-system` on a Figma link.** It caught raw frames and hard-coded hex values next to proper instances, giving a verdict, a confidence figure and prioritised findings. He calls this "a 5-hour workflow condensed into 10 minutes". — [29:19](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=1759s), [30:03](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=1803s)
- **Anthropic's design plugin:** he uses only the accessibility review, and finds its generic feedback, handoff and research-synthesis skills less useful than custom ones. — [32:01](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=1921s), [33:11](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=1991s)
- **The accessibility review gives false positives** (e.g. imagined dark backgrounds, missing loading and pressed states that were left out on purpose). Otherwise "senior designer… level". — [34:29](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=2069s)
- **Type scale:** preview locally; desktop and mobile; "keep all font attributes to a multiple of four". — [35:50](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=2150s), [38:03](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=2283s)
- **Push variables first, then styles linked to them.** Name the collections (brand, alias, mapped, responsive) in the prompt. — [40:04](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=2404s)
- **Don't let Claude invent your semantic variable library.** "Do you know when to use subtle versus muted? No." The fix-and-retry loop costs more than building it yourself. — [43:13](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=2593s), [45:22](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=2722s)
- **Export Figma variables to a JSON token file** for developers; agree its structure with them. — [48:00](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=2880s)

#### 3. "Claude Code for Designers (Full Overview)"
UI Collective · 7 Apr 2026 · 26:23 · https://www.youtube.com/watch?v=mwq70TpWQkA

Summary: an overview covering the Figma MCP connection; generic output from a bare prompt; a reference-screenshot skill as the fix; documentation; Figma skills, which are inconsistent and slow; the `audit-design-system` drift check as the most valuable piece; and Anthropic's design plugin for accessibility. It ends by recommending your own skill holding your design-system rules.

Practices:
- **Connect the "interactive" Figma connector** in the Claude desktop app. — [0:32](https://www.youtube.com/watch?v=mwq70TpWQkA&t=32s)
- **Work on small elements** (a hero, not a landing page). He switched from Sonnet to Opus. — [1:21](https://www.youtube.com/watch?v=mwq70TpWQkA&t=81s)
- **A bare prompt gives a "real standard-looking AI-generated design"** because no examples were fed. — [2:33](https://www.youtube.com/watch?v=mwq70TpWQkA&t=153s)
- **Iterate in Claude and push to Figma only when happy.** Going back and forth burns tokens and gets messy. — [3:14](https://www.youtube.com/watch?v=mwq70TpWQkA&t=194s)
- **Work in small stages,** or "that's when Claude starts to make mistakes". — [4:05](https://www.youtube.com/watch?v=mwq70TpWQkA&t=245s)
- **Screenshot similar-looking references from Mobbin** ("keep it a little bit similar"). — [5:07](https://www.youtube.com/watch?v=mwq70TpWQkA&t=307s)
- **Prompt:** "build me a reusable skill where every time a design is being generated, Claude looks at the examples in this skill… Store these screenshots inside… a folder… called examples." — [6:15](https://www.youtube.com/watch?v=mwq70TpWQkA&t=375s)
- **Result:** "more on brand… doesn't feel as AI-generated". He suggests spending half a day on the skill. — [8:05](https://www.youtube.com/watch?v=mwq70TpWQkA&t=485s)
- **Generate component docs from a Figma link.** Without Figma skills they use raw hex values, not instances. — [9:18](https://www.youtube.com/watch?v=mwq70TpWQkA&t=558s)
- **Figma skills are "wildly inconsistent"** and "sometimes like six times longer". He switches them on and off per task. — [10:55](https://www.youtube.com/watch?v=mwq70TpWQkA&t=655s), [11:56](https://www.youtube.com/watch?v=mwq70TpWQkA&t=716s)
- **If a skill upload fails, quit and reopen Claude.** — [12:51](https://www.youtube.com/watch?v=mwq70TpWQkA&t=771s)
- **The `apply-design-system` test applied variables but missed text styles.** — [16:25](https://www.youtube.com/watch?v=mwq70TpWQkA&t=985s)
- **Don't work in the Figma file while Claude does.** Claude doesn't snap to the nearest style: with no exact match, it applies nothing. — [17:38](https://www.youtube.com/watch?v=mwq70TpWQkA&t=1058s), [18:52](https://www.youtube.com/watch?v=mwq70TpWQkA&t=1132s)
- **Give the design-system link, and name which one if you have several.** A from-scratch hero then used the right components and styles, though "the design's not great". — [19:24](https://www.youtube.com/watch?v=mwq70TpWQkA&t=1164s)
- **Paste a direct link to the design and ask for a drift audit** ("saves the AI from having to go look for it"). — [21:33](https://www.youtube.com/watch?v=mwq70TpWQkA&t=1293s)
- **Accessibility audit** with Anthropic's design plugin. — [23:19](https://www.youtube.com/watch?v=mwq70TpWQkA&t=1399s)
- **Treat plugin skills as starting points and customise them.** "Create a Claude skill with all of the rules of your design system… When to use certain variables, when not to." — [24:20](https://www.youtube.com/watch?v=mwq70TpWQkA&t=1460s)

#### 4. "Train Claude on Your Design System (Advanced Workflow)"
UI Collective · 11 Aug 2026 · 26:18 · https://www.youtube.com/watch?v=VezxOhvoXqU

Summary: five custom skills that teach Claude a design system: (1) rules and debt, (2–4) one per component group, (5) colour tokens, plus type styles and a spacing-and-shape skill. Rules must be written down the way you would brief a new designer, and accepted flaws as well. Give usage rules where they matter (tokens, components); for type, radius and spacing, just make Claude aware of what exists. Build card by card.

Practices:
- **Rules-and-debt skill per product.** Rules: when a component may and may not be used (e.g. no search in a four-item menu; the radio-versus-checkbox threshold). Debt: known flaws that must stay, such as a legacy button that fails WCAG AA. Ask yourself "What do I have to tell a new designer?" and "What do we want to change that we simply can't?" — [0:57](https://www.youtube.com/watch?v=VezxOhvoXqU&t=57s), [2:29](https://www.youtube.com/watch?v=VezxOhvoXqU&t=149s), [4:53](https://www.youtube.com/watch?v=VezxOhvoXqU&t=293s)
- **Without rules, AI "starts… inventing UX treatments"** found nowhere else in your product. — [2:29](https://www.youtube.com/watch?v=VezxOhvoXqU&t=149s)
- **Skills can't be copied between companies;** rules and debt are unique to each. — [4:53](https://www.youtube.com/watch?v=VezxOhvoXqU&t=293s)
- **Don't hand over all 75 components at once.** Claude follows a nested atom (e.g. a checkbox inside a table cell) and skips components in between. — [7:15](https://www.youtube.com/watch?v=VezxOhvoXqU&t=435s), [8:33](https://www.youtube.com/watch?v=VezxOhvoXqU&t=513s)
- **Group components** (form elements, navigation, data display). One skill per group, with the prompt "Do not review components from any other grouping." — [8:33](https://www.youtube.com/watch?v=VezxOhvoXqU&t=513s), [10:25](https://www.youtube.com/watch?v=VezxOhvoXqU&t=625s)
- **Check that every component was picked up.** In his runs, Opus 5 missed components that Opus 4.8 caught. — [10:25](https://www.youtube.com/watch?v=VezxOhvoXqU&t=625s)
- **Don't train Claude on tokens until you're confident in them.** Changes every few weeks lead to "a never-ending spiral". — [11:23](https://www.youtube.com/watch?v=VezxOhvoXqU&t=683s)
- **Token template:** name, light value, dark value, **description** (e.g. "background token for main page level containers"). Document only the mapped (component-applied) collection. Keep the prompt to colour only so it doesn't pick up number variables. — [11:23](https://www.youtube.com/watch?v=VezxOhvoXqU&t=683s)
- **Type styles:** awareness only, with "Do not create usage guidelines". Strict type rules confuse AI into inventing sizes. Fix styles by hand afterwards. — [14:45](https://www.youtube.com/watch?v=VezxOhvoXqU&t=885s), [17:09](https://www.youtube.com/watch?v=VezxOhvoXqU&t=1029s)
- **One "spacing and shape" catch-all skill** for radius, border width, shadows, gap and padding. "AI has more taste than you probably realize." — [17:19](https://www.youtube.com/watch?v=VezxOhvoXqU&t=1039s), [18:53](https://www.youtube.com/watch?v=VezxOhvoXqU&t=1133s)
- **"Layout variables":** each value pairs a desktop and a mobile size per use case (e.g. small→extra-small). Spacing is rarely right first time. — [20:17](https://www.youtube.com/watch?v=VezxOhvoXqU&t=1217s), [22:35](https://www.youtube.com/watch?v=VezxOhvoXqU&t=1355s)
- **"Focus on card by card, section by section."** Jumping to a whole page brings hallucination. — [22:35](https://www.youtube.com/watch?v=VezxOhvoXqU&t=1355s)
- **Preview first, then push.** Then check by hand: no raw hex, right components, right heading styles. — [24:14](https://www.youtube.com/watch?v=VezxOhvoXqU&t=1454s)
- **The preview is sometimes off-brand when Figma is right.** Remind Claude the skills exist. — [25:35](https://www.youtube.com/watch?v=VezxOhvoXqU&t=1535s)

#### 5. "Design in Claude Code Like This"
UI Collective · 13 Apr 2026 · 15:51 · Mobbin partnership · https://www.youtube.com/watch?v=lwOIVNRHndM

Summary: three things for good AI designs: Claude understands your **tokens**, understands your **components**, and has **examples** of what you want. Build a token skill from a described token table and a component skill from grouped components, gather a few similar Mobbin screenshots, generate a paywall locally, push to Figma, then check it for drift.

Practices:
- **Don't hand Claude a bare variables file.** Names and values alone don't tell it when to use each. Spend an hour on a table of name, light value, dark value and a one-line "when to use". — [0:55](https://www.youtube.com/watch?v=lwOIVNRHndM&t=55s)
- **Prompt:** review all tokens in the linked frame, then "build a Claude skill that will inform Claude on when to use each token… and when not to." — [2:43](https://www.youtube.com/watch?v=lwOIVNRHndM&t=163s)
- **Figma skills miss components;** group them to fix this. The generated skill had a reference file per group. Big systems may need one skill per group. Ask for variants and properties as well. — [4:40](https://www.youtube.com/watch?v=lwOIVNRHndM&t=280s), [7:06](https://www.youtube.com/watch?v=lwOIVNRHndM&t=426s)
- **"The worst thing… build me a modal, make it look better… too vague."** Feed examples. — [7:48](https://www.youtube.com/watch?v=lwOIVNRHndM&t=468s)
- **Pick 2–3 references that resemble each other** (here Manus, Informed News, Rocket Money paywalls). "We don't want to go too crazy with it." — [9:16](https://www.youtube.com/watch?v=lwOIVNRHndM&t=556s)
- **Prompt:** attached examples + token skill + component skill + design-system file link → HTML paywall locally. Give the link even with skills installed. — [11:28](https://www.youtube.com/watch?v=lwOIVNRHndM&t=688s)
- **Review, then push with "ensure you use all components, variables, and styles".** Iterating locally is easier. — [13:17](https://www.youtube.com/watch?v=lwOIVNRHndM&t=797s)
- **Check responsiveness, variables, components and text styles in Figma.** "The more complex the design, the more it's going to miss." — [14:20](https://www.youtube.com/watch?v=lwOIVNRHndM&t=860s)

#### 6. "Generate Better AI Designs in Claude Code"
UI Collective · 16 Mar 2026 · 11:00 · Mobbin partnership · https://www.youtube.com/watch?v=nbk0PMS0tos

Summary: a before-and-after. The same one-line prompt ("landing page for a crypto bank") is run bare, then again with a "design inspiration" skill holding six Mobbin screenshots (Linear plus one site captioned "Rock(s)"). The second is a closer first draft. The more you add to the skill, the better.

Practices:
- **Baseline slop described:** "an aggressive use of gradients… basic metrics… cards… look a little AI-generated." — [1:25](https://www.youtube.com/watch?v=nbk0PMS0tos&t=85s)
- **Prompt:** build a skill called "design inspiration"; "every time a design is created or modified Claude will look at the files inside this skill, which will include visual references of designs I want to mimic." Claude created an images folder. — [2:39](https://www.youtube.com/watch?v=nbk0PMS0tos&t=159s), [3:51](https://www.youtube.com/watch?v=nbk0PMS0tos&t=231s)
- **Go to Mobbin first** to see what competitors do. — [5:40](https://www.youtube.com/watch?v=nbk0PMS0tos&t=340s)
- **Put each company's screenshots in its own subfolder** and give the files meaningful names. — [7:22](https://www.youtube.com/watch?v=nbk0PMS0tos&t=442s)
- **Re-run the identical prompt;** Claude "studied the references". — [8:43](https://www.youtube.com/watch?v=nbk0PMS0tos&t=523s), [9:00](https://www.youtube.com/watch?v=nbk0PMS0tos&t=540s)
- **Split references into folders by section type** (hero, footer, content blocks). — [10:10](https://www.youtube.com/watch?v=nbk0PMS0tos&t=610s)

#### 7. "How I Actually Use Claude Code in My Design Workflow"
UI Collective · 3 Mar 2026 · 13:23 · https://www.youtube.com/watch?v=TKScxZtESzs

Summary: two everyday uses. (1) Claude studies a sample documentation page in Figma and writes matching docs for other components straight into Figma. (2) Claude prototypes **complex UX problems** (a filterable 50,000-row table) as working local code, to explore the experience rather than the look, then sends parts to Figma to rebuild with real components.

Practices:
- **Limits as of March 2026:** auto layout issues, component instances not applied even with the design system uploaded, variables "hit or miss". — [1:08](https://www.youtube.com/watch?v=TKScxZtESzs&t=68s)
- **Docs from a template:** have Claude study one finished documentation page (content, length, frame format) with "We will not make any edits", then "apply the same pattern" to the next component and push to Figma. — [4:58](https://www.youtube.com/watch?v=TKScxZtESzs&t=298s), [6:26](https://www.youtube.com/watch?v=TKScxZtESzs&t=386s), [7:57](https://www.youtube.com/watch?v=TKScxZtESzs&t=477s)
- **Use Claude Code for complex UX, not polish:** "I don't care if the design isn't perfect, but it helps me visualize what the experience could be." Talk it through with Claude, review the local build, then recreate it with your design system. — [9:06](https://www.youtube.com/watch?v=TKScxZtESzs&t=546s)
- **Prompt:** "complex data visualization table component with potentially 50,000 rows… clean table component with advanced filtering and column management." — [10:20](https://www.youtube.com/watch?v=TKScxZtESzs&t=620s)
- **Click through the working prototype** (filters, column chooser, export). — [11:01](https://www.youtube.com/watch?v=TKScxZtESzs&t=661s)
- **Send only the parts you want to Figma** (e.g. the column manager, empty and selected states) and rebuild them with your own components. — [12:02](https://www.youtube.com/watch?v=TKScxZtESzs&t=722s)

#### 8. "Design with Claude Code: The Designer's Guide"
UI Collective · 23 Feb 2026 · 16:10 · https://www.youtube.com/watch?v=JMQ0X_si144

Summary: an introduction covering what Claude Code is (the agent, as opposed to the model), installing it in the terminal or desktop app, the Figma MCP plugin, the two-way Figma sync (build → send elements to Figma → edit → send the link back to update the code), and Pencil (pencil.dev) as a friendlier front end. Warns that "one-shot" claims online hide the effort.

Practices:
- **People posting results online don't show the effort;** no one-shot "five-star design". — [0:53](https://www.youtube.com/watch?v=JMQ0X_si144&t=53s), [2:21](https://www.youtube.com/watch?v=JMQ0X_si144&t=141s)
- **Claude Code is the agent; Opus is the model.** — [3:25](https://www.youtube.com/watch?v=JMQ0X_si144&t=205s)
- **If installation fails, screenshot the terminal and ask the AI.** — [4:27](https://www.youtube.com/watch?v=JMQ0X_si144&t=267s)
- **`/plugin install figma@claude-plugins-official`** (from the description), then authenticate the right Figma account. — [6:07](https://www.youtube.com/watch?v=JMQ0X_si144&t=367s)
- **Send selected elements, not whole screens,** to Figma to "jam on individual elements". Widen the preview window first or Figma gets the squashed layout. — [8:35](https://www.youtube.com/watch?v=JMQ0X_si144&t=515s), [11:43](https://www.youtube.com/watch?v=JMQ0X_si144&t=703s)
- **Two-way sync:** edit in Figma (e.g. delete the emojis), paste the selection link and ask Claude to update the code. — [10:19](https://www.youtube.com/watch?v=JMQ0X_si144&t=619s)
- **Responsiveness is never right first time.** — [8:35](https://www.youtube.com/watch?v=JMQ0X_si144&t=515s)
- **Desktop app works the same;** keep work in the same folder. — [11:59](https://www.youtube.com/watch?v=JMQ0X_si144&t=719s)
- **Pencil (pencil.dev):** live build view and preset UI kits, but no Figma export at the time. — [13:32](https://www.youtube.com/watch?v=JMQ0X_si144&t=812s), [14:31](https://www.youtube.com/watch?v=JMQ0X_si144&t=871s)

### Inferences
- The channel's method changes over six months: from "push to Figma and riff" (Feb–Mar), to reference-screenshot skills (Mar–Apr), to design-system skill sets (Apr, Aug), to a full guardrails + QA pipeline (Jul). Later videos should outweigh earlier ones where they disagree.

### Gaps
- The second Mobbin reference in nbk0PMS0tos is captioned "Rock"/"Rocks" and couldn't be identified from the transcript.
- None of the videos show the full text of a generated skill.md, so the exact skill structure can't be reproduced from these sources.

---

## Q1. What files or systems do they set up before designing?

### Takeaway
Before any screen: a **skill** (a SKILL.md plus folders) that holds, depending on the job, (a) brand guardrails from a brief, (b) reference screenshots in an examples folder, (c) design-system rules and debt, (d) one component skill per group, (e) a token table with "when to use" descriptions, (f) type styles and spacing/shape. Connections: Figma MCP, Figma's skills, Mobbin MCP, and for marketing work a Claude Project per client.

### Cited Findings
- Brief fields (audience, primary message, conversion goal, page structure, design principles) become a client-named guardrails skill, "an internal design instruction set for Claude". — [jO-wH4zgJV0 25:43](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=1543s), [27:43](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=1663s)
- Reference screenshots stored inside the skill and checked per section. — [jO-wH4zgJV0 31:36](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=1896s); [mwq70TpWQkA 6:15](https://www.youtube.com/watch?v=mwq70TpWQkA&t=375s); [nbk0PMS0tos 2:39](https://www.youtube.com/watch?v=nbk0PMS0tos&t=159s)
- Token table with descriptions. — [lwOIVNRHndM 0:55](https://www.youtube.com/watch?v=lwOIVNRHndM&t=55s); [VezxOhvoXqU 11:23](https://www.youtube.com/watch?v=VezxOhvoXqU&t=683s)
- Five skills: rules and debt, three component groups, tokens, type, spacing and shape. — [VezxOhvoXqU 4:53](https://www.youtube.com/watch?v=VezxOhvoXqU&t=293s), [10:25](https://www.youtube.com/watch?v=VezxOhvoXqU&t=625s), [17:19](https://www.youtube.com/watch?v=VezxOhvoXqU&t=1039s)
- Figma skills (`figma-use`, `apply-design-system`, `audit-design-system`). — [7AkUmYwTMOg 12:48](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=768s); [mwq70TpWQkA 12:51](https://www.youtube.com/watch?v=mwq70TpWQkA&t=771s); [lwOIVNRHndM 10:12](https://www.youtube.com/watch?v=lwOIVNRHndM&t=612s). Name check: `figma-use` is the base skill from github.com/figma/skills; `audit-design-system` and `apply-design-system` are attributed to Edenspiekermann on skill registries, while Figma's resource library lists them as community favourites — [Figma resource library](https://www.figma.com/resource-library/claude-skills-for-design/), [skills.sh audit-design-system](https://skills.sh/edenspiekermann/skills/audit-design-system), [skills.sh apply-design-system](https://skills.sh/edenspiekermann/skills/apply-design-system)
- Spec and handoff skills, each with a fill-in template and two worked examples as the "quality bar". — [7AkUmYwTMOg 7:35](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=455s)

### Inferences
- The setup has two layers: words (rules, briefs, descriptions) and pictures (screenshots). The host says words alone don't make good UI ("a guardrail does not translate to an actual UI").

### Gaps
- No video measures how big a skill can grow before it hurts results. Only lwOIVNRHndM hints at splitting a skill per group "to keep skills lightweight".

---

## Q2. How do they avoid generic "AI slop"?

### Takeaway
Anti-slop measures, most-repeated first: feed **similar, real reference screenshots** inside a skill and tell Claude to **translate, not copy**; write down brand and design-system rules so Claude doesn't invent; work **one section or card at a time**; avoid a high-fidelity Claude Design draft as the base because it has a recognisable look; and **you** make the strategic calls.

### Cited Findings
- Slop described: "aggressive use of gradients", basic metric cards. — [nbk0PMS0tos 1:25](https://www.youtube.com/watch?v=nbk0PMS0tos&t=85s). 2×2 grids. — [jO-wH4zgJV0 59:10](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=3550s). Claude Design's own look. — [jO-wH4zgJV0 46:26](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=2786s)
- Root cause given: decisions left "open for interpretation by AI". — [jO-wH4zgJV0 3:16](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=196s). Vague prompts. — [lwOIVNRHndM 7:48](https://www.youtube.com/watch?v=lwOIVNRHndM&t=468s). No rules, so "inventing UX treatments". — [VezxOhvoXqU 2:29](https://www.youtube.com/watch?v=VezxOhvoXqU&t=149s)
- "Translate, do not copy"; apply the treatment that makes sense, not a one-to-one match. — [jO-wH4zgJV0 32:54](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=1974s). "Mimic, not copy." — [nbk0PMS0tos 3:51](https://www.youtube.com/watch?v=nbk0PMS0tos&t=231s)
- Keep references stylistically similar to each other. — [mwq70TpWQkA 5:07](https://www.youtube.com/watch?v=mwq70TpWQkA&t=307s); [lwOIVNRHndM 9:16](https://www.youtube.com/watch?v=lwOIVNRHndM&t=556s)
- Tell Claude it may drift from the wireframe when the draft hugs it. — [jO-wH4zgJV0 53:05](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=3185s)

### Inferences
- The host never names fonts, palettes or layout bans as rules of their own. His anti-slop method is about process (context plus references plus small steps), not a list of banned patterns. The only concrete visual tells he names are gradients, 2×2 grids, emojis in metric cards ([JMQ0X_si144 10:19](https://www.youtube.com/watch?v=JMQ0X_si144&t=619s)) and the "Claude Design look".

### Gaps
- No blind comparison, and no outside judge of "less AI-generated". The verdicts are the host's own, on camera.

---

## Q3. How do they review and iterate?

### Takeaway
Preview locally (HTML) → judge by eye → re-prompt one section with a new reference → push to Figma only when happy → inspect layers by hand (variables, styles, instances) → run a **drift audit skill** and an **accessibility review** → in the web workflow, a **QA skill** that takes a screenshot and checks against the guardrails after every section. Variants come from Claude Design's three wireframes and Mobbin moodboards, not from asking for N versions.

### Cited Findings
- QA skill design: screenshot first, stops and asks if it can't take one, reports, never edits unprompted, verdict table plus saved .md. — [jO-wH4zgJV0 1:03:04](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=3784s)
- `audit-design-system` drift audit described as the most valuable Figma skill. — [mwq70TpWQkA 21:33](https://www.youtube.com/watch?v=mwq70TpWQkA&t=1293s); [7AkUmYwTMOg 29:19](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=1759s)
- Accessibility review useful but gives false positives. — [7AkUmYwTMOg 34:29](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=2069s)
- Routines: identify what changed, draft, human approves, then write. — [7AkUmYwTMOg 11:51](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=711s)
- Three wireframe options from Claude Design; keep them all. — [jO-wH4zgJV0 45:14](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=2714s), [50:09](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=3009s)
- Preview locally first. — [VezxOhvoXqU 24:14](https://www.youtube.com/watch?v=VezxOhvoXqU&t=1454s); [lwOIVNRHndM 13:17](https://www.youtube.com/watch?v=lwOIVNRHndM&t=797s); [mwq70TpWQkA 3:14](https://www.youtube.com/watch?v=mwq70TpWQkA&t=194s)
- Manual layer inspection after the push. — [lwOIVNRHndM 14:20](https://www.youtube.com/watch?v=lwOIVNRHndM&t=860s); [VezxOhvoXqU 24:14](https://www.youtube.com/watch?v=VezxOhvoXqU&t=1454s)
- No AI design critique: ask people. — [7AkUmYwTMOg 25:59](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=1559s)

### Inferences
- The review rule underneath: AI may **check against a written standard** (guardrails, design system, WCAG), but **taste and UX judgement stay with humans**.

### Gaps
- No video shows screenshot-diffing against an approved picture, or review by several agents.

---

## Q4. Which tools and skills are named, and is there evidence they help?

### Takeaway
Named: Claude Code (desktop app and terminal), Claude Design, Claude Projects, Claude Routines, Opus 4.6–5, Figma MCP plus Figma's skills, Anthropic's design plugin (accessibility review), the Mobbin MCP/site, Vercel, and Pencil. Evidence is one before/after demo each. Figma skills are shown as inconsistent in the earlier videos and as working in the later ones that pair them with custom skills.

### Cited Findings
- Custom reference skill vs bare prompt: one run each, judged better by eye. — [nbk0PMS0tos 9:00](https://www.youtube.com/watch?v=nbk0PMS0tos&t=540s); [mwq70TpWQkA 8:05](https://www.youtube.com/watch?v=mwq70TpWQkA&t=485s)
- Design-system skills: a contact section using the right tokens, components and styles "with just one prompt". — [VezxOhvoXqU 24:14](https://www.youtube.com/watch?v=VezxOhvoXqU&t=1454s). Paywall mostly right, some text styles missed. — [lwOIVNRHndM 14:20](https://www.youtube.com/watch?v=lwOIVNRHndM&t=860s)
- Figma skills on their own: "wildly inconsistent", "six times longer". — [mwq70TpWQkA 10:55](https://www.youtube.com/watch?v=mwq70TpWQkA&t=655s). Instances not applied. — [TKScxZtESzs 1:08](https://www.youtube.com/watch?v=TKScxZtESzs&t=68s)
- Guardrails turned an off-brand reference on-brand in one prompt. — [jO-wH4zgJV0 1:01:12](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=3672s)
- Time claims (host's estimates): audit and report "a 2-day long process now completable in about 20 minutes" ([jO-wH4zgJV0 13:53](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=833s)); design audit "5-hour workflow condensed into 10 minutes" ([7AkUmYwTMOg 30:03](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=1803s)); variables in "9 or 10 minutes" ([7AkUmYwTMOg 42:11](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=2531s)).
- Model note: Opus 5 missed components that Opus 4.8 caught. — [VezxOhvoXqU 10:25](https://www.youtube.com/watch?v=VezxOhvoXqU&t=625s)
- Sponsorship: Anthropic sponsors jO-wH4zgJV0 and 7AkUmYwTMOg (video descriptions); Mobbin partners with lwOIVNRHndM and nbk0PMS0tos. The Mobbin praise and the Claude workflow praise should be read with that in mind.

### Inferences
- The strongest *shown* evidence is the Figma layer inspection (variables and instances bound or not), because it is checkable on screen. "Looks less AI" is the weakest.

### Gaps
- No token or cost figures beyond "expensive" and "burns tokens". No repeated runs.

---

## Q5. Cross-video: repeated practices, contradictions, and fit for a data-dense app vs a landing page

### Takeaway
The most repeated advice: preview locally before pushing (5 videos); don't expect one-shot results (5); read or check what Claude generated (5); connect Figma MCP (5); reference screenshots / Mobbin (4); one section at a time (3–4); token or design-system rule skills (3). For a data-dense product app the design-system half applies best (rules and debt, component groups, described tokens, card-by-card building, drift and accessibility audits, edge-case handoff docs, prototyping complex tables). For landing pages the brand half applies best (audit, moodboard, guardrails skill, Claude Design wireframes, QA, pitch).

### Cited Findings

Repeated practices (count = number of the 8 videos that state it):
| Practice | Count | Videos |
|---|---|---|
| Build or preview locally, push to Figma only when ready | 5 | 7AkUmYwTMOg, mwq70TpWQkA, VezxOhvoXqU, lwOIVNRHndM, TKScxZtESzs |
| No one-shot perfection; expect iteration | 5 | jO-wH4zgJV0 [51:38](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=3098s), JMQ0X_si144 [2:21](https://www.youtube.com/watch?v=JMQ0X_si144&t=141s), TKScxZtESzs [1:08](https://www.youtube.com/watch?v=TKScxZtESzs&t=68s), VezxOhvoXqU [17:19](https://www.youtube.com/watch?v=VezxOhvoXqU&t=1039s), mwq70TpWQkA [20:26](https://www.youtube.com/watch?v=mwq70TpWQkA&t=1226s) |
| Read or check the skill Claude wrote | 5 | jO-wH4zgJV0, mwq70TpWQkA, VezxOhvoXqU, lwOIVNRHndM, nbk0PMS0tos |
| Connect Figma MCP | 5 | 7AkUmYwTMOg, mwq70TpWQkA, lwOIVNRHndM, TKScxZtESzs, JMQ0X_si144 |
| Reference screenshots (Mobbin) fed to Claude | 4 | jO-wH4zgJV0, mwq70TpWQkA, lwOIVNRHndM, nbk0PMS0tos |
| References stored inside a skill folder | 3 | jO-wH4zgJV0, mwq70TpWQkA, nbk0PMS0tos |
| Small pieces / section or card at a time | 3 (+1) | jO-wH4zgJV0, mwq70TpWQkA, VezxOhvoXqU; JMQ0X_si144 sends single elements |
| Design-system rules / token descriptions in a skill | 3 | mwq70TpWQkA, VezxOhvoXqU, lwOIVNRHndM |
| Figma's skills installed (`figma-use`, apply/audit) | 3 | 7AkUmYwTMOg, mwq70TpWQkA, lwOIVNRHndM |
| Always paste the exact Figma link | 3 | 7AkUmYwTMOg, mwq70TpWQkA, lwOIVNRHndM |
| AI-written component docs pushed to Figma | 3 | 7AkUmYwTMOg, mwq70TpWQkA, TKScxZtESzs |
| Drift audit with `audit-design-system` | 2 | 7AkUmYwTMOg, mwq70TpWQkA |
| Anthropic design plugin for accessibility only | 2 | 7AkUmYwTMOg, mwq70TpWQkA |
| Group components (form / nav / data display) | 2 | VezxOhvoXqU, lwOIVNRHndM |
| Name the client or product in the skill | 2 | jO-wH4zgJV0, VezxOhvoXqU |
| Translate / mimic, don't copy references | 2 | jO-wH4zgJV0, nbk0PMS0tos |
| Human owns strategy; AI isn't a design critic | 2 | jO-wH4zgJV0, 7AkUmYwTMOg |
| Opus for design work | 3 | jO-wH4zgJV0, 7AkUmYwTMOg, mwq70TpWQkA |

Contradictions and tensions:
- **AI as reviewer.** 7AkUmYwTMOg says don't ask AI for UI/UX feedback ([25:59](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=1559s)), yet jO-wH4zgJV0 builds a QA skill that judges each section ([1:03:04](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=3784s)). They fit together if QA checks against written guardrails and critique means open-ended taste, but he never states that line.
- **Usage rules: give them or not?** mwq70TpWQkA ([24:20](https://www.youtube.com/watch?v=mwq70TpWQkA&t=1460s)) and lwOIVNRHndM ([2:43](https://www.youtube.com/watch?v=lwOIVNRHndM&t=163s)) say write "when to use / when not". VezxOhvoXqU says yes for tokens and components but "do not create usage guidelines" for type, radius and spacing, because strict rules confuse AI ([14:45](https://www.youtube.com/watch?v=VezxOhvoXqU&t=885s)).
- **Figma round-trips.** JMQ0X_si144 promotes editing in Figma and sending it back ([10:19](https://www.youtube.com/watch?v=JMQ0X_si144&t=619s)); mwq70TpWQkA says round-tripping gets messy and burns tokens ([3:14](https://www.youtube.com/watch?v=mwq70TpWQkA&t=194s)).
- **Wireframes.** Never for product dashboards (go straight to high fidelity) but used for websites ([jO-wH4zgJV0 42:00](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=2520s)). Then the wireframe itself over-constrains the draft ([53:05](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=3185s)).
- **Letting Claude generate design-system foundations.** It generates type variables happily ([7AkUmYwTMOg 38:52](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=2332s)) but should not invent a semantic colour library ([43:13](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=2593s)). In jO-wH4zgJV0 the guardrails skill also produced a token file, which he would not "integrate this early" ([29:44](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=1784s)).
- **How well Figma skills work.** "Components are not applied" (Mar, [TKScxZtESzs 1:08](https://www.youtube.com/watch?v=TKScxZtESzs&t=68s)) versus correct components (Apr–Aug, [mwq70TpWQkA 19:24](https://www.youtube.com/watch?v=mwq70TpWQkA&t=1164s), [VezxOhvoXqU 24:14](https://www.youtube.com/watch?v=VezxOhvoXqU&t=1454s)). Most likely the tools changed over time, not a true contradiction.

Fit for a **data-dense product app** (as the videos frame product work):
- Rules-and-debt skill; component skills per group, including a **data display** group (tables, checkbox cells). — [VezxOhvoXqU 8:33](https://www.youtube.com/watch?v=VezxOhvoXqU&t=513s)
- Token table with "when to use" descriptions; a light/dark pair per token. — [lwOIVNRHndM 0:55](https://www.youtube.com/watch?v=lwOIVNRHndM&t=55s)
- "Layout variables" pairing desktop and mobile spacing; he mentions dashboard cards at 1920 wide. — [VezxOhvoXqU 17:19](https://www.youtube.com/watch?v=VezxOhvoXqU&t=1039s), [20:17](https://www.youtube.com/watch?v=VezxOhvoXqU&t=1217s)
- Card by card, not whole page. — [VezxOhvoXqU 22:35](https://www.youtube.com/watch?v=VezxOhvoXqU&t=1355s)
- Prototype complex data UX (a 50k-row table with filters and column management) as working code to explore behaviour. — [TKScxZtESzs 9:06](https://www.youtube.com/watch?v=TKScxZtESzs&t=546s)
- Handoff docs with edge cases (long text, overflow, empty states). — [7AkUmYwTMOg 19:52](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=1192s)
- Drift and accessibility audits. — [mwq70TpWQkA 21:33](https://www.youtube.com/watch?v=mwq70TpWQkA&t=1293s), [7AkUmYwTMOg 32:01](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=1921s)
- Skip wireframes for dashboards. — [jO-wH4zgJV0 42:00](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=2520s)
- In the deep-dive on direction, "data and numbers" is its own theme next to type and colour. — [jO-wH4zgJV0 22:36](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=1356s)

Fit for **marketing landing pages**:
- Visual site audit skill and client report; Mobbin moodboard and competitive report; brief (audience, message, conversion goal); client-named guardrails skill with reference screenshots; Claude Design wireframes → Claude Code section by section; QA skill per section; Vercel; pitch deck from a Claude Project. — jO-wH4zgJV0 throughout
- The "design inspiration" skill with references foldered by section (hero, footer). — [nbk0PMS0tos 10:10](https://www.youtube.com/watch?v=nbk0PMS0tos&t=610s)

### Inferences
- **(My opinion, not the videos'.)** For a fantasy esports app such as Flol, the closest matches are VezxOhvoXqU and lwOIVNRHndM (design-system skills, data-display components, described tokens, card by card), TKScxZtESzs's behaviour-first prototyping of dense tables, and jO-wH4zgJV0's QA-skill shape (screenshot first, stop if no screenshot, report-don't-edit, verdict table). The repo already has `docs/design/plate.md` and approved pictures, which play the part of his guardrails skill and reference folder. Mobbin's library is mostly Western SaaS, finance and consumer apps, so on its own it gives references off-theme for a Korean/LCK look. The videos say nothing about themed or non-Western references.
- **(My opinion.)** His "translate, do not copy" rule and his line "a guardrail does not translate to an actual UI" are the two lines most worth carrying into a design skill.

### Gaps
- No video covers dense data screens' typical failure modes in detail (number alignment, tabular figures, density, mobile tables). The closest is the 50k-row table demo, which is about behaviour, not look.
- No video covers games, sport or esports UI, or any non-Western visual theme.
- No second creator in this set, so nothing here checks the claims independently.
