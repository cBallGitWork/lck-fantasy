# Reddit saved threads: making Claude's UI not look AI-made, and Claude Design

**Contents:** [Thread 1: "Any tips on making a UI/UX frontend not look like it was obviously coded by Claude?" (r/ClaudeCode)](#thread-1-any-tips-on-making-a-uiux-frontend-not-look-like-it-was-obviously-coded-by-claude-rclaudecode) · [Thread 2: "No, YOU check the ui." (r/ClaudeCode)](#thread-2-no-you-check-the-ui-rclaudecode) · [Thread 3: "Claude Artifacts is nothing comapred to Design!!" (r/ClaudeDesign)](#thread-3-claude-artifacts-is-nothing-comapred-to-design-rclaudedesign) · [Across the threads: recurring practices, disagreements, named tools, product app vs marketing page](#across-the-threads-recurring-practices-disagreements-named-tools-product-app-vs-marketing-page)


Source: three Reddit pages Craig saved as HTML on 18 Nov 2026 (in ~/Downloads). Each saved page holds only the first 25 comments in Reddit's "Best" (confidence) order; the rest sit behind "load more" links that were never fetched. Scores are as of the save. URLs below are the comments' Reddit permalinks, taken from the saved HTML (not visited).

Thread URLs:
- T1: https://www.reddit.com/r/ClaudeCode/comments/1x3go5l/any_tips_on_making_a_uiux_frontend_not_look_like/
- T2: https://www.reddit.com/r/ClaudeCode/comments/1xwmtbx/no_you_check_the_ui/
- T3: https://www.reddit.com/r/ClaudeDesign/comments/1xr8mfv/claude_artifacts_is_nothing_comapred_to_design/

## Thread 1: "Any tips on making a UI/UX frontend not look like it was obviously coded by Claude?" (r/ClaudeCode)

### Takeaway
The richest thread. The top joke (783) is "think harder yourself"; the top practical tips are to make the design decisions yourself (fonts, exact colours), ban the known tells by name, give real references and real copy, keep a taste log and never-list, and run a review pass against a design reference. Many low-score replies just say "hire or be a designer".

### Cited Findings
Post: u/Individual-Worker711, 11 Oct 2026, score 217 (88% upvoted), 221 comments. Asks how to stop UI looking obviously Claude-made; says AI interfaces have "a distinct look". — [T1 post](https://www.reddit.com/r/ClaudeCode/comments/1x3go5l/any_tips_on_making_a_uiux_frontend_not_look_like/)

Tips ranked by score (top-level unless marked reply):
- **783, u/Standard_Egg3504**: "increase your reasoning effort above low (not claude, YOURS)". A jab, not a technique; replies 88 ("THIS is the real answer"), 55 (a GIF), 21, 12. — [comment](https://www.reddit.com/r/ClaudeCode/comments/1x3go5l/comment/pfawl8y/)
- **113, u/tariqosmani** (the main practical answer):
  - "The sameness comes from Claude filling in every design decision with the safest default."
  - Pick the font pair and colours yourself as exact values: "one serif for headings, one clean sans for text, and three hex colors."
  - "Make it modern" always gives the same result.
  - Ban tells by name: "Purple to blue gradients, big rounded cards with soft shadows, emoji as icons," centred hero with three feature boxes.
  - "Telling it what not to do works better than telling it what you want."
  - Give a screenshot reference and real text, not lorem ipsum: "Real copy changes the layout a lot."
  - Names the frontend-design skill for Claude Code.
  - Asks whether it is a landing page or an app screen: "The advice changes a bit between the two." Reply (7, u/kieden) asks about apps; no answer in the saved page. — [comment](https://www.reddit.com/r/ClaudeCode/comments/1x3go5l/comment/pfay70l/)
- **30, u/Jetahiri**: Claude "has zero context on what you like, so it falls back to the average". Build a process, not a prompt:
  1. a design library of liked sites, each broken down (what to take, what to leave, "Never copy it straight");
  2. a taste log of reactions ("too busy", "feels cheap") in a file Claude reads before design work;
  3. a never-list of tells it checks against;
  4. self-critique against the brief before you look. — [comment](https://www.reddit.com/r/ClaudeCode/comments/1x3go5l/comment/pfc06sy/)
- **18, u/low-bars-432**: "There's no shortcut unfortunately. You can't just one-shot it." Uses Mobbin MCP, a component library (Untitled UI) and an indexed copy of the Refactoring UI ebook. Per screen: check Mobbin for how other apps do the feature, build from library blocks, "a review agent checks everything against Refactoring UI." Reply (5, u/StunningBend6129, a designer) mocks the "designers are obsolete" line. — [comment](https://www.reddit.com/r/ClaudeCode/comments/1x3go5l/comment/pfb39f5/)
- **15, u/hello5346**: "Hire a designer." — [comment](https://www.reddit.com/r/ClaudeCode/comments/1x3go5l/comment/pfb0g7x/)
- **13, u/BarcodeCutter**: have Claude Code make an HTML page, review it in Claude Design and add your own notes; Figma connector. Own reply (4): pass the saved HTML back to Code; "Increased Effort = Reduced Slop". — [comment](https://www.reddit.com/r/ClaudeCode/comments/1x3go5l/comment/pfaw26e/)
- **10, u/whitenoize086**: "Give it an an example you like to plagiarize the look and feel from." — [comment](https://www.reddit.com/r/ClaudeCode/comments/1x3go5l/comment/pfd1ytj/)
- **10, u/marvin02**: "Design it yourself". — [comment](https://www.reddit.com/r/ClaudeCode/comments/1x3go5l/comment/pfb0gec/)
- **6, u/CD_Rashmika**: lists skills: "Impeccable Taste-skill Front-end design by anthropic UI UX Pro Max Emil-deisgn principles", plus Playwright MCP. Also suggests an image-generation model. — [comment](https://www.reddit.com/r/ClaudeCode/comments/1x3go5l/comment/pfayu4l/)
- **5, u/CranberryStock7148**: Claude knows every trend and uses a safe default; ask it for "20 different alternatives with example sites", then pick. — [comment](https://www.reddit.com/r/ClaudeCode/comments/1x3go5l/comment/pfbn9fv/)
- **5, u/R-FM**: for a game, Claude built UI pieces in Blender and rendered them to 2D. — [comment](https://www.reddit.com/r/ClaudeCode/comments/1x3go5l/comment/pfbig3s/)
- **4, u/nawey**: "do actual design work". — [comment](https://www.reddit.com/r/ClaudeCode/comments/1x3go5l/comment/pfb1ulw/)
- **3, u/No-Project-9099** (founder of a tool called Iterel; disclosed):
  - Start from one real screen with real copy and a visual reference.
  - Name the decisions to carry over: "type scale, spacing, content density".
  - Screenshot at 1440px and 390px, "point to one element, say what feels wrong and what must stay unchanged."
  - Iterate one screen, not a whole-app redesign. — [comment](https://www.reddit.com/r/ClaudeCode/comments/1x3go5l/comment/pfawn0z/)
- **3, u/Known_Chart_1329**: "give it a reference. claude is great at copying". — [comment](https://www.reddit.com/r/ClaudeCode/comments/1x3go5l/comment/pfayajr/)
- **2, u/heartbroken_nerd**: polish each element on its own; "Stop trying to one-shot an entire design"; live-test with people, criticise every step. — [comment](https://www.reddit.com/r/ClaudeCode/comments/1x3go5l/comment/pfc5e9j/)
- **2, u/Sufficient_Heron**: Superpowers (github.com/obra/superpowers) brainstorming skill: see several options before building. Also ui-patterns.com, to learn the pattern words to prompt with. — [comment](https://www.reddit.com/r/ClaudeCode/comments/1x3go5l/comment/pfc5qnc/)
- 2, u/Flipwon: "Be artistic?" (no tip).

### Inferences
- The 113 and 30 answers say the same thing: generic output comes from Claude choosing defaults. Fix it by deciding first (tokens, references, a ban list) and keeping that in files Claude reads.
- The project already does much of this: a plate (`docs/design/plate.md`), approved pictures, a review panel. The gaps against this thread are an explicit never-list of AI tells and a taste log of Craig's reactions.

### Gaps
- Only 25 of 221 comments are in the saved page (11 "more comments" loaders and 11 "more replies" links not loaded). Higher-scoring comments may sit in the unloaded part, though "Best" order usually puts the top ones first.
- u/kieden's question about app screens (not landing pages) has no answer in the saved page.

## Thread 2: "No, YOU check the ui." (r/ClaudeCode)

### Takeaway
A hardware maker pointed a webcam at a device screen so Claude could check its own UI. The useful lesson is to close the loop: give Claude a way to see its result (Playwright MCP or screenshots for web) and make the check name what should have changed.

### Cited Findings
Post: u/Siriann, 15 Nov 2026, score 336 (88% upvoted), 67 comments. Photo of a webcam aimed at a device. Got tired of Claude asking whether the UI had updated, so "hooked up a WebCam to it and told it to check itself." It is a hardware board, not a web UI. — [T2 post](https://www.reddit.com/r/ClaudeCode/comments/1xwmtbx/no_you_check_the_ui/)

Tips ranked by score:
- **118, u/hoffmander**: "playwright mcp - thank me later". OP (39): "Not a web UI". — [comment](https://www.reddit.com/r/ClaudeCode/comments/1xwmtbx/comment/19snovh9mp2rm/)
- **57, u/Fusseldieb**: "close-loop" it: "if you are able to give it means of checking it's own result, it will excel every single time." Replies:
  - u/soulsizzle (4): a "Create Verification Skill" in Cursor's pstack plugin. Give the agent the URL and have it adapt the skill for Claude.
  - OP (1): a build doc as "Truth". An Opus orchestrator feeds builders small goals; a hook has another model check each goal; three failures alert his phone. — [comment](https://www.reddit.com/r/ClaudeCode/comments/1xwmtbx/comment/19snosj9vazb7/); [soulsizzle](https://www.reddit.com/r/ClaudeCode/comments/1xwmtbx/comment/19soudnfqap8i/); [OP](https://www.reddit.com/r/ClaudeCode/comments/1xwmtbx/comment/19spte6619pvk/)
- **15, u/superdumbell**: "You need to step up your game". Reply (3): pointed a mic, speaker and webcam at an alarm panel so Claude could test the hardware. — [comment](https://www.reddit.com/r/ClaudeCode/comments/1xwmtbx/comment/19snqkrksa1xe/)
- **14, u/TPlays**: "My Claude screenshots its own work and judges based on the screenshot." OP (8): does too where possible, but this board is locked down. — [comment](https://www.reddit.com/r/ClaudeCode/comments/1xwmtbx/comment/19souqnc1l35u/)
- **6, u/spacethrower**: jokes OP doesn't know screenshots (banter). Also 2, u/Warsel77 "doesn't need a webcam"; 1, u/OldLead4716 asks about pulling a screenshot from the device.
- **2, u/PunkersSlave**: also used a webcam (C920) to check a CPU-cooler display on Linux. — [comment](https://www.reddit.com/r/ClaudeCode/comments/1xwmtbx/comment/19sns41o20sw0/)
- **1, u/Right-Performance-93** (the sharpest point, low score): "a webcam only shows that the pixels moved." Make it name the one thing that should have changed, and fail if it looks the same, "because a redraw of the old ui is a pass." — [comment](https://www.reddit.com/r/ClaudeCode/comments/1xwmtbx/comment/19sokpshd4htt/)
- **1, u/Neavante**: record it and ask Claude what it thinks. — [comment](https://www.reddit.com/r/ClaudeCode/comments/1xwmtbx/comment/19sov9slso5z6/)

### Inferences
- For a web app, the thread's answer is Playwright (or a browser tool) plus a screenshot check. Right-Performance-93's rule, that the check must name what should differ, would strengthen any screen-shooting verifier (cf. the project's planned `ui-verifier`).

### Gaps
- Only 25 of 67 comments saved (10 "more comments" loaders, 16 "more replies" links unloaded).

## Thread 3: "Claude Artifacts is nothing comapred to Design!!" (r/ClaudeDesign)

### Takeaway
A complaint thread, not a tips thread. Users say Claude Design is being folded into the new Artifacts (some call it canvas). Views split: non-designers miss Design's simpler point-and-edit flow and file structure; others find Artifacts, or Claude Code at high effort, as good or better.

### Cited Findings
Post: u/YomnaAly96, 8 Nov 2026, score 93 (90% upvoted), 35 comments. Calls the new Artifacts "Too slow, too dumb, very unorganized"; asks how to send feedback. — [T3 post](https://www.reddit.com/r/ClaudeDesign/comments/1xr8mfv/claude_artifacts_is_nothing_comapred_to_design/)

Comments ranked by score (tips marked):
- **51, u/-SiillyGoose-**: mocks "10 years back in time" with Sketch/Zeplin nostalgia (replies 9, 6, 5, 5, all nostalgia). No tip. — [comment](https://www.reddit.com/r/ClaudeDesign/comments/1xr8mfv/comment/19scgrtt936sg/)
- **16, u/Money-Advertising558** (tip): used Design heavily, then Claude kept making artifacts instead and they stopped missing Design. Claims "a 200 edit daily cap", hidden from the user, so "batch changes". Reply (2) doubts the cap holds on every plan. Unverified claim. Own reply (4): to edit, use the comment button and click the spot to change. — [comment](https://www.reddit.com/r/ClaudeDesign/comments/1xr8mfv/comment/19scdzxpo1m3m/); [reply](https://www.reddit.com/r/ClaudeDesign/comments/1xr8mfv/comment/19sd04h2qvfhh/)
- **7, u/WyattWarrior99**: same prompt in old and new was "worlds apart in output". Side chat closed by default, many permission pop-ups, slower. Mentions a 14 Dec date (implies Design ends then; unconfirmed). — [comment](https://www.reddit.com/r/ClaudeDesign/comments/1xr8mfv/comment/19scekb15x5b4/)
- **5, u/indyweb** (tip): in the Claude Code desktop app, asked for an art board from their design system on Opus 5.5 at second-highest effort. Got "results better than I did with design". Also, in Code it can push to GitHub. — [comment](https://www.reddit.com/r/ClaudeDesign/comments/1xr8mfv/comment/19scdmlgjl5ic/)
- **3, u/mutavivitae**: Design made big multi-file designs easy to structure; Artifacts feel "messy and disorganized". — [comment](https://www.reddit.com/r/ClaudeDesign/comments/1xr8mfv/comment/19scpe5pcdmao/)
- **2, u/Aromatic_System2998** (tip): the new canvas lets you "pin point the area or location to change". It sits in one environment with Claude Code. — [comment](https://www.reddit.com/r/ClaudeDesign/comments/1xr8mfv/comment/19sj4iosrfnz8/)
- **2, u/Data_Flirt**: about 80% of work unaffected; complex design and animation work suffers. — [comment](https://www.reddit.com/r/ClaudeDesign/comments/1xr8mfv/comment/19sgl4a9vsco4/)
- **2, u/Neoo-09** (Spanish): to test a button you must export a zip and open the HTML. 1, same user: print buttons no longer work in Artifacts.
- **1 each**:
  - u/YomnaAly96 (OP, 17 Nov): concludes Artifacts is "BETTER for designers", but non-designers want Design back. [comment](https://www.reddit.com/r/ClaudeDesign/comments/1xr8mfv/comment/19srkrzwsnwv7/)
  - u/oneisallxt3: Design looked at the rendered design for inconsistencies; Artifacts "only look at the code by default". [comment](https://www.reddit.com/r/ClaudeDesign/comments/1xr8mfv/comment/19sgwq6ygps0w/)
  - u/Responsible-Slide-26 and u/BellCurve1: Artifacts more flexible, "feels like magic".
  - u/Joriqn: slower and worse, but likes linking chats and artifacts.
  - u/longboii69, u/Motor_Education_9927, u/daskalou: confusion or jokes.

### Inferences
- The one design-quality tip here matches thread 1: higher effort plus your own design system beats the default. oneisallxt3's point matches thread 2: check the rendered result, not just the code.

### Gaps
- Only 25 of 35 comments saved (5 loaders, 8 "more replies" links). The 200-edit cap and 14 Dec date are single-user claims with no confirmation in these files.

## Across the threads: recurring practices, disagreements, named tools, product app vs marketing page

### Takeaway
Two practices recur with real support: decide the design yourself before Claude does (references, exact tokens, a ban list, files Claude rereads), and make Claude see and judge the rendered result. The split is between "process and references fix it" and "only a human designer can". Almost all tips assume marketing pages; the few that fit a data-dense app are about density, type scale, real data, component libraries and per-screen iteration.

### Cited Findings
Recurring practices:
- **Give a concrete reference** (screenshot or site): T1 tariqosmani 113, Jetahiri 30, whitenoize086 10, Known_Chart_1329 3, No-Project-9099 3; T2 OP. — [T1 113](https://www.reddit.com/r/ClaudeCode/comments/1x3go5l/comment/pfay70l/), [T1 30](https://www.reddit.com/r/ClaudeCode/comments/1x3go5l/comment/pfc06sy/)
- **Ban the known tells by name**: purple-blue gradients, rounded soft-shadow cards, emoji icons, centred hero with three feature boxes. T1 tariqosmani 113, Jetahiri 30 (never-list). — [T1 113](https://www.reddit.com/r/ClaudeCode/comments/1x3go5l/comment/pfay70l/)
- **Fix tokens yourself** (font pair, exact hex, type scale, spacing): T1 113, No-Project-9099 3; T3 indyweb 5 (own design system). — [T1 3](https://www.reddit.com/r/ClaudeCode/comments/1x3go5l/comment/pfawn0z/)
- **Real copy, not lorem ipsum**: T1 113, 3.
- **No one-shotting; one screen or element at a time**: T1 low-bars-432 18, No-Project-9099 3, heartbroken_nerd 2.
- **Close the loop: screenshot and self-review**:
  - T2: Playwright 118, close-loop 57, screenshots 14, name-the-change 1.
  - T1: self-critique against brief (30), review agent against Refactoring UI (18), Playwright (6).
  - T3: Design checked the rendered design (1). — [T2 57](https://www.reddit.com/r/ClaudeCode/comments/1xwmtbx/comment/19snosj9vazb7/)
- **More effort**: T1 joke 783, BarcodeCutter 4; T3 indyweb 5 (Claude's effort setting).
- **See options before choosing**: T1 CranberryStock7148 5 (20 alternatives), Sufficient_Heron 2 (brainstorming skill).

Disagreements:
- **Human designer needed vs process suffices**: T1 hello5346 15, marvin02 10, nawey 4 against low-bars-432 18 ("designers are now obsolete") and the designer reply (5).
- **Ban-list vs simply ask**: T1 tariqosmani 113 says negatives beat positives; CranberryStock7148 5 says just ask for something different.
- **Design vs Artifacts vs Code**: T3 split. OP and WyattWarrior99 say worse. Responsible-Slide-26, BellCurve1 and indyweb say better.
- **Webcam vs screenshot**: T2 banter. Screenshots or Playwright for web; a webcam only for locked hardware.

Named tools, skills and files:
- **Skills**:
  - Anthropic's frontend-design skill (T1 113, 6)
  - Impeccable, Taste-skill, UI UX Pro Max, Emil design principles (T1 6, names only, no links)
  - Superpowers brainstorming skill, github.com/obra/superpowers (T1 2)
  - Cursor pstack "create-verification-skill", github.com/cursor/plugins/blob/main/pstack/skills/create-verification-skill/SKILL.md (T2 4)
- **MCPs and connectors**: Playwright MCP (T2 118; T1 6), Mobbin MCP (T1 18), Figma connector (T1 13).
- **References and libraries**: Untitled UI component library and the Refactoring UI ebook (T1 18); ui-patterns.com (T1 2).
- **Products**: Claude Design, Claude Artifacts / canvas (T1 13; T3), Iterel (T1 3, founder plug).
- **Files**:
  - a design library of saved references with breakdowns, a taste log, a never-list (T1 30)
  - a build doc as "Truth" (T2 OP)

Product app vs marketing page:
- Marketing-only: the banned tells (hero with three feature boxes, gradients); serif-heading font pairs (T1 113).
- Data-dense app:
  - "type scale, spacing, content density" and checking at 1440 and 390 wide (T1 3)
  - Mobbin for how real apps implement a feature, plus a component library (T1 18)
  - real copy and data (T1 113)
  - one screen at a time (T1 3, 2)
  - screenshot self-checks with a named expected change (T2 1)
- The only commenter to ask about apps (T1 kieden, 7) got no answer in the saved page.

### Inferences
- For a data-dense fantasy app like Flol, the transferable set is:
  - fixed tokens in a plate file
  - a never-list of AI tells, adapted to app screens (e.g. soft-shadow rounded cards, emoji icons, gradient fills)
  - real LCK data in mocks
  - per-screen iteration at 1440 and phone width
  - a screenshot verifier that must name what changed
  - a review against a written design reference
- Upvotes here reward jokes (783, 51) over method, so score is a weak guide to tip quality. The best method tips sit at 113, 30 and 18.

### Gaps
- Comments saved: T1 25 of 221 (about 196 missing), T2 25 of 67 (42 missing), T3 25 of 35 (10 missing). The pages hold 26 unloaded "more comments" loaders and 35 "more replies" links in all.
- One T1 reply (55, u/changrbanger) is only a GIF, with no text.
- No tool claim (skills, Mobbin MCP, the edit cap) was checked against its source; the brief allowed only these files.
