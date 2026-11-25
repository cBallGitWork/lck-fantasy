import "./Time.css";

/** A time in the manager's own zone, with no label (`Sat 10:00pm`; Craig, 19 Nov 2026). */
export function Time({ local }: { local: string }) {
  return <span className="time num">{local}</span>;
}
