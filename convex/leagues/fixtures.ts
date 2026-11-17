// Test fixtures for the leagues: spec/08's starting tier cut-offs as they stand (14 Nov 2026).
// The live values are the competition's data, never these.
import type { Division, TierCutoff, TierName } from "./tiers";

const divisions = (tier: TierName, tops: [number, number, number, number]): TierCutoff[] =>
  tops.map((topPercent, i) => ({ tier, division: (i + 1) as Division, topPercent }));

/** Top % of Overall, best first (spec/08, Overall tiers). */
export const SPEC_TIER_CUTOFFS: TierCutoff[] = [
  { tier: "challenger", division: null, topPercent: 0.02 },
  { tier: "grandmaster", division: null, topPercent: 0.06 },
  { tier: "master", division: null, topPercent: 0.7 },
  ...divisions("diamond", [1.5, 2.4, 3.3, 4.4]),
  ...divisions("emerald", [6.9, 9.6, 13, 16]),
  ...divisions("platinum", [20, 24, 29, 34]),
  ...divisions("gold", [39, 45, 51, 58]),
  ...divisions("silver", [62, 68, 73, 80]),
  ...divisions("bronze", [83, 87, 91, 96]),
  ...divisions("iron", [97, 98, 99, 100]),
];
