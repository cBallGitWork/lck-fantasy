import { describe, expect, test } from "vitest";
import { armbandProblems, carryingPlayers, lineupPoints, multiplied } from "./carry";
import { chovy, gumayusi, keria, playedExcept, validSquad } from "./fixtures";
import { allPicks, pickKey } from "./squad";

const CARRY_MULTIPLIER = 1.5; // a fixture value: the real one is the competition's data

/** Every pick of the valid squad scoring `each`, with some set apart. */
function pointsOf(each: number, special: Record<string, number> = {}) {
  return new Map(allPicks(validSquad()).map((pick) => [pickKey(pick), special[pickKey(pick)] ?? each]));
}

const armband = { carry: "chovy", viceCarry: "keria" };

describe("armbandProblems", () => {
  test("a Carry and Vice-carry from the six starting players are valid", () => {
    expect(armbandProblems(validSquad(), armband)).toEqual([]);
  });

  test("the coach can't wear the armband", () => {
    expect(armbandProblems(validSquad(), { carry: "kt", viceCarry: "keria" })).toEqual([
      { rule: "armbandOffStarters", band: "carry", pickId: "kt" },
    ]);
  });

  test("a bench player can't wear the armband", () => {
    expect(armbandProblems(validSquad(), { carry: "chovy", viceCarry: "bdd" })).toEqual([
      { rule: "armbandOffStarters", band: "viceCarry", pickId: "bdd" },
    ]);
  });

  test("the flex player can be the Carry", () => {
    expect(armbandProblems(validSquad(), { carry: "ruler", viceCarry: "keria" })).toEqual([]);
  });

  test("the Carry and Vice-carry are two players", () => {
    expect(armbandProblems(validSquad(), { carry: "chovy", viceCarry: "chovy" })).toEqual([
      { rule: "carryIsViceCarry", pickId: "chovy" },
    ]);
  });
});

describe("multiplied", () => {
  test("×1.5 rounds down: a 9 becomes 13", () => {
    expect(multiplied(9, CARRY_MULTIPLIER)).toBe(13);
    expect(multiplied(10, CARRY_MULTIPLIER)).toBe(15);
  });

  test("a minus rounds towards zero: a −3 becomes −4, and 0 stays 0", () => {
    expect(multiplied(-3, CARRY_MULTIPLIER)).toBe(-4);
    expect(Object.is(multiplied(0, CARRY_MULTIPLIER), 0)).toBe(true);
  });
});

describe("the Carry's points", () => {
  /** The starters' points with the usual armband: one Carry, no Dual Carry. */
  function pointsFor(played: Set<string>, points = pointsOf(4), band = armband) {
    return lineupPoints(validSquad().starters, points, carryingPlayers(band, played, false), CARRY_MULTIPLIER);
  }
  const pointsOfPick = (result: ReturnType<typeof pointsFor>, id: string) => result.find((s) => s.pick.id === id)?.points;

  test("a Carry who played has his points multiplied, nobody else's", () => {
    const result = pointsFor(playedExcept(validSquad()), pointsOf(4, { "player:chovy": 9 }));
    expect(pointsOfPick(result, "chovy")).toBe(13);
    expect(pointsOfPick(result, "keria")).toBe(4);
  });

  test("a Carry who played no game passes the multiplier to the Vice-carry", () => {
    const played = playedExcept(validSquad(), chovy);
    expect(carryingPlayers(armband, played, false)).toEqual(new Set(["keria"]));
    expect(pointsOfPick(pointsFor(played), "keria")).toBe(6);
  });

  test("if neither played, nobody's points are multiplied", () => {
    const played = playedExcept(validSquad(), chovy, keria);
    expect(carryingPlayers(armband, played, false)).toEqual(new Set());
    expect(pointsFor(played).map((s) => s.points)).toEqual([4, 4, 4, 4, 4, 4, 4]);
  });

  test("the multiplier is the competition's: ×2 doubles", () => {
    const squad = validSquad();
    const carrying = carryingPlayers({ carry: "gumayusi", viceCarry: "keria" }, playedExcept(squad), false);
    const result = lineupPoints(squad.starters, pointsOf(4), carrying, 2);
    expect(pointsOfPick(result, gumayusi.id)).toBe(8);
  });
});
