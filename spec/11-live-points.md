# Live points

Craig's answers only, from chat on 11 Nov 2026 and the `/grill` of 13 Nov 2026. Where this file
is silent the rule is FPL's, or FPL's logic ([SPEC.md](../SPEC.md), the base assumption). Open
questions are in [docs/to-grill.md](../docs/to-grill.md).

## Live

- The beta has live points: "we really need live in some way" (Craig, 13 Nov 2026). They run
  from the first day of the LEC Winter test (Craig, 18 Nov 2026).
- They come from Riot's unofficial live stats feed and are shown as provisional. Riot has never
  allowed fan use of it and can switch it off ([research](../docs/research/live-data-sources.md)).
- Live points show only the lines the feed carries: kills, deaths, assists, gold lead at 15,
  multikills, first blood and the coach's team objectives. Solo kills and steals are added when
  the series is final ([spec/05](05-scoring.md)).
- Each game's id for the feed is read from lolesports.com's own schedule pages, which carry
  every game's id before it starts (Craig, 13 Nov 2026). Leaguepedia does not hold these ids.
  No second public source was found. Riot's schedule API is not used: its key is Riot's own
  site's, not ours.
- If the feed breaks or is switched off, there are no live points; final points still arrive.
- Gold lead is read at 15:00, a scoring value held as data per competition. The multikill
  timers (10 seconds between kills, 30 for a penta) are LoL's own rule, fixed in code (Craig,
  18 Nov 2026).
- A player with no same-role opponent in the feed shows 0 for gold lead, and an admin alert names
  the game and the player, so it is fixed before the series turns final (Craig, 18 Nov 2026).

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
