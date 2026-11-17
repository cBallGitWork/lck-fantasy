// One game's settled stats in the shape the scoring reads (spec/05): Oracle's Elixir's row joined
// to Leaguepedia's solo kills and steals by participant id.
import type { OeGame, OePlayerGame } from "../feeds/oraclesElixir";
import { leaguepediaGameKey, v5Extras, type V5Extras } from "../feeds/leaguepedia";
import type { PlayerGameStats, TeamGameStats } from "../scoring/game";

export function playerGameStats(player: OePlayerGame, extras: ReadonlyMap<number, V5Extras>): PlayerGameStats {
  const joined = extras.get(player.participantId);
  if (joined === undefined) throw new Error(`No match data for participant ${player.participantId} (${player.playerName}).`);
  return {
    role: player.role,
    kills: player.kills,
    deaths: player.deaths,
    assists: player.assists,
    goldDiffAt15: player.goldDiffAt15,
    soloKills: joined.soloKills,
    firstBlood: player.firstBloodKill,
    biggestMultikill: player.biggestMultikill,
    steals: joined.steals,
  };
}

/** A team's lines for its coach (spec/05, The coach), with the opponent's objectives for "most". */
export function teamGameStats(game: OeGame, teamId: string): TeamGameStats {
  const ours = game.teams.find((team) => team.teamId === teamId);
  const theirs = game.teams.find((team) => team.teamId !== teamId);
  if (ours === undefined || theirs === undefined) throw new Error(`Team ${teamId} didn't play game ${game.gameId}.`);
  return {
    won: ours.won,
    lengthSeconds: game.lengthSeconds,
    firstTower: ours.firstTower,
    drakes: ours.drakes,
    barons: ours.barons,
    elders: ours.elders,
    opponent: { drakes: theirs.drakes, barons: theirs.barons, elders: theirs.elders },
  };
}

export interface SettledGame {
  gameId: string;
  players: { playerId: string; stats: PlayerGameStats }[];
  teams: { teamId: string; stats: TeamGameStats }[];
}

/** A series' settled stats: every game's, once each is complete in Oracle's Elixir and has its
 *  Leaguepedia page. Else the games still waiting and why, so the series stays provisional and an
 *  admin can see which key to paste in (spec/11, Final). */
export type SeriesSettledStats = { settled: true; games: SettledGame[] } | { settled: false; waiting: string[] };

/** `matchData` is Leaguepedia's pages by key; `pastedKeys` an admin's keys by Oracle's Elixir game id. */
export function seriesSettledStats(
  games: readonly OeGame[],
  matchData: ReadonlyMap<string, unknown>,
  pastedKeys: ReadonlyMap<string, string> = new Map(),
): SeriesSettledStats {
  const waiting: string[] = [];
  const settled: SettledGame[] = [];
  for (const game of games) {
    const key = leaguepediaGameKey(game.gameId, pastedKeys.get(game.gameId));
    const page = matchData.get(key);
    if (!game.complete) {
      waiting.push(`${game.gameId}: Oracle's Elixir marks it partial`);
    } else if (page === undefined) {
      waiting.push(`${game.gameId}: no Leaguepedia page "${key}"`);
    } else {
      const extras = v5Extras(page);
      settled.push({
        gameId: game.gameId,
        players: game.players.map((player) => ({ playerId: player.playerId, stats: playerGameStats(player, extras) })),
        teams: game.teams.map(({ teamId }) => ({ teamId, stats: teamGameStats(game, teamId) })),
      });
    }
  }
  return waiting.length > 0 ? { settled: false, waiting } : { settled: true, games: settled };
}
