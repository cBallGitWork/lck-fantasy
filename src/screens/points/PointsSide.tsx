import { Hint, HINTS, LinkGo, MeDot, pct, RankMove, SideSection } from "../../parts";
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

/** Each league's rank and its move, the points to your next Overall tier, All leagues. */
export function Leagues({ leagues, nextTier }: Pick<PointsData, "leagues" | "nextTier">) {
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
                  <Hint line={HINTS.tier}>{l.tier}</Hint>
                </>
              )}
            </span>
            <b className="points__rank-place num">{l.rank}</b>
            <RankMove move={l.move} />
          </div>
        ))}
      </div>
      <p className="points__tier quiet">
        <b>{toTier(nextTier.points)}</b> {WORDS.to} <Hint line={HINTS.tier}>{nextTier.tier}</Hint>
      </p>
      <LinkGo go={{ to: PATHS.leagues }}>{WORDS.allLeagues}</LinkGo>
    </SideSection>
  );
}
