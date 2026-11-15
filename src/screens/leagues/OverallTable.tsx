import { Placeholder, Tabs, ViewToggle } from "../../parts";
import { LeagueHead, TableBody, type TableProps } from "./LeagueTable";
import { GROUPED_TAB, OVERALL_GROUPS, SEASON_TAB, TABLE_TABS, type LeagueView, type OverallGroup } from "./types";

/**
 * Overall: the season, and the split on a split's tab; Legend, Rise and All on Split 2; the
 * tabs with the sponsor at their right; the table, then the pager with Find me.
 */
export function OverallTable({
  league,
  group,
  onGroup,
  ...table
}: { league: Extract<LeagueView, { kind: "overall" }>; group: OverallGroup; onGroup: (group: OverallGroup) => void } & TableProps) {
  const grouped = table.tab === GROUPED_TAB;
  return (
    <section className="leagues__panel" aria-label={league.name}>
      <LeagueHead name={<h2 className="leagues__name-head">{league.name}</h2>} sub={table.tab === SEASON_TAB ? league.season : `${league.season} · ${table.tab}`}>
        {grouped && <ViewToggle options={OVERALL_GROUPS} chosen={group} onChoose={onGroup} label="Group" />}
      </LeagueHead>
      <div className="leagues__tabs-line">
        <Tabs tabs={TABLE_TABS} chosen={table.tab} onChoose={table.onTab} label="Table" />
        <span className="leagues__sponsor">
          <Placeholder word="Sponsor" width="sponsorTopW" height="target" />
        </span>
      </div>
      <TableBody league={league} {...table} />
    </section>
  );
}
