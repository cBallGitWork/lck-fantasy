import { cx, GoLink, score } from "../../parts";
import type { HubWeek } from "./types";
import { ByDay, seriesGo, WeekTitle } from "./Week";

const team = (code: string, won: boolean) => <b className={cx("lck-hub__code", "num", !won && "lck-hub__loser")}>{code}</b>;

/** Results: one week by day; the winner bold, the loser in plain weight, then `›`; the whole row opens the Series page. */
export function Results({ week, bestOf, onPrev, onNext }: { week: HubWeek; bestOf: number; onPrev?: () => void; onNext?: () => void }) {
  return (
    <section>
      <WeekTitle week={week} bestOf={bestOf} onPrev={onPrev} onNext={onNext} />
      <ByDay
        series={week.series}
        row={(s) => {
          if (!s.score) throw new Error(`Result ${s.id} has no score`);
          const [home, away] = s.score;
          return (
            <GoLink key={s.id} className={cx("lck-hub__series", "lck-hub__series--result")} go={seriesGo(s)}>
              <span className="lck-hub__home">{team(s.home, home > away)}</span>
              <span className="lck-hub__score num">
                {score(s.score)}
              </span>
              <span>{team(s.away, away > home)}</span>
              <span className="lck-hub__go">›</span>
            </GoLink>
          );
        }}
      />
    </section>
  );
}
