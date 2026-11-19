import { money, NONE, RankMove, signed, Table, type Column } from "../../parts";
import type { HistoryRow } from "./fixtures";
import { countOrNone } from "./format";
import { dot, weekNo, WORDS } from "./words";

const COLUMNS: Column<HistoryRow>[] = [
  { key: "week", head: WORDS.week, cell: (r) => weekNo(r.week) },
  { key: "pts", head: WORDS.pts, figure: true, cell: (r) => r.points },
  { key: "total", head: WORDS.total, figure: true, cell: (r) => countOrNone(r.total) },
  { key: "weekRank", head: WORDS.weekRank, figure: true, cell: (r) => countOrNone(r.weekRank) },
  { key: "overall", head: WORDS.overall, figure: true, cell: (r) => countOrNone(r.overall) },
  { key: "move", head: WORDS.move, figure: true, cell: (r) => <RankMove move={r.move} /> },
  { key: "transfers", head: WORDS.transfers, figure: true, cell: (r) => countOrNone(r.transfers) },
  { key: "cost", head: WORDS.cost, figure: true, cell: (r) => (r.cost ? signed(-r.cost) : NONE) },
  { key: "bank", head: WORDS.bank, figure: true, cell: (r) => money(r.bankM) },
  { key: "value", head: WORDS.value, figure: true, cell: (r) => money(r.valueM) },
  { key: "buff", head: WORDS.buff, cell: (r) => r.buff ?? NONE },
];

/** History: each week's points, total, ranks, transfers, their cost, bank, value and buff; then the buffs left. */
export function ProfileHistory({ rows, buffsLeft, onOpenWeek }: { rows: HistoryRow[]; buffsLeft: string[]; onOpenWeek: (week: number) => void }) {
  return (
    <section className="profile__history">
      <Table
        columns={COLUMNS}
        rows={rows}
        rowKey={(r) => String(r.week)}
        open={{ name: (r) => weekNo(r.week), onOpen: (r) => onOpenWeek(r.week) }}
        label={WORDS.history}
      />
      <p className="profile__left">
        {WORDS.buffsLeft} <b>{buffsLeft.length > 0 ? buffsLeft.join(dot) : NONE}</b>
      </p>
    </section>
  );
}
