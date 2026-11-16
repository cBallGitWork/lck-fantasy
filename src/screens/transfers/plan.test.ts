// @vitest-environment node
import { describe, expect, test } from "vitest";
import { HIT_POINTS, WEEK4_FREE_TRANSFERS } from "../../fixtures/week3";
import { CONFIRMS, PICTURE_PLAN, PLAYERS, RULES, SQUAD, TRANSFERS_PICTURE } from "./fixtures";
import { byRole } from "./lineup";
import {
  add,
  ALL,
  bankNow,
  EMPTY_PLAN,
  emptySlots,
  freeLeft,
  freeUsed,
  listRows,
  nextAgainst,
  pendingHit,
  remove,
  restore,
  reviewBlock,
  roleFilterFor,
  transfersMade,
  type ListFilters,
  type Plan,
} from "./plan";
import { spotOf, STEP } from "./spots";
import { formatWon, WON_PER_M } from "../../parts";
import type { SquadSlot } from "../../rift";

const UNFILTERED: ListFilters = { role: ALL, search: "", team: ALL, sort: "points" };
const named = (name: string) => PLAYERS.find((p) => p.name === name)!;
const names = (plan: Plan, filters: Partial<ListFilters> = {}) => listRows(SQUAD, plan, PLAYERS, { ...UNFILTERED, ...filters }).map((p) => p.name);
/** Removes each slot in turn, from no changes. */
const removed = (...slots: SquadSlot[]) => slots.reduce((plan, slot) => remove(SQUAD, plan, slot).plan, EMPTY_PLAN);
/** Adds each player in turn. */
const bought = (plan: Plan, ...who: string[]) => who.reduce((p, name) => add(SQUAD, p, named(name), RULES).plan, plan);

describe("removing and restoring", () => {
  test("removing a player empties his slot, makes it the one the list fills, and says so", () => {
    expect(remove(SQUAD, EMPTY_PLAN, "flex")).toEqual({ plan: { sold: { flex: null }, replacing: "flex" }, toast: "Siwoo removed" });
  });

  test("removing a bought player empties the slot again, naming him", () => {
    expect(remove(SQUAD, PICTURE_PLAN, "flex")).toEqual({ plan: { sold: { flex: null }, replacing: "flex" }, toast: "Kingen removed" });
  });

  test("restoring puts the sold player back and moves the list to the next empty slot", () => {
    const step = restore(SQUAD, removed("top", "bot"), "top");
    expect(step.toast).toBe("Zeus restored");
    expect(step.plan).toEqual({ sold: { bot: null }, replacing: "bot" });
  });

  test("selling a player and buying him back cancels out: no transfer, no hit, his old price kept", () => {
    const flex = SQUAD.find((p) => p.slot === "flex")!;
    const back = { ...flex, priceWon: flex.priceWon + WON_PER_M };
    const plan = add(SQUAD, removed("flex"), back, RULES).plan;
    expect(transfersMade(SQUAD, plan)).toBe(0);
    expect(pendingHit(RULES, transfersMade(SQUAD, plan))).toBe(0);
    expect(bankNow(SQUAD, plan, RULES.bank)).toBe(RULES.bank);
  });
});

describe("several transfers in one go", () => {
  test("each + fills an empty slot, then the list moves on to the next one", () => {
    const one = add(SQUAD, removed("top", "flex"), named("Kingen"), RULES);
    expect(one.toast).toBe("Kingen added");
    expect(one.plan).toEqual({ sold: { top: null, flex: named("Kingen") }, replacing: "top" });
    const two = bought(one.plan, "DuDu");
    expect([two.replacing, transfersMade(SQUAD, two), emptySlots(two)]).toEqual([null, 2, 0]);
  });

  test("any role for any role: a Mid bought for a Top can be confirmed", () => {
    const plan = bought(removed("top"), "Clozer");
    expect(reviewBlock(SQUAD, plan, RULES)).toBeUndefined();
  });

  test("a buy that would leave a role empty is refused, with why", () => {
    const plan = removed("bot");
    expect(add(SQUAD, plan, named("Clozer"), RULES)).toEqual({ plan, toast: "No Bot left" });
    expect(add(SQUAD, plan, named("Hype"), RULES).toast).toBe("Hype added");
  });

  test("with two of a squad's only roles out, one buy of another role is refused, the second open slot can't fill both", () => {
    expect(add(SQUAD, removed("bot", "sup"), named("Clozer"), RULES).toast).toBe("No Bot left");
    expect(add(SQUAD, removed("bot", "flex"), named("Clozer"), RULES).toast).toBe("Clozer added");
  });

  test("a third from one team is refused, with the cap and the team", () => {
    expect(add(SQUAD, removed("top"), named("Chovy"), RULES).toast).toBe("Team full: 2 from GEN");
  });

  test("with no open slot he fits, the + asks for a removal first", () => {
    expect(add(SQUAD, EMPTY_PLAN, named("DuDu"), RULES).toast).toBe("Remove a player first");
    expect(add(SQUAD, removed("top"), named("Ryu"), RULES).toast).toBe("Remove your coach first");
  });

  test("over the budget is allowed while choosing and stops the confirm, the bank below zero", () => {
    const plan = bought(removed("flex"), "Aiming");
    expect(bankNow(SQUAD, plan, RULES.bank)).toBeLessThan(0);
    expect(reviewBlock(SQUAD, plan, RULES)).toBe("Over budget");
  });

  test("Review and confirm is off with no changes or a slot still empty", () => {
    expect(reviewBlock(SQUAD, EMPTY_PLAN, RULES)).toBe("No changes");
    expect(reviewBlock(SQUAD, removed("top", "flex"), RULES)).toBe("Slot empty");
    expect(reviewBlock(SQUAD, PICTURE_PLAN, RULES)).toBeUndefined();
  });
});

