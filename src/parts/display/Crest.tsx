import { measureVar, type MeasureKey } from "../../theme/tokens";
import { cx } from "../util/cx";
import "./Crest.css";

/** Each team's crest, held as data per competition (`data/lck/crests/<code>.svg`), keyed by team code. */
const CRESTS: Record<string, string> = Object.fromEntries(
  Object.entries(import.meta.glob<string>("../../../data/lck/crests/*.svg", { eager: true, query: "?url", import: "default" })).map(
    ([path, url]) => [path.match(/([^/]+)\.svg$/)?.[1] ?? path, url],
  ),
);

/** A team's crest at a theme measure (docs/design/approved/crests/); a dashed round box with its code where none is drawn yet. */
export function Crest({ team, size = "crest" }: { team: string; size?: MeasureKey }) {
  const box = { width: measureVar(size), height: measureVar(size) };
  const url = CRESTS[team];
  return url ? (
    <img className="crest" src={url} alt={`${team} crest`} style={box} />
  ) : (
    <span className={cx("crest", "crest--none")} style={box}>
      {team}
    </span>
  );
}
