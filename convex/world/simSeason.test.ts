import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";
import { internal } from "../_generated/api";
import schema from "../schema";
import { modules } from "../test.setup";
import { OE_2026_GAMES, OE_2026_ROWS } from "../../tests/support/oe2026";
import { oeGames, type OeRow } from "../feeds/oraclesElixir";
import { LCK_2026_SIM, SIM_PLAN, simRows, simSeasonFile, stageOf } from "./simSeason";

const SIM_ROWS = simRows(SIM_PLAN, OE_2026_ROWS);
const SIM_GAMES = oeGames(SIM_ROWS, SIM_PLAN.league);
const DEADLINE_BEFORE_MS = 15 * 60_000;
const weeksOf = (stage: string) => LCK_2026_SIM.gameweeks.filter((gw) => gw.stage === stage).map((gw) => gw.number);

describe("simSeasonFile", () => {
  test("data/lck/2026/season-2026.json is what the plan and the rows make", async () => {
    await expect(`${JSON.stringify(simSeasonFile(SIM_PLAN, OE_2026_GAMES), null, 2)}\n`).toMatchFileSnapshot("../../data/lck/2026/season-2026.json");
  });

  test("2026 laid out as 2027: Split 1 with Road to MSI, Split 2 with Legend and Rise and the playoffs, one LCK week a gameweek", () => {
    expect(LCK_2026_SIM.splits.map((s) => s.name)).toEqual(["Split 1", "Split 2"]);
    expect(weeksOf("Rounds 1-2")).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(weeksOf("Road to MSI")).toEqual([10, 11]);
    expect(weeksOf("Legend and Rise")).toEqual([12, 13, 14, 15]);
    expect(weeksOf("Playoffs")).toEqual([16, 17, 18]);
    expect(LCK_2026_SIM.gameweeks.filter((gw) => gw.split === 1).map((gw) => gw.number)).toEqual([...weeksOf("Rounds 1-2"), ...weeksOf("Road to MSI")]);
  });

  test("the Cup is left out: the sim starts at Rounds 1-2, on 1 Apr 2026", () => {
    expect(SIM_ROWS.some((row) => row.split === "Cup")).toBe(false);
    expect(OE_2026_ROWS.filter((row) => row.split !== "Cup").every((row) => stageOf(SIM_PLAN, row) !== undefined)).toBe(true);
    expect(new Date(Math.min(...SIM_GAMES.map((g) => g.startedAt))).toISOString().slice(0, 10)).toBe("2026-04-01");
  });

  test("each deadline falls 15 minutes before its week's first game", () => {
    for (const gw of LCK_2026_SIM.gameweeks) {
      const deadline = Date.parse(gw.deadline);
      const firstAfter = Math.min(...SIM_GAMES.map((g) => g.startedAt).filter((at) => at > deadline));
      expect(firstAfter - deadline, `gameweek ${gw.number}`).toBe(DEADLINE_BEFORE_MS);
    }
  });

  test("knockouts loosen: 3 per team, unlimited transfers, ₩110m; every other stage 2 per team, ₩100m", () => {
    const settings = (unlimited: boolean) => LCK_2026_SIM.stages!.filter((s) => s.unlimitedTransfers === unlimited).map((s) => [s.name, s.teamCap, s.budget]);
    expect(settings(true)).toEqual([["Road to MSI", 3, 110_000_000], ["Playoffs", 3, 110_000_000]]);
    expect(settings(false)).toEqual([["Rounds 1-2", 2, 100_000_000], ["Legend and Rise", 2, 100_000_000]]);
  });
});

describe("loadSimSeason", () => {
  test("the loaded season matches 2026's series count and results", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(internal.world.simSeason.loadSimSeason, {});
    // A pair's unplaced game is named again each time a later day's load regroups that pair.
    const unplaced = new Set<string>();
    const days = new Map<string, OeRow[]>();
    for (const row of SIM_ROWS) {
      const day = row.date!.slice(0, 10);
      days.set(day, [...(days.get(day) ?? []), row]);
    }
    for (const rows of days.values()) {
      for (const gameId of (await t.mutation(internal.feeds.load.loadOracleElixir, { rows, league: SIM_PLAN.league })).unplaced) unplaced.add(gameId);
    }
    const stored = await t.run(async (ctx) => {
      const teams = new Map((await ctx.db.query("teams").collect()).map((team) => [team._id as string, team.oeId]));
      return Promise.all(
        (await ctx.db.query("series").collect()).map(async (s) => ({
          games: (await ctx.db.query("games").withIndex("by_series", (q) => q.eq("series", s._id)).collect()).map((g) => g.oeId),
          score: s.teams.map((team, i) => [teams.get(team)!, s.score[i]!] as const),
        })),
      );
    });
    // A series for each game 1 in the file; the one game out of sequence (DK v Gen.G's game 2, 1 Aug)
    // waits unplaced for an admin.
    expect(stored.length).toBe(SIM_GAMES.filter((g) => g.gameNumber === 1).length);
    expect(unplaced.size).toBe(1);
    expect(stored.flatMap((s) => s.games).length + unplaced.size).toBe(SIM_GAMES.length);
    for (const { games, score } of stored) {
      const wins = (teamId: string) => SIM_GAMES.filter((g) => games.includes(g.gameId) && g.teams.find((t) => t.teamId === teamId)!.won).length;
      expect(score, games[0]).toEqual(score.map(([teamId]) => [teamId, wins(teamId)]));
    }
  }, 120_000);
});
