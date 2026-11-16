/**
 * Overall's tier as a shield (spec/08): Flol's own shape, not Riot's art. It bears no text: the tier's
 * full name beside it says the division. The page sizes and colours it through `className`, and its `-body` and `-band`.
 */
export function TierShield({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 40 46" aria-hidden="true">
      <path className={`${className}-body`} d="M20 4 L35 9 V24 C35 33 28 39 20 42 C12 39 5 33 5 24 V9 Z" />
      <path className={`${className}-band`} d="M5 15 H35" />
    </svg>
  );
}
