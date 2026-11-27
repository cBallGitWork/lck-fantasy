# Leagues

Every league a manager is in, and one league's table. Reached from **Leagues** in the top bar, and **All leagues ›** on Home and Points. Drawn at 1440 in the shared frame.

**Approved:** Craig, 14 Nov 2026. In the first round (13 Nov) he picked the list and table (A) "and some of the elements of B": Overall's top rows, a gap, your neighbourhood, Legend, Rise and All in Split 2, and a pager with Find me; he liked the Carry column (now Captain) and said yes to the chase tag. On 14 Nov he took every recommendation on the panel's calls, then "Yes, save it". Names, teams and numbers are a made-up Split 2 Week 14, not roster data. Redrawn to [plate.md](../../plate.md) on 15 Nov 2026; this binds layout, content and order, and plate.md how it is drawn.

**Changed by Craig, 16 Nov 2026:** the list of leagues moves to the side column on the right, as on every page; the open league's table is the main column.

**Redrawn, 27 Nov 2026**, in Pick Team's look, with the Captain column (was Carry) and Overall's panel of Captains and buffs by tier ([spec/08](../../../../spec/08-leagues.md#the-leagues-page)). Craig's calls that day, after the screen read as text and grey: tier shields in their ranked colours, over 16 Nov's one white shield; ranks 1 to 3 as gold, silver and bronze squares; a Captain's share as a bar in its tier's colour, no bar for a buff; a mark before each league in the list; `Overall · Emerald I` in the list; your own row filled with a white left edge and no dot; no chase tag on Overall; no Week column before the deadline; a red edge on Delete league and Leave in their confirm sheets. Error and empty states (no private leagues, a bad code, a full league) are not drawn yet: their own round.

One source draws every picture: `leagues.html` and `render.js`, the picture chosen by `?v=`.

| File | `?v=` | Shows |
|---|---|---|
| `1440.png` | none | A private league you made: code, Copy link, Admin, Season and Split tabs, the podium, your row with the chase tag |
| `1440-overall.png` | `overall` | Overall in Split 2, Legend, after the deadline: top 7, a gap, your neighbourhood, pager with Find me, then Captains and buffs by tier |
| `1440-overall-before.png` | `before` | The same before the next deadline: no Captain or Week column, no tier panel |
| `1440-admin.png` | `admin` | The maker's Admin menu |
| `1440-create.png` | `create` | Create a league |
| `1440-created.png` | `created` | The league made: code, Copy code, Copy link, Open league |
| `1440-join.png` | `join` | Join a league |
| `1440-member.png` | `member` | A league you're a member of: Leave in place of Admin |
| `1440-delete.png` | `delete` | Delete confirm |
| `1440-leave.png` | `leave` | Leave confirm |

## Borrowed

- **FPL's Leagues**: my leagues listed (general, then private) beside the open league's table, with rank, move and totals; Create and Join below the list. Research: [docs/research/leagues-page-references.md](../../../research/leagues-page-references.md), shots in [docs/design/references/leagues/](../../references/leagues/).
- **FPL's "go to my rank"**: the top rows, a gap, then the rows round yours, and Find me in the pager.
- **The LCK's Legend and Rise groups** (lolesports.com), as a three-way switch on Overall in Split 2.

## Controls

- **A league in the list**: opens its table in the main column.
- **Season | Split 1 | Split 2**: which table. On Legend and Rise in Split 2, Total is season points, with a Split 2 column beside it (spec/08).
- **Legend | Rise | All**: Overall in Split 2 only. The pager counts the group shown.
- **A row**: opens that manager's team (›).
- **Code, Copy link**: in the header for every member.
- **Admin ▾** (the maker): Rename, which edits the name in place; Remove a manager, which picks a row then confirms; Delete league…, which confirms. The maker has no Leave.
- **Leave** (a member): confirms.
- **Create a league**: name and the week scoring starts, from this week on (default this week), then the code with Copy code, Copy link and Open league.
- **Join a league**: a code or a link.
- Back is a key in every sheet, beside the sheet's action.

## Captain and chase

Specced 14 Nov 2026 ([spec/08](../../../../spec/08-leagues.md#the-leagues-page)): the Captain column shows once the week's deadline passes; the chase tag reads "16 pts to 1st", "+16 clear" when 1st, nothing when level.

## Placeholders

| What | Issue |
|---|---|
| Leagues, tables, ranks, moves, Legend and Rise | #38 |
| Week and total points | #33, #34, #36 |
| Sponsor badge, "presented by" | spec/13, no issue yet |
