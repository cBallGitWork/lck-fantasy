import type { Dispatch } from "react";
import { opponent, seriesOf } from "../../fixtures/series";
import type { Series } from "../../fixtures/week3";
import type { PickTeamData } from "./fixtures";
import type { PickAction, PickState } from "./model";
import { WORDS } from "./words";

/** What each of the page's pieces is drawn from. */
export interface ViewProps {
  data: PickTeamData;
  state: PickState;
  dispatch: Dispatch<PickAction>;
}

/** The week's opponents on one line, as FPL's fixtures: `v KT, GEN`. */
export const fixtureLine = (series: readonly Series[], team: string) => `${WORDS.versus} ${seriesOf(series, team).map((s) => opponent(s, team)).join(", ")}`;

/** C or nothing, from the draft. */
export const markOf = (state: PickState, id: string) => (state.draft.captain === id ? "C" : undefined);
