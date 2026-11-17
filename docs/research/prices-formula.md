# Price formula: a draft for Craig

Claude's second draft for #23, 17 Nov 2026. Craig said no to the first (a straight line, ₩5m to
₩20m): three stars still left room for mid-priced players. Every number is a setting, data per
competition. Backtested with [backtest/prices.ts](backtest/prices.ts), using the game's own
scoring code. A template: 2027 rosters are still being signed, so prices are rerun once they are.

**Contents:** [Craig's goal](#craigs-goal) · [First prices](#first-prices) ·
[Template for 2027](#template-for-2027) · [Example squads](#example-squads) ·
[Backtest](#backtest-2025-pricing-2026) · [Weekly moves](#weekly-moves) ·
[What the backtest can't test](#what-the-backtest-cant-test)

## Craig's goal

All 17 Nov 2026.

- A normal squad: 2 stars, 1 or 2 mid-priced, the rest cheap. Three stars force the rest to be
  the worst players.
- Not a straight line: the best team's top players cost more, as they get the Captain most weeks.
- A price weighs the player's own record and his team's strength; 2026 counts more than 2025.
- Chovy is the dearest, at ₩25m: the bigger name. Faker is ₩15m.
- Nobody costs ₩18–22m: the stars sit above a gap.
- Coaches can't be Captain, so they cost less; the bottom coaches are spread out.
- Academy players start at ₩6m.

## First prices

1. **Own record:** points per series, 75% last season and 25% the one before, scaled 0 to 1 (the
   10th percentile and below is 0, the best is 1).
2. **Team strength:** his current team's share of series won, weighted the same way, scaled 0 to 1.
3. **Blend:** 70% own record, 30% team strength.
4. **Bend:** the blend, against the best, is raised to the power 1.4, then mapped from the floor
   ₩5m to ₩24.5m, rounded to ₩0.5m. The bend pulls stars up and the middle down.
5. **Gap:** a price between ₩17.5m and ₩23m goes to whichever edge is nearer.
6. **Coaches** have a line of their own, the worst coach ₩5m to the best ₩16.5m (about ₩24.5m over
   the Captain's 1.5), on their own points alone: they already are the team's results.
7. **By hand:** Chovy ₩25m, Faker ₩15m, academy players ₩6m. A rookie with under 10 series is
   priced by hand.

## Template for 2027

2026 (75%) and 2025 (25%), on 2026's rosters, 63 picks. In ₩m.

| Role | Prices |
|---|---|
| top | Kiin 23, Zeus 16, Doran 12, Siwoo 10, PerfecT 8.5, Clear 8.5, Kingen 6.5, Casting 6, Rich 6, DuDu 5 |
| jungle | Canyon 23, Oner 15.5, Kanavi 14.5, Lucid 13, Cuzz 11.5, Raptor 9.5, GIDEON 8.5, Willer 6.5, Sponge 6.5, Pyosik 5 |
| mid | Chovy 25, Zeka 23, Faker 15, ShowMaker 14.5, Bdd 12.5, Scout 9, Ucal 8, VicLa 7.5, Roamer 6.5, Clozer 5 |
| bot | Ruler 24.5, Peyz 23, Smash 17.5, Gumayusi 16, Aiming 12, Jiwoo 11.5, Taeyoon 11, Diable 10, Teddy 9.5, deokdam 5, LazyFeel 5 |
| support | Duro 23, Keria 17.5, Delight 17.5, Career 16, Effort 13, Kellin 11.5, Lehends 7.5, Namgung 7, Pollu 6.5, Peter 6.5, Andil 6, Life 5 |
| coach | Gen.G 16.5, HLE 12.5, T1 12, DK 11, KT 9.5, BFX 8.5, NS 7.5, BRO 6.5, DRX 6.5, DNS 5 |

Squads, all nine (seven starters and two on the bench) inside ₩100m:

- Chovy, Ruler and Kiin + the cheapest legal 6: ₩102.5m, over. Three ₩23m stars + the cheapest 6:
  ₩99m.
- 2 stars + 2 mid-priced (₩14.5m) + the cheapest legal 5: ₩102m.
- The cheapest legal squad: ₩47m.

Tops sit low because the data has no solo kills, which tops get most; Leaguepedia has them. The
scoring's per-2-kills rule for tops is already in.

## Example squads

The highest-scoring squad on the template's prices with 0 to 3 stars (₩23m or more), picked once
and kept all 2026. The bench costs money but scores nothing: no auto-subs here. Captain on the
top player, never the coach.

| Stars | 2026 pts | Starters (₩m) |
|---|---|---|
| 0 | 1,603 | Doran 12, GIDEON 8.5, Ucal 8, Smash 17.5, Career 16, Kellin 11.5, Gen.G coach 16.5 |
| 1 | **1,628** | Casting 6, GIDEON 8.5, Ucal 8, Peyz 23, Career 16, Kellin 11.5, Gen.G coach 16.5 |
| 2 | 1,558 | Casting 6, GIDEON 8.5, Zeka 23, Peyz 23, Kellin 11.5, Namgung 7, DK coach 11 |
| 3 | 1,334 | DuDu 5, Casting 6, Canyon 23, Clozer 5, Peyz 23, Duro 23, DNS coach 5 |

Bench: the two cheapest left, ₩5m each. Points are flat: Ruler, ₩24.5m, scored 256 in 2026;
Kellin, ₩11.5m, 212. A star scores about a fifth more than a mid-priced pick, for twice the price.
In FPL a star scores nearly twice a budget player's points.

## Backtest: 2025 pricing 2026

2025 alone (the files hold nothing earlier), on 2026's rosters, 48 picks with 2026 points.

- Chovy, Ruler and Kiin + the cheapest legal 6: ₩98.5m. 2 stars + 2 mid-priced (₩12m) + the
  cheapest 5: ₩98.5m. The cheapest squad: ₩50.5m.
- First price against 2026's points per series: r = 0.78 (the first draft: 0.77).

## Weekly moves

Unchanged from the approved shape: form is points per series over the last 8 series, put through
the same pricer; a gap of ₩3m or more moves him ₩0.2m a week. Over 2026's 28 weeks on the
template: 18 moves a week; Keria +1.4 and Faker −2.4 the biggest.

## What the backtest can't test

As approved on 14 Nov 2026 ([spec/02](../../spec/02-prices-and-budget.md)): net transfers of 5%
of managers in or out move a pick one step; owned by under 2% with form not above his price, one
step down; one step a week at most. No managers yet, so untested.
