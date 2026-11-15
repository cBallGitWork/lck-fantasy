# Compare

Compare: two players side by side (spec/12, The player card, Compare). It opens from **Compare ›** on the player card or the coach card, as a sheet over the card. It is part of the beta.

**Approved:** Craig, 16 Nov 2026, "Save". Before that he answered the panel's calls ("As recommended") and asked to "get rid of the fluff lines". The names and numbers match the player card, coach card, Stats and Transfers pictures: LCK Cup Week 4, Tuesday, Weeks 1 to 3 final. There is no `plate.md` yet, so this picture binds layout, content and order, not colour or type. The source is [docs/design/proposals/2026-11-16-compare/](../../proposals/2026-11-16-compare/) (`brief.md`, `panel.md`).

| File | Shows |
|---|---|
| `1440.png`, `compare.html` | Faker v Chovy, opened from Faker's card on Pick Team |
| `1440-pick.png`, `compare.html?v=pick` | The second player not picked yet: a search, mids first |
| `1440-coaches.png`, `compare.html?v=coaches` | kkOma v Ryu, with the coach lines |

## Borrowed

- **The broadcast's head-to-head**: the two players face each other, with each line's name in a centre column between their numbers.
- **The player card**: its lower-third, its series strip and its Season panel's lines.
- **FPL community compare tools**: one table, a row per stat.

## Layout

- **Header**: each player's portrait, role and team tag, and name with its Hangul, facing each other across a "v". Change › sits under the second player.
- **Top table**: Season in 28 mono with its rank ("2nd of 10 mids"), then Form, Price, Owned, Last 3 (points and opponent) and Next 3 (the first in ink).
- **Lines**: each scoring line with total, per game and points on both sides. The two sides mirror each other, so each side's points sit next to the line's name. Coaches show the coach lines and series won and lost, with no per-game figure on the series rows.
- **Marks**: the higher of Season, Form and each line's points is bold. Price and Owned are never marked, and there is no overall verdict.

## Controls

- **Change ›**: reopens the search for the second player.
- **The search**: his role is listed first, then All mids · Other roles ›. A coach is listed only against a coach.
- **✕**: closes back to the card.

## Placeholders

| What | Issue |
|---|---|
| Lines, form, ownership, series | #36 |
| Prices in 억, price moves | #22, #23 |
| Portraits | no issue; the rights are unsettled |
