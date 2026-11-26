// @vitest-environment node
import { describe, expect, test } from "vitest";
import { HIT_POINTS, WEEK4_FREE_TRANSFERS } from "../../fixtures/week3";
import { CONFIRMS, PICTURE_PLAN, PLAYERS, RULES, SQUAD, TRANSFERS_PICTURE } from "./fixtures";
import { arrange, byRole, lineupIds } from "./lineup";
import {
  add,
  ALL,
  bankNow,
  confirmTransfers,
  EMPTY_PLAN,
  emptySlots,
  freeLeft,
  freeUsed,
  hitOf,
  listRows,
  pendingHit,
  remove,
  restore,
  reviewBlock,
  roleFilterFor,
  slotHolding,
  transfersMade,
  weekAgainst,
  type ListFilters,
  type Plan,
} from "./plan";
import { groupAt } from "./spots";
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

  test("any role for any role: a Mid bought for a Top, the Top who started takes the Top slot", () => {
    const plan = bought(removed("top"), "Clozer");
    expect(reviewBlock(SQUAD, plan, RULES)).toBeUndefined();
    const lineup = arrange(SQUAD, plan);
    expect([lineup.top.name, lineup.flex.name, lineup.mid.name]).toEqual(["Siwoo", "Clozer", "Faker"]);
  });

  test("a buy that would leave a role empty is refused, with why", () => {
    const plan = removed("bot");
    expect(add(SQUAD, plan, named("Clozer"), RULES)).toEqual({ plan, toast: "You'd have no Bot" });
    expect(add(SQUAD, plan, named("Hype"), RULES).toast).toBe("Hype added");
  });

  test("with two of a squad's only roles out, one buy of another role is refused, the second open slot can't fill both", () => {
    expect(add(SQUAD, removed("bot", "sup"), named("Clozer"), RULES).toast).toBe("You'd have no Bot");
    expect(add(SQUAD, removed("bot", "flex"), named("Clozer"), RULES).toast).toBe("Clozer added");
  });

  test("a third from one team is refused, with the cap and the team", () => {
    expect(add(SQUAD, removed("top"), named("Chovy"), RULES).toast).toBe("Max 2 from GEN");
  });

  test("with no open slot he fits, the + says to sell a player first (spec/12, Before anyone is sold)", () => {
    expect(add(SQUAD, EMPTY_PLAN, named("DuDu"), RULES)).toEqual({ plan: EMPTY_PLAN, toast: "Sell a player first" });
    expect(add(SQUAD, removed("top"), named("Ryu"), RULES).toast).toBe("One coach only. Sell your coach first");
  });

  test("over the budget is allowed while choosing and stops the confirm, the bank below zero", () => {
    const plan = bought(removed("flex"), "Aiming");
    expect(bankNow(SQUAD, plan, RULES.bank)).toBeLessThan(0);
    expect(reviewBlock(SQUAD, plan, RULES)).toBe("Over budget");
  });

  test("Review and confirm is off with no changes or players still to buy (approved/transfers/, What binds 4)", () => {
    expect(reviewBlock(SQUAD, EMPTY_PLAN, RULES)).toBe("No changes");
    expect(reviewBlock(SQUAD, removed("top"), RULES)).toBe("1 player to buy");
    expect(reviewBlock(SQUAD, removed("top", "flex"), RULES)).toBe("2 players to buy");
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
    expect(names(PICTURE_PLAN).slice(0, 6)).toEqual(["Chovy", "Keria", "Oner", "ShowMaker", "Aiming", "Clozer"]);
    expect(names(PICTURE_PLAN)).not.toContain("Kingen");
    expect(names(EMPTY_PLAN)).toContain("Kingen");
  });

  test("with no one sold, coaches can be browsed under the Coach chip (spec/12, The list's role chips)", () => {
    const coaches = PLAYERS.filter((p) => p.role === "coach").map((p) => p.name);
    expect(coaches.length).toBeGreaterThan(0);
    expect(names(EMPTY_PLAN, { role: "coach" }).sort()).toEqual([...coaches].sort());
  });

  test("the list opens on the sold player's role, whatever slot he stood in, and on All roles before any sale (What binds 9)", () => {
    expect(roleFilterFor(SQUAD, removed("top"))).toBe("top");
    expect(roleFilterFor(SQUAD, removed("flex"))).toBe("top");
    expect(roleFilterFor(SQUAD, removed("bench1"))).toBe("mid");
    expect(roleFilterFor(SQUAD, removed("coach"))).toBe("coach");
    expect(roleFilterFor(SQUAD, EMPTY_PLAN)).toBe("all");
  });

  test("a role chip, the search, the team filter and the sort each narrow or reorder it", () => {
    expect(names(PICTURE_PLAN, { role: "sup" })).toEqual(["Keria", "Lehends", "Pollu"]);
    expect(names(PICTURE_PLAN, { search: "cl" })).toEqual(["Clozer", "Clear"]);
    expect(names(PICTURE_PLAN, { team: "BRO" })).toEqual(["Clozer", "Pollu"]);
    expect(names(PICTURE_PLAN, { sort: "price" }).slice(0, 2)).toEqual(["Chovy", "Oner"]);
  });

  test("Next is both of the week's opponents in the order played, no day (Craig, 26 Nov 2026)", () => {
    expect(weekAgainst(TRANSFERS_PICTURE.fixtures, "HLE")).toBe("v DK, NS");
    expect(weekAgainst(TRANSFERS_PICTURE.fixtures, "XXX")).toBe("");
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

  test("a role's group stands at its place; a second Bot moves the bots' group left, clear of the Support", () => {
    expect(groupAt("mid", 2)).toEqual(groupAt("mid", 1));
    const [one, two] = [groupAt("bot", 1), groupAt("bot", 2)];
    expect(two[0]).toBeLessThan(one[0]);
    expect(two[1]).toBe(one[1]);
  });

  test("a player stands in a slot while he is one of the nine; a sold one in none", () => {
    expect(slotHolding(SQUAD, PICTURE_PLAN, named("Kingen").id)).toBe("flex");
    expect(slotHolding(SQUAD, PICTURE_PLAN, SQUAD.find((p) => p.name === "Siwoo")!.id)).toBeUndefined();
  });

  test("each transfer made now is free while free ones are left, then costs the hit", () => {
    const rules = { ...RULES, freeTransfers: 1 };
    expect([hitOf(rules, 0), hitOf(rules, 1)]).toEqual([0, HIT_POINTS]);
  });
});

