import { GoLink, Loading, NONE, Tag } from "../../parts";
import { cardGo, PATHS } from "../../paths";
import { BENCH_SLOTS, isBench, LINEUP_ORDER, MARK_NAME, ROLE_NAME } from "../../rift";
import type { PointsWeek, ProfilePick } from "./fixtures";

const BENCH = "Bench";

const onBench = (pick: ProfilePick) => isBench(pick.slot);

/** The slot as the table names it: `Top`, `Flex · Top`, `Bench 1 · Mid`. */
export function slotLabel(pick: ProfilePick): string {
  const plays = pick.plays ? ` · ${ROLE_NAME[pick.plays]}` : "";
  if (isBench(pick.slot)) return `${BENCH} ${pick.slot.slice(-1)}${plays}`;
  return `${ROLE_NAME[pick.slot]}${plays}`;
}

/**
 * Points: ‹ week ›, her points with Average and Highest, Not final and the buff; then her team in
 * role order with C and V, each player's points and series, and the bench.
 */
export function ProfilePoints({ week, onWeek, hasPrev, hasNext }: { week: PointsWeek; onWeek?: (week: number) => void; hasPrev: boolean; hasNext: boolean }) {
  const starters = week.team?.filter((pick) => !onBench(pick)) ?? [];
  const bench = week.team?.filter(onBench) ?? [];
  return (
    <section className="profile__points" aria-label={`Week ${week.week}`}>
      <div className="profile__week">
        <WeekArrow on={hasPrev} label="Week before" onClick={() => onWeek?.(week.week - 1)}>
          ‹
        </WeekArrow>
        <h2 className="profile__week-name">Week {week.week}</h2>
        <WeekArrow on={hasNext} label="Week after" onClick={() => onWeek?.(week.week + 1)}>
          ›
        </WeekArrow>
        <b className="profile__week-points num">{week.points}</b>
        {week.average !== undefined && (
          <span className="profile__week-fig">
            Average <b className="num">{week.average}</b>
          </span>
        )}
        {week.highest !== undefined && (
          <GoLink className="profile__week-fig" go={{ to: PATHS.perfectGame }}>
            Highest <b className="num">{week.highest}</b> ›
          </GoLink>
        )}
        {!week.final && <Tag kind="notFinal">Not final</Tag>}
        {week.buff && <Tag>{week.buff}</Tag>}
      </div>
      {week.team ? (
        <table className="table profile__table">
          <colgroup>
            <col className="profile__col-slot" />
            <col className="profile__col-player" />
            <col className="profile__col-pts" />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">Slot</th>
              <th scope="col">Player</th>
              <th scope="col" className="profile__figure">
                Pts
              </th>
              <th scope="col">Series</th>
            </tr>
          </thead>
          <tbody>
            {starters.map((pick) => (
              <PickRow key={pick.slot} pick={pick} />
            ))}
            <tr className="profile__sub">
              <td colSpan={4}>{BENCH}</td>
            </tr>
            {bench.map((pick) => (
              <PickRow key={pick.slot} pick={pick} />
            ))}
          </tbody>
        </table>
      ) : (
        <Loading rows={LINEUP_ORDER.length + BENCH_SLOTS.length} label={`Week ${week.week}'s team`} />
      )}
    </section>
  );
}

function PickRow({ pick }: { pick: ProfilePick }) {
  return (
    <tr>
      <td>
        <small>{slotLabel(pick)}</small>
      </td>
      <td>
        <GoLink className="profile__name" go={cardGo(pick.id, pick.slot === "coach")}>
          {pick.name}
        </GoLink>
        {pick.mark && (
          <span className={pick.mark === "V" ? "profile__mark profile__mark--v" : "profile__mark"} title={MARK_NAME[pick.mark]}>
            {pick.mark}
          </span>
        )}{" "}
        <small>{pick.team}</small>
      </td>
      <td className="profile__figure num">{pick.points ?? NONE}</td>
      <td>
        <small>
          {pick.note ??
            pick.series.map((line) => (
              <span key={line} className="profile__series">
                {line}
              </span>
            ))}
        </small>
      </td>
    </tr>
  );
}

function WeekArrow({ on, label, onClick, children }: { on: boolean; label: string; onClick: () => void; children: string }) {
  return on ? (
    <button type="button" className="profile__arrow" aria-label={label} onClick={onClick}>
      {children}
    </button>
  ) : (
    <span className="profile__arrow profile__arrow--off" aria-hidden="true">
      {children}
    </span>
  );
}
