import { count, cx, NONE, OutlinedKey, RankMove, RowPlayer, Table, Tag, TierTag, type Column } from "../../parts";
import { profileGo } from "../../paths";
import type { StandingRow, Standings as StandingsData } from "./types";
import { chaseText, removeLabel, weekHead, WORDS } from "./words";

/** Ranks drawn as the podium's squares: gold, silver and bronze (plate.md, Colour). */
const PODIUM = 3;

/** Remove a manager: a Remove key on every row but yours, and the row picked for the confirm. */
export interface Removing {
  onPick: (row: StandingRow) => void;
  picked?: string;
}

/**
 * A league's table: rank (1 to 3 on the podium's squares), move, the tier on Overall's season table, team and manager (your row
 * filled with a white left edge, with its chase tag), then once the deadline has passed the Captain and the week's points; the
 * split's on a group's table; the total; and `›` to the manager's team, or `Remove` while the maker removes a manager. Runs of
 * rows have a `⋯` between them: the top rows, then the rows round yours (`firstPage`).
 */
export function Standings({
  table,
  week,
  deadlinePassed,
  tiered,
  removing,
}: {
  table: StandingsData;
  week: number;
  deadlinePassed: boolean;
  tiered: boolean;
  removing?: Removing;
}) {
  const runStarts = new Set(table.runs.slice(1).map((run) => run[0]));
  const removeColumn: Column<StandingRow>[] = removing
    ? [
        {
          key: "remove",
          head: "",
          width: "colScore",
          figure: true,
          cell: (r) =>
            !r.mine && (
              <OutlinedKey small label={removeLabel(r.team)} onClick={() => removing.onPick(r)}>
                {WORDS.remove}
              </OutlinedKey>
            ),
        },
      ]
    : [];
  return (
    <Table
      columns={[...columns(week, deadlinePassed, tiered, table.splitColumn), ...removeColumn]}
      rows={table.runs.flat()}
      rowKey={(r) => String(r.rank)}
      selected={(r) => r.mine}
      rowClass={(r) => (r.managerId === removing?.picked ? "leagues__picked" : undefined)}
      subAbove={(r) => (runStarts.has(r) ? "gap" : undefined)}
      open={removing ? undefined : { name: (r) => r.team, go: (r) => profileGo(r.managerId) }}
    />
  );
}

function columns(week: number, deadlinePassed: boolean, tiered: boolean, splitColumn?: string): Column<StandingRow>[] {
  return [
    { key: "rank", head: WORDS.rank, width: "colRank", cell: Rank },
    { key: "move", head: "", width: "colFigure", cell: (r) => <RankMove move={r.move} /> },
    ...(tiered ? [{ key: "tier", head: WORDS.tier, width: "colTier", cell: (r) => (r.tier ? <TierTag tier={r.tier} /> : NONE) } satisfies Column<StandingRow>] : []),
    { key: "name", head: WORDS.teamManager, fullText: (r) => `${r.team} · ${r.manager}`, cell: Name },
    ...(deadlinePassed
      ? [
          { key: "captain", head: WORDS.captain, width: "colCaptain", cell: (r) => <RowPlayer team={r.captain.team} name={r.captain.name} /> } satisfies Column<StandingRow>,
          { key: "week", head: weekHead(week), figure: true, width: "colScore", cell: (r) => r.week } satisfies Column<StandingRow>,
        ]
      : []),
    ...(splitColumn
      ? [{ key: "split", head: splitColumn, figure: true, width: "colScore", cell: (r) => (r.split === undefined ? NONE : count(r.split)) } satisfies Column<StandingRow>]
      : []),
    { key: "total", head: WORDS.total, figure: true, width: "colScore", cell: (r) => count(r.total) },
  ];
}

/** A rank, and 1st to 3rd as the podium's filled squares. */
function Rank({ rank }: StandingRow) {
  return <span className={cx("leagues__rank num", rank <= PODIUM && `leagues__pod leagues__pod--${rank}`)}>{count(rank)}</span>;
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
