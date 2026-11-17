# Price formula: a draft for Craig

Claude's second draft for #23, 17 Nov 2026. Craig said no to the first (a straight line, ₩5m to
₩20m): three stars still left room for mid-priced players. Every number is a setting, data per
competition. Backtested with [backtest/prices.ts](backtest/prices.ts), using the game's own
scoring code. A template: 2027 rosters are still being signed, so prices are rerun once they are.

**Contents:** [Craig's goal](#craigs-goal) · [First prices](#first-prices) ·
[Backtest](#backtest-2025-pricing-2026) · [Template for 2027](#template-for-2027) ·
[Best squad](#best-squad-for-the-year) · [Weekly moves](#weekly-moves) ·
[What the backtest can't test](#what-the-backtest-cant-test)

## Craig's goal

- A normal squad: 2 stars, 1 or 2 mid-priced, the rest cheap.
- Three stars force the rest to be the worst players.
- Not a straight line: the best team's top players cost more, as they get the Captain most weeks.
- A price weighs the player's own record and his team's strength.
- Top price about ₩25m (Craig: maybe Chovy is 25; Haaland is £15.5m of FPL's £100m, but FPL's squad is 15, ours 9).

## First prices

1. **Own record:** last season's points per series, scaled 0 to 1 (the 10th percentile and below
   is 0, the best is 1).
2. **Team strength:** his current team's share of series won last season, scaled 0 to 1.
3. **Blend:** 70% own record, 30% team strength. A coach is priced on his own points alone, as they
   already are his team's results.
4. **Bend:** the blend, against the best blend, is raised to the power 1.4, then mapped from the
   floor ₩5m to the top ₩25m, rounded to ₩0.5m. The bend pulls stars up and the middle down.
5. Fewer than 10 series last season: a rookie, priced by hand. Then Craig sets any price by hand.

## Backtest: 2025 pricing 2026

2025's points and records, 2026's rosters, 50 picks.

| Squad (budget ₩100m) | Cost |
|---|---|
| 3 stars (Ruler, Chovy, Canyon) + the cheapest legal 6 | ₩100.0m |
| 2 stars + 2 mid-priced (₩12m each) + the cheapest legal 5 | ₩97.0m |
| The cheapest legal squad | ₩52.5m |

- Dearest: Ruler 25.0, Chovy 22.5, Canyon 20.5, Kiin and Duro 20.0, Gen.G's coach 19.5,
  Gumayusi 18.5. Gen.G won 86% of its 2025 series, so five of its six picks are stars.
- Coaches: Gen.G 19.5, Hanwha 14.0, T1 13.5, the bottom three ₩5m.
- First price against 2026's points per series: r = 0.81 (the old draft: 0.77).

Tried: team weight 0 to 0.5, bend 1 to 3. A straight line with a ₩25m top nearly works too
(₩103m and ₩102.5m); more bend makes mid-priced players too cheap (₩8–9m at bend 2).

## Template for 2027

2026's points and records, 2026's rosters, 61 picks. Rerun once rosters are signed.

| Squad | Cost |
|---|---|
| 3 stars (Ruler, Peyz, Kiin) + the cheapest legal 6 | ₩101.5m, over budget |
| 2 stars + 2 mid-priced (₩13m each) + the cheapest legal 5 | ₩99.0m |
| The cheapest legal squad | ₩47.0m |

| Role | Prices, dearest first (₩m) |
|---|---|
| top | 23, 16.5, 12.5, 8.5, 8.5, 8.5, 7, 6, 5.5, 5 |
| jungle | 21.5, 15, 15, 12, 11, 9.5, 9.5, 6.5, 6, 5 |
| mid | 23, 23, 14, 12.5, 11, 9, 9, 7.5, 6.5, 5 |
| bot | 24.5, 23.5, 16, 15, 13, 11.5, 11, 9, 9, 5, 5 |
| support | 21.5, 19.5, 19.5, 16.5, 13, 12.5, 8, 6.5, 6.5, 5.5 |
| coach | 24.5, 15, 14, 12.5, 10, 8, 6.5, 5, 5, 5 |

- Dearest: Ruler and Gen.G's coach 24.5, Peyz 23.5, Kiin, Chovy and Zeka 23.0, Canyon and Duro 21.5.
- Chovy comes out at ₩23m, not ₩25m: Ruler and Peyz outscored him in 2026. A hand change.

## Best squad for the year

The highest-scoring squad within ₩100m, picked once and kept all 2026 (Craig, 17 Nov 2026): one
per role, a flex, the coach, the two cheapest players on the bench, the Captain on the top scorer.
No transfers or chips.

- **2025 prices:** 1,637 pts, ₩98.5m. Kiin ₩20m, Zeka ₩15m, Keria ₩17m, Dplus Kia's coach ₩10.5m,
  Teddy ₩10.5m, Kellin ₩9m, GIDEON ₩6.5m. One star at most.
- **Template prices:** 1,582 pts, ₩99.5m. Career ₩16.5m, Smash ₩16m, ShowMaker ₩14m, Dplus Kia's
  coach ₩12.5m, Kellin ₩12.5m, Raptor ₩9.5m, Clear ₩8.5m. No stars.
- **Why:** points are flat. Ruler, ₩25m, scored 256 in 2026; Kellin, ₩9–12.5m, scored 212. A star
  scores about a fifth more than a mid-priced pick and costs twice as much. In FPL a star scores
  nearly twice a budget player's points.

So the prices meet Craig's squads on cost, but the best play skips stars. Fixing that is
Craig's call: widen the scoring gap ([spec/05](../../spec/05-scoring.md)), or flatten the top.

## Weekly moves

Unchanged from the approved shape: form is points per series over the last 8 series, put through
the same pricer; a gap of ₩3m or more moves him ₩0.2m a week. Backtest over 2026's 28 weeks:
16 moves a week, Zeka +2.0 and Siwoo −2.8 the biggest, ₩5.0m to ₩22.8m at the end.

## What the backtest can't test

As approved on 14 Nov 2026 ([spec/02](../../spec/02-prices-and-budget.md)): net transfers of 5%
of managers in or out move a pick one step; owned by under 2% with form not above his price, one
step down; one step a week at most. No managers yet, so untested.
