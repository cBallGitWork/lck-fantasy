import { bestOf, Table } from "../../parts";
import type { TeamCode } from "../../fixtures/week3";
import type { FixtureRow } from "./card";
import { WeekCell, weekStarts } from "./WeekCell";

/** Fixtures: his team's next series, each week's number once, your time and KST. */
export function FixturesTab({ team, rows }: { team: TeamCode; rows: FixtureRow[] }) {
  const starts = weekStarts(rows);
  return (
    <div className="player-card__fixtures">
      <Table
        label="Fixtures"
        rows={rows}
        rowKey={(r) => r.id}
        columns={[
          { key: "week", head: "Week", cell: (r) => <WeekCell week={r.week} starts={starts.has(r.id)} /> },
          {
            key: "series",
            head: "Series",
            cell: (r) => (
              <>
                {r.day} ·{" "}
                <b>
                  {team} v {r.opponent}
                </b>{" "}
                · {bestOf(r.bestOf)}
              </>
            ),
          },
          { key: "local", head: "Your time", figure: true, cell: (r) => r.local },
          { key: "kst", head: "KST", figure: true, cell: (r) => <span className="player-card__quiet quiet">{r.kst}</span> },
        ]}
      />
    </div>
  );
}
