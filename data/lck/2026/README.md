# The LCK's 2026, for the simulated season

`oe-2026-lck.csv` is the LCK's rows (league `LCK`, 14 Jan to 13 Sep 2026: the Cup and Rounds 1 to 4) from
Oracle's Elixir's 2026 match data file, downloaded 12 Nov 2026, header kept and nothing else changed. Data by
[Oracle's Elixir](https://oracleselixir.com/tools/downloads).

The simulated season ([spec/10](../../../spec/10-season-and-gameweeks.md#the-road-to-launch),
[spec/15](../../../spec/15-beta-testing.md)) replays it, read by the same loaders as live data
(https://github.com/cBallGitWork/lck-fantasy/issues/399). Leaguepedia's 2026 pages (solo kills, steals) are not here
yet, so the sim scores from Oracle's Elixir alone: solo kills and steals are 0.

- `sim-plan.json`: the sim's stages (Rounds 1-2 and Road to MSI in Split 1, Legend and Rise and the playoffs in
  Split 2; the Cup left out), each with its settings and the file's split and playoffs columns it reads from, the
  deadline's 15 minutes and the replay's pace.
- `season-2026.json`: the season the plan and the rows make, one gameweek per LCK week. Made by
  `convex/world/simSeason.ts`, checked by its test: change the plan, then `npx vitest run convex/world/simSeason.test.ts -u`.
