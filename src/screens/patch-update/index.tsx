import { MANAGER } from "../../fixtures/week3";
import { PageFrame, PageHead } from "../../parts";

/** A placeholder until its own issue builds it to docs/design/approved/patch-update/. */
export function PatchUpdateScreen() {
  return (
    <PageFrame screen="patch-update" active="stats" account={MANAGER.team}>
      <PageHead title={"Patch update"} hangul={"패치 노트"} />
    </PageFrame>
  );
}
