// One way to show a moment: in the manager's zone with its day, as the Time part draws it.

/** The zone the browser reports, or empty where it reports none. */
export const browserZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

/** An instant as the Time part shows it: in the manager's zone with its day (`Wed 07:45`). */
export function timeIn(instant: string, zone: string): { local: string } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: zone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(instant));
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  return { local: `${part("weekday")} ${part("hour")}:${part("minute")}` };
}
