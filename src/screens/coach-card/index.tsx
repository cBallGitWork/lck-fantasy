import { MANAGER } from "../../fixtures/week3";
import { PageFrame, PageHead } from "../../parts";

/** A placeholder until its own issue builds it to docs/design/approved/coach-card/. */
export function CoachCardScreen() {
  return (
    <PageFrame account={MANAGER.team}>
      <PageHead title={"Coach card"} hangul={"감독 카드"} />
    </PageFrame>
  );
}
