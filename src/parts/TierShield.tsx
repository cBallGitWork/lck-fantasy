/**
 * Overall's tier as a shield with its division on it (spec/08): Flol's own shape, not Riot's art.
 * The page sizes and colours it through `className`, and its `-body`, `-band` and `-division`.
 */
export function TierShield({ division, className }: { division: string; className: string }) {
  return (
    <svg className={className} viewBox="0 0 40 46" aria-hidden="true">
      <path className={`${className}-body`} d="M20 4 L35 9 V24 C35 33 28 39 20 42 C12 39 5 33 5 24 V9 Z" />
      <path className={`${className}-band`} d="M5 15 H35" />
      <text className={`${className}-division`} x="20" y="31" textAnchor="middle">
        {division}
      </text>
    </svg>
  );
}
