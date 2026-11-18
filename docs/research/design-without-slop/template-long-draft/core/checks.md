# Checks: the gate

**Contents:** [The layers](#the-layers) · [The token test](#the-token-test) · [Plan audit](#plan-audit) ·
[The expected-change rule](#the-expected-change-rule) · [Directions](#directions) ·
[The render check](#the-render-check) · [The lint](#the-lint) · [Data](#data) · [The panel](#the-panel) ·
[The verifier](#the-verifier) · [The brand check](#the-brand-check) · [The owner and the taste log](#the-owner-and-the-taste-log)

## The layers

Cheapest first. A screen moves on only when the layer before is clean or every finding is answered in
writing.

| Layer | Catches | Runs on | Who |
|---|---|---|---|
| 1. Token test | Values outside the token file; brand maps; contrast | Source, every commit | Unit test |
| 2. Plan audit | Choices that would suit any similar page | The plan, before building | Builder, then the panel reads it |
| 3. Lint | The tells a script can see (`lint-spec.md`) | Mock-ups and built pages | Script |
| 4. Render check | What only opening the shot shows | Every render | Builder |
| 5. Review panel | Judgement, against the written file | Each round | Agents that did not build it |
| 6. Verifier | Built screen against its approved picture | Built screens | An agent that did not build it |
| 7. Brand check | A change right in one brand only | Built screens, every brand | Script plus panel |
| 8. Owner | Taste, open calls, approval | Each picture | The owner |

The builder never grades its own work: self-grading "reliably" skews positive (Anthropic, harness research).
The builder may run layers 1 to 4; 5 and 6 are always someone else.

## The token test

A unit test in the project's suite. It fails when:

1. A colour literal (hex, `rgb(`, `hsl(`) appears in source outside the token file.
2. A font size or spacing literal in source is off the scale.
3. A brand map has a key missing or extra against the core's keys.
4. A text and ground pair the design file names misses 4.5:1 (3:1 for large text and marks), in any brand.
5. The design file's front matter, where the project generates one, differs from the token file.

## Plan audit

From Anthropic's frontend-design skill. Before building, the builder writes the plan: the tokens it will
use, the layout in one sentence plus a rough wireframe, and the screen's signature. Then it asks of each
choice: "would I do this for any similar page?" Each yes is revised.

Output: the plan, then one line per changed choice: `Was: <choice>. Now: <choice>. Why: <reason>.` A plan
with no audit lines is sent back unless it says why nothing changed.

## The expected-change rule

The kit's call, on weak evidence (one Reddit comment); trial it and keep it only if it catches redraws.

Every check of a changed screen names the change before it looks, and fails if the screen looks the same:

```
Expect: <element> on <screen> at <width>: <before> → <after>.
Same:   <what must not change>.
```

The check shoots before and after on the same data; fails if the named region shows no visible change, or a
`Same` region changed; and a reviewer, not the builder, says in one line whether the after shot shows the
named state.

## Directions

For a look round (a new product, a new brand, a reskin), three or four directions before one is built.

- Each names its ground, accent and typeface, with a one-line reason for each (Anthropic's Opus 4.8 guide).
- Each also says how it shows the data: row height, columns above the fold, how figures are drawn. Directions
  that differ only in look count as one (the kit's call). `[panel]`
- Each is drawn on the project's hardest screens (its densest table and its subject's object), at the design
  width and, once the phone is drawn, the phone width, on the same data. `[render]`
- None uses a Never or Watch tell the project hasn't chosen. `[lint]` The owner picks one.

## The render check

At every width in config, the builder opens each shot and reads it. A shot not opened is not evidence.

- No sideways scroll, clipping, missing font or console error. `[render]` (`h-scroll`, `overflow`, `font-family`)
- The fold item shows at each shot size (design and phone). `[render]`
- No fixed or sticky element covers content, scrolled to top and to end. `[render]` (`overlap`)
- A modal opens over its own page, the nav marks that page, and the dim covers it all. `[render]`
- Every state in config is shot through its route or query. `[render]`
- Dense screens (a wide table, a full squad) are read in crops at full resolution, not only whole:
  crop-and-zoom gives "consistent uplift" on screenshots (Anthropic, prompting guides).

Stop after three rounds in a row that change nothing the picture shows; hand it to the owner with what each
round tried.

## The lint

`lint-spec.md`. It runs on mock-ups and built pages. Every finding is fixed or answered with a reason the
owner has accepted (`data-lint-allow`); an answer with no reason fails.

## Data

- Every mock-up and preview draws from one dataset file; its story is the owner's (`rules.md` DS1 to DS4).
- It carries the extremes (DS4) and a fixture for every state (ST1).
- A drawn fact carries `data-fact`; across one run's shots one key shows one value. `[lint]`

## The panel

Read-only agents in parallel, each with one lens, the design file and the taste log. They judge against the
file and the brief, not open taste.

| Lens | Asks |
|---|---|
| UX | Layout, density, scan speed, the file and its Never list |
| PM | Matches the spec and brief; nothing invented; build cost |
| Veteran user | Can I do my regular jobs fast, where I expect them |
| Phone user | Can I do the same jobs one-handed at the phone width; is anything hover-only |
| Culture | Does it feel like the subject's own world; the brand's failure list |

- Personas come from the project's `.studio/qa-panel.json` where it has one; the lenses are the kit's.
- Each returns numbered findings: the rule ID or the question, the screen region, a fix.
- Clear-cut findings are fixed; disagreements and taste go to the owner.
- Each round also answers: "what did this picture use in place of each banned tell?" New defaults join Watch.

## The verifier

For a built screen with an approved picture: shoots it at the picture's width on the same data, reading
dense regions in crops; lists every difference (missing, moved, wrong state, extra); checks the change's
`Expect` lines; fails on a difference the picture or the file doesn't allow.

## The brand check

- Every brand map has exactly the core's keys, and passes contrast. `[test]`
- Every approved screen is shot in every brand; the core's layout matches. `[render]`
- The panel sees one screen in two brands, unlabelled. If it can't tell them apart, the brand layer fails. `[panel]`

## The owner and the taste log

- The owner approves each picture in their own words, dated; decides every open call and every exception;
  is never asked what the design file already settles.
- **Taste log:** a dated file of the owner's reactions to pictures, in their words ("too busy", "feels
  cheap"), each with the picture it was about. The builder reads it before design work; the panel may cite
  it. A reaction that becomes a rule moves to the design file and is marked there. (Reddit, 30 points.)
