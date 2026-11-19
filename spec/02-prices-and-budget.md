# Prices and budget

Craig's answers only, from the `/grill` of 12 Nov 2026 and chat on 13 Nov 2026. Where this file is silent the rule is
FPL's, or FPL's logic ([SPEC.md](../SPEC.md), the base assumption). Open questions are in
[docs/to-grill.md](../docs/to-grill.md).

## Money

- Money is shown as ₩ then m, to one decimal, as FPL shows £ and m: `₩18.5m` (Craig, 16 Nov 2026;
  it was 억). As a guide: a budget of ₩100m, stars at about ₩21–23m, first-team picks from ₩6m, academy players ₩5m (Craig, 17 Nov 2026). The values are data per
  competition, set before each split. The approved pictures still show 억; read it as ₩ and m.
- The coach (the team) has a price, like a player ([spec/01](01-squad-and-slots.md)).
- Knockout stages can lift the budget through their stage settings
  ([spec/10](10-season-and-gameweeks.md)).

## First prices

- A formula proposes each player's and coach's first price from last season's data, then an admin
  adjusts them by hand before the competition opens.
- A rookie with no data is priced by hand.
- The formula is a mix of data and hand work (Craig, 14 Nov 2026): it sets a base, and Craig then
  sets each price by hand. Prices stay data he can edit, per competition.
- The base weighs the player's own record and his team's strength, and is not a straight line: the
  best team's top players cost more, as they get the Captain most weeks (Craig, 17 Nov 2026).
- The goal (Craig, 17 Nov 2026): a normal squad is 2 stars, 1 or 2 mid-priced and the rest cheap.
  Three stars force the rest to be the worst players. The
  [draft](../docs/research/prices-formula.md) is backtested against these squads.
- The top price is about ₩23m, and Chovy is the dearest: he is the bigger name. Faker is ₩15m
  (Craig, 17 Nov 2026).
- Coaches can't be Captain, so they can't cost as much as the top players (Craig, 17 Nov 2026).
- Nobody costs around ₩18–22m: the stars sit above a gap (Craig, 17 Nov 2026).
- More of a straight line than a curve; the base weighs last season more than the one before
  (Craig, 17 Nov 2026).
- Each role's ten starters, and the ten coaches, have different prices, ₩0.5m apart at least,
  so the bottom teams are separated too (Craig, 17 Nov 2026).
- The budget is ₩100m. The first-team floor is ₩6m; academy players are ₩5m, cheaper than every
  first-teamer, and can fill the bench (Craig, 17 Nov 2026).
- Tier lists and bookmakers' odds near the season's start refine the list (Craig, 17 Nov 2026).
- The top coaches are priced a little higher than the others (Craig, 13 Nov 2026): in the 2026
  backtest Gen.G's coach scored 6.8 a series, among the top five picks, against 4.5–5.9 for the
  rest.

### The formula

Craig approved the second draft ([docs/research/prices-formula.md](../docs/research/prices-formula.md),
17 Nov 2026) on 18 Nov 2026. Every number below is a setting, data per competition; the LEC's
are set the same way for its Winter test.

1. **Own record:** points per series, 75% last season and 25% the one before, scaled 0 to 1 (the
   10th percentile and below is 0, the best is 1).
2. **Team strength:** his current team's share of series won, weighted the same way, scaled 0 to
   1. Tier lists or bookmakers' odds can replace it before the season.
3. **Blend:** 55% own record, 45% team strength.
4. **Line:** the blend against the best, to the power 1.1, mapped from ₩6m to ₩22.5m and rounded
   to ₩0.5m.
5. **Gap:** nothing between ₩17.5m and ₩21m; a price there goes to the nearer edge. Stars are
   spaced ₩0.5m apart, dearest first, down to ₩21m.
6. **Different prices:** each team's most-played player in a role is its starter. The ten
   starters of a role, and the ten coaches, are at least ₩0.5m apart, from the cheapest up, never
   into the gap.
7. **Coaches:** a line of their own on their own points, the worst ₩6m to the best ₩16.5m.
8. **By hand:** Chovy ₩23m, Faker ₩15m, academy players ₩5m; a rookie with under 10 series.

## Price moves

- Each split starts from a fresh set of prices, set like the first ones; team value resets
  ([spec/03](03-transfers.md), Craig, 17 Nov 2026).

- Prices move once a week, at the deadline.
- A move is mostly on recent points, a little on transfers in and out, and down when relatively
  few managers own the player, since that means his price is too high.
- Moves are driven by form and ownership (Craig, 14 Nov 2026), as in the
  [draft](../docs/research/prices-formula.md), one step a week at most: form as below, and a step
  down when few own him.
- A pick rises a step when net transfers in reach 5% of managers in a week, and falls a step at 5%
  net out. One owned by under 2% of managers, with form not above his price, falls a step. Both
  thresholds are data (Craig, 14 Nov 2026).
- Form is points per series over his last 2 gameweeks (Craig, 19 Nov 2026), put through the
  same line as first prices.
  A gap of ₩3m or more between form and price moves him ₩0.2m that week (Craig, approved
  18 Nov 2026).
- No price falls below a floor.
- The coach moves by the same rule, on its own score.
- Step sizes, the ownership step's included, weights and the floor are data. The formula is
  public, on a help page.

## Selling

- A player or coach sells at his full current price.
