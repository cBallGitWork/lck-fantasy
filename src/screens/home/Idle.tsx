import { photoOf } from "../../fixtures/photos";
import { cx, Tag } from "../../parts";
import { benchPlace, LineupCard, type LineupCardProps } from "../../rift";
import type { HomeIdleData, PlayedBuff } from "./types";
import { Who } from "./who";
import { lineupTitle, times, versus, WORDS } from "./words";

/**
 * The object with nothing live (approved/home/, What binds 3 and 9): `Week N lineup` on the blue band,
 * the seven starters as Card view's cards, then the bench in its order as one row. With Bench Boost
 * played the bench stands in the lineup as two more cards and the row goes; the played buff is a tag
 * by the title.
 */
export function LineupPanel({ data, buff }: { data: HomeIdleData; buff?: PlayedBuff }) {
  const boost = buff?.effect === "benchBoost";
  const cards: LineupCardProps[] = data.lineup.map((p) => {
    // The portrait's tag: his news, or the coach's `×3` while Coach Diff is on.
    const tag = p.news ?? (p.times !== undefined ? times(p.times) : undefined);
    return {
      slot: p.slot,
      name: p.name,
      team: p.team,
      photo: photoOf(p.name),
      ...(p.plays && { plays: p.plays }),
      ...(p.mark && { mark: p.mark }),
      ...(tag && { news: tag }),
      next: versus(p.opponents),
    };
  });
  const benchCards: LineupCardProps[] = data.bench.map((p, i) => ({
    slot: p.role,
    strip: benchPlace(i + 1, p.role),
    name: p.name,
    team: p.team,
    photo: photoOf(p.name),
    next: versus(p.opponents),
  }));
  const title = lineupTitle(data.lineupWeek);
  return (
    <section className="home__object home__lineup" aria-label={title}>
      <div className="home__band">
        <h2 className="home__band-title">{title}</h2>
        {buff && <Tag>{buff.name}</Tag>}
      </div>
      <div className={cx("home__cards", boost && "home__cards--nine")}>
        {[...cards, ...(boost ? benchCards : [])].map((c) => (
          <LineupCard key={c.strip ?? c.slot} {...c} />
        ))}
      </div>
      {!boost && (
        <p className="home__bench">
          <span className="home__mid">{WORDS.bench}</span>
          {data.bench.map((p, i) => (
            <span key={p.name}>
              <span className="home__mid">{benchPlace(i + 1, p.role)}</span> <Who who={p} />
            </span>
          ))}
        </p>
      )}
    </section>
  );
}
