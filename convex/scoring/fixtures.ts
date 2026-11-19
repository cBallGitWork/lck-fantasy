// Test fixtures for scoring: spec/05's tables as they stand (13 Nov 2026), and games cut from the
// 2025 Oracle's Elixir file. The live values are the competition's data, never these.
import type { CoachTable, PlayerGameStats, PlayerTable, TeamGameStats } from "./game";
import type { SeriesRules } from "./series";

export const SPEC_PLAYER_TABLE: PlayerTable = {
  kills: { on: true, per: { top: 2, support: 2, jungle: 3, mid: 3, bot: 3 }, max: 3 },
  assists: { on: true, per: 5, max: 3 },
  deaths: { on: true, per: { top: 3, jungle: 3, mid: 3, bot: 3, support: 4 }, max: 3 },
  goldLeadAt15: { on: true, points: 1, atMinutes: 15 },
  soloKill: { on: true, points: 1 },
  firstBlood: { on: true, points: 1 },
  deathless: { on: true, points: 1 },
  multikill: { on: true, points: { 4: 1, 5: 2 } },
  steal: { on: true, points: 1 },
};

export const SPEC_COACH_TABLE: CoachTable = {
  firstTower: { on: true, points: 1 },
  mostDrakes: { on: true, points: 1 },
  mostBarons: { on: true, points: 1 },
  mostElders: { on: true, points: 1 },
  quickWin: { on: true, points: 1, underMinutes: 25 },
};

export const SPEC_SERIES_RULES: SeriesRules = { bestGames: 2, coachSeriesWin: 3, coachSeriesLoss: -1 };

/** A player with nothing but the stats given. */
export function playerGame(stats: Partial<PlayerGameStats> & Pick<PlayerGameStats, "role">): PlayerGameStats {
  return {
    kills: 0, deaths: 0, assists: 0, goldDiffAt15: null, soloKills: 0,
    firstBlood: false, biggestMultikill: 0, steals: 0, ...stats,
  };
}

// LCK Cup, 15 Jan 2025, game LOLTMNT03_183532: HANJIN BRION beat DRX in 29:02 (1742 s). Solo
// kills and steals are 0, as its Leaguepedia page gives them.
export const OE_2025_BRION_DRX = {
  morgan: playerGame({ role: "top", kills: 5, deaths: 0, assists: 6, goldDiffAt15: 700 }),
  clozer: playerGame({ role: "mid", kills: 4, deaths: 0, assists: 7, goldDiffAt15: 1247, biggestMultikill: 2 }),
  hype: playerGame({ role: "bot", kills: 7, deaths: 0, assists: 8, goldDiffAt15: 848, biggestMultikill: 2 }),
  pollu: playerGame({ role: "support", kills: 0, deaths: 1, assists: 15, goldDiffAt15: 113 }),
  sponge: playerGame({ role: "jungle", kills: 0, deaths: 5, assists: 2, goldDiffAt15: -159 }),
  brion: {
    won: true, lengthSeconds: 1742, firstTower: true, drakes: 4, barons: 1, elders: 0,
    opponent: { drakes: 0, barons: 0, elders: 0 },
  } satisfies TeamGameStats,
};
