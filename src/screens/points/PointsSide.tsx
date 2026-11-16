import { LinkGo, MeDot, pct, RankMove, SideSection } from "../../parts";
import { PATHS } from "../../paths";
import type { PointsData, WeekPick } from "./types";

const owned = (p: WeekPick) => (p.mine ? `${p.points} · owned by ${pct(p.ownedPct)}` : `${p.points} · not owned · ${pct(p.ownedPct)}`);

/** Your Star, Flop and Killer, each with his points and who owns him. */
export function YourWeek({ picks }: { picks: WeekPick[] }) {
  return (
    <SideSection title="Your week">
      {picks.map((p) => (
        <div key={p.label} className="points__pick">
          <span className="points__pick-label quiet">{p.label}</span>
          <b>
            {p.name}
            {p.mine && <MeDot />}
          </b>
          <span className="points__pick-owned quiet">{owned(p)}</span>
        </div>
      ))}
    </SideSection>
  );
}

/** Each league's rank and its move, the points to your next Overall tier, All leagues. */
export function Leagues({ leagues, nextTier }: Pick<PointsData, "leagues" | "nextTier">) {
  return (
    <SideSection title="Leagues">
      <div className="points__ranks">
        {leagues.map((l) => (
          <div key={l.name} className="points__rank">
            <span>{l.name}</span>
            <b className="points__rank-place num">{l.rank}</b>
            <RankMove move={l.move} />
          </div>
        ))}
      </div>
      <p className="points__tier quiet">
        <b>≈{nextTier.points} pts</b> to {nextTier.tier}
      </p>
      <LinkGo go={{ to: PATHS.leagues }}>All leagues</LinkGo>
    </SideSection>
  );
}
