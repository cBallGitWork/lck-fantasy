import type { ReactNode } from "react";
import { Columns, PageFrame, PageHead, Placeholder, SponsorNote } from "../../parts";
import "./leagues.css";
import { WORDS } from "./words";

/** The page: `Leagues 리그` over both columns, the open league, then your leagues, the sponsor and its note in the side column on the right. */
export function LeaguesPage({ account, list, children }: { account: string; list: ReactNode; children: ReactNode }) {
  return (
    <PageFrame screen="leagues" active="leagues" account={account}>
      <PageHead title={WORDS.title} hangul={WORDS.hangul} />
      <Columns className="leagues">
        <div className="leagues__main">{children}</div>
        <aside className="leagues__side">
          {list}
          <Placeholder word={WORDS.sponsor} height="sponsorH" />
          <SponsorNote />
        </aside>
      </Columns>
    </PageFrame>
  );
}
