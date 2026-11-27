# Home

The signed-in start page, at 1440. A manager reaches it from **Home** in the top bar or the Flol wordmark, and lands on it after sign-in. It has two states: a series live, and nothing live.

**Approved:** Craig, 27 Nov 2026, "Yes, save it": Home redrawn in the new look ([plate.md](../../plate.md)), after he looked at FPL's Status, UCL Fantasy's Overview and F1 Fantasy's home and said "All four" to the ideas taken from them. It replaces the picture of 13 Nov 2026. Names, teams and numbers are a made-up Split 1 Week 3 and Week 4, Pick Team's and Points' own ([../pick-team/data.js](../pick-team/data.js)). This binds layout, content and order, and plate.md how it is drawn.

| File | Shows |
|---|---|
| `1440.png`, `home.html` | A series live: Saturday of Week 3, T1 v DK in game 2 |
| `1440-idle.png`, `home.html?s=idle` | Nothing live: Tuesday evening before Week 4's deadline |
| `1440-boost.png`, `home.html?s=idle&b=bb` | Bench Boost played for Week 4, before the deadline |
| `1440-boost-live.png`, `home.html?b=bb` | Bench Boost on in the live week |

`render.js` draws every state; the styles Home shares are Pick Team's (`../pick-team/base.css`, `look.css`).

## Borrowed

- **FPL's Status page**: the deadline in the narrow column with Pick Team and Transfers by it, the next deadlines under the countdown, your points between Average and Highest, and the game's own facts (most captained, most bought and sold).
- **UCL Fantasy's Overview**: a warning under the deadline when one of your players may not play, opening your team.
- **An LCK lineup reveal**: the starters as a row of role-headed cards, as Card view.
- **LoL ranked**: Overall as a tier, Iron to Challenger; the shield is Flol's own shape.

The reference shots were of Craig's signed-in pages, so they are not in the repo.

## What binds

1. **Head:** the team's name and hangul; beside it Overall as a tier: the shield, the tier and its hangul, the rank and its move under them, the sponsor's badge. No points to the next tier here (spec/08 keeps that on Points).
2. **The object, a series live:** one panel. Its head on the blue band: the `Live` tag, the score, the game and series length, **Live ›**. Under it the stream, muted, 16:9; beside it a 296px column: `Streams` with `More ▾`, the picker's rows (the chosen one on `--fill` with a `--text` edge), then `Your players`: each of your players in this series with his points so far, in 32px rows.
3. **The object, nothing live:** `Week N lineup` on the blue band; the seven starters as Card view's cards (role strip, crest, C, `Not starting`, name, team, the week's opponents); under them one row, `Bench` and the two bench players in their order.
4. **Under the object, three panels in a row:** the week's series (Points' panel, titled with its week); Following (the latest feed items, each with its points and `Cheer / Jeer ›`, the latest cheer or jeer as its LED panel, **Following ›**); All managers (Most captained under the week it was set for; Most bought and Most sold under `Week N so far`).
5. **Side column, in order:** Deadline; the week; Leagues; the sponsor slot.
6. **Deadline panel:** the countdown as its key figure with the time after it; **Pick Team** (the page's one filled key) and **Transfers**; Free transfers; the played buff, when there is one; a row for each starter who may not play; `Next` and the three deadlines after this one.
7. **The week's panel:** titled with its week, **Points ›** in its band; the total and its tag (`Not final` or `Final`, and the buff's name when one is on); Average; Highest ›; then Star and Flop with points and effective ownership. With a week live they are the last finished week's, under a band naming it.
8. **Leagues:** each league's rank and move, Overall left out since the head shows it; **All leagues ›** in the band.
9. **A played buff:** before the deadline, a row in the Deadline panel and a tag by the lineup's title; Bench Boost puts the bench in the lineup as two more cards (`1. Mid`, `2. Jungle`) and drops the bench row. In the week it is on, a tag by the week's total. Not drawn: Double Captain (both Captains carry the C) and Coach Diff (`×3` on the coach's card).

## Controls

- **Live ›**: opens Live.
- **A stream's row**: plays that stream here and remembers the pick; **More ▾** opens the rest of the list.
- **Pick Team**, **Transfers**: open those pages.
- **A warning row**: opens Pick Team.
- **Points ›**, **Highest ›**: open Points for the week, yours and the top team's.
- **All leagues ›**, **Following ›**: open those pages.
- **Cheer / Jeer ›**: opens the picker (spec/14).

## Not drawn

- Two or more starters who may not play: one row each, stacked.
- Double Captain and Coach Diff.
- The tier's other states: Unranked, a division tier, Master or Grandmaster, Challenger.
- A phone picture.

## Placeholders

| What | Issue |
|---|---|
| Live points, in play and to play | #34 |
| Final points, Average and Highest | #33 |
| Free transfers | #20 |
| Leagues, ranks and moves | #38 |
| Overall tier, its cut-offs and shield | #108, #109 |
| Series and player stats | #36 |
| Streams list and picker | spec/12, no issue yet |
| Who may not start, the next deadlines and All managers' counts | #473 |
| Sponsor slots and badge | spec/13, no issue yet |
