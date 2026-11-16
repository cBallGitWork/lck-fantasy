import { count, cx, GoLink, MainAction, ordinal, OutlinedKey, plural, RankMove, SectionHead } from "../../parts";
import { leagueGo } from "../../paths";
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
          <SectionHead className="leagues__list-title">{title}</SectionHead>
          {leagues
            .filter((league) => league.kind === kind)
            .map((league) => (
              <GoLink
                key={league.id}
                go={leagueGo(league.id)}
                className={cx("leagues__list-row", league.id === openId && "leagues__list-row--on")}
                current={league.id === openId}
              >
                <span>{league.name}</span>
                <b className="num">{kind === "private" ? ordinal(league.rank) : count(league.rank)}</b>
                <span className="leagues__list-move">
                  <RankMove move={league.move} />
                </span>
                <small>{kind === "private" ? plural(league.size, "manager") : `of ${count(league.size)}`}</small>
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
