import type { PerfectPick, Series } from "../../fixtures/week3";
import type { SlotKey } from "../../rift";

/** One game in a starter's series, and whether it was one of the series' counted games (boxed). */
export interface PlayerGame {
  champion: string;
  won: boolean;
  points: number;
  counted: boolean;
}

/** A series a starter played this week: its id, his points from it, and its games where known. */
export interface PlayerSeries {
  id: string;
  points: number;
  games?: PlayerGame[];
}

/** A starter in the perfect game, with the id his card opens on and his week's series. */
export interface PerfectPlayer extends PerfectPick {
  id: string;
  series: PlayerSeries[];
}

/** What the page shows: the backend feeds this once it picks the best team. */
export interface PerfectGameData {
  /** `Split 1 · Week 3`. */
  week: string;
  final: boolean;
  average: number;
  highest: number;
  /** Your own points this week. */
  yours: number;
  /** The side column's series section: `Week 3 series`. */
  seriesTitle: string;
  players: PerfectPlayer[];
  series: Series[];
}

/** Which starter is tapped, and how a tap or ✕ reaches the page. */
export interface Selection {
  selected?: SlotKey;
  onSelect?: (slot: SlotKey | undefined) => void;
}
