import { rememberedView, rememberView, useDevState, VIEW_KEYS } from "../../parts";
import { VIEWS as BOARD_VIEWS } from "../../rift";
import { PICK_TEAM_DATA, PICK_TEAM_STATES } from "./fixtures";
import type { PickView } from "./model";
import { PickTeamPage, VIEWS } from "./PickTeam";

/** The view shared with Points and Perfect game, as Pick Team names it. */
const keptView = (): PickView => {
  const board = rememberedView(VIEW_KEYS.board, BOARD_VIEWS);
  return VIEWS.find((v) => v.label === board)?.value ?? VIEWS[0].value;
};

const keepView = (view: PickView) => {
  const board = VIEWS.find((v) => v.value === view);
  if (board) rememberView(VIEW_KEYS.board, board.label);
};

/**
 * Pick Team (docs/design/approved/pick-team/), on its made-up data until the backend feeds it. It opens on
 * the view shared with Points and Perfect game (spec/12). `?state=cards` or `swap` opens those pictures, in dev.
 */
export function PickTeamScreen() {
  const { cards, swap, rift } = PICK_TEAM_STATES;
  const dev = useDevState({ cards, swap });
  return <PickTeamPage data={PICK_TEAM_DATA} initial={dev ?? { ...rift, view: keptView() }} onView={keepView} />;
}
