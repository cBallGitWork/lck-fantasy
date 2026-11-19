# Decide the look first, then police it

Claude's UI turns generic wherever nobody has made a decision. Without direction the model drifts to the safe middle of its training data, and Anthropic calls this **distributional convergence** ([Claude blog](https://claude.com/blog/improving-frontend-design-through-skills)). The fix that rests on the best evidence is not a smarter prompt or a skill pack. It is three things together. First, **a concrete written look** that names exact values. Second, **a named list of the specific tells to avoid**. Third, **a check of the rendered screen by someone other than the builder**, with a script for the rules that allow no exceptions. Flol already has more of this than any public template: a plate, approved pictures and a four-agent review panel. What it lacks is enforcement, and the walk of today's build shows why that matters. The built screens still carry the plate's own banned patterns (a row of stat tiles, dashed placeholders everywhere) and numbers that disagree from screen to screen. For a data-dense game, distinctiveness comes from the subject's own objects: the Rift, the hangul banner, the broadcast lower third, the LED truck. The one-core, brand-per-region split (shared grammar, swapped values) is well proven outside esports and fits Flol's token file almost as it stands. The evidence behind most popular advice is thin. All 27 videos come from one creator, partly sponsored by Anthropic and Mobbin. The saved Reddit threads hold only their first 25 comments. Every skill-pack test is one to three runs, mostly on landing pages, often graded against the pack's own bans. Nothing anywhere measures uplift on dense product screens.

