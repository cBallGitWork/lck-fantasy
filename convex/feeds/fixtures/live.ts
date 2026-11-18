// LYON v Gen.G, Worlds 2026 Swiss, 25 Oct 2026, game 1 (live feed game 115660540726095042;
// Oracle's Elixir LOLTMNT02_482793): five 10-second windows saved from Riot's live feed on
// 14 Nov 2026. The game started at 20:59:40 UTC; first blood at 21:09:01; it ended at 21:35.
import start from "./live/w-205940.json";
import beforeFirstBlood from "./live/w-210850.json";
import firstBlood from "./live/w-210900.json";
import at15 from "./live/w-211440.json";
import end from "./live/w-213520-end.json";
import { parseLiveWindow } from "../liveFeed";

export const LIVE_WINDOWS = {
  start: parseLiveWindow(start),
  beforeFirstBlood: parseLiveWindow(beforeFirstBlood),
  firstBlood: parseLiveWindow(firstBlood),
  at15: parseLiveWindow(at15),
  end: parseLiveWindow(end),
};
export const LYON = "99566405941863385";
export const GEN = "100205573495116443";
/** Participant ids: LYON 1–5, Gen.G 6–10, top to support. */
export const KIIN = 6;
export const DHOKLA = 1;
