# convex/lck

The real world: competitions, seasons, stages, teams, players, contracts, series, games, lineups. Filled by feeds, corrected by an admin, never written by the game.

- `series.ts`: games grouped into series, and when a series turns final (spec/11, Final).
- `fixtures.ts`: test times: an hour, and spec/11's 3 hours to final.

`convex/feeds/load.ts` stores teams, players, series, games and lineups (`convex/schema.ts`).
