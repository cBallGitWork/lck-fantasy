# Transfers

Where a manager sells and buys players. Reached from **Transfers** in the top bar. Drawn at 1440 in Pick Team's look ([plate.md](../../plate.md); the shared styles are `../pick-team/look.css`): the Rift at the main column's left, a column of panels beside it, the tapped player's card under both, the player list in the side column.

**Approved:** Craig, 26 Nov 2026: "Yes, save it". The redraw of the 13 to 16 Nov pictures in the new look. He said it lacked colour beside FPL and UCL Fantasy, and picked the colour round's merged recipe ("Yes, use it"); asked for even, aligned columns in the list and both of the week's opponents in Next; had the review panel rule on the open layout calls; picked the player's card for the gap under the Rift over the week's series; then asked for the opponent on each of the last 3 series and the scoring stats in Form's place. Names, teams and numbers are a made-up Split 1 Week 4, not roster data. This binds layout, content and order; plate.md how it is drawn.

| File | Shows |
|---|---|
| `1440.png`, `transfers.html` | Rift view mid-transfer: Siwoo sold, Kingen bought at −6, his card under the Rift; the week's two confirms, the latest with Undo |
| `1440-sold.png`, `transfers.html?s=sold` | Siwoo just sold: his slot empty, the list on Tops, PerfecT tapped and his card with `+ Buy`, a refused buy said at the list's top |
| `1440-confirm.png`, `transfers.html?s=confirm` | The confirm sheet: out, in, cost, bank |
| `1440-list.png`, `transfers.html?v=list` | List view: the nine as a table in the Rift's place |

Also drawn, not shot: `?s=none` (before any sale) and `?s=over` (Viper bought over the budget). `render.js` draws every state from Pick Team's made-up week (`../pick-team/data.js`).

## What binds

1. **Rift view** (Craig, 16 Nov 2026): no bench; all nine stand on the Rift by role under the role's name, said once, two or three of a role side by side, the coach by the blue base.
2. **A tile**, as FPL's Transfers pitch: a dark strip over the shirt with `×` to sell at its left and the price; the shirt; a white name plate with the team; then both of the week's opponents (`v DK, NS`; Craig, 26 Nov 2026, overruling the next opponent alone). No role icon, no crest, no kit-colour strip (the panel, 26 Nov 2026).
3. **A sold player's slot** is dashed, with `+` and `↺ Siwoo` to put him back (spec/12).
4. **Your transfers**, a panel beside the Rift: Free transfers, Cost and Bank, the draft's rows (out → in with each price and its −6), Reset, and Review and confirm ›, the page's one gold key (Craig, 26 Nov 2026, overruling the figures in the head). Why the key is off is said beside it: `No changes`, `1 player to buy`, `Over budget`.
5. **Confirmed · Week 4**, a panel under it: each confirm this week, newest first, with when and what it cost (`−6` or `No cost`). Only the latest has Undo (spec/03).
6. **The player's card**, under the Rift and its panels (Craig, 26 Nov 2026, over the week's series the panel tried), in the card family Points shares (the card round, 27 Nov 2026; `../points/README.md`). Head: the panels' blue band on one line, read as a tile: crest, the role in its dark strip, the team's bar and code, the name, his price; season points and their rank among the role at the right. Then a ruled strip of season figures, the rank under where there is one: Owned, Gold lead at 15, Solo kills, First blood, Kills, Deaths and Assists per game, and no Form. Then Last 3 and Next 3, each series a crest, a code and its points or its day; Full card ›, and `× Sell` for a player of yours or `+ Buy` for one tapped in the list. Before any tap it shows the player just sold. The tapped row or tile is marked. In List view it sits under the table.
7. **The Rift, its panels and the card stay on screen** while the list scrolls (the panel, all four, 26 Nov 2026): real data is ten or more players a role.
8. **The player list**, a panel in the side column, 424 wide: what the last `+` did at its top, where it was pressed (Craig, 26 Nov 2026, overruling the foot of the page: `Kingen added`, `Max 2 from GEN`, `Sell a player first`); role tabs (All roles, the five roles, Coach); Find a player, Sort and Team; then rows grouped by role: name, team bar and code, Price, Pts, Owned, Next, `+`. Fixed column widths with even gaps; figures right-aligned under right-aligned heads, words left (Craig, 26 Nov 2026). Its title is `Players`, or `Replacing Siwoo` once he is sold.
9. **The list opens on the sold player's role** once someone is sold, and on All roles before (the panel, all four, 26 Nov 2026). No row is greyed; your own players are left out.
10. **No price ▲/▼ arrows** on this page (Craig, 16 and 26 Nov 2026).
11. **List view** (Rift view | List view; Craig, 16 Nov 2026): the nine grouped by role, each row shirt, name, team, last week's points, price, form, total, Next and `×` to sell.
12. **Several transfers in one go**, as FPL: sell and buy several, then one confirm. Over the budget is allowed while choosing: the bank chip turns red with its − and Review and confirm is off.
13. **The confirm sheet** stands off the page in a heavy frame: one row a transfer, out → in with each price, then Free transfers used, Cost and Bank, the deadline, Back and Confirm.
14. **Any role for any role** (spec/03): the squad keeps at least one of each role; a buy that would leave a role empty is refused with why.
15. **Colour** (Craig, 26 Nov 2026; plate.md, Colour): panel titles on the brighter blue band; green on the bank chip, `+` and the bought player's outline; red on the cost and over-budget chips and `×`; a 6px team bar in the lists.

## Borrowed

- **FPL's Transfers**: the squad beside a player list with role, search, sort and team filters; `×` and the price on each shirt; every row buyable and a refusal said in a short message; then a confirm step.
- **UCL Fantasy**: more colour on what a transfer changes.
- Research on other games: [docs/research/transfers-page-references.md](../../../research/transfers-page-references.md).

## Controls

- **Rift view | List view**: the nine on the Rift, or as a table.
- **A tile's ×, a row's ×, the card's × Sell**: sells him; his slot empties and the list opens on his role.
- **↺ on an empty slot**: puts him back.
- **A row in the list**: shows his card under the Rift. **Its +, the card's + Buy**: buys him; a refused buy says why at the list's top.
- **Full card ›**: opens the whole player card (spec/12).
- **Reset**: clears the unconfirmed changes. **Review and confirm ›**: opens the confirm sheet.
- **Undo**: undoes the latest confirm, until the deadline (spec/03); it also clears unconfirmed changes.
- **Role tabs, Find a player, Sort, Team**: narrow and order the list.
- **Back, Confirm**: on the sheet.

## Placeholders

| What | Issue |
|---|---|
| Free transfers, bank, hits | #20 |
| Confirms and Undo | #96 |
| Prices and the budget | #22 |
| Squad shape, coach, team cap | #13 |
| Ownership, next series, the card's season lines | #36 |
| Sponsor slot | spec/13 |

## For the build

Two of the picture's words differ from the built screen's and replace them (the Broadcast voice, 26 Nov 2026): `1 player to buy` for `Fill every slot`, and `Sell a player first` for `Squad's full. Sell a player first`.
