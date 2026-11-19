// The sim's replay (spec/15, The replay; #399): a game with no saved timeline stepped through its
// settled stats as live feed windows, so it plays through the same live reader as a real game and
// its live points end equal to its settled ones on every line the feed carries (spec/11, Live).
// Saved timelines come in their own PR (Craig, 19 Nov 2026); until then every game steps.
import { v } from "convex/values";
import { internalQuery, type MutationCtx } from "../_generated/server";
import { findSeason } from "../world/season";
import { liveRow, startWatching } from "./live";
import { ELDER, FEED_ROLES, FINISHED, FRAME_GAP_MS, type FeedFrame, type FeedTeam, type LiveWindow } from "./liveFeed";
import { gameByOeId, storedOeGame } from "./load";
import type { OeGame, OePlayerGame, OeTeamGame } from "./oraclesElixir";

/** LoL's own: every player starts a game with 500 gold, so the first frame has gold and starts the clock. */
const STARTING_GOLD = 500;
/** A frame this far after the last is untimed and ends any run of kills (liveFeed.ts's multikill
 *  timers): wider than both the frame gap and the 10-second multikill gap. */
const APART_MS = 20_000;
/** A frame this close to the last is timed, and its kill joins a multikill. */
const BURST_MS = 1_000;
/** The frames after the early ones, up to the game's end: kills and objectives rise step by step. */
const STEPS = 10;
const IN_GAME = "in_game";
/** The feed names drakes by element; a replay knows only how many, so each is one name. */
const DRAKE = "drake";
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60_000;

const FEED_ROLE_OF = Object.fromEntries(Object.entries(FEED_ROLES).map(([feed, role]) => [role, feed]));

/** On the sim, one read of a replayed game, as the live feed would answer it: the stored game's
 *  next window after the reading so far. Its feed id is Oracle's Elixir's game id. A game plays out
 *  over the season's `replaySeconds`, read every `pollSeconds`. */
export const replayRead = internalQuery({
  args: { esportsGameId: v.string() },
  handler: async (ctx, { esportsGameId }): Promise<LiveWindow> => {
    const game = await gameByOeId(ctx, esportsGameId);
    const row = await liveRow(ctx, esportsGameId);
    const season = row === null ? null : await ctx.db.get(row.season);
    if (game === null || row === null || season === null) throw new Error(`No stored game ${esportsGameId} to replay.`);
    const { live } = season.settings;
    if (live.replaySeconds === undefined) throw new Error(`The ${season.year} season has no replaySeconds: only the sim's replays.`);
    const reads = Math.max(1, Math.round(live.replaySeconds / live.pollSeconds));
    const { oe } = await storedOeGame(ctx, game);
    return nextReplayWindow(replayWindow(oe, live.goldLeadAtMinutes), row.reading?.lastFrameAt ?? 0, reads);
  },
});

/** Next day's replays: every game that started from just after `from` up to `to`, one after
 *  another, each `replaySeconds` after the last (spec/15, The clock). A game's season is its
 *  competition's for the year it was played. Returns how many it started. */
export async function replayDay(ctx: MutationCtx, competition: string, from: number, to: number): Promise<number> {
  const games = await ctx.db
    .query("games")
    .withIndex("by_startedAt", (q) => q.gt("startedAt", from).lte("startedAt", to))
    .collect();
  for (const [i, game] of games.entries()) {
    const year = new Date(game.startedAt).getUTCFullYear();
    const found = await findSeason(ctx, competition, year);
    const replaySeconds = found?.season.settings.live.replaySeconds;
    if (found === null || replaySeconds === undefined) throw new Error(`No ${competition} ${year} season with replays is stored for game ${game.oeId}.`);
    await startWatching(ctx, found.season._id, game.oeId, i * replaySeconds * MS_PER_SECOND);
  }
  return games.length;
}

interface Running {
  kills: number;
  deaths: number;
  assists: number;
  totalGold: number;
}
interface RunningTeam {
  towers: number;
  barons: number;
  drakes: number;
  elders: number;
}

/** A settled game as the live feed would have sent it, every frame in one window: first blood
 *  first, then first tower, then each multikill as a burst of kills a second apart, gold at the
 *  gold lead's mark, and the rest in even steps to the final stats at the game's length. The feed's
 *  game id is Oracle's Elixir's, as is each player's and team's. */
