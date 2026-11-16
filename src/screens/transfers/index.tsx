import { useDevState } from "../../parts";
import { TRANSFERS_PICTURE } from "./fixtures";
import { TransfersPage } from "./TransfersPage";

/** Transfers, on the picture's made-up week until the backend feeds its props. `?state=confirm` opens the confirm sheet, in dev. */
export function TransfersScreen() {
  return <TransfersPage {...TRANSFERS_PICTURE} reviewing={useDevState({ confirm: true })} />;
}
