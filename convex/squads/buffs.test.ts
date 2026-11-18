import { describe, expect, test } from "vitest";
import { BUFF_EFFECTS, buffLineup, buffProblems, type Buff } from "./buffs";
import { lineupPoints } from "./carry";
import { byPick, CARRY_MULTIPLIER, chovy, keria, ktCoach, playedExcept, validSquad } from "./fixtures";
import { allPicks, pickKey } from "./squad";

// A buff made by an admin: data, never code. These are fixtures.
const benchBoost: Buff = { id: "bb", name: "Bench Boost", effect: "benchBoost", perSplit: 1, stageIds: ["groups"] };
const doubleCaptain: Buff = {
  id: "dc", name: "Double Captain", effect: "doubleCaptain", multiplier: 2, perSplit: 1, stageIds: ["groups", "playoffs"],
};
const coachDiff: Buff = {
  id: "cd", name: "Coach Diff", effect: "coachMultiplier", multiplier: 3, perSplit: 1, stageIds: ["groups", "playoffs"],
};
const gameweek = { id: "gw5", splitId: "split1", stageId: "groups" };
const armband = { captain: "chovy" };
const bothCaptains = { captain: "chovy", secondCaptain: "keria" };

/** The gameweek's points for `buff`: every pick of the valid squad scores 4 unless given. */
function scored(buff: Buff | null, special: Record<string, number>, band: typeof armband = armband, played = playedExcept(validSquad())) {
  const points = byPick(allPicks(validSquad()).map((pick) => [pick, special[pickKey(pick)] ?? 4]));
  const { lineup, multipliers } = buffLineup(buff, validSquad(), band, played, CARRY_MULTIPLIER);
  return new Map(lineupPoints(lineup, points, multipliers).map((slot) => [slot.pick.id, slot.points]));
}

describe("buffs are data", () => {
  test("the code offers three effects: the bench, a second Captain and the coach; no Remake or Limitless", () => {
    expect(BUFF_EFFECTS).toEqual(["benchBoost", "doubleCaptain", "coachMultiplier"]);
  });

  test("an admin's buff, from a name, an effect, a count and stages, can be played", () => {
    const madeByAdmin: Buff = { id: "x", name: "Any name", effect: "coachMultiplier", multiplier: 4, perSplit: 2, stageIds: ["groups"] };
    expect(buffProblems(madeByAdmin, [], gameweek)).toEqual([]);
    expect(scored(madeByAdmin, { "coach:kt": 5 }).get(ktCoach.id)).toBe(20);
  });

  test("a buff can be played only in the stages it allows", () => {
    expect(buffProblems(benchBoost, [], { ...gameweek, stageId: "playoffs" })).toEqual([
      { rule: "notInThisStage", stageId: "playoffs" },
    ]);
  });
});

describe("how many, and when", () => {
  test("only one buff a gameweek", () => {
    const plays = [{ buffId: "bb", gameweekId: "gw5", splitId: "split1" }];
    expect(buffProblems(doubleCaptain, plays, gameweek)).toEqual([{ rule: "oneBuffPerGameweek", playedBuffId: "bb" }]);
  });

  test("one of each a split, and they reset at the split", () => {
    const plays = [{ buffId: "cd", gameweekId: "gw2", splitId: "split1" }];
    expect(buffProblems(coachDiff, plays, gameweek)).toEqual([{ rule: "noneLeftThisSplit", perSplit: 1 }]);
    expect(buffProblems(coachDiff, plays, { id: "gw12", splitId: "split2", stageId: "groups" })).toEqual([]);
  });

  test("one left unplayed when the split ends is lost: Split 2 still has one, never two", () => {
    const split2 = { id: "gw13", splitId: "split2", stageId: "groups" };
    expect(buffProblems(benchBoost, [{ buffId: "bb", gameweekId: "gw12", splitId: "split2" }], split2)).toEqual([
      { rule: "noneLeftThisSplit", perSplit: 1 },
    ]);
  });
});

describe("Bench Boost", () => {
  test("the two bench players score too, and nobody is subbed", () => {
    const squad = validSquad();
    const result = buffLineup(benchBoost, squad, armband, playedExcept(squad, chovy), CARRY_MULTIPLIER);
    expect(result.subs).toEqual([]);
    expect(result.lineup.map((s) => s.pick.id)).toEqual([...squad.starters.map((s) => s.pick.id), "bdd", "lucid"]);
  });

  test("without it, the bench scores only by auto-sub", () => {
    const squad = validSquad();
    const result = buffLineup(null, squad, armband, playedExcept(squad, chovy), CARRY_MULTIPLIER);
    expect(result.lineup).toHaveLength(7);
    expect(result.subs.map((sub) => sub.in.id)).toEqual(["bdd"]);
  });
});

describe("Double Captain", () => {
  test("both Captains score ×2: 12 and 10 give 24 and 20, not 18 and 10", () => {
    const points = scored(doubleCaptain, { "player:chovy": 12, "player:keria": 10 }, bothCaptains);
    expect(points.get(chovy.id)).toBe(24);
    expect(points.get(keria.id)).toBe(20);
    expect(points.get("zeus")).toBe(4);
  });

  test("without it, the one Captain takes the usual ×1.5", () => {
    expect(scored(null, { "player:chovy": 12 }).get(chovy.id)).toBe(18);
  });

  test("a Captain who plays no game scores nothing, and nobody steps in", () => {
    const squad = validSquad();
    const { multipliers } = buffLineup(doubleCaptain, squad, bothCaptains, playedExcept(squad, chovy), CARRY_MULTIPLIER);
    expect(multipliers).toEqual(new Map([[pickKey(keria), 2]]));
  });

  test("it needs a second Captain, and a second Captain needs it", () => {
    const played = playedExcept(validSquad());
    expect(() => buffLineup(doubleCaptain, validSquad(), armband, played, CARRY_MULTIPLIER)).toThrow("no second Captain");
    expect(() => buffLineup(benchBoost, validSquad(), bothCaptains, played, CARRY_MULTIPLIER)).toThrow("without Double Captain");
  });
});

describe("Coach Diff", () => {
  test("the coach scores ×3: 11 over the week's two series is 33, and the Captain keeps his ×1.5", () => {
    const points = scored(coachDiff, { "coach:kt": 11, "player:chovy": 10 });
    expect(points.get(ktCoach.id)).toBe(33);
    expect(points.get(chovy.id)).toBe(15);
  });

  test("a minus is multiplied too: a lone series loss of −1 is −3", () => {
    expect(scored(coachDiff, { "coach:kt": -1 }).get(ktCoach.id)).toBe(-3);
  });
});
