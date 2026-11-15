import { MANAGER } from "../../fixtures/week3";
import { PageFrame, PageHead } from "../../parts";

/** A placeholder until its own issue builds it to docs/design/approved/transfers/. */
export function TransfersScreen() {
  return (
    <PageFrame active="transfers" account={MANAGER.team}>
      <PageHead title={"Transfers"} hangul={"이적"} />
    </PageFrame>
  );
}
