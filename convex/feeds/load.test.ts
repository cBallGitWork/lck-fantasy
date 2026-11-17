import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";
import { internal } from "../_generated/api";
import schema from "../schema";
import { modules } from "../test.setup";
import { groupSeries, seriesState } from "../lck/series";
import { OE_2025_BRION_DRX } from "../scoring/fixtures";
import { HOUR_MS, SPEC_FINAL_AFTER_MS } from "../lck/fixtures";
import { BRION, DRX, gameOnePlayer, OE_FIXTURE_GAMES, OE_FIXTURE_LEAGUE, OE_FIXTURE_ROWS, OE_GAME_1, OE_SERIES_GAMES } from "./fixtures/oe";
import { v5Game } from "./fixtures/v5-shape";
import { leaguepediaGameKey } from "./leaguepedia";

const GAME_IDS = OE_FIXTURE_GAMES.map((g) => g.gameId);

async function loaded() {
  const t = convexTest(schema, modules);
  await t.mutation(internal.feeds.load.loadOracleElixir, { rows: OE_FIXTURE_ROWS, league: OE_FIXTURE_LEAGUE });
  return t;
}

const loadPage = (t: Awaited<ReturnType<typeof loaded>>, gameId: string, payload: unknown = v5Game()) =>
  t.mutation(internal.feeds.load.loadLeaguepedia, { gameId, key: leaguepediaGameKey(gameId), payload });

/** Everything stored, with each row's ids swapped for the feed's, to compare across loads. */
function snapshot(t: Awaited<ReturnType<typeof loaded>>) {
  return t.run(async (ctx) => {
    const all = async <T extends "teams" | "players" | "series" | "games" | "gameLineups" | "gameStats">(table: T) =>
      ctx.db.query(table).collect();
    const teams = await all("teams");
    const players = await all("players");
    const games = await all("games");
    const teamOe = (id: string) => teams.find((x) => x._id === id)!.oeId;
    const playerOe = (id: string) => players.find((x) => x._id === id)!.oeId;
    const gameOe = (id: string) => games.find((x) => x._id === id)!.oeId;
    const series = await all("series");
    return {
      teams: teams.map((x) => [x.oeId, x.name]),
      players: players.map((x) => [x.oeId, x.handle]),
      series: series.map((s) => ({ ...s, _id: 0, _creationTime: 0, firstGame: gameOe(s.firstGame), teams: s.teams.map(teamOe) })),
      games: games.map((g) => ({
        oeId: g.oeId, gameNumber: g.gameNumber, winner: teamOe(g.winner), blue: { ...g.blue, team: teamOe(g.blue.team) },
        red: { ...g.red, team: teamOe(g.red.team) }, matchDataKey: g.matchDataKey, inSeries: g.series !== undefined,
      })),
      lineups: (await all("gameLineups")).map((l) => ({ game: gameOe(l.game), player: playerOe(l.player), team: teamOe(l.team), role: l.role, champion: l.champion })),
      stats: (await all("gameStats")).map((s) => ({ ...s, _id: 0, _creationTime: 0, game: gameOe(s.game), player: playerOe(s.player) })),
    };
  });
}

const statsOf = (snap: Awaited<ReturnType<typeof snapshot>>, gameId: string, playerName: string) =>
  snap.stats.find((s) => s.game === gameId && s.player === gameOnePlayer(playerName).playerId)!;

describe("loadOracleElixir", () => {
  test("a series appears with its two teams, its games, and who played each in which role on which champion", async () => {
    const snap = await snapshot(await loaded());
    const [expected] = groupSeries(OE_SERIES_GAMES).series;
    expect(snap.series).toHaveLength(1);
    expect(snap.series[0]).toMatchObject({ firstGame: GAME_IDS[0], teams: [BRION, DRX], score: expected!.score, endedAt: expected!.endedAt });
    expect(snap.games.map((g) => [g.oeId, g.gameNumber, g.inSeries])).toEqual(GAME_IDS.map((id, i) => [id, i + 1, true]));
    expect(snap.teams.map(([id]) => id).sort()).toEqual([BRION, DRX].sort());
    expect(snap.lineups.filter((l) => l.game === GAME_IDS[0])).toHaveLength(10);
    const clozer = gameOnePlayer("Clozer");
    expect(snap.lineups).toContainEqual({ game: GAME_IDS[0], player: clozer.playerId, team: BRION, role: "mid", champion: clozer.champion });
  });

  test("every stat the scoring reads is held for each player in each game, with the source's row", async () => {
    const snap = await snapshot(await loaded());
    expect(snap.stats).toHaveLength(30);
    const clozer = OE_2025_BRION_DRX.clozer;
    expect(statsOf(snap, GAME_IDS[0]!, "Clozer")).toMatchObject({
      kills: clozer.kills, deaths: clozer.deaths, assists: clozer.assists, goldDiffAt15: clozer.goldDiffAt15,
      firstBloodKill: clozer.firstBlood, biggestMultikill: clozer.biggestMultikill, raw: gameOnePlayer("Clozer").raw,
    });
    expect(statsOf(snap, GAME_IDS[0]!, "Clozer").soloKills).toBeUndefined();
  });

  test("the coach's lines are held for both sides of each game", async () => {
    const snap = await snapshot(await loaded());
    const game1 = snap.games.find((g) => g.oeId === GAME_IDS[0])!;
    const { won, firstTower, drakes, barons, elders } = OE_2025_BRION_DRX.brion;
    expect(game1.blue).toEqual({ team: BRION, won, firstTower, drakes, barons, elders, raw: OE_GAME_1.teams[0].raw });
    expect(game1.red).toMatchObject({ team: DRX, won: false, drakes: 0, barons: 0, elders: 0 });
    expect(game1.winner).toBe(BRION);
  });

  test("a game out of sequence is left unplaced, and the rest still load", async () => {
    const t = convexTest(schema, modules);
    const rows = OE_FIXTURE_ROWS.filter((row) => row.gameid !== GAME_IDS[0]);
    expect(await t.mutation(internal.feeds.load.loadOracleElixir, { rows, league: OE_FIXTURE_LEAGUE })).toEqual({
      games: 2, unplaced: GAME_IDS.slice(1),
    });
    const snap = await snapshot(t);
    expect(snap.series).toEqual([]);
    expect(snap.games.every((g) => !g.inSeries)).toBe(true);
  });
});

