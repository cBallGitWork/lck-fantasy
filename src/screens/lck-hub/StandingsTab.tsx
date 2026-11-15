import { TEAMS } from "../../fixtures/week3";
import { cx, Table, type Column } from "../../parts";
import type { StandingsGroup, StandingsRow } from "./types";
import { SectionTitle } from "./Week";

const MINUS = "−";
const NO_GAMES = "—";

/** `+7`, `0`, `−1`. */
export const signed = (n: number) => (n > 0 ? `+${n}` : n < 0 ? `${MINUS}${-n}` : "0");

/** `67%`; a team yet to play shows a dash. */
export const winPct = ({ won, lost }: Pick<StandingsRow, "won" | "lost">) =>
  won + lost === 0 ? NO_GAMES : `${Math.round((won / (won + lost)) * 100)}%`;

const columns = (group: StandingsGroup): Column<StandingsRow>[] => [
  { key: "rank", head: "", width: "row", cell: (r) => <span className="lck-hub__rank num">{group.rows.indexOf(r) + 1}</span> },
  {
    key: "team",
    head: "Team",
    cell: (r) => (
      <>
        <b className="lck-hub__code num">{r.team}</b> <small className="lck-hub__team-name">{TEAMS[r.team]}</small>
      </>
    ),
  },
  { key: "w", head: "W", figure: true, cell: (r) => r.won },
  { key: "l", head: "L", figure: true, cell: (r) => r.lost },
  { key: "sw", head: "Sets W", figure: true, cell: (r) => r.setsWon },
  { key: "sl", head: "Sets L", figure: true, cell: (r) => r.setsLost },
  { key: "diff", head: "+/−", figure: true, cell: (r) => signed(r.setsWon - r.setsLost) },
  { key: "pct", head: "Win %", figure: true, cell: winPct },
  {
    key: "last5",
    head: "Last 5",
    figure: true,
    cell: (r) =>
      r.last5.map((result, i) => (
        <span key={i} className={cx("lck-hub__form", result === "L" && "lck-hub__form--lost")}>
          {result}
        </span>
      )),
  },
];

/** Standings: one table per group, in the group's order. */
export function Standings({ groups }: { groups: StandingsGroup[] }) {
  return (
    <div className="lck-hub__groups">
      {groups.map((g) => (
        <section key={g.name}>
          <SectionTitle note={<span lang="ko">{g.hangul}</span>}>{g.name}</SectionTitle>
          <div className="lck-hub__standings">
            <Table columns={columns(g)} rows={g.rows} rowKey={(r) => r.team} label={g.name} />
          </div>
        </section>
      ))}
    </div>
  );
}
