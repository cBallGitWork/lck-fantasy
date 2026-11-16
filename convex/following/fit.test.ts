import { describe, expect, test } from "vitest";
import draftJson from "../../docs/research/truck-lines.json?raw";
import { fillLine, linesThatFit, pickWeighted, scoreBand, type LineSettings, type Receiver, type ReceiverWeek } from "./fit";
import { approveLine, seedLines, type NewLine, type TruckLine } from "./lines";

// Fixture values: the real ones are the competition's data.
const SETTINGS: LineSettings = { blankPoints: 2, flopPoints: 2, bigCarryPoints: 20 };
const EOK = 100_000_000;

/** The draft set, every line approved. */
const draft: TruckLine[] = (() => {
  const seeded = seedLines(JSON.parse(draftJson) as NewLine[]);
  return seeded.reduce((lines, line) => approveLine(lines, line.id), seeded);
})();

/** A middling week that fits no trigger but "any". */
const quiet: ReceiverWeek = {
  points: 45,
  band: "middle",
  hits: 0,
  transfers: 1,
  rankMove: 0,
  buffPlayed: false,
  globalAverage: 45,
  carry: { name: "Chovy", points: 9, bestSeries: 6 },
  starters: [
    { name: "Chovy", price: 12 * EOK, points: 9 },
    { name: "Zeus", price: 10 * EOK, points: 8 },
  ],
  benchPoints: 3,
};

function receiver(week: Partial<ReceiverWeek> | null, leagues: Partial<Receiver["leagues"]> = {}): Receiver {
  return {
    team: "Minji FC",
    week: week === null ? null : { ...quiet, ...week },
    leagues: { topOf: [], bottomOf: [], ...leagues },
  };
}

function fitIds(kind: "coffee" | "protest" | "sponsor", who: Receiver): string[] {
  return linesThatFit(draft, kind, who, SETTINGS).map((one) => one.line.id);
}

const anyProtest = ["p26", "p27", "p28", "p29", "p30", "p31"];

