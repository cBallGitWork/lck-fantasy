# Stats

Every stat Flol holds, players and coaches, in one sortable list (spec/12, Stats). It is reached from **Stats** in the top bar, which FPL also has. A name opens the [player card](../player-card/) or the [coach card](../coach-card/).

**Approved:** Craig, 16 Nov 2026, "looks good", then "save". Along the way he set every line as a count, with the toggle dividing them by games ("we have a toggle for count/per game count"), and took the panel's calls. The names, teams and numbers are a made-up LCK Cup at the Pick Team picture's moment (Week 4, Tuesday, Weeks 1 to 3 final), not roster data. Games and series match the [LCK hub](../lck-hub/)'s standings, and form is points ÷ 3. There is no `plate.md` yet, so this binds layout, content and order, not colour or type. The only exception is the price arrows: a rise in red and a fall in blue, set for every screen. The source is [docs/design/proposals/2026-11-16-stats/](../../proposals/2026-11-16-stats/) (`stats.html`, `brief.md`, `references.md`).

| File | Shows |
|---|---|
| `1440.png`, `stats.html` | Players, season totals, sorted by points |
| `1440-pergame.png`, `stats.html?v=pergame` | Players, per game |
| `1440-coaches.png`, `stats.html?v=coaches` | Coaches |

## Borrowed

- **FPL's Statistics**: one list with filters for role, team and max price, a search, and price, form, owned and points on every row.
- **gol.gg's player table**: a role filter first, with every stat as its own column. GD@15, solo kills and first blood are words LoL fans already use.

## Layout

- **Head**: Stats 통계, with **Patch update ›** at the right.
- **Tabs**: Players | Coaches.
- **Controls**, one row: role (players only), Team, Max price, Span (Season, or one gameweek), Totals | Per game, and a search.
- **Players**: rank, role, name and team, price and its last move (▲0.5 red, ▼0.5 blue), form, owned, Pts, then Games and the lines: K, D, A, GD@15, Solo kills, First blood, Deathless, Quadra+, Obj. steals. Your own players carry a dot after the team. The page holds 20 rows, with pages beneath. Academy players come after everyone with games.
- **Coaches**: the same frame, then Games, Series (won–lost), First tower, Most drakes, Most barons, Most elders and Quick wins.
- **Per game**: every line, and Pts, divided by games. The list re-sorts.

## Controls

- **A column header**: sorts by that column. The active one is marked ▼.
- **Role, Team, Max price, Span**: filter the list.
- **Totals | Per game**: switches the figures.
- **A name**: opens the player or coach card.
- **Patch update ›**: opens Patch update.

## Placeholders

| What | Issue |
|---|---|
| Stats, games, series | #36 |
| Prices in 억 | #22 |
| Price moves | #23 |
| Owned % and your squad | #36, #20 |
| The Stats page itself | no issue yet |
