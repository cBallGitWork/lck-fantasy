import { MANAGER } from "../../fixtures/week3";
import { PageFrame, PageHead } from "../../parts";

/** A placeholder until its own issue builds it to docs/design/approved/series/. */
export function SeriesScreen() {
  return (
    <PageFrame account={MANAGER.team}>
      <PageHead title={"Series"} hangul={"시리즈"} />
    </PageFrame>
  );
}
