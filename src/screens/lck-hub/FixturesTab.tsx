import type { TeamCode } from "../../fixtures/week3";
import { TeamBar, GoLink, NONE } from "../../parts";
import { seriesGo } from "../../paths";
import type { HubWeek } from "./types";
import { ByDay, WeekTitle } from "./Week";

/**
 * Fixtures: one week by day. Each series, centred as FPL's and UCL Fantasy's (Craig, 24 Nov 2026): each team's
 * record and code either side of your time, blue side left, then `›`; the whole row opens the Series page.
 */
export function Fixtures({
  week,
  bestOf,
  records,
  onPrev,
  onNext,
}: {
  week: HubWeek;
  bestOf: number;
  /** Each team's series won and lost, `5–1`. */
  records: Partial<Record<TeamCode, string>>;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const record = (team: TeamCode) => <small className="lck-hub__record quiet num">{records[team] ?? NONE}</small>;
  return (
    <section>
      <WeekTitle week={week} bestOf={bestOf} onPrev={onPrev} onNext={onNext} />
      <ByDay
        series={week.series}
        row={(s) => (
          <GoLink key={s.id} className="lck-hub__series" go={seriesGo(s.id)}>
            <span className="lck-hub__home">
              {record(s.home)}
              <b className="lck-hub__code num">{s.home}</b>
              <TeamBar team={s.home} />
            </span>
            <span className="lck-hub__time num">{s.local}</span>
            <span className="lck-hub__away">
              <TeamBar team={s.away} />
              <b className="lck-hub__code num">{s.away}</b>
              {record(s.away)}
            </span>
            <span className="lck-hub__go">›</span>
          </GoLink>
        )}
      />
    </section>
  );
}
