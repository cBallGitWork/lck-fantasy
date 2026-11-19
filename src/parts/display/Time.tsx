import "./Time.css";

/** A time in the manager's own zone, with no label (`Sat 22:00`; Craig, 19 Nov 2026). */
export function Time({ local }: { local: string }) {
  return <span className="time num">{local}</span>;
}
