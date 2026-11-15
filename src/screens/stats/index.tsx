import { useState } from "react";
import { MANAGER } from "../../fixtures/week3";
import { SPANS, STATS_BY_SPAN } from "./fixtures";
import { nextView, START_VIEW } from "./stats";
import { StatsPage } from "./StatsPage";

/** Stats on the made-up LCK Cup Week 3 list, until the backend feeds it. */
export function StatsScreen() {
  const [view, setView] = useState(START_VIEW);
  const data = STATS_BY_SPAN[view.span] ?? STATS_BY_SPAN[START_VIEW.span];
  return (
    <StatsPage
      account={MANAGER.team}
      view={view}
      rows={(view.tab === "Players" ? data?.players : data?.coaches) ?? []}
      spans={SPANS}
      onChange={(change) => setView((v) => nextView(v, change))}
    />
  );
}
