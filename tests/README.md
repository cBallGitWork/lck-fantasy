# tests

Tests that cross features: a replayed gameweek, the signed-out pick to sign-up path.

- `signUpPath.test.ts`: the signed-out pick to sign-up path: pick, Auto-fill, kept in the browser, then Save team makes the entry in its three leagues (spec/09).
- `pricesBacktest.test.ts`: the price formula over the LCK's 2026: first prices against Craig's squads, then the season replayed through each deadline's move (spec/02).
- `voice.test.ts`: no words file uses a word from the Broadcast voice's Never table (`.claude/agents/broadcast.md`), an em dash in a sentence, a `!` but 화이팅's, or a US spelling.
- `designLint.test.ts`: the slop lint (`scripts/design/lint.mjs`): a passing and a failing page per rule, its levels and exit codes, and Flol's approved pictures clean under `.studio/design.json`.
- `glossary.test.ts`: no words file uses a word from SPEC.md's Glossary Not column.
- `support/oe2026.ts`: the LCK's 2026 rows and games from `data/lck/2026`, for the sim's tests, kept out of `convex/`.
- `support/wordsFiles.ts`: every `words.ts` under `src/`, its shown strings read through the TypeScript AST, and a whole-word matcher.
