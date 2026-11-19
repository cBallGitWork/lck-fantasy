// A week in the address, as Points and Perfect game hold it (`/points/2`, `/perfect-game/3`).

import type { Go } from "../../paths";

/** The competition's first week: no ‹ before it. */
const FIRST_WEEK = 1;

/** A week's ‹ and ›, by the router: `to` gives a week's path; none before Week 1 or past the latest. */
export function weekSteps(week: number, latest: number, to: (week: number) => Go): { prev?: Go; next?: Go } {
  return {
    prev: week > FIRST_WEEK ? to(week - 1) : undefined,
    next: week < latest ? to(week + 1) : undefined,
  };
}

/** The week a path names: none the latest, `2` Week 2; undefined for a week `weeks` doesn't hold. */
export function weekInPath(param: string | undefined, weeks: ReadonlyMap<number, unknown>, latest: number): number | undefined {
  if (param === undefined) return latest;
  const week = /^\d+$/.test(param) ? Number(param) : NaN;
  return weeks.has(week) ? week : undefined;
}
