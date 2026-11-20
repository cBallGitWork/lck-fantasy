import { count, NONE, RankMove, Table, Tag, TierTag, type Column } from "../../parts";
import { profileGo } from "../../paths";
import type { StandingRow, Standings as StandingsData } from "./types";
import { chaseText, weekHead, WORDS } from "./words";

/**
 * A league's table: rank, move, team and manager (your row on fill, with its chase tag), the tier on Overall's season table, Captain once
 * the deadline has passed, the week's points, the split's on a group's table, the total, and `›` to the
 * manager's team. Runs of rows have a `⋯` between them: the top rows, then the rows round yours.
 */
export function Standings({ table, week, captainShown, tiered }: { table: StandingsData; week: number; captainShown: boolean; tiered: boolean }) {
  const runStarts = new Set(table.runs.slice(1).map((run) => run[0]));
  return (
    <Table
      columns={columns(week, captainShown, tiered, table.splitColumn)}
      rows={table.runs.flat()}
      rowKey={(r) => String(r.rank)}
      selected={(r) => !!r.mine}
      subAbove={(r) => (runStarts.has(r) ? "gap" : undefined)}
      open={{ name: (r) => r.team, go: (r) => profileGo(r.managerId) }}
    />
  );
}

function columns(week: number, captainShown: boolean, tiered: boolean, splitColumn?: string): Column<StandingRow>[] {
  return [
    { key: "rank", head: WORDS.rank, width: "colRank", cell: (r) => <span className="leagues__rank num">{count(r.rank)}</span> },
    { key: "move", head: "", width: "colFigure", cell: (r) => <RankMove move={r.move} /> },
    { key: "name", head: WORDS.teamManager, fullText: (r) => `${r.team} · ${r.manager}`, cell: Name },
    ...(tiered ? [{ key: "tier", head: WORDS.tier, width: "colTier", cell: (r) => (r.tier ? <TierTag tier={r.tier} /> : NONE) } satisfies Column<StandingRow>] : []),
    ...(captainShown ? [{ key: "captain", head: WORDS.captain, width: "colCaptain", cell: (r) => r.captain } satisfies Column<StandingRow>] : []),
    { key: "week", head: weekHead(week), figure: true, width: "colScore", cell: (r) => r.week },
    ...(splitColumn
      ? [{ key: "split", head: splitColumn, figure: true, width: "colScore", cell: (r) => (r.split === undefined ? NONE : count(r.split)) } satisfies Column<StandingRow>]
      : []),
    { key: "total", head: WORDS.total, figure: true, width: "colScore", cell: (r) => count(r.total) },
  ];
}

function Name(row: StandingRow) {
  return (
    <span className="leagues__name">
      {row.team}
      <small>{row.manager}</small>
      {row.chase && (
        <span className="leagues__chase">
          <Tag>{chaseText(row.chase)}</Tag>
        </span>
      )}
    </span>
  );
}
