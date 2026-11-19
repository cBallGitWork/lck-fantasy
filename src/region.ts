// The region the app shows, read from its season's data (#374): its name, its address, its season's
// label, its time zone and its money. The LCK's, the one region until the region switcher (#375).

import season from "../data/lck/season-2027.json";

/** What a region is made from, as data/<region>/ holds it: its competition and its season's year. */
export type RegionSeason = {
  competition: { name: string; timeZone: string; timeZoneLabel: string; currency: string };
  year: number;
};

/** A region's name (`LCK`), its hub's address (`/lck`, #374), its season's label, as Overall's head
 *  names it (`LCK 2027`), its time zone and the short name its times are written with, and the sign its
 *  money is written with. */
export function regionOf({ competition: { name, timeZone, timeZoneLabel, currency }, year }: RegionSeason) {
  return { name, hub: `/${name.toLowerCase()}` as const, season: `${name} ${year}`, timeZone, timeZoneLabel, currency };
}

export const REGION = regionOf(season);
