# Points

Your gameweek. Reached from **Points** in the top bar. Drawn at 1440 in Pick Team's look ([plate.md](../../plate.md); the shared styles are `../pick-team/look.css`): the Rift at the main column's left, a column of panels beside it, the tapped player's week under both, leagues, the week's series and your week in the side column.

**Approved:** Craig, 27 Nov 2026: "Yes, save both" (Points, and the player card it shares with Transfers). The redraw of the 14 to 17 Nov pictures in the new look. On 26 Nov he put the breakdown under the Rift, opened the page on the Captain's week and let the Captain's ×1.5 show once. On 27 Nov he cut each tile to the week's total, asked for a card round because the card was a mish-mash of fonts and shapes with no colour (research on FPL and UCL Fantasy, the review team's wants, three proposals, one final), and then took the line under the name out of the card's head. Names, teams and numbers are a made-up Split 1 Week 3, not roster data. This binds layout, content and order; plate.md how it is drawn.

| File | Shows |
|---|---|
| `1440.png`, `points.html` | Saturday, T1 v DK live in game 2, GEN v HLE still to come: the page as it opens, the Captain's week under the Rift |
| `1440-coach.png`, `points.html?p=kkoma` | The coach tapped: his lines, and each series' `Series win +3` row |
| `1440-bench.png`, `points.html?p=bdd` | A bench player with no games tapped |

`render.js` draws every state; players and places are Pick Team's (`../pick-team/data.js`). Card view is not redrawn yet and keeps its 14 Nov layout.

## What binds

1. **Head:** the team's name and hangul, then ‹ week › as two 32px keys, off at Week 1 and at the latest week; `Rift view | Card view` at the right.
2. **A tile** is Pick Team's (role strip, shirt, the Captain's C, the white plate with team and name) with one dark band: the week's total alone (Craig, 27 Nov 2026: no series row). With a series still to come it is the total so far, then that opponent: `7, v GEN`. A live series is under way, so its tile shows the total alone. The Captain's tile shows his result, never the working.
3. **Total**, a panel beside the Rift: the week's points at 28, `Not final` until the week is, Average, Highest ›, and the live game said once with Watch ›.
4. **Bench**, a panel under it on the Rift's green: each player under his order and role (`1. Mid`), his points grey because they don't count, a dash and `Didn't play` with no games.
5. **The player's week**, under the Rift and its panels (Craig, 26 Nov 2026, in place of the sheet over the page): the card of the card round.
   - Head: the panels' blue band on one line, read as a tile: crest, the role in its dark strip, the team's bar and code, the name, his hangul, the C; his total at the right at 28. Nothing under the name (Craig, 27 Nov 2026). The Captain's shows `17 ×1.5` and `Captains averaged 19` once, before the total.
   - Body: one ruled table. A series is a header row on `--fill`: day, the opponent's crest, `v HLE ›`, the result outlined (`W 2–1`) or a filled `Live` and the score so far, its points at the right. A game is a 32px row: `G1`, `W` or `L` outlined in green or red, the champion, K, D and A each in its column with D grey, the lines that scored, the points boxed when counted and grey when dropped.
   - The coach has no champion and no K D A; each of his series ends with `Series win +3` or `Series loss −1`.
   - Foot: Full stats ›.
   - Before any tap it shows the Captain's week. The tapped tile is outlined.
   - A third series in a week is a third header row with its games.
6. **The Rift, its panels and the card stay on screen** while the side column scrolls.
7. **Leagues**, the side column's first panel: each league with your rank and its move, green up and red down; Overall with its tier and shield; `≈6 pts to Diamond IV` and All leagues ›.
8. **This week's series:** each with both teams' bars, its result, `Live` with the score, or its time.
9. **Your week**, below the series (Craig, 16 Nov 2026): Star, Flop and Killer, each with points and ownership; a dot marks a player of yours.
10. Then the sponsor slot.

## The card round, 27 Nov 2026

- Looked at: FPL's player card (a team banner, a stat strip with ranks, form and fixtures as badges with points chips, coloured results) and its Points page (name and points on a tile, nothing else); UCL Fantasy's card (the series strip as crest, code and points).
- The review team wanted team colour, coloured results, one chip shape, one figure system, and series drawn the same on both screens.
- Three proposals: a team-colour band, a lineup card with the shirt, and a scoreboard. Three of four ranked the scoreboard first; nobody wanted a full team-colour head.
- The final takes the scoreboard's band, K D A columns and series rows, the band proposal's stat strip (on Transfers), the lineup card's role label, and UCL Fantasy's series strip (on Transfers). W and L are outlined so filled green stays Buy's.

## Borrowed

- **FPL's Points page**: the total beside Average and Highest, name and points on a tile, a tap showing the player's week.
- **FPL's and UCL Fantasy's player cards**: coloured results, a stat strip with ranks, the series strip.
- **The LCK's in-game scoreboard**: K, D and A in columns.
- **LoL ranked tiers**: overall rank as "Emerald I" ([spec/08](../../../../spec/08-leagues.md#overall-tiers)).

## Controls

- **A player, coach or bench tile**: shows his week under the Rift.
- **`v HLE ›`** on a series: its Series page. **Full stats ›**: the player card.
- **‹ ›**: the week before or after (`/points/2`).
- **Highest ›**: the top team's week. **Watch ›**: Live. **All leagues ›**: Leagues.
- **Rift view | Card view**: the shared remembered view (spec/12).

## Placeholders

| What | Issue |
|---|---|
| Series, games, stats | #36 |
| Live points | #34 |
| Final points, ranks | #33 |
| Captain ×1.5 | #19 |
| Auto-subs | #14 |
| Leagues | #38 |
| Overall tiers | #108, #109 |
| Hangul names, sponsors | spec/13 |
