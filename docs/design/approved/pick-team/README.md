# Pick Team

Where a manager sets his starters, bench order, Carry and Vice-carry, and plays Bench Boost or Dual Carry. Reached from **Pick Team** in the top bar. Drawn at 1440 in the same frame as Points and Transfers: the squad on the left, the bench bar under it, the player card and widgets on the right.

**Approved:** Craig, 14 Nov 2026. A first picture was approved on 13 Nov ("We could do both", naming Rift view and Card view; PR #48, never merged). On 14 Nov it was redrawn in the frame of Points and Transfers with less explaining text; Craig put Save in a bar under the pitch, kept the tall photos in Card view, kept all 10 series and kept role icons alone, then said "Yes, save". Names, teams and numbers are a made-up LCK Cup Week 4 at the same moment as the Transfers picture, not roster data. Redrawn to [plate.md](../../plate.md) on 15 Nov 2026; this binds layout, content and order, and plate.md how it is drawn. The source is [docs/design/proposals/2026-11-14-pick-team/](../../proposals/2026-11-14-pick-team/) (`pick.html`, `brief.md`).

| File | Shows |
|---|---|
| `1440.png`, `pick.html` | Rift view, Faker tapped, no changes |
| `1440-cards.png`, `pick.html?v=cards` | Card view: the seven starters in one row as the broadcast lineup (Top, Jungle, Mid, Bot, Support, Flex, Coach), the bench bar under it |
| `1440-swap.png`, `pick.html?v=swap` | Rift view mid-swap: Siwoo (not starting Wed) going out, the bench players who fit outlined in the bench bar (both, as the Flex takes any role), Bench Boost on and unsaved |

## Borrowed

- **FPL's Pick Team**: the squad with the bench beneath, a tap on a player for his card and its buttons, Save under the pitch.
- **The LCK broadcast's lineup cards** for Card view.
- **DraftKings' LoL roster map**: Flex and Coach in your base.

## Controls

- **Rift view | Card view**: Rift on the first visit, then remembered (spec/12).
- **A player**: opens his card on the right: crest, team, price and last move, form, owned and season with ranks, last 3 series, and Make Carry (or ✓ Carry), Make Vice-carry, Full card ›. The coach's card has no Carry buttons (spec/01, spec/04). Those he can swap with are outlined and the rest dimmed; tap one and they swap (FPL's one-tap swap), tap him again to let go.
- **Bench bar**: one row under the pitch (and under the lineup in Card view): `Bench`, then each bench player as a compact tile (order, role icon, name, team, the two fixtures), with **⇅ Swap** between them, which swaps bench 1 and 2. Redrawn 15 Nov 2026 from the grey band of two shirts.
- **Card view**: one row of seven equal cards, Top, Jungle, Mid, Bot, Support, Flex ("plays Top"), Coach, each with role and icon, photo (the coach a crest), name, team, the two fixtures, form and price; C and V on the photo.
- **Buffs**: four boxes of one size and style in one row above the Rift, each its name, one line from spec/06 (Bench Boost: Your bench players score this week too; Dual Carry: Your Vice-carry scores ×1.5 too; Remake: Unlimited free transfers; your new squad stays; Limitless: One week, no budget or team cap; then your squad returns) and `1 left`. Bench Boost and Dual Carry show Play, then Cancel until the deadline; once one is chosen the others grey (one a week, spec/06). Remake and Limitless link to Transfers.
- **Bar under the pitch**: how many changes, Reset, the deadline and its countdown, Save team. Save is disabled with no changes; swaps, Carry, Vice-carry and buffs take effect only on Save (spec/12).

## Changed by Craig, 16 Nov 2026

From his look at the built page; these bind over the pictures above.

- Buffs sit in one row at the top of the page, above the Rift, not in the side column.
- Each buff's line says plainly what it does, from spec/06 (Controls, Buffs).
- One-tap swap, as FPL: tap a player and those he can swap with light up; tap one and they swap. No Swap with bench key.
- A role starter swaps with the Flex when the result is valid: the Flex holds any role, each role slot its own (Zeus and a Flex who plays Top).
- Role icons are bigger, everywhere (`roleBox`, `roleIcon`, `roleIconSmall` in the theme).
- The Rift keeps its shape at any width and the map is drawn in it, so nothing stretches, everywhere.
- With Dual Carry played the V is gold, as the C.
- The card's form history is the last 3 series, not weeks.
- A team crest in a player's card, never on the Rift's tiles or the bench (Craig, 16 Nov 2026).
- The Flex's tile carries a `FLEX` label over his shirt.
- Fixture lines give only the opponents: `v DK, NS`.
- The card drops its series rows: his tile already shows them, and the side lists the week's series.
- The bar gives only the count (`1 change`); the buff's own card says it is on and unsaved.
- Later that day: the Rift is square, 720 a side, centred in the main column, and the map redrawn for it: lanes, river, bases, towers and pits (`measure.rift`).
- Each starter in his place: top in top lane, jungle in the jungle, mid in mid lane, Support over Bot together in bot lane, Coach and Flex by the blue base.
- Tiles as FPL's: the shirt on a faint lighter card, C or V at its top right and a news flag `!` at its top left, a white name plate, then a dark band (fixtures, or points and series). No role icon on a tile: his place on the Rift says it; the Flex's and Coach's place is a label over the shirt (`FLEX`, `Coach 감독`), and nothing goes under a Flex's tile: no `Flex · plays Top`, no `Not starting` tag (his flag `!` stays at the shirt's corner, the words in his card). No team crests on the tiles.
- The bench shows the Rift's own tiles (shirt on its card, name plate, fixtures or points band), each under its order and role, `1. Mid`, as FPL's bench and its `1. DEF`; swapping works as before.

## Placeholders

| What | Issue |
|---|---|
| Squad shape, flex, coach, bench | #13 |
| Prices in 억 | #22 |
| Price moves | #23 |
| Carry and Vice-carry | #19 |
| Buffs | #25 |
| Auto-subs and bench order | #14 |
| Series, form, ownership | #36 |
| Player photos and team crests (Card view) | no issue; the rights are unsettled |
| Sponsor slots | spec/13 |
