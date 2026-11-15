import { describe, expect, test } from "vitest";
import draftJson from "../../docs/research/truck-lines.json?raw";
import { addLine, approveLine, LineError, lineProblems, placeholdersIn, seedLines, type NewLine } from "./lines";

const draft = JSON.parse(draftJson) as NewLine[];

const coffee: NewLine = { id: "x01", kind: "coffee", text: "{player} IN YOUR SQUAD.", trigger: "any", weight: 1 };

describe("truck lines (spec/14, Truck lines)", () => {
  test("the 63 draft lines load as unapproved seed rows", () => {
    const lines = seedLines(draft);
    expect(lines).toHaveLength(63);
    expect(lines.every((line) => !line.approved)).toBe(true);
    expect(lines.find((line) => line.id === "s01")).toEqual({
      id: "s01",
      kind: "sponsor",
      text: "WINNER WINNER, GANK CHICKEN. {points} PTS.",
      trigger: "high_score",
      weight: 3,
      sponsor: "갱 치킨 Gank Chicken",
      approved: false,
    });
  });

  test("every draft protest row passes the no-player check", () => {
    const protests = draft.filter((row) => row.kind === "protest");
    expect(protests.length).toBeGreaterThan(0);
    for (const row of protests) expect(lineProblems([], row)).toEqual([]);
  });

  test("a protest line naming a player is refused; a coffee line may", () => {
    for (const placeholder of ["player", "carry"]) {
      const protest = { ...coffee, kind: "protest" as const, text: `EXPLAIN {${placeholder}}.` };
      expect(() => addLine([], protest)).toThrow(new LineError({ rule: "protestNamesPlayer", placeholder }));
    }
    expect(addLine([], coffee)).toEqual([{ ...coffee, approved: false }]);
  });

  test("a line shows only once approved", () => {
    const lines = approveLine(addLine([], coffee), "x01");
    expect(lines[0]?.approved).toBe(true);
    expect(() => approveLine(lines, "nope")).toThrow(LineError);
  });

  test("a broken line is refused, never added silently", () => {
    expect(lineProblems([{ ...coffee, approved: false }], { ...coffee, text: "{nope}", weight: 0 })).toEqual([
      { rule: "duplicateId", id: "x01" },
      { rule: "badWeight", weight: 0 },
      { rule: "unknownPlaceholder", placeholder: "nope" },
    ]);
    expect(lineProblems([], { ...coffee, kind: "sponsor" })).toEqual([{ rule: "sponsorMissing" }]);
  });

  test("placeholders are read from the text", () => {
    expect(placeholdersIn("{team} TOPS {league}.")).toEqual(["team", "league"]);
  });
});
