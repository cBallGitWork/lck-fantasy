import { MANAGER } from "../../fixtures/week3";
import { PageFrame, PageHead } from "../../parts";

/** A placeholder until its own issue builds it to docs/design/approved/settings/. */
export function SettingsScreen() {
  return (
    <PageFrame screen="settings" account={MANAGER.team}>
      <PageHead title={"Settings"} hangul={"설정"} />
    </PageFrame>
  );
}
