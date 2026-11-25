import { measureVar, type MeasureKey } from "../../theme/tokens";
import "./Kit.css";

/** Each team's kit, held as data per competition (`data/lck/shirts/<code>.svg`), keyed by team code. */
const KITS: Record<string, string> = Object.fromEntries(
  Object.entries(import.meta.glob<string>("../../../data/lck/shirts/*.svg", { eager: true, query: "?url", import: "default" })).map(
    ([path, url]) => [path.match(/([^/]+)\.svg$/)?.[1] ?? path, url],
  ),
);

/** A team's kit file, or nothing where none is drawn: the one home of the kits, for this part and the Rift's shirt. */
export const kitUrl = (team: string): string | undefined => KITS[team];

/** A team's kit beside its code, at a theme measure; unseen by a screen reader, as the code names the team. Nothing for a team with no kit. */
export function Kit({ team, size }: { team: string; size: MeasureKey }) {
  const url = kitUrl(team);
  return url ? <img className="kit" src={url} alt="" style={{ width: measureVar(size), height: measureVar(size) }} /> : null;
}
