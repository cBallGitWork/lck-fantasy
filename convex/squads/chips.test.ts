import { describe, expect, test } from "vitest";
import { budgetProblems } from "./budget";
import { lineupPoints } from "./carry";
import { chipLineup, chipProblems, chipSquadRules, squadAfterGameweek, transfersUnlimited, type Chip } from "./chips";
import { chovy, coach, player, playedExcept, REGULAR_SETTINGS, validSquad, withStarter } from "./fixtures";
import { allPicks, pickKey, squadProblems } from "./squad";
import { settleTransfers } from "./transfers";

// A chip made by an admin: data, never code. These are fixtures.
const remake: Chip = { id: "remake", name: "Remake", effect: "remake", perSplit: 1, stageIds: ["groups", "playoffs"] };
const benchBoost: Chip = { id: "bb", name: "Bench Boost", effect: "benchBoost", perSplit: 1, stageIds: ["groups"] };
const gameweek = { id: "gw5", splitId: "split1", stageId: "groups" };
const armband = { carry: "chovy", viceCarry: "keria" };
const CARRY_MULTIPLIER = 1.5;

describe("chips are data", () => {
  test("an admin's chip, from a name, an effect, a count and stages, can be played", () => {
    const madeByAdmin: Chip = { id: "x", name: "Any name", effect: "dualCarry", perSplit: 2, stageIds: ["groups"] };
    expect(chipProblems(madeByAdmin, [], gameweek)).toEqual([]);
  });

  test("a chip can be played only in the stages it allows", () => {
    expect(chipProblems(benchBoost, [], { ...gameweek, stageId: "playoffs" })).toEqual([
      { rule: "notInThisStage", stageId: "playoffs" },
    ]);
  });
});

describe("how many, and when", () => {
  test("only one chip a gameweek", () => {
    const plays = [{ chipId: "bb", gameweekId: "gw5", splitId: "split1" }];
    expect(chipProblems(remake, plays, gameweek)).toEqual([{ rule: "oneChipPerGameweek", playedChipId: "bb" }]);
  });

  test("one of each a split, and they reset at the split", () => {
    const plays = [{ chipId: "remake", gameweekId: "gw2", splitId: "split1" }];
    expect(chipProblems(remake, plays, gameweek)).toEqual([{ rule: "noneLeftThisSplit", perSplit: 1 }]);
    expect(chipProblems(remake, plays, { id: "gw12", splitId: "split2", stageId: "groups" })).toEqual([]);
  });
});

describe("Remake", () => {
  test("transfers are free and unlimited, and the squad is kept", () => {
    expect(transfersUnlimited("remake")).toBe(true);
    const after = withStarter(validSquad(), "mid", player("faker", "t1", "mid"));
    expect(squadAfterGameweek("remake", validSquad(), after)).toBe(after);
  });

  test("the bank of free transfers after it isn't settled until Craig answers", () => {
    const settings = { freePerGameweek: 1, bankCap: 3, hitPoints: 4, freeAfterUnlimited: 2 };
    const gw = { opensAt: 0, deadline: 1, unlimited: false, toppedUp: false };
    expect(() => settleTransfers(2, [], gw, settings, "remake")).toThrow(/wait for Craig/);
  });
});

describe("Limitless", () => {
  test("no budget and no team cap, but the roles still apply", () => {
    const { settings, budget } = chipSquadRules("limitless", REGULAR_SETTINGS, 100);
    const fourT1 = withStarter(withStarter(validSquad(), "coach", coach("t1")), "mid", player("faker", "t1", "mid"));
    expect(squadProblems(fourT1, settings)).toEqual([]);
    const prices = new Map(allPicks(fourT1).map((pick) => [pickKey(pick), 50]));
    expect(budgetProblems(fourT1, prices, budget)).toEqual([]);
    expect(squadProblems(withStarter(fourT1, "top", chovy), settings)).toContainEqual({
      rule: "wrongRole", slot: "top", pickId: "chovy",
    });
  });

  test("transfers are free and unlimited, and the squad goes back for the next gameweek", () => {
    expect(transfersUnlimited("limitless")).toBe(true);
    const during = withStarter(validSquad(), "mid", player("faker", "t1", "mid"));
    expect(squadAfterGameweek("limitless", validSquad(), during)).toEqual(validSquad());
  });

  test("other chips leave the budget and cap alone", () => {
    expect(chipSquadRules("remake", REGULAR_SETTINGS, 100)).toEqual({ settings: REGULAR_SETTINGS, budget: 100 });
  });
});

describe("Bench Boost", () => {
  test("the two bench players score too, and nobody is subbed", () => {
    const squad = validSquad();
    const result = chipLineup("benchBoost", squad, armband, playedExcept(squad, chovy));
    expect(result.subs).toEqual([]);
    expect(result.lineup.map((s) => s.pick.id)).toEqual([...squad.starters.map((s) => s.pick.id), "bdd", "lucid"]);
  });

  test("without it, the bench scores only by auto-sub", () => {
    const squad = validSquad();
    const result = chipLineup(null, squad, armband, playedExcept(squad, chovy));
    expect(result.lineup).toHaveLength(7);
    expect(result.subs.map((sub) => sub.in.id)).toEqual(["bdd"]);
  });
});

describe("Dual Carry", () => {
  test("the Vice-carry scores ×1.5 too: 12 and 10 give 18 and 15", () => {
    const squad = validSquad();
    const points = new Map([["player:chovy", 12], ["player:keria", 10]]);
    const { lineup, carrying } = chipLineup("dualCarry", squad, armband, playedExcept(squad));
    const scored = lineupPoints(lineup, points, carrying, CARRY_MULTIPLIER);
    expect(scored.find((s) => s.pick.id === "chovy")?.points).toBe(18);
    expect(scored.find((s) => s.pick.id === "keria")?.points).toBe(15);
  });

  test("if the Carry plays no game, nobody else steps in", () => {
    const squad = validSquad();
    const { carrying } = chipLineup("dualCarry", squad, armband, playedExcept(squad, chovy));
    expect(carrying).toEqual(new Set(["keria"]));
  });
});
