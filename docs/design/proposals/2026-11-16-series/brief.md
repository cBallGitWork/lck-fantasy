# Series page: brief

**The screen.** One series, its games and each player's lines in each game (spec/12 line 36). FPL's equivalent is the match page Craig sent on 13 Nov 2026: score, gameweek and date, then each side's stats (fantasy-site-pages-survey.md, row 25).

**How a manager reaches it.** From a series on the LCK hub's Fixtures or Results (approved lck-hub README, Controls: "A series: opens the Series page"). No other way in is settled; see Q1.

## Jobs

- See who won the series and each game (spec/12 line 36: "one series, its games").
- See each player's lines in each game (spec/12 line 36), the lines being Flol's scoring lines (spec/05 lines 30–41).
- See which 2 games counted for each player: a series scores a player's best 2 games (spec/05 line 20).
- See the coach's lines for both teams, and +3 or −1 for the series (spec/05 lines 52–63). The coach is the 6th role (spec/12 line 38).
- While a series is live, see provisional points; solo kills and steals arrive at final (spec/11 lines 10–14). It turns final 3 hours after it ends (spec/11 line 25).

## Data

| Fact | Spec line | Issue |
|---|---|---|
| Series, games, players, champions, K/D/A and every line | spec/05 lines 30–41 | #36 |
| Best 2 games per series | spec/05 line 20 | #30 (closed: rules built) |
| Coach lines, +3 win, −1 loss | spec/05 lines 52–63 | #30, #36 |
| Live and provisional points | spec/11 lines 9–14 | #34 |
| Final points, 3 hours after | spec/11 lines 23–26 | #33 |
| Bo3 or Bo5 | SPEC glossary, series; spec/10 | #36 |
| Lines go by role played, not listed role | spec/05 lines 26–27 | #30 |
| Academy players subbed in | spec/01 lines 49–51 | #36 |

There is no issue for the Series page itself.

## The moment

The made-up LCK Cup Week 3 of the Points, Live and LCK hub pictures. T1 v DK, Saturday 16 Jan, 10:30 London, 19:30 KST, Bo3. Draw it twice:

1. **Final**, opened from the hub's Results at the hub's moment (Week 4, Tuesday 22:00 London). T1 won 2–0 (hub Results).
2. **Live**, at the Points moment (Saturday 21:10 KST): T1 1–0, game 2 at 14:20. Solo kill and steal read "at final".

Numbers must agree with the approved pictures. Faker G1 Orianna 5/1/9 for 4, G2 Sylas. Siwoo (DK top) G1 2. kkOma G1 2: first tower and most drakes. Rosters: T1 Doran, Oner, Faker, Peyz, Keria, coach kkOma; DK Siwoo, Lucid, ShowMaker, Aiming, BeryL, coach cvMax.

## References to borrow

- **Points' player drawer** (approved points): games as columns, lines as rows, the best 2 boxed, totals under. The Series page is ten of these at once.
- **The coach card's This week** (approved coach-card): W or L, the coach lines, then the series line.
- **Live's scorebug** (approved live): teams in boxes, the score between, game and format.
- **FPL's match detail**: each stat split home and away, one list per side.
- **gol.gg**: tabs Game 1, Game 2, Game 3 and Summary across the top of a series.
- **Inven 경기기록**: one row per set, picks and bans, kill score, play time.

Full notes: [references.md](references.md).

## Not settled by the spec

Each is a question for Craig. The recommendation is FPL's way, or its logic.

1. **Where else does it open?** Example: Points' This week's series, the player card's series strip, Live's scorebug. Recommend: every series row anywhere, as FPL's fixtures open from Fixtures and from the Points view's fixtures panel.
2. **A page or a sheet?** Example: its own URL, or a sheet over the hub like the player card. Recommend: its own page with a URL, since spec/12 calls it a page. The site-flow proposal names FPL's equivalent a match pop-up (`docs/design/site-flow.md`; unverified).
3. **Game tabs, or one grid?** Example: tabs Game 1, Game 2, Series, as gol.gg; or each player one row, games as columns, as the Points drawer. Recommend: one grid per team, games side by side, best 2 marked, as Points. FPL shows one list per stat for the whole match.
4. **Which lines show?** Example: each line's points, or K/D/A with the lines behind a tap. Recommend: champion, K/D/A and points per game, the lines on a tap, as the Points drawer's top rows.
5. **Mark the best 2?** spec/05 says best 2 count; the page line doesn't say to show it. Recommend: yes, boxed, as on Points.
6. **Game facts.** Example: winner, length, side, picks, bans, gold, towers, drakes. Recommend: winner, length and each player's champion only. FPL shows only stats that score.
7. **Your players marked?** Example: a dot by Faker and Siwoo for Baron Steal FC. FPL's match page shows none. Recommend: mark them; the job is "how did my players do".
8. **Ownership per player?** Example: Faker, owned by 46%. FPL's match page shows none. Recommend: none.
9. **Before it starts.** Example: time, Bo3, both rosters. FPL shows only the kick-off time. Recommend: time (yours and KST), format and both rosters, with Watch › to Live.
10. **Spoilers.** lolesports hides some results behind a reveal. Recommend: no hiding; Points shows scores anyway.
11. **Links out.** Example: a VOD per game, the gol.gg game page. FPL links to each club's match report. Recommend: one VOD link per game to lolesports, nothing else.
12. **A player who sat out a game.** Example: an academy mid subbed in for game 2. Recommend: a dash for the missed game, the sub in his team's list with his own row.
