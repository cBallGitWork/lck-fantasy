# convex/admin

Admin tools: corrections, moving a series, re-running a job.

- `access.ts`: who may use the admin section: whoever has the admin password (`ADMIN_PASSWORD` on the deployment), until Convex Auth is wired.
- `alerts.ts`: admin alerts, each a stored row on the admin's list with its kind (`alertKinds.ts`), what it names, and open until an admin closes it; the first of a match day also emails the admin (spec/11, Live; #401).
- `backtestScorer.ts`: the backtest's scorer, a manager's week re-derived by code apart from the game's, for the check (#401).
- `seasonCheck.ts`: the sim's check: the game's week against the backtest's, each difference a points mismatch alert (#401).
- `priceSpread.ts` and `seasonReport.ts`: the end-of-season report on the Report tab: open alerts, mismatches, the price spread and moves (#401).
- `clock.ts`: the one clock every server read and write takes its "now" from: real time on the real site, the stored moment on the sim (`FLOL_SIM=true`), which Next day and Play to end move (#398).
- `sim.ts`: the admin's Sim page: the sim's date, and Next day and Play to end, each saying the series it played and the deadlines it passed (#398).
- `testManagers.ts`: a test manager's week, in one of four styles: his squad, transfers, Captain and buff, by the rules a manager's are (#400).
