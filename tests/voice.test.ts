// @vitest-environment node
import { expect, test } from "vitest";
import { allShownStrings, cellWords, tableUnder, wholeWord, without, wordsFiles } from "./support/wordsFiles";

// The Broadcast voice's Never table (.claude/agents/broadcast.md), and its rules a test can hold:
// no em dash in a sentence, no `!` but 화이팅's, UK spelling. Every words file, every shown string.
const WRITER = ".claude/agents/broadcast.md";
const NEVER = tableUnder(WRITER, "Never").flatMap((row) => cellWords(row[0] ?? ""));

/** The one `!` the voice allows: Craig's cheer (spec/09, Signing up). */
const CHEER = "화이팅!";

/** US spellings, as the writer's Never list names them. */
const US = ["color", "colors", "favorite", "favorites", "organize", "organizer", "center", "gray", "canceled", "defense"];

const strings = allShownStrings();
const where = (s: { file: string; line: number; text: string }) => `${s.file}:${s.line} "${s.text}"`;

test("there are words files to read, and the Never table has words", () => {
  expect(wordsFiles().length).toBeGreaterThan(0);
  expect(NEVER).toContain("successfully");
});

test("no words file uses a word from the Never table", () => {
  const hits = strings.flatMap((s) => NEVER.filter((w) => wholeWord(w).test(s.text)).map((w) => `${where(s)}: ${w}`));
  expect(hits).toEqual([]);
});

test("no words file has an em dash in a sentence; a lone — as an empty value is fine", () => {
  expect(strings.filter((s) => s.text.includes("—") && s.text.trim() !== "—").map(where)).toEqual([]);
});

test("no words file has a ! except in 화이팅!", () => {
  expect(strings.filter((s) => s.text.replaceAll(CHEER, "").includes("!")).map(where)).toEqual([]);
});

test("no words file uses a US spelling", () => {
  const hits = strings.flatMap((s) => US.filter((w) => wholeWord(w).test(s.text)).map((w) => `${where(s)}: ${w}`));
  expect(hits).toEqual([]);
});

test("the matcher finds whole words in any case, and lets an allowed phrase through", () => {
  expect(wholeWord("click").test("Click here")).toBe(true);
  expect(wholeWord("click").test("clicked")).toBe(false);
  expect(wholeWord("lock in").test("Lock in your team")).toBe(true);
  expect(without("This week's series", ["this week"])).not.toMatch(wholeWord("week"));
});
