# Transfers

Where a manager sells and buys players. Reached from **Transfers** in the top bar. Drawn at 1440 in the same frame as Points and Pick Team: the squad on the left, the bench under it, the player list on the right.

**Approved:** Craig, 13 Nov 2026. He asked for players who are too dear to be greyed but still listed ("we need to see those players"), then said "Yes save". Later that day he cut Form, asked for both of the week's series under each player and in Next, a toggle for what shows under a player, no explainer sentences, and the transfer buffs at the top as FPL's, the others on Pick Team. On 14 Nov he asked for fresh eyes on the whole page and less obvious explaining text; the redraw adds Undo, price arrows and −6 hits, and he said "yes save". Names, teams and numbers are a made-up LCK Cup Week 4, not roster data. No `plate.md` yet: this binds layout, content and order, not colour or type.

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
- **Show ▾**: what sits under each player: Fixtures (the default: one row, both of the week's opponents, as "vs T1, vs GEN"), Price or Owned.
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
