import { oneDecimal, score, Table } from "../../parts";
import type { ChampionRow } from "./card";
import { WORDS } from "./words";

/** Champions: each champion, most games first, with W–L and average points. */
export function Champions({ rows }: { rows: ChampionRow[] }) {
  const byGames = [...rows].sort((a, b) => b.games - a.games);
  return (
    <div className="player-card__champions">
      <Table
        label={WORDS.champions}
        rows={byGames}
        rowKey={(r) => r.champion}
        columns={[
          { key: "champion", head: WORDS.champion, cell: (r) => r.champion },
          { key: "games", head: WORDS.games, figure: true, cell: (r) => r.games },
          { key: "record", head: WORDS.record, figure: true, cell: (r) => <span className="player-card__quiet quiet">{score([r.wins, r.losses])}</span> },
          { key: "average", head: WORDS.average, figure: true, cell: (r) => <b>{oneDecimal(r.average)}</b> },
        ]}
      />
    </div>
  );
}
