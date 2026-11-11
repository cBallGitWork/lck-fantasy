# LCK fantasy scoring backtest, 2026

Contents: Data · Scoring tested · Headline · Per role · Components · Game length · Top 15 · Surprises · Files

## Data

- **Source:** Oracle's Elixir `2026_LoL_esports_match_data_from_OraclesElixir.csv`. The official host is now a public Google Drive folder (linked from oracleselixir.com/tools/downloads; the old S3 bucket returns 404 for 2025 and 2026). Drive refused the download ("Quota exceeded", for both 2026 and 2025), so the file came from a **third-party copy on GitHub** (`HKB06/ProjectPredictionLOl`, committed 10 Nov 2026, 79 MB, 118,812 rows). It has the official header and LCK rows look clean, but it is not checksummed against the original; swap in the Drive file once its quota resets.
- **League codes:** `LCK` holds the whole 2026 LCK season, the **LCK Cup included** (as split `Cup`, not a separate code). `LCKC` is LCK Challengers (academy), left out.

| split | playoffs | rows |
|---|---|---|
| Cup | no | 1,500 |
| Rounds 1-2 | no / yes | 2,448 / 240 |
| Rounds 3-4 | no / yes | 1,176 / 660 |

- LCK: 502 games, 188 series (97 went 2 games, 65 went 3, 13 went 4, 12 went 5, 1 shows only 1 game: DK v Gen.G on 1 Aug, probably missing data). 5,020 player-games, 1,891 player-series. All rows `complete`; no blank gold/CS-at-15 values. Last game 13 Sep 2026.
- Series = same day + same two teams. Subs score only the games they played.

## Scoring tested (per game; all toggles)

| part | rule |
|---|---|
| A | 1 pt per 3 kills+assists, rounded down |
| B | gold lead at 15 > 0 → +1 (tiered alt: > 0 → +1, ≥ 1,500 → +2) |
| C | CS lead at 15 > 0 → +1 (**placeholder**) |
| D | win in under 25 min → +1 |
| deaths (off) | −1 per 4 deaths |

Series: (i) best game, (ii) sum of games, (iii) mean per game.

## Headline

- Points stay low: a game scores 0–12, median 4. Best-game-per-series averages 5.3, series sum 10.5.
- **Series sum rewards long series badly** (r = 0.68 with games played). Best game is milder (0.32); mean per game is flat (0.06).
- **K+A/3 rewards long games for the losing side**: losers' points climb from 1.3 (under 25 min) to 3.8 (40+ min), r = 0.47. Winners are flat (r = −0.07).
- B and C are coin flips by design (exactly half of laners win their lane at 15), so A is 74% of all points.
- D barely fires: only 6% of games end under 25 min (shortest 22.0). 28 min catches 22%, 30 min 38%.

## Per role, points per series: mean (sd) [90th pct]

| variant | top | jng | mid | bot | sup |
|---|---|---|---|---|---|
| Best game | 4.46 (1.68) [7] | 5.78 (2.17) [8.3] | 5.40 (2.06) [8] | 5.41 (2.05) [8] | 5.65 (2.14) [8] |
| Series sum | 8.61 (4.37) [14] | 11.25 (5.38) [18] | 10.39 (5.08) [17] | 10.69 (5.48) [18] | 11.26 (5.64) [19] |
| Mean per game | 3.20 (1.29) [5] | 4.20 (1.68) [6.1] | 3.87 (1.56) [6] | 3.97 (1.69) [6] | 4.27 (1.65) [6.3] |
| Best, B tiered | 4.53 | 5.84 | 5.48 | 5.58 | 5.65 |
| Best, deaths on | 4.20 | 5.43 | 5.19 | 5.15 | 5.35 |

Top lane scores about 1 point a series less than every other role.

## Components

| part | share of points | top | jng | mid | bot | sup (mean per game) |
|---|---|---|---|---|---|---|
| A K+A/3 | 74% | 2.21 | 3.19 | 2.88 | 2.99 | 3.33 |
| B gold@15 | 13% | 0.50 | 0.50 | 0.50 | 0.50 | 0.50 |
| C CS@15 | 12% | 0.49 | 0.49 | 0.49 | 0.49 | 0.47 |
| D win < 25 min | 1% | 0.03 | 0.03 | 0.03 | 0.03 | 0.03 |
| B tiered (alt) | — | 0.54 | 0.52 | 0.54 | 0.58 | 0.50 |
| deaths −1/4 (alt) | — | −0.35 | −0.45 | −0.33 | −0.35 | −0.43 |

The tiered gold bonus adds under 0.1 a game; bot gets the most from it.

## Game length (the key concern)

