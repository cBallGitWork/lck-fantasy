# Pick Team

Where a manager sets his starters, bench order, Carry and Vice-carry, and plays Bench Boost or Dual Carry. Reached from **Pick Team** in the top bar. Drawn at 1440 in the same frame as Points (`../points/`): the squad on the left, the bench under it, widgets on the right.

**Approved:** Craig, 13 Nov 2026. He kept both layouts as views ("We could do both"), named them Rift view and Card view, and said each manager's choice is saved; then "Yes" to saving them. Names, teams and numbers are a made-up LCK Cup Week 4, not roster data. No `plate.md` yet: this binds layout, content and order, not colour or type.

| File | Shows |
|---|---|
| `1440.png`, `rift.html` | Rift view: the squad on the map, Coach and Flex together in your base |
| `1440-cards.png`, `cards.html` | Card view: broadcast-style lineup cards, Flex, Coach and the bench in a second row |
| `1440-swap.png`, `swap.html` | Rift view mid-swap: Siwoo (flagged) going out, the bench players who fit marked, Bench Boost on |

## Borrowed

- **FPL's Pick Team**: the squad with the bench beneath, a click on a player for his card and its buttons, Save under a deadline.
- **The LCK broadcast's lineup cards** for Card view; Riot's old Fantasy LCS showed players the same way.
- **DraftKings' LoL roster map** puts its Flex and Team slots in the base, as Flol puts the Flex and the Coach.

## Controls

- **Rift view | Card view**: the manager's choice is remembered (spec/12).
- **A player**: opens his card on the right. It shows form, ownership and season points with their ranks, his next series, and the buttons Make Carry or "✓ Your Carry", Make Vice-carry, Swap with bench and Full card ›. The coach's card has no Carry or swap buttons (spec/01, spec/04).
- **Swap with bench**: the bench players who fit (own role or flex, spec/01) are marked and the rest greyed; tap one to swap in, or Cancel swap.
- **⇅ Swap order**: swaps bench 1 and 2.
- **Boosts**: Bench Boost and Dual Carry show Play, then Cancel until the deadline; one a week, so the other greys with why. Remake and Limitless link to Transfers (spec/06, spec/12).
- **Save team / Reset**: at the top, with what changed. Disabled with no changes.

## Placeholders

| What | Issue |
|---|---|
| Squad shape, flex, coach, bench | #13 |
| Prices in 억 | #22 |
| Carry and Vice-carry | #19 |
| Boosts (chips) | #25 |
| Auto-subs and bench order | #14 |
| Series, form, ownership | #36 |
| Player photos and team crests (Card view) | no issue; the rights are unsettled |
| Sponsor slots | spec/13 |

## Still open

- Swaps, Carry, Vice-carry and boosts are drawn as saving together on Save team. Craig hasn't settled that yet: on Save, or the moment they are tapped.
- Panel suggestions, not Craig's wants; none is the product: a ready check before the deadline, and a count of how many of your players are in each series. Lock in, a trade-style swap and a bot-lane duo badge were dropped; a team-cap counter belongs on Transfers.
