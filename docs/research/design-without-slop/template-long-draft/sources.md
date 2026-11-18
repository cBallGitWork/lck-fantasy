# Sources for the kit

Research material moved out of `core/` so adopters don't carry it. The full report is
`docs/research/design-without-slop/report.md`, with its notes beside it.

## What the kit rests on

- **Strong (Anthropic, first-party):** a concrete look with exact values plus named tells, and the plan
  audit ("would I do this for any similar page?"), from the `frontend-design` SKILL.md (Sep 2026) and the
  model prompting guides; "structure is information" and the writing rules, same skill; a separate reviewer
  of the rendered screen (harness research: self-grading "reliably" skews positive); scripts for rules with
  no exceptions, and a small enforced set (Claude Code best practices); crop and zoom on dense screenshots
  (Opus 5.5 and Sonnet 5.5 guides); Fable 5.2 treats "never" as absolute.
- **Moderate:** several directions before building (Sonnet 5 and Opus 4.8 guides: ground, accent, typeface
  with a rationale); references translated, not copied; real copy and one coherent dataset (Reddit T1, 113).
- **Weak:** the expected-change rule (Reddit r/ClaudeCode, one comment at 1 point: "a redraw of the old ui
  is a pass"); third-party skill packs (one to three runs, mostly landing pages, graded on their own bans).
- **Owner:** tells Craig named across his plates: Flol `docs/design/plate.md`, draft-platform
  `docs/design/plate.md` (Never 1 to 5), epl-draft-intel `docs/rules/DESIGN.md` §10.
- **Walks:** Flol site walks, 18 Nov 2026: four lens walkers (PM, UX, FPL player, LCK fan) and a UCL Fantasy
  player, on a built preview at 1440. Counts in `never.md` are walkers who named the tell.
- **The kit's own calls** (no source; review after a few rounds): the lint's starting limits (`tags` 6,
  `explainerWords` 8, `emDashes` 3, `deadBand` 160, `stackFigure` 20); "directions that differ only in
  look count as one"; the Watch tells S14 to S19; the phone lens.

## Never and Watch sources

- Anthropic `frontend-design` SKILL.md: the five clusters and typographic tells. Prompting guides: Opus 5.5
  (avoid list), Opus 4.8 (house style), Sonnet 5 (directions). Anthropic blog, Nov 2025 (Inter, purple).
- Reddit r/ClaudeCode, 11 Oct 2026 thread, comments at 113 and 30 points (taste log, never-list).
- awesome-claude-design (rohitg00), "second-order slop"; theadpharm ban list; avoid-ai-design.
- Impeccable slop catalogue (62 rules); tastelint (17 rules); epl `designlint.mjs`; draft-platform
  `scripts/design/lint.mjs`.
- setproduct ("a bare figure is almost meaningless").

## Testing a kit or pack before adopting it

- Run the same brief with and without it, three runs each, on the project's own dense screens.
- Grade blind, against the project's design file, never against the tool's own bans.
- Adopt only what wins on the project's screens.

## Options (none installed)

| Tool | Could serve as | Costs |
|---|---|---|
| Impeccable (Apache 2.0) | A second lint: 62 rules, CI exit code, ignore-with-reason; reads DESIGN.md | Telemetry on by default; hooks outside model approval; web only; writes PRODUCT.md; leans to marketing pages |
| `@google/design.md` CLI | Lints the design file's structure, tokens and contrast; exports tokens | Alpha; checks the file, not the screen |
| @shadcn/lint | Raw colours, arbitrary values, restyled parts | Tailwind v4 only |
| Claude Design | Imports a design system and syncs with Claude Code | "Only as good as its source"; invented type styles in one test |
