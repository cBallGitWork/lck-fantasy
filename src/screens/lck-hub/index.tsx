import { MANAGER } from "../../fixtures/week3";
import { PageFrame, PageHead } from "../../parts";

/** A placeholder until its own issue builds it to docs/design/approved/lck-hub/. */
export function LckHubScreen() {
  return (
    <PageFrame active="lckHub" account={MANAGER.team}>
      <PageHead title={"LCK Cup 2027"} hangul={"LCK 컵"} />
    </PageFrame>
  );
}
