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

Knockouts run in the same game, on the same leaderboard. Craig's intent for them, with the values
set per stage:

- the budget is lifted, since it exists to stop a squad of only the top players;
- the cap on players from one team rises as teams drop out;
- transfers are unlimited, with no hits;
- every series a player plays counts.
