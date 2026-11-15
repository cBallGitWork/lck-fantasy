import { MANAGER } from "../../fixtures/week3";
import { PageFrame, PageHead } from "../../parts";

/** A placeholder until its own issue builds it to docs/design/approved/stats/. */
export function StatsScreen() {
  return (
    <PageFrame screen="stats" active="stats" account={MANAGER.team}>
      <PageHead title={"Stats"} hangul={"통계"} />
    </PageFrame>
  );
}
