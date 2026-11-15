import { cx, GoLink, MainAction, OutlinedKey } from "../../parts";
import { PATHS } from "../../paths";
import { figure, ordinal } from "./format";
import { Move } from "./Standings";
import type { LeagueSummary } from "./types";

const SECTIONS = [
  ["general", "General"],
  ["private", "Private"],
] as const;

/**
 * Every league you're in: general (Overall, your country, your team), then private, each with your
 * rank and its move; the open one marked. Create and Join below.
 */
export function LeagueList({ leagues, openId, onCreate, onJoin }: { leagues: LeagueSummary[]; openId: string; onCreate: () => void; onJoin: () => void }) {
  return (
    <nav className="leagues__list" aria-label="Your leagues">
      {SECTIONS.map(([kind, title]) => (
        <section key={kind}>
          <h2 className="leagues__list-title">{title}</h2>
          {leagues
            .filter((league) => league.kind === kind)
            .map((league) => (
              <GoLink
                key={league.id}
                go={{ to: PATHS.league, params: { leagueId: league.id } }}
                className={cx("leagues__list-row", league.id === openId && "leagues__list-row--on")}
                current={league.id === openId}
              >
                <span>{league.name}</span>
                <b className="num">{kind === "private" ? ordinal(league.rank) : figure(league.rank)}</b>
                <span className="leagues__list-move">
                  <Move move={league.move} />
                </span>
                <small>{kind === "private" ? `${figure(league.size)} managers` : `of ${figure(league.size)}`}</small>
              </GoLink>
            ))}
        </section>
      ))}
      <div className="leagues__list-actions">
        <MainAction onClick={onCreate}>Create a league</MainAction>
        <OutlinedKey onClick={onJoin}>Join a league</OutlinedKey>
      </div>
    </nav>
  );
}
