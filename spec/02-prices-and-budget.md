# Prices and budget

Craig's answers only, from the `/grill` of 12 Nov 2026 and chat on 13 Nov 2026. Where this file is silent the rule is
FPL's, or FPL's logic ([SPEC.md](../SPEC.md), the base assumption). Open questions are in
[docs/to-grill.md](../docs/to-grill.md).

## Money

- Money is shown in m, to one decimal, as FPL does (Craig, 16 Nov 2026; it was 억). As a guide: a
  budget of about 100m, stars at about 18–22m, cheap picks at about 5m. The values are data per
  competition, set before each split. The approved pictures still show 억; read it as m.
- The coach (the team) has a price, like a player ([spec/01](01-squad-and-slots.md)).
- Knockout stages can lift the budget through their stage settings
  ([spec/10](10-season-and-gameweeks.md)).

## First prices

- A formula proposes each player's and coach's first price from last season's data, then an admin
  adjusts them by hand before the competition opens.
- A rookie with no data is priced by hand.
- The top coaches are priced a little higher than the others (Craig, 13 Nov 2026): in the 2026
  backtest Gen.G's coach scored 6.8 a series, among the top five picks, against 4.5–5.9 for the
  rest.

## Price moves

- Prices move once a week, at the deadline.
- A move is mostly on recent points, a little on transfers in and out, and down when relatively
  few managers own the player, since that means his price is too high.
- No price falls below a floor.
- The coach moves by the same rule, on its own score.
- Step sizes, weights and the floor are data. The formula is public, on a help page.

## Selling

- A player or coach sells at his full current price.
