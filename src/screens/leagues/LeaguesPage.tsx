import type { ReactNode } from "react";
import { Columns, PageFrame, PageHead, SponsorNote } from "../../parts";
import "./leagues.css";

/** The page: `Leagues 리그` over both columns, the open league, then your leagues in the side column on the right. */
export function LeaguesPage({ account, list, children }: { account: string; list: ReactNode; children: ReactNode }) {
  return (
    <PageFrame screen="leagues" active="leagues" account={account}>
      <PageHead title="Leagues" hangul="리그" />
      <Columns className="leagues">
        {children}
        {list}
      </Columns>
      <SponsorNote />
    </PageFrame>
  );
}