describe("the head's figures", () => {
  test("the picture's one transfer, past no free ones, costs −6 and leaves ₩5.5m in the bank", () => {
    expect(pendingHit(RULES, 1)).toBe(6);
    expect(freeLeft(RULES, 1)).toBe(0);
    expect(freeUsed(RULES, 1)).toBe(0);
    expect(formatWon(bankNow(SQUAD, PICTURE_PLAN, RULES.bank))).toBe("₩5.5m");
  });

  test("the week's free transfers, Home's figure, are spent by the confirms: two free, then one at the hit", () => {
    expect(WEEK4_FREE_TRANSFERS).toBe(2);
    expect(CONFIRMS.map((c) => [c.moves.length, c.hit])).toEqual([
      [1, HIT_POINTS],
      [2, 0],
    ]);
    expect(RULES.freeTransfers).toBe(0);
  });

  test("free transfers cover what they can and the rest cost the hit each", () => {
    const rules = { ...RULES, freeTransfers: 1 };
    expect([pendingHit(rules, 1), freeLeft(rules, 1), freeUsed(rules, 1)]).toEqual([0, 0, 1]);
    expect([pendingHit(rules, 3), freeLeft(rules, 0), freeUsed(rules, 3)]).toEqual([12, 1, 1]);
  });

  test("a sale with no buy yet puts his price in the bank", () => {
    expect(formatWon(bankNow(SQUAD, removed("flex"), RULES.bank))).toBe("₩12.0m");
  });
});

describe("the list", () => {
  test("everyone not in the squad, by points, none greyed", () => {
    expect(names(PICTURE_PLAN).slice(0, 6)).toEqual(["Chovy", "Keria", "ShowMaker", "Aiming", "Clozer", "PerfecT"]);
    expect(names(PICTURE_PLAN)).not.toContain("Kingen");
    expect(names(EMPTY_PLAN)).toContain("Kingen");
  });

  test("a removed slot opens on the role of who stood there; the Flex and bench on all; the Coach on coaches", () => {
    expect(roleFilterFor(SQUAD, "top")).toBe("top");
    expect(roleFilterFor(SQUAD, "flex")).toBe("all");
    expect(roleFilterFor(SQUAD, "bench1")).toBe("all");
    expect(roleFilterFor(SQUAD, "coach")).toBe("coach");
  });

  test("a role chip, the search, the team filter and the sort each narrow or reorder it", () => {
    expect(names(PICTURE_PLAN, { role: "sup" })).toEqual(["Keria", "Pollu"]);
    expect(names(PICTURE_PLAN, { search: "cl" })).toEqual(["Clozer", "Clear"]);
    expect(names(PICTURE_PLAN, { team: "BRO" })).toEqual(["Clozer", "Pollu"]);
    expect(names(PICTURE_PLAN, { sort: "price" }).slice(0, 2)).toEqual(["Chovy", "Aiming"]);
  });

  test("Next is the next opponent alone, no day", () => {
    expect(nextAgainst(TRANSFERS_PICTURE.fixtures, "HLE")).toBe("v DK");
    expect(nextAgainst(TRANSFERS_PICTURE.fixtures, "XXX")).toBe("");
  });
});

describe("the nine by role", () => {
  test("grouped by role, the coach last; the one in his own slot first", () => {
    expect(byRole(SQUAD, PICTURE_PLAN).map((g) => [g.role, g.holders.map((h) => h.player.name)])).toEqual([
      ["top", ["Zeus", "Kingen"]],
      ["jng", ["Canyon", "Cuzz"]],
      ["mid", ["Faker", "Bdd"]],
      ["bot", ["Ruler"]],
      ["sup", ["Delight"]],
      ["coach", ["kkOma"]],
    ]);
  });

  test("an empty slot is still held, by the one sold, marked empty", () => {
    const top = byRole(SQUAD, removed("top"))[0]!;
    expect(top.holders.find((h) => h.slot === "top")).toMatchObject({ empty: true, player: { name: "Zeus" } });
  });

  test("a role's several tiles stand a tile apart; a single one at its spot", () => {
    const [a, b] = [spotOf("mid", 0, 2), spotOf("mid", 1, 2)];
    expect(b[0] - a[0]).toBe(STEP);
    expect(spotOf("mid", 0, 1)).toEqual([(a[0] + b[0]) / 2, a[1]]);
  });
});
