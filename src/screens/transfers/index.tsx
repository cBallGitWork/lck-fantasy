import { TRANSFERS_PICTURE } from "./fixtures";
import { TransfersPage } from "./TransfersPage";

/** Transfers, on the picture's made-up week until the backend feeds its props. */
export function TransfersScreen() {
  return <TransfersPage {...TRANSFERS_PICTURE} />;
}
