import { MANAGER } from "../../fixtures/week3";
import { cx, Empty, eok, GoLink, LinkGo, MeDot, PageFrame, PageHead, Table, Time, WeekArrow, type Column } from "../../parts";
import { cardGo, type Go } from "../../paths";
import { ROLE_NAME } from "../../rift";
import type { PriceMove, PriceWeek } from "./fixtures";
import "./PatchUpdate.css";

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
        <small className="patch-update__meta">
          {row.team} · {ROLE_NAME[row.role]}
        </small>
      </>
    ),
  },
  { key: "was", head: "Was", figure: true, cell: (row) => <span className="patch-update__was">{eok(row.wasEok)}</span> },
  {
    key: "move",
    head: "",
    figure: true,
    cell: (row) => {
      const rise = row.nowEok > row.wasEok;
      return <span className={rise ? "rise" : "fall"} role="img" aria-label={rise ? "Rise" : "Fall"} />;
    },
  },
  { key: "now", head: "Now", figure: true, cell: (row) => <b>{eok(row.nowEok)}</b> },
  { key: "owned", head: "Owned", figure: true, cell: (row) => `${row.ownedPct}%` },
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
        <div className="patch-update__week">
          <WeekArrow onStep={onPrev} label="Week before">
            ‹
          </WeekArrow>
          Week {week.week} prices
          <WeekArrow onStep={onNext} label="Week after">
            ›
          </WeekArrow>
        </div>
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
