# convex/leagues

Global, supporter and private leagues, and their tables.

- `tables.ts`: season and split tables, FPL's tie-break, rank movement, Legend and Rise (spec/08).
- `tiers.ts`: Overall tiers, Iron to Challenger from the Overall season rank and the competition's cut-offs, the points to promote or to avoid demotion, and the season's final tiers.
- `membership.ts`: the three leagues every manager joins, the favourite-team lock, the private league cap, and who may rename, remove, delete or leave.
- `store.ts`: leagues stored: the three every manager joins, and private leagues made, joined, renamed, left and deleted. `store.setup.ts` is its test world.
- `fixtures.ts`: spec/08's starting tier cut-offs, for tests only. The live cut-offs are data.
