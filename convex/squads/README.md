# convex/squads

A manager's entry: picks, lineup, captain, bench, auto-subs, transfers, buffs, prices.

- `squad.ts`: a squad's shape, `squadProblems` (spec/01).
- `budget.ts`: money, the budget check and the money bank after transfers (spec/02).
- `autoSubs.ts`: the line-up that scores, after auto-subs (spec/01).
- `carry.ts`: the Carry and Vice-carry, and each slot's points with the multiplier (spec/04).
- `transfers.ts`: free transfers, their bank, hits, unlimited and locked windows, top-ups (spec/03).
- `splitBreak.ts`: the raise coming off at Split 2, and Flol's fix of a squad still over (spec/03).
- `buffs.ts`: buffs as data, when one may be played, and the four effects (spec/06).
- `fixtures.ts`: test picks and settings, shared by this folder's tests.
