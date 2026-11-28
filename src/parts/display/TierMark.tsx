import type { Tier } from "../../../convex/leagues/tiers";
import { count } from "../text/figures";
import { cx } from "../util/cx";
import { HINTS, tierHangul, tierName } from "../words";
import { Hint } from "./Hint";
import { RankMove } from "./Move";
import { TierShield } from "./TierShield";
import "./TierMark.css";

/** A manager's place on Overall: the tier the tier function gives, the rank and its move. Unranked has no rank. */
export interface Standing {
  tier: Tier;
  rank: number | null;
  /** Places moved: up positive, down negative. */
  move: number | null;
}

/**
 * Overall's tier by a team name (spec/08, Home's picture), one mark on every screen that shows it: the shield,
 * the tier and its hangul, the rank and its move beneath. Unranked is the outlined shield and its word alone.
 */
export function TierMark({ standing, className }: { standing: Standing; className?: string }) {
  const { tier, rank, move } = standing;
  const unranked = tier.tier === "unranked";
  const hangul = tierHangul(tier);
  return (
    <div className={cx("tier-mark", className)}>
      <TierShield tier={tier.tier} className="tier-mark__shield" />
      <div>
        <div className="tier-mark__name">
          <Hint line={HINTS.tier}>{tierName(tier)}</Hint>
          {hangul && (
            <span className="tier-mark__hangul quiet" lang="ko">
              {hangul}
            </span>
          )}
        </div>
        {!unranked && rank !== null && (
          <div className="tier-mark__rank">
            <b className="num">{count(rank)}</b>
            <RankMove move={move} />
          </div>
        )}
      </div>
    </div>
  );
}

/** A table's tier (spec/08, the Overall table): the small shield and the short name, `Emerald I`. */
export function TierTag({ tier }: { tier: Tier }) {
  return (
    <span className="tier-tag">
      <TierShield tier={tier.tier} className="tier-tag__shield" />
      {tierName(tier)}
    </span>
  );
}
