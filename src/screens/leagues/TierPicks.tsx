import { BuffIcon, cx, NONE, Panel, pct, RowPlayer, Table, tierInk, tierName, TierShield, type Column } from "../../parts";
import type { TierPick } from "./types";
import { weekHead, WORDS } from "./words";

/**
 * Overall's panel of Captains and buffs by tier (spec/08; approved/leagues/1440-overall.png): a row a tier, Challenger down to
 * Iron, each with its most picked Captain and his share as a bar in the tier's colour, and its most played buff and its share,
 * which has no bar; a dash where nobody played one. Your tier's row filled. For the week in the Week column, once its deadline
 * has passed: the page hides it before then.
 */
export function TierPicks({ week, picks }: { week: number; picks: TierPick[] }) {
  return (
    <Panel title={WORDS.captainsAndBuffs} sub={weekHead(week)} band className="leagues__panel leagues__tiers">
      <Table columns={COLUMNS} rows={picks} rowKey={(p) => p.tier} selected={(p) => p.mine} label={WORDS.captainsAndBuffs} />
    </Panel>
  );
}

const COLUMNS: Column<TierPick>[] = [
  {
    key: "tier",
    head: WORDS.tier,
    width: "colTier",
    cell: (p) => (
      <span className="tier-tag">
        <TierShield tier={p.tier} className="tier-tag__shield" />
        {tierName({ tier: p.tier, division: null })}
      </span>
    ),
  },
  { key: "captain", head: WORDS.topCaptain, width: "colCaptain", cell: (p) => <RowPlayer team={p.captain.team} name={p.captain.name} /> },
  {
    key: "captainShare",
    head: WORDS.share,
    cell: (p) => (
      <span className="leagues__share">
        <span className="leagues__share-figure num">{pct(p.captainShare)}</span>
        <span className={cx("leagues__share-bar", tierInk(p.tier))}>
          <i style={{ width: pct(p.captainShare) }} />
        </span>
      </span>
    ),
  },
  {
    key: "buff",
    head: WORDS.topBuff,
    width: "colCaptain",
    cell: (p) =>
      p.buff ? (
        <span className="leagues__buff">
          <BuffIcon effect={p.buff.effect} className="leagues__buff-icon" />
          {p.buff.name}
        </span>
      ) : (
        NONE
      ),
  },
  { key: "buffShare", head: WORDS.share, figure: true, width: "colFigure", cell: (p) => (p.buff ? pct(p.buff.share) : "") },
];
