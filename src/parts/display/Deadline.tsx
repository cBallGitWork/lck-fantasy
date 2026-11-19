import { WORDS } from "../words";
import "./Deadline.css";

/** The deadline, one way everywhere: `Deadline Wed 07:45` in the manager's own zone, and the countdown `9h 45m` where the page has one. */
export function Deadline({ local, countdown }: { local: string; countdown?: string }) {
  return (
    <span className="deadline">
      {WORDS.deadline} <b className="num">{local}</b>
      {countdown && (
        <>
          {" "}
          <b className="deadline__count num">{countdown}</b>
        </>
      )}
    </span>
  );
}
