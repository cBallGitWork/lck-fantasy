# Regions

Craig's answers only, from the `/grill` of 18 Nov 2026. Where this file is silent the rule is
FPL's, or FPL's logic ([SPEC.md](../SPEC.md), the base assumption). Open questions are in
[docs/to-grill.md](../docs/to-grill.md).

Flol runs one game per region: the LCK and the LEC. Each region has its own squads, prices,
leagues and tables, on the same rules and the same pages.

## The LEC

- The LEC region starts with the LEC's Spring split of 2027. Its first split (2026's Versus, from
  mid-January) is not played: its single-game series don't fit a series' best 2 games
  ([spec/05](05-scoring.md)).
- Its season is Spring and Summer. The LEC's facts (teams, rosters, dates, series length) are data
  for that region, checked when the 2027 schedule is out. In 2026 each split was a single round
  robin of best-of-threes for 10 teams, then the top 6 in a double-elimination playoff of
  best-of-fives (checked 18 Nov 2026).
- Money is in euros, on the LCK's scale. Example: `€18.5m`.
- The same pages and the same look as the LCK's, with the LEC's own culture: its own sponsors,
  crests, shirts and words. No hangul and no Korean touches ([spec/13](13-korean-touches.md)).
- The LEC's buffs and stage values are set once Craig has reviewed the 2027 Spring schedule and
  its roadtrips (see SPEC.md, Later).

## Weeks in the LEC

- A gameweek is one LEC week, its deadline 15 minutes before its first series, as in the LCK
  ([spec/10](10-season-and-gameweeks.md)).
- LEC weeks are uneven: a team can play one series in a week and another two. Every series a
  player plays that week counts, as FPL's double gameweeks. Example: in Spring 2026's first week,
  six teams played twice and four once.
- The playoffs use the LCK's knockout rules: the team cap rises from 2 to 3, the budget is raised,
  transfers are unlimited and every series counts ([spec/10](10-season-and-gameweeks.md#knockouts)).
  The values are data for the region.
- A week with no series is no gameweek: the game waits, as the LCK's does over MSI.

## Leagues in the LEC

- The same three leagues every manager joins: Overall, their country's and their favourite LEC
  team's ([spec/08](08-leagues.md)).
- Overall stays whole all year: a season table and a Spring and a Summer table, with tiers from
  the season table. No Legend and Rise.
- Private leagues belong to one region. Example: Pub League, made in the LCK, takes only LCK
  teams; its code joins no LEC team. The cap of 25 private leagues counts per region.

## One account, two regions

- One Flol account plays both regions. Each region has its own team: its name, squad, favourite
  team, leagues and ranks. The country is the account's, set once ([spec/09](09-onboarding.md)).
- A manager starts their second region from the region switcher in the header: they pick a squad
  (with Auto-fill), press Save, and a short sheet asks only for a team name and a favourite team.
  Sign-in, country and the 16-or-over tick are already on the account. They join late as in FPL.
- Each region has its own address: flol.gg/lck and flol.gg/lec. A shared link opens its own
  region.
- Bare flol.gg asks a new visitor to pick LCK or LEC. A signed-in manager skips it and lands on the
  region they last played.

## Profile and following

- One profile per manager. Its top shows each region they play, with its tier and Overall rank.
  Example: LCK Diamond II, 2,104th · LEC Gold I, 18,330th. A manager in one region shows only
  that one.
- Below, a tab per region holds its team, leagues and History.
- Follows belong to the person: following a manager follows them in both regions. The feed, cheers
  and jeers are per region: the feed shows the region you're in ([spec/14](14-following.md)).

## Flags

- A manager's country flag shows by their name in league tables and on their profile, in both
  regions.
- A player's nationality flag shows by his name in the player list and the player pop-up, in the
  LEC only. Each player's nationality is data.
