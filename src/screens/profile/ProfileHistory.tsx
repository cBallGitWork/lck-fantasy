import { money, NONE, RankMove, Table, type Column } from "../../parts";
import type { HistoryRow } from "./fixtures";
import { countOrNone } from "./format";

const COLUMNS: Column<HistoryRow>[] = [
  { key: "week", head: "Week", cell: (r) => `Week ${r.week}` },
  { key: "pts", head: "Pts", figure: true, cell: (r) => r.points },
  { key: "total", head: "Total", figure: true, cell: (r) => countOrNone(r.total) },
  { key: "weekRank", head: "Week rank", figure: true, cell: (r) => countOrNone(r.weekRank) },
  { key: "overall", head: "Overall", figure: true, cell: (r) => countOrNone(r.overall) },
  { key: "move", head: "Move", figure: true, cell: (r) => <Move places={r.move} /> },
  { key: "transfers", head: "Transfers", figure: true, cell: (r) => countOrNone(r.transfers) },
  { key: "hits", head: "Hits", figure: true, cell: (r) => countOrNone(r.hits) },
  { key: "bank", head: "Bank", figure: true, cell: (r) => money(r.bankM) },
  { key: "value", head: "Value", figure: true, cell: (r) => money(r.valueM) },
  { key: "buff", head: "Buff", cell: (r) => r.buff ?? NONE },
];

/** A rank's move, in `--text` with ▲ or ▼; `—` when there is none. */
export function Move({ places }: { places: number | undefined }) {
  if (!places) return <>{NONE}</>;
  return <RankMove move={places} />;
}

/** History: each week's points, total, ranks, transfers, hits, bank, value and buff; then the buffs left. */
export function ProfileHistory({ rows, buffsLeft, onOpenWeek }: { rows: HistoryRow[]; buffsLeft: string[]; onOpenWeek: (week: number) => void }) {
  return (
    <section className="profile__history">
      <Table
        columns={COLUMNS}
        rows={rows}
        rowKey={(r) => String(r.week)}
        open={{ name: (r) => `Week ${r.week}`, onOpen: (r) => onOpenWeek(r.week) }}
        label="History"
      />
      <p className="profile__left">
        Buffs left: <b>{buffsLeft.length > 0 ? buffsLeft.join(" · ") : NONE}</b>
      </p>
    </section>
  );
}
