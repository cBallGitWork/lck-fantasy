import { measureVar, type MeasureKey } from "../../theme/tokens";
import { cx } from "../util/cx";
import "./Crest.css";

/** Each team's crest, held as data per competition (`data/lck/crests/<code>.svg`), keyed by team code. */
const CRESTS: Record<string, string> = Object.fromEntries(
  Object.entries(import.meta.glob<string>("../../../data/lck/crests/*.svg", { eager: true, query: "?url", import: "default" })).map(
    ([path, url]) => [path.match(/([^/]+)\.svg$/)?.[1] ?? path, url],
  ),
);

/**
 * A team's crest at a theme measure (docs/design/approved/crests/); a dashed round box with its code where none is drawn yet.
 * `beside` is a crest next to its team's code in a line of text: it sits in the line, and a screen reader skips it, as the code says the team.
 */
export function Crest({ team, size = "crest", beside = false }: { team: string; size?: MeasureKey; beside?: boolean }) {
  const box = { width: measureVar(size), height: measureVar(size) };
  const url = CRESTS[team];
  return url ? (
    <img className={cx("crest", beside && "crest--beside")} src={url} alt={beside ? "" : `${team} crest`} style={box} />
  ) : (
    <span className={cx("crest", "crest--none quiet")} style={box}>
      {team}
    </span>
  );
}