| measure | r |
|---|---|
| raw K+A vs game length | 0.20 |
| A (K+A/3) vs game length | 0.20 |
| B / C vs game length | 0.00 / −0.01 |
| D vs game length | −0.27 |
| base points vs game length | 0.14 |
| — winners only / losers only | −0.07 / 0.47 |
| series best vs games played | 0.32 |
| series sum vs games played | 0.68 |
| series mean vs games played | 0.06 |

The floor on K+A/3 doesn't remove the length effect: r is the same as for raw K+A.

| game length | games | winners' points | losers' points | K+A/3 |
|---|---|---|---|---|
| under 25 | 29 | 6.32 | 1.27 | 2.30 |
| 25–30 | 164 | 5.33 | 1.84 | 2.60 |
| 30–35 | 175 | 5.23 | 2.64 | 2.95 |
| 35–40 | 89 | 5.21 | 3.40 | 3.31 |
| 40+ | 45 | 5.33 | 3.83 | 3.61 |

| series | won? | best | sum | mean |
|---|---|---|---|---|
| 2 games | yes / no | 6.26 / 3.28 | 10.58 / 4.89 | 5.29 / 2.45 |
| 3 games | yes / no | 6.35 / 5.50 | 13.43 / 10.48 | 4.48 / 3.49 |
| 4 games | yes / no | 6.74 / 5.54 | 19.08 / 13.29 | 4.77 / 3.32 |
| 5 games | yes / no | 6.65 / 6.58 | 20.78 / 18.83 | 4.16 / 3.77 |

Under the sum, a 3–2 Bo5 loser (18.8) outscores a 2–0 Bo3 winner (10.6) by nearly double. Best game keeps winners on top; mean per game is the only one that ignores length entirely, but it pays a 3-game series winner less than a 2–0 winner.

## Top 15, season total (best game per series)

| # | player | team | role | series | games | best total | sum total | sum/game |
|---|---|---|---|---|---|---|---|---|
| 1 | Peyz | T1 | bot | 39 | 109 | 256 | 533 | 4.89 |
| 2 | Keria | T1 | sup | 39 | 109 | 255 | 526 | 4.83 |
| 3 | Career | Dplus Kia | sup | 43 | 120 | 247 | 529 | 4.41 |
| 4 | Kellin | BNK FEARX | sup | 40 | 111 | 240 | 486 | 4.38 |
| 5 | Canyon | Gen.G | jng | 39 | 100 | 240 | 487 | 4.87 |
| 6 | Chovy | Gen.G | mid | 39 | 100 | 240 | 489 | 4.89 |
| 7 | Lucid | Dplus Kia | jng | 42 | 117 | 237 | 502 | 4.29 |
| 8 | Ruler | Gen.G | bot | 39 | 100 | 234 | 469 | 4.69 |
| 9 | Kanavi | Hanwha Life | jng | 36 | 99 | 234 | 469 | 4.74 |
| 10 | Duro | Gen.G | sup | 39 | 100 | 232 | 475 | 4.75 |
| 11 | Delight | Hanwha Life | sup | 34 | 93 | 228 | 486 | 5.23 |
| 12 | Raptor | BNK FEARX | jng | 40 | 111 | 226 | 470 | 4.23 |
| 13 | Oner | T1 | jng | 38 | 106 | 225 | 453 | 4.27 |
| 14 | Zeka | Hanwha Life | mid | 36 | 99 | 224 | 448 | 4.53 |
| 15 | Smash | Dplus Kia | bot | 43 | 120 | 222 | 476 | 3.97 |

The series-sum top 15 is the same 15 players, reordered (Lucid 4th, Smash 9th: Dplus Kia played the most games). Season totals track games played (r = 0.84, players with 10+ series), so the teams that play the most series lead.

## Surprises

1. **No top laner in the top 15**, and 5 supports are. Supports collect assists, so A favours them; top lanes are isolated.
2. **The losing side gets paid for dragging a game out.** That is the length bias, and it lives in A, not in B, C or D.
3. **D at 25 min is nearly dead** (29 of 502 games). LCK is a slow league: median 31.3 min.
4. **B and C give every role exactly the same average** (a lane lead is zero-sum), so they add spread, not role balance.
5. **C is noisy for supports**: Duro got 17 CS-lead points against Career's 74; support CS is a few minions either way.
6. **Deaths toggle** costs 0.33–0.45 a game, most for junglers and supports.

## Files

- Script: `scratchpad/backtest/score.py` (`python3 -I score.py <csv> <out_dir>`; standard library only, pandas isn't installed)
- Per player per series: `scratchpad/backtest-series-points.csv`
- Raw tables: `scratchpad/backtest-tables.md`
- Data: `scratchpad/oe-data/oe2026.csv`
