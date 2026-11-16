# Transfers

Where a manager sells and buys players. Reached from **Transfers** in the top bar. Drawn at 1440 in the same frame as Points and Pick Team: the squad on the left, the bench bar under it (one row: order, role icon, name, team, the two fixtures; redrawn 15 Nov 2026), the player list on the right.

**Approved:** Craig, 13 Nov 2026. He asked for players who are too dear to be greyed but still listed ("we need to see those players"), then said "Yes save". Later that day he cut Form, asked for both of the week's series under each player and in Next, a toggle for what shows under a player, no explainer sentences, and the transfer buffs at the top as FPL's, the others on Pick Team. On 14 Nov he asked for fresh eyes on the whole page and less obvious explaining text; the redraw adds Undo, price arrows and −6 hits, and he said "yes save". Names, teams and numbers are a made-up LCK Cup Week 4, not roster data. Redrawn to [plate.md](../../plate.md) on 15 Nov 2026; this binds layout, content and order, and plate.md how it is drawn.

## Changed by Craig, 16 Nov 2026

He looked at the built page and asked for these; they overrule the pictures where they differ.

1. No price ▲/▼ arrows on this page.
2. Rift view has no bench: all nine stand on the Rift by role, the coach in his own spot, several of one role side by side in their lane, as FPL's Transfers pitch stands all fifteen.
3. Each Rift tile shows the player's price under his name, as FPL's Transfers pitch; the Show ▾ menu is gone.
4. No team crests on the tiles.
5. Card view is replaced by **List view** (Rift view | List view): the nine grouped by role, each row shirt, name, team, last week's points, price, form, total, Next (the next opponent alone, "v DK") and × to sell (↺ puts him back).
6. Several transfers in one go, as FPL: remove and add several, then one confirm. Each add or refusal says so in a short message at the foot of the page (`Kingen added`, `Team full: 2 from GEN`, `No Bot left`); no row is greyed. Over the budget is allowed while choosing: the bank goes red below zero and Review and confirm is off, as FPL.
7. The confirm sheet stands out (a heavy ink frame) and has one row per transfer, out → in with each price, then cost, bank and free transfers used.
8. The head shows free transfers, cost and bank, as FPL's.
9. Any role for any role: the squad keeps at least one of each role; past that any player can be sold for any player. A buy that would leave a role empty is refused with why. On confirm the squad is arranged by role, a starter keeping his place.
10. Next in the player list drops the day: "v DK", not "Wed v DK".
11. Later that day, Rift view: the Rift is square, 720 a side, centred in the main column, the map redrawn for it. The nine stand by role in rows along their lanes: tops along top lane, jungle and mid in rows in the jungle and on mid lane, Support over Bot along bot lane, the coach by the blue base; two or three of a role stand side by side in their row.
12. Tiles as FPL's Transfers pitch: the price in a dark chip over the shirt (overrules 3), `×` to sell at the card's top left, the shirt on a faint card, a white name plate, then the next opponent (`v DK`) in a dark band. No role icon and no crest.

| File | Shows |
|---|---|
| `1440.png`, `transfers.html` | Rift view mid-transfer, Tuesday night: Siwoo sold, Kingen in the Flex at −6; the week's two confirms under the list, the latest with Undo |
| `1440-confirm.png`, `confirm.html` | The confirm sheet: out, in, cost, bank |

## Borrowed

- **FPL's Transfers**: the squad beside a player list with role, search, sort and team filters, then a confirm step. A player sells at his full current price (spec/02).
- **FPL's squad toggle**: one switch for what sits under every player.
- **Greyed but listed**, not refused at confirm: a player Flol can't buy stays in the list with why (over the budget, or his team is full), sorted last.
- Research on other games: [docs/research/transfers-page-references.md](../../../research/transfers-page-references.md).

## Controls

- **Rift view | Card view**: the same choice as Pick Team. Not in the spec yet; in [to-grill](../../../to-grill.md).
- **Show ▾**: what sits under each player: Fixtures (the default: one row, both of the week's opponents, as "v T1 · v GEN"), Price or Owned.
- **A player on the squad**: sells him; the list filters to his slot (his role, or any role for the Flex) and what the bank allows. Any of the nine, coach included, can be sold.
- **A row's +**: buys that player into the empty slot. A greyed row opens his card but can't be bought.
- **Top strip**: free transfers left, the pending hit (−6 each), the bank.
- **Price ▲/▼**: the player's last price move, in its own column; nothing before a first move. The card shows the amount (spec/12).
- **Confirmed · Week 4**: each confirm this week, newest first, with what it used (free or −6). Only the latest has **Undo**, until the deadline (spec/03). Undo also clears any unconfirmed changes. A confirm under Remake or Limitless is listed with no Undo.
- **Bottom bar**: the transfers so far, Reset, and Review and confirm.
- **Confirm sheet**: what changes, the cost and the bank. Back or Confirm, with the deadline.
- **Remake and Limitless**: the buff names alone, no "Play"; the transfer buffs (FPL's chips; renamed 14 Nov 2026, the pictures too), at the top beside the bank, as FPL's Wildcard and Free Hit. Bench Boost and Dual Carry stay on Pick Team.

## Placeholders

| What | Issue |
|---|---|
| Free transfers, bank, hits | #20 |
| Confirms and Undo | #96 |
| Price moves | #23 |
| Prices in 억 and the budget | #22 |
| Squad shape, flex, coach, team cap | #13 |
| Remake and Limitless | #25 |
| Ownership, next series | #36 |
| Sponsor slot | spec/13 |

## Cut on 14 Nov

"Play" on the buffs; the map's lane, Baron and Dragon labels; 벤치 beside Bench; "Pick a replacement for" (now "Replacing Siwoo"). Kept as new to an FPL manager: "Flex · plays Top", "Coach 감독", why a greyed player can't be bought.
