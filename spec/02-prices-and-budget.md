# Prices and budget

Craig's answers only, from the `/grill` of 12 Nov 2026 and chat on 13 Nov 2026. Where this file is silent the rule is
FPL's, or FPL's logic ([SPEC.md](../SPEC.md), the base assumption). Open questions are in
[docs/to-grill.md](../docs/to-grill.md).

## Money

- Money is shown in 억 (100 million won). As a guide: a budget of about ₩100억, stars at about
  ₩18–22억, cheap picks at about ₩5억. The values are data per competition, set before each split.
- A one-line note tells overseas players what it means: "1억 = 100 million won, game money only".
- The coach (the team) has a price, like a player ([spec/01](01-squad-and-slots.md)).
- Knockout stages can lift the budget through their stage settings
  ([spec/10](10-season-and-gameweeks.md)).

## First prices

- A formula proposes each player's and coach's first price from last season's data, then an admin
  adjusts them by hand before the competition opens.
- A rookie with no data is priced by hand.
- The formula is a mix of data and hand work (Craig, 14 Nov 2026): last season's points per series
  set a base on a line from the floor to the top price (5억 to 20억 in the
  [draft](../docs/research/prices-formula.md)), and Craig then sets each price by hand. Prices stay
  data he can edit, per competition.
- The top coaches are priced a little higher than the others (Craig, 13 Nov 2026): in the 2026
  backtest Gen.G's coach scored 6.8 a series, among the top five picks, against 4.5–5.9 for the
  rest.

## Price moves

- Prices move once a week, at the deadline.
- A move is mostly on recent points, a little on transfers in and out, and down when relatively
  few managers own the player, since that means his price is too high.
- Moves are driven by form and ownership (Craig, 14 Nov 2026), as in the
  [draft](../docs/research/prices-formula.md): one step a week when a pick's form over his last
  series is well above or below his price, and a step down when few own him.
- A pick rises a step when net transfers in reach 5% of managers in a week, and falls a step at 5%
  net out. One owned by under 2% of managers, with form not above his price, falls a step. Both
  thresholds are data (Craig, 14 Nov 2026).
- No price falls below a floor.
- The coach moves by the same rule, on its own score.
- Step sizes, weights and the floor are data. The formula is public, on a help page.

## Selling

- A player or coach sells at his full current price.
