import { bestOf, Table, YOUR_TIME } from "../../parts";
import type { TeamCode } from "../../fixtures/week3";
import type { FixtureRow } from "./card";
import { WeekCell, weekStarts } from "./WeekCell";
import { dot, WORDS } from "./words";

/** Fixtures: his team's next series, each week's number once, and your time. */
export function FixturesTab({ team, rows }: { team: TeamCode; rows: FixtureRow[] }) {
  const starts = weekStarts(rows);
  return (
    <div className="player-card__fixtures">
      <Table
        label={WORDS.fixtures}
        rows={rows}
        rowKey={(r) => r.id}
        columns={[
          { key: "week", head: WORDS.week, cell: (r) => <WeekCell week={r.week} starts={starts.has(r.id)} /> },
          {
            key: "series",
            head: WORDS.series,
            cell: (r) => (
              <>
                {r.day}
                {dot}
                <b>
                  {team} {WORDS.versus} {r.opponent}
                </b>
                {dot}
                {bestOf(r.bestOf)}
              </>
            ),
          },
          { key: "local", head: YOUR_TIME, figure: true, cell: (r) => r.local },
        ]}
      />
    </div>
  );
}
