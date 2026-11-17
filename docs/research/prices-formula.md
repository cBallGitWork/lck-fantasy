# Price formula: a draft for Craig

Claude's second draft for #23, 17 Nov 2026. Craig said no to the first (a straight line, ₩5m to
₩20m): three stars still left room for mid-priced players. Every number is a setting, data per
competition. Backtested with [backtest/prices.ts](backtest/prices.ts), using the game's own
scoring code. A template: 2027 rosters are still being signed, and tier lists and bookmakers' odds
near the season's start refine it.

**Contents:** [Craig's goal](#craigs-goal) · [Team strength](#team-strength-and-points) ·
[First prices](#first-prices) · [Template for 2027](#template-for-2027) ·
[Example squads](#example-squads) · [Backtest](#backtest-2025-pricing-2026) ·
[Weekly moves](#weekly-moves) · [What the backtest can't test](#what-the-backtest-cant-test)

## Craig's goal

All 17 Nov 2026.

- Budget ₩100m. A normal squad: 2 stars, 1 or 2 mid-priced, the rest cheap. Three stars force the
  rest to be the worst players.
- The best team's top players cost more, as they get the Captain most weeks. More of a straight
  line than a curve.
- A price weighs the player's own record and his team's strength; 2026 counts more than 2025.
- Top price about ₩23m. Chovy is the dearest, the bigger name; Faker is ₩15m.
- Nobody costs around ₩18–22m. Each role's ten starters, and the ten coaches, have different
  prices, so the bottom teams are separated too.
- Coaches can't be Captain, so they cost less.
- First-team floor ₩6m. Academy players ₩5m, cheaper than every first-teamer; they can fill the bench.

## Team strength and points

A team's share of series won against its players' points per series (10+ series):

- 2025: r = 0.85 (r² 0.71). 2026: r = 0.76 (r² 0.58). Supports 0.95 both years, coaches 0.97–1.00.
- So a team's results explain about 60–70% of its players' points. Points already carry most of
  the team effect.
- Still, adding team strength predicts the next season better: pricing 2026 from 2025, r = 0.75
  with no team weight, 0.80 at 30%, 0.82 at 45% and 60%. The draft uses 45%.

## First prices

1. **Own record:** points per series, 75% last season and 25% the one before, scaled 0 to 1 (the
   10th percentile and below is 0, the best is 1).
2. **Team strength:** his current team's share of series won, weighted the same way, scaled 0 to 1.
   Tier lists or bookmakers' odds can replace it before the season.
3. **Blend:** 55% own record, 45% team strength.
4. **Line:** the blend, against the best, raised to the power 1.1 (nearly straight), mapped from
   ₩6m to ₩22.5m, rounded to ₩0.5m.
5. **Gap:** nothing between ₩17.5m and ₩21m; a price there goes to the nearer edge. Stars are
   spaced ₩0.5m apart, dearest first, down to ₩21m.
6. **Different prices:** in each role, each team's most-played player is its starter. The ten
   starters, and the ten coaches, are spaced at least ₩0.5m apart, from the cheapest up, never
   into the gap.
7. **Coaches** have a line of their own, the worst coach ₩6m to the best ₩16.5m (about the top over
   the Captain's 1.5), on their own points alone: they already are the team's results.
8. **By hand:** Chovy ₩23m, Faker ₩15m, academy players ₩5m. A rookie with under 10 series is
   priced by hand.

## Template for 2027

2026 (75%) and 2025 (25%), on 2026's rosters, 63 picks. In ₩m.

| Role | Prices |
|---|---|
| top | Kiin 21, Zeus 17, Doran 14.5, Siwoo 12.5, PerfecT 11, Clear 10.5, Kingen 8.5, Casting 8, Rich 7.5, DuDu 6 |
| jungle | Canyon 21, Oner 16.5, Kanavi 16, Lucid 14.5, Cuzz 13, Raptor 11, GIDEON 9.5, Willer 8.5, Sponge 8, Pyosik 6 |
| mid | Chovy 23, Zeka 21.5, ShowMaker 15.5, Faker 15, Bdd 13.5, Scout 10.5, Ucal 10, VicLa 9.5, Roamer 8, Clozer 6.5 |
| bot | Ruler 22.5, Peyz 22, Smash 17.5, Gumayusi 17, Jiwoo 13, Taeyoon 12.5, Aiming 12, Diable 11, Teddy 10, LazyFeel 6.5, deokdam 6 |
| support | Duro 21, Keria 17.5, Delight 17, Career 16.5, Effort 14, Kellin 12.5, Pollu 9, Lehends 9, Namgung 8.5, Peter 8, Andil 7.5, Life 6 |
| coach | Gen.G 16.5, HLE 13.5, T1 13, DK 12, KT 11, BFX 10, NS 9, BRO 8.5, DRX 8, DNS 6 |

Squads, all nine inside ₩100m, two academy players on the bench:

- Chovy, Ruler and Peyz + the cheapest 6: ₩101.5m, just over. Three cheaper stars fit.
- 2 stars + 2 mid-table players (KT or BNK FEARX, about ₩13m) + the cheapest 5: about ₩99m.
  With T1 or Dplus Kia players at ₩15m instead: ₩103m.
- The cheapest legal squad: ₩53m.

Tops sit low because the data has no solo kills, which tops get most; Leaguepedia has them.

## Example squads

The highest-scoring squad on the template's prices with 0 to 3 stars (₩21m or more), picked once
and kept all 2026. The bench is two academy players, ₩5m each, scoring nothing. Captain on the top
player, never the coach.

| Stars | 2026 pts | Starters (₩m) |
|---|---|---|
| 0 | 1,549 | Casting 8, GIDEON 9.5, ShowMaker 15.5, Teddy 10, Keria 17.5, Kellin 12.5, Gen.G coach 16.5 |
| 1 | **1,566** | Casting 8, Raptor 11, GIDEON 9.5, Ucal 10, Peyz 22, Kellin 12.5, Gen.G coach 16.5 |
| 2 | 1,502 | Kiin 21, Casting 8, GIDEON 9.5, Ucal 10, Peyz 22, Andil 7.5, DK coach 12 |
| 3 | 1,329 | Kiin 21, DuDu 6, Canyon 21, Clozer 6.5, Peyz 22, Andil 7.5, DNS coach 6 |

Points are flat: Ruler, ₩22.5m, scored 256 in 2026; Kellin, ₩12.5m, 212. A star scores about a
fifth more than a mid-priced pick. In FPL a star scores nearly twice a budget player's points.

## Backtest: 2025 pricing 2026

2025 alone (the files hold nothing earlier), on 2026's rosters, 48 picks with 2026 points.

- Chovy, Ruler and Canyon + the cheapest 6: ₩101.5m. 2 stars + 2 mid-priced (₩13m) + the
  cheapest 5: ₩99.5m. The cheapest squad: ₩59.5m.
- First price against 2026's points per series: r = 0.82 (the first draft: 0.77).

## Weekly moves

Unchanged from the approved shape: form is points per series over the last 8 series, put through
the same line; a gap of ₩3m or more moves him ₩0.2m a week. Over 2026's 28 weeks on the template:
12 moves a week; DuDu +1.4 and Kiin −1.4 the biggest.

## What the backtest can't test

As approved on 14 Nov 2026 ([spec/02](../../spec/02-prices-and-budget.md)): net transfers of 5%
of managers in or out move a pick one step; owned by under 2% with form not above his price, one
step down; one step a week at most. No managers yet, so untested.
