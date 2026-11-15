import { Table } from "../../parts";
import type { ChampionRow } from "./card";
import { oneDecimal, score } from "./format";

/** Champions: each champion, most games first, with W–L and average points. */
export function Champions({ rows }: { rows: ChampionRow[] }) {
  const byGames = [...rows].sort((a, b) => b.games - a.games);
  return (
    <div className="player-card__champions">
      <Table
        label="Champions"
        rows={byGames}
        rowKey={(r) => r.champion}
        columns={[
          { key: "champion", head: "Champion", cell: (r) => r.champion },
          { key: "games", head: "Games", figure: true, cell: (r) => r.games },
          { key: "record", head: "W–L", figure: true, cell: (r) => <span className="player-card__quiet">{score([r.wins, r.losses])}</span> },
          { key: "average", head: "Avg pts", figure: true, cell: (r) => <b>{oneDecimal(r.average)}</b> },
        ]}
      />
    </div>
  );
}
