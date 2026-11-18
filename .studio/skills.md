# Project facts for Forge's shared skills

The skills in `.claude/skills/` are Forge's kit files (`/grill` and the rest); this file holds what
differs in Flol. Change a skill in Forge (`cBallGitWork/forge`), never here.

## Grill
- Spec: `SPEC.md` (index), one file per feature in `spec/NN-name.md`.
- Glossary: `SPEC.md`, Glossary.
- Decisions log: `docs/decisions.md` (history, not the spec). Wants list: `docs/to-grill.md`.
- Research notes: `docs/research/`, background only.
- Model to follow: FPL's structure. Say first how FPL does it, then what the LCK changes (five
  roles, series of games, splits, a coach), and recommend FPL's way unless the LCK breaks it.
- Issue label: `lane:auto` on each issue the grill cuts, so the lead builds it (`docs/PIPELINE.md`);
  `lane:craig` on one that waits for Craig.

## Deepen
- Architecture map: `ARCHITECTURE.md`.
- Kept as data, never a constant: the LCK's facts (teams, rosters, splits, dates, series length) and
  every value Craig may tune (prices, points, buffs, deadlines), held per competition.

## Refactor
- Never a refactor here: scoring, prices, deadlines and transfers (what a manager's points, bank or
  squad become); lifting an LCK fact or a tunable value into a constant.

## Retro
- Checks live in: `.claude/hooks/` (tests in `.claude/hooks/tests/`), `tests/`, the lint rules.
- Docs that count: `CLAUDE.md`, `SPEC.md`, `docs/PIPELINE.md`.

## Verify
1. `npm run verify` — the contents lists, the studio kit and its deny list, the hook checks, lint,
   typecheck and the tests.
- One hook's checks alone: `.claude/hooks/tests/<suite>.sh`.

## Handover
- Where: the session's memory folder, as `handover-<YYYY-MM-DD>-<topic>.md`, with one line for it at
  the top of the handovers in `MEMORY.md`.
