import type { ReactNode } from "react";
import { Columns, PageFrame, PageHead, SponsorNote } from "../../parts";
import "./leagues.css";
import { WORDS } from "./words";

/** The page: `Leagues 리그` over both columns, the open league, then your leagues in the side column on the right. */
export function LeaguesPage({ account, list, children }: { account: string; list: ReactNode; children: ReactNode }) {
  return (
    <PageFrame screen="leagues" active="leagues" account={account}>
      <PageHead title={WORDS.title} hangul={WORDS.hangul} />
      <Columns className="leagues">
        {children}
        {list}
      </Columns>
      <SponsorNote />
    </PageFrame>
  );
}
