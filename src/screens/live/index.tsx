import { MANAGER } from "../../fixtures/week3";
import { PageFrame, PageHead } from "../../parts";

/** A placeholder until its own issue builds it to docs/design/approved/live/. */
export function LiveScreen() {
  return (
    <PageFrame active="live" account={MANAGER.team}>
      <PageHead title={"Live"} hangul={"라이브"} />
    </PageFrame>
  );
}
