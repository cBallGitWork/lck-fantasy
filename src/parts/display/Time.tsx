import "./Time.css";

/** A times column's head. */
export const YOUR_TIME = "Your time";

/** The note under times drawn yours first, then KST. */
export const TIME_NOTE = "your time · KST";

/** A time: yours first, then KST in mid grey (`Sat 22:00  07:00 KST`). */
export function Time({ local, kst }: { local: string; kst: string }) {
  return (
    <span className="time num">
      {local} <span className="time__kst quiet">{kst} KST</span>
    </span>
  );
}
