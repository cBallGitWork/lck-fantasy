# Flol: the component inventory

**Contents:** [How to read it](#how-to-read-it) · [Frame](#frame) · [Heads and figures](#heads-and-figures) ·
[The squad](#the-squad) · [Tables](#tables) · [Marks and tags](#marks-and-tags) · [Controls](#controls) ·
[Dialogs](#dialogs) · [Series and live](#series-and-live) · [The Korean layer](#the-korean-layer) ·
[Assets and stand-ins](#assets-and-stand-ins) · [Not yet drawn or reached](#not-yet-drawn-or-reached)

## How to read it

Every part the 18 Nov 2026 walks found in the built preview (four lens walkers and a UCL Fantasy player, at
1440, on made-up data), with what each part must draw. **Plate** names the `docs/design/plate.md` rule that
binds it; `—` means the plate is silent, so its look is Craig's call when it is drawn. **Walks** gives what
the walkers flagged; the count is how many named it. **Layer**: core, or LCK where the part is the LCK
brand's. Nothing here changes the plate.

## Frame

| Part | Used on | States to draw | Plate | Walks | Layer |
|---|---|---|---|---|---|
| Top bar | Every screen | Signed in; visitor (Stats and LCK only); current page; live on | Parts: Top bar | The ▾ opens no menu (3); nav marks the wrong tab under a card (4) | core; `LCK` item LCK |
| Page title with hangul | Every screen | — | Type: one page title | Live and the profile have none (2) | core; hangul LCK |
| Side column of titled stacks | Most screens | Count or state after the title | Frame | Same 1fr + 360 on every page (UCL) | core |
| Page variants (full width, stage, banner) | Stats, Settings; Live; Home, Points, profile | — | — ([P7](DESIGN.md#proposed-changes-for-craig)) | Every screen looks alike (UCL) | core |
| Footer: sponsor notice, Riot's notice | Every page with a sponsor; every page | — | Parts: sponsor line | Notice under a page with no sponsor (1) | core |
| Short-page ending | Settings, Series, Price changes, profile History | — | — | Dead lower halves (UX) | core |

## Heads and figures

| Part | Used on | States to draw | Plate | Walks | Layer |
|---|---|---|---|---|---|
| Week stepper and score head | Points, Perfect game, profile, Price changes, LCK | Live, Not final, Final; first and last week | Parts: Page head | Same week, two scores (4); needs room for buff played and transfer hit (FPL) | core |
| Banner head (team name, tier, rank, move) | Home, Points, profile | Your team; a rival's | Type; Colour (`--gold`) | The gold hangul banner is "the strongest Korean moment" (4) | core; banner hangul LCK |
| Line of figures (Free transfers, Cost, Bank; Picked, Bank, Team cap) | Transfers, front door | Bank below zero in `--over` | Never 1 | Built as three boxed tiles (3 + UCL) | core |
| Deadline block | Home, Pick Team, Transfers, LCK, Following, dialogs | Before; passed | Parts: Deadline | Two countdowns for one deadline (4) | core; KST LCK |
| Time pair | Everywhere a time shows | — | Parts: Times | Mono on day names reads like a terminal (UCL) | core; KST LCK |

## The squad

| Part | Used on | States to draw | Plate | Walks | Layer |
|---|---|---|---|---|---|
| The Rift | Pick Team, Transfers, Points, Perfect game, front door | See the grid below | Parts: The Rift | Save bar covers its bottom row (4); unselected tiles look disabled (2); Transfers lays it out differently (2); rivals only as a table (UCL) | core |
| Rift tile | Same | Captain, news flag, Flex, Coach (`FLEX` or `Coach 감독` over the shirt, nothing under it), not starting | Parts: The Rift | Abstract squares read as a placeholder (UCL) | core; `감독` LCK |
| Bench bar | Under the Rift and Card view | Order and role | Parts: The bench | Bench stays shirts while starters are crests (UCL) | core |
| Card view (broadcast lineup) | Pick Team | Same as tiles | Parts: Card view | Keep (4) | core |
| View toggle | Pick Team, Transfers | Rift, Card, List | Parts: View toggle | — | core |
| Player name block | Tile, row, card | Your player, not starting | Parts: Your player; Type (40/700) | One squad drawn several ways (2) | core; hangul LCK |
| Sticky action bar | Pick Team, Transfers, front door | Changes count, Reset, disabled with reason; never over the Rift (kit LA5, P4) | Parts: One main action; States: Disabled | Save greyed with no reason (UX); no confirmation after saving (PM) | core |

The Rift's modes against its states. Each cell is drawn from the one Rift part, reading the one squad
source that Card view also reads (kit OB1, OB2). `—` means the state can't occur in that mode. Plate
rules bind each cell; the walks' findings say where the build breaks it.

| Mode | Default | Selected | Valid target | Captain | Not starting | Live | Check |
|---|---|---|---|---|---|---|---|
| Pick | tile | outlined | outlined | C | tag | — | `[panel]`; contrast after opacity `[lint]` `contrast` |
| Transfer | tile, price chip | sold | — | C | tag | — | `[panel]`; same slots as Pick `[lint]` `layout-drift` |
| Points | points and series band | opens sheet | — | C with `×1.5` | `Didn't play` | figure fades in | `[panel]` |
| Empty (front door) | dashed slot, `+` (P5) | — | — | — | — | — | `[panel]` |

The selected and valid-target looks are the walks' reading of the build; the plate is silent on them, so
their look is Craig's call when drawn.

## Tables

| Part | Used on | States to draw | Plate | Walks | Layer |
|---|---|---|---|---|---|
| League table | Leagues, Home mini table | Your row; rank move; ⋯ jump; pager; Find me | Parts: Table | Keep (4); no tier on Overall though spec/08 has one (PM) | core |
| Stats table (wide) | Stats | Sorted column; sticky head and name; Totals / Per game | Parts: Wide table | Right half an even run of figures, no grouping (2) | core |
| Market list | Transfers | Replacing X; filtered by role and budget; unaffordable | Parts: Table (`+` exception) | Selling doesn't filter by budget (UCL); unaffordable buy silent (FPL) | core |
| Price changes | Price changes | Rises and falls side by side | Colour: never colour alone | Rows lack ▲/▼ (UX) | core; red/blue LCK |
| Fixtures and results | LCK hub | Match days in two times; record; your players | Parts: Times | Half-width rows (UCL); records read as scores (1) | core |
| Standings | LCK hub | Groups, Play-In, Playoffs; Last 5 | Parts: Table | Baron / Elder groups to check against the 2027 format | core; group names LCK |
| Profile tables (slot, history, transfers) | Manager profile | — | Parts: Table | — | core |

## Marks and tags

| Part | Used on | States to draw | Plate | Walks | Layer |
|---|---|---|---|---|---|
| Tag | Heads, results | Live (filled), Not final (dashed), Final, Not starting | Parts: Tag | A box for every state (UCL); more states boxed than the plate names | core |
| C (Captain) | Tiles, cards, sheets | With `×1.5` where Captain points show | Words: Flol's rules named | `×1.5` missing on Points (2) | core |
| Your-player dot | Every screen | — | Parts: Your player | — | core |
| Rank move, price move | Tables | ▲ ▼; none | Colour | — | core; price colours LCK |
| Role marks | Stats, Transfers, Live, Series, Teams | Top to Coach, in that order | — | Crude at 12px (2) | core |
| Live dot | Top bar, Live, results | Live | Colour (`--teal`) | Must not pulse (second-order S2) | core |
| Birthday cake | Player rows | — | Words: no emoji save the cake | Looks pasted on (1) | core |
| POG | Series | — | — | No spec line (PM) | Craig's call |

## Controls

| Part | Used on | States to draw | Plate | Walks | Layer |
|---|---|---|---|---|---|
| Main action (gold) | One per screen | Disabled with reason | Parts: One main action | — | core |
| Outlined key, link with `›`, link leaving with `↗` | Everywhere | Hover, focus | Parts: A link; States | Equal-weight keys on one object (UX) | core |
| Tabs | Leagues, Stats, LCK, profile, Settings, cards | Chosen | Parts: Tabs | — | core |
| Filter row | Stats, Transfers | Chosen filter | — | Chips read as pills (UX) | core |
| Buff | Pick Team | Available, on and unsaved, used, locked | Parts: A buff | Three identical cards with a line each (2 + UCL); FPL walker liked the line | core |
| Section that opens and closes; guide page; worked example | Help | Open, closed; current section | Parts | Help not built or reachable (4) | core |
| Form field | Settings, create league, sign-up | Focused, error, locked | Parts: Form | Locked fields as a value with `Locked` (2) | core |

## Dialogs

| Part | Used on | States to draw | Plate | Walks | Layer |
|---|---|---|---|---|---|
| Card (1056) | Player, coach, Compare | Owned and not owned key sets | Parts: Modal | Card ignores its address (3) | core |
| Sheet (544) | Points sheet, confirm transfers, create league, cheer, delete account | Confirm with before → after; destructive with what goes | Parts: Modal | Dim stops short (2); bank before → after disagrees with the head (UX) | core |

## Series and live

| Part | Used on | States to draw | Plate | Walks | Layer |
|---|---|---|---|---|---|
| Scorebug | Series, Live | Upcoming, live, final; Bo3, Bo5 | — | The cream `v` block reads as a button (2); the fan liked it | core |
| Per-game row | Series, Points sheet | Counted games boxed; champion, W/L, KDA | — | Sheet sums disagree (1) | core |
| Series line | Cards, fixtures | — | — | — | core |
| Stream picker | Home, Live | Chosen; official and co-streams | — | A stack of identical bordered buttons (2); the empty black box (3) | core; feeds LCK |
| Live strip | Home, Points | Live; Watch › | — | Week total shown as series points (3) | core |
| Last 3, next 3 | Player and coach cards, Compare | — | — | Keep (4) | core |

## The Korean layer

All LCK.

| Part | Used on | Plate | Walks |
|---|---|---|---|
| Hangul after every title | Every screen | Type; Korean feel | Keep (4); Live has no title, so no hangul |
| Lower third (name 40/700, hangul 20) | Player and coach cards | Type | Keep (4) |
| Gold hangul banner | Home, Points, profile, Settings preview | Colour (`--gold`) | Keep (4); Settings field empty while Home shows it (PM) |
| LED panel | Home, Following, profile, cheer dialog | Never 2 | Keep (3); "Truck hire by" breaks Words (1) |
| Red rises, blue falls | Prices, the bank | Korean feel | Keep (4) |
| `Coach 감독`, Baron / Elder groups | Rift, LCK hub | Korean feel | Keep (3) |

## Assets and stand-ins

| Part | Used on | Plate | Walks | Layer |
|---|---|---|---|---|
| Crests (PES-style club badges) | Cards, rows, scorebug | Parts: Marks; `approved/crests/` | Meme crests and bare codes seen in the build (3) | core shape; art per league |
| Shirts | Tiles, lists | spec/13; `approved/shirts/` | Grey template tees lose team colour (2) | core cut; art per league |
| Player photos | Card, Card view | spec/13 | — | core |
| Placeholders (sponsor, stream, thumbnail, portrait) | Header, footer, Home, Live, news, Compare | Parts: Placeholders | Dashed boxes the most AI-looking thing (4): a known tell (D7) until [P5](DESIGN.md#proposed-changes-for-craig) | core |

## Not yet drawn or reached

- The phone (plate: its own round).
- Help, and the front door while signed in (no link reached them).
- Empty, loading and error states in the built app (the preview data is always full; Transfers opens with a
  transfer pending).
- States the plate doesn't draw ([P16](DESIGN.md#proposed-changes-for-craig)): saved; deadline passed and
  week locked; pre-season; between weeks; guest; over the team cap or unaffordable; a series postponed; tied
  ranks.
- Leagues' Join and Admin dialogs; the profile's Transfers tab; the card's Fixtures tab; LCK hub's Play-In and
  Playoffs; the live series page.
