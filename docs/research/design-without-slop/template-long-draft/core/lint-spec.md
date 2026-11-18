# The slop lint: spec

**Contents:** [What it is](#what-it-is) · [Where it starts](#where-it-starts) · [Two modes](#two-modes) ·
[Config](#config) · [Levels](#levels) · [Rules: source](#rules-source) · [Rules: rendered](#rules-rendered) ·
[Rules: across pages](#rules-across-pages) · [Exceptions](#exceptions) · [Output](#output) ·
[Its own tests](#its-own-tests) · [What it leaves to others](#what-it-leaves-to-others)

## What it is

A script that fails a page carrying a tell a script can see. It runs on mock-ups and on built pages. What a
script can't see goes to the review panel (`checks.md`). A spec only; no code.

## Where it starts

Two parents, both about 100 lines with no dependencies:

- **epl-draft-intel `tools/ui/designlint.mjs`:** `drawnText(html)` (drawn text, entities decoded),
  `styleRules(html)` (`[selector, body]` pairs), `lintPage(html)` (one line per problem). Its nine checks:
  middle-dot, key heading, typed star, source named on screen, radius, gradient, tracked capitals, backdrop
  blur, soft shadow.
- **draft-platform `scripts/design/lint.mjs`:** role initials read from the role catalogue, key heading,
  middle-dot; and `expand.mjs`, which turns a `.dc.html` board into the pages it holds.

Both print `file: problem` or `file: clean`; exit 0 clean, 1 findings, 2 usage. Keep that shape.

What changes: every project value moves to config; a rendered mode; a rule ID on every finding; three levels
set per rule by the project; across-pages rules; project rules as modules.

## Two modes

| Mode | Reads | Good for |
|---|---|---|
| Source | HTML and CSS as text, after `expand` | Mock-ups and boards; fast; Node only |
| Rendered | Each route at each width in a local headless browser: computed styles, boxes, text | Built pages; size, position, colour in use, contrast |

Rendered mode also runs every source rule on the served HTML and CSS.

## Config

The project's `.studio/design.json`. Every project value lives here, never in the script.

| Key | Holds |
|---|---|
| `tokens` | Path to the exported token values |
| `fonts` | Allowed families, each with its role |
| `sizes`, `spaces` | The type and spacing scales |
| `radius` | `default` (the house value), and `allow`: selector, value, reason |
| `gradient.allow`, `colour.allow` | Selectors that may use a gradient or a raw colour, each with a reason |
| `nesting.allow` | Parts that may sit three or more boxes deep |
| `caps` | `allow` (selectors) and `words` (acronyms allowed in capitals) |
| `figures` | `face`, and `patterns`: the regexes a figure run matches, tested on the dataset |
| `formats` | Patterns for money, times, dates and signed differences |
| `accent`, `primary` | The accent token and its jobs; how to find the one filled key |
| `meaning` | Each meaning colour, and the marks or words that must go with it |
| `emoji.allow`, `words.banned`, `keys.vague` | Allowed emoji; banned word → its replacement; vague key words |
| `names.hidden` | Names never shown on screen |
| `prose` | Containers where sentences are allowed, and explainer lines allowed by name |
| `limits` | `accentJobs`, `tags`, `explainerWords`, `emDashes`, `rowHeight`, `cellPadding`, `deadBand`, `keyFigureSize`, `stackFigure` |
| `widths` | `design`, `phone`, `between`, and `phoneDrawn` (true or false) |
| `fold` | Per route: the fold item and the fewest table rows above it |
| `routes`, `states` | Pages to shoot; each state with the route or query that shows it |
| `slots` | Groups of pages where a `data-slot` must sit in the same place |
| `levels` | Per rule: `off`, `flag` or `fail`, each change with a reason |
| `expand`, `rules` | A module that expands boards; project rule modules (role initials) |
| `dataset` | Path to the one dataset, for facts and pattern tests |

Starting values are the kit's call, not research: `tags` 6, `explainerWords` 8, `emDashes` 3, `deadBand`
160, `stackFigure` 20.

## Levels

- `fail`: the run fails. `flag`: the panel must answer it. `off`: not run.
- Each rule below has a default. A project changes it in `levels` with a reason; lowering a `fail` needs the
  owner's name and date, or the open call it waits on (`"off: waits on P3"`).
- At `widths.between`, and at `widths.phone` while `phoneDrawn` is false, only `h-scroll`, `overflow` and
  `overlap` run.

## Rules: source

| ID | Default | Detects |
|---|---|---|
| `gradient` | fail | `gradient(` off `gradient.allow` |
| `radius` | fail | `border-radius` other than `radius.default` off `radius.allow` |
| `soft-shadow` | fail | `box-shadow` with a blur of 10px or more |
| `blur` | fail | `backdrop-filter: blur` |
| `glow` | fail | A `box-shadow` or `text-shadow` with a blur above 0 in a non-neutral colour; `filter: drop-shadow` |
| `tracked-caps` | fail | `text-transform: uppercase` with positive `letter-spacing` |
| `accent-word` | fail | `<em>`, `<i>`, `<strong>` or a coloured `<span>` inside `h1` to `h3` |
| `numbered-labels` | fail | A heading or label that is `0\d` alone, or `0\d` then `.`, `—` or `-` and a word; not a date (`05 Nov`) |
| `middle-dot` | fail | `·` in a drawn run |
| `arrow-key` | fail | `→` ending a key's or link's text |
| `emoji` | fail | An emoji not in `emoji.allow` |
| `key-heading` | fail | A heading of up to four words ending in `key` or `legend` |
| `typed-star` | fail | `★` or `☆` in a drawn run |
| `hidden-name` | fail | A name from `names.hidden` in a drawn run, unless the run ends in `↗` |
| `space-scale` | fail | A declared margin, padding or gap off `spaces`; `auto`, `%` and `0` skipped |
| `motion` | fail | A transition outside the range; `translateY` on section enter; hover `transform` on cards |
| `loop-motion` | fail | `animation-iteration-count: infinite`, or a keyframe with no end state |
| `reduced-motion` | fail | An animation or transition with no `prefers-reduced-motion` override |
| `spinner` | fail | A rotating animation, or a class or role naming a spinner |
| `filler-copy` | flag | `not just X, but Y`; more than `limits.emDashes` em dashes; a phrase list (`seamless`, `unlock`) |
| `lorem` | fail | `lorem`, `ipsum`, `John Doe`, `Acme` |
| `chrome-black` | fail | `#0B0B0B`, `#111` or `#111111` |
| `banned-word` | fail | A word in `words.banned`, with its replacement |
| `vague-key` | fail | A key whose whole text is in `keys.vague` (`Submit`, `OK`, `Click here`) |
| `minus` | fail | A hyphen before a figure where a minus is meant (`-3`, `$-0.5m`); use `−` |

## Rules: rendered

| ID | Default | Detects |
|---|---|---|
| `raw-colour` | fail | A computed colour not in the tokens, off `colour.allow` |
| `type-scale` | fail | A computed font size not in `sizes`, or under the smallest |
| `font-family` | fail | A family not in `fonts`; a fallback face drawn (the font didn't load) |
| `caps` | fail | A run all in capitals (one word of three letters or more, or two words) off `caps` |
| `figure-face` | fail | A figure-face run that matches no `figures.patterns` |
| `figure-align` | fail | A table cell matching `figures.patterns` that is not right-aligned |
| `number-format` | fail | A figure in a money, time or difference position that misses its `formats` pattern |
| `stat-tiles` | flag | Three or more sibling boxes with a border or fill, each one short label and one figure, of equal width |
| `stacked-figures` | flag | Two or more sibling label-over-figure stacks, figure larger than `limits.stackFigure` |
| `key-figure` | fail | More than one element at `limits.keyFigureSize` or larger |
| `card-grid` | flag | Three or more sibling boxes of title, one grey sentence, one key, unless listed in `prose` |
| `tag-count` | flag | More than `limits.tags` bordered or filled boxes of two words or fewer |
| `filled-keys` | fail | More than one element with the `primary` fill |
| `pill` | fail | A key or chip whose radius is half its height or more |
| `placeholder` | flag on mock-ups, fail on built pages | A dashed box holding nothing or one word, with no `data-placeholder="<issue>"` |
| `explainer` | flag | A sentence of `limits.explainerWords` words or more ending in `.`; or grey text under a heading that opens with a verb or "Your"; outside `prose` |
| `accent-count` | flag | The accent on more elements or jobs than `accent` allows |
| `nesting` | fail | A bordered or filled box inside two others, off `nesting.allow` |
| `accent-bar` | flag | A coloured left border of 2px or more on more than one kind of element |
| `palette` | flag | Ground and accent near a named cluster: cream and terracotta; near-black and acid green or vermilion; indigo or slate with lavender-grey and neon |
| `icon-heading` | flag | An icon directly before most headings |
| `spacing-variety` | flag | One gap value for every gap on the page |
| `zebra` | flag | Alternating row fills in a table |
| `podium` | flag | The top three rows given distinct fills, medal colours or trophies |
| `row-height`, `cell-padding` | fail | A table row or cell outside `limits.rowHeight` or `limits.cellPadding` |
| `dead-band` | flag | An empty vertical band taller than `limits.deadBand` inside the page |
| `measure` | flag | A prose line longer than 80 characters |
| `overlap` | fail | A fixed or sticky element covering a `data-part` or table row, scrolled to top or to end |
| `modal-context` | fail | An open modal over a page other than the route that opened it, or the nav marking another page |
| `scrim` | fail | An open modal's dim covering less than the full page |
| `h-scroll`, `overflow` | fail | Page wider than the viewport; text wider than its box with no `…` |
| `contrast` | fail | Text under 4.5:1, large text or a mark under 3:1, measured after opacity |
| `target-size` | fail | A target under 24px at the design width, or under 44px at the phone; a row counts as one target |
| `focus-visible`, `heading-skip` | fail | A focus style that shows nothing; a heading level skipped |
| `disabled-reason` | flag | A disabled key with no text beside it |
| `colour-alone` | flag | A `meaning` colour with none of its marks or words |

## Rules: across pages

| ID | Default | Detects |
|---|---|---|
| `fact-mismatch` | fail | One `data-fact` key drawn with two values |
| `fact-missing` | flag | A figure in a known fact position with no `data-fact` |
| `part-drift` | flag | One part (`data-part`) with different computed styles on two pages |
| `layout-drift` | flag | One `data-slot` in different places across a `slots` group |
| `state-coverage` | fail | A state in `states` with no route or query, or one that renders nothing different |

## Exceptions

- On an element: `data-lint-allow="radius: the crest keeps its team's shape"`. An empty reason fails.
- Project-wide: in config, with the owner's name and date, and listed in the design file under Do's and
  Don'ts, Off. Any rule ID may be excepted this way.
- A `flag` is cleared by the panel's written answer (rule ID, page, one line), kept with the round.

## Output

- One line per finding: `<page>@<width>: <rule-id> <level>: <what>: <the rule it breaks>`.
- `--json` for tools. Exit 0 clean, 1 any `fail` or unanswered `flag`, 2 could not run.
- Each message names the fix where there is one ("use `›`, not `→`").

## Its own tests

- Every rule has one page that must fail and one that must pass.
- Every pattern in config is run on the dataset; a pattern that matches nothing is a bug.
- A run on the project's approved pictures comes back clean, or each finding is listed as an exception or
  an open call. Otherwise the lint and the pictures disagree, and the owner decides.

## What it leaves to others

- Source literals: the token test. Layout, states drawn, feel: the panel. Built against picture: the
  verifier. Taste and open calls: the owner.
