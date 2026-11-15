import { MANAGER } from "../../fixtures/week3";
import { PageFrame, PageHead } from "../../parts";

/** A placeholder until its own issue builds it to docs/design/approved/compare/. */
export function CompareScreen() {
  return (
    <PageFrame screen="compare" account={MANAGER.team}>
      <PageHead title={"Compare"} hangul={"비교"} />
    </PageFrame>
  );
}
