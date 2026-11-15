# Coach card

The full card for the coach slot. It opens from **Full card ›** on the coach's short card, or from the coach's name anywhere. It is the [player card](../player-card/) with the coach's lines in place of a player's, and a Roster tab in place of Champions (spec/12, The coach card).

**Approved:** Craig, 14 Nov 2026, "save", after "coach card should be not much differetn from player really". It was drawn as a variant of the approved player card and went to Craig without the four-reviewer panel. The names, teams and numbers are a made-up LCK Cup, the same moment as the Pick Team and Points pictures (kkOma 10 so far in Week 3, form 9.0), not roster data. There is no `plate.md` yet, so this binds layout, content and order, not colour or type. The source is [docs/design/proposals/2026-11-14-coach-card/](../../proposals/2026-11-14-coach-card/).

| File | Shows |
|---|---|
| `1440.png`, `coach.html` | History, opened from Pick Team (Week 4, Tuesday, before the deadline) |
| `1440-week.png`, `coach.html?v=week` | This week, opened from Points (Week 3 Saturday, T1 v DK game 2 live) |
| `1440-roster.png`, `coach.html?v=roster` | Roster |

## What differs from the player card

- **Header**: a Coach · team tag, a team crest in place of the portrait, and the head coach's name, hangul and legal name. The coach slot is the team; the head coach is its face (spec/01).
- **Buttons**: from Pick Team, Transfer out and Compare › only. There is no Carry, Vice-carry or swap, because a coach is never Carry and has no bench (spec/01, spec/04). From Points, Compare › only.
- **This week**: each game with W or L, the coach lines it scored and its points, with the best 2 counting. Then the series line: +3 won, −1 lost. While a series is live that line reads "+3 if won, −1 if lost".
- **History**: no K/D/A. Past seasons are the team's, scored by Flol.
- **Roster**: the team's players with role, price, season points and owned. A player in your team is marked.
- **Season panel**: First tower, Most drakes, Most barons, Most elders, Quick win, Series won and Series lost (spec/05). Per game is blank on the series rows.

Header, series strip, Fixtures and the news bar are as on the player card.

## Placeholders

| What | Issue |
|---|---|
| Coach lines, series, form, ownership | #36 |
| Prices in 억 | #22 |
| Price moves | #23 |
| Transfers in and out | #20 |
| Team crest | no issue; the rights are unsettled |
| Past seasons before LCK 2025 | no issue yet; as many years as the data allows |
