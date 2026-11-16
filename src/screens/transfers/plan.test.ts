// @vitest-environment node
import { describe, expect, test } from "vitest";
import { PICTURE_PLAN, PLAYERS, RULES, SQUAD } from "./fixtures";
import { bankNow, buy, EMPTY_PLAN, emptySlots, freeLeft, listRows, pendingHit, roleFilterFor, sell, transfersMade, type ListFilters, type Plan } from "./plan";
import { formatEok } from "../../parts";

const ALL: ListFilters = { role: "all", search: "", team: "all", sort: "points" };
const named = (name: string) => PLAYERS.find((p) => p.name === name)!;
const rows = (plan: Plan, filters: Partial<ListFilters> = {}) =>
  listRows(SQUAD, plan, PLAYERS, { ...ALL, role: plan.replacing ? roleFilterFor(plan.replacing) : "all", ...filters }, RULES);
const names = (plan: Plan, filters?: Partial<ListFilters>) => rows(plan, filters).map((r) => r.player.name);

describe("selling and buying", () => {
  test("tapping a squad player sells him and makes his slot the one the list fills", () => {
    expect(sell(EMPTY_PLAN, "flex")).toEqual({ sold: { flex: null }, replacing: "flex" });
  });

  test("tapping a sold slot again keeps who was bought into it", () => {
    expect(sell(sell(PICTURE_PLAN, "top"), "flex").sold.flex).toEqual(named("Kingen"));
  });

  test("a + buys into the slot being filled, and does nothing with no slot", () => {
    expect(buy(sell(EMPTY_PLAN, "flex"), named("DuDu")).sold.flex).toEqual(named("DuDu"));
    expect(buy(EMPTY_PLAN, named("DuDu"))).toBe(EMPTY_PLAN);
  });

  test("selling a player and buying him back cancels out: no transfer, no hit, his old price kept", () => {
    const flex = SQUAD.find((p) => p.slot === "flex")!;
    const back = { ...named("Kingen"), id: flex.id, name: flex.name, team: flex.team, role: flex.role, price: flex.price + 1_000_000 };
    const plan = buy(sell(EMPTY_PLAN, "flex"), back);
    const made = transfersMade(SQUAD, plan);
    expect(made).toBe(0);
    expect(pendingHit(RULES, made)).toBe(0);
    expect(bankNow(SQUAD, plan, RULES.bank)).toBe(RULES.bank);
  });

  test("a sale with no buy is an empty slot, not a transfer", () => {
    const plan = sell(PICTURE_PLAN, "top");
    expect(transfersMade(SQUAD, plan)).toBe(1);
    expect(emptySlots(plan)).toBe(1);
  });
});

describe("the top strip's figures", () => {
  test("the picture's one transfer, past no free ones, costs −6 and leaves 1.5m in the bank", () => {
    expect(pendingHit(RULES, 1)).toBe(6);
    expect(freeLeft(RULES, 1)).toBe(0);
    expect(formatEok(bankNow(SQUAD, PICTURE_PLAN, RULES.bank))).toBe("1.5m");
  });

  test("free transfers cover what they can and the rest cost the hit each", () => {
    const rules = { ...RULES, freeTransfers: 1 };
    expect([pendingHit(rules, 1), freeLeft(rules, 1)]).toEqual([0, 0]);
    expect([pendingHit(rules, 3), freeLeft(rules, 0)]).toEqual([12, 1]);
  });

  test("a sale with no buy yet puts his price in the bank", () => {
    expect(formatEok(bankNow(SQUAD, sell(EMPTY_PLAN, "flex"), RULES.bank))).toBe("8.0m");
  });
});

describe("the list", () => {
  test("for the Flex: every player, those who can be bought first by points, then the greyed with why", () => {
    expect(rows(PICTURE_PLAN).map((r) => [r.player.name, r.why])).toEqual([
      ["Kingen", undefined],
      ["DuDu", undefined],
      ["Hype", undefined],
      ["Clear", undefined],
      ["Clozer", undefined],
      ["Pollu", undefined],
      ["Chovy", "Team full"],
      ["Keria", "Team full"],
      ["Aiming", "Over budget"],
      ["ShowMaker", "Over budget"],
      ["Lucid", "Over budget"],
      ["PerfecT", "Team full"],
    ]);
  });

  test("a role slot opens on his role; the Coach on coaches", () => {
    const top = sell(EMPTY_PLAN, "top");
    expect(roleFilterFor("top")).toBe("top");
    expect(names(top)).toEqual(["Kingen", "DuDu", "Clear", "PerfecT"]);
    expect(names(sell(EMPTY_PLAN, "coach"))).toEqual(["Ssong", "cvMax", "Joker", "Ryu", "Homme", "Score"]);
    expect(roleFilterFor("bench1")).toBe("all");
  });

  test("a role chip, the search, the team filter and the sort each narrow or reorder it", () => {
    expect(names(PICTURE_PLAN, { role: "sup" })).toEqual(["Pollu", "Keria"]);
    expect(names(PICTURE_PLAN, { search: "cl" })).toEqual(["Clear", "Clozer"]);
    expect(names(PICTURE_PLAN, { team: "BRO" })).toEqual(["Clozer", "Pollu"]);
    expect(names(PICTURE_PLAN, { sort: "price" }).slice(0, 3)).toEqual(["Kingen", "DuDu", "Hype"]);
    expect(names(PICTURE_PLAN, { sort: "owned" }).slice(0, 2)).toEqual(["Kingen", "DuDu"]);
  });

  test("a player bought into another slot leaves the list", () => {
    const plan = sell(PICTURE_PLAN, "bench1");
    expect(names(plan)).not.toContain("Kingen");
  });

  test("with no slot being filled, it lists everyone not in the squad, none greyed", () => {
    const withZeus = [...PLAYERS, { ...named("Kingen"), id: "zeus", name: "Zeus" }];
    const listed = listRows(SQUAD, EMPTY_PLAN, withZeus, ALL, RULES);
    expect(listed.every((r) => r.why === undefined)).toBe(true);
    expect(listed.map((r) => r.player.name)).not.toContain("Zeus");
  });
});
