// Finding a team's series in the made-up weeks, and reading one from a team's side.
import type { Score } from "../parts";
import type { Series, TeamCode } from "./week3";

/** A series by its id; a missing one is a broken fixture. */
export function seriesById(list: readonly Series[], id: string): Series {
  const series = list.find((s) => s.id === id);
  if (!series) throw new Error(`Series ${id} is not in the list`);
  return series;
}

/** A team's series. */
export const seriesOf = (list: readonly Series[], team: string) => list.filter((s) => s.home === team || s.away === team);

/** The team a team plays in a series. */
export const opponent = (s: Series, team: string) => (s.home === team ? s.away : s.home);

/** The teams a player meets, in order: `v KT · v GEN`. */
export const againstLine = (opponents: readonly string[]) => opponents.map((o) => `v ${o}`).join(" · ");

/** A series from one team's side: the opponent, and the score with the team's games first. */
export function fromSide(s: Series, team: string): { opponent: TeamCode; score?: Score } {
  const home = s.home === team;
  return { opponent: home ? s.away : s.home, score: s.score && (home ? s.score : [s.score[1], s.score[0]]) };
}
