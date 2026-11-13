import { describe, expect, test } from "vitest";
import { armbandProblems, carryingPlayer, lineupPoints, multiplied } from "./carry";
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
});

describe("the Carry's points", () => {
  test("a Carry who played has his points multiplied, nobody else's", () => {
    const squad = validSquad();
    const result = lineupPoints(squad.starters, pointsOf(4, { "player:chovy": 9 }), armband, playedExcept(squad), CARRY_MULTIPLIER);
    expect(result.find((s) => s.pick.id === "chovy")?.points).toBe(13);
    expect(result.find((s) => s.pick.id === "keria")?.points).toBe(4);
  });

  test("a Carry who played no game passes the multiplier to the Vice-carry", () => {
    const squad = validSquad();
    const played = playedExcept(squad, chovy);
    expect(carryingPlayer(armband, played)).toBe("keria");
    const result = lineupPoints(squad.starters, pointsOf(4), armband, played, CARRY_MULTIPLIER);
    expect(result.find((s) => s.pick.id === "keria")?.points).toBe(6);
  });

  test("if neither played, nobody's points are multiplied", () => {
    const squad = validSquad();
    const played = playedExcept(squad, chovy, keria);
    expect(carryingPlayer(armband, played)).toBeNull();
    const result = lineupPoints(squad.starters, pointsOf(4), armband, played, CARRY_MULTIPLIER);
    expect(result.find((s) => s.pick.id === "gumayusi")?.points).toBe(4);
    expect(result.map((s) => s.points)).toEqual([4, 4, 4, 4, 4, 4, 4]);
  });

  test("the multiplier is the competition's: ×2 doubles", () => {
    const squad = validSquad();
    const result = lineupPoints(squad.starters, pointsOf(4), { carry: "gumayusi", viceCarry: "keria" }, playedExcept(squad), 2);
    expect(result.find((s) => s.pick.id === gumayusi.id)?.points).toBe(8);
  });
});
