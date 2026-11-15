import type { ReactNode } from "react";
import { Columns, PageFrame, PageHead, SponsorNote } from "../../parts";
import "./leagues.css";

/** The page: `Leagues 리그` over both columns, your leagues on the left, the open league on the right. */
export function LeaguesPage({ account, list, children }: { account: string; list: ReactNode; children: ReactNode }) {
  return (
    <PageFrame screen="leagues" active="leagues" account={account}>
      <PageHead title="Leagues" hangul="리그" />
      <Columns sideFirst className="leagues">
        {list}
        {children}
      </Columns>
      <SponsorNote />
    </PageFrame>
  );
}
