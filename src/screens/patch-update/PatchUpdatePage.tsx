import { MANAGER } from "../../fixtures/week3";
import { type Column, cx, Empty, money, GoLink, LinkGo, MeDot, PageFrame, PageHead, pct, Table, Time, WeekStep } from "../../parts";
import { cardGo, type Go } from "../../paths";
import { ROLE_NAME } from "../../rift";
import type { PriceMove, PriceWeek } from "./fixtures";
import "./patch-update.css";

export const NO_MOVES = "No moves yet";

/** A name opens the player's card, or the coach's. */
export const cardOf = (row: PriceMove) => cardGo(row.id, row.role === "coach");

const COLUMNS: Column<PriceMove>[] = [
  {
    key: "player",
    head: "Player",
    cell: (row) => (
      <>
        <GoLink go={cardOf(row)} className="patch-update__name">
          {row.name}
        </GoLink>
        {row.mine && <MeDot />}
        <small className="patch-update__meta quiet">
          {row.team} · {ROLE_NAME[row.role]}
        </small>
      </>
    ),
  },
  { key: "was", head: "Was", figure: true, cell: (row) => <span className="patch-update__was">{money(row.wasM)}</span> },
  { key: "now", head: "Now", figure: true, cell: (row) => <b>{money(row.nowM)}</b> },
  { key: "owned", head: "Owned", figure: true, cell: (row) => pct(row.ownedPct) },
];

function MoveList({ kind, title, rows }: { kind: "rise" | "fall"; title: string; rows: PriceMove[] }) {
  return (
    <section className={cx("patch-update__list", `patch-update__list--${kind}`)}>
      <h2 className="patch-update__list-title">{title}</h2>
      {rows.length === 0 ? <Empty title={NO_MOVES} /> : <Table columns={COLUMNS} rows={rows} rowKey={(row) => row.id} label={title} />}
    </section>
  );
}

/**
 * Patch update: one week's new prices, rises left and falls right; before the first move both
 * lists read `No moves yet`. ‹ › step to the week before or after, absent where there is none.
 */
export function PatchUpdatePage({
  week,
  onPrev,
  onNext,
  howPricesMove,
}: {
  week: PriceWeek;
  onPrev?: () => void;
  onNext?: () => void;
  /** The Help page's formula (spec/02), once Help has a route. */
  howPricesMove?: Go;
}) {
  return (
    <PageFrame screen="patch-update" active="stats" account={MANAGER.team}>
      <div className="patch-update__head">
        <PageHead title="Patch update" hangul="패치 노트" />
        <WeekStep prev={onPrev} next={onNext} className="patch-update__week">
          Week {week.week} prices
        </WeekStep>
      </div>
      {(week.set || howPricesMove) && (
        <div className="patch-update__when">
          {week.set && (
            <span>
              Set <Time local={week.set.local} kst={week.set.kst} />
            </span>
          )}
          {howPricesMove && <LinkGo go={howPricesMove}>How prices move</LinkGo>}
        </div>
      )}
      <div className="patch-update__lists">
        <MoveList kind="rise" title="Rises" rows={week.rises} />
        <MoveList kind="fall" title="Falls" rows={week.falls} />
      </div>
    </PageFrame>
  );
}
