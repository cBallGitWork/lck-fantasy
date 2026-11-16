import type { Dispatch } from "react";
import { placeOf } from "../../parts";
import { opponent, seriesOf } from "../../fixtures/series";
import type { Series } from "../../fixtures/week3";
import type { PickTeamData, Ranked } from "./fixtures";
import type { PickAction, PickState } from "./model";

/** What each of the page's pieces is drawn from. */
export interface ViewProps {
  data: PickTeamData;
  state: PickState;
  dispatch: Dispatch<PickAction>;
}

/** `1st of 10 mids`, or `1st`. */
export const ranked = (r: Ranked) => placeOf(r.place, r.of);

/** The week's opponents on one line, as FPL's fixtures: `v KT, GEN`. */
export const fixtureLine = (series: readonly Series[], team: string) => `v ${seriesOf(series, team).map((s) => opponent(s, team)).join(", ")}`;

/** C, V or nothing, from the draft. */
export const markOf = (state: PickState, id: string) => (state.draft.carry === id ? "C" : state.draft.viceCarry === id ? "V" : undefined);
