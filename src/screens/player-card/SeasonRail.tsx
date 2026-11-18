import { perGame, signed, Table } from "../../parts";
import type { PlayerCardData } from "./card";
import { gamesCount, WORDS } from "./words";

/** The Season panel, on every tab: each scoring line's total, per game and points. */
export function SeasonRail({ season }: { season: PlayerCardData["season"] }) {
  return (
    <aside className="player-card__rail">
      <h3 className="player-card__rail-head">
        {WORDS.season} <span className="player-card__quiet quiet">{gamesCount(season.games)}</span>
      </h3>
      <Table
        label={WORDS.season}
        rows={season.lines}
        rowKey={(l) => l.line}
        columns={[
          { key: "line", head: "", cell: (l) => l.line },
          { key: "total", head: WORDS.total, figure: true, cell: (l) => l.total },
          { key: "perGame", head: WORDS.perGame, figure: true, cell: (l) => <span className="player-card__quiet quiet">{perGame(l.total, season.games)}</span> },
          { key: "points", head: WORDS.pts, figure: true, cell: (l) => <b>{signed(l.points)}</b> },
        ]}
      />
    </aside>
  );
}
