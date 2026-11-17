import { GoLink } from "../../parts";
import { PATHS } from "../../paths";
import { MarkBadge, RoleIcon } from "../../rift";
import type { SidePlayer, WeekPoints } from "./types";

/** Your week, or last week: the total with Average and Highest. */
export function WeekTotal({ week }: { week: WeekPoints }) {
  return (
    <div className="home__total">
      <b className="home__total-figure num">{week.points}</b>
      <span className="home__fig">
        Average <b className="num">{week.average}</b>
      </span>
      <GoLink className="home__fig home__fig--link" go={{ to: PATHS.perfectGame }}>
        Highest <b className="num">{week.highest}</b>
        <i>›</i>
      </GoLink>
    </div>
  );
}


/** A side list: role icon, name, C or V, team; a stat line; points. */
export function PlayerList({ players, label }: { players: SidePlayer[]; label: string }) {
  return (
    <ul className="home__players" aria-label={label}>
      {players.map((p) => (
        <li key={`${p.name}-${p.team}`} className="home__player">
          <span className="home__player-who">
            <RoleIcon role={p.role} className="home__role-icon" />
            {p.name}
            {p.mark && (
              <MarkBadge mark={p.mark} className="home__mark" />
            )}{" "}
            <span className="home__player-team">{p.team}</span>
          </span>
          <span className="home__player-stat">{p.stat}</span>
          <b className="home__player-points num">{p.points}</b>
        </li>
      ))}
    </ul>
  );
}
