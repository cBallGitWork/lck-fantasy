import { Placeholder, Tabs, ViewToggle } from "../../parts";
import { LeagueHead, TableBody, type TableProps } from "./LeagueTable";
import type { LeagueView, OverallGroup } from "./types";

/**
 * Overall: the season, and the split on a split's tab; its groups on the grouped tab; the
 * tabs with the sponsor at their right; the table, then the pager with Find me.
 */
export function OverallTable({
  league,
  group,
  onGroup,
  ...table
}: { league: Extract<LeagueView, { kind: "overall" }>; group?: OverallGroup; onGroup: (group: OverallGroup) => void } & TableProps) {
  const { competition } = table;
  const grouped = table.tab === competition.groupedTab;
  return (
    <section className="leagues__panel" aria-label={league.name}>
      <LeagueHead name={<h2 className="leagues__name-head">{league.name}</h2>} sub={table.tab === competition.seasonTab ? league.season : `${league.season} · ${table.tab}`}>
        {grouped && group !== undefined && <ViewToggle options={competition.groups} chosen={group} onChoose={onGroup} label="Group" />}
      </LeagueHead>
      <div className="leagues__tabs-line">
        <Tabs tabs={competition.tabs} chosen={table.tab} onChoose={table.onTab} label="Table" />
        <span className="leagues__sponsor">
          <Placeholder word="Sponsor" width="sponsorTopW" height="target" />
        </span>
      </div>
      <TableBody league={league} {...table} />
    </section>
  );
}
