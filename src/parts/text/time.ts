// One way to show a moment: in the manager's zone with its day, as the Time part draws it.

/** The zone the browser reports, or empty where it reports none. */
export const browserZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

/**
 * A moment in a zone, the one format every screen prints: `Wed 7:45am`; with the date, `Wed 30 Dec 7:45am`;
 * with the date and no time, `Wed 30 Dec`. Times are am/pm, lower case, no space, no leading zero (Craig, 19 Nov 2026).
 */
export function momentIn(instant: string | number, zone: string, { date = false, time = true } = {}): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: zone,
    weekday: "short",
    day: date ? "numeric" : undefined,
    month: date ? "short" : undefined,
    hour: time ? "numeric" : undefined,
    minute: time ? "2-digit" : undefined,
    hourCycle: "h12",
  }).formatToParts(new Date(instant));
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  const day = date ? `${part("weekday")} ${part("day")} ${part("month")}` : part("weekday");
  return time ? `${day} ${part("hour")}:${part("minute")}${part("dayPeriod").toLowerCase()}` : day;
}

/** An instant as the Time part shows it: in the manager's zone with its day (`Wed 7:45am`). */
export function timeIn(instant: string, zone: string): { local: string } {
  return { local: momentIn(instant, zone) };
}