describe("loadLeaguepedia", () => {
  test("solo kills and steals join each player's stats by participant id", async () => {
    const t = await loaded();
    await loadPage(t, GAME_IDS[0]!, v5Game({ 3: { soloKills: 2 }, 7: { objectivesStolen: 1 } }));
    const snap = await snapshot(t);
    expect(statsOf(snap, GAME_IDS[0]!, "Clozer")).toMatchObject({ soloKills: 2, steals: 0 });
    expect(statsOf(snap, GAME_IDS[0]!, "Sponge")).toMatchObject({ soloKills: 0, steals: 1 });
    expect(snap.games[0]!.matchDataKey).toBe(leaguepediaGameKey(GAME_IDS[0]!));
  });

  test("the series turns final 3 hours after it ends, once every game's page is in", async () => {
    const t = await loaded();
    for (const id of GAME_IDS.slice(0, 2)) await loadPage(t, id);
    const before = (await snapshot(t)).series[0]!;
    expect(before).toMatchObject({ settledStatsIn: false, waiting: [`${GAME_IDS[2]}: no Leaguepedia page "${leaguepediaGameKey(GAME_IDS[2]!)}"`] });
    expect(seriesState(before.endedAt, before.settledStatsIn, before.endedAt + 10 * HOUR_MS, SPEC_FINAL_AFTER_MS)).toBe("provisional");
    await loadPage(t, GAME_IDS[2]!);
    const after = (await snapshot(t)).series[0]!;
    expect(after).toMatchObject({ settledStatsIn: true, waiting: [] });
    expect(seriesState(after.endedAt, after.settledStatsIn, after.endedAt + SPEC_FINAL_AFTER_MS - 1, SPEC_FINAL_AFTER_MS)).toBe("provisional");
    expect(seriesState(after.endedAt, after.settledStatsIn, after.endedAt + SPEC_FINAL_AFTER_MS, SPEC_FINAL_AFTER_MS)).toBe("final");
  });

  test("a game not loaded yet, or a page with a field missing, throws", async () => {
    const t = await loaded();
    await expect(loadPage(t, "LOLTMNT03_000000")).rejects.toThrow("No game LOLTMNT03_000000: load Oracle's Elixir's rows first.");
    await expect(loadPage(t, GAME_IDS[0]!, { info: {} })).rejects.toThrow("Match data has no info.participants.");
  });
});

describe("re-running a load", () => {
  test("loading the same rows again changes nothing, and keeps Leaguepedia's join", async () => {
    const t = await loaded();
    await loadPage(t, GAME_IDS[0]!, v5Game({ 3: { soloKills: 2 } }));
    const first = await snapshot(t);
    await t.mutation(internal.feeds.load.loadOracleElixir, { rows: OE_FIXTURE_ROWS, league: OE_FIXTURE_LEAGUE });
    expect(await snapshot(t)).toEqual(first);
  });

  test("a corrected row replaces what the game held", async () => {
    const t = await loaded();
    const clozer = gameOnePlayer("Clozer");
    const rows = OE_FIXTURE_ROWS.map((row) => (row === clozer.raw ? { ...row, kills: "5" } : row));
    await t.mutation(internal.feeds.load.loadOracleElixir, { rows, league: OE_FIXTURE_LEAGUE });
    const snap = await snapshot(t);
    expect(statsOf(snap, GAME_IDS[0]!, "Clozer")).toMatchObject({ kills: 5, raw: { kills: "5" } });
    expect(snap.stats).toHaveLength(30);
    expect(snap.series).toHaveLength(1);
  });
});