describe("lines that fit the receiver's week (spec/14, Truck lines)", () => {
  test("a quiet week fits only any-week lines", () => {
    expect(fitIds("protest", receiver({}))).toEqual(anyProtest);
  });

  test("each trigger fits its week (Craig's answers on #90)", () => {
    const cases: [Partial<ReceiverWeek>, Partial<Receiver["leagues"]>, "coffee" | "protest", string][] = [
      // Faker as the Carry on 3 after the ×1.5 is no blank; on 2 he is.
      [{ carry: { name: "Faker", points: 2, bestSeries: 2 } }, {}, "protest", "p01"],
      [{ carry: { name: "Faker", points: 30, bestSeries: 21 } }, {}, "coffee", "c01"],
      [{ hits: 4 }, {}, "protest", "p05"],
      [{ rankMove: -12_000 }, {}, "protest", "p08"],
      [{ rankMove: 12_000 }, {}, "coffee", "c03"],
      [{}, { bottomOf: ["Office"] }, "protest", "p11"],
      [{}, { topOf: ["Office"] }, "coffee", "c06"],
      [{ benchPoints: 18 }, {}, "protest", "p13"],
      [{ transfers: 0 }, {}, "protest", "p15"],
      [{ buffPlayed: true, points: 40 }, {}, "protest", "p18"],
      [{ buffPlayed: true, points: 45 }, {}, "coffee", "c08"],
      [{ starters: [{ name: "Chovy", price: 12 * EOK, points: 2 }, { name: "Zeus", price: 10 * EOK, points: 8 }] }, {}, "protest", "p20"],
      [{ band: "high" }, {}, "coffee", "c11"],
      [{ band: "low" }, {}, "protest", "p23"],
    ];
    for (const [week, leagues, kind, id] of cases) expect(fitIds(kind, receiver(week, leagues))).toContain(id);
    expect(fitIds("protest", receiver({ carry: { name: "Faker", points: 3, bestSeries: 3 } }))).not.toContain("p01");
  });

  test("a dear player's flop is the dearest starter's, not a cheaper one's", () => {
    const cheapFlop = { starters: [{ name: "Chovy", price: 12 * EOK, points: 9 }, { name: "Zeus", price: 10 * EOK, points: 1 }] };
    expect(fitIds("protest", receiver(cheapFlop))).not.toContain("p20");
  });

  test("no shared league, no league lines; before a final week, only any-week lines", () => {
    expect(fitIds("coffee", receiver({ rankMove: 5 })).filter((id) => ["c06", "c07"].includes(id))).toEqual([]);
    expect(fitIds("protest", receiver(null))).toEqual(anyProtest);
    expect(fitIds("coffee", receiver(null, { topOf: ["Office"] }))).toEqual(expect.arrayContaining(["c06", "c07"]));
  });

  test("an unapproved line never fits", () => {
    expect(linesThatFit(seedLines(JSON.parse(draftJson) as NewLine[]), "protest", receiver({}), SETTINGS)).toEqual([]);
  });

  test("a top-10% score is high, a bottom-10% one low, level with the cut-off counts", () => {
    const scores = Array.from({ length: 20 }, (_, i) => i * 5); // 0 to 95
    expect(scoreBand(90, scores, 0.1)).toBe("high");
    expect(scoreBand(85, scores, 0.1)).toBe("middle");
    expect(scoreBand(5, scores, 0.1)).toBe("low");
  });

  test("a line is drawn by its weight", () => {
    const fitting = linesThatFit(draft, "coffee", receiver(null), SETTINGS).filter((one) => ["c13", "c19"].includes(one.line.id));
    // c13 weighs 3 and c19 1: the first three quarters draw c13.
    expect(pickWeighted(fitting, 0.74)?.line.id).toBe("c13");
    expect(pickWeighted(fitting, 0.75)?.line.id).toBe("c19");
    expect(pickWeighted([], 0.5)).toBeUndefined();
  });
});

describe("a line fills in the receiver's own numbers (spec/14, Truck lines)", () => {
  const line = (id: string) => draft.find((one) => one.id === id)!;

  test("a dear flop's price, in m as money shows everywhere", () => {
    const flopWeek = receiver({ starters: [{ name: "Chovy", price: 12 * EOK, points: 1 }] });
    expect(fillLine(line("p20"), flopWeek, SETTINGS)).toBe("₩12.0M SPENT. WE DEMAND TO SEE THE SPREADSHEET.");
  });

  test("hits, rank moves, leagues, the Carry and the team", () => {
    expect(fillLine(line("p05"), receiver({ hits: 8 }), SETTINGS)).toBe("THIS TRUCK WAS FUNDED BY YOUR -8.");
    expect(fillLine(line("p08"), receiver({ rankMove: -12_345 }), SETTINGS)).toBe("RED ARROW, 12,345. 책임져라 (TAKE RESPONSIBILITY).");
    expect(fillLine(line("p11"), receiver({}, { bottomOf: ["Office"] }), SETTINGS)).toBe("LAST IN Office. PAST GLORY IS ALL WE HAVE LEFT.");
    expect(fillLine(line("c01"), receiver({ carry: { name: "Faker", points: 30, bestSeries: 21 } }), SETTINGS)).toBe(
      "30 FROM Faker. 수고했어요 (WELL PLAYED)!",
    );
    expect(fillLine(line("c11"), receiver({ points: 88 }), SETTINGS)).toBe("88 POINTS! 커피차 (COFFEE TRUCK) FOR Minji FC!");
  });

  test("a line whose numbers the week lacks doesn't fill", () => {
    expect(fillLine(line("p24"), receiver(null), SETTINGS)).toBeUndefined();
    expect(fillLine(line("c16"), receiver(null), SETTINGS)).toBe("Minji FC: A DIFFERENTIAL IN A TEMPLATE WORLD.");
  });
});
