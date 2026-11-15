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
- **A player**: opens his card on the right: price and last move, form, owned and season with ranks, last 3 weeks, this week's series, and Make Carry (or ✓ Carry), Make Vice-carry, Swap with bench, Full card ›. The coach's card has no Carry or swap buttons (spec/01, spec/04).
- **Swap with bench**: the bench players who fit (own role, or any role for the Flex, spec/01) are outlined and the rest dimmed; tap one to swap in, or Cancel swap.
- **Bench bar**: one row under the pitch (and under the lineup in Card view): `Bench`, then each bench player as a compact tile (order, role icon, name, team, the two fixtures), with **⇅ Swap** between them, which swaps bench 1 and 2. Redrawn 15 Nov 2026 from the grey band of two shirts.
- **Card view**: one row of seven equal cards, Top, Jungle, Mid, Bot, Support, Flex ("plays Top"), Coach, each with role and icon, photo (the coach a crest), name, team, the two fixtures, form and price; C and V on the photo.
- **Buffs**: four boxes of one size and style, each its name, one line from spec/06 (Bench Boost: Your bench scores too; Dual Carry: Vice-carry ×1.5 too; Remake: Unlimited transfers, kept; Limitless: One week, no budget or team cap) and `1 left`. Bench Boost and Dual Carry show Play, then Cancel until the deadline; once one is chosen the others grey (one a week, spec/06). Remake and Limitless link to Transfers.
- **Bar under the pitch**: what changed, Reset, the deadline and its countdown, Save team. Save is disabled with no changes; swaps, Carry, Vice-carry and buffs take effect only on Save (spec/12).

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
