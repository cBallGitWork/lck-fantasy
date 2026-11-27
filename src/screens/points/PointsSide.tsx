import { Hint, HINTS, LinkGo, MeDot, Panel, pct, RankMove, SeriesList, tierName, TierShield } from "../../parts";
import { PATHS } from "../../paths";
import type { PointsData, WeekPick } from "./types";
import { dot, PICK_WORDS, toTier, WORDS } from "./words";

/** Your week, below the series (approved/points/, What binds 9): Star, Flop and Killer, each with his points and who owns him; a dot marks yours. */
export function YourWeek({ picks }: { picks: WeekPick[] }) {
  return (
    <Panel title={WORDS.yourWeek} band className="points__side">
      <table className="points__picks">
        <thead>
          <tr>
            <th />
            <th />
            <th className="points__fig num">{WORDS.pts}</th>
            <th className="points__fig num">{WORDS.owned}</th>
          </tr>
        </thead>
        <tbody>
          {picks.map((p) => (
            <tr key={p.label}>
              <td className="quiet">{p.label === "Killer" ? <Hint line={HINTS.killer}>{PICK_WORDS[p.label]}</Hint> : PICK_WORDS[p.label]}</td>
              <td>
                <b>{p.name}</b>
                {p.mine && <MeDot />}
              </td>
              <td className="points__fig num">
                <b>{p.points}</b>
              </td>
              <td className="points__owned num quiet">{pct(p.ownedPct)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

/** The side column's first panel (What binds 7): each league's rank and its move; the points to your next Overall tier (at Challenger, your room over Grandmaster), All leagues ›. */
export function Leagues({ leagues, tierLine }: Pick<PointsData, "leagues" | "tierLine">) {
  return (
    <Panel title={WORDS.leagues} band className="points__side">
      <table className="points__ranks">
        <tbody>
          {leagues.map((l) => (
            <tr key={l.name}>
              <td>
                {l.tier && <TierShield className="points__shield" unranked={l.tier.tier === "unranked"} />}
                {l.name}
                {l.tier && (
                  <>
                    {dot}
                    <Hint line={HINTS.tier}>{tierName(l.tier)}</Hint>
                  </>
                )}
              </td>
              <td className="points__fig num">
                <b>{l.rank}</b>
              </td>
              <td className="points__move num">
                <RankMove move={l.move} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="points__leagues-foot">
        {tierLine ? (
          <span className="points__tier">
            <b className="points__fig num">{toTier(tierLine.points)}</b>{" "}
            <span className="quiet">
              {tierLine.to === "promote" ? WORDS.to : WORDS.clearOf} <Hint line={HINTS.tier}>{tierName(tierLine.tier)}</Hint>
            </span>
          </span>
        ) : (
          <span />
        )}
        <LinkGo go={{ to: PATHS.leagues }}>{WORDS.allLeagues}</LinkGo>
      </div>
    </Panel>
  );
}

/** This week's series (What binds 8): each with both teams' bars, its result, `Live` with the score, or its time. */
export function WeekSeries({ series }: Pick<PointsData, "series">) {
  return (
    <Panel title={WORDS.seriesTitle} band className="points__side points__series">
      <SeriesList series={series} ruled />
    </Panel>
  );
}
