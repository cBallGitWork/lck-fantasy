import { MANAGER } from "../../fixtures/week3";
import { PageFrame, PageHead } from "../../parts";

/** A placeholder until its own issue builds it to docs/design/approved/perfect-game/. */
export function PerfectGameScreen() {
  return (
    <PageFrame screen="perfect-game" active="points" account={MANAGER.team}>
      <PageHead title={"Perfect game"} hangul={"퍼펙트 게임"} />
    </PageFrame>
  );
}
