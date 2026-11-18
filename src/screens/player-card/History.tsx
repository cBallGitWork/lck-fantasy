import { money, perGame, result, sum, Table } from "../../parts";
import type { CardHistory, HistoryRow } from "./card";
import { WeekCell, weekStarts } from "./WeekCell";
import { dot, WORDS } from "./words";

/**
 * History: each series with games, K/D/A and points, each week's price and total once; then past LCK
 * seasons scored by Flol. `shown` is the rows the strip doesn't show; a week's total still counts them all.
 */
export function History({ history, shown }: { history: CardHistory; shown: HistoryRow[] }) {
  const starts = weekStarts(shown);
  const weekPoints = (week: number) => sum(history.rows.filter((r) => r.week === week).map((r) => r.points));
  const onStart = (r: HistoryRow, figure: string | number) => (starts.has(r.id) ? figure : null);
  return (
    <div className="player-card__history">
      <h3 className="player-card__section">{history.competition}</h3>
      <Table
        label={history.competition}
        rows={shown}
        rowKey={(r) => r.id}
        columns={[
          { key: "week", head: WORDS.week, cell: (r) => <WeekCell week={r.week} starts={starts.has(r.id)} /> },
          { key: "series", head: WORDS.series, cell: (r) => `${r.day}${dot}${result(r.score)} ${r.opponent}` },
          { key: "games", head: WORDS.games, figure: true, cell: (r) => r.games },
          { key: "kda", head: WORDS.kda, figure: true, cell: (r) => r.kda },
          { key: "price", head: WORDS.weekPrice, figure: true, cell: (r) => <span className="player-card__quiet quiet">{onStart(r, money(r.priceM))}</span> },
          { key: "points", head: WORDS.pts, figure: true, cell: (r) => <b>{r.points}</b> },
          { key: "weekPoints", head: WORDS.weekPts, figure: true, cell: (r) => <b>{onStart(r, weekPoints(r.week))}</b> },
        ]}
      />
      <h3 className="player-card__section">
        {WORDS.pastSeasons} <span className="player-card__quiet quiet">{WORDS.scoredBy}</span>
      </h3>
      <Table
        label={WORDS.pastSeasons}
        rows={history.pastSeasons}
        rowKey={(s) => s.name}
        columns={[
          { key: "season", head: WORDS.season, cell: (s) => s.name },
          { key: "gap", head: "", cell: () => null },
          { key: "games", head: WORDS.games, figure: true, cell: (s) => s.games },
          { key: "kda", head: WORDS.kda, figure: true, cell: (s) => s.kda },
          { key: "perGame", head: WORDS.perGame, figure: true, cell: (s) => <span className="player-card__quiet quiet">{perGame(s.points, s.games)}</span> },
          { key: "points", head: WORDS.pts, figure: true, cell: (s) => <b>{s.points}</b> },
          { key: "end", head: "", cell: () => null },
        ]}
      />
    </div>
  );
}
