import type { ReactNode } from "react";
import type { Series } from "../../fixtures/week3";
import { bestOf as bestOfLabel, SectionHead, WeekArrow } from "../../parts";
import { PATHS } from "../../paths";
import type { HubWeek } from "./types";

/** Every series row opens its Series page. */
export const seriesGo = (s: Series) => ({ to: PATHS.series, params: { seriesId: s.id } });

/** `‹ Week 4 ›  20–24 Jan · Bo3`: an arrow is off where there is no week that way. */
export function WeekTitle({ week, bestOf, onPrev, onNext }: { week: HubWeek; bestOf: number; onPrev?: () => void; onNext?: () => void }) {
  return (
    <SectionHead className="lck-hub__title" note={`${week.dates} · ${bestOfLabel(bestOf)}`}>
      <span className="lck-hub__week">
        <WeekArrow label="Week before" onStep={onPrev}>
          ‹
        </WeekArrow>
        {week.label}
        <WeekArrow label="Week after" onStep={onNext}>
          ›
        </WeekArrow>
      </span>
    </SectionHead>
  );
}

/** The week's series by day, in the order given: `Wed 20 Jan`, then that day's rows. */
export function ByDay({ series, row }: { series: readonly Series[]; row: (s: Series) => ReactNode }) {
  const days: { day: string; date: string; series: Series[] }[] = [];
  for (const s of series) {
    const last = days.at(-1);
    if (last?.date === s.date) last.series.push(s);
    else days.push({ day: s.day, date: s.date, series: [s] });
  }
  return (
    <>
      {days.map((d) => (
        <div key={d.date} className="lck-hub__day">
          <b className="lck-hub__day-name">
            {d.day}
            <small className="lck-hub__day-date">{d.date}</small>
          </b>
          <div>{d.series.map(row)}</div>
        </div>
      ))}
    </>
  );
}
