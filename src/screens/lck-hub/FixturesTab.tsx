import type { TeamCode } from "../../fixtures/week3";
import { Crest, GoLink, NONE } from "../../parts";
import { seriesGo } from "../../paths";
import type { HubWeek } from "./types";
import { ByDay, WeekTitle } from "./Week";
import { WORDS } from "./words";

/**
 * Fixtures: one week by day. Each series: your time, each team's record beside its code,
 * blue side left, then `›`; the whole row opens the Series page.
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
            <span className="num">{s.local}</span>
            <span className="lck-hub__home">
              {record(s.home)}
              <b className="lck-hub__code num">{s.home}</b>
              <Crest team={s.home} size="crestRow" beside />
            </span>
            <span className="lck-hub__versus">{WORDS.versus}</span>
            <span className="lck-hub__away">
              <Crest team={s.away} size="crestRow" beside />
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
