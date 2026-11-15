// Storing what the feeds send (ARCHITECTURE.md, Data): Oracle's Elixir's rows into teams, players,
// games, lineups and stats, grouped into series, and Leaguepedia's match data joined to them. Each
// load can be run again: it replaces what the same game held, so an admin can re-run a day.
import { v } from "convex/values";
import type { Doc, Id } from "../_generated/dataModel";
import { internalMutation, type MutationCtx } from "../_generated/server";
import { groupSeries, pairKey } from "../lck/series";
import { playerGameStats, seriesSettledStats } from "../stats/gameStats";
import { v5Extras } from "./leaguepedia";
import { oeGame, oeGames, oeSeriesGame, type OeGame, type OeTeamGame } from "./oraclesElixir";

/** Oracle's Elixir's rows for one league (the file's `league`, such as "LCK"). Returns the games
 *  stored and those out of sequence, which wait unplaced for an admin. */
export const loadOracleElixir = internalMutation({
  args: { rows: v.array(v.record(v.string(), v.string())), league: v.string() },
  handler: async (ctx, { rows, league }) => {
    const pairs = new Set<string>();
    const games = oeGames(rows, league);
    for (const game of games) pairs.add(await storeGame(ctx, game));
    const unplaced: string[] = [];
    for (const pair of pairs) unplaced.push(...(await regroupPair(ctx, pair)));
    return { games: games.length, unplaced };
  },
});

/** One game's Leaguepedia match data, from the page `key`: solo kills and steals join its stats. */
export const loadLeaguepedia = internalMutation({
  args: { gameId: v.string(), key: v.string(), payload: v.any() },
  handler: async (ctx, { gameId, key, payload }) => {
    const game = await gameByOeId(ctx, gameId);
    if (game === null) throw new Error(`No game ${gameId}: load Oracle's Elixir's rows first.`);
    await joinMatchData(ctx, game, payload);
    await ctx.db.patch(game._id, { matchData: payload, matchDataKey: key });
    if (game.series !== undefined) await settleSeries(ctx, game.series);
  },
});

async function storeGame(ctx: MutationCtx, game: OeGame): Promise<string> {
  oeSeriesGame(game); // throws on a game with no single winner
  const blue = await teamLine(ctx, side(game, "blue"));
  const red = await teamLine(ctx, side(game, "red"));
  const fields = {
    oeId: game.gameId,
    pair: pairKey([blue.team, red.team]),
    gameNumber: game.gameNumber,
    startedAt: game.startedAt,
    patch: game.patch,
    lengthSeconds: game.lengthSeconds,
    complete: game.complete,
    winner: blue.won ? blue.team : red.team,
    blue,
    red,
  };
  const existing = await gameByOeId(ctx, game.gameId);
  const gameId = existing?._id ?? (await ctx.db.insert("games", fields));
  if (existing !== null) {
    await ctx.db.patch(existing._id, fields);
    for (const table of ["gameLineups", "gameStats"] as const) {
      const old = await ctx.db.query(table).withIndex("by_game", (q) => q.eq("game", gameId)).collect();
      for (const row of old) await ctx.db.delete(row._id);
    }
  }
  const teams = new Map([[side(game, "blue").teamId, blue.team], [side(game, "red").teamId, red.team]]);
  for (const p of game.players) {
    const player = await upsert(ctx, "players", p.playerId, { handle: p.playerName, oeId: p.playerId });
    await ctx.db.insert("gameLineups", { game: gameId, player, team: teams.get(p.teamId)!, role: p.role, champion: p.champion });
    await ctx.db.insert("gameStats", {
      game: gameId,
      player,
      participantId: p.participantId,
      kills: p.kills,
      deaths: p.deaths,
      assists: p.assists,
      goldDiffAt15: p.goldDiffAt15,
      firstBloodKill: p.firstBloodKill,
      biggestMultikill: p.biggestMultikill,
      raw: p.raw,
    });
  }
  if (existing?.matchData !== undefined) await joinMatchData(ctx, (await ctx.db.get(gameId))!, existing.matchData);
  return fields.pair;
}

function side(game: OeGame, name: OeTeamGame["side"]): OeTeamGame {
  const team = game.teams.find((t) => t.side === name);
  if (team === undefined) throw new Error(`Game ${game.gameId} has no ${name} side.`);
  return team;
}

