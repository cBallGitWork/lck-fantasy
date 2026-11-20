import { Hint, HINTS, LinkGo, MeDot, pct, RankMove, SideSection, tierName } from "../../parts";
import { PATHS } from "../../paths";
import type { PointsData, WeekPick } from "./types";
import { dot, ownedBy, PICK_WORDS, toTier, WORDS } from "./words";

/** Your Star, Flop and Killer, each with his points and who owns him. */
export function YourWeek({ picks }: { picks: WeekPick[] }) {
  return (
    <SideSection title={WORDS.yourWeek}>
      {picks.map((p) => (
        <div key={p.label} className="points__pick">
          <span className="points__pick-label">{p.label === "Killer" ? <Hint line={HINTS.killer}>{PICK_WORDS[p.label]}</Hint> : PICK_WORDS[p.label]}</span>
          <b>
            {p.name}
            {p.mine && <MeDot />}
          </b>
          <span className="points__pick-owned">{ownedBy(p.points, pct(p.ownedPct), p.mine)}</span>
        </div>
      ))}
    </SideSection>
  );
}

/** Each league's rank and its move, the points to your next Overall tier (at Challenger, your room over Grandmaster), All leagues. */
export function Leagues({ leagues, tierLine }: Pick<PointsData, "leagues" | "tierLine">) {
  return (
    <SideSection title={WORDS.leagues}>
      <div className="points__ranks">
        {leagues.map((l) => (
          <div key={l.name} className="points__rank">
            <span>
              {l.name}
              {l.tier && (
                <>
                  {dot}
                  <Hint line={HINTS.tier}>{tierName(l.tier)}</Hint>
                </>
              )}
            </span>
            <b className="points__rank-place num">{l.rank}</b>
            <RankMove move={l.move} />
          </div>
        ))}
      </div>
      {tierLine && (
        <p className="points__tier quiet">
          <b>{toTier(tierLine.points)}</b> {tierLine.to === "promote" ? WORDS.to : WORDS.clearOf} <Hint line={HINTS.tier}>{tierName(tierLine.tier)}</Hint>
        </p>
      )}
      <LinkGo go={{ to: PATHS.leagues }}>{WORDS.allLeagues}</LinkGo>
    </SideSection>
  );
}
