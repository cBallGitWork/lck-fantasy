// Series from games, and when a series turns final (spec/11, Final). Oracle's Elixir has no series
// id, so a series is a pair of teams' games from game 1 on.

export interface SeriesGame {
  gameId: string;
  startedAt: number;
  gameNumber: number;
  lengthSeconds: number;
  teamIds: readonly [string, string];
  winnerId: string;
}

export interface Series<G extends SeriesGame> {
  teamIds: [string, string];
  games: G[];
  /** Games won by each team, in `teamIds` order. */
  score: [number, number];
  /** When the last game ended, in ms since the epoch. */
  endedAt: number;
}

const MS_PER_SECOND = 1000;

/** Games grouped into series, in start order: game 1 opens a series for its two teams, and each
 *  later game joins the pair's open series. Throws on a game out of sequence. */
export function groupSeries<G extends SeriesGame>(games: readonly G[]): Series<G>[] {
  const pairKey = (game: SeriesGame) => [...game.teamIds].sort().join(" v ");
  const open = new Map<string, G[]>();
  const all: G[][] = [];
  for (const game of [...games].sort((a, b) => a.startedAt - b.startedAt)) {
    const key = pairKey(game);
    const current = open.get(key);
    if (game.gameNumber === 1) {
      const fresh = [game];
      open.set(key, fresh);
      all.push(fresh);
    } else if (current !== undefined && current.at(-1)!.gameNumber === game.gameNumber - 1) {
      current.push(game);
    } else {
      throw new Error(`Game ${game.gameId} is game ${game.gameNumber} with no game before it in its series.`);
    }
  }
  return all.map((seriesGames) => {
    const teamIds: [string, string] = [...seriesGames[0]!.teamIds];
    const wins = (teamId: string) => seriesGames.filter((game) => game.winnerId === teamId).length;
    const last = seriesGames.at(-1)!;
    return { teamIds, games: seriesGames, score: [wins(teamIds[0]), wins(teamIds[1])], endedAt: last.startedAt + last.lengthSeconds * MS_PER_SECOND };
  });
}

export type SeriesState = "provisional" | "final";

/** A series turns final `finalAfterMs` after it ends (3 hours, data), once its settled stats are in;
 *  until then it stays provisional (spec/11, Final). */
export function seriesState(endedAt: number, settledStatsIn: boolean, now: number, finalAfterMs: number): SeriesState {
  return settledStatsIn && now >= endedAt + finalAfterMs ? "final" : "provisional";
}
