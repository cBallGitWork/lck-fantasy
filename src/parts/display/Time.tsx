import { REGION } from "../../region";
import "./Time.css";

/** A times column's head. */
export const YOUR_TIME = "Your time";

/** The note under times drawn yours first, then the league's. */
export const TIME_NOTE = `your time · ${REGION.timeZoneLabel}`;

/** A time: yours first, then the league's in mid grey, its zone named as its data holds it (`Sat 22:00  07:00` and the zone). */
export function Time({ local, kst }: { local: string; kst: string }) {
  return (
    <span className="time num">
      {local} <span className="time__kst quiet">{`${kst} ${REGION.timeZoneLabel}`}</span>
    </span>
  );
}