describe("a confirm applied (#215)", () => {
  const transfers = [{ out: SQUAD.find((p) => p.name === "Siwoo")!.id, in: named("Kingen").id }];
  const after = confirmTransfers(SQUAD, PLAYERS, RULES, transfers, lineupIds(SQUAD, PICTURE_PLAN));

  test("Kingen stands in Siwoo's place at his list price; the rest keep their slots and the C", () => {
    expect(after.squad.find((p) => p.slot === "flex")).toMatchObject({ name: "Kingen", priceWon: named("Kingen").priceWon });
    expect(after.squad.map((p) => p.name)).not.toContain("Siwoo");
    expect(after.squad.find((p) => p.name === "Faker")!.mark).toBe("C");
  });

  test("the bank, free transfers and the hit are what the changes showed", () => {
    expect(after.rules.bank).toBe(bankNow(SQUAD, PICTURE_PLAN, RULES.bank));
    expect(after.rules.freeTransfers).toBe(freeLeft(RULES, 1));
    expect(after.hit).toBe(pendingHit(RULES, 1));
    expect(after.moves).toEqual([{ out: "Siwoo", in: "Kingen" }]);
  });

  test("the squad after it has no changes to review", () => {
    expect(reviewBlock(after.squad, EMPTY_PLAN, after.rules)).toBe("No changes");
  });
});

test("selling the Captain passes the C to whoever starts in his slot once the squad is arranged (spec/04)", () => {
  // Captain Faker (mid) sold for Lucid, a jungler: Bdd, the bench mid, starts at mid and is the Captain.
  const plan = bought(removed("mid"), "Lucid");
  const lineup = lineupIds(SQUAD, plan);
  const after = confirmTransfers(SQUAD, PLAYERS, RULES, [{ out: SQUAD.find((p) => p.name === "Faker")!.id, in: named("Lucid").id }], lineup);
  const at = (slot: SquadSlot) => after.squad.find((p) => p.slot === slot)!;
  expect([at("mid").name, at("mid").mark, at("bench1").name, at("bench1").mark]).toEqual(["Bdd", "C", "Lucid", undefined]);
  expect(after.squad.filter((p) => p.mark)).toHaveLength(1);
});
