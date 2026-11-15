import "./Time.css";

/** A time: yours first, then KST in mid grey (`Sat 22:00  07:00 KST`). */
export function Time({ local, kst }: { local: string; kst: string }) {
  return (
    <span className="time num">
      {local} <span className="time__kst">{kst} KST</span>
    </span>
  );
}
