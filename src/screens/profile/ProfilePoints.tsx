import { GoLink, Loading, NONE, NotFinalTag, Tag, WeekStep } from "../../parts";
import { cardGo, PATHS } from "../../paths";
import { isBench, MarkBadge, ROLE_NAME, SQUAD_SIZE } from "../../rift";
import type { PointsWeek, ProfilePick } from "./fixtures";

const BENCH = "Bench";

const onBench = (pick: ProfilePick) => isBench(pick.slot);

/** The slot as the table names it: `Top`, `Flex · Top`, `Bench 1 · Mid`. */
function pickSlot(pick: ProfilePick): string {
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
    <section aria-label={`Week ${week.week}`}>
      <div className="profile__week">
        <WeekStep prev={hasPrev ? () => onWeek?.(week.week - 1) : undefined} next={hasNext ? () => onWeek?.(week.week + 1) : undefined}>
          <h2 className="profile__week-name">Week {week.week}</h2>
        </WeekStep>
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
        {!week.final && <NotFinalTag />}
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
        <Loading rows={SQUAD_SIZE} label={`Week ${week.week}'s team`} />
      )}
    </section>
  );
}

function PickRow({ pick }: { pick: ProfilePick }) {
  return (
    <tr>
      <td>
        <small className="quiet">{pickSlot(pick)}</small>
      </td>
      <td>
        <GoLink className="profile__name" go={cardGo(pick.id, pick.slot)}>
          {pick.name}
        </GoLink>
        {pick.mark && (
          <MarkBadge mark={pick.mark} className="profile__mark" />
        )}{" "}
        <small className="quiet">{pick.team}</small>
      </td>
      <td className="profile__figure num">{pick.points ?? NONE}</td>
      <td>
        <small className="quiet">
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
