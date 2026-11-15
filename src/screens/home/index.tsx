import { MANAGER } from "../../fixtures/week3";
import { PageFrame, PageHead } from "../../parts";

/** A placeholder until its own issue builds it to docs/design/approved/home/. */
export function HomeScreen() {
  return (
    <PageFrame active="home" account={MANAGER.team}>
      <PageHead title={MANAGER.team} hangul={MANAGER.hangul} />
    </PageFrame>
  );
}