**Contents:** [Why Claude goes generic](#claude-goes-generic-where-a-decision-was-left-open) · [Practices ranked by evidence](#practices-ranked-by-evidence-four-strong-most-weak) · [Flol's own practice](#flols-plate-covers-more-than-the-public-templates-read-its-gap-is-the-built-screen) · [One core, a brand per region](#one-core-a-brand-per-region-shared-grammar-swapped-values) · [The Forge template](#what-moves-into-forge-and-what-stays-in-each-repo) · [Conclusion](#conclusion)

## Claude goes generic where a decision was left open

Anthropic's own account is the most useful starting point, because it explains the mechanism and how the advice has changed. In 2025 the advice was adjectives: "be bold", avoid Inter and purple gradients, add grain and staggered reveals. By September 2026 its frontend-design skill had become a design studio's brief. Ground the design in the subject's own world. Plan **4 to 6 named colours**, typefaces and a wireframe. Ask of every choice whether you would make it for any similar page. Then build, and critique from screenshots ([current SKILL.md](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md)). The skill also lists **five clusters that AI design falls into**. Among them: cream, serif and terracotta; near-black with one acid accent; a broadsheet of hairline rules, zero radius and dense columns; the SaaS card kit; and template chrome (tracked all-caps eyebrows, middle-dot strings, monospace data labels, arrows on buttons). Several 2025 remedies are on the 2026 list of tells. Today's cure becomes tomorrow's default.

The model guides agree. The Opus 5.5 guide says a general "avoid a generic AI look" mostly **swaps one default for another**. What works is naming patterns: no cream ground, no italic accent words, no 01/02/03 labels, no monospace labels, no pill buttons. Then look at what the first result used instead, and extend the list ([Prompting Opus 5.5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5)). The Opus 4.8 and Sonnet 5 guides add two more routes. One is a full worked alternative spec (hexes, radius, typeface, section order). The other is to ask for **four distinct directions**, let a person pick one, and build only that. Sonnet 5 rejects the temperature setting, so the docs call this the way to get variety ([Opus 4.8](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-4-8); [Sonnet 5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5)). Fable 5.2's guide has no design section. It does note that Fable treats "never" as absolute, and at its top effort levels it sends subagents to review its own work ([Prompting Fable 5.2](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-2)). Both suit a Never list.

Community lists add one warning: **ban lists alone push Claude to the next default**. Ban purple and Inter, and Claude Design falls back on its own look: a teal accent, a blinking status dot, nested containers, a left accent bar on every card ([awesome-claude-design](https://github.com/rohitg00/awesome-claude-design)). The highest-scoring practical answer in the saved Reddit thread says the same in plain words. Sameness comes from Claude "filling in every design decision with the safest default". So pick the fonts and exact hexes yourself, and ban the tells by name ([Reddit, 113 points](https://www.reddit.com/r/ClaudeCode/comments/1x3go5l/comment/pfay70l/)). Every one of these lists, Anthropic's included, is built on marketing pages. None names the tells of a data app.

## Practices ranked by evidence: four strong, most weak

"Strong" below means a first-party source that explains the mechanism, plus some independent support or a measurement. "Weak" means one creator, one run, or a vendor's own claim.

| Practice | Evidence | Strength | Flol today |
|---|---|---|---|
| A concrete look with exact values, plus named tells to avoid | Anthropic skill and three model guides; Reddit's top method answers | **Strong** (first-party, no controlled test) | Plate and its Never list |
| A separate reviewer judges the rendered screen, not the builder | Anthropic's harness research: self-grading "reliably" skews positive; a separate evaluator with screenshots did better over 5 to 15 rounds by the author's own eye, with no controlled comparison, and the evaluator stayed generous ([Anthropic Engineering](https://www.anthropic.com/engineering/harness-design-long-running-apps)) | **Moderate** | Four-agent panel on mock-ups; nothing on built screens |
| Scripts for hard rules; prose for judgement | Claude Code docs: "if something has to happen every time, make it a hook" ([best practices](https://code.claude.com/docs/en/best-practices)); @shadcn/lint reports 150+ agent runs, nearly all clean after one fix round (self-reported) ([GitHub](https://github.com/shadcn-ui/lint)) | **Strong** | `theme.test.ts` bans stray colours and sizes; no script for the Never list |
| Values only through role-named tokens | Multi-brand practice (Infinum, Clearleft, Atlassian lint) | **Strong** for consistency, silent on distinctiveness | Done |
| Several directions first, then pick | Anthropic guides; one creator's prompts; Reddit (5 points) | Moderate | Look round in `/design` step 0 |
| Real references, translated, not copied | Vendor finding ([Subframe](https://www.subframe.com/tips/best-claude-code-skills-for-ui-design)); Reddit; one creator | Moderate | FPL for structure, LCK for feel |
| Real copy and one coherent dataset | Reddit ("real copy changes the layout a lot"); site walk | Moderate | Plate rule, broken in the build |
| One widget at a time, variants on identical numbers | One creator, 7 of 13 videos | Weak to moderate | Not used |
| Third-party skill packs | n=1 to 3, landing pages, own-ban grading | **Weak** | Skipped |
| Mobbin MCP, persona reviews, model rankings | One creator, partly sponsored | **Weak** | Persona lenses already in the panel |

The skill-pack evidence is the weakest of all. The one benchmark showing a big gain (**18 of 18 checks against 5 of 18**) graded the skill against things the skill itself bans, on one run per task. Its dashboard task was where the no-skill baseline did best ([dani-z benchmark](https://github.com/dani-z/frontend-design-skill-benchmark)). A blind test of 11 skills reportedly found **about half did not beat using none**. The page returned 403, so its method is unchecked ([Medium](https://ianodad.medium.com/which-claude-code-design-skill-to-use-i-tested-11-blind-and-half-did-not-beat-using-none-4d9d5c3bf2d7)). taste-skill's own changelog scored a new version 7.7 against no skill's 7.8 ([Subframe](https://www.subframe.com/tips/best-claude-code-skills-for-ui-design)). UI UX Pro Max was "the most generic page in the test" ([Paralect](https://www.paralect.com/skills/top-design-skills)). Craig's own three-runs-each test in draft-platform reached the same verdict for his own skills. They earned their place through process (rounds, recommendations), not taste ([guide-videos.md](/Users/craigball/draft-platform/docs/research/guide-videos.md)).

The 27 UI Collective videos need the most care. They are **one presenter**, he sells an academy and design-system services, **three videos are sponsored by Anthropic** and **three are partnered with Mobbin** ([sponsored example](https://www.youtube.com/watch?v=jO-wH4zgJV0)). Every comparison is one run, judged by his own eye, and his verdicts changed over the year. Claude Design went from "like senior level design" ([May](https://www.youtube.com/watch?v=j_ZPV10bu54&t=1624s)) to "one of the worst" ([Sept](https://www.youtube.com/watch?v=r-MPiu0E4W4&t=992s)). Four of his points survive because they agree with first-party advice or show something you can check.

1. **Variants on identical sample data, "not just a colour variation".** This is Anthropic's propose-directions route, made fit for data ([video](https://www.youtube.com/watch?v=ljJuOxTsrtY&t=195s)).
2. **A "when to use" line for every token.** Without it, Claude guesses the use cases ([video](https://www.youtube.com/watch?v=lwOIVNRHndM&t=55s)).
3. **A small rule set rather than a whole design system in one skill.** Around 20 colours and 6 components ([video](https://www.youtube.com/watch?v=4vItmdk8F_M&t=943s)).
4. **"Translate, do not copy" for references** ([video](https://www.youtube.com/watch?v=jO-wH4zgJV0&t=1974s)).

His sharpest line also matches Anthropic's evaluator finding. Let AI **check against a written standard**, but don't ask it for open-ended UX taste ([video](https://www.youtube.com/watch?v=7AkUmYwTMOg&t=1559s)).

The Reddit evidence is real but partial: the first 25 of 221 comments in the main thread, 25 of 67 and 25 of 35 in the others. Two method tips stand out:

- **A taste log and a never-list** that Claude reads before design work ([30 points](https://www.reddit.com/r/ClaudeCode/comments/1x3go5l/comment/pfc06sy/)).
- **A screenshot check that must name the one thing that should have changed**, and fail if the picture looks the same, "because a redraw of the old ui is a pass" ([comment](https://www.reddit.com/r/ClaudeCode/comments/1xwmtbx/comment/19sokpshd4htt/)). It scored 1 point, but no other tip went this far.

## Flol's plate covers more than the public templates read; its gap is the built screen

Put Flol's practice beside the research and it leads on almost every axis.

- [plate.md](../../design/plate.md) is the "concrete alternative spec" Anthropic recommends: every colour by role and value, six sizes, three weights, one spacing scale, every state, and a six-line Never list.
- The [`/design` skill](../../../.claude/skills/design/SKILL.md) works through the steps Anthropic and the practitioners describe:
  1. a brief taken only from the spec;
  2. references (FPL for structure, the LCK for feel);
  3. a 1440 mock-up;
  4. a rule to open the rendered picture, and to stop after three rounds that change nothing;
  5. **four review agents with different lenses**;
  6. Craig's approval;
  7. a saved picture that binds the build.
- Its first round asks for two or three looks "that look nothing alike". That is the four-directions route.
- No public template seen covers states, words, a phone rule and accessibility in one file. Google's DESIGN.md spec has nothing on tables, number formats or screen states ([google-labs-code/design.md](https://github.com/google-labs-code/design.md)).

epl-draft-intel shows the piece Flol lacks. Its [DESIGN.md §10](/Users/craigball/epl-draft-intel/docs/rules/DESIGN.md) marks each Never rule a script can see with †. Its [designlint.mjs](/Users/craigball/epl-draft-intel/tools/ui/designlint.mjs) fails a page in about 100 lines. It catches non-zero radius, gradients off two allowed selectors, tracked uppercase, frosted blur, soft shadows, middle-dot strings, typed stars and key or legend headings. Everything else is left to the panel. That split is the hooks-for-hard-rules advice, and it is cheap. Flol's `theme.test.ts` stops stray colours and sizes but not the tells.

The 18 Nov site walk shows what that costs. Five walkers went through the built app. All five were Claude agents, so they count as one source, not five. Three of the four main walkers, and the UCL player too, flagged **three boxed stat tiles for Free transfers, Cost and Bank**, which is item 1 of the plate's own Never list. All four main walkers flagged the **dashed placeholder boxes** as generic ([site walk](./site_walk.md)). The UCL-player walker added three more tells: an outlined tag for every state, **monospace for every figure "so the page reads like a terminal"**, and the same navy, gold and 1fr + 360 layout on every page ([UCL walk](./site_walk_ucl.md)). Just as damaging were the **"sloppy" faults**. The same week scored 94 on Points and 109 on Perfect game. Home and Transfers showed different deadlines. Every player card showed Faker. A screen whose numbers contradict each other reads as machine-made whatever its type. So the missing gate sits between approved picture and built screen: the planned `ui-verifier`, plus a lint run on built pages, not only on mock-ups.

The research also exposes a tension in the plate. Anthropic's clusters include "broadsheet: hairline rules, **zero radius**, dense columns" and "**monospace for small data labels**". Opus 5.5's own example avoid list names monospace labels ([Opus 5.5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5)). Flol's square, ruled, Plex-Mono-figures look sits close to one of those clusters. The skill says a brief's own choice wins, so this is no reason to undo Craig's decisions. But it does mean **the restraint rules do not make Flol distinctive on their own**. The identity has to come from the subject. The LCK brand research reaches the same point from the other side: it suggests Pretendard's tabular figures in place of a separate mono face ([Pretendard README](https://cdn.jsdelivr.net/npm/pretendard@1.3.9/docs/en/README.md)).

A data-app Never list, drawn from the walks and the notes, would add six tells:

- a row of label-over-number tiles with no comparison;
- a card per item, each with an explainer line;
- an outlined box for every state;
- mono on dates and labels, not only on aligned figures;
- equal-weight keys on one object;
- one page skeleton repeated with no variant for full-width, stage or banner pages.

The general dashboard rule that a bare figure is "almost meaningless" without a target, trend or comparison supports the first ([setproduct](https://www.setproduct.com/blog/dashboard-ui-design)).

## One core, a brand per region: shared grammar, swapped values

The multi-brand evidence is the most consistent in the whole set, because it comes from people who run such systems.

- Riot runs three layers itself. Game, esports umbrella, then leagues, which "are part of our secret sauce" and keep their own look ([lolesports.com](https://lolesports.com/en-US/news/welcome-to-lol-esports)).
- Infinum ran four brands on shared components, behaviour and token names, varying palette, font, radius and icons ([Infinum](https://infinum.com/blog/multibrand-design-system-tokens/)).
- Clearleft: "the core of a brand's visual language comes from colour and font, not space", and token roles never change between themes ([Clearleft](https://clearleft.com/thinking/designing-with-tokens-for-a-flexible-multi-brand-design-system)).
- The W3C token standard now models brand and mode as **modifiers** over fixed sets, and a modifier may not reference another. That keeps overrides one level deep ([DTCG Resolver 2025.10](https://www.designtokens.org/tr/2025.10/resolver/)).
- The closest precedent is weaker than it looks. Riot's LTA ran two regions under one master brand, then was retired after one season ([LoL Esports](https://lolesports.com/en-us/news/lcs-2026-address)).

For Flol the rule is: **the core holds the grammar, a region swaps the values**. Core: frame, spacing, sizes, weights, every part and state, the Never list, accessibility, token role names and League's own data shapes (`3/1/7`, role order, blue left, GD@15 with sign). Region: about **26 colour values and 1 to 2 font families** (counted from `tokens.ts`), one structural motif, voice, time zone, currency and the rise/fall colours. A region that wants to change a space or size token is asking to change the core, and that is Craig's call.

The two leagues are opposite temperaments, which makes them a good test that the core is neutral.

- **LCK: calm sky minimalism, made in 2021 by DesignStudio.** Its signature is Hangul and English headlines set together at contrasting scale. Korean markets show **red up, blue down** ([Inven Global](https://www.invenglobal.com/articles/12982/the-new-era-of-lck-is-here-a-visual-journey-into-the-new-broadcast-and-lol-park); [StockHub](https://stockhub.kr/guide/reading-price-screen)).
- **LEC: "clash".** Orange or teal against black, a condensed boxing-poster face, angled grids, and a voice of "weaponised cringe" ([Engadget](https://www.engadget.com/2019-01-18-riot-lec-league-esports-design-rebrand.html); [NME](https://www.nme.com/features/gaming-features/how-weaponised-cringe-helped-riots-lec-find-its-identity-3310750)).

Today the region shows up in code, not tokens: `KST` in several time parts, `₩` in the money formatter, hangul in five words files. The plate's "Korean feel" section is really the LCK layer sitting in the core. Riot's direction since 2020 has been "less myth, more sport" ([BUCK](https://buck.co/work/riot-games-world-championships)), and the current Hextech gold reads as the game client, not the LCK. Whether the core goes neutral is an open question for Craig.

The brand layer also guards against slop, because each region forces named values where Claude would otherwise reach for a default. One community test fits Flol exactly: **generate the same page under three brand systems; if they look alike, the file isn't being applied** ([theadpharm](https://www.theadpharm.com/insights/claude-design-without-the-ai-slop-look)). The guards from practice are:

- a type check that each brand map has exactly the core's keys;
- a contrast test looped over every brand;
- a lint for raw values outside the token home ([Atlassian](https://atlassian.design/components/eslint-plugin-design-system/ensure-design-token-usage));
- every approved screen shot in both brands, so a change that only looks right in one is caught as a brand change made in the core.

Two hard limits apply in every region. **No Riot, LCK or LEC mark, and no league fonts** ([Riot legal](https://www.riotgames.com/en/legal)). And a native app needs Riot's written licence or an API key. Keeping tokens as plain data, as `tokens.ts` does, keeps a later move to iOS and Android open through a brand-by-platform build ([Style Dictionary example](https://app.unpkg.com/style-dictionary@5.0.1/files/examples/advanced/multi-brand-multi-platform/README.md)).

## What moves into Forge, and what stays in each repo

Teams converge on the same split: shared method and checks go in a plugin, and each product keeps its own look file. The documented route is a Claude Code plugin marketplace added per project ([Towards Data Science](https://towardsdatascience.com/how-to-govern-coding-agent-skills-across-repos-with-plugins/)), which is how Forge already ships `verify` and `refactor`.

| Part | In Forge (shared) | In each repo |
|---|---|---|
| Method | The `/design` loop: brief, directions, render, look, panel, approval, saved picture | Its spec and glossary |
| Look file | A plate template with fixed sections: tokens by role, parts, states, words, Never, phone, accessibility | The plate's values and Craig's calls |
| Never list | Generic and data-app tells, each marked script-checkable or panel-only | Product exceptions, each with a reason |
| Gate | A lint grown from `designlint.mjs`, run on mock-ups **and built pages**, plus a screenshot verifier that names the expected change | Allowed-selector config |
| Panel | Lens agents taking a persona file (UX, PM, veteran player, fan) | The personas (FPL player, LCK fan, LEC fan) |
| Brand layer | Core keys, a brand-map type, the both-brands screenshot loop | One value map and voice per region |
| Evidence | A with-and-without test harness, three runs each | The cases |

For a design team, the plate should be written in a shape that tools can read. Google's DESIGN.md (YAML tokens plus fixed sections) is the format Impeccable's detector and Claude Design's import read ([Impeccable document](https://impeccable.style/docs/document)). Since June 2026, Claude Design can import a design system from a repo and sync both ways with Claude Code. It shares the plan's usage, so there is no extra charge, and the standalone site closes on 14 Dec 2026 ([Help Centre](https://support.claude.com/en/articles/14604416-get-started-with-claude-design)). Anthropic warns that an import is "only as good as its source", and the one creator who tried it found invented type styles and missing variants ([video](https://www.youtube.com/watch?v=eXlSgQmz02E&t=1037s)). So `tokens.ts` stays the one source, and anything else is exported from it.

Impeccable is the strongest outside candidate: Apache 2.0, 62 deterministic rules, a CI exit code, ignore-with-reason exceptions. Craig would need to decide on its known costs before installing it: **telemetry on by default, hooks that run outside model approval, web-only checks**, a PRODUCT.md that would duplicate SPEC.md, and its own admission that it is "strongest on interfaces that already exist" ([GitHub](https://github.com/pbakaus/impeccable)). Its rules lean to marketing pages, so at most it is a second gate, trialled against no gate on Flol's own screens.

## Conclusion

The research changes the question. Flol does not need more taste fed to Claude. It needs fewer decisions left open, and checks that reach the shipped screen. The biggest anti-slop gains on offer are dull ones: one coherent dataset, a lint run on built pages, a verifier that compares the build with its approved picture, and a data-app Never list. None of these depends on the weak video or skill-pack evidence. Restraint rules keep the floor; they do not make a screen look like Flol. Square corners and ruled tables sit close to one of Anthropic's own AI clusters. Flol's identity has to come from what only an LCK fantasy game has: the Rift as the squad, hangul set as design, the broadcast lower third, the LED truck, red rises. In the LEC it will come from the poster type and the voice.

The evidence base is too thin to choose a model, a skill pack or a reference tool on its merits. Forge should therefore ship a small test harness with the template. The LCK/LEC split provides a ready-made test: the same screen in two brands should look like two leagues, and if it doesn't, the template is not doing its job.

## Corrections after a second opinion, 18 Nov 2026

A second reviewer on a different model spot-checked this report. Three claims were softened above: the separate-reviewer evidence is moderate, not strong; the walkers flagged dashed placeholders as generic, not as the worst thing; and all five walkers were Claude agents, one source. "Beats every public template" was never tested: the plate covers more ground than the templates read, and no comparison of results exists. The long template drafted from this report sits in [template-long-draft/](template-long-draft/); the reviewer found it too long and mostly bans, so the trial is in [docs/design/foundations.md](../../design/foundations.md), which Craig then refocused on the foundations a repo can reuse: token layers, a design file, base parts and the slop lint.
