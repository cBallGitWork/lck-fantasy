# Plate: the design standard

**Contents:** [The look](#the-look) · [Frame](#frame) · [Spacing](#spacing) · [Type](#type) · [Colour](#colour) · [Parts](#parts) ·
[States](#states) · [Words](#words) · [Korean feel](#korean-feel) · [Never](#never) ·
[The phone](#the-phone) · [Accessibility](#accessibility)

Every screen is drawn to this file. An approved picture in [approved/](approved/README.md) settles a
screen's layout (what sits where); this file settles how it is drawn (frame, spacing, type, colour,
words). Where the two disagree, the picture is redrawn to this file, or Craig is asked.

The rules come from general practice: WCAG 2.2 AA, Nielsen's ten heuristics, and Refactoring UI's rules
on hierarchy and spacing. On top of those sit Craig's own calls: FPL's structure, a Korean feel, the
shortest label, no explainer lines. The values are the ones the approved pictures already use most,
tightened to a few.

## The look

Arena, the pick of the look trial (Craig, 19 Nov 2026; [approved/pick-team/](approved/pick-team/README.md)).
The statement is the one Craig approved on 18 Nov 2026 ([foundations.md](foundations.md)), changed in
the two places the pick changed it: the ground is the league's own colour, and one family sets both
scripts.

> A broadcast desk for a League league. Square, ruled and dense, on the league's own ground: navy for
> the LCK, with gold where you act. It reads as League through roles, the Rift, sides and the way
> stats are written, with none of Riot's artwork. Hangul is set as design, in IBM Plex Sans KR,
> beside IBM Plex Sans. One object carries each screen.

## Frame

- Drawn 1440 wide. Top bar, then the page: 32px each side, 24px above, 48px below.
- Two columns: the main column, and a side column 360px wide, 32px apart. The side column is on
  the right on every page.
- The right column is a stack of titled sections. Each opens with a 2px `--text` rule, never gold, and a 16px
  title, a size above its items (Craig, 19 Nov 2026), its count or state after the title in `--mid` (Craig, 16 Nov 2026). On Points a tapped player opens a sheet, its game rows 32px.
- The first row of a screen's main table or picture shows above the fold at 1440 × 900.

## Spacing

- One scale, in px: 4, 8, 12, 16, 24, 32, 48. No other gap, padding or margin.
- Related things sit closer than unrelated ones: 8 inside a group, 16 between rows of groups,
  24 between sections, 32 between columns.

## Type

- Words in IBM Plex Sans, hangul in IBM Plex Sans KR: one family for both scripts. Figures in IBM
  Plex Mono, so they line up.
- Seven sizes: 12, 14, 16, 20, 28, 40 for a card's name, and 44 for the page's one key figure. A player's or coach's
  card names him at 40/700, his hangul at 20, as a broadcast lower third (Craig, 15 Nov 2026). Nothing under 12 on a desk;
  a Rift tile's words are 11 on a phone (`approved/pick-team/`).
- Each size has one job: 28 the page title, 20 a name (the wordmark, a card), 16 a panel's or
  section's title, 14 what you read and press, 12 what sits under it (`approved/pick-team/`). A 28
  or 20 head is tracked −0.01em.
- Three weights: 400, 600, 700.
- One page title, 28/700, with its hangul after it in 16/400 `--mid`: `Leagues 리그`. On Points
  and Home the title is your team's name: `Baron Steal FC 바론 스틸 FC`.

## Colour

The LCK's navy is the ground, with gold where you act. The values are the LCK's, from
`src/theme/league.ts` and `game.ts`; each token below is the CSS property `var(--name)` the app draws
with, and nothing outside `src/theme/` holds a colour (Craig, 16 Nov 2026). The banner, the stage, the
map and the tile keep their earlier values until their own pictures are redrawn.

| Token | Value | Use |
|---|---|---|
| `--bg` | #0A1226 | the page |
| `--paper` | #111B36 | panels and tables |
| `--line` | #22305A | table rules, a panel's edge |
| `--fill` | #18244A | a selected row, a toggle's ground |
| `--band` | #050A18 | the darkest ground: the top bar |
| `--text` | #EEF1F8 | words and figures; section rules, the selected thing, every emphasis |
| `--mid` | #9AA6C8 | secondary text (7.0:1 on `--paper`, 6.2:1 on `--fill`) |
| `--soft` | #4A5884 | never text; dashed outlines and placeholders only |
| `--ink` | #E0B04A | gold, the one accent: the one main action's fill, the Captain's C, a buff's icon, the wordmark |
| `--on-ink` | #0A1226 | the words on a filled `--ink` ground |
| `--banner` | #F0D58C | the hangul on your team's banner, and only there |
| `--banner-rule` | #785A28 | the banner's rule under that hangul |
| `--rise` | #FF6B78 | a price rise, Korean red lightened for navy |
| `--fall` | #6EA2FF | a price fall, Korean blue lightened for navy |
| `--up`, `--down` | #4CD98A, #FF6B78 | a rank's move in a league: up green, down red, with its ▲ or ▼ (Craig, 24 Nov 2026) |
| `--over` | #FF6B78 | the bank below zero, over the budget, with its − (Craig, 16 Nov 2026) |
| `--head-band` | #1D46A8 | a panel title's band, a brighter LCK blue (Craig, 26 Nov 2026) |
| `--add` | #4CD98A | what a transfer adds: the bank chip, `+` to buy, the bought player's outline (Craig, 26 Nov 2026) |
| `--tier-iron`, `--tier-bronze`, `--tier-silver`, `--tier-gold`, `--tier-platinum`, `--tier-emerald`, `--tier-diamond`, `--tier-master`, `--tier-grandmaster`, `--tier-challenger` | #948D86, #B0733F, #A9B6C6, #F0D58C, #3FB0A6, #2FBF74, #6F94FF, #B46AE6, #F0606B, #5CCFF2 | a tier's shield and its share bar; Gold is pale to stay clear of `--ink` (Craig, 27 Nov 2026) |
| `--signal` | #2BC4B5 | the second accent, teal, sparingly: the live dot, the focus ring |
| `--stage` | #000508 | Live's dark stage |
| `--stage-text` | #9AA6C8 | grey text on the stage |
| `--dim` | rgba(10, 18, 38, 0.72) | the page behind a modal |
| `--map-ground`, `--map-river`, `--map-lane`, `--map-base`, `--map-tower` | #0B1A2C, #0D2B3E, #1A2C42, #22374F, #5B5A56 | the Rift map's ground, river, lanes, bases and towers |
| `--tile-card`, `--tile-plate`, `--on-tile-plate` | rgba(240, 230, 210, 0.12), #FFFFFF, #010A13 | a Rift tile's faint card, its white name plate and the words on it (Craig, 16 Nov 2026) |

- Gold is the one accent, and on these alone: the one main action on a screen, the only filled key; the Captain's
  C; his `✓ Captain` state, edged and never filled; a buff's icon (Craig, 19 Nov 2026); the Flol
  wordmark; Star's star (Craig, 27 Nov 2026); a league table's rank 1 (Craig, 27 Nov 2026); all `--ink`. The banner's hangul is its own gold (`--banner`). Section rules, tabs,
  selected borders, links, tags and a page title's hangul are `--text` or grey
  (`--mid`, `--line`), never gold (Craig, 16 Nov 2026).
- Overall's tier shield is filled in its tier's colour (`--tier-*`), wherever a shield is drawn (Craig, 27 Nov 2026, over 16 Nov's one `--text` shield; `approved/leagues/`). The tier's name always sits beside it. On Leagues' tier panel a Captain's share is a bar out of 100% in that colour; a buff's share has no bar.
- A league table's ranks 1 to 3 are filled squares, gold, silver and bronze (`--ink`, `--tier-silver`, `--tier-bronze`), the figure in `--bg` (Craig, 27 Nov 2026).
- Colour is spent on meaning only, never to decorate: red and blue are prices and the bank; a rank's move
  in a league is green up and red down, as FPL's arrows (Craig, 24 Nov 2026; was `--text`). On
  Transfers, what a transfer changes is coloured (Craig, 26 Nov 2026, after it looked plain beside
  FPL and UCL Fantasy; `approved/transfers/`): green (`--add`) fills the bank chip and `+` and edges
  the bought player; red (`--rise`) fills the cost chip, the bank chip below zero and `×`.
- Never colour alone: a rise also has ▲, a fall ▼, live a dot and the word.

## Parts

Each part is drawn one way on every screen.

- **Page head:** title and hangul; ‹ week ›; the key figure; its tags; then up to three
  figures beside it, in `--mid` with the figure in `--text` (Craig, 16 Nov 2026) (`Average 79  Highest 136 ›`).
- **Tag:** a square box, 1px rule, 12px (Craig, 16 Nov 2026: up from 11, the plate's smallest size), sentence case: `Live`, `Not final`, `Final`. No team cap tag; on Points and Perfect game `Final` is the head's tag alone, never a result's note (Craig, 16 Nov 2026).
  `Live` is filled `--text` with `--bg` words (Craig, 16 Nov 2026). `Not final` is dashed.
- **View toggle:** butted keys on `--fill`, the chosen one on `--paper`: `Rift view | Card view`.
- **Tabs** (a page's or a card's sections): words in a row, the chosen one `--text` with a 2px
  `--text` underline (Craig, 16 Nov 2026).
- **Top bar**, on `--band`, the same on every screen: `Flol`, Home, Pick Team, Transfers, Points, Leagues, Stats,
  LCK, `● Live` (its dot always shown); at the right `presented by [Sponsor]` and the account menu
  `Baron Steal FC ▾`, or `Log in ›` for a visitor, whose bar shows only Stats and LCK (Craig,
  16 Nov 2026).
- **A link** ends with `›`, in `--text` (Craig, 16 Nov 2026), and names where it goes: `Full stats ›`. Not underlined, save
  a link inside a sentence. A link leaving Flol ends with `↗`.
- **Deadline**, one way everywhere: `Deadline Wed 7:45am` and the countdown `9h 45m`, a figure in `--mid` with no box round it (Craig, 19 Nov 2026). On Home alone the countdown is the page's one key figure, 44 in `--text` with its units 20 in `--mid`, the time under it in `--mid` (Craig, 27 Nov 2026: it needs to pop; `approved/home/`).
- **Times:** the manager's own only, with no zone, in am/pm: lower case, no space, no leading
  zero (`8:00am`, `10:30pm`) (Craig, 19 Nov 2026). Game clocks (`12:04`) stay as they are. A column
  of times has a head.
- **Your player:** an 8px round `--text` dot after the name (Craig, 16 Nov 2026). **May not start:** the tag `Not starting`.
- **Table:** name far left (after its slot, where a table lists a team) with team after it, figures right-aligned, 40px rows, 12px heads
  in `--mid`. No action column: what you can do to a row goes in its panel on the right. Two exceptions,
  each a page's one job: Transfers' `+`, and a row's `›` where the row opens something.
- **The Rift**: square, as big as the first screen allows, at the main column's left, with the buffs, bench and Save in a column beside it the Rift's height (Craig, 19 Nov 2026; was 720 and centred). On a phone the whole Rift shows on the first screen and the bench sits below it, under the sticky Save bar (Craig, 19 Nov 2026). Each tile as FPL's: the
  shirt on a faint card with a rounded top, the one rounded shape; C and a news flag at its top corners; `Flex` or `Coach` over a Flex's or Coach's shirt, nothing under it; a white
  name plate; a dark band of fixtures, or points and series; on Transfers the price in a dark chip over it.
- **The bench**, in Rift view: one bar, `Bench` then the Rift's own tile per bench
  player under its order and role (`1. Mid`), as FPL's bench under the pitch (Craig, 16 Nov 2026).
- **Card view**: the 7 starters in one row, as the LCK broadcast's lineup (Top, Jungle, Mid, Bot,
  Support, Flex, Coach). Its bench is the starters' own card, not the Rift's tile: two cards in a
  `Bench` panel level with Buffs, each strip its order and role (`1. Mid`) (Craig, 25 Nov 2026).
- **Wide table** (Stats): the head and the name column stick; the table scrolls under them.
- **Long names** end in `…` at their column's width; the full name shows on hover and in the panel.
- **Panel** (Pick Team's buffs, bench and Save, a tapped player's card, the week's series): on
  `--paper` with a 1px `--line` round it, a 2px `--text` rule on top, its title 16/700 and its
  contents 16 in. One treatment for every panel; a screen's side sections become panels as it is
  redrawn. From Transfers on, a panel's title sits on a `--head-band` band in place of the 2px rule
  (Craig, 26 Nov 2026); Pick Team's panels follow when it is next redrawn.
- **The player's card** under the Rift (Points, Transfers; Craig, 27 Nov 2026, `approved/points/README.md`): its head is the
  panel's `--head-band` on one line, read as a tile: crest 32, the role in a `--band` strip, the team's bar and code, the
  name 20/700, the key figure 28 at the right; nothing under the name. Its body is ruled, never tiles. A result is an
  outlined 24px chip, `W` in `--up` and `L` in `--down`; `Live` is the filled tag; counted points sit in a 1px `--text`
  box, dropped ones in `--mid` with none.
- **Marks:** C is round, and so are the live dot, your-player dot (8px, after the name)
  and a radio button. C is gold (`--ink`), its letter `--on-ink`. A crest keeps its team's shape (`approved/crests/`). Everything else is square, radius 0, save a Rift tile's card (Craig, 16 Nov 2026).
- **A team's colour** is a 4px bar before its code, 6px in Transfers' lists (Craig, 26 Nov 2026), wherever a list names a team (Craig, 24 Nov 2026:
  the look needed a little colour; `approved/team-colour/`): the kit's first colour that shows on
  the navy. A fixture, a row about two teams, shows each team's kit at 28px either side of its time
  in the bar's place. Never a tinted row, a wash or a coloured code.
- **Your players** are marked by that dot, on every screen.
- **A key that ends something** (Delete league, Leave) has a `--down` edge in its confirm sheet, and is a plain key elsewhere (Craig, 27 Nov 2026).
- **Your own row** in a league table or the tier panel is filled (`--fill`) with a 4px `--text` left edge, and no dot (Craig, 27 Nov 2026).
- **A league's mark** (Leagues' side list; Craig, 27 Nov 2026): 20px before its name. Overall its tier shield, a country its flag, a team its crest, a private league a group in `--text`.
- **A fact's mark** (Home's Star, Flop and All managers, Points' Star, Flop and Killer; Craig, 27 Nov 2026, "keep them", after the pages read dull): a 20px mark before the fact's word, its colour the one that fact already has elsewhere: Star a gold star, Flop a red falling line, Killer crossed swords in `--text`, having no colour of its own (Craig, 27 Nov 2026), Most captained the Captain's C, Most bought a green plus in a ring and Most sold a red minus in a ring, as Transfers' Buy and Sell. One mark a fact, the same on every page.
- **A scoring line's mark** (Series; Craig, 27 Nov 2026, after the page read as text and squares): a mark, drawn for Flol with none of Riot's artwork, for each scoring line a player or coach earned in a game, on a 32px filled square over the line's word, centred, on Series' Events tab (Craig, 27 Nov 2026; was 28px before the word, heading a team's table); never alone under a player's K/D/A, where it meant nothing (Craig, 27 Nov 2026). A coach's game cell carries his lines' marks bare, at 20px, Events naming them. Each line's mark has its own colour (Craig, 27 Nov 2026, the page still short of colour): red for blood and deaths, gold for gold and the crown, orange drakes, purple Baron, teal Elder, blue tower, yellow steal, green for the clean lines. Kills, deaths and assists are a single sword, a skull and a hand, crossed swords being Killer's. On Series each K/D/A figure sits behind its own mark, kills in `--text`, deaths red, assists green, never as `3/2/9` (Craig, 27 Nov 2026: he could not tell which was which). Player of the Game is a crown in `--ink`, the star being Star's. One mark a line, the same on every page; the set is `approved/series/`, Marks.
- **A player named in a row** reads as his tile's plate: his team's bar and code, then his name, `T1 Faker`; never a bare name (Craig, 27 Nov 2026; `approved/home/`).
- **Section that opens and closes** (Help, as FPL's): a 48px row, its title 16/600 at the left and
  ▾ or ▴ in `--mid` at the right, a 1px `--line` under it; open, its text sits under the title with
  24px below. A group of them opens with a 20/700 heading over a 2px `--text` rule.
- **Guide page** (Help's guide): one section at a time, its title 28/700, chosen from the side menu
  (the current line 600 in `--text` with a 2px `--text` edge at its left); under it a 1px `--line`
  and Back `‹ title` at the left, Next `title ›` at the right, both 600.
- **Worked example** ("Say…"): its own paragraph, 14px `--mid`, 16px in from a 2px `--line` rule at
  its left; its numbers in `--text`.
- **Modal** (a card, a sheet): a dimmed page behind, `✕` top right, Esc closes, focus stays
  inside. A card is 1056 wide; a sheet 544.
- **Form:** label above its field, 14px; the field 40px tall, 1px `--line`, `--text` when focused;
  an error is one line in `--text` under the field with a 1px `--text` edge on the field (Craig, 16 Nov 2026).
- **A buff**: its gold icon, its name, its state under it (`Available`, `On this week`, `Unavailable` or `Played Week 3`), and an outlined key: `Play` when available, `Cancel` when on this week, none otherwise, as FPL's chips. What it does is its hover (spec/06). Never a count left (Craig, 19 Nov 2026).
- **One main action** per screen, filled `--ink` gold with `--on-ink` words, `Save team` (Craig, 16 Nov 2026). Everything else is a link or
  an outlined key, save Transfers' small `+` and `×` and its card's `+ Buy` and `× Sell`, filled green and red (Craig, 26 Nov 2026).
- **Placeholders** (sponsor, photo) are dashed `--soft` boxes with one word.
- **A page that shows a sponsor** ends with `All sponsors are made up.`, 12px `--mid`
  (spec/13).

## States

Every screen part is drawn for each state it can be in.

- **Hover:** a row gets `--fill`; a link or key its 1px `--text` underline, 4px below (`.hover-line`), or edge (Craig, 16 Nov 2026).
- **Focus:** a 2px `--signal` ring, always shown (Craig, 16 Nov 2026).
- **Disabled:** one look for every key, `.key-off`: text `--mid` on `--fill`, no edge, with the reason beside it (`No changes`).
- **Loading:** the layout drawn with `--fill` bars where figures go; no spinners.
- **Empty:** a title and at most one short line (`No moves yet`).
- **Error:** a title and one line, and `Try again ›` where trying again can help.
- **Motion:** 150 to 250ms, ease-out; a changed live figure fades in. With reduced motion, nothing
  moves.

## Words

Prose (Help, and any page that explains in sentences) is written as a friend who plays would explain
it (Craig, 17 Nov 2026, the Help round):

- Full sentences to "you", with contractions; one rule per sentence, condition first.
- Plain words, not labels: "your first bench player", never "bench 1".
- A game term gets a few words of explanation the first time it appears, in the same sentence.
- Where a rule could trip someone up, one worked example with real names and numbers, starting "Say".
- Cut anything a reader doesn't need to play.

Everywhere:

- UK English, sentence case everywhere: `Live`, never `LIVE`.
- The shortest label that's still clear: `Pts`, `Owned`, `Price`.
- A state is a word or a tag, never a sentence.
- No line explains what a manager already knows, what a page is for, or what a control does
  when its label says it. Flol's own rules (Captain ×1.5, the team cap) are named where they apply.
- An empty state is a title and at most one short line.
- Absence is `—`, never `0`.
- Money as `₩18.5m` (spec/02). Times in the viewer's own time, as `Sat 10:00pm`.
- One name per thing on every screen: Captain, never Carry; Price changes, never Patch update; Cheer and Jeer, never Truck;
  `Week 4`, never Gameweek.
- No emoji, save the birthday cake (spec/13).
- One made-up dataset: where two pictures show the same finished series, they show the same
  numbers.

## Korean feel

- Hangul beside each page title, and on the names Flol takes from the LCK.
- Rises red, falls blue, as Korean markets show them.
- The LCK's own words for its things: series, POG, Bo3, Week 3.

## Never

1. A row of stat tiles, a card around every section, or small capitals over big numbers.
2. Pills, rounded corners, tinted badges, gradients, glow or soft shadows. A cheer's or jeer's LED
   panel is a picture: dotted, in capitals, the same on every screen.
3. Keys and legends: the heads and marks carry it.
4. A landing page's furniture: a hero band, a centred marketing line, space used as decoration.
5. Two names, two sizes or two styles for one thing.
6. A second filled button on a screen.

## The phone

Drawn for Pick Team alone (`approved/pick-team/390.png`; its rules are under Parts, The Rift). Every
other screen gets its own round: one column, the side column below the main, targets 44px.

## Accessibility

- Text 4.5:1 against its ground, large text and marks 3:1.
- Every target at least 24px on the desk, 44px on the phone.
- Focus always shows: a 2px `--signal` ring (Craig, 16 Nov 2026).
