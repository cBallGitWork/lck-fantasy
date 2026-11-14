# Player card

The full player card. It opens from **Full card ›** on a page's short card, or from a player's name anywhere (Pick Team, Transfers, Points, Stats, a league's team). Drawn at 1440 as a sheet over the page that opened it. The short card in Pick Team's right column is approved in [pick-team/](../pick-team/).

**Approved:** Craig, 14 Nov 2026, "save". Before that he looked at UCL Fantasy and an FPL companion app, called the first drawing "a sea of info", asked for UI and UX designers twice, and asked for it grouped by series, not by week, with the price once per week. He kept the big number on Season on every tab and the news line as a black bar ("1 ok season 2 ok"). The names, teams and numbers are a made-up LCK Cup, the same moment as the Pick Team and Points pictures, not roster data. There is no `plate.md` yet, so this binds layout, content and order, not colour or type. The source is [docs/design/proposals/2026-11-14-player-card/](../../proposals/2026-11-14-player-card/) (`card.html`, `brief.md`).

| File | Shows |
|---|---|
| `1440.png`, `card.html` | History, opened from Pick Team (Week 4, Tuesday, before the deadline) |
| `1440-week.png`, `card.html?v=week` | This week, opened from Points (Week 3 Saturday, T1 v DK game 2 live) |
| `1440-fixtures.png`, `card.html?v=fixtures` | Fixtures, with a news line |
| `1440-champs.png`, `card.html?v=champs` | Champions |

## Borrowed

- **UCL Fantasy's card**: the actions under the name. Its This season is a list of each line with count and points.
- **FPL companion app's card**: past form beside the next fixtures, and History as a table.
- **The LCK broadcast's lower-third**: role and team chip, name with hangul.

## Layout

- **Header**: portrait, role and team, name and hangul, legal name. On the right is one big number, the season's points with rank. It shows Season on every tab.
- **Meta line**: price and last move, form with rank, owned with rank, and the week's transfers in and out.
- **Series strip**: the last 3 series with his points (● while live), then the next 3, the first in black.
- **Tabs**:
  - This week: each series with its points in its header, each game with champion, result, K/D/A and points. A game that doesn't count has its points struck through. The week's total shows with the Carry ×1.5.
  - Fixtures: the next series, each week's number once, your time and KST.
  - History: each series with games, K/D/A and points. Each week's price and total show once, on the week's first row. Then past LCK seasons scored by Flol.
  - Champions: each champion, sorted by games, with W–L and average points.
- **Season panel**, on every tab: each scoring line's total, per game and points.

## Controls

- **From Pick Team**: ✓ Carry (or Make Carry), Make Vice-carry, Swap with bench, Transfer out, Compare ›.
- **From Points**: Compare › only.
- **Tabs**: switch the left column. The header, strip and Season panel stay.
- **✕**: closes the card back to the page. It sits inside the news bar when there is one.

## Placeholders

| What | Issue |
|---|---|
| Series, games, lines, form, ownership | #36 |
| Prices in 억 | #22 |
| Price moves | #23 |
| Transfers in and out | #20 |
| Carry | #19 |
| News line | no issue yet; written by an admin |
| Past seasons before LCK 2025 | no issue yet; as many years as the data allows |
| Portrait | no issue; the rights are unsettled |
| Compare | not drawn |
| The coach card (Roster tab) | not drawn |
