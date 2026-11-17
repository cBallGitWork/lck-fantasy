import { cx } from "../util/cx";
import "./TierShield.css";

/**
 * Overall's tier as a shield (spec/08): Flol's own shape, not Riot's art, drawn one way everywhere: filled and
 * outlined. It bears no text: the tier's full name beside it says the division. The page sizes it through `className`.
 */
export function TierShield({ className }: { className: string }) {
  return (
    <svg className={cx("tier-shield", className)} viewBox="0 0 40 46" aria-hidden="true">
      <path className="tier-shield__body" d="M20 4 L35 9 V24 C35 33 28 39 20 42 C12 39 5 33 5 24 V9 Z" />
      <path className="tier-shield__band" d="M5 15 H35" />
    </svg>
  );
}
