# Season and gameweeks

Craig's answers only, from the `/grill` of 11 Nov 2026. Where this file is silent the rule is
FPL's, or FPL's logic ([SPEC.md](../SPEC.md), the base assumption). Open questions are in
[docs/to-grill.md](../docs/to-grill.md).

## The season

- The LCK Cup 2027 is played as a closed test, beside the LEC's Winter split (Craig, 18 Nov
  2026: "a good test of 2 regions at same time"); it was dropped on 16 Nov 2026.
- The real test is the main season's knockouts: Road to MSI and the LCK playoffs.
- The main game splits into Split 1 and Split 2, and buffs reset at the split, the way FPL's chips
  reset at GW19.
- Road to MSI counts in Split 1's table.

## The road to launch

Craig, 18 Nov 2026.

1. **A simulated season** on its own copy of the site, which can be wiped and rerun, never
   touching the real game's data.
   - It replays the LCK's whole 2026 season under 2027's format: Split 1 with Road to MSI, Split 2
     with Legend and Rise, the playoffs. Buffs reset at the split and prices refresh.
   - Prices come from the approved formula ([spec/02](02-prices-and-budget.md)) run on 2025's
     data, as if 2026 were starting.
   - Time moves like a Championship Manager save: an admin's **Next day** plays one match day
     and its deadline when it comes; a week runs over several presses, so points and tables are
     seen updating mid-week. **Play to end** runs the rest without stopping.
   - Each game replays its 2026 timeline through the live-points path at speed, about a minute a
     game, so points tick live, then turn final.
   - It is played by 1,000 test managers and Craig. Test managers have mixed styles (chases form,
     loyal to one team, the cheap stars, close to random); each makes transfers, takes the odd
     −6, picks a Captain and plays buffs.
   - It is done when it runs a whole season with no errors or alerts left open, every week's
     points match the backtest's own scorer re-derived for every test manager, and Craig says the
     weekly loop feels right.
2. **Two closed tests from mid-January 2027**, two regions at once: the LEC's Winter split (from
   15 Jan) and the LCK Cup. Live data and live points from day one. Up to 50 people Craig
   invites, each by a personal link, and 1,000 test managers play; sign-up is closed to everyone
   else. Some play both regions, some one each. The cap of 50 is a setting.
3. **Public launch in spring**, if the tests go well: the LEC's Spring split and the LCK's Split
   1 open together, the site open 3 weeks before spring starts. January is too soon: opening 3
   weeks before 15 Jan would mean promoting over Christmas.

## Stages and their settings

- Each stage (groups, Road to MSI, play-in, playoffs) has its own rule settings, held as data per
  competition, never in code:
  - how a gameweek is grouped;
  - how a player's series in one gameweek count;
  - the budget, on or off;
  - the cap on players from one team;
  - transfers;
  - which buffs can be played.
- The values are set when the 2027 fixture dates come out, not before.
- A setting changes only before a gameweek's deadline. Each gameweek keeps the settings it ran
  under, so a closed gameweek's points never move.

## Gameweeks

- By default a gameweek is one LCK week.
- Its deadline is 15 minutes before its first series.

## Knockouts

Knockouts run in the same game, on the same tables. Settled at the `/grill` of 13 Nov 2026, with
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
