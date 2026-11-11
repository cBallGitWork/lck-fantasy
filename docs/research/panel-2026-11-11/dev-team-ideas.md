# LCK fantasy: engineering read of the ideas (11 Nov 2026)

**Contents:** [What I checked first (it changes the answers)](#what-i-checked-first-it-changes-the-answers) · [1. Scored table](#1-scored-table) · [2. Proposed beta scope](#2-proposed-beta-scope) · [3. Build order (Cup likely starts about 13 Jan; date unannounced)](#3-build-order-cup-likely-starts-about-13-jan-date-unannounced) · [4. Where the reports are wrong or disagree](#4-where-the-reports-are-wrong-or-disagree)

## What I checked first (it changes the answers)

- **Oracle's Elixir has no event log.** It is one row per player per game, 165 columns of totals. It has champion, the five bans, pick order, first blood, multi-kills, vision, damage, gold/CS at 10/15/20/25, and team objective counts. It has no Baron steals, solo kills, base races, Player of the Match or coaches. Riot's live feed is K/D/A/CS/gold frames plus team objective counts, also no events.
- **So the spec's own example stamp ("Ryu sad face", a lost solo 1v1) cannot be detected today.** Nor can Innovation's referee (12) or the Claude report's "propose stamps from event logs". Only GRID might carry events.
- **The 2026 Cup was 7 weeks, and only 2 were normal.** From the file: two weeks of two Bo3s per team, a Super Week of one Bo5 each, then four knockout weeks with 6, 6, 6 and 3 teams. The open "playoffs" question is over half the beta. The 2027 format is unannounced.
- **The settled-points source is fragile.** The official Drive folder refused the download (quota), and the backtest ran on a third-party GitHub copy. One person runs it. The time of day it updates is unverified.
- **Live feed:** game ids come from a keyed Riot API whose key is not ours, and 2026 LCK coverage is untested. Live is a spike, not a promise.
- **Champion-pool point:** it fires in 303 of 723 regular player-weeks (42%), and in 93% of weeks where a player wins three games. It is a win bonus with a nicer name.

## 1. Scored table

AD = agent-days. Ch = Craig-hours. Cost is per week. I = Innovation, R = research top 8.

| Idea | Depends on | AD / Ch | Cost | Risk | Verdict |
|---|---|---|---|---|---|
| I17+18 Synthetic season + red team | OE 2026 in Convex, scoring as data | 4 / 1 | <$2 a run | Low | **Beta.** Sets prices and finds the template squad before people do |
| I20 Book research desk | Web sources; each moment matched to an OE column | 3 / 3 | ~$20 once | Folklore; most moments not detectable | **Beta**, cut to 30–40 detectable stamps |
| I10 The paper | Final points, weekly history, in-app page | 4 / 2 | $5–20 per 1,000 managers | Tone; Korean nobody proofreads | **Beta**, in-app, from GW2 |
| I11 House managers | The coded bots from I17; public leagues | 2 after I17 / 1 | <$1 (Haiku reason lines) | Feels fake if unlabelled | **Beta**, as coded creeds, not Opus agents |
| I15 Why-line | Points breakdown in code | 1.5 / 0.5 | <$0.10 | Low | **Beta** if a slot is free; else Split 1 |
| R3 Elder v Baron war | 2027 Cup keeping its groups | 1.5 / 0.5 | 0 | Format may change | **Beta** if the format returns |
| R6 Pick in pairs | Squad shape, budget | 2 / 1 | 0 | Leaves bench, flex, coach unfilled | **Beta** as an "auto-fill the rest" button |
| I19 Persona playtesters | Staging site | 2 / 1 | ~$10 a run | Agents are too patient | **Beta**, build practice, late December |
| I23 Night desk | OE file timing; an admin page | 3 / 1 | <$1 | Silent failure | **Beta** as a Convex timer with an alert, no agent |
| I6 Balance patches | Scoring as data | 0.5 / 1 | 0 | Low | **Split 1**: the Cup-to-split change is the first patch |
| R1 Fearless captain | Captain rule; stages as data | 1 / 0.5 | 0 | Pointless in a Cup with 2–3 normal weeks | **Split 1** |
| I3 Duo links | Lineups; Rift view | 1.5 / 0.5 | 0 | Deepens the T1/Gen.G template | **Split 1**, after the sim prices it |
| R5 Crystal Ball | Champion counts (have); POM (don't) | 4 / 1 | 0 | A second thing to settle | **Split 1** |
| I2 Champion slot | Champion + bans (OE has both, next day) | 5 / 1.5 | 0 | Patches; a new pricing problem | **Split 1** |
| I14 Standing orders | Lineup engine | 4 / 1 | $0.30 per 1,000 | A model moving a team costs points | **Split 1**. Beta copies last week's lineup forward |
| I1 Lane-by-lane H2H | H2H leagues, fixtures, byes: none in the spec | 8–10 / 3 | 0 | High, see section 4 | **Later** |
| R2 Weekly Challenge | A second game | 6 / 2 | 0 | Splits a small beta | **Later**, but its "fresh five" is one answer to the knockout weeks |
| R7 Draft card, burned champions | Live bans (not in the live feed) | 3 / 1 | 0 | Live source | **Later**; post-game version is cheap |
| I8 Ticket stubs | Final points; art | 5 / 3 | 0 | Art quality | **Later** |
| I13 Word from Korea | Korean forums opening to a fetch | 1.5 / 1 a week | ~$2 | Rumours about real players | **Later** |
| I5 The Climb | A second game | 12+ / 4 | 0 | Scope | **No** for now |
| I12 Referee's stamps | An event log | — | — | No data | **No** unless GRID says yes |
| I16 House rules in words | Private-league scoring | 8 / 2 | pence | Per-league scoring multiplies testing | **No** |
| R4 Champion-pool point | — | 0.5 | 0 | Double-counts wins | **No** as written |

## 2. Proposed beta scope

**The core that must exist by January:**
- LCK data layer: teams, players, contracts, series, games, stats, with the Cup as rows. OE ingest plus a manual upload path and admin correction.
- Scoring engine driven by rules data, with re-score and a line-by-line breakdown.
- Gameweeks and one deadline, shown in local time. Admin can move a series.
- Squad pick under a budget on the Rift view, before sign-up; magic-link sign-up after.
- Lineup, bench, captain and vice, auto-subs, lineup copied forward.
- Transfers with free moves and −4 hits.
- Settle a gameweek: points, hits, rank. Final points next day.
- Leagues: global, supporter (from favourite team), private by code.
- Points page, player list with price and form, fixtures.
- An admin page and failure alerts.

**Differentiators I would bet on (4):**
1. The achievement book, small: 30–40 stamps the data can actually award.
2. The paper, in-app, one front page a week.
3. House managers built from the synthetic-season bots, clearly marked.
4. Elder v Baron managers' war, if the 2027 Cup keeps its groups. If not, the why-line.

**Cut to make room:**
- Moving prices. Set once from the sim, re-set at the split. Sixty managers cannot drive a market.
- Chips down to two at most.
- Coach slot scores on team results only (the data has no coaches; ten rows by hand).
- Live points as a stretch: spike early, go or no-go on 15 Dec, shown as provisional.
- Player portraits, Korean-language UI, H2H of any kind, the champion slot.

**Grills that block building, in order:**
1. Cup gameweeks and the knockout weeks: what a manager does when 4 then 7 teams are out. Blocks the schedule, deadline and transfer models.
2. Squad and slots: sizes, bench, flex, coach, a cap per LCK team, what triggers an auto-sub.
3. Scoring values: the length bias in kills+assists, the top-lane gap (17–23% behind), the dead 25-minute bonus, coach scoring, which parts show live.
4. Budget and prices, and whether prices move in the beta.
5. Transfers and chips: free moves, banking, the Cup's chip set.
6. Leagues and onboarding, including yes or no to house managers.
7. Achievement book: cap, its own column, ties, and the first list.
8. Live points, once GRID replies and the spike reports.

Also needed early: approval of the pick-team picture, and a call on the phone layout. Pick-before-sign-up links will be opened on phones.

## 3. Build order (Cup likely starts about 13 Jan; date unannounced)

| Week | Agents, unattended | Craig |
|---|---|---|
| 1: 11–17 Nov | Port the pipeline. Real-world tables. OE ingest, checked against the backtest numbers. Test the Drive download and a Leaguepedia bot-account fallback | Grills 1–3 (3h). Send the GRID email; a courtesy note to Oracle's Elixir |
| 2: 18–24 Nov | Scoring engine as data. Gameweek and deadline engine. Live-feed spike: can we get a game id without Riot's key? | Grills 4–5 (2h). Approve the pick-team picture (1h) |
| 3: 25 Nov–1 Dec | Squad pick, budget, browser-held squad, sign-up, entries | Grill 6 (1h). Picture approvals (1h) |
| 4: 2–8 Dec | Transfers, hits, captain, auto-subs, settle, ranks. Synthetic season v1 on the 2026 Cup | Read the sim report; set prices (1.5h) |
| 5: 9–15 Dec | Leagues, points page, two chips. Red team on scoring. Research desk run | Grill 7 (1h). Live go/no-go |
| 6: 16–22 Dec | Achievement engine and stamps. Admin page and alerts. The paper v0 on replayed weeks | Approve stamps (2h). Tone pass on the paper (1.5h) |
| 7: 23–29 Dec | House managers. Persona playtesters. Full test sweep | Light: read the playtest report (1h) |
| 8: 30 Dec–5 Jan | Dress rehearsal: replay the 2026 Cup day by day through the real timers. Load 2027 rosters and format | Play it with a few friends (2h). Confirm rosters and prices (1h) |
| 9: 6–12 Jan | Fixes only. Open squad picking | Invite people. Watch the first deadline |

About 40 agent-days of core and 15 of differentiators. Craig's time is about 20 hours, and the first three grills are the critical path: nothing in weeks 2–4 can start without them.

## 4. Where the reports are wrong or disagree

**Innovation**
- **Lane-by-lane is its top pick and the worst fit for the beta.** It needs H2H leagues, a fixture list, byes and late-joiner rules, none in the spec. Flex, coach and bench have no opposite lane. Ownership is not exclusive and each role has about ten starters, so both managers will often field the same player and tie the lane. In the knockout weeks most lanes would be empty. It only fixes role balance inside H2H; the global table keeps the top-lane gap.
- **"A few hundred sourced moments, stamps landing in week one"** confuses moments with rules. A stamp needs a column. Pentakills (9 all season), deathless wins, first blood, reverse sweeps and odd champions work. Steals and solo kills do not.
- **The referee (12) reads an event log that does not exist.**
- **The night desk cannot settle "after the last series".** The file updates once a day at an unknown hour; settling is next day.
- **"The paper arrives"**: not by email. Resend's free plan is 100 a day and sign-in links need them.
- **The Climb "playable before January"** is a second game with no first game built.
- **Its five-idea beta** assumes nine squad slots, public leagues of 18 and H2H, all undecided.
- Its costs hold up. The paper on Sonnet batch is $4.50 per 1,000 on the stated tokens; with memory, a longer page and thinking I get about $10–20. Still pennies at beta size.

**Claude expert**
- **"Fable costs four times Opus" is wrong.** $8/$40 against $4/$20 is twice. Its own recap row shows it ($36 v $18). The advice not to use it stands.
- **"Five series a week" is wrong.** A normal LCK week has ten.
- **The match-narrative row is shifted a column.** $0.08 a week is the Sonnet figure; Haiku is under a penny.
- **Achievement stories on Haiku are about $0.27, not $3.**
- **Its "Ryu sad face check from event logs"** has the same missing-data fault.
- Its other figures re-derive correctly (recap, score-move, swap card, live summaries).

**Against each other**
- Innovation wants per-manager Sonnet text and Opus for house managers; the expert says per-series only and Opus for write-once work. At under 1,000 managers both cost less than $20 a week, so cost does not decide it. Checking does: the expert's rule (code computes every number, each sentence cites its stats) should bind the paper.
- Innovation runs the night desk on Managed Agents; the expert says they are not needed and scheduled tasks are a preview. I side with the expert: a Convex timer and a plain API call.
- Both skip the two real risks: the settled-data source, and that half the Cup is knockouts.
