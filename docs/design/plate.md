# Plate: the design standard

**Contents:** [Frame](#frame) · [Spacing](#spacing) · [Type](#type) · [Colour](#colour) · [Parts](#parts) ·
[States](#states) · [Words](#words) · [Korean feel](#korean-feel) · [Never](#never) ·
[The phone](#the-phone) · [Accessibility](#accessibility)

Every screen is drawn to this file. An approved picture in [approved/](approved/README.md) settles a
screen's layout (what sits where); this file settles how it is drawn (frame, spacing, type, colour,
words). Where the two disagree, the picture is redrawn to this file, or Craig is asked.

The rules come from general practice: WCAG 2.2 AA, Nielsen's ten heuristics, and Refactoring UI's rules
on hierarchy and spacing. On top of those sit Craig's own calls: FPL's structure, a Korean feel, the
shortest label, no explainer lines. The values are the ones the approved pictures already use most,
tightened to a few.

## Frame

- Drawn 1440 wide. Top bar, then the page: 32px each side, 24px above, 48px below.
- Two columns: the main column, and a side column 360px wide, 32px apart. The side column is on
  the right, save Leagues, whose list of leagues is on the left.
- The right column is a stack of titled sections. Each opens with a 2px ink rule and a 14px
  title, its count or state after the title in mid grey. A tapped player's panel goes at the top.
- The first row of a screen's main table or picture shows above the fold at 1440 × 900.

## Spacing

- One scale, in px: 4, 8, 12, 16, 24, 32, 48. No other gap, padding or margin.
- Related things sit closer than unrelated ones: 8 inside a group, 16 between rows of groups,
  24 between sections, 32 between columns.

## Type

- Words in IBM Plex Sans KR, Korean included. Figures in IBM Plex Mono, so they line up.
- Six sizes: 12, 14, 16, 20, 28, and 44 for the page's one key figure. A player's or coach's
  card names him at 40/700, his hangul at 20, as a broadcast lower third (Craig, 15 Nov 2026). Nothing under 12, except
  a tag's 11.
- Three weights: 400, 600, 700.
- One page title, 28/700, with its hangul after it in 16/400 mid grey: `Leagues 리그`. On Points
  and Home the title is your team's name: `Baron Steal FC 바론 스틸 FC`.

## Colour

| Token | Value | Use |
|---|---|---|
| `--ink` | #1d1d1d | text, rules, the selected thing |
| `--mid` | #6b6b6b | secondary text (5.3:1 on `--paper`) |
| `--soft` | #9a9a9a | never text; dashed outlines and placeholders only (2.8:1) |
| `--line` | #cfcfcf | table rules |
| `--fill` | #ececec | a selected row, a toggle's ground |
| `--bg` | #f7f7f5 | the page |
| `--paper` | #fff | panels and tables |
| `--rise` | #c8102e | a price rise, Korean red |
| `--fall` | #1f4fa8 | a price fall, Korean blue |
| `--gold` | #d9bd7a | the hangul on your team's banner, and only there; its rule #b39550 |
| `--stage` | #1b1b1b | Live's dark stage; its grey text is #999 (4.5:1) |

- Grey until the look is chosen. Colour is spent on meaning only, never to decorate: red and
  blue are prices only; a rank's move stays ink.
- Never colour alone: a rise also has ▲, a fall ▼, live a dot and the word.

## Parts

Each part is drawn one way on every screen.

- **Page head:** title and hangul; ‹ week ›; the key figure; its tags; then up to three
  figures beside it, in mid grey with the figure in ink (`Average 79  Highest 136 ›`).
- **Tag:** a square box, 1px rule, 11px, sentence case: `Live`, `Not final`, `Final`, `Cap 2`.
  `Live` is filled ink. `Not final` is dashed.
- **View toggle:** butted keys on `--fill`, the chosen one on `--paper`: `Rift view | Card view`.
- **Tabs** (a page's or a card's sections): words in a row, the chosen one ink with a 2px
  underline.
- **Top bar**, the same on every screen: `Flol`, Home, Pick Team, Transfers, Points, Leagues, Stats,
  LCK, `● Live` (its dot always shown); at the right `presented by [Sponsor]` and the account menu
  `Baron Steal FC ▾`, or `Sign in` for a visitor.
- **A link** ends with `›`, in ink, and names where it goes: `Full stats ›`. Not underlined, save
  a link inside a sentence. A link leaving Flol ends with `↗`.
- **Deadline**, one way everywhere: `Deadline Wed 07:45  16:45 KST` and the countdown `9h 45m`.
- **Times:** your time first, then KST in mid grey: `Sat 22:00  07:00 KST`. A column of times
  has a head.
- **Your player:** an 8px round ink dot after the name. **May not start:** the tag `Not starting`.
- **Table:** name far left (after its slot, where a table lists a team) with team after it, figures right-aligned, 40px rows, 12px heads
  in mid grey. No action column: what you can do to a row goes in its panel on the right. Two exceptions,
  each a page's one job: Transfers' `+`, and a row's `›` where the row opens something.
- **The bench**, under the Rift or the cards: one compact bar, `Bench` then a slim tile per
  bench player (order, role icon, name, team, then fixtures or points). Never a band of big shirts.
- **Card view**: the 7 starters in one row, as the LCK broadcast's lineup (Top, Jungle, Mid, Bot,
  Support, Flex, Coach), then the bench bar.
- **Wide table** (Stats): the head and the name column stick; the table scrolls under them.
- **Long names** end in `…` at their column's width; the full name shows on hover and in the panel.
- **Marks:** C and V are round, and so are the live dot, your-player dot (8px, after the name),
  a crest and a radio button. Everything else is square, radius 0.
- **Your players** are marked by that dot, on every screen.
- **Modal** (a card, a sheet): a dimmed page behind, `✕` top right, Esc closes, focus stays
  inside. A card is 1056 wide; a sheet 544.
- **Form:** label above its field, 14px; the field 40px tall, 1px `--line`, ink when focused;
  an error is one line in ink under the field with a 1px ink edge on the field.
- **A buff** shows its name, one line on what it does (spec/06), how many are left, and Play.
- **One main action** per screen, filled ink (`Save team`). Everything else is a link or
  an outlined key.
- **Placeholders** (sponsor, photo) are dashed `--soft` boxes with one word.
- **A page that shows a sponsor** ends with `All sponsors are made up.`, 12px mid grey
  (spec/13).

## States

Every screen part is drawn for each state it can be in.

- **Hover:** a row gets `--fill`; a link or key its 1px ink underline or edge.
- **Focus:** a 2px ink ring, always shown.
- **Disabled:** text `--mid` on `--fill`, no edge, with the reason beside it (`No changes`).
- **Loading:** the layout drawn with `--fill` bars where figures go; no spinners.
- **Empty:** a title and at most one short line (`No moves yet`).
- **Error:** a title and one line, and `Try again ›` where trying again can help.
- **Motion:** 150 to 250ms, ease-out; a changed live figure fades in. With reduced motion, nothing
  moves.

## Words

- UK English, sentence case everywhere: `Live`, never `LIVE`.
- The shortest label that's still clear: `Pts`, `Owned`, `Price`.
- A state is a word or a tag, never a sentence.
- No line explains what a manager already knows, what a page is for, or what a control does
  when its label says it. Flol's own rules (Carry ×1.5, the team cap) are named where they apply.
- An empty state is a title and at most one short line.
- Absence is `—`, never `0`.
- Money as `₩18.5억`. Times in the viewer's own time, as `Sat 22:00`.
- One name per thing on every screen: Carry, never Captain; Patch update, never Price changes;
  `Week 4`, never Gameweek.
- No emoji, save the birthday cake (spec/13).
- One made-up dataset: where two pictures show the same finished series, they show the same
  numbers.

## Korean feel

- Hangul beside each page title, and on the names Flol takes from the LCK (`Coach 감독`).
- Rises red, falls blue, as Korean markets show them.
- The LCK's own words for its things: series, POG, Bo3, Week 3.

## Never

1. A row of stat tiles, a card around every section, or small capitals over big numbers.
2. Pills, rounded corners, tinted badges, gradients, glow or soft shadows. A truck's LED
   panel is a picture: dotted, in capitals, the same on every screen.
3. Keys and legends: the heads and marks carry it.
4. A landing page's furniture: a hero band, a centred marketing line, space used as decoration.
5. Two names, two sizes or two styles for one thing.
6. A second filled button on a screen.

## The phone

Not drawn yet. It gets its own round: one column, the side column below the main, targets 44px.

## Accessibility

- Text 4.5:1 against its ground, large text and marks 3:1.
- Every target at least 24px on the desk, 44px on the phone.
- Focus always shows: a 2px ink ring.
