// One game's settled stats in the shape the scoring reads (spec/05): Oracle's Elixir's row joined
// to Leaguepedia's solo kills and steals by participant id.
import type { OeGame, OePlayerGame } from "../feeds/oraclesElixir";
import type { V5Extras } from "../feeds/leaguepedia";
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
