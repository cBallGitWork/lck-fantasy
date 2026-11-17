# Price formula: a draft for Craig

Claude's second draft for #23, 17 Nov 2026. Craig said no to the first (a straight line, ₩5m to
₩20m): three stars still left room for mid-priced players. Every number is a setting, data per
competition. Backtested with [backtest/prices.ts](backtest/prices.ts), using the game's own
scoring code. A template: 2027 rosters are still being signed, so prices are rerun once they are.

**Contents:** [Craig's goal](#craigs-goal) · [First prices](#first-prices) ·
[Backtest](#backtest-2025-pricing-2026) · [Example squads](#example-squads) ·
[Template for 2027](#template-for-2027) · [Weekly moves](#weekly-moves) ·
[What the backtest can't test](#what-the-backtest-cant-test)

## Craig's goal

- A normal squad: 2 stars, 1 or 2 mid-priced, the rest cheap.
- Three stars force the rest to be the worst players.
- Not a straight line: the best team's top players cost more, as they get the Captain most weeks.
- A price weighs the player's own record and his team's strength.
- Chovy is the dearest, at ₩25m: he is the bigger name.
- Coaches can't be Captain, so they can't cost that much.

## First prices

1. **Own record:** last season's points per series, scaled 0 to 1 (the 10th percentile and below
   is 0, the best is 1).
2. **Team strength:** his current team's share of series won last season, scaled 0 to 1.
3. **Blend:** 70% own record, 30% team strength. A coach is priced on his own points alone, as they
   already are his team's results.
4. **Bend:** the blend, against the best blend, is raised to the power 1.4, then mapped from the
   floor ₩5m to the top ₩25m, rounded to ₩0.5m. The bend pulls stars up and the middle down.
5. **Coaches** run to ₩16.5m, not ₩25m: about the top over the Captain's 1.5.
6. Fewer than 10 series last season: a rookie, priced by hand. Then Craig sets any price by hand;
   here, Chovy at ₩25m.

## Backtest: 2025 pricing 2026

2025's points and records, 2026's rosters, 50 picks.

| Squad (budget ₩100m) | Cost |
|---|---|
| 3 stars (Chovy, Ruler, Canyon) + the cheapest legal 6 | ₩102.5m, over |
| 2 stars + 2 mid-priced (₩12m each) + the cheapest legal 5 | ₩99.5m |
| The cheapest legal squad | ₩52.5m |

- Dearest: Chovy and Ruler 25.0, Canyon 20.5, Kiin and Duro 20.0, Gumayusi 18.5, Oner 17.5.
- Coaches: Gen.G 13.5, T1 and Hanwha 10.0, the bottom three ₩5m.
- First price against 2026's points per series: r = 0.76.

## Example squads

The highest-scoring squad within ₩100m with 0 to 3 stars (₩20m or more), picked once on 2025's
prices and kept all 2026. Captain on the top player; bench DuDu and Pyosik, ₩5m each.

| Stars | 2026 pts | Squad |
|---|---|---|
| 0 | 1,645 | Zeus 15, Raptor 9, Zeka 15, Teddy 10.5, Keria 17, Kellin 9, Gen.G coach 13.5 |
| 1 | **1,657** | Kiin 20, GIDEON 6.5, ShowMaker 15.5, Zeka 15, Teddy 10.5, Kellin 9, Gen.G coach 13.5 |
| 2 | 1,628 | Kiin 20, Duro 20, GIDEON 6.5, Zeka 15, Teddy 10.5, Kellin 9, Dplus Kia coach 8 |
| 3 | 1,515 | Ruler 25, Kiin 20, Duro 20, GIDEON 6.5, Ucal 7.5, Lehends 5.5, BNK FEARX coach 5.5 |

- Three stars force cheap picks around them, as Craig wants, and cost about 140 points.
- 0 to 2 stars score within 30 points of each other: points are flat. Ruler, ₩25m, scored 256 in
  2026; Kellin, ₩9m, 212. A star scores about a fifth more than a mid-priced pick, for twice the
  price. In FPL a star scores nearly twice a budget player's points.

## Template for 2027

2026's points and records, 2026's rosters, 61 picks. Rerun once rosters are signed.

| Role | Prices, dearest first (₩m) |
|---|---|
| top | 23, 16.5, 12.5, 8.5, 8.5, 8.5, 7, 6, 5.5, 5 |
| jungle | 21.5, 15, 15, 12, 11, 9.5, 9.5, 6.5, 6, 5 |
| mid | 25, 23, 14, 12.5, 11, 9, 9, 7.5, 6.5, 5 |
| bot | 24.5, 23.5, 16, 15, 13, 11.5, 11, 9, 9, 5, 5 |
| support | 21.5, 19.5, 19.5, 16.5, 13, 12.5, 8, 6.5, 6.5, 5.5 |
| coach | 16, 11, 10.5, 9.5, 8, 6.5, 6, 5, 5, 5 |

- 3 stars (Chovy, Ruler, Peyz) + the cheapest 6: ₩103.5m, over. 2 stars + 2 mid-priced (₩13m) +
  the cheapest 5: ₩100.5m. The cheapest squad: ₩47.0m.

## Weekly moves

Unchanged from the approved shape: form is points per series over the last 8 series, put through
the same pricer; a gap of ₩3m or more moves him ₩0.2m a week. Backtest over 2026's 28 weeks:
14.5 moves a week; Zeka +2.0 and Chovy −3.2 the biggest, ₩5.0m to ₩22.8m at the end.

## What the backtest can't test

As approved on 14 Nov 2026 ([spec/02](../../spec/02-prices-and-budget.md)): net transfers of 5%
of managers in or out move a pick one step; owned by under 2% with form not above his price, one
step down; one step a week at most. No managers yet, so untested.
