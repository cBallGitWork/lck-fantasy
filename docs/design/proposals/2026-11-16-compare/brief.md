# Compare: brief

**The screen.** Compare, in the beta: two players side by side, with header stats, form, scoring lines and next series (spec/12, The player card, Compare; Craig, 13 Nov 2026: "Compare yes watchlist no"). Reached from **Compare ›** on the player card, from Pick Team or Points, and on the coach card ([player-card README](../../approved/player-card/), Controls; [coach-card README](../../approved/coach-card/), Buttons). The player-card README lists it as "not drawn".

**Jobs**

1. Pick between two players before a transfer or a Carry choice (spec/12 Compare; spec/04).
2. Read both headers at once: price, owned, form, season total, each with rank (spec/12 Compare, "header stats"; spec/12 Header).
3. Read both players' scoring lines side by side (spec/12 Compare; spec/05 The player table).
4. See each one's next series (spec/12 Compare; spec/12 Front: series, not gameweeks, Bo3 or Bo5).

**Data**

| Fact | Spec line | Placeholder issue |
|---|---|---|
| Team, role, price in 억 and last move | spec/12 Header; spec/02 | #22 closed, #23 |
| Owned by %, with rank | spec/12 Header | #36 |
| Form: average of the last 4 gameweeks, with rank | spec/12 Header | #36 |
| Season total, with rank in role | spec/12 Header | #36 |
| Transfers in and out this gameweek | spec/12 Header | #20 closed |
| Player lines, per game and total | spec/05 The player table; spec/12 Season stats | #36 |
| Coach lines, if coaches compare | spec/05 The coach | #36 |
| Next series: opponent, day, Bo3 or Bo5 | spec/12 Front, Fixtures | #36 |

There is no issue for Compare itself yet.

**Moment.** The player card's: opened from Faker's card on Pick Team, LCK Cup Week 4, Tuesday 22:00 London, Weeks 1 to 3 final. Faker v Chovy, both mids, with their numbers from the approved pictures: Faker T1 ₩18.5억 ▲0.5, form 19.3 (1st), 46% owned (1st), 58 points (2nd of 10 mids), next T1 v KT, Wednesday, Bo3; Chovy GEN ₩17.5억 ▲, 61 points, 41% owned. Chovy's form and next series are not in any picture yet; make them up to fit.

**References.** The approved player card's header, meta line, series strip and Season panel, as two columns. Community FPL compare tools: one table, a row per stat, the two players as columns. Fantasy Football Scout: stats grouped, a pick from drop-downs. Full notes: [references.md](references.md).

## Not settled by the spec

Each needs Craig's answer before the picture binds it. The recommendation is FPL's way or the card's, never a rule.

1. **Where does it open?** Example: a sheet over the card, or its own page with a link. Recommend: a sheet over the page, as the card is; ✕ goes back to the card.
2. **How is the second player picked?** Example: after Compare › on Faker, a search box, or a list of mids. Recommend: a search with the same role listed first, as FPL tools use a drop-down.
3. **Any role against any role?** Example: Faker against Keria. Recommend: allowed; the lines are the same, only the kill and death rates differ by role (spec/05).
4. **Coach against coach, or against a player?** Example: kkOma v Gen.G's coach. Recommend: coach against coach only, with the coach lines, since a player and the team score different lines.
5. **Lines as totals or per game?** Example: Faker 14 kill points in 18 games, or 0.8 a game. Recommend: both, as the card's Season panel shows total and per game.
6. **Is the better number marked?** Example: Chovy's 61 bold against Faker's 58. Recommend: the better of each pair bold; no overall verdict or score, which only paid tools such as Scout's add.
7. **The last 3 series too?** Spec says form and next series. Example: Faker 10 · 12 · 5 beside Chovy's last 3. Recommend: yes, the card's series strip for each, as the card puts past beside next.
8. **How many next series?** Example: 1 or 3. Recommend: 3, as the card's front.
9. **Buttons on Compare?** Example: Transfer in Chovy from here. Recommend: none in the beta; the spec names only the side-by-side, and the card keeps the buttons.
10. **Swap a side?** Example: change Chovy for Bdd without closing. Recommend: yes, a change link on the second column; the first stays the card's player.
11. **Champions?** Example: each player's top 3 champions. Recommend: no; the spec lists only header, form, lines and next series.
