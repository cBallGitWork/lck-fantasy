import { MANAGER } from "../../fixtures/week3";
import { PageFrame, PageHead } from "../../parts";

/** A placeholder until its own issue builds it to docs/design/approved/following/. */
export function FollowingScreen() {
  return (
    <PageFrame account={MANAGER.team}>
      <PageHead title={"Following"} hangul={"팔로잉"} />
    </PageFrame>
  );
}
