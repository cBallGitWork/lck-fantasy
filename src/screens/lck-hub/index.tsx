import { MANAGER } from "../../fixtures/week3";
import { LCK_HUB } from "./fixtures";
import { LckHub } from "./LckHub";

/** The LCK hub's route, on its made-up data until the backend feeds it (#36, #116). */
export function LckHubScreen() {
  return <LckHub data={LCK_HUB} account={MANAGER.team} />;
}
