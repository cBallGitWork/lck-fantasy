# <Product>: the design file

<!-- Front matter: optional. If a tool that reads Google's DESIGN.md format is wanted (Impeccable's
detector), generate the YAML front matter from the token file. Never write it by hand. -->

**Contents:** [Read this first](#read-this-first) · [Overview](#overview) · [Colors](#colors) ·
[Typography](#typography) · [Layout](#layout) · [Elevation & Depth](#elevation--depth) · [Shapes](#shapes) ·
[Motion & Micro-interaction](#motion--micro-interaction) · [Voice & Content Strategy](#voice--content-strategy) ·
[Components](#components) · [The subject's object](#the-subjects-object) · [Tables and figures](#tables-and-figures) ·
[Charts](#charts) · [States](#states) · [Assets and stand-ins](#assets-and-stand-ins) · [The phone](#the-phone) ·
[Accessibility](#accessibility) · [Brand layer](#brand-layer) · [Do's and Don'ts](#dos-and-donts) ·
[Where the build breaks this file](#where-the-build-breaks-this-file) · [Decided](#decided) · [Open calls](#open-calls)

## Read this first

- Google's ten DESIGN.md headings, in its order; the sections between Components and Do's and Don'ts are
  what dense apps need and Google's format lacks.
- The kit's `rules.md` applies in full. This file holds this project's values, choices and exceptions only.
- Every slot ends with a mark (`[test]`, `[lint]`, `[render]`, `[panel]`, `[owner]`). A slot the project
  doesn't need says `None` and why.
- A value is named by token, never copied as hex; it lives once, in `<token file>`. `[test]`
- An owner's call carries name and date: `(Owner, 16 Nov 2026)`. An approved picture settles layout; this
  file settles how it is drawn.

## Overview

- **Product, users, main jobs** (three to six verbs). `[panel]`
- **Foundations:** the outside standards this file builds on. `[panel]`
- **The subject's object:** see its section. **The signature:** the one place each screen is bold. `[panel]`
- **Taste log:** its path. The builder reads it before any design work; the panel may cite it. `[panel]`

## Colors

| Your token | Role it fills (`rules.md`, Colour) | When used, and only then |
|---|---|---|
| | ground, panel, rule, text, secondary, action, on-action, focus, each meaning | |

- The accent's jobs, named; their count is `limits.accentJobs`. `[lint]` `accent-count`
- Each meaning colour and the mark or word beside it. `[lint]` `colour-alone`

## Typography

- **Families**, each with its role (words, figures, display). `[lint]` `font-family`
- **Sizes**, each named by role; the count is the project's. `[test]` **Weights.** `[test]`
- **Figures:** the face, and which runs are figures (`figures.patterns`, tested on the dataset). `[lint]` `figure-face`
- **Case exceptions** and the acronyms allowed in capitals. `[lint]` `caps`
- **Page title:** size, weight, what sits beside it. `[panel]` **Second language:** face, size, where. `[panel]`

## Layout

- **Widths:** the frame drawn at, the breakpoints, and what moves at each. `[render]`
- **Columns:** widths, gaps, which side holds what. `[panel]`
- **Page variants:** each skeleton and the pages that use it. `[panel]`
- **Registers** (if the grammar changes by route, not only the values): each, and its routes. `[panel]`
- **Spacing scale** and grouping gaps. `[test]` `[lint]` `space-scale`
- **Fold:** per page type, what shows above it at each shot size, and the fewest table rows. `[render]`
- **Density maxima:** row height, cell padding, columns at full width. `[lint]` `row-height`, `cell-padding`

## Elevation & Depth

- How depth is shown; how a modal separates from its page. `[lint]` `[render]`

## Shapes

- **Radius:** the default and each exception with its reason. `[lint]` `radius`
- **Round marks**, as a closed list. **Nesting exceptions** (parts allowed three deep). `[lint]` `nesting`

## Motion & Micro-interaction

- Duration range, easing, and a closed list of what moves. `[lint]` `motion`; `[panel]`

## Voice & Content Strategy

- **Language and spelling; house abbreviations.** `[panel]`
- **Glossary:** one name per thing; banned synonyms go in config. `[lint]` `banned-word`
- **Names never shown on screen** (sources, internal codes). `[lint]` `hidden-name`
- **Formats:** money, times, dates, time zone, signs, units; each a pattern in config. `[lint]` `number-format`
- **Prose containers:** where sentences are allowed, and each allowed explainer line by name. `[lint]` `explainer`
- **Absence; emoji; the saved confirmation's words.** `[panel]` `[lint]` `emoji`

## Components

| Part | Anatomy | Variants | Used on |
|---|---|---|---|
| Top bar, page head, tabs, link, keys, tag, table, modal, form field | | | |

**Marks and icons:** each mark (crest, shirt, star, role, event), its source art, and where it shows. `[panel]`

## The subject's object

- Its modes against its states, as a grid; the views that share its data; its mark per context. `[panel]`

## Tables and figures

- Your own row; the sorted column; movement looks; column groups; paging and "find me". `[panel]`
- Action-column exceptions; one example of the page's line of figures. `[panel]`

## Charts

- Each chart that exists, its page and its data, or `None`. `[panel]`

## States

| State | How it shows | Fixture and route |
|---|---|---|
| The core states (`rules.md`, States) and the product's own (locked, pre-season, guest…) | | |

## Assets and stand-ins

| Image slot | Real art | Stand-in until then (leaving it out is a valid stand-in) |
|---|---|---|
| | | |

## The phone

Drawn or not. Either way: the nav and its items; where the side column goes per page variant; the subject's
object at phone width; modals as full-height sheets; the stacking of sticky bar, nav and safe area; the order
each table drops columns; how each hover fact is reached by tap. `[panel]`

## Accessibility

- Exceptions to `rules.md` Accessibility only, each with its reason. `[owner]`

## Brand layer

Only if the product runs under more than one brand. The keys every brand sets, and one value map per brand.
A brand that wants to change grammar is asking to change the core. `[test]` (same keys in every map) `[owner]`

## Do's and Don'ts

- **Off:** each kit rule or Never ID this project doesn't apply, with the owner's reason and date.
- **Added:** this project's own tells, each with a catch.
- **Watch:** what the last look rounds used in place of each banned tell.

## Where the build breaks this file

| Screen | What was seen | Rule ID |
|---|---|---|

## Decided

The owner's calls, one line each, dated.

## Open calls

Each: the question, an example, a recommendation. Nothing is built until the owner answers.
