# Core rules

**Contents:** [How to use it](#how-to-use-it) · [Structure](#structure) · [Colour](#colour) · [Type](#type) ·
[Layout](#layout) · [Parts](#parts) · [The subject's object](#the-subjects-object) ·
[Tables and figures](#tables-and-figures) · [Charts](#charts) · [States](#states) · [Words](#words) ·
[Data](#data) · [The phone](#the-phone) · [Accessibility](#accessibility)

## How to use it

- The rules every project shares. A kit file: read here, never copied into a project's design file.
- A project's design file holds only its values, its choices and its exceptions. An exception cites the
  rule ID with the owner's reason and date: `Off: CO4 on the fixture cell. aria-label carries it. (Owner, 2 Nov 2026)`.
- Every number a rule needs (how many sizes, accent jobs, tags) is a value in the project's
  `.studio/design.json`, never a constant here.
- Marks: `[test]` token test, `[lint]` slop lint (rule ID after it), `[render]` render check, `[panel]`
  review panel, `[owner]` the owner (`checks.md`).
- Foundations: WCAG 2.2 AA for access; Anthropic's frontend-design skill for structure and words.

## Structure

- **SI1** Every border, number, eyebrow, divider, icon and fill says something true. One that says nothing
  goes. The general rule behind G10, D3 and S4. `[panel]`
- **SI2** A numbered marker only for a real sequence. `[lint]` `numbered-labels`

## Colour

- **CO1** Every colour token has a role and a "when used" line; without one, Claude guesses. `[panel]`
- **CO2** Nothing outside the token file holds a colour. `[test]`
- **CO3** Colour carries meaning only; the file names each meaning. `[panel]`
- **CO4** Never colour alone: each meaning colour also has a mark or a word. `[lint]` `colour-alone`
- **CO5** The accent does only the jobs the file names, no more than `limits.accentJobs`. `[lint]` `accent-count`

## Type

- **TY1** Only the families in config; none on the Never list. `[lint]` `font-family`
- **TY2** Sizes from the scale; nothing under the smallest. `[test]` `[lint]` `type-scale`
- **TY3** Weights from the file. `[test]`
- **TY4** The figure face (a mono, or tabular figures) only on runs that match `figures.patterns`. `[lint]` `figure-face`
- **TY5** Sentence case. Capitals only on `caps.allow` and the acronyms in `caps.words`. `[lint]` `caps`
- **TY6** Prose lines stay under 80 characters. `[lint]` `measure`

## Layout

- **LA1** One spacing scale. Declared values only; `auto` and percentages are not spacing. `[test]` `[lint]` `space-scale`
- **LA2** Closer inside a group than between groups. `[panel]`
- **LA3** Every page uses one of the file's named page variants. `[panel]`
- **LA4** The file's fold item shows at each shot size. `[render]`
- **LA5** No fixed or sticky element covers content at any shot width. `[lint]` `overlap`
- **LA6** No empty vertical band taller than `limits.deadBand` inside the page. `[lint]` `dead-band`
- **LA7** Rows and cell padding within the file's maxima. `[lint]` `row-height`, `cell-padding`
- **LA8** At every width in config: no sideways page scroll, no clipped text. `[lint]` `h-scroll`, `overflow`

## Parts

- **PA1** Each part drawn one way on every screen; no local restyle. `[lint]` `part-drift`
- **PA2** At most one filled key per screen. `[lint]` `filled-keys`
- **PA3** Three or more actions on one object: one leads, the rest are links. `[panel]`
- **PA4** A modal opens over the page that opened it, the nav marks that page, and its dim covers the whole
  page. Esc closes, focus stays inside, the page behind is inert. `[lint]` `modal-context`, `scrim`; `[render]`
- **PA5** Depth only by the file's means. `[lint]` `soft-shadow`, `glow`, `blur`
- **PA6** Corners from the file's radius; at most two boxes deep, save named parts. `[lint]` `radius`, `pill`, `nesting`

## The subject's object

The one thing only this product's world has (a pitch, a board, a ticket).

- **OB1** One part, drawn in every mode from one component, with a grid of its modes against its states. `[panel]`
- **OB2** Every view of it (map, cards, list) reads one data source. `[panel]`
- **OB3** One mark rule per context: tile, row, card. `[panel]`
- **OB4** The same slot sits in the same place on every page that shows it. `[lint]` `layout-drift`
- **OB5** Unselected items stay readable: contrast is measured after opacity. `[lint]` `contrast`

## Tables and figures

- **TF1** Names left, figures right-aligned. `[lint]` `figure-align`
- **TF2** A figure carries its comparison where one exists; a bare figure in a box is a stat tile. `[panel]`
- **TF3** A line of figures is label and figure on one baseline at body size: `Played 12  Won 8  Points 26`.
  One key figure per page. `[lint]` `key-figure`, `stacked-figures`
- **TF4** A long name ends in `…` at its column's width; the full name is one hover or tap away. `[render]`
- **TF5** Wide tables group their columns; the head and the name column stick. `[panel]` `[render]`
- **TF6** Numbers follow `formats`; a minus is `−`, not `-`. `[lint]` `number-format`, `minus`
- **TF7** No action column, save the file's named exceptions. `[panel]`
- **TF8** No zebra stripes or podium tints unless the file chooses them. `[lint]` `zebra`, `podium`

## Charts

- **CH1** Only the charts the file names. Claude adds none. `[panel]`

## States

- **ST1** Every part is drawn in each state it can be in. Each state has a fixture in the dataset and a route
  or query that shows it. `[lint]` `state-coverage`
- **ST2** Focus always shows. `[lint]` `focus-visible`
- **ST3** A disabled key has its reason beside it. `[lint]` `disabled-reason`
- **ST4** Loading draws the layout with fill bars where figures go; no spinner. `[lint]` `spinner`
- **ST5** Empty sits where the content would, aligned to the layout: a title and at most one short line, no
  picture or icon. `[panel]`
- **ST6** Error says what went wrong and how to fix it, never sorry; a retry link where retrying helps. `[panel]`
- **ST7** Not found gives a way on. `[panel]`
- **ST8** Done: a saved action says so in its own word (`Save` → `Saved`), in the look and place the file names. `[panel]`
- **ST9** An action you can't take shows why; never silent. `[panel]`
- **ST10** Nothing loops: no pulsing dot, marquee or bounce. `[lint]` `loop-motion`

## Words

- **VO1** One name per thing; banned synonyms in config. `[lint]` `banned-word`
- **VO2** An action keeps its name through the flow (`Save team` → `Saved`). `[panel]`
- **VO3** Keys are active verbs naming the result: `Save team`, never `Submit` or `OK`. `[lint]` `vague-key`
- **VO4** A state is a word or a tag, never a sentence. `[lint]` `explainer`
- **VO5** No explainer lines outside the prose containers the file names. `[lint]` `explainer`; `[panel]`
- **VO6** Absence shows one way, named in the file. `[panel]`
- **VO7** Real copy in every mock-up; never lorem. `[lint]` `lorem`
- **VO8** Names the file lists as never shown stay off screen. `[lint]` `hidden-name`

## Data

- **DS1** One made-up dataset, in one file; every mock-up and preview draws from it. Its story is the owner's. `[owner]`
- **DS2** A drawn fact carries its key (`data-fact`); one key shows one value across pages. `[lint]` `fact-mismatch`
- **DS3** Sums shown add up. `[panel]`
- **DS4** The dataset carries the extremes: the longest real names; names in the second language; the largest
  values (a 7-digit rank); a negative; a zero and an absence; a tie; a figure mid-update; 0, 1 and many rows
  for every list. `[panel]` on the dataset file

## The phone

- **PH1** Before any phone design, every screen renders at the phone and in-between widths with no sideways
  scroll and nothing clipped. `[lint]` `h-scroll`, `overflow`, `overlap`
- **PH2** Once drawn: targets 44px. A whole row is the target; marks inside it are not. `[lint]` `target-size`
- **PH3** Every fact shown on hover is also reachable by tap. `[panel]`
- **PH4** The fold item shows at the phone shot size. `[render]`

## Accessibility

- **AC1** Text 4.5:1 on its ground; large text and marks 3:1; checked for every brand. `[test]` `[lint]` `contrast`
- **AC2** Targets at least 24px on the desktop. `[lint]` `target-size`
- **AC3** Heading levels never skip. `[lint]` `heading-skip`
