import { GoLink, Loading, NONE, NotFinalTag, Table, Tag, WeekStep, type Column } from "../../parts";
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
    <section className="profile__points" aria-label={`Week ${week.week}`}>
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
        <Table
          columns={PICK_COLUMNS}
          rows={[...starters, ...bench]}
          rowKey={(pick) => pick.slot}
          subAbove={(pick) => (pick === bench[0] ? { head: BENCH } : undefined)}
        />
      ) : (
        <Loading rows={SQUAD_SIZE} label={`Week ${week.week}'s team`} />
      )}
    </section>
  );
}

const PICK_COLUMNS: Column<ProfilePick>[] = [
  { key: "slot", head: "Slot", width: "colSlot", cell: (pick) => <small>{pickSlot(pick)}</small> },
  {
    key: "player",
    head: "Player",
    width: "colPlayer",
    cell: (pick) => (
      <>
        <GoLink className="profile__name" go={cardGo(pick.id, pick.slot === "coach")}>
          {pick.name}
        </GoLink>
        {pick.mark && <MarkBadge mark={pick.mark} className="profile__mark" />} <small>{pick.team}</small>
      </>
    ),
  },
  { key: "pts", head: "Pts", figure: true, width: "colPts", cell: (pick) => pick.points ?? NONE },
  {
    key: "series",
    head: "Series",
    cell: (pick) => (
      <small>
        {pick.note ??
          pick.series.map((line) => (
            <span key={line} className="profile__series">
              {line}
            </span>
          ))}
      </small>
    ),
  },
];