async function teamLine(ctx: MutationCtx, team: OeTeamGame) {
  const id = await upsert(ctx, "teams", team.teamId, { name: team.teamName, oeId: team.teamId });
  const { won, firstTower, drakes, barons, elders, raw } = team;
  return { team: id, won, firstTower, drakes, barons, elders, raw };
}

/** A team or player by the feed's id, its name kept up to date. */
async function upsert<T extends "teams" | "players">(
  ctx: MutationCtx,
  table: T,
  oeId: string,
  fields: Omit<Doc<T>, "_id" | "_creationTime">,
): Promise<Id<T>> {
  const existing = await ctx.db.query(table).withIndex("by_oeId", (q) => q.eq("oeId", oeId as never)).unique();
  if (existing === null) return await ctx.db.insert(table, fields as never);
  await ctx.db.patch(existing._id, fields as never);
  return existing._id;
}

function gameByOeId(ctx: MutationCtx, oeId: string) {
  return ctx.db.query("games").withIndex("by_oeId", (q) => q.eq("oeId", oeId)).unique();
}

/** A stored game as Oracle's Elixir sent it, rebuilt from the rows kept. */
async function storedOeGame(ctx: MutationCtx, game: Doc<"games">) {
  const stats = await ctx.db.query("gameStats").withIndex("by_game", (q) => q.eq("game", game._id)).collect();
  stats.sort((a, b) => a.participantId - b.participantId);
  return { oe: oeGame(game.oeId, [...stats.map((s) => s.raw), game.blue.raw, game.red.raw]), stats };
}

/** Solo kills and steals from match data, joined to each player's stats by participant id. */
async function joinMatchData(ctx: MutationCtx, game: Doc<"games">, payload: unknown) {
  const extras = v5Extras(payload);
  const { oe, stats } = await storedOeGame(ctx, game);
  for (const row of stats) {
    const { soloKills, steals } = playerGameStats(oe.players.find((p) => p.participantId === row.participantId)!, extras);
    await ctx.db.patch(row._id, { soloKills, steals });
  }
}

/** A pair's games grouped into series again, after a load. Returns the games left unplaced. */
async function regroupPair(ctx: MutationCtx, pair: string): Promise<string[]> {
  const games = await ctx.db.query("games").withIndex("by_pair", (q) => q.eq("pair", pair)).collect();
  const before = new Set(games.flatMap((g) => (g.series === undefined ? [] : [g.series])));
  const { series, unplaced } = groupSeries(
    games.map((g) => ({ ...g, gameId: g._id, teamIds: [g.blue.team, g.red.team] as const, winnerId: g.winner })),
  );
  for (const s of series) {
    const { _id: firstGame, blue, red } = s.games[0]!;
    const fields = { firstGame, teams: [blue.team, red.team], score: s.score, endedAt: s.endedAt };
    const existing = await ctx.db.query("series").withIndex("by_firstGame", (q) => q.eq("firstGame", firstGame)).unique();
    const id = existing?._id ?? (await ctx.db.insert("series", { ...fields, settledStatsIn: false, waiting: [] }));
    if (existing !== null) await ctx.db.patch(id, fields);
    before.delete(id);
    for (const g of s.games) await ctx.db.patch(g._id, { series: id });
    await settleSeries(ctx, id);
  }
  for (const g of unplaced) await ctx.db.patch(g._id, { series: undefined });
  for (const stale of before) await ctx.db.delete(stale);
  return unplaced.map((g) => g.oeId);
}

/** Whether every game of a series has its settled stats, and if not which wait and why (spec/11, Final). */
async function settleSeries(ctx: MutationCtx, seriesId: Id<"series">) {
  const games = await ctx.db.query("games").withIndex("by_series", (q) => q.eq("series", seriesId)).collect();
  games.sort((a, b) => a.gameNumber - b.gameNumber);
  const oeGamesStored = await Promise.all(games.map(async (g) => (await storedOeGame(ctx, g)).oe));
  const withPages = games.filter((g) => g.matchDataKey !== undefined);
  const stats = seriesSettledStats(
    oeGamesStored,
    new Map(withPages.map((g) => [g.matchDataKey!, g.matchData])),
    new Map(withPages.map((g) => [g.oeId, g.matchDataKey!])),
  );
  await ctx.db.patch(seriesId, { settledStatsIn: stats.settled, waiting: stats.settled ? [] : stats.waiting });
}
