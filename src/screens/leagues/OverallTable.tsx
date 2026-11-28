import { useId } from "react";
import { TabPanel, Tabs, ViewToggle } from "../../parts";
import { LeaguePanel, TableBody, type TableProps } from "./LeagueTable";
import { TierPicks } from "./TierPicks";
import type { LeagueView, OverallGroup } from "./types";
import { seasonSplit, WORDS } from "./words";

/**
 * Overall: its name on the band with the season, and the split on a split's tab; the tabs, with its groups at the right on the
 * grouped tab; the table, then the pager with Find me; under it, once the week's deadline has passed, the Captains and buffs by
 * tier. Only the season's table has a Tier column: one tier for the season, none for a split (spec/08). Before gameweek 1 is
 * final there is no table, so no groups either.
 */
export function OverallTable({
  league,
  group,
  onGroup,
  ...table
}: { league: Extract<LeagueView, { kind: "overall" }>; group: OverallGroup; onGroup: (group: OverallGroup) => void } & TableProps) {
  const { competition } = table;
  const grouped = table.tab === competition.groupedTab && !league.startsOn;
  const tabsId = useId();
  return (
    <>
      <LeaguePanel
        title={league.name}
        sub={table.tab === competition.seasonTab ? league.season : seasonSplit(league.season, table.tab)}
        label={league.name}
        tabs={<Tabs id={tabsId} tabs={competition.tabs} chosen={table.tab} onChoose={table.onTab} label={WORDS.table} />}
        keys={grouped && <ViewToggle options={competition.groups} chosen={group} onChoose={onGroup} label={WORDS.group} />}
      >
        <TabPanel id={tabsId}>
          <TableBody league={league} tiered={table.tab === competition.seasonTab} {...table} />
        </TabPanel>
      </LeaguePanel>
      {league.deadlinePassed && league.tierPicks.length > 0 && <TierPicks week={league.week} picks={league.tierPicks} />}
    </>
  );
}
