# Patch update

The new prices for a gameweek, set once the deadline before it passes (spec/12, Patch update). It is reached from **Patch update ›** on [Stats](../stats/), and from Transfers, whose link is placed at build.

**Approved:** Craig, 15 Nov 2026: "just shows the new prices, thats it really", then cut the footer line ("people arent idiots"), asked for "a previous and new price", the title "new prices for gameweek 4", no Gameweek 5 line, and "Save it". The data is dummy ("use dummy data"); prices agree with the [Stats](../stats/) picture where it lists the player. There is no `plate.md` yet, so this binds layout, content and order, not colour or type, except the rise in red and the fall in blue, set for every screen. The source is `patch.html`; its brief is [docs/design/proposals/2026-11-16-price-changes/](../../proposals/2026-11-16-price-changes/).

| File | Shows |
|---|---|
| `1440.png`, `patch.html` | Week 4 prices, seen in Week 4 |

## Borrowed

- **fpl.page's price history**: each week split into rises and falls.
- **Korean markets**: a rise in red, a fall in blue.
- **LoL patch notes**: the name, 패치 노트.

## Controls

- **‹ ›**: the week before or after; no › past the latest prices (drawn in `--line`).
- **A name**: opens the player or coach card.
- **How prices move ›**: the Help page's formula (spec/02).

## Layout

- **Head**: Patch update, ‹ Week 4 prices ›, when they were set (your time, then KST), and **How prices move ›**.
- **Rises** (left) and **Falls** (right), each half the width: player, team and role; Was; ▲ or ▼ in its own column; Now; Owned. Coaches are listed by the same rule. A dot after the name marks your own players.
- Before the first move, the lists read "No moves yet".

## Placeholders

| What | Issue |
|---|---|
| Prices and their moves | #22, #23 |
| Owned | #36 |
