# Leagues

Craig's answers only, from chat on 11 Nov 2026 and the `/grill` of 13 Nov 2026. Where this file
is silent the rule is FPL's, or FPL's logic ([SPEC.md](../SPEC.md), the base assumption). Open
questions are in [docs/to-grill.md](../docs/to-grill.md).

## Leagues every manager joins

- Every manager is entered into three leagues automatically: Overall, their country's league and
  their favourite team's supporter league, as FPL does.
- The favourite team is required at sign-up: one of the competition's teams. Example: pick T1
  and you join the T1 league.
- A manager can change their favourite team any time until their first gameweek scores; after
  that it is fixed (Craig, 13 Nov 2026).
  Since no points have counted by then, a change only moves the manager to the new team's
  league; nothing carries over.
- The country is set at sign-up and fixed on the same rule ([spec/09](09-onboarding.md)).

## Tables

- Every league ranks on total points. There is no head-to-head scoring (see SPEC.md, Later).
- Every league has a table for the whole season and one for each split. Road to MSI counts in
  Split 1's table ([spec/10](10-season-and-gameweeks.md)). A split's table counts only that
  split's points.
- So Overall gives three global tables: the season, Split 1 and Split 2 ("And have a split 1 and
  2 league", Craig, 13 Nov 2026).

## Legend and Rise

In Split 2 the Overall league splits in two, as the LCK splits into its Legend and Rise groups
("Split the global league from split 1 into legend and rise", Craig, 13 Nov 2026).

- At the start of Split 2, the top half of Split 1's Overall table goes into Legend; the rest go
  into Rise. Example: with 10,000 managers, ranks 1 to 5,000 are Legend.
- Points carry over: Legend and Rise rank by season points, Split 1 included ("Scores carry
  over").
- A manager who joins in Split 2 goes into Rise.
- Only Overall splits. Country, team and private leagues stay whole, and the whole Overall table
  stays alongside Legend and Rise.

## Private leagues

- Any manager can make a private league and invite others with a code or a link, as in FPL.
- A private league's scoring starts from the gameweek its maker picks. Example: a league made in
  gameweek 4 can count from gameweek 4.
- The maker can rename the league, remove a manager and delete it. Any member can leave. As in
  FPL.
- A manager can be in up to 25 private leagues, and a private league has no size cap, as in FPL.
  Both numbers are data.

## The Leagues page

As FPL's (Craig, 13 Nov 2026):

- It lists the manager's leagues: Overall, their country, their team, then their private leagues,
  each with their rank and how it moved. Example: Overall 12,408 ▲, United Kingdom 311 ▼, T1
  1,920 ▲, Pub League 3rd.
- A league's table shows rank, a movement arrow, team and manager name, gameweek points and total,
  with the season and each split as tabs above it. A row opens that manager's team.
