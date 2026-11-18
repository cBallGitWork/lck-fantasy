# Flol: the design file (draft)

<!-- Front matter: none by hand. Generated from src/theme/tokens.ts once the export exists (P12). -->

**Contents:** [Read this first](#read-this-first) · [Overview](#overview) · [Colors](#colors) ·
[Typography](#typography) · [Layout](#layout) · [Elevation & Depth](#elevation--depth) · [Shapes](#shapes) ·
[Motion & Micro-interaction](#motion--micro-interaction) · [Voice & Content Strategy](#voice--content-strategy) ·
[Components](#components) · [The subject's object](#the-subjects-object) · [Tables and figures](#tables-and-figures) ·
[Charts](#charts) · [States](#states) · [Assets and stand-ins](#assets-and-stand-ins) · [The phone](#the-phone) ·
[Accessibility](#accessibility) · [Brand layer](#brand-layer) · [Do's and Don'ts](#dos-and-donts) ·
[Where the build breaks this file](#where-the-build-breaks-this-file) · [Decided](#decided) ·
[Proposed changes for Craig](#proposed-changes-for-craig)

## Read this first

- A draft, 18 Nov 2026, built from `docs/design/plate.md`, the kit in `../core/` and the 18 Nov site walks.
  **The plate is binding and approved; this file carries its rules and changes none.**
- Where a kit rule adds to what the plate says, it is a proposal (P4) until Craig accepts it. Where a kit
  rule would fail something the plate or an approved picture requires, the plate wins: the rule is `off` or
  `flag` in [design.json](design.json), tied to its P number.
- Every rule is marked by layer: **core** (every league), **LCK** or **LEC**. The sorting is this draft's
  reading; the plate has one layer. The LEC game is talk only (`docs/to-grill.md`, 17 Nov 2026).
- `theme.test.ts` already runs `[test]` for colours and sizes; the lint is not built (P12).
- An approved picture in `docs/design/approved/` settles layout; this file settles how it is drawn.
- Reskin directions are drawn on Stats and Pick Team at 1440 (`../core/checks.md`, Directions).

## Overview

- **Product:** Flol, FPL for the LCK: a budget, a squad with a bench, weekly transfers, a Captain, buffs,
  global and supporter leagues. Core.
- **Users:** FPL and UCL Fantasy players, and LCK fans; desktop first, the phone a priority. Core.
- **Main jobs:** pick the team, make transfers, check points, read leagues, research players, follow the LCK
  week. Core.
- **Foundations:** WCAG 2.2 AA, Nielsen's ten heuristics, Refactoring UI on hierarchy and spacing (plate).
- **Structure from FPL, feel from the LCK; never the same source.** FPL never gives the look (CLAUDE.md).
- **The subject's object:** the Rift. Also the broadcast lower third, the broadcast lineup, the scorebug
  (core); the hangul banner and the LED panel (LCK). Signatures per screen: P8.
- **Taste log:** `docs/design/taste-log.md`, not started. First entries: Craig's recorded reactions (crests
  as PES-style club badges, never invented icons; no explainer lines), each with its date and picture.

## Colors

Values live in `src/theme/tokens.ts`; nothing outside `src/theme/` holds a colour (Craig, 16 Nov 2026).
`[test]` Today's values are the only map and read as the LCK's until Craig decides (P1).

| Token | Core role | Use, and only this | Layer |
|---|---|---|---|
| `--bg` | ground | the page | core |
| `--paper` | panel | panels and tables | core |
| `--line` | rule | table rules | core |
| `--fill` | selected | a selected row, a toggle's ground | core |
| `--text` | text | words and figures; section rules, the selected thing, every emphasis | core |
| `--mid` | secondary | secondary text (6.5:1 on `--paper`, 5.8:1 on `--fill`) | core |
| `--soft` | — | never text; dashed outlines and placeholders only | core |
| `--ink` | action | the one main action's fill, and nothing else | core |
| `--on-ink` | on-action | the words on that filled key | core |
| `--gold`, `--gold-rule` | — | the hangul on your team's banner, and its rule | LCK |
| `--rise`, `--fall` | meaning | a price rise, a price fall | core role; LCK value (red up, blue down) |
| `--over` | meaning | the bank below zero, with its − (Craig, 16 Nov 2026) | core |
| `--teal` | focus; meaning (live) | the second accent, sparingly: the live dot, the focus ring | core |
| `--stage`, `--stage-text` | — | Live's dark stage and its grey text | core |
| `--dim` | — | the page behind a modal | core |
| `--map-*` (five) | — | the Rift's ground, river, lanes, bases, towers | core |
| `--tile-card`, `--tile-plate`, `--on-tile-plate` | — | a Rift tile's faint card, white name plate, its words (Craig, 16 Nov 2026) | core |

- Gold is for two things only: the one main action (`--ink`) and the banner's hangul (`--gold`). Section
  rules, tabs, selected borders, links, marks, tags and a rank's move are `--text` or grey, never gold
  (Craig, 16 Nov 2026). `[lint]` `accent-count`
- Two set exceptions: the Flol wordmark stays gold; Overall's tier shield is a cream `--text` fill, one
  colour for every tier (Craig, 16 Nov 2026). `[panel]`
- Colour is spent on meaning only: red and blue are prices and the bank only; a rank's move stays `--text`
  (Craig, 16 Nov 2026). `[panel]`
- Never colour alone: a rise also has ▲, a fall ▼, live a dot and the word. `[lint]` `colour-alone`

## Typography

All core today; the families may become brand values (P2).

- Words in IBM Plex Sans KR, Korean included. Figures in IBM Plex Mono, so they line up. `[lint]` `font-family`
- Six sizes: 12, 14, 16, 20, 28, and 44 for the page's one key figure; a player's or coach's card names him
  at 40/700 (Craig, 15 Nov 2026). Nothing under 12. `[test]` `[lint]` `key-figure`
- Three weights: 400, 600, 700. `[test]`
- One page title, 28/700. On Points and Home the title is your team's name. `[panel]`
- **LCK:** the title's hangul after it in 16/400 `--mid` (`Leagues 리그`); the card's hangul at 20 under the
  40/700 name, as a broadcast lower third (Craig, 15 Nov 2026). `[panel]`

## Layout

Core.

- Drawn 1440 wide. Top bar, then the page: 32px each side, 24px above, 48px below. `[render]` Other widths: P10.
- Two columns: the main column, and a side column 360px wide on the right, 32px apart. `[panel]`
- The side column is a stack of titled sections, each opening with a 2px `--text` rule, never gold, and a
  14px title with its count or state after it in `--mid` (Craig, 16 Nov 2026). `[panel]`
- Fold: the first row of a screen's main table or picture shows at 1440 × 900. `[render]`
- One spacing scale: 4, 8, 12, 16, 24, 32, 48. `[test]` `[lint]` `space-scale`
- 8 inside a group, 16 between rows of groups, 24 between sections, 32 between columns. `[panel]`
- Page variants and registers: not named in the plate (P7). Density: 40px table rows; cell padding not set.

## Elevation & Depth

Core. No soft shadows, glow or gradients (Never 2); depth is fills and rules. `[lint]` A modal dims the page
behind it with `--dim`. `[render]` `scrim`

## Shapes

Core.

- Everything is square, radius 0, save a Rift tile's card, FPL's one rounded shape (Craig, 16 Nov 2026).
  `[lint]` `radius`
- Round marks: C, the live dot, your-player dot (8px, after the name) and a radio button. `[lint]`
- A crest keeps its team's shape: a PES-style club badge (`approved/crests/`). `[lint]` (allowed selector)
- The Rift tile may sit three boxes deep (card, name plate, price chip). `[lint]` `nesting` (allowed)

## Motion & Micro-interaction

Core. 150 to 250ms, ease-out; a changed live figure fades in. With reduced motion, nothing moves. `[lint]`
`motion`, `reduced-motion`

## Voice & Content Strategy

Every word a player reads is in the Broadcast voice (`.claude/agents/broadcast.md`) and lives in its screen's
`words.ts`. Core.

Prose (Help, and any page that explains in sentences), as a friend who plays would explain it (Craig,
17 Nov 2026): full sentences to "you" with contractions, one rule per sentence, condition first; plain
words, not labels; a game term explained the first time in the same sentence; one worked example starting
"Say"; cut what a reader doesn't need. `[panel]`

Everywhere:

- UK English, sentence case: `Live`, never `LIVE`. `[lint]` `caps` (acronyms allowed: FLEX, LCK, KST, POG)
- The shortest clear label: `Pts`, `Owned`, `Price`. `[panel]`
- A state is a word or a tag, never a sentence. `[lint]` `explainer`
- No line explains what a manager already knows, what a page is for, or what a control does when its label
  says it. Flol's own rules (Captain ×1.5, the team cap) are named where they apply. `[lint]` `explainer`; `[panel]`
- Sentences allowed outside Help: a buff's one line, the sponsor notice, Riot's notice. `[lint]` (`prose`)
- An empty state is a title and at most one short line. `[panel]`
- Absence is `—`, never `0`. `[panel]`
- Money as `₩18.5m` (spec/02). Times in the viewer's own time, as `Sat 22:00`. `[lint]` `number-format`
- One name per thing: Captain, never Carry; Price changes, never Patch update; Cheer and Jeer, never Truck;
  `Week 4`, never Gameweek. `[lint]` `banned-word`
- No emoji, save the birthday cake (spec/13). `[lint]` `emoji`
- One made-up dataset (`src/fixtures`): where two pictures show the same finished series, they show the
  same numbers. `[lint]` `fact-mismatch`
- **LCK:** the LCK's own words for its things: series, POG, Bo3, Week 3. `[panel]`

## Components

Each part drawn one way on every screen. Core unless marked. The inventory, with where each is used and
what the walks found, is [components.md](components.md).

- **Page head:** title (and LCK hangul); ‹ week ›; the key figure; its tags; up to three figures beside it,
  in `--mid` with the figure in `--text` (`Average 79  Highest 136 ›`) (Craig, 16 Nov 2026).
- **Tag:** a square box, 1px rule, 12px, sentence case: `Live`, `Not final`, `Final`. `Live` filled `--text`
  with `--bg` words; `Not final` dashed (Craig, 16 Nov 2026). No team cap tag; on Points and Perfect game
  `Final` is the head's tag alone.
- **View toggle:** butted keys on `--fill`, the chosen one on `--paper`.
- **Tabs:** words in a row, the chosen one `--text` with a 2px `--text` underline (Craig, 16 Nov 2026).
- **Top bar:** `Flol`, Home, Pick Team, Transfers, Points, Leagues, Stats, LCK, `● Live` (dot always shown);
  at the right `presented by [Sponsor]` and `Baron Steal FC ▾`, or `Log in ›` for a visitor, whose bar shows
  only Stats and LCK (Craig, 16 Nov 2026). The `LCK` item is the brand's league hub.
- **A link** ends with `›` in `--text` and names where it goes; not underlined save inside a sentence; one
  leaving Flol ends with `↗`. `[lint]` `arrow-key`
- **Deadline:** `Deadline Wed 07:45  16:45 KST` and the countdown `9h 45m`. Core shape; **LCK:** KST.
- **Times:** your time first, then the league's time in `--mid`: `Sat 22:00  07:00 KST`. A column of times
  has a head. Core; **LCK:** KST.
- **Your player:** an 8px round `--text` dot after the name, on every screen. **May not start:** the tag
  `Not starting`.
- **Card view:** the 7 starters in one row as the LCK broadcast's lineup (Top, Jungle, Mid, Bot, Support,
  Flex, Coach), then the bench bar.
- **Section that opens and closes** (Help): a 48px row, title 16/600 left, ▾ or ▴ in `--mid` right, a 1px
  `--line` under it; open, its text under the title with 24px below. A group opens with a 20/700 heading over
  a 2px `--text` rule.
- **Guide page** (Help): one section at a time, title 28/700, from the side menu (current line 600 `--text`
  with a 2px `--text` left edge); under it a 1px `--line`, Back `‹ title` left and Next `title ›` right, 600.
- **Worked example** ("Say…"): its own paragraph, 14px `--mid`, 16px in from a 2px `--line` rule at its left;
  its numbers in `--text`.
- **Modal:** a dimmed page, `✕` top right, Esc closes, focus stays inside. A card is 1056 wide; a sheet 544.
  On Points a tapped player opens a sheet, its game rows 32px.
- **Form:** label above its field, 14px; field 40px tall, 1px `--line`, `--text` when focused; an error is
  one line in `--text` under the field with a 1px `--text` edge (Craig, 16 Nov 2026).
- **A buff:** its name, one line on what it does (spec/06), how many are left, and Play. (Kit D2: P15.)
- **One main action** per screen, filled `--ink` with `--on-ink` words (`Save team`) (Craig, 16 Nov 2026).
  Everything else is a link or an outlined key. `[lint]` `filled-keys`
- **A page that shows a sponsor** ends with `All sponsors are made up.`, 12px `--mid` (spec/13).
- **LED panel** (a cheer's or jeer's): a picture, dotted, in capitals, the same on every screen. **LCK**;
  whether another league keeps it is Craig's call. `[lint]` (`caps.allow`, `gradient.allow`)

## The subject's object

**The Rift:** square, 720 a side, centred in the main column (Craig, 16 Nov 2026). Each tile as FPL's: the
shirt on a faint card with a rounded top; C and a news flag at its top corners; `FLEX` or `Coach 감독` over
a Flex's or Coach's shirt, nothing under it; a white name plate; a dark band of fixtures, or points and
series; on Transfers the price in a dark chip over it. **LCK:** `감독`. Core.

**The bench:** one bar under the Rift or the cards: `Bench`, then the Rift's own tile per bench player under
its order and role (`1. Mid`) (Craig, 16 Nov 2026).

Its modes against its states, as a grid: [components.md, The squad](components.md#the-squad). `[panel]`

## Tables and figures

Core.

- Name far left (after its slot, where a table lists a team) with team after it; figures right-aligned;
  40px rows; 12px heads in `--mid`. `[lint]` `figure-align`, `row-height`; `[panel]`
- No action column; what you can do to a row goes in its panel on the right. Two exceptions, each a page's
  one job: Transfers' `+`, and a row's `›` where the row opens something. `[panel]`
- Wide table (Stats): the head and the name column stick; the table scrolls under them. `[render]`
- Long names end in `…` at their column's width; the full name on hover and in the panel. `[render]`
- A rank's move is ▲/▼ in `--text`; a price's move ▲ in `--rise`, ▼ in `--fall`. `[lint]` `colour-alone`
- League data shapes, every brand: K/D/A as `3/1/7`; role order Top, Jungle, Mid, Bot, Support; blue side
  left; `GD@15` with its sign (`+1,800`). (Research, not plate; the plate is silent. `[panel]`)

## Charts

None. The plate names none.

## States

Core. Every screen part is drawn for each state it can be in. `[panel]`

- **Hover:** a row gets `--fill`; a link or key its 1px `--text` underline 4px below (`.hover-line`), or edge
  (Craig, 16 Nov 2026).
- **Focus:** a 2px `--teal` ring, always shown (Craig, 16 Nov 2026). `[lint]` `focus-visible`
- **Disabled:** one look for every key, `.key-off`: `--mid` on `--fill`, no edge, the reason beside it
  (`No changes`). `[lint]` `disabled-reason`
- **Loading:** the layout drawn with `--fill` bars where figures go; no spinners. `[lint]` `spinner`
- **Empty:** a title and at most one short line (`No moves yet`). `[panel]`
- **Error:** a title and one line, and `Try again ›` where trying again can help. `[panel]`
- **Live, Not final, Final:** the tags above.
- **Not drawn by the plate** (P16): saved; deadline passed and week locked; pre-season with no points;
  between weeks; guest; over the team cap or unaffordable; a series postponed; tied ranks.

## Assets and stand-ins

| Image slot | Real art | Stand-in today |
|---|---|---|
| Crests | `approved/crests/` (PES-style club badges) | — |
| Shirts | `approved/shirts/` | — |
| Player and coach photos | spec/13 | — |
| Sponsor, stream, thumbnail, portrait | none | The plate's dashed `--soft` box with one word: a known tell (D7), P5 |

## The phone

Not drawn yet. It gets its own round: one column, the side column below the main, targets 44px (plate).
Core. That round must also settle the slots the kit names (`../core/DESIGN.template.md`, The phone): the nav,
the side column per page, the Rift at 390, sheets, the sticky bar's stacking, column drop order, tap for
hover facts. Until then, P10.

## Accessibility

Core. Text 4.5:1 against its ground; large text and marks 3:1. `[test]` `[lint]` `contrast` Every target at
least 24px on the desk, 44px on the phone. `[lint]` `target-size` Focus always shows: a 2px `--teal` ring
(Craig, 16 Nov 2026). `[lint]`

## Brand layer

The core holds the grammar; a brand swaps values. Today there is one map, and nothing below changes it.

| Key | LCK (today's values) | LEC (talk only; every cell Craig's call) |
|---|---|---|
| Ground, paper, text | `--bg`, `--paper`, `--text` (Hextech navy and cream) | Open. Research: near-black, as the LEC pairs vivid colour against black |
| Main action (`--ink`) | Hextech gold | Open. Research: one hot accent, orange |
| Second accent (`--teal`) | teal | Open. Research: teal or turquoise |
| Banner accent (`--gold`, `--gold-rule`) | pale gold, dark gold | Open |
| Rise / fall | red up, blue down | Open. Research (inference): green up, red down |
| Word face | IBM Plex Sans KR | Open. Research: a Latin-first sans |
| Display face | none today | Open. Research: a free heavy condensed face (Anton, Bebas Neue), never Druk |
| Second language | hangul after each title, on the banner, on LCK-borrowed names (`Coach 감독`) | Open. Research: none |
| Motif | hangul set at contrasting scale; the LED panel | Open. Research: one hard diagonal cut; no textures or gradients |
| League time | KST | Open. Research: CET |
| Money | `₩18.5m` (spec/02) | Open. Research: `€`, as data per competition |
| League words | series, POG, Bo3, Week 3, 감독 | Open. Research: football words ("transfer window") |
| Voice of empty states, toasts | Broadcast voice | Open. Research: cheekier, through a per-league `broadcast` pass |
| Crests | `approved/crests/` | `approved/lec-crests/` (Craig, 17 Nov 2026), waiting for the game |
| Shirts | `approved/shirts/` | `approved/lec-shirts/` (Craig, 18 Nov 2026), waiting for the game |
| Flags | none | A player's country flag (to-grill, 17 Nov 2026) |

- The LCK's facts and every value Craig may tune are data, held per competition, never hardcoded (CLAUDE.md).
  So KST, `₩` and the league words belong to the competition's data. `[test]` once split
- No Riot, LCK or LEC mark or logo, and no league fonts, in any brand (research: Riot's legal policy). `[owner]`
- A brand changes values only; a brand that wants a different size, space or part is asking to change the
  core, which is Craig's call. `[owner]`

## Do's and Don'ts

### Never: the plate's six

All core.

1. A row of stat tiles, a card around every section, or small capitals over big numbers. `[lint]`
   `stat-tiles`, `tracked-caps`
2. Pills, rounded corners, tinted badges, gradients, glow or soft shadows. A cheer's or jeer's LED panel is a
   picture: dotted, in capitals, the same on every screen. `[lint]` `pill`, `radius`, `gradient`, `glow`
3. Keys and legends: the heads and marks carry it. `[lint]` `key-heading`
4. A landing page's furniture: a hero band, a centred marketing line, space used as decoration. `[panel]`
5. Two names, two sizes or two styles for one thing. `[lint]` `part-drift`, `banned-word`
6. A second filled button on a screen. `[lint]` `filled-keys`

The kit's Never (D1 to D18) and its rules beyond the plate are proposed (P4).

### Off, until Craig answers

| Kit ID | Why off | Waits on |
|---|---|---|
| G11, `middle-dot` | The approved pictures draw `Team · Manager`, `GEN 2–0 KT · Wed`, `CITY · EST.` | P14 |
| D2, `card-grid` on buffs | The plate requires a buff's one line | P15 |
| D3, `tag-count` | More boxed states than the plate names | P6 |
| D4, `figure-face` | The plate sets figures in mono; which runs are figures is open | P3 |
| D7, `placeholder` (at `flag`) | The plate requires dashed placeholders | P5 |
| PH1, PH2 at 390 and between | The plate draws 1440 only | P10 |

### Kept on purpose

- Square corners, ruled tables and dense columns sit close to Anthropic's "broadsheet" (S8). Craig chose
  them; the brief's choice wins. The identity must come from the subject's objects, not the restraint.

### LCK watch: Western with Korean words

Research, not plate (`brand_lck_brand.md`). The Culture lens checks each screen against it:

- Hangul in a fallback face (Malgun, Apple SD). `[render]` `font-family`
- A Western display face; green-up arrows; gold fantasy ornament; taegeuk or hanbok clichés. `[panel]`

### Watch

From the reskin's look round, what each picture used in place of each banned tell. Seeded with S1 (teal
spreading past its two jobs), S2 (a pulsing live dot), S3, S4, S9, S13.

## Where the build breaks this file

From the 18 Nov 2026 walks of the built preview. Each is a fix to the build, not a change to the plate; none
is filed.

| Screen | What the walkers saw | Rule it breaks |
|---|---|---|
| Transfers | Free transfers, Cost, Bank as three boxed tiles | Never 1 |
| Pick Team, Transfers | The sticky save bar covers the Rift's bottom row (4) | Fold; kit LA5 |
| Cards | A card opens over a blank page; the nav marks the wrong tab (4) | Parts: Modal (a dimmed page); kit PA4 |
| Points | Captain points with no `×1.5`: 12 + 5 shows as 25 | Words: Flol's rules named where they apply |
| Points, Perfect game, Home, Transfers, Leagues, profile | One week, two scores (94 and 109); two deadlines; free transfers 2 and 0 | Words: one made-up dataset |
| Live, manager profile | No page title | Type: one page title |
| Top bar | The team chip's ▾ opens no menu | Parts: Top bar, the account menu |
| Pick Team | Save team greyed with no reason beside it | States: Disabled |
| Pick Team | Save team gives no confirmation (PM) | P16 (saved) |
| Price changes | Rows carry colour without ▲/▼ | Colour: never colour alone |
| Home, Following | "Truck hire by Sponsor" | Words: Cheer and Jeer, never Truck |
| Stats, Transfers | Filter chips read as pills (one walker) | Never 2, if rounded |
| Dialogs | The dim stops short of the page (may be the full-page shot; check) | Parts: Modal, a dimmed page |

## Decided

The plate's dated calls; not repeated here. Craig, 18 Nov 2026, answering this draft:

- **P1:** navy and gold are the LCK's look, not Flol's. The base under every league is neutral, with gold kept only for the Flol wordmark; the LEC gets its own palette.
- **P2:** Pretendard for Hangul only, paired with a distinct Latin face (not Inter); one display face per league.
- **P12:** build the slop lint first, before any screen is redrawn.
- **P13:** trial Impeccable's detector on one screen, telemetry off, nothing installed into the repo's settings.

## Proposed changes for Craig

Each is Craig's call; nothing here is built until he answers. Most important first.

| # | Question | Example | Recommendation |
|---|---|---|---|
| P5 | Dashed placeholders only in mock-ups, never in a built page? | The stream box shows the stream's name on `--paper`; a missing sponsor slot is left out | Yes: all four walkers named the dashed boxes the most AI-looking thing in the build |
| P4 | Adopt the kit: its Never (D1 to D18), its Watch, and its rules the plate is silent on (`../core/rules.md`)? | D17 no sticky bar over content; ST8 a save says `Saved`; VO3 no `Submit` | Yes, except D2 for buffs (P15). Adopting D2 whole would change the plate's buff rule |
| P10 | Shoot every screen at 390, 1024 and 1280 for sideways scroll, clipping and covered content, before any phone design? | At 1024 the main column is 568, narrower than the 720 Rift | Yes; changes `/design`'s render step only, no new picture |
| P16 | Draw the states the plate doesn't, in the reskin round? | Saved after Save team; week locked; pre-season; guest; unaffordable; postponed; tied ranks | Yes, each with a fixture and a route, so the render check sees it |
| P15 | Keep a buff's one line? | `Bench Boost`, then `The bench scores too` (spec/06) | Keep: it explains Flol's own mechanic, which draft-platform's plate also wants; walkers split (UX and PM against, FPL player for) |
| P14 | Keep middle dots in drawn text? | `GEN 2–0 KT · Wed` | Replace with two cells or a gap; Anthropic's skill and two of Craig's plates name `·` strings a tell |
| P3 | Mono only for figures that line up, not dates, times or labels? | `Sat 22:00` and `Week 3` in the word face; `₩18.5m` in a price column in mono | Yes: walkers said mono everywhere "reads like a terminal" |
| P6 | Boxed tags only for `Live`, `Not final`, `Final`, `Not starting`; every other state a word? | `Locked`, `Bo3`, `POG` as plain words | Yes: a box for every state makes every state look the same |
| P7 | Name the page skeletons? | Two-column (default); full-width table (Stats, Settings); stage (Live); banner (Home, Points, profile) | Yes; a page outside the list is a panel finding |
| P8 | Each screen's brief names its one signature object? | Pick Team: the Rift; player card: the lower third; Home: the hangul banner | Yes: restraint keeps the floor but doesn't make a screen look like Flol |
| P9 | Keep teal as the second accent? | The research names a teal accent as one of Claude's fallbacks (S1) | Keep it to its two jobs for now; decide in the look round |
| P11 | Rename value-named tokens to roles before a second league? | `--gold` → `--banner-accent`, `--teal` → `--accent-2` | Yes, when the LEC is specced |

Upkeep, no call needed:

- The plate's Type section says "except a tag's 11"; its Parts section and `tokens.ts` say 12 (Craig,
  16 Nov 2026). The Type line is stale.
- `tokens.ts`'s comment on `ink` says "Rules, the selected thing, the one filled button"; the plate says the
  one main action's fill and nothing else. The comment is stale.
- The approved pictures draw the LED panel's dots in a raw `rgba(255,255,255,.14)`; it needs a token before
  the panel is built.
