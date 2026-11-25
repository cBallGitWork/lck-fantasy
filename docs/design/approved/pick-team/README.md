# Pick Team

Where a manager sets his starters, bench order and Captain, and plays a buff, before the week's deadline. Reached from **Pick Team** in the top bar.

**Approved:** Craig, 19 Nov 2026, as the pick of the look trial ([foundations.md](../../foundations.md), The trial fills them). Six pictures were drawn blind, lettered A to F; two full panels put F, Arena, first and the ringer last; Craig picked "f", then asked "so build this?". The trial, every round's findings and his calls are in [proposals/2026-11-19-trial/](../../proposals/2026-11-19-trial/panel-findings.md). Names, teams and numbers are a made-up Split 1 Week 4.

**Card view and mid-swap:** Craig, 25 Nov 2026, redrawn in this look from their 14 Nov pictures. Asked whether Card view's bench should be the starters' cards or the Rift's shirt tiles, he said "Same cards"; shown both pictures, "Yes, save both". `pick.html` is the old look's mock-up, kept because other screens' mock-ups draw it behind their overlays.

Arena is the first picture in the new look: the LCK's navy as the ground, IBM Plex for Latin, Hangul and figures, gold where you act. It binds this screen's layout, content and order now. The look's colours and type are in [plate.md](../../plate.md) and the token layers (`src/theme/`).

| File | Shows |
|---|---|
| `1440.png`, `arena.html` | Rift view at 1440, the whole page: Faker tapped, no changes, no buff played |
| `390.png`, `arena.html` | The same on a phone, the whole page |
| `1440-cards.png`, `arena.html?v=cards` | Card view at 1440: Faker tapped, Bdd the one he can swap with, no changes |
| `1440-swap.png`, `arena.html?s=swap` | Rift view mid-swap: Siwoo, a Top in the Flex, tapped; Zeus and both bench players can take his place; Bench Boost played and not yet saved, so `1 change` and a live Reset and Save |

`arena.html` draws from `data.js` through `render.js`, `base.css` and `map.js` beside it, and the kits and crests in `data/lck/`. Shoot it with `proposals/2026-11-19-trial/shoot.mjs`.

## Borrowed

- **FPL's Pick Team**: the squad on the pitch, the deadline over it, a tap on a player for his card, chips with a Play key, Save by the bench.
- **Summoner's Rift itself**: the map is drawn from the game's own minimap ([references/rift/](../../references/rift/README.md)), the same in every look and league (Craig, 19 Nov 2026).
- **The benchmark**: how eight fantasy games draw their team page ([research](../../../research/fantasy-team-pages-look.md)).

## Controls

- **Title line**: Pick Team, its hangul, the week, then the deadline in the manager's own time, am/pm, and the countdown. No KST anywhere (Craig, 19 Nov 2026).
- **Rift view | Card view**: on the title's line; Rift on the first visit, then remembered (spec/12).
- **The Rift**: square, as big as the first screen allows, at the main column's left. Top level with Flex, Jungle and Mid in their places, Coach under Top, Bot beside Support under Flex. A tile is its role strip, the team's kit, team code and name, then the week's opponents. The Captain's gold C sits past the tile's corner. A yellow warning triangle marks a player with news.
- **A player**: a tap opens his card. Those he can swap with are outlined and the rest dimmed; tap one and they swap, tap him again to let go (FPL's one-tap swap).
- **Buffs**: in the column beside the Rift, each its gold icon, name, state (`Available`, `On this week`, `Unavailable`, `Played Week n`) and a key: `Play` when available, `Cancel` when on, none otherwise. What it does is its hover. Never a count.
- **Bench**: under the buffs, on the Rift's dark green; the Rift's own tiles, each under its order and role (`1. Mid`).
- **Card view**: the seven starters in one row, Top to Coach. A card is its role strip, the portrait (the team's crest until photos exist, spec/13), name, team (a Flex's role after it), the week's opponents, then Form and price. The Captain's gold C sits in the portrait's corner; `Not starting` is a tag at its foot. Under the row: the bench as a panel of the same two cards at a starter's width, each strip its order and role (`1. Mid`), with the Buffs panel beside it, level at top and foot; then the changes, Reset and Save as one bar.
- **Mid-swap**: the tapped player has a solid outline, those he can swap with a dashed one, and the rest are dimmed, in both views. Two can swap when each fits the other's slot (spec/01). A change not yet saved counts in the bar (`1 change`), Reset comes alive and Save team turns gold. `Make Captain` shows only on a starter who isn't the Captain; a bench player and the coach get no key.
- **Save**: under the bench: how many changes, Reset, Save team. Save is off with no changes. The three boxes together run the Rift's height.
- **The card**: on the right: crest, name, team, role, price and last move (a rise in red, a fall in blue); form, owned and season, each with its rank among his role, the group said once (`Among 10 mids`); last 3 series; `✓ Captain` as a state on the Captain, `Make Captain` on anyone else; `Full card ›`.
- **This week's series**: under the card, by day, in the manager's own time.
- **On a phone**: buffs are one row of three tiles over the Rift; the whole Rift shows on the first screen; the bench sits below it; the changes, Reset and Save stay stuck to the foot; the tapped player's card sits in the page under the bench.

## Placeholders

| What | Issue |
|---|---|
| Squad shape, flex, coach, bench | #13 |
| Prices | #22 |
| Price moves | #23 |
| Captain | #19 |
| Buffs | #25 |
| Auto-subs and bench order | #14 |
| Series, form, ownership | #36 |
| Local time in am/pm in the app | #445 |
| Sponsor slots | spec/13 |
