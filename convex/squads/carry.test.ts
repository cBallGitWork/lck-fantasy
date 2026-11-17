import { describe, expect, test } from "vitest";
import { armbandProblems, carryingPlayers, lineupPoints, multiplied } from "./carry";
import { byPick, CARRY_MULTIPLIER, chovy, gumayusi, playedExcept, validSquad } from "./fixtures";
import { allPicks, pickKey } from "./squad";

/** Every pick of the valid squad scoring `each`, with some set apart. */
function pointsOf(each: number, special: Record<string, number> = {}) {
  return byPick(allPicks(validSquad()).map((pick) => [pick, special[pickKey(pick)] ?? each]));
}

const armband = { captain: "chovy" };

describe("armbandProblems", () => {
  test("a Captain from the six starting players is valid", () => {
    expect(armbandProblems(validSquad(), armband)).toEqual([]);
  });

  test("the coach can't wear the armband", () => {
    expect(armbandProblems(validSquad(), { captain: "kt" })).toEqual([{ rule: "armbandOffStarters", pickId: "kt" }]);
  });

  test("a bench player can't wear the armband", () => {
    expect(armbandProblems(validSquad(), { captain: "bdd" })).toEqual([{ rule: "armbandOffStarters", pickId: "bdd" }]);
  });

  test("the flex player can be the Captain", () => {
    expect(armbandProblems(validSquad(), { captain: "ruler" })).toEqual([]);
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

describe("the Captain's points", () => {
  /** The starters' points with the usual armband, no buff. */
  function pointsFor(played: Set<string>, points = pointsOf(4), band = armband) {
    return lineupPoints(validSquad().starters, points, carryingPlayers(band, played), CARRY_MULTIPLIER);
  }
  const pointsOfPick = (result: ReturnType<typeof pointsFor>, id: string) => result.find((s) => s.pick.id === id)?.points;

  test("a Captain who played has his points multiplied, nobody else's", () => {
    const result = pointsFor(playedExcept(validSquad()), pointsOf(4, { "player:chovy": 9 }));
    expect(pointsOfPick(result, "chovy")).toBe(13);
    expect(pointsOfPick(result, "keria")).toBe(4);
  });

  test("a Captain who played no game passes the multiplier to nobody: there is no vice-captain", () => {
    const played = playedExcept(validSquad(), chovy);
    expect(carryingPlayers(armband, played)).toEqual(new Set());
    expect(pointsFor(played).map((s) => s.points)).toEqual([4, 4, 4, 4, 4, 4, 4]);
  });

  test("the multiplier is the competition's: ×2 doubles", () => {
    const squad = validSquad();
    const carrying = carryingPlayers({ captain: "gumayusi" }, playedExcept(squad));
    const result = lineupPoints(squad.starters, pointsOf(4), carrying, 2);
    expect(pointsOfPick(result, gumayusi.id)).toBe(8);
  });
});
