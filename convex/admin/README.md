# convex/admin

Admin tools: corrections, moving a series, re-running a job.

- `access.ts`: who may use the admin section: whoever has the admin password (`ADMIN_PASSWORD` on the deployment), until Convex Auth is wired.
- `alerts.ts`: admin alerts, each a stored row on the admin's list; the first of a match day also emails the admin (spec/11, Live).
- `clock.ts`: the one clock every server read and write takes its "now" from: real time on the real site, the stored moment on the sim (`FLOL_SIM=true`), which Next day and Play to end move (#398).
- `sim.ts`: the admin's Sim page: the sim's date, and Next day and Play to end, each saying the series it played and the deadlines it passed (#398).
- `testManagers.ts`: a test manager's week, in one of four styles: his squad, transfers, Captain and buff, by the rules a manager's are (#400).
- `testManagerRoll.ts`: who each test manager is, the same every run: his style, a made-up manager and team name, his country, his favourite team in each region, and which competitions a run gives him (#400).
- `testManagerStore.ts`: `addTestManagers` signs up a run's test managers, from data/testManagers.json's `sim` or `january` plan, through Save team's own store, a batch at a time (#400).
