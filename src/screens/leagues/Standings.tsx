import { Fragment } from "react";
import { count, GoLink, NONE, RankMove, Tag } from "../../parts";
import { PATHS } from "../../paths";
import { chaseText } from "./format";
import type { StandingRow, Standings as StandingsData } from "./types";

/** Rank, move, team, week, total and `›`; Carry and the split come and go. */
const ALWAYS_SHOWN_COLUMNS = 6;

/** A rank's move: ▲ or ▼ in `--text` and the places, or `—` when it held. */
export function Move({ move }: { move: number | null }) {
  if (move === null || move === 0) return <span className="leagues__nil quiet">{NONE}</span>;
  return <RankMove move={move} />;
}

/**
 * A league's table: rank, move, team and manager (your row on fill, with its chase tag), Carry once
 * the deadline has passed, the week's points, the split's on a group's table, the total, and `›` to the
 * manager's team. Runs of rows have a `⋯` between them: the top rows, then the rows round yours.
 */
export function Standings({ table, week, carryShown }: { table: StandingsData; week: number; carryShown: boolean }) {
  const columns = ALWAYS_SHOWN_COLUMNS + (carryShown ? 1 : 0) + (table.splitColumn ? 1 : 0);
  return (
    <table className="table leagues__table">
      <thead>
        <tr>
          <th className="leagues__rank-col">Rank</th>
          <th className="leagues__move-col" aria-label="Move" />
          <th>Team · Manager</th>
          {carryShown && <th className="leagues__carry-col">Carry</th>}
          <th className="leagues__figure">Week {week}</th>
          {table.splitColumn && <th className="leagues__figure">{table.splitColumn}</th>}
          <th className="leagues__figure">Total</th>
          <th className="leagues__go-col" aria-label="Open" />
        </tr>
      </thead>
      <tbody>
        {table.runs.map((run, i) => (
          <Fragment key={run[0]?.rank ?? i}>
            {i > 0 && (
              <tr className="leagues__gap">
                <td colSpan={columns}>⋯</td>
              </tr>
            )}
            {run.map((row) => (
              <Row key={row.rank} row={row} carryShown={carryShown} splitColumn={!!table.splitColumn} />
            ))}
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}

function Row({ row, carryShown, splitColumn }: { row: StandingRow; carryShown: boolean; splitColumn?: boolean }) {
  return (
    <tr className={row.mine ? "leagues__mine" : undefined}>
      <td className="leagues__rank num">{count(row.rank)}</td>
      <td className="leagues__move">
        <Move move={row.move} />
      </td>
      <td className="leagues__name" title={`${row.team} · ${row.manager}`}>
        {row.team}
        <small>{row.manager}</small>
        {row.chase && (
          <span className="leagues__chase">
            <Tag>{chaseText(row.chase)}</Tag>
          </span>
        )}
      </td>
      {carryShown && <td>{row.carry}</td>}
      <td className="leagues__figure num">{row.week}</td>
      {splitColumn && <td className="leagues__figure num">{row.split === undefined ? NONE : count(row.split)}</td>}
      <td className="leagues__figure num">{count(row.total)}</td>
      <td className="leagues__go">
        <GoLink go={{ to: PATHS.profile, params: { managerId: row.managerId } }} label={`Open ${row.team}`}>
          ›
        </GoLink>
      </td>
    </tr>
  );
}
