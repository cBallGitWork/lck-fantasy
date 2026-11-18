import { useSearch } from "@tanstack/react-router";
import { SWAP_SEARCH } from "../../paths";
import { rememberedView, rememberView, useDevState, VIEW_KEYS } from "../../parts";
import { VIEWS as BOARD_VIEWS } from "../../rift";
import { PICK_TEAM_DATA, PICK_TEAM_STATES } from "./fixtures";
import { slotOf, type PickView } from "./model";
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
 * the view shared with Points and Perfect game (spec/12). `?swap=faker` opens with that player tapped and
 * those he can swap with lit, as the player card's Swap with bench does. `?state=cards` or `swap` opens
 * those pictures, in dev.
 */
export function PickTeamScreen() {
  const { cards, swap, rift } = PICK_TEAM_STATES;
  const dev = useDevState({ cards, swap });
  const search: Record<string, unknown> = useSearch({ strict: false });
  const asked = search[SWAP_SEARCH];
  const swapping = typeof asked === "string" && slotOf(rift.draft, asked) ? asked : undefined;
  const initial = dev ?? { ...rift, view: keptView(), ...(swapping && { selected: swapping }) };
  return <PickTeamPage data={PICK_TEAM_DATA} initial={initial} onView={keepView} />;
}
