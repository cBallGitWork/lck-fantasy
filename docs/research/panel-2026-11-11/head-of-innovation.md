# Head of Innovation: 23 bolder ideas for the LCK fantasy game (11 Nov 2026)

**Contents:** [What is new this year that we can use](#what-is-new-this-year-that-we-can-use) · [1. Product mechanics no fantasy game has](#1-product-mechanics-no-fantasy-game-has) · [2. AI-native features](#2-ai-native-features) · [3. How we build](#3-how-we-build) · [Top 5](#top-5) · [The beta with only those five](#the-beta-with-only-those-five) · [Sources and what I could not open](#sources-and-what-i-could-not-open)

I read the decisions, spec, data model, backtest, live-data note, site flow, the 42 listed ideas and the Rift-with-shirts look. None of the ideas below repeats those 42.

## What is new this year that we can use

- **Model prices fell a long way.** Haiku 5.5 is $0.10 in / $0.50 out per million tokens, Sonnet 5.5 $2 / $10, Opus 5.5 $4 / $20, Fable 5.2 $8 / $40. Batch runs cost half. These come from the Claude API reference bundled with this tool (cached 3 Nov), not the live pricing page. Personal text for every manager now costs pennies.
- **Fable 5.2 shipped on 9 Nov** with a 20% price cut ([Silicon Report](https://www.siliconreport.com/anthropic-releases-mythos-5-2-and-fable-5-2), one secondary source).
- **Agents can run on a schedule with nobody watching.** Managed Agents has cron deployments and "work until a rubric passes" outcomes (same API reference).
- **Claude Design, Docs and Slides left beta on 8 Oct; Dashboards and Motion entered beta** ([OrcaRouter](https://orcarouter.ai/pt/blog/claude-news-what-anthropic-shipped-in-october-2026), secondary source). Motion makes animations by writing code, not with a video model (unverified, search snippet).
- **Claude Duet (21 Oct)** is a proactive agent that acts and only checks in for decisions (unverified, search snippets). It is the pattern to copy: act, don't chat.
- **Korean scene.** Korean LCK streams are now only on CHZZK and SOOP, with official "cheering" co-streams. SOOP sells player photocards. Gen.G's Worlds campaign lit 1,000 lights on its lightstick, one per fan message, in 30 minutes. All three are unverified (search snippets from Inven Global, not opened).
- **I found no fantasy game or Football Manager release with generated personal narrative.** FM26's "storytelling" is match visuals. EA FC 26 uses an AI copy of a commentator's voice (unverified, PCGamesN snippet). The narrative layer looks open.

Costs below assume one call per manager per week unless stated, and use the prices above.

## 1. Product mechanics no fantasy game has

**1. Lane-by-lane head-to-head** (M)
In a head-to-head week you don't compare totals. Your top plays his top, your jungler his jungler, and so on for each slot. Most lanes won takes the match; total points only break ties. The Rift board shows each lane lit in the winner's colour.
*LCK:* it is how every LoL fan reads a game: "who won bot?". It also removes the role-balance problem, because a top laner is only ever compared with a top laner.
*Risk:* a second way of winning to explain; needs head-to-head leagues to exist.

**2. The champion slot** (M)
One extra slot holds a champion, not a person. It scores when that champion is picked and wins, and a little when it is banned ("respect ban"). You change it weekly.
*LCK:* Fearless Draft burns champions through a series, so pick rates spread and the meta call is a real skill. No other sport has a "tactic" you can own.
*Risk:* patch changes mid-stage; needs clean champion data per game (the lineup table already holds it).

**3. Duo links** (S)
Field a real bot lane (bot and support from one team) or a real mid-jungle pair and a line is drawn between their shirts on the Rift, with a small bonus when both win. Break the pair and the line goes.
*LCK:* fans talk in duos: Ruler and Duro, Faker and Oner. It makes stacking one team a choice with a price, not an accident.
*Risk:* pushes everyone to the same two duos unless the bonus is tiny.

**4. Solo queue rank, not a rank number** (S)
Your global standing is a tier: Iron up to Challenger, with LP won or lost each week and a "promos" week when you sit on the edge of a tier.
*LCK:* every LoL player already feels these words. "Diamond II, +18 LP" means more than "rank 41,208".
*Risk:* Riot's tier names and emblems are their marks; use the words carefully and draw our own badges.

**5. The Climb: a roguelike run through LCK history** (L)
A side mode playable any day. You are offered three players per slot, draft five, and face a real past series. Win and you draft again with a tighter budget; lose three and the run ends. Runs use the 502 real 2026 games we already hold.
*LCK:* it fills the six-week gaps and the days with no matches, and it teaches new fans the players through real results. It is also playable before January.
*Risk:* it is a second game; scope must stay one screen. People may remember results, so hide dates and opponents until after the pick.

**6. Balance patches with patch notes** (S)
Between stages the scoring is tuned and published as patch notes: "Supports: vision floor buffed. Junglers: early-lead point nerfed." The league's rules are data, so a patch is a config change.
*LCK:* LoL fans expect the game to shift under them and enjoy reading the notes. It turns a scoring fix into an event, not an apology.
*Risk:* changing rules mid-year angers leaders; only ever patch at a stage break.

**7. The league ban** (S)
Each week every manager in a mini-league casts one ban. The most-banned player cannot be captained in that league that week.
*LCK:* bans are half of a LoL draft and fantasy has never had one. It breaks the template from the inside, by the managers' own hands.
*Risk:* spiteful in small leagues; ties need a rule; clashes with other captain rules if both are on.

**8. Ticket stubs** (M)
Every series one of your starters plays leaves a dated stub in a binder: opponent, score, his champions, your points. Rare stubs are earned, never bought or pulled: a pentakill, a reverse sweep, a debut. No packs, no gacha.
*LCK:* photocard binders are how Korean fans keep a season. A stub drawn from stats needs no player photo, so no image rights.
*Risk:* art must be good or it reads as filler; storage grows with teams × weeks (small rows).

**9. The cheer stick** (S)
Each week you may light one cheer for one player, owned or not. Cheers are counted across the whole game and shown as lights on his card. If the most-cheered player wins, everyone who cheered him gets a stamp.
*LCK:* cheering is the organised heart of Korean fandom; it lets a T1 fan back Faker without owning him.
*Risk:* always goes to T1; cap it per team or show "share of your supporter league".

## 2. AI-native features

**10. The paper** (M). Sonnet 5.5, batch. About $5 per 1,000 managers a week; under $1 on Haiku 5.5.
Each Monday every manager gets a front page about his own week, in the voice of a Korean sports daily: a hangul headline with an English one beneath, a villain, a hero, a snide line about his bench. It remembers earlier weeks, so week 5 can bring up the week 2 blunder.
*LCK:* the sports-daily look is already drawn; this is what fills it. A score card is not a story.
*Risk:* tone. A joke about a real player can land badly; keep the mockery on the manager, never the pro.

**11. House managers** (M). Opus 5.5. Flat cost, about $3–5 a week for ten, whatever the number of managers.
Ten AI managers play the season for real, each with a creed: the T1 loyalist, the stats purist, the rookie hunter, the Inven doom-poster, the retired coach. They make transfers before the deadline and publish a two-line reason after it. They sit in public leagues, so a beta of 60 people still has full tables and someone to beat.
*LCK:* each creed is a real fan type from the Korean scene. A small beta feels inhabited from day one.
*Risk:* if they win the league it feels rigged. Mark them clearly and keep them out of prizes and badges.

**12. The referee's stamps** (M). Opus 5.5 reads each series once. Flat, about $2 a week.
After each series a model reads the event log and nominates moments no rule can define: a stolen Baron that flipped a game, a base race, a pick that made the casters shout. Approved ones become one-off stamps for whoever owned the player.
*LCK:* the achievement book is memes and history; this is how new memes get in during the season.
*Risk:* invented moments. Every nomination must cite the event rows and wait for one human tap.

**13. Word from Korea** (S). Sonnet 5.5 with web search. Flat, about $5 a week.
A short weekly column: what Korean fans are saying this week, with the slang explained and links to the threads. Written, not chatted.
*LCK:* English-speaking fans cannot read Inven or FM Korea. Nobody else gives them this, and Craig can judge whether it is right.
*Risk:* summarise and link, never copy posts; community rumours about players must be left out.

**14. Standing orders** (M). Haiku 5.5. About $0.30 per 1,000 managers a week.
You write one plain sentence to your assistant coach: "never bench Faker; otherwise start whoever plays twice; captain my bot laner". If you miss a deadline, he acts on it and leaves a note saying what he did and why.
*LCK:* deadlines fall at Korean times, which is the middle of the night for half the world.
*Risk:* an agent changing a team is the one place a mistake costs points. Limit it to lineup and captain, never transfers, and log every move.

**15. The why-line** (S). Haiku 5.5, per player-series, not per manager. Flat, under $1 a week.
Beside every score on the Series page sits one sentence from the data: "Behind 1.2k at 15 after an early gank, then nine assists in game two."
*LCK:* a LoL scoreline hides the story far more than a football one.
*Risk:* low. Generate once, cache, and show only what the numbers support.

**16. House rules in plain words** (L). Opus 5.5, per use. A few pence each time.
A private-league commissioner types a rule: "supports score double in Super Week". The model turns it into scoring settings and shows what it would have done to the 2026 season before he confirms.
*LCK:* scoring is already a set of toggles held as data; this is a front door to it.
*Risk:* rules the settings cannot express must be refused plainly, not half-built.

## 3. How we build

**17. The synthetic season** (M)
Before any human plays, 500 bot managers play the whole 2026 Cup from the stored data in an hour. Most are simple strategies in code; thirty are Haiku personas who choose like people. An Opus pass then reports: the template squad, dead prices, the chip that never gets used.
*Fits:* the backtest already found two faults by hand (series sums reward long series; kill points reward losing long games). This finds the next ten.
*Risk:* bots are not people; treat it as a smoke alarm, not proof.

**18. The scoring red team** (S)
One agent has one job: break the scoring. For every change to the settings it searches the 2026 data for the degenerate squad and posts it on the pull request.
*Fits:* scoring is the part where breakage is not acceptable.
*Risk:* noise. Report only squads that beat the field by a set margin.

**19. Playtesters with personas** (M)
Agents drive the staging site through a browser as named people: the Worlds-only viewer who knows three players, the commuter on a phone at the 2 a.m. deadline, the FPL veteran who has never watched LoL. Each writes where he got lost, with screenshots.
*Fits:* pick-before-sign-up lives or dies on the first two minutes.
*Risk:* agents are patient in a way people are not; count clicks and seconds, not opinions.

**20. The book's research desk** (M)
One agent per LCK year, 2012 to 2026. Each returns twenty moments with two sources, the date, the players, and whether our data could detect a repeat. A second agent opens every source and strikes what it cannot confirm.
*Fits:* the book is the product's soul and nobody has time to research fifteen years by hand.
*Risk:* folklore dressed as fact. Nothing enters the book without an opened source and a human yes.

**21. A Korean-eyed reviewer** (S)
A reviewer agent reads every screen as a Seoul LCK fan would: hangul spelling, 억 and 만 in prices, team and player romanisation, whether a joke is current or five years stale, whether the "Korean feel" is costume.
*Fits:* a founder who lived there will spot fakery, and so will Korean fans.
*Risk:* a model is not a Korean fan. Use it to catch errors; have one real fan read it before launch.

**22. Six looks, not three** (S)
For each new screen, six agents draw it from six unrelated briefs: a KBO scoreboard, a PC bang poster, a webtoon strip, a subway birthday ad, a 1990s sports paper, a lottery slip. A lint throws out anything with stock-app habits before a human looks.
*Fits:* the stated goal is distance from the AI look; distance comes from the brief, not from polish.
*Risk:* variety without a house style. The chosen look must then bind the rest.

**23. The night desk** (M)
A scheduled agent wakes after the last series each match night. It settles points against the daily data file, drafts the paper, queues the referee's nominations and writes the price notes, then leaves one approval page to tap through in the morning.
*Fits:* matches end around 14:00 UK time on weekdays. One person cannot be a newsroom; one person can be an editor.
*Risk:* an unattended run that fails quietly. It must report on its own failure, and nothing reaches managers without the tap.

## Top 5

1. **Lane-by-lane head-to-head (1).** The one mechanic that could only exist in this sport, and it makes the Rift picture the game, not decoration.
2. **House managers (11).** Fixes the empty-room problem of a small beta for a few pounds a week.
3. **The paper (10).** The narrative layer, in a look already drawn, at under a penny a manager.
4. **The book's research desk (20).** Gets the achievement book written, with sources, by January.
5. **The synthetic season with the red team (17, 18).** Lets two people ship scoring they have already seen a thousand managers try to break.

## The beta with only those five

A visitor lands on the Rift, picks nine shirts and saves. He is placed in a league of eighteen: a dozen real people and six house managers, each with a face and a creed. Each week he plays one of them lane by lane, and on match days he watches his lanes turn his colour or the other man's. On Monday a front page about his week arrives, with a hangul headline, and it remembers what he did last week. The book already holds a few hundred sourced moments from 2012 onwards, so stamps start landing in week one. Behind it, the scoring went live having survived a simulated Cup. Chips, the champion slot, The Climb and the rest can wait for Split 1.

## Sources and what I could not open

- Opened and read: [Silicon Report on Fable 5.2](https://www.siliconreport.com/anthropic-releases-mythos-5-2-and-fable-5-2); [OrcaRouter's October round-up](https://orcarouter.ai/pt/blog/claude-news-what-anthropic-shipped-in-october-2026). Both are secondary; I did not reach Anthropic's own news pages.
- Unverified (snippets only): Claude Duet and Claude Motion details; the CHZZK and SOOP exclusive deal and cheering co-streams ([Inven Global](https://www.invenglobal.com/articles/19982)); SOOP photocards ([Inven Global](https://www.invenglobal.com/articles/23553/soop-hosts-fan-meetings-and-on-site-events-for-lck-partner-teams-during-msi-fan-festa)); Gen.G's lightstick campaign ([Inven Global](https://www.invenglobal.com/articles/26373/geng-unveils-2026-worlds-campaign-the-light-between-us)); EA FC 26's AI commentary voice ([PCGamesN](https://www.pcgamesn.com/ea-sports-fc-26/ai-commentary-lines-guy-mowbray)).
- I searched for generated commentary, AI rival managers and "living world" patterns in 2026 consumer products and found nothing usable. Those ideas rest on judgement, not on evidence that they stuck elsewhere.
- I did not search for roguelike or deckbuilder precedents; ideas 5 and 8 are my own reasoning.
- The token counts behind the costs are my estimates, not measured runs.
