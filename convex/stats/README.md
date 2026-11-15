# convex/stats

Per-player stats for each game, as the feed sent them, plus the latest live reading.

- `gameStats.ts`: a game's settled stats in the shape the scoring reads, both sources joined.

`convex/feeds/load.ts` stores each game's settled stats; the live reading isn't built yet.
