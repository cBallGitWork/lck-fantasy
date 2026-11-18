import { MANAGER } from "../../fixtures/week3";
import { type Column, cx, Empty, money, GoLink, LinkGo, MeDot, PageFrame, PageHead, pct, Table, Time, WeekStep } from "../../parts";
import { cardGo, type Go } from "../../paths";
import { ROLE_NAME } from "../../rift";
import type { PriceMove, PriceWeek } from "./fixtures";
import "./price-changes.css";
import { teamRole, weekPrices, WORDS } from "./words";

/** A name opens the player's card, or the coach's. */
export const cardOf = (row: PriceMove) => cardGo(row.id, row.role === "coach");

/** A list's rows, the biggest move first, then the most owned (spec/12, Price changes). */
export const biggestFirst = (rows: readonly PriceMove[]): PriceMove[] =>
  [...rows].sort((a, b) => Math.abs(b.nowM - b.wasM) - Math.abs(a.nowM - a.wasM) || b.ownedPct - a.ownedPct);

const COLUMNS: Column<PriceMove>[] = [
  {
    key: "player",
    head: WORDS.player,
    cell: (row) => (
      <>
        <GoLink go={cardOf(row)} className="price-changes__name hover-line">
          {row.name}
        </GoLink>
        {row.mine && <MeDot />}
        <small className="price-changes__meta quiet">
          {teamRole(row.team, ROLE_NAME[row.role])}
        </small>
      </>
    ),
  },
  { key: "was", head: WORDS.was, figure: true, cell: (row) => <span className="price-changes__was">{money(row.wasM)}</span> },
  { key: "now", head: WORDS.now, figure: true, cell: (row) => <b>{money(row.nowM)}</b> },
  { key: "owned", head: WORDS.owned, figure: true, cell: (row) => pct(row.ownedPct) },
];

function MoveList({ kind, title, rows }: { kind: "rise" | "fall"; title: string; rows: PriceMove[] }) {
  return (
    <section className={cx("price-changes__list", `price-changes__list--${kind}`)}>
      <h2 className="price-changes__list-title">{title}</h2>
      {rows.length === 0 ? <Empty title={WORDS.noMoves} /> : <Table columns={COLUMNS} rows={biggestFirst(rows)} rowKey={(row) => row.id} label={title} />}
    </section>
  );
}

/**
 * Price changes: one week's new prices, rises left and falls right; before the first move both
 * lists read `No moves yet`. Each list puts the biggest move first. ‹ › go to the week before or
 * after by its address (`/price-changes/3`), absent where there is none.
 */
export function PriceChangesPage({
  week,
  prev,
  next,
  howPricesMove,
}: {
  week: PriceWeek;
  prev?: Go;
  next?: Go;
  /** The Help page's formula (spec/02), once Help has a route. */
  howPricesMove?: Go;
}) {
  return (
    <PageFrame screen="price-changes" active="stats" account={MANAGER.team}>
      <div className="price-changes__head">
        <PageHead title={WORDS.title} hangul={WORDS.hangul} />
        <WeekStep prev={prev} next={next} className="price-changes__week">
          {weekPrices(week.week)}
        </WeekStep>
      </div>
      {(week.set || howPricesMove) && (
        <div className="price-changes__when">
          {week.set && (
            <span>
              {WORDS.changed} <Time local={week.set.local} kst={week.set.kst} />
            </span>
          )}
          {howPricesMove && <LinkGo go={howPricesMove}>{WORDS.howPricesMove}</LinkGo>}
        </div>
      )}
      <div className="price-changes__lists">
        <MoveList kind="rise" title={WORDS.rises} rows={week.rises} />
        <MoveList kind="fall" title={WORDS.falls} rows={week.falls} />
      </div>
    </PageFrame>
  );
}
