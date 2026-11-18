// @vitest-environment node
import { expect, test } from "vitest";
import { allShownStrings, cellWords, tableUnder, wholeWord, without } from "./support/wordsFiles";

// SPEC.md's Glossary: no words file uses a word from its Not column. A Not word that is itself a
// glossary term (rank, tier, Card view, List view) is skipped: it is banned only for the other term.
const GLOSSARY = tableUnder("SPEC.md", "Glossary");
const TERMS = new Set(GLOSSARY.map((row) => (row[0] ?? "").toLowerCase()));

/**
 * Not words the Glossary bans in one sense only, each with the reason. A phrase listed is cut out
 * of the text before the Not words are looked for.
 */
const ALLOWED: readonly { phrase: string; why: string }[] = [
  { phrase: "Bench Boost", why: "a buff's own name (spec/06); boost is banned as a word for buff" },
  { phrase: "this week", why: "Craig's own hover, Scores ×1.5 this week (spec/12, Words)" },
  { phrase: "your week", why: "Points' and Live's Your week (spec/12); a numbered week is a gameweek" },
  { phrase: "leagues", why: "leagues are real (spec/08); league is banned only as a name for a tier" },
  { phrase: "league", why: "the same" },
];

const NOT = GLOSSARY.flatMap((row) => cellWords(row[2] ?? "").map((word) => ({ word, term: row[0] ?? "" }))).filter(
  ({ word }) => !TERMS.has(word.toLowerCase()),
);

test("the Glossary has a Not column to read", () => {
  expect(NOT.map((n) => n.word)).toContain("leaderboard");
});

test("no words file uses a word the Glossary says not to", () => {
  const phrases = ALLOWED.map((a) => a.phrase);
  const hits = allShownStrings().flatMap((s) =>
    NOT.filter(({ word }) => wholeWord(word).test(without(s.text, phrases))).map(
      ({ word, term }) => `${s.file}:${s.line} "${s.text}": ${word}, write ${term}`,
    ),
  );
  expect(hits).toEqual([]);
});
