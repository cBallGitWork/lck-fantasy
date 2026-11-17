import { describe, expect, test } from "vitest";
import { budgetProblems } from "./budget";
import { buffLineup, buffProblems, buffSquadRules, squadAfterGameweek, transfersUnlimited, type Buff } from "./buffs";
import {
  byPick, chovy, confirmedTransfers, faker, fourFromT1, playedExcept, REGULAR_SETTINGS, TRANSFER_SETTINGS, validSquad, withStarter,
} from "./fixtures";
import { allPicks, squadProblems } from "./squad";
import { settleTransfers } from "./transfers";

// A buff made by an admin: data, never code. These are fixtures.
const remake: Buff = { id: "remake", name: "Remake", effect: "remake", perSplit: 1, stageIds: ["groups", "playoffs"] };
const benchBoost: Buff = { id: "bb", name: "Bench Boost", effect: "benchBoost", perSplit: 1, stageIds: ["groups"] };
const gameweek = { id: "gw5", splitId: "split1", stageId: "groups" };
const armband = { captain: "chovy" };

describe("buffs are data", () => {
  test("an admin's buff, from a name, an effect, a count and stages, can be played", () => {
    const madeByAdmin: Buff = { id: "x", name: "Any name", effect: "dualCarry", perSplit: 2, stageIds: ["groups"] };
    expect(buffProblems(madeByAdmin, [], gameweek)).toEqual([]);
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
    expect(buffProblems(remake, plays, gameweek)).toEqual([{ rule: "oneBuffPerGameweek", playedBuffId: "bb" }]);
  });

  test("one of each a split, and they reset at the split", () => {
    const plays = [{ buffId: "remake", gameweekId: "gw2", splitId: "split1" }];
    expect(buffProblems(remake, plays, gameweek)).toEqual([{ rule: "noneLeftThisSplit", perSplit: 1 }]);
    expect(buffProblems(remake, plays, { id: "gw12", splitId: "split2", stageId: "groups" })).toEqual([]);
  });
});

describe("Remake", () => {
  test("transfers are free and unlimited, and the squad is kept", () => {
    expect(transfersUnlimited("remake")).toBe(true);
    const after = withStarter(validSquad(), "mid", faker);
    expect(squadAfterGameweek("remake", validSquad(), after)).toBe(after);
  });

  test("costs no hits and keeps the bank: 2 stay 2", () => {
    const gw = { opensAt: 0, deadline: 1, unlimited: false, opensSplit: false, toppedUp: false };
    expect(settleTransfers(2, confirmedTransfers(5), gw, TRANSFER_SETTINGS, "remake")).toEqual({ hit: 0, nextFree: 2 });
  });
});

describe("Limitless", () => {
  test("no budget and no team cap, but the roles still apply", () => {
    const { settings, budget } = buffSquadRules("limitless", REGULAR_SETTINGS, 100);
    const fourT1 = fourFromT1();
    expect(squadProblems(fourT1, settings)).toEqual([]);
    const prices = byPick(allPicks(fourT1).map((pick) => [pick, 50]));
    expect(budgetProblems(fourT1, prices, budget)).toEqual([]);
    expect(squadProblems(withStarter(fourT1, "top", chovy), settings)).toContainEqual({
      rule: "wrongRole", slot: "top", pickId: "chovy",
    });
  });

  test("transfers are free and unlimited, and the squad goes back for the next gameweek", () => {
    expect(transfersUnlimited("limitless")).toBe(true);
    const during = withStarter(validSquad(), "mid", faker);
    expect(squadAfterGameweek("limitless", validSquad(), during)).toEqual(validSquad());
  });

  test("other buffs leave the budget and cap alone", () => {
    expect(buffSquadRules("remake", REGULAR_SETTINGS, 100)).toEqual({ settings: REGULAR_SETTINGS, budget: 100 });
  });
});

describe("Bench Boost", () => {
  test("the two bench players score too, and nobody is subbed", () => {
    const squad = validSquad();
    const result = buffLineup("benchBoost", squad, armband, playedExcept(squad, chovy));
    expect(result.subs).toEqual([]);
    expect(result.lineup.map((s) => s.pick.id)).toEqual([...squad.starters.map((s) => s.pick.id), "bdd", "lucid"]);
  });

  test("without it, the bench scores only by auto-sub", () => {
    const squad = validSquad();
    const result = buffLineup(null, squad, armband, playedExcept(squad, chovy));
    expect(result.lineup).toHaveLength(7);
    expect(result.subs.map((sub) => sub.in.id)).toEqual(["bdd"]);
  });
});

describe("Double Captain", () => {
  test("if the Captain plays no game, nobody steps in", () => {
    const squad = validSquad();
    const { carrying } = buffLineup("dualCarry", squad, armband, playedExcept(squad, chovy));
    expect(carrying).toEqual(new Set());
  });
});
