import { convexTest } from "convex-test";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import lckTeams from "../../data/lck/teams.json";
import { internal } from "../_generated/api";
import schema from "../schema";
import { budgetProblems } from "../squads/budget";
import { squadProblems, type Squad } from "../squads/squad";
import { modules } from "../test.setup";
import { LEC_2027 } from "../leagues/store.setup";
import { LCK_2027, pickOfPrice, pricesFor } from "../world/season";

const LCK = LCK_2027.competition.name;
const YEAR = LCK_2027.year;

/** data/lck's 2027 season, with every LCK team stored as its feed would store it. */
async function world() {
  const t = convexTest(schema, modules);
  await t.run(async (ctx) => {
    for (const team of lckTeams.teams) await ctx.db.insert("teams", { name: team.name, oeId: team.oeId });
  });
  await t.mutation(internal.world.season.loadSeason, {});
  return t;
}

const add = (t: Awaited<ReturnType<typeof world>>, managers: number, competitions = [LCK]) =>
  t.mutation(internal.admin.testManagerStore.addTestManagers, { year: YEAR, groups: [{ competitions, managers }] });

describe("test managers sign up as managers do (#400)", () => {
  beforeEach(() => vi.useFakeTimers({ toFake: ["setTimeout"] }));
  afterEach(() => vi.useRealTimers());

  test("a run past one batch signs up every one, each with a legal squad, his name and his three leagues", async () => {
    const t = await world();
    expect(await add(t, 30)).toEqual({ added: 25, upTo: 25, of: 30 });
    await t.finishAllScheduledFunctions(vi.runAllTimers);

    const stored = await t.run(async (ctx) => {
      const managers = await ctx.db.query("managers").collect();
      const entries = await ctx.db.query("entries").collect();
      const squads = await Promise.all(entries.map(async (entry) => {
        const picks = await ctx.db.query("picks").withIndex("by_entry", (q) => q.eq("entry", entry._id)).collect();
        const squad: Squad = {
          starters: picks.filter((p) => p.slot !== "bench").map((p) => ({ slot: p.slot as Squad["starters"][number]["slot"], pick: pickOfPrice(p) })),
          bench: picks.filter((p) => p.slot === "bench").sort((a, b) => a.benchOrder! - b.benchOrder!).map(pickOfPrice),
        };
        const leagues = await ctx.db.query("leagueEntries").withIndex("by_entry", (q) => q.eq("entry", entry._id)).collect();
        return { squad, leagues: leagues.length, captains: picks.filter((p) => p.captain).length };
      }));
      return { managers, entries, squads };
    });

    expect(stored.managers).toHaveLength(30);
    expect(new Set(stored.managers.map((m) => m.testStyle)).size).toBe(4);
    for (const manager of stored.managers) expect(manager.name).toMatch(/^\S+ [A-Z]\.$/);
    expect(stored.entries).toHaveLength(30);
    const prices = pricesFor(LCK_2027.prices.flatMap((week) => week.picks.map((pick) => ({ ...pick, fromGameweek: week.fromGameweek }))), 1);
    for (const { squad, leagues, captains } of stored.squads) {
      expect(squadProblems(squad, LCK_2027.settings.squad)).toEqual([]);
      expect(budgetProblems(squad, prices, LCK_2027.settings.budget)).toEqual([]);
      expect(leagues).toBe(3);
      expect(captains).toBe(1);
    }
  });

  test("a loyal fan's favourite team is the one he is loyal to: his squad holds its players", async () => {
    const t = await world();
    await add(t, 8);
    const loyal = await t.run(async (ctx) => {
      const managers = (await ctx.db.query("managers").collect()).filter((m) => m.testStyle === "loyal");
      return Promise.all(managers.map(async (manager) => {
        const entry = (await ctx.db.query("entries").withIndex("by_manager", (q) => q.eq("manager", manager._id)).unique())!;
        const team = (await ctx.db.get(entry.favouriteTeam))!;
        const code = lckTeams.teams.find((known) => known.oeId === team.oeId)!.code;
        const picks = await ctx.db.query("picks").withIndex("by_entry", (q) => q.eq("entry", entry._id)).collect();
        return picks.filter((pick) => pick.team === code).length;
      }));
    });
    expect(loyal).toHaveLength(2);
    for (const own of loyal) expect(own).toBe(LCK_2027.settings.squad.teamCap);
  });

  test("run again, a test manager with a team keeps it", async () => {
    const t = await world();
    await add(t, 5);
    expect(await add(t, 7)).toEqual({ added: 2, upTo: 7, of: 7 });
    expect(await t.run((ctx) => ctx.db.query("entries").collect())).toHaveLength(7);
  });

  test("a competition with no teams in data is said so, not skipped", async () => {
    const t = await world();
    await t.mutation(internal.world.season.loadSeason, { data: LEC_2027 });
    await expect(add(t, 1, [LCK, "LEC"])).rejects.toThrow("No LEC teams in data");
  });
});
