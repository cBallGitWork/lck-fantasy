# Chips

Craig's answers only, from the `/grill` of 12 Nov 2026. Where this file is silent the rule is
FPL's, or FPL's logic ([SPEC.md](../SPEC.md), the base assumption). Open questions are in
[docs/to-grill.md](../docs/to-grill.md).

## Chips are data

- The chip set is undecided: "we will have chips, undecided yet, but build the ability for us to
  make them" (Craig, 12 Nov 2026). It is picked before the beta.
- A chip is data: a name, one effect from a list the code offers, how many a manager gets each
  split, and which stages allow it ([spec/10](10-season-and-gameweeks.md)). Chips reset at the
  split ([SPEC.md](../SPEC.md)).
- The first effects, each as FPL's chip of that kind works:
  - unlimited free transfers, kept (FPL's Wildcard);
  - unlimited free transfers for one gameweek, then the squad reverts (FPL's Free Hit);
  - the bench scores too (FPL's Bench Boost);
  - the Carry's multiplier is raised (FPL's Triple Captain; [spec/04](04-captain.md)).
- A manager plays at most one chip a gameweek.
- In a gameweek a manager plays Remake or Recall, his free transfer doesn't roll over
  ([spec/03](03-transfers.md)).

## Names so far

| Chip | FPL's chip |
|---|---|
| Remake | Wildcard |
| Recall | Free Hit |
| Bench Boost | Bench Boost |
| Hyper Carry | Triple Captain |
