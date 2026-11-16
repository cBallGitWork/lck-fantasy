import { count, NONE, RankMove, Table, Tag, type Column } from "../../parts";
import { profileGo } from "../../paths";
import { chaseText } from "./format";
import type { StandingRow, Standings as StandingsData } from "./types";

/**
 * A league's table: rank, move, team and manager (your row on fill, with its chase tag), Carry once
 * the deadline has passed, the week's points, the split's on a group's table, the total, and `›` to the
 * manager's team. Runs of rows have a `⋯` between them: the top rows, then the rows round yours.
 */
export function Standings({ table, week, carryShown }: { table: StandingsData; week: number; carryShown: boolean }) {
  const runStarts = new Set(table.runs.slice(1).map((run) => run[0]));
  return (
    <Table
      columns={columns(week, carryShown, table.splitColumn)}
      rows={table.runs.flat()}
      rowKey={(r) => String(r.rank)}
      selected={(r) => !!r.mine}
      subAbove={(r) => (runStarts.has(r) ? "gap" : undefined)}
      open={{ name: (r) => r.team, go: (r) => profileGo(r.managerId) }}
    />
  );
}

function columns(week: number, carryShown: boolean, splitColumn?: string): Column<StandingRow>[] {
  return [
    { key: "rank", head: "Rank", width: "colRank", cell: (r) => <span className="leagues__rank num">{count(r.rank)}</span> },
    { key: "move", head: "", width: "colFigure", cell: (r) => <RankMove move={r.move} /> },
    { key: "name", head: "Team · Manager", fullText: (r) => `${r.team} · ${r.manager}`, cell: Name },
    ...(carryShown ? [{ key: "carry", head: "Carry", width: "colCarry", cell: (r) => r.carry } satisfies Column<StandingRow>] : []),
    { key: "week", head: `Week ${week}`, figure: true, width: "colScore", cell: (r) => r.week },
    ...(splitColumn
      ? [{ key: "split", head: splitColumn, figure: true, width: "colScore", cell: (r) => (r.split === undefined ? NONE : count(r.split)) } satisfies Column<StandingRow>]
      : []),
    { key: "total", head: "Total", figure: true, width: "colScore", cell: (r) => count(r.total) },
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
