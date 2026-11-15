# src/fixtures

Made-up data the screens are built on until the backend wires real data.

Only data two or more screens share lives here. A screen's own made-up data goes in its folder (`src/screens/<name>/fixtures.ts`), so screens built side by side never edit the same file.

- `week3.ts`: the LCK Cup Week 3 the approved pictures share: teams, the series at Points' moment and final, Week 4's fixtures and deadline, the team cap and hit, the sample manager Baron Steal FC, and the squads, prices and points of the Points, Pick Team, Stats and Perfect game pictures.
- `series.ts`: a series by its id, a team's series, its opponent, a series read from one team's side, and the `v KT · v GEN` line.
- `rosters.ts`: the LCK teams' rosters in role order with hangul (`ROSTERS`, `hangulOf`), and T1's prices.
