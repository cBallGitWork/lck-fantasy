// The region the app shows, read from its season's data (spec/15): its name, its address and its
// season's label. The LCK's, the one region until the region switcher (#375).

import season from "../data/lck/season-2027.json";

/** What a region's names are made from: its competition's name and its season's year, as data/<region>/ holds them. */
export type RegionSeason = { competition: { name: string }; year: number };

/** A region's name (`LCK`), its hub's address (`/lck`, spec/15) and its season's label, as Overall's head names it (`LCK 2027`). */
export function regionOf({ competition: { name }, year }: RegionSeason) {
  return { name, hub: `/${name.toLowerCase()}` as const, season: `${name} ${year}` };
}

export const REGION = regionOf(season);
