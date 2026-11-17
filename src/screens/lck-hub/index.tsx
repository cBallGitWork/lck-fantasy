import { MANAGER } from "../../fixtures/week3";
import { useDevState } from "../../parts";
import { LCK_HUB } from "./fixtures";
import { LckHub } from "./LckHub";
import type { HubTab } from "./types";

/** The LCK hub's route, on its made-up data until the backend feeds it (#36, #116). `?state=results`, `standings` or `teams` opens that tab, in dev. */
export function LckHubScreen() {
  const tab = useDevState<HubTab>({ results: "Results", standings: "Standings", teams: "Teams" });
  return <LckHub data={LCK_HUB} account={MANAGER.team} tab={tab} />;
}
