import { money, NONE, ordinal, RankMove, SectionHead, signed, Table, TierTag, type Column } from "../../parts";
import type { HistoryRow, PastSeason } from "./fixtures";
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

/** Past seasons, as FPL's: each ended season's final tier and rank on Overall (spec/08). */
const SEASON_COLUMNS: Column<PastSeason>[] = [
  { key: "season", head: WORDS.season, cell: (r) => r.season },
  { key: "tier", head: WORDS.tier, cell: (r) => <TierTag tier={r.tier} /> },
  { key: "rank", head: WORDS.rank, figure: true, cell: (r) => ordinal(r.rank) },
];

/** History: each week's points, total, ranks, transfers, their cost, bank, value and buff; then the buffs left; then past seasons, once one has ended. */
export function ProfileHistory({
  rows,
  buffsLeft,
  pastSeasons,
  onOpenWeek,
}: {
  rows: HistoryRow[];
  buffsLeft: string[];
  pastSeasons: PastSeason[];
  onOpenWeek: (week: number) => void;
}) {
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
      {pastSeasons.length > 0 && (
        <>
          <SectionHead className="profile__past">{WORDS.pastSeasons}</SectionHead>
          <Table columns={SEASON_COLUMNS} rows={pastSeasons} rowKey={(r) => r.season} label={WORDS.pastSeasons} />
        </>
      )}
    </section>
  );
}
