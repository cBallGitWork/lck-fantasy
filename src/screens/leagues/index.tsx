import { MANAGER } from "../../fixtures/week3";
import { PageFrame, PageHead } from "../../parts";

/** A placeholder until its own issue builds it to docs/design/approved/leagues/. */
export function LeaguesScreen() {
  return (
    <PageFrame screen="leagues" active="leagues" account={MANAGER.team}>
      <PageHead title={"Leagues"} hangul={"리그"} />
    </PageFrame>
  );
}
