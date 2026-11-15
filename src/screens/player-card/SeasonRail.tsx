import { perGame, signed, Table } from "../../parts";
import type { PlayerCardData } from "./card";

/** The Season panel, on every tab: each scoring line's total, per game and points. */
export function SeasonRail({ season }: { season: PlayerCardData["season"] }) {
  return (
    <aside className="player-card__rail">
      <h3 className="player-card__rail-head">
        Season <span className="player-card__quiet">{season.games} games</span>
      </h3>
      <Table
        label="Season"
        rows={season.lines}
        rowKey={(l) => l.line}
        columns={[
          { key: "line", head: "", cell: (l) => l.line },
          { key: "total", head: "Total", figure: true, cell: (l) => l.total },
          { key: "perGame", head: "Per game", figure: true, cell: (l) => <span className="player-card__quiet">{perGame(l.total, season.games)}</span> },
          { key: "points", head: "Pts", figure: true, cell: (l) => <b>{signed(l.points)}</b> },
        ]}
      />
    </aside>
  );
}
