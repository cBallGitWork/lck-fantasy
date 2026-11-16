import { useDevState } from "../../parts";
import { PICK_TEAM_DATA, PICK_TEAM_STATES } from "./fixtures";
import { PickTeamPage } from "./PickTeam";

/** Pick Team (docs/design/approved/pick-team/), on its made-up data until the backend feeds it. `?state=cards` or `swap` opens those pictures, in dev. */
export function PickTeamScreen() {
  const { cards, swap, rift } = PICK_TEAM_STATES;
  return <PickTeamPage data={PICK_TEAM_DATA} initial={useDevState({ cards, swap }) ?? rift} />;
}
