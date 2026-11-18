import { describe, expect, test } from "vitest";
import { armbandProblems, carryingPlayers, lineupPoints, multiplied } from "./carry";
import { byPick, CARRY_MULTIPLIER, chovy, gumayusi, keria, playedExcept, validSquad } from "./fixtures";
import { allPicks, pickKey, playerKey } from "./squad";

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

  test("a second Captain is picked by the same rules, and is not the first", () => {
    expect(armbandProblems(validSquad(), { captain: "chovy", secondCaptain: "keria" })).toEqual([]);
    expect(armbandProblems(validSquad(), { captain: "chovy", secondCaptain: "bdd" })).toEqual([{ rule: "armbandOffStarters", pickId: "bdd" }]);
    expect(armbandProblems(validSquad(), { captain: "chovy", secondCaptain: "chovy" })).toEqual([{ rule: "sameCaptainTwice", pickId: "chovy" }]);
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
  /** Each Captain who played, taking `multiplier`. */
  const multipliersOf = (played: Set<string>, band = armband, multiplier = CARRY_MULTIPLIER) =>
    new Map([...carryingPlayers(band, played)].map((id) => [playerKey(id), multiplier]));
  /** The starters' points with the usual armband, no buff. */
  function pointsFor(played: Set<string>, points = pointsOf(4)) {
    return lineupPoints(validSquad().starters, points, multipliersOf(played));
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
    const result = lineupPoints(squad.starters, pointsOf(4), multipliersOf(playedExcept(squad), { captain: "gumayusi" }, 2));
    expect(pointsOfPick(result, gumayusi.id)).toBe(8);
  });

  test("both Captains who played take the multiplier; one who played no game takes nothing", () => {
    const both = { captain: "chovy", secondCaptain: "keria" };
    expect(carryingPlayers(both, playedExcept(validSquad()))).toEqual(new Set(["chovy", "keria"]));
    expect(carryingPlayers(both, playedExcept(validSquad(), keria))).toEqual(new Set(["chovy"]));
  });
});
