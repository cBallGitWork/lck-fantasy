# convex/admin

Admin tools: corrections, moving a series, re-running a job.

- `clock.ts`: the one clock every server read and write takes its "now" from: real time on the real site, the stored moment on the sim (`FLOL_SIM=true`), which Next day and Play to end move (#398).
