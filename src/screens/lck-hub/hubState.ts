import type { TeamCode } from "../../fixtures/week3";
import type { HubTab, LckHubData } from "./types";

/** What the manager has chosen on the page: a tab, a stage, the week on Fixtures and Results, a team. */
export interface HubState {
  tab: HubTab;
  stage: number;
  fixturesWeek: number;
  resultsWeek: number;
  team: TeamCode;
}

export type WeekTab = "Fixtures" | "Results";

export type HubAction =
  | { type: "tab"; tab: HubTab }
  | { type: "stage"; stage: number }
  | { type: "week"; tab: WeekTab; step: -1 | 1 }
  | { type: "team"; team: TeamCode };

/** Each stage opens on its own weeks. */
function atStage(data: LckHubData, stage: number) {
  const s = data.stages[stage];
  return { stage, fixturesWeek: s?.openFixtures ?? 0, resultsWeek: s?.openResults ?? 0 };
}

/** The page as it opens: the given tab, the first stage, the first team. */
export function startHub(data: LckHubData, tab: HubTab = "Fixtures"): HubState {
  const team = data.teams[0]?.team;
  if (!team) throw new Error("The LCK hub needs at least one team");
  return { tab, team, ...atStage(data, 0) };
}

/** The weeks a tab steps through, in the chosen stage. */
export function weeksOf(data: LckHubData, state: HubState, tab: WeekTab) {
  const stage = data.stages[state.stage];
  return (tab === "Fixtures" ? stage?.fixtures : stage?.results) ?? [];
}

export function nextHub(data: LckHubData, state: HubState, action: HubAction): HubState {
  switch (action.type) {
    case "tab":
      return { ...state, tab: action.tab };
    case "stage":
      return { ...state, ...atStage(data, action.stage) };
    case "team":
      return { ...state, team: action.team };
    case "week": {
      const key = action.tab === "Fixtures" ? "fixturesWeek" : "resultsWeek";
      const last = weeksOf(data, state, action.tab).length - 1;
      return { ...state, [key]: Math.max(0, Math.min(last, state[key] + action.step)) };
    }
  }
}
