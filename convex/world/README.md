# convex/world

The real world, for every region: competitions, seasons, stages, teams, players, contracts, series, games, lineups. Filled by feeds, corrected by an admin, never written by the game. A region's facts are its data folder, `data/<region>/`, never code here (#374).

- `season.ts`: a competition's season from its `data/<region>/` file (its settings, splits, gameweeks and prices), loaded again in place, and read back (`loadSeason`, `seasonOf`).
- `series.ts`: games grouped into series, and when a series turns final (spec/11, Final).
- `fixtures.ts`: test times: an hour, and spec/11's 3 hours to final.

`convex/feeds/load.ts` stores teams, players, series, games and lineups (`convex/schema.ts`).
