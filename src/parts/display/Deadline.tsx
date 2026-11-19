import { WORDS } from "../words";
import "./Deadline.css";

/** The deadline, one way everywhere: `Deadline Wed 07:45  16:45` and the league's zone, and the countdown `9h 45m` where the page has one. */
export function Deadline({ local, kst, countdown }: { local: string; kst: string; countdown?: string }) {
  return (
    <span className="deadline">
      {WORDS.deadline} <b className="num">{local}</b>{" "}
      <span className="deadline__kst">
        {kst} {WORDS.zone}
      </span>
      {countdown && (
        <>
          {" "}
          <b className="deadline__count num">{countdown}</b>
        </>
      )}
    </span>
  );
}
