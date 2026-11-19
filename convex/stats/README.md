# convex/stats

Per-player stats for each game, as the feed sent them, plus the latest live reading.

- `gameStats.ts`: a game's settled stats in the shape the scoring reads, both sources joined.

- `live.ts`: a live game's provisional lines from its latest reading, as a live query.

`convex/feeds/load.ts` stores each game's settled stats; `convex/feeds/live.ts` stores the live reading.
