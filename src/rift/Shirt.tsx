import { cx, kitUrl } from "../parts";
import "./Shirt.css";

/**
 * A shirt. `kit`: the team's own kit, as a Rift tile wears it, its code on the tile's plate, or the plain
 * shirt where no kit is drawn for the team. Without `kit`, the plain shirt with the team's code on its chest.
 */
export function Shirt({ team, small, kit }: { team?: string; small?: boolean; kit?: boolean }) {
  const url = kit && team ? kitUrl(team) : undefined;
  if (url) return <img className="shirt shirt--kit" src={url} alt="" />;
  return (
    <span className={cx("shirt", small && "shirt--small")}>
      <svg className="shirt__svg" viewBox="0 0 56 50" aria-hidden="true">
        <path className="shirt__body" d="M18 2 L8 6 L1 16 L9 22 L12 19 L12 48 L44 48 L44 19 L47 22 L55 16 L48 6 L38 2 Q28 9 18 2 Z" />
        <path className="shirt__collar" d="M18 2 Q28 9 38 2" />
      </svg>
      {team && !kit && <span className="shirt__code">{team}</span>}
    </span>
  );
}
