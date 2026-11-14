# Price formula: a draft for Craig

Claude's draft for #23, not Craig's answers: nothing here is the product until Craig approves it
and `spec/02` says so. Every number is a setting, data per competition. Backtested 14 Nov 2026 with
[backtest/prices.ts](backtest/prices.ts), using the game's own scoring code: first prices from
2025's LCK, then weekly moves over 2026's.

**Contents:** [First prices](#first-prices) · [Weekly moves](#weekly-moves) ·
[What the backtest can't test](#what-the-backtest-cant-test) · [For Craig](#for-craig)

## First prices

- A pick's last-season points per series (best 2 games, the coach with its +3 and −1) map onto a
  straight line from the floor to the top price, rounded to 0.5억.
- The best scorer gets the top price, 20억. The pick at the 10th percentile, and anyone below,
  gets the floor, 5억. These are spec/02's guide numbers: stars about 18–22억, cheap picks about 5억.
- A pick with fewer than 10 series last season is a rookie, priced by hand.
- Coaches go on the same line as players, so the top coaches come out dearer on their own scores,
  as Craig asked.

Backtest, 2025's data pricing 2026:

| Role | picks | cheapest | median | dearest |
|---|---|---|---|---|
| top | 8 | 5.0 | 10.0 | 16.0 |
| jungle | 8 | 5.0 | 12.0 | 16.5 |
| mid | 8 | 6.5 | 11.5 | 18.0 |
| bot | 8 | 6.5 | 14.0 | 20.0 |
| support | 9 | 5.0 | 9.0 | 16.0 |
| coach | 9 | 5.0 | 9.5 | 17.0 |

- The dearest are Ruler 20.0억, Chovy 18.0, Gen.G's coach 17.0, then Aiming, Canyon and Gumayusi at 16.5.
- 50 picks get a price from the formula. 13 who played 10 or more series in 2026 had no 2025 data
  and would be priced by hand.
- First price against 2026's points per series: r = 0.77. Last season is a fair guide, and still
  leaves room for value picks.

## Weekly moves

At each deadline, a pick's form is his points per series over his last 8 series (about 4 weeks),
put through the same line as first prices. If that form price is 3억 or more above his price, he
rises by 0.2억; 3억 or more below, he falls by 0.2억. Otherwise he stays. A price never goes below
the floor.

Backtest over 2026's 28 weeks, on points alone:

- 17 moves a week among about 60 picks.
- Biggest risers: Ucal +2.2억, GIDEON +2.0, VicLa and Zeka +1.8.
- Biggest fallers: Siwoo −3.2억, deokdam −2.8, Clozer and Gumayusi −2.4.
- At the season's end the cheapest pick is 5.0억 and the dearest 18.2억.

Drafts tried first moved a share of the gap, capped. Every move hit the cap, so a fixed step says
the same thing more simply, as FPL's fixed ±0.1m steps do.

## What the backtest can't test

spec/02 also moves prices "a little on transfers in and out, and down when relatively few
managers own the player". There are no managers yet, so the draft adds two terms the backtest
can't check:

- **Transfers:** a pick whose net transfers in for the week reach 5% of managers rises one step,
  and one whose net transfers out reach 5% falls one step. This applies even when his form says stay.
- **Ownership:** a pick owned by fewer than 2% of managers, whose form isn't above his price, falls
  one step.
- **One step a week at most,** whichever term moves him.

## For Craig

1. Is the shape right: first prices on a line from last season, then one fixed step a week on
   form? Example: over 2026, Ucal climbs from 6.5억 to 8.7억, Siwoo falls from 12.0억 to 8.8억, and Ruler from 20.0억 to 18.2억.
2. Are the two terms in "What the backtest can't test" what you meant, and are 5% and 2% about right?
