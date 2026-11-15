import { MANAGER } from "../../fixtures/week3";
import { PageFrame, PageHead } from "../../parts";

/** A placeholder until its own issue builds it to docs/design/approved/player-card/. */
export function PlayerCardScreen() {
  return (
    <PageFrame screen="player-card" account={MANAGER.team}>
      <PageHead title={"Player card"} hangul={"선수 카드"} />
    </PageFrame>
  );
}
