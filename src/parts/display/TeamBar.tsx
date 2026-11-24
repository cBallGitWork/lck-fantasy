import teams from "../../../data/lck/teams.json";
import { contrast } from "../../theme/contrast";
import { color } from "../../theme/tokens";
import "./TeamBar.css";

/** The least contrast with the panel's ground at which a bar still shows: under it, a kit's next colour is tried. */
const SEEN = 2.5;

/** Each team's bar colour: the first of its kit's colours (body, pattern, collar) that shows on the ground. */
const BAR: Record<string, string> = Object.fromEntries(
  teams.teams.map((team) => [team.code, [team.primary, team.secondary, team.accent].find((kit) => contrast(kit, color.paper) >= SEEN) ?? color.text]),
);

/** A small bar of a team's own colour before its code, wherever a list names a team; unseen by a screen reader, as the code names the team. */
export function TeamBar({ team }: { team: string }) {
  const colour = BAR[team];
  return colour ? <i className="team-bar" style={{ background: colour }} aria-hidden="true" /> : null;
}
