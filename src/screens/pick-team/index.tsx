import { MANAGER } from "../../fixtures/week3";
import { PageFrame, PageHead } from "../../parts";

/** A placeholder until its own issue builds it to docs/design/approved/pick-team/. */
export function PickTeamScreen() {
  return (
    <PageFrame active="pickTeam" account={MANAGER.team}>
      <PageHead title={"Pick Team"} hangul={"팀 선택"} />
    </PageFrame>
  );
}
