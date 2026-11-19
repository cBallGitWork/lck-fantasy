// One way to show a moment: in the manager's zone with its day, then in the league's zone, as the Time part draws it.
import { REGION } from "../../region";

/** The zone the browser reports, or empty where it reports none. */
export const browserZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

function clock(instant: string, zone: string, withDay: boolean): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: zone,
    weekday: withDay ? "short" : undefined,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(instant));
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  const time = `${part("hour")}:${part("minute")}`;
  return withDay ? `${part("weekday")} ${time}` : time;
}

/** An instant as the Time part shows it: in the manager's zone with its day (`Wed 07:45`), then in the
 *  league's zone, as its data holds it (`16:45`). */
export function timeIn(instant: string, zone: string): { local: string; kst: string } {
  return { local: clock(instant, zone, true), kst: clock(instant, REGION.timeZone, false) };
}
