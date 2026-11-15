# Manager profile

Any manager's public page, with three tabs: Points, History, Transfers. Reached from a league table row, and a name in the Following feed or lists. Drawn at 1440 in the shared frame.

**Approved:** Craig, 14 Nov 2026. He asked "does manager profile have transfer history?", picked the profile as the next design, took the recommended calls (private leagues shown, truck from the feed only, a History row opens that week), then "File and merge". Names, teams and numbers are a made-up LCK Cup Week 3 on the Sunday before its last two series, the same Minji as the Following picture, with Points' fixtures and the Series picture's numbers; not roster data. Redrawn to [plate.md](../../plate.md) on 15 Nov 2026; this binds layout, content and order, and plate.md how it is drawn. The source is [docs/design/proposals/2026-11-14-profile/](../../proposals/2026-11-14-profile/) (`build.py`, `brief.md`).

| File | Shows |
|---|---|
| `1440.png`, `points.html` | Points: Week 3 not final, her team in role order with C and V, points and each series; her tier beside Overall; trucks parked on her |
| `1440-history.png`, `history.html` | History: each week's points, total, ranks, transfers, hits, bank, value and buff; buffs left |
| `1440-transfers.png`, `transfers.html` | Transfers: each week's swaps by slot, with team, price, the week's hits and points gained |

## Borrowed

- **FPL's entry pages**: the Points view, Entry History and Transfer History, here three tabs of one page, with the leagues sidebar on each.
- **The hangul banner** (spec/13): the team name in hangul, in the favourite team's colours; drawn ink and grey until the look is chosen.

## Controls

- **Following ✓** in the banner: you follow her; it unfollows. To a manager you don't follow it reads **Follow**, then **Requested** until they accept (spec/14). On your own profile it is absent.
- **‹ Week 3 ›**: the week shown; a team shows only once its deadline has passed, as FPL.
- **A player**: opens the player card; the coach opens the coach card.
- **A History row (›)**: opens that week on Points.
- **A league**: opens its table.

## Placeholders

| What | Issue |
|---|---|
| Points, average, highest, ranks | #33, #34, #38 |
| Team, Carry and Vice | #13 |
| Transfers, hits, bank, value | #20, #22 |
| Buffs | #25 |
| Follow state, trucks | #89, #90 |
| Hangul banner | spec/13, no issue yet |

## Still open

The team panel is a list until the Points page is drawn; then it follows Points.