export function replayWindow(game: OeGame, goldAtMinutes: number): LiveWindow {
  const [blue, red] = sides(game);
  const startedAt = game.startedAt;
  const endAt = startedAt + game.lengthSeconds * MS_PER_SECOND;
  const markAt = startedAt + goldAtMinutes * MS_PER_MINUTE;
  const players = new Map(game.players.map((p) => [p.participantId, { kills: 0, deaths: 0, assists: 0, totalGold: STARTING_GOLD } as Running]));
  const teams = new Map<OeTeamGame, RunningTeam>([blue, red].map((t) => [t, { towers: 0, barons: 0, drakes: 0, elders: 0 }]));
  const frames: FeedFrame[] = [];
  let at = startedAt;
  const push = (state: string = IN_GAME) => frames.push(frame(game, players, teams, at, state));
  const kill = (player: OePlayerGame) => {
    at += BURST_MS;
    players.get(player.participantId)!.kills++;
    push();
  };

  push();
  const firstBlood = game.players.find((p) => p.firstBloodKill);
  if (firstBlood === undefined && game.players.some((p) => p.kills > 0)) throw new Error(`Game ${game.gameId} has kills but no first blood.`);
  const bursts = game.players.filter((p) => p.biggestMultikill >= 2 && p !== firstBlood);
  if (firstBlood !== undefined) {
    // The first kill is one player's alone, so the reader credits first blood; his multikill, if
    // any, runs on from it.
    at += APART_MS;
    push();
    for (let i = 0; i < Math.max(1, firstBlood.biggestMultikill); i++) kill(firstBlood);
  }
  const firstTower = [blue, red].find((t) => t.firstTower);
  if (firstTower === undefined && num(blue.raw, "towers") + num(red.raw, "towers") > 0) {
    throw new Error(`Game ${game.gameId} has towers but no first tower.`);
  }
  if (firstTower !== undefined) {
    at += APART_MS;
    teams.get(firstTower)!.towers = 1;
    push();
  }
  for (const player of bursts) {
    at += APART_MS;
    push();
    for (let i = 0; i < player.biggestMultikill; i++) kill(player);
  }
  const reachesMark = endAt >= markAt;
  if (at >= Math.min(markAt, endAt)) throw new Error(`Game ${game.gameId}'s early kills don't fit before ${goldAtMinutes}:00.`);
  if (reachesMark) {
    at = markAt;
    for (const p of game.players) players.get(p.participantId)!.totalGold = goldAtMark(game, p);
    push();
  }
  // The rest in even steps, each untimed, so no step's kills make a multikill.
  const steps = Math.min(STEPS, Math.floor((endAt - at) / APART_MS));
  if (steps < 1 || (endAt - at) / steps <= FRAME_GAP_MS) throw new Error(`Game ${game.gameId} ends too soon after its last early frame.`);
  const from = at;
  const playersFrom = new Map([...players].map(([id, p]) => [id, { ...p }]));
  const teamsFrom = new Map([...teams].map(([t, s]) => [t, { ...s }]));
  for (let step = 1; step <= steps; step++) {
    const share = step / steps;
    at = from + Math.round((endAt - from) * share);
    for (const p of game.players) {
      const was = playersFrom.get(p.participantId)!;
      const to = { kills: p.kills, deaths: p.deaths, assists: p.assists, totalGold: num(p.raw, "totalgold") };
      players.set(p.participantId, lerp(was, to, share));
    }
    for (const t of [blue, red]) teams.set(t, lerp(teamsFrom.get(t)!, { towers: num(t.raw, "towers"), barons: t.barons, drakes: t.drakes, elders: t.elders }, share));
    push(step === steps ? FINISHED : IN_GAME);
  }
  return {
    esportsGameId: game.gameId,
    gameMetadata: { blueTeamMetadata: metadata(game, blue), redTeamMetadata: metadata(game, red) },
    frames,
  };
}

/** The frames a replay sends on one read: from just after `after` (the reading's last frame, 0
 *  before the first) up to the next of `reads` even marks across the game that has a frame by it,
 *  so a game plays out over at most that many reads. Empty once the game is over. */
export function nextReplayWindow(window: LiveWindow, after: number, reads: number): LiveWindow {
  const times = window.frames.map((f) => Date.parse(f.rfc460Timestamp));
  const next = times.find((at) => at > after);
  if (next === undefined) return { ...window, frames: [] };
  const first = times[0]!;
  const span = times.at(-1)! - first;
  const upTo = first + Math.ceil(((next - first) * reads) / span) * (span / reads);
  return { ...window, frames: window.frames.filter((_, i) => times[i]! > after && times[i]! <= upTo) };
}

function sides(game: OeGame): [OeTeamGame, OeTeamGame] {
  const blue = game.teams.find((t) => t.side === "blue");
  const red = game.teams.find((t) => t.side === "red");
  if (blue === undefined || red === undefined) throw new Error(`Game ${game.gameId} hasn't a blue and a red side.`);
  return [blue, red];
}

/** A player's total gold at the mark, so his lead over his lane opponent is the file's. */
function goldAtMark(game: OeGame, player: OePlayerGame): number {
  if (player.goldDiffAt15 === null) throw new Error(`Game ${game.gameId} reached the gold mark but ${player.playerName} has no gold lead.`);
  return num(player.raw, "goldat15");
}

/** Each count `share` of the way from `from` to `to`, never below where it was. */
function lerp<T extends Record<string, number>>(from: T, to: T, share: number): T {
  return Object.fromEntries(Object.entries(from).map(([key, was]) => [key, Math.max(was, Math.round(was + (to[key]! - was) * share))])) as T;
}

function frame(game: OeGame, players: Map<number, Running>, teams: Map<OeTeamGame, RunningTeam>, at: number, gameState: string): FeedFrame {
  const team = (side: OeTeamGame): FeedTeam => {
    const running = teams.get(side)!;
    const participants = game.players
      .filter((p) => p.teamId === side.teamId)
      .map((p) => ({ participantId: p.participantId, ...players.get(p.participantId)! }));
    return {
      totalGold: participants.reduce((total, p) => total + p.totalGold, 0),
      towers: running.towers,
      barons: running.barons,
      dragons: [...Array<string>(running.drakes).fill(DRAKE), ...Array<string>(running.elders).fill(ELDER)],
      participants,
    };
  };
  const [blue, red] = sides(game);
  return { rfc460Timestamp: new Date(at).toISOString(), gameState, blueTeam: team(blue), redTeam: team(red) };
}

function metadata(game: OeGame, side: OeTeamGame) {
  return {
    esportsTeamId: side.teamId,
    participantMetadata: game.players
      .filter((p) => p.teamId === side.teamId)
      .map((p) => ({ participantId: p.participantId, esportsPlayerId: p.playerId, summonerName: p.playerName, championId: p.champion, role: FEED_ROLE_OF[p.role]! })),
  };
}

function num(row: Record<string, string>, column: string): number {
  const value = Number(row[column]);
  if (row[column] === undefined || row[column] === "" || !Number.isFinite(value)) throw new Error(`No ${column} in game ${row.gameid ?? "?"}.`);
  return value;
}
