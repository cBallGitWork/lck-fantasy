import type { Tier } from "../../../convex/leagues/tiers";
import { cx } from "../util/cx";
import "./TierShield.css";

/** A tier by its name alone, with no division: what a shield or a tier's colour needs. */
export type TierKind = Tier["tier"];

/** The class that sets a tier's ranked colour as `color` (`--tier-*`, plate.md, Colour); none for Unranked. */
export const tierInk = (tier: TierKind) => (tier === "unranked" ? undefined : `tier-ink--${tier}`);

/**
 * Overall's tier as a shield (spec/08): Flol's own shape, not Riot's art, drawn one way everywhere: filled in
 * its tier's ranked colour, or outlined in `--text` alone for Unranked (Craig, 27 and 28 Nov 2026). It bears no
 * text: the tier's full name beside it says the division. The page sizes it through `className`.
 */
export function TierShield({ tier, className }: { tier: TierKind; className: string }) {
  return (
    <svg className={cx("tier-shield", tier === "unranked" && "tier-shield--unranked", tierInk(tier), className)} viewBox="0 0 40 46" aria-hidden="true">
      <path className="tier-shield__body" d="M20 4 L35 9 V24 C35 33 28 39 20 42 C12 39 5 33 5 24 V9 Z" />
      <path className="tier-shield__band" d="M5 15 H35" />
    </svg>
  );
}
