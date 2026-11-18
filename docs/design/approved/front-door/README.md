# Front door

The signed-out pick-a-team page. A new visitor lands here straight, with no sign-up wall (spec/09, Picking as a guest). Drawn at 1440 in the Transfers frame (Craig, 16 Nov 2026: FPL's squad selection is its Transfers page): the squad on the left with the bench bar under it, the player list on the right.

**Approved:** Craig, 17 Nov 2026, "Yes, save". The first picture went to a panel of four reviewers on 16 Nov 2026, and Craig answered its five calls that night: the guest's top bar shows only Stats and LCK; Reset sits beside Auto-fill from the first pick; Flex on the Rift plus a Bench of 1 and 2, as Pick Team; a team-cap figure by Picked and Bank ("2 of 2 from T1"); and the link is "Log in". Names, teams and numbers are a made-up Split 1 Week 4, as the Transfers picture, not roster data. This binds layout, content and order, and [plate.md](../../plate.md) how it is drawn.

| File | Shows |
|---|---|
| `1440.png`, `front.html` | Empty: 0 of 9, ₩100.0m, every slot empty, Save team off with `9 to pick` |
| `1440-part.png`, `front-part.html` | Four picked (Zeus, Faker, Ruler, kkOma): Reset appears, the team cap reads `T1 2 / 2` |
| `1440-full.png`, `front-full.html` | Full after Auto-fill: ₩3.5m left, Auto-fill off, Save team on |

## Borrowed

- **FPL's squad selection** (its Transfers page): the squad beside a player list with role, search, sort and team filters; Auto-fill and Reset above the pitch.
- **Flol's Pick Team** for the squad's shape: Top, Jungle, Mid, Bot, Support, Flex and Coach on the Rift, then Bench 1 and 2.
- **UCL Fantasy's Auto-fill** (spec/09).

## Controls

- **Top bar**: `Flol`, Stats, LCK; at the right `presented by [Sponsor]` and `Log in ›` for a returning manager (spec/09).
- **Head**: the deadline, then Picked (`4 / 9`), Bank and Team cap (`T1 2 / 2`: the most from one team, against the cap; the coach counts, spec/01).
- **An empty slot**: dashed, its role on the name plate (`Any role` for the Flex and the bench) and `+`; it filters the list to that role.
- **A picked player**: his price over the shirt, `×` to remove him; the Flex and Coach carry their label over the shirt.
- **A row's +**: picks that player; a refused pick says why in a short message, as Transfers (`Team full: 2 from T1`).
- **Reset**: shown from the first pick, beside Auto-fill; empties the squad.
- **Auto-fill**: fills the empty slots with a valid squad under budget (spec/09); off once all 9 are picked.
- **Bottom bar**: how many are left (`5 to pick`, the reason Save is off), then **Save team**, which opens the approved sign-up sheet ([settings](../settings/)).

## Placeholders

| What | Issue |
|---|---|
| Guest squad, Auto-fill, sign-up | #42 |
| Squad shape, flex, coach, bench, team cap | #13 |
| Prices in 억 and the budget | #22 |
| Players, ownership, next series | #36 |
| Season, week and deadline | #252 |
| Sponsor slot | spec/13 |
