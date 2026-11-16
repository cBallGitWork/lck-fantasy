import { eok, perGame, result, Table } from "../../parts";
import type { CardHistory, HistoryRow } from "./card";
import { WeekCell, weekStarts } from "./WeekCell";

/**
 * History: each series with games, K/D/A and points, each week's price and total once; then past LCK
 * seasons scored by Flol. `shown` is the rows the strip doesn't show; a week's total still counts them all.
 */
export function History({ history, shown }: { history: CardHistory; shown: HistoryRow[] }) {
  const starts = weekStarts(shown);
  const weekPoints = (week: number) => history.rows.filter((r) => r.week === week).reduce((sum, r) => sum + r.points, 0);
  const onStart = (r: HistoryRow, figure: string | number) => (starts.has(r.id) ? figure : null);
  return (
    <div className="player-card__history">
      <h3 className="player-card__section">{history.competition}</h3>
      <Table
        label={history.competition}
        rows={shown}
        rowKey={(r) => r.id}
        columns={[
          { key: "week", head: "Week", cell: (r) => <WeekCell week={r.week} starts={starts.has(r.id)} /> },
          { key: "series", head: "Series", cell: (r) => `${r.day} · ${result(r.score)} ${r.opponent}` },
          { key: "games", head: "Games", figure: true, cell: (r) => r.games },
          { key: "kda", head: "K / D / A", figure: true, cell: (r) => r.kda },
          { key: "price", head: "Price", figure: true, cell: (r) => <span className="player-card__quiet quiet">{onStart(r, eok(r.priceEok))}</span> },
          { key: "points", head: "Pts", figure: true, cell: (r) => <b>{r.points}</b> },
          { key: "weekPoints", head: "Week", figure: true, cell: (r) => <b>{onStart(r, weekPoints(r.week))}</b> },
        ]}
      />
      <h3 className="player-card__section">
        Past seasons <span className="player-card__quiet quiet">LCK, scored by Flol</span>
      </h3>
      <Table
        label="Past seasons"
        rows={history.pastSeasons}
        rowKey={(s) => s.name}
        columns={[
          { key: "season", head: "Season", cell: (s) => s.name },
          { key: "gap", head: "", cell: () => null },
          { key: "games", head: "Games", figure: true, cell: (s) => s.games },
          { key: "kda", head: "K / D / A", figure: true, cell: (s) => s.kda },
          { key: "perGame", head: "Per game", figure: true, cell: (s) => <span className="player-card__quiet quiet">{perGame(s.points, s.games)}</span> },
          { key: "points", head: "Pts", figure: true, cell: (s) => <b>{s.points}</b> },
          { key: "end", head: "", cell: () => null },
        ]}
      />
    </div>
  );
}
