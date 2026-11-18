# Buffs

Craig's answers only, from the `/grill`s of 12 and 13 Nov 2026. Where this file is silent the
rule is FPL's, or FPL's logic ([SPEC.md](../SPEC.md), the base assumption). Open questions are in
[docs/to-grill.md](../docs/to-grill.md).

## Buffs are data

- "we will have chips, undecided yet, but build the ability for us to make them" (Craig, 12 Nov
  2026).
- A buff is data: a name, one effect from a list the code offers, how many a manager gets each
  split, and which stages allow it ([spec/10](10-season-and-gameweeks.md)). Buffs reset at the
  split ([SPEC.md](../SPEC.md)).
- The effects:
  - the bench scores too (FPL's Bench Boost);
  - a second Captain for one gameweek, both scoring ×2 ([spec/04](04-captain.md));
  - the coach scores ×3 for one gameweek.
- A manager plays at most one buff a gameweek.
- No buff changes a limit (budget, team cap, squad) or the transfers (Craig, 17 Nov 2026).

## The buffs

| Buff | Effect | Like |
|---|---|---|
| Bench Boost | The bench scores too | FPL's Bench Boost |
| Double Captain | A second Captain for the gameweek; both score ×2 and wear C (Craig, 17 Nov 2026; Dual Carry before) | none |
| Coach Diff | The coach scores ×3 for the gameweek (Craig, 17 Nov 2026) | FPL's Triple Captain, on the coach |

Double Captain example: the Captain scores 12 and the second Captain 10, so they give 24 and 20,
not 18 and 10. Either one playing no game just scores nothing; nobody steps in. ×2, not the
Captain's ×1.5: a player scores about 6–7 a series and plays 2 a week, so ×1.5 added only about
6, a third of Bench Boost (Craig, 17 Nov 2026).

Coach Diff example: the coach scores 5 and 6 in the week's two series, so 33. A coach's points
ride on his team's results, so it can score little in a bad week, or −3 for a lone series loss.

Dropped (Craig, 17 Nov 2026):

- Limitless, FPL's Free Hit: a one-week free squad takes away the reason to plan transfers week
  by week.
- Remake, FPL's Wildcard: each split opens with fresh prices and unlimited transfers, gameweek 2
  gives 2 free and knockouts are unlimited ([spec/03](03-transfers.md)), and LoL rosters rarely
  change mid-split. Bench Boost is set up with those free rebuilds or with banked transfers.

## How many, and when

- The beta, Split 1, has all three, one of each (Craig, 16 Nov 2026; reworked 17 Nov).
- The main season gives one of each per split. One left unplayed when the split ends is lost.
- Every buff can be played in every stage, knockouts included.
