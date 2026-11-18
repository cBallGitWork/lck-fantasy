# Never: the default list

**Contents:** [How to use it](#how-to-use-it) · [Never: data apps](#never-data-apps) · [Watch](#watch) ·
[Appendix: generic tells](#appendix-generic-tells)

## How to use it

- A kit file: read here, never copied. The project's design file lists, under Do's and Don'ts, each ID it
  turns off (owner's reason and date) and its own additions.
- **Evidence:** strong (first-party, or three or more independent sources or walkers), moderate (two),
  weak (one, or the kit's own judgement), owner (a call made in Craig's project plates). Sources are in
  Forge's `sources.md`, beside the kit.
- **Catch:** `source` (lint reads HTML and CSS), `rendered` (lint reads the drawn page), `panel`. IDs are
  `lint-spec.md`'s.
- **Never** is absolute; keep it short. **Watch** is what Claude falls back to once Never is banned. A
  Watch tell moves to Never only when a round shows it appearing as a default, not a choice.
- Banning a tell pushes Claude to the next default ("the cure becomes the tell"). Each look round asks what
  the picture used instead, and the answer grows Watch. Review the file when the model changes.

## Never: data apps

| ID | Tell | Evidence | Catch |
|---|---|---|---|
| D1 | A row of boxed label-over-number tiles with no comparison | strong: 4 walkers, Anthropic skill | rendered: `stat-tiles` |
| D2 | A card per item, each with a grey explainer line and a key | moderate: 3 walkers (1 for) | rendered: `card-grid` |
| D3 | A box for every state, so every state looks the same | weak: 1 walker | rendered: `tag-count` |
| D4 | The figure face on dates, times and labels: the page reads like a terminal | strong: Anthropic skill, Opus 5.5 guide, 1 walker | rendered: `figure-face` |
| D5 | A row of equal-weight keys on one object | weak: 1 walker | rendered: `filled-keys`; panel |
| D6 | One page skeleton on every page | weak: 1 walker | panel |
| D7 | Dashed placeholder boxes setting a built page's rhythm | strong: 4 walkers | rendered: `placeholder` |
| D8 | One fact, two values on two screens | strong: 4 walkers | rendered: `fact-mismatch` |
| D9 | Explainer lines: telling a user what they already know | owner: 3 plates; moderate: 2 walkers | rendered: `explainer` |
| D10 | Generic items where the subject has real ones (template shirts, a code for a crest) | moderate: 2 walkers | panel |
| D11 | Unselected items greyed, so the page looks disabled | moderate: 2 walkers | rendered: `contrast` |
| D12 | Wide empty bands and dead lower halves | weak: 1 walker | rendered: `dead-band` |
| D13 | A choice list as a stack of identical bordered buttons | moderate: 2 walkers | panel |
| D14 | Filter chips as pills, the chosen one filled | weak: 1 walker (pills: G4) | rendered: `pill` |
| D15 | Silent failure: a control that does nothing and says nothing | strong: 4 walkers | panel |
| D16 | A modal's dim stops short of the page | moderate: 2 walkers | rendered: `scrim` |
| D17 | A fixed or sticky bar covering content | strong: 4 walkers | rendered: `overlap` |
| D18 | A modal over a blank page, the nav marking the wrong tab | strong: 4 walkers | rendered: `modal-context` |

## Watch

Not wrong in themselves; wrong when nobody chose them.

| ID | Tell | Evidence | Catch |
|---|---|---|---|
| S1 | A teal or cyan accent everywhere | weak: 1 source | rendered: `accent-count` |
| S2 | A blinking or pulsing status dot | moderate: 2 sources | source: `loop-motion` |
| S3 | Container soup: boxes three or more deep | moderate: 2 sources | rendered: `nesting` |
| S4 | A left accent bar on every card or callout | moderate: 2 sources | rendered: `accent-bar` |
| S5 | A default serif headline | weak: 1 source | rendered: `font-family` |
| S6 | Cream ground, high-contrast serif display, terracotta accent | strong: Anthropic skill, Opus 4.8 guide | rendered: `palette` |
| S7 | Near-black ground with one acid-green or vermilion accent | strong: Anthropic skill | rendered: `palette` |
| S8 | Broadsheet: hairline rules, zero radius, dense columns, mono labels | strong: Anthropic skill, Opus 5.5 guide | panel |
| S9 | Template chrome: `WORD — fragment` labels, `#0B0B0B` or `#111` blacks | strong: Anthropic skill | source: `chrome-black` |
| S10 | An icon tile over every heading | moderate: 2 sources | rendered: `icon-heading` |
| S11 | The same three-column grid on every section | weak: 1 source | panel |
| S12 | One gutter round everything | owner: 2 plates; moderate: 2 sources | rendered: `spacing-variety` |
| S13 | Restraint as identity: obeys every ban, still looks like any app | weak: the research report | panel: name the signature |
| S14 | The stat hero without boxes: label over a big figure, split by dividers | weak: kit | rendered: `stacked-figures`, `key-figure` |
| S15 | Table furniture: zebra rows, centred figures, equal-width columns, a sort arrow on every head, podium tints, an accent-tinted own row, "Showing 1–10 of 200", an icon in every cell | weak: kit | rendered: `zebra`, `podium`, `figure-align`; panel |
| S16 | Sports-app furniture: trading-card players with rarity gradients, a flame for form, medal colours, a green pitch with white lines, confetti or "Looking good!" on save, a diagonal versus split | weak: kit | panel; `gradient`, `podium` |
| S17 | Chart defaults: a donut for a share, a progress bar for a budget, a sparkline in every row, a radar on a player card | weak: kit | panel (CH1) |
| S18 | Stand-ins: icon boxes, initials circles, hatched or blurred boxes | weak: kit | panel |
| S19 | Phone collapse: rows turned into cards, a hamburger hiding the main jobs, the side column under a wide table, a desktop modal shrunk | weak: kit | panel |

## Appendix: generic tells

Mostly landing-page tells. The lint catches them; a design file only points here.

| ID | Tell | Evidence | Catch |
|---|---|---|---|
| G1 | Purple, indigo or blue-violet gradients; gradient washes | strong: Anthropic blog, Reddit | `gradient` |
| G2 | Gradient text | moderate: 2 sources | `gradient` |
| G3 | One radius on every card, with the same soft grey shadow | strong: Anthropic skill | `radius`, `soft-shadow` |
| G4 | Pill keys and pill chips | strong: Opus 5.5 guide | `pill` |
| G5 | Frosted glass | moderate: 2 sources | `blur` |
| G6 | Glow: neon accents, coloured blurred shadows | moderate: 2 sources | `glow` |
| G7 | Overused faces: Inter, Roboto, Arial, system UI, Geist, Space Grotesk | strong: Anthropic blog | `font-family` |
| G8 | Small tracked capitals over a heading or big number | strong: Anthropic skill; owner: 2 plates | `tracked-caps`, `caps` |
| G9 | One accented word in a headline | strong: Anthropic skill | `accent-word` |
| G10 | 01 / 02 / 03 labels with no real sequence | strong: Anthropic skill | `numbered-labels` |
| G11 | `A · B · C` middle-dot strings | strong: Anthropic skill; owner: 2 plates | `middle-dot` |
| G12 | `→` appended to keys and links | strong: Anthropic skill | `arrow-key` |
| G13 | Emoji as icons or in headings | moderate: 2 sources | `emoji` |
| G14 | Hero band, centred marketing line, three feature boxes | moderate: 2 sources; owner: plate | panel |
| G15 | Big number, small label, a row of stats | strong: Anthropic skill | `stat-tiles` |
| G16 | Fade-and-slide-up on every section; hover lift on every card | strong: Anthropic skill | `motion` |
| G17 | Keys and legends explaining what the heads should carry | owner: 3 plates | `key-heading` |
| G18 | A star typed as text (★) | owner: 2 plates | `typed-star` |
| G19 | Filler copy: generic claims, "not X, but Y", em-dash runs | moderate: 2 sources | `filler-copy` |
| G20 | Lorem ipsum or invented copy | moderate: Reddit (113 points) | `lorem` |
| G21 | Indigo or slate ground, lavender-grey text, a neon accent; gradient keys | owner: draft-platform plate | `palette`, `gradient` |
