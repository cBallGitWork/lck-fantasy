# convex/admin

Admin tools: corrections, moving a series, re-running a job.

- `alerts.ts`: admin alerts, each a stored row on the admin's list; the first of a match day also emails the admin (spec/11, Live).
- `clock.ts`: the one clock every server read and write takes its "now" from: real time on the real site, the stored moment on the sim (`FLOL_SIM=true`), which Next day and Play to end move (#398).
- `testManagers.ts`: a test manager's week, in one of four styles: his squad, transfers, Captain and buff, by the rules a manager's are (#400).
