import { useState } from "react";
import { MANAGER } from "../../fixtures/week3";
import { useDevState } from "../../parts";
import { SPANS, STATS_BY_SPAN } from "./fixtures";
import { nextView, START_VIEW } from "./stats";
import { StatsPage } from "./StatsPage";

/** Stats on the made-up LCK Cup Week 3 list, until the backend feeds it. `?state=pergame` or `coaches` opens those pictures, in dev. */
export function StatsScreen() {
  const devView = useDevState({ pergame: nextView(START_VIEW, { figures: "Per game" }), coaches: nextView(START_VIEW, { tab: "Coaches" }) });
  const [view, setView] = useState(devView ?? START_VIEW);
  const data = STATS_BY_SPAN[view.span];
  if (!data) throw new Error(`Stats has no data for the span "${view.span}".`);
  return (
    <StatsPage
      account={MANAGER.team}
      view={view}
      rows={view.tab === "Players" ? data.players : data.coaches}
      spans={SPANS}
      onChange={(change) => setView((v) => nextView(v, change))}
    />
  );
}
