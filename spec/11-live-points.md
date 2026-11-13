# Live points

Craig's answers only, from chat on 11 Nov 2026 and the `/grill` of 13 Nov 2026. Where this file
is silent the rule is FPL's, or FPL's logic ([SPEC.md](../SPEC.md), the base assumption). Open
questions are in [docs/to-grill.md](../docs/to-grill.md).

## Live

- The beta has live points: "we really need live in some way" (Craig, 13 Nov 2026).
- They come from Riot's unofficial live stats feed and are shown as provisional. Riot has never
  allowed fan use of it and can switch it off ([research](../docs/research/live-data-sources.md)).
- Live points show only the lines the feed carries: kills, deaths, assists, gold lead at 15,
  multikills, first blood and the coach's team objectives. Solo kills and steals are added when
  the series is final ([spec/05](05-scoring.md)).
- Each game's id for the feed comes from Leaguepedia, and an admin can paste one in. Riot's
  schedule API is not used: its key is Riot's own site's, not ours.
- If the feed breaks or is switched off, there are no live points; final points still arrive.

## Final

- Final points come from settled data: Oracle's Elixir's daily file, plus Leaguepedia's match data
  for solo kills and steals.
- A series turns final 3 hours after it ends. If the settled data isn't in by then, the series
  stays provisional until it lands.
- Corrections aren't expected: the stats come from the game itself (Craig, 13 Nov 2026).

## What moves when

- League ranks move once per series, when it turns final. Example: T1 v Gen.G ends at 7pm KST;
  the tables move at about 10pm.
- Prices move only at the gameweek deadline, never daily ([spec/02](02-prices-and-budget.md)).
