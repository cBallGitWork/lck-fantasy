# Season and gameweeks

Craig's answers only, from the `/grill` of 11 Nov 2026. Where this file is silent the rule is
FPL's, or FPL's logic ([SPEC.md](../SPEC.md), the base assumption). Open questions are in
[docs/to-grill.md](../docs/to-grill.md).

## The season

- The LCK Cup (January–March 2027) is a closed beta, a proof of concept. It scores every stage:
  groups, play-in and playoffs.
- The real test is the main season's knockouts: Road to MSI and the LCK playoffs.
- The main game splits into Split 1 and Split 2, and chips reset at the split, the way FPL's
  reset at GW19.
- Road to MSI counts in Split 1's leaderboard.

## Stages and their settings

- Each stage (groups, Road to MSI, play-in, playoffs) has its own rule settings, held as data per
  competition, never in code:
  - how a gameweek is grouped;
  - how a player's series in one gameweek count;
  - the budget, on or off;
  - the cap on players from one team;
  - transfers;
  - which chips can be played.
- The values are set when the 2027 fixture dates come out, not before.
- A setting changes only before a gameweek's deadline. Each gameweek keeps the settings it ran
  under, so a closed gameweek's points never move.

## Gameweeks

- By default a gameweek is one LCK week.
- Its deadline is 15 minutes before its first series.

## Knockouts

Knockouts run in the same game, on the same table. Settled at the `/grill` of 13 Nov 2026, with
each value held as a stage setting:

- A knockout gameweek is one LCK week, as in the regular season, with its deadline 15 minutes
  before that week's first series. It is never one bracket round.
- The cap on players from one team (the coach counts) is 2 in the regular season and 3 in the
  knockouts. Three is the most, since three teams of three fill all 9 slots. Example: in the
  final week, 3 T1, 3 Gen.G and 3 HLE is a legal squad.
- The budget stays in the knockouts but is raised, so a squad from the few good teams left is
  affordable ("Final 3 means all good teams", Craig). The amount is set when the 2027 prices are
  made.
- Transfers are unlimited, with no hits.
- Every series a player plays that week counts, each scoring its best 2 games
  ([spec/05](05-scoring.md)). Example: a team plays Bo5s on Wednesday and Saturday, so both
  count.
