# tests

Tests that cross features: a replayed gameweek, the signed-out pick to sign-up path.

- `signUpPath.test.ts`: the signed-out pick to sign-up path: pick, Auto-fill, kept in the browser, then Save team makes the entry in its three leagues (spec/09).
- `voice.test.ts`: no words file uses a word from the Broadcast voice's Never table (`.claude/agents/broadcast.md`), an em dash in a sentence, a `!` but 화이팅's, or a US spelling.
- `glossary.test.ts`: no words file uses a word from SPEC.md's Glossary Not column.
- `support/wordsFiles.ts`: every `words.ts` under `src/`, its shown strings read through the TypeScript AST, and a whole-word matcher.
