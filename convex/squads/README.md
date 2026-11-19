# convex/squads

A manager's entry: picks, lineup, Captain, bench, auto-subs, transfers, buffs, prices.

- `squad.ts`: a squad's shape, `squadProblems` (spec/01).
- `budget.ts`: money, the budget check and the money bank after transfers (spec/02).
- `autoSubs.ts`: the lineup that scores, after auto-subs (spec/01).
- `carry.ts`: the Captain, and each slot's points with the multiplier (spec/04).
- `transfers.ts`: free transfers, their bank, hits, netting buy-backs, undoing a confirm, unlimited and locked windows, top-ups (spec/03).
- `squadAfterTransfers.ts`: any role for any role while the squad keeps one of each, and Flol arranging it by role after (spec/03).
- `splitBreak.ts`: the raise coming off at Split 2, and Flol's fix of a squad still over (spec/03).
- `prices.ts`: first prices from the approved formula, and each deadline's move: transfers, then form, then low ownership, one step at most, above the floor (spec/02).
- `buffs.ts`: buffs as data, when one may be played, and the four effects (spec/06).
- `fixtures.ts`: test picks and settings, shared by every convex test and the guest squad's.
