# The design foundations: built in Flol, then carried to other repos

**Contents:** [The four foundations](#the-four-foundations) · [The look, said once](#the-look-said-once) ·
[The trial fills them](#the-trial-fills-them) · [Order of work](#order-of-work) · [Watch for](#watch-for) ·
[Taste log](#taste-log)

What goes to Forge is the foundations, not the process (Craig, 18 Nov 2026): the files another repo
drops in and fills. Flol is the first repo built on them, which is what proves they travel. The process
(`/design`, the panel, this trial) stays light and lives in each repo. `plate.md` stays binding until
Craig approves a picture that changes it. The long first draft is background in
`docs/research/design-without-slop/template-long-draft/`.

## The four foundations

| Foundation | What it is | Starts from, in Flol | What changes |
|---|---|---|---|
| 1. Token layers | Every colour, font, size, gap and width, in three layers with the same keys: the app's core, the game, the league. Named by job, never by colour. | `src/theme/tokens.ts`: one layer, 122 values; `theme.test.ts` already fails a value anywhere else | Split into layers, checked by the type system; `gold`, `teal` renamed by job; a contrast test per league; KST and ₩ move out of `src/parts/text/time.ts`, `money.ts`, `Deadline` and `Time` into league data |
| 2. Design file | One short file: a statement of the look first, then colour roles, type, spacing and density, tables and figures, states, the phone, and a short Never list | `docs/design/plate.md` (197 lines) | A blank template a repo fills in; Flol's plate reshaped to it once the trial's look is approved |
| 3. Base parts | The parts every dense data app needs, drawn only from tokens: table, figure, money and time formats, tag, empty, loading and error states, sheet, toast, tabs, select, field, main action, sticky bar, page frame and heads | `src/parts/` (`display`, `controls`, `frame`, `text`) | Split what any app needs from what only Flol has; Flol's own parts (crest, LED panel, tier shield, buff card, the Rift) stay in Flol |
| 4. Slop lint | A script that fails a mock-up or built page showing a tell a script can see; each repo sets each rule's level | The EPL app's `tools/ui/designlint.mjs` (nine checks) | Ported, with a per-repo config; the rules in the long draft's `core/lint-spec.md` added one by one as they prove themselves |

Parts travel to repos on the same stack (React). A repo on another stack takes the tokens, the design
file and the lint only. Check each sibling repo's stack before its move.

## The look, said once

A draft for Craig to correct. It fills the design file's first section.

> A broadcast desk for a League league. Square, ruled and dense, on a neutral ground. The league
> brings the colour: navy and gold for the LCK. It reads as League through roles, the Rift, sides and
> the way stats are written, with none of Riot's artwork. Hangul is set as design, in Pretendard,
> beside a Latin face that is not Inter. One object carries each screen.

## The trial fills them

The trial picks the values; its output is the foundations filled in for Flol, not a picture alone.

1. **One screen: Pick Team** (Craig, 18 Nov 2026), because it holds the Rift, the object the look
   should come from. One made-up dataset, where one fact has one value everywhere.
2. **Three directions,** each written first as token values (ground, accent, type pair, row height,
   what sits above the fold), then drawn at 1440 and 390. Directions that differ only in colour count
   as one. Before drawing, each choice is asked: would I do this for any similar page?
3. **The control:** the same screen drawn with today's `/design` by a session that hasn't read this.
4. **The lint** runs on every picture; the panel reviews them blind, lettered, with a ringer
   (`panel-rules.md`); Craig picks blind.
5. **The winner becomes files:** its values in the token layers (core and LCK), its statement and
   rules in the design file, the base parts restyled from those tokens. If Craig prefers the control
   or can't tell them apart, the kit's look is dropped and the token split and lint still stand.

## Order of work

1. **The slop lint** (foundation 4). First, before any redraw (Craig, 18 Nov).
2. **The token split** (foundation 1). No visual change: layers, job names, KST and ₩ out of code.
   Tests prove nothing moved.
3. **The trial** fills the core and LCK layers and the design file (foundation 2).
4. **Base parts** restyled from the new tokens (foundation 3); screens follow, one `/design` round each.
5. **The LEC layer,** when the LEC is specced: the same screen in both leagues must look like two
   leagues, from token values alone.
6. **Forge:** the four foundations move in. First outside test: the EPL app.

## Watch for

The plate's six Never items bind. These came from the 18 Nov site walk; each is a finding for Craig,
never a rule, until he says so. When one is removed, look at what replaced it: a model falls back to
the next default.

1. A box for every state, so every state looks the same.
2. The figure face on dates, times and labels.
3. A row of equal-weight keys on one object.
4. One page skeleton on every page.
5. Dashed placeholder boxes setting a built page's rhythm.
6. Generic items where the game has real ones.
7. Unselected items greyed, so the page looks disabled.
8. Filter chips as pills, the chosen one filled.
9. A control that does nothing and says nothing.

## Taste log

Craig's reactions to pictures, in his words, dated, each with its picture. Read before any design work.

| Date | Picture | Craig said |
|---|---|---|
