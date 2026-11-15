import type { Dispatch } from "react";
import { formatEok, WON_PER_EOK } from "../../parts";
import type { Series } from "../../fixtures/week3";
import type { PickTeamData, Ranked } from "./fixtures";
import type { PickAction, PickState } from "./model";

/** What each of the page's pieces is drawn from. */
export interface ViewProps {
  data: PickTeamData;
  state: PickState;
  dispatch: Dispatch<PickAction>;
}

/** A price in 억: `18.5억`. */
export const eok = (n: number) => formatEok(n * WON_PER_EOK);

const SUFFIX = ["th", "st", "nd", "rd"];

/** `1st`, `2nd`, `11th`. */
export function ordinal(n: number): string {
  const teen = Math.floor(n / 10) % 10 === 1;
  return `${n}${(!teen && SUFFIX[n % 10]) || "th"}`;
}

/** `1st of 10 mids`, or `1st`. */
export const ranked = (r: Ranked) => `${ordinal(r.place)}${r.of ? ` of ${r.of}` : ""}`;

/** A team's series this week. */
export const seriesOf = (series: readonly Series[], team: string) => series.filter((s) => s.home === team || s.away === team);

export const opponent = (s: Series, team: string) => (s.home === team ? s.away : s.home);

/** The week's fixtures on one line: `v KT · v GEN`. */
export const fixtureLine = (series: readonly Series[], team: string) =>
  seriesOf(series, team)
    .map((s) => `v ${opponent(s, team)}`)
    .join(" · ");

/** C, V or nothing, from the draft. */
export const markOf = (state: PickState, id: string) => (state.draft.carry === id ? "C" : state.draft.vice === id ? "V" : undefined);
