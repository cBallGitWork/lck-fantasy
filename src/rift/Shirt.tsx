import { cx } from "../parts";
import "./Shirt.css";

/** A plain shirt, with the team's code on its chest when given. Kit colours come with the reskin. */
export function Shirt({ team, small }: { team?: string; small?: boolean }) {
  return (
    <span className={cx("shirt", small && "shirt--small")}>
      <svg className="shirt__svg" viewBox="0 0 56 50" aria-hidden="true">
        <path className="shirt__body" d="M18 2 L8 6 L1 16 L9 22 L12 19 L12 48 L44 48 L44 19 L47 22 L55 16 L48 6 L38 2 Q28 9 18 2 Z" />
        <path className="shirt__collar" d="M18 2 Q28 9 38 2" />
      </svg>
      {team && <span className="shirt__code">{team}</span>}
    </span>
  );
}
