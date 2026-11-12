# Scoring

Craig's answers only, from chat on 26–29 Oct and 11 Nov 2026 and the `/grill` of 12 Nov 2026.
Where this file is silent the rule is FPL's, or FPL's logic ([SPEC.md](../SPEC.md), the base
assumption). The player table and the coach's scoring are still open, in
[docs/to-grill.md](../docs/to-grill.md).

## The philosophy

- Points are whole numbers, never decimals.
- Point values stay low, like FPL's.
- Scoring is about even for quick and long games. Cumulative scoring, as other LoL fantasy games
  use, makes long games good; this game must not, so raw kill totals are out.

## How it works

- Scoring is a set of toggles, each with weights by role. The toggles and their values are data.
- Points work per series: a series scores a player's best 2 games (Craig, 11 Nov 2026).
- A quick win means a game won in under 25 minutes. The number is data.
- Every table is backtested on 2026 LCK data before it is used.

## The Carry

- The Carry's points are multiplied by 1.5 and rounded down: a 9 becomes 13
  ([spec/04](04-captain.md)). The multiplier is data.
