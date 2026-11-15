import { MANAGER } from "../../fixtures/week3";
import { PageFrame, PageHead } from "../../parts";

/** A placeholder until its own issue builds it to docs/design/approved/profile/. */
export function ProfileScreen() {
  return (
    <PageFrame screen="profile" account={MANAGER.team}>
      <PageHead title={"Profile"} hangul={"프로필"} />
    </PageFrame>
  );
}
