import { PICK_TEAM_DATA, PICK_TEAM_STATES } from "./fixtures";
import { PickTeamPage } from "./PickTeam";

/** Pick Team (docs/design/approved/pick-team/), on its made-up data until the backend feeds it. */
export function PickTeamScreen() {
  return <PickTeamPage data={PICK_TEAM_DATA} initial={PICK_TEAM_STATES.rift} />;
}
