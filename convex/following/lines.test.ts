import { describe, expect, test } from "vitest";
import draftJson from "../../docs/research/truck-lines.json?raw";
import { addLine, approveLine, lineProblems, placeholdersIn, seedLines, type NewLine } from "./lines";
import { Refused } from "./refused";

const draft = JSON.parse(draftJson) as NewLine[];

const cheer: NewLine = { id: "x01", kind: "cheer", text: "{player} IN YOUR SQUAD.", trigger: "any", weight: 1 };

describe("cheer lines (spec/14, Lines)", () => {
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

  test("every draft jeer row passes the no-player check", () => {
    const jeers = draft.filter((row) => row.kind === "jeer");
    expect(jeers.length).toBeGreaterThan(0);
    for (const row of jeers) expect(lineProblems([], row)).toEqual([]);
  });

  test("a jeer line naming a player is refused; a cheer line may", () => {
    for (const placeholder of ["player", "carry"]) {
      const jeer = { ...cheer, kind: "jeer" as const, text: `EXPLAIN {${placeholder}}.` };
      expect(() => addLine([], jeer)).toThrow(new Refused("Cheer line", { rule: "jeerNamesPlayer", placeholder }));
    }
    expect(addLine([], cheer)).toEqual([{ ...cheer, approved: false }]);
  });

  test("a line shows only once approved", () => {
    const lines = approveLine(addLine([], cheer), "x01");
    expect(lines[0]?.approved).toBe(true);
    expect(() => approveLine(lines, "nope")).toThrow(Refused);
  });

  test("a broken line is refused, never added silently", () => {
    expect(lineProblems([{ ...cheer, approved: false }], { ...cheer, text: "{nope}", weight: 0 })).toEqual([
      { rule: "duplicateId", id: "x01" },
      { rule: "badWeight", weight: 0 },
      { rule: "unknownPlaceholder", placeholder: "nope" },
    ]);
    expect(lineProblems([], { ...cheer, kind: "sponsor" })).toEqual([{ rule: "sponsorMissing" }]);
  });

  test("placeholders are read from the text", () => {
    expect(placeholdersIn("{team} TOPS {league}.")).toEqual(["team", "league"]);
  });
});
