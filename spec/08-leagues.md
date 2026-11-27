# Leagues

**Contents:** [Leagues every manager joins](#leagues-every-manager-joins) · [Tables](#tables) · [Legend and Rise](#legend-and-rise) · [Private leagues](#private-leagues) · [Overall tiers](#overall-tiers) · [The Leagues page](#the-leagues-page)

Craig's answers only, from chat on 11 Nov 2026 and the `/grill`s of 13 and 14 Nov 2026. Where this file
is silent the rule is FPL's, or FPL's logic ([SPEC.md](../SPEC.md), the base assumption). Open
questions are in [docs/to-grill.md](../docs/to-grill.md).

## Leagues every manager joins

- Every manager is entered into three leagues automatically: Overall, their country's league and
  their favourite team's supporter league, as FPL does.
- The favourite team is required at sign-up: one of the competition's teams. Example: pick T1
  and you join the T1 league.
- A manager can change their favourite team until their first gameweek starts (its deadline);
  after that it is fixed for the season ("you cant change fav team anyways during season",
  "once your first gameweek starts", Craig, 15 Nov 2026). Since no points have counted by then,
  a change only moves the manager to the new team's league; nothing carries over.
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
- On the Split 2 tab, Legend and Rise show season points as the total, with a Split 2 column
  beside it (Craig, 14 Nov 2026).
- Only Overall splits. Country, team and private leagues stay whole, and the whole Overall table
  stays alongside Legend and Rise.

## Private leagues

- Any manager can make a private league and invite others with a code or a link, as in FPL.
- A link only fills in the code: it opens Join a league with the code in, and the manager presses
  Join. A visitor with no account lands on the front door, picks a squad and signs up first; then
  Join a league opens with the code in. Nobody joins a league without pressing Join (Craig,
  17 Nov 2026).
- A private league's scoring starts from the gameweek its maker picks. Example: a league made in
  gameweek 4 can count from gameweek 4. The choice is this gameweek or a later one, this one by
  default (Craig, 14 Nov 2026).
- The maker can rename the league, remove a manager and delete it. Any member can leave. As in
  FPL.
- The maker can't leave without deleting the league (Craig, 14 Nov 2026).
- A manager the maker removes can't rejoin that league, as FPL bans them. The confirm reads
  "Remove Baron Steal FC? They can't rejoin." (Craig, 17 Nov 2026).
- Ties on points go to fewer transfers, as in FPL. Only regular transfers count (Craig, 14 Nov 2026).
- A manager can be in up to 25 private leagues, and a private league has no size cap, as in FPL.
  Both numbers are data.
- A code no league has keeps the Join sheet open, with "No league with that code" under the box,
  as FPL (Craig, 17 Nov 2026).
- At the cap, Create and Join stay off with "25 leagues already" as the reason, under the count
  line "Private leagues: 25 of 25" (Craig, 17 Nov 2026).

## Overall tiers

Overall shows each manager's place as a LoL ranked tier, Iron to Challenger (Craig, 14 Nov 2026).

- Iron to Diamond have divisions IV to I. Master and Grandmaster have none. Challenger shows the
  manager's rank instead, with a green arrow for its move. Example: Emerald I; Master; Challenger,
  4th ▲2.
- The tier comes from the manager's rank on the whole Overall season table, Split 2 included
  (not Legend or Rise), against percentile cut-offs. One tier for the season; split tables have
  none.
- The cut-offs are data, per competition. Master, Grandmaster and Challenger at beta size are
  set once sign-ups are known (a late call, Craig, 14 Nov 2026).
- The tier moves whenever the rank does, when a series turns final
  ([spec/11](11-live-points.md)). No protection: a manager drops a tier as soon as their rank
  does. Example: T1 v Gen.G turns final at 10pm KST; Emerald IV becomes Emerald III.
- Everyone is Unranked until gameweek 1 is final.
- Only Overall has tiers. Country, team and private leagues show plain ranks.
- Where it shows:
  - Home: a shield, the tier and the rank beneath, by the team name, with no total of managers
    ([approved picture](../docs/design/approved/home/)).
  - Points: the tier, the points to promote and the points clear of demotion, at every tier
    (Craig, 27 Nov 2026, over 18 Nov's Challenger only). Each is the gap to the manager at that
    cut-off now, shown with ≈ as others still score. Example: `≈6 pts to Diamond IV · ≈5 pts clear
    of Emerald II`. Challenger has nothing above and Iron IV nothing below. Home doesn't show them.
  - The manager's profile, by the team name in its banner, as on Home: the shield, tier, rank and
    its move.
  - The Leagues page's list of leagues, beside Overall: the shield and the short name. Example:
    `Overall · Emerald I` (Craig, 27 Nov 2026, over 18 Nov's profile only).
  - The Leagues page's Overall table: a Tier column, the small shield and the short name, such as
    `Emerald I` (Craig, 18 Nov 2026).
  - Help: a Ranks section with the cut-off table ([spec/09](09-onboarding.md)).
- At the season's end each manager's final tier and rank are kept, and the profile's History tab
  lists them per season in a Past seasons table under the weeks, as FPL's: Season, Tier, Rank.
  Example: LCK 2027, Diamond II, 2,104th. One row a season, no split rows; it is hidden until
  a season has ended (Craig, 18 Nov 2026).

Starting cut-offs (top % of Overall), from 2026 solo queue shares across all servers, split by
Gold's division ratios, checked 14 Nov 2026
([nerfplz](https://www.nerfplz.com/2026/08/league-of-legends-rank-distribution.html),
[dodge.gg](https://www.dodge.gg/en-US/lol/news/ranked-solo-duo-guide-2026)):

| Tier | I | II | III | IV |
|---|---|---|---|---|
| Challenger | 0.02 | | | |
| Grandmaster | 0.06 | | | |
| Master | 0.7 | | | |
| Diamond | 1.5 | 2.4 | 3.3 | 4.4 |
| Emerald | 6.9 | 9.6 | 13 | 16 |
| Platinum | 20 | 24 | 29 | 34 |
| Gold | 39 | 45 | 51 | 58 |
| Silver | 62 | 68 | 73 | 80 |
| Bronze | 83 | 87 | 91 | 96 |
| Iron | 97 | 98 | 99 | 100 |

## The Leagues page

As FPL's (Craig, 13 Nov 2026):

- It lists the manager's leagues: Overall, their country, their team, then their private leagues,
  each with their rank and how it moved. Example: Overall 12,408 ▲, United Kingdom 311 ▼, T1
  1,920 ▲, Pub League 3rd.
- A league's table shows rank, a movement arrow, team and manager name, gameweek points and total,
  with the season and each split as tabs above it. A row opens that manager's team.
- A Captain column shows each manager's Captain for the gameweek in the Week column, on every tab.
  It shows only once that gameweek's deadline has passed, as FPL hides picks until then (Craig,
  14 Nov 2026).
- Overall's tab has a panel of Captains and buffs by tier (Craig, 27 Nov 2026): a row for each of
  the ten tiers, Iron to Challenger, not each division, with the tier's most picked Captain and
  his share and its most played buff and its share. Example: `Challenger · GEN Chovy 61% · Double
  Captain 9%`. A tier where nobody played a buff shows a dash. A manager counts in the tier they
  held at that gameweek's deadline. It follows the gameweek in the Week column and shows only
  once that deadline has passed, as the Captain column.
- A chase tag on the manager's own row shows the points to the rank above (16 pts to 1st), their
  lead over 2nd when 1st (+16 clear), and nothing when level (Craig, 14 Nov 2026).
- Leagues in the top bar opens Overall's table, the manager's leagues listed beside it (Craig,
  17 Nov 2026).
- A table opens on its Season tab, as FPL (Craig, 17 Nov 2026).
- A table shows 50 rows a page, as FPL, and Find me opens the page holding the manager's row. The
  page size is data (Craig, 17 Nov 2026).
- A row's › opens that manager's Points for the latest gameweek, as FPL (Craig, 17 Nov 2026).
- Under a league's name, the competition and season, with the split on a split tab: `LCK 2027`,
  `LCK 2027 · Split 1` (Craig, 17 Nov 2026).
