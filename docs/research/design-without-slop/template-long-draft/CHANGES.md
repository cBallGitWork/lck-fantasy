# Changes: second draft, 18 Nov 2026

**Contents:** [The shape now](#the-shape-now) · [Evidence critique](#evidence-critique) ·
[Dense-app critique](#dense-app-critique) · [Reuse critique](#reuse-critique) · [Rejected or held](#rejected-or-held)

`docs/design/plate.md` stays binding: nothing here changes a plate rule. Where a kit rule would fail what the
plate or an approved picture requires, the rule is `off` or `flag` in `lck/design.json`, tied to a call for
Craig.

## The shape now

| File | Change |
|---|---|
| `core/rules.md` | **New.** Every shared rule, with an ID (SI, CO, TY, LA, PA, OB, TF, CH, ST, VO, DS, PH, AC) and a mark |
| `core/DESIGN.template.md` | Blanks only; Google's canonical headings, unnumbered; front matter optional and generated |
| `core/never.md` | Data-app Never first; Watch (was second-order) with new tells; generic tells as a lint appendix; an Evidence column |
| `core/checks.md` | Token test spec, Plan audit, graded expected-change rule, new Directions, wider render check, phone lens, taste log |
| `core/lint-spec.md` | Two parents; neutral config; per-rule levels; 18 new rules; fixes to 11 |
| `core/README.md` | Read-only kit model; `/design` owns the workflow; Plan audit step; evidence in brief |
| `sources.md` | **New**, outside `core/`: what the kit rests on, Never sources, kit testing, tool options |
| `lck/DESIGN.md` | Canonical headings, role mapping, Off table, LCK watch, new build breaks, P14 to P16, reordered calls |
| `lck/design.json` | **New.** Flol's lint config, with each conflict tied to its P number |
| `lck/components.md` | The Rift's modes × states grid; FLEX line; missing states |

## Evidence critique

1. **Lint fails plate parts. Applied.** `.led` in `gradient.allow`, `colour.allow`, `caps.allow`; Rift tile in
   `nesting.allow`; `space-scale` reads declared values and skips `auto`, `%`, `0`; buff line, sponsor and
   Riot notices in `prose`. Upkeep line added: the LED dot colour needs a token.
2. **Lint fails approved pictures. Applied.** `glow` needs a blur above 0. `middle-dot` is off for Flol,
   waiting on new call P14.
3. **Lint enforces open proposals. Applied.** Levels `off`/`flag`/`fail` per rule in config; Flol's
   `figure-face` (P3), `tag-count` (P6), `middle-dot` (P14) off, `placeholder` flag (P5); phone and in-between
   widths empty until P10, and only `h-scroll`, `overflow`, `overlap` run there while `phoneDrawn` is false.
4. **P4 collides with the buff rule. Applied.** P4 now says adopting D2 whole would change the plate; buffs
   split out as P15. `card-grid` skips `prose` containers.
5. **Pretendard is Inter. Applied** in P2.
6. **Plan audit; structure is information. Applied.** `checks.md` Plan audit (output: plan plus one line per
   changed choice); README step 4; rule SI1.
7. **Taste log. Applied.** `checks.md`; template Overview slot; Flol path named, not started.
8. **Sticky bar; modal over blank page. Applied.** `overlap`, `modal-context`; rules LA5, PA4; Never D17, D18;
   two rows in Flol's build-breaks table.
9. **Marks with no check. Applied.** New rules `spinner`, `number-format`, `row-height`, `figure-align`;
   `caps` now catches single words, with an acronym list. Empty state re-marked `[panel]`.
10. **Conditional tells under Never. Applied.** Second-order is now Watch, with a promotion rule; Never is
    short and absolute.
11. **Evidence strength. Applied.** Evidence column in every `never.md` table; README and `sources.md` grade
    the expected-change rule weak, and `checks.md` calls it a trial.
12. **Unsourced specifics. Applied.** Directions use the Opus 4.8 guide's ground, accent, typeface with a
    reason, plus how data is shown; thresholds are config values, labelled the kit's call in `sources.md`;
    seven sizes and two accent jobs are now config; "never the same source" moved to `lck/`; the truck claim
    and the Claude Design import claim are gone.
13. **Anthropic's writing rules. Applied.** VO2 (name kept through the flow), VO3 (active verbs, `vague-key`),
    ST6 (errors explain the fix), TY6 (80 characters, `measure`).
14. **LCK failure list. Partly.** Added to `lck/DESIGN.md` as an LCK watch for the Culture lens, fallback face
    `[render]`, the rest `[panel]`. Not added to Never, and negative tracking not made a rule: both are
    research beyond the plate, so negative tracking sits in P2 and promotion in P4.
15. **Small drops. Applied.** "Nothing under it" restored; foundations named (template slot, Flol Overview,
    rules.md); a Core role column maps Flol's tokens; crop-and-zoom in the render check and verifier.
16. **Canonical headings. Applied:** Motion & Micro-interaction, Voice & Content Strategy, Do's and Don'ts.

## Dense-app critique

1. **The phone. Partly.** Core: the template's phone slots (nav, side column per variant, the object at
   phone width, sheets, sticky stacking and safe area, column drop order, tap for hover facts); PH1 to PH4
   (row is the target, so 44px targets no longer fight 40px rows); fold at the phone shot size; Watch S19;
   a phone-user lens. Flol: phone stays "not drawn" per the plate; the slots are listed for its round.
2. **The subject's object. Applied.** Template section and rules OB1 to OB5; `overlap`, `layout-drift` with
   `slots`; contrast measured after opacity. Flol: a modes × states grid in `components.md`, with the
   plate-silent looks marked as Craig's call.
3. **Stat hero without boxes. Applied.** TF3 defines a line of figures; `key-figure` (fail),
   `stacked-figures` (flag, two or more stacks so the page's one key figure passes); Watch S14.
4. **Table tells; airiness. Applied** in core: Watch S15, `figure-align`, `zebra`, `podium`, `row-height`,
   `cell-padding`, `dead-band`; template fold slot asks for the fewest rows. Flol's cell padding and rows
   above the fold left unset: the plate is silent.
5. **Dashed placeholders. Applied.** Template "Assets and stand-ins" (leaving it out is valid); Watch S18;
   P5 first in Flol's calls; the plate's placeholder marked a known tell and flagged by the lint.
6. **States. Applied.** ST5 (empty in place, no icon), ST8 (saved look and place), `state-coverage` and a
   fixture per state. Flol's fantasy states listed as not drawn (P16), their look not guessed.
7. **Stress data. Applied** as DS4. Flol already has the long name in `src/fixtures/managers.ts`.
8. **Charts and sports defaults. Applied.** Watch S16, S17; template Charts slot; CH1. Flol: none.
9. **Landing tells lead; directions aim at brand. Applied.** Never leads with data apps; generic tells are a
   lint appendix. Directions differ on how data is shown and are drawn on the hardest screens (Flol: Stats
   and Pick Team).
10. **Only two widths. Applied** as `widths.between` in core. Flol: folded into P10, since 1024 would fail
    every Rift page and the plate draws 1440 only.
11. **Lint gaps. Applied.** `tag-count` counts filled boxes; `explainer` also catches grey text opening with a
    verb or "Your"; Flol's figure patterns tested on its real figures (scores, ×1.5, K/D/A, countdowns);
    `minus` added. Ordinal ranks left out: Flol draws none.
12. **Buff contradiction. Applied** (P15; buff line in `prose`).

## Reuse critique

1. **Copy model. Applied.** Kit files read-only; the design file cites IDs; config in `.studio/design.json`,
   personas in `.studio/qa-panel.json`.
2. **Rules mixed with blanks. Applied** via `rules.md`. Template is 146 lines, not 120: the added slots
   (subject's object, assets, charts, phone, registers, marks) cost about 25.
3. **Flol leaks in core. Applied.** Examples neutral or moved to `lck/`; Live/Provisional/Final, fantasy jobs,
   key 44, P7 variants, Riot policy, rank and price moves out of core; `colour-alone` reads `meaning` from
   config. Walker counts stay as evidence, unnamed; `sources.md` says whose walks they were.
4. **Hard limits. Applied.** Counts and radius are config (`radius.default`); a new `pill` rule carries G4;
   any rule ID can be excepted with reason and date; `placeholder` narrowed to a dashed box holding nothing
   or one word, so `Not final` passes.
5. **Missing slots. Applied:** registers, breakpoints from config, marks and icons, names never shown,
   `rules` modules, `expand` for boards, "Your token | Role it fills" columns.
6. **Front matter copies values. Applied.** Optional and generated only; Flol's hand-copied block removed;
   token test spec added to `checks.md`.
7. **Lineage. Applied.** Both parents cited; G21 (draft-platform Never 3) added; the violet Directions
   example removed; `palette` gains that cluster.
8. **Duplicate workflow and personas. Partly.** README keeps only what `/design` must produce, since the Plan
   audit step needs a home in the kit; personas read from `qa-panel.json`.
9. **Unenforced marks. Applied** (with evidence 9); every template slot now carries a mark.
10. **Length. Partly.** Research moved to `sources.md`; README 76 lines, not 60; never tables keep a short
    Evidence column (evidence critique 11 asked for it).
11. **Minor. Applied.** `numbered-labels` excludes dates; headings unnumbered throughout; a "Where the build
    breaks this file" slot.

## Rejected or held

- **Negative heading tracking as a rule** (evidence 14): third-party estimates, plate silent. Held in P2.
- **Flol phone decisions** (dense-app 1): the plate says not drawn; deciding the nav or the Rift at 390 now
  would build on a guess. Slots listed instead.
- **Leagues 12 rows above the fold; a cell-padding cap for Flol** (dense-app 4): numbers the plate doesn't
  hold. Left for Craig when drawn.
- **1024 and 1280 for Flol now** (dense-app 10): would fail every Rift page against a plate that draws 1440;
  asked in P10.
- **`middle-dot` at `flag` for Flol** (evidence 2): a flag on every page is noise; set `off` and asked as P14.
- **Template at 120 lines, README at 60** (reuse 2, 10): missed by about 25 and 16 lines to keep the slots the
  other critiques asked for.
