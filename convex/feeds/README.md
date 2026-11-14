# convex/feeds

One adapter per stats source (Oracle's Elixir, Leaguepedia, the live feed). Each maps what the source sends into `convex/lck` and `convex/stats`, and keeps the raw payload.

- `oraclesElixir.ts`: the daily CSV into one record per game, each row kept (spec/11, Final).
- `leaguepedia.ts`: solo kills and steals from a game's match-v5 data, by participant id.
- `liveFeed.ts`: Riot's live feed windows folded into a running reading per game, provisional (spec/11, Live).
- `fixtures/`: BRION v DRX's rows cut from the 2025 file, a match-v5-shaped payload, and five live feed windows of LYON v Gen.G (Worlds 2026) for tests.

Fetching either source is `convex/outbound/`'s job and isn't built yet.
