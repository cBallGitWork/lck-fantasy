# LCK fantasy scoring backtest, 2026

**Contents:** [Decision](#decision) · [Data](#data) · [Scoring tested (per game; all toggles)](#scoring-tested-per-game-all-toggles) · [Headline](#headline) · [Per role, points per series: mean (sd) [90th pct]](#per-role-points-per-series-mean-sd-90th-pct) · [Components](#components) · [Game length (the key concern)](#game-length-the-key-concern) · [Top 15, season total (best 2 games per series)](#top-15-season-total-best-2-games-per-series) · [Surprises](#surprises) · [Files](#files)


## Decision

**Craig's decision, 11 Nov 2026: best 2 games of a series.** A player's series score is his two highest-scoring games added together. In a 2–0 both games count. In a Bo5 it is the best two of three to five. A sub who played one game scores that one game. Best 2 is the headline below; best game, sum and mean stay as comparison.

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

Series: **best 2 games (decided)**; for comparison, best game, sum of games, mean per game.

## Headline

- Points stay low: a game scores 0–12, median 4. **Best 2 averages 8.9 a series** (sd 3.7, 90th pct 14). Best game averages 5.3, series sum 10.5.
- **Best 2 mostly holds the line on long series**: r = 0.38 with games played, close to best game (0.32) and far from the sum (0.68). Mean per game is flat (0.06).
- **A 2–0 winner is no longer beaten by a 2–1 loser** (10.6 v 9.2). Under the sum a 3–2 loser beat a 2–0 winner by 7.9; under best 2 the gap is 0.8.
- **One structural effect stays**: a Bo5 gives three to five tries at two good games, a Bo3 two or three. Bo5 series average 10.6, Bo3 series 8.6.
- **K+A/3 rewards long games for the losing side**: losers' points climb from 1.3 (under 25 min) to 3.8 (40+ min), r = 0.47. Winners are flat (r = −0.07).
- B and C are coin flips by design (exactly half of laners win their lane at 15), so A is 74% of all points.
- D barely fires: only 6% of games end under 25 min (shortest 22.0). 28 min catches 22%, 30 min 38%.

## Per role, points per series: mean (sd) [90th pct]

| variant | top | jng | mid | bot | sup |
|---|---|---|---|---|---|
| **Best 2 games** | 7.35 (2.97) [11] | 9.53 (3.75) [14] | 8.90 (3.59) [13] | 9.06 (3.84) [14] | 9.54 (3.89) [15] |
| Best game | 4.46 (1.68) [7] | 5.78 (2.17) [8.3] | 5.40 (2.06) [8] | 5.41 (2.05) [8] | 5.65 (2.14) [8] |
| Series sum | 8.61 (4.37) [14] | 11.25 (5.38) [18] | 10.39 (5.08) [17] | 10.69 (5.48) [18] | 11.26 (5.64) [19] |
| Mean per game | 3.20 (1.29) [5] | 4.20 (1.68) [6.1] | 3.87 (1.56) [6] | 3.97 (1.69) [6] | 4.27 (1.65) [6.3] |
| Best 2, B tiered | 7.44 | 9.60 | 9.01 | 9.28 | 9.54 |
| Best 2, deaths on | 6.75 | 8.76 | 8.38 | 8.45 | 8.82 |
| Best, B tiered | 4.53 | 5.84 | 5.48 | 5.58 | 5.65 |
| Best, deaths on | 4.20 | 5.43 | 5.19 | 5.15 | 5.35 |

All roles together, best 2: 8.88 (3.71) [14].

Role balance does not change. Top lane was about 1 point a series behind under best game; under best 2 it is 1.5 to 2.2 behind (7.35 v 8.90–9.54). That is the same share, 17–23% below the other roles, on a bigger number. The top 50 by points per series (10+ series) has the same role split under both: 8 top, 10 jng, 10 mid, 12 bot, 10 sup.

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
| **series best 2 vs games played** | **0.38** |
| series best vs games played | 0.32 |
| series sum vs games played | 0.68 |
| series mean vs games played | 0.06 |
| series winners only: best 2 / best / sum | 0.19 / 0.10 / 0.68 |
| series losers only: best 2 / best / sum | 0.64 / 0.55 / 0.80 |
| inside Bo3s only: best 2 / best / sum | 0.31 / 0.29 / 0.48 |
| inside Bo5s only: best 2 / best / sum | 0.34 / 0.33 / 0.54 |

The floor on K+A/3 doesn't remove the length effect: r is the same as for raw K+A.

| game length | games | winners' points | losers' points | K+A/3 |
|---|---|---|---|---|
| under 25 | 29 | 6.32 | 1.27 | 2.30 |
| 25–30 | 164 | 5.33 | 1.84 | 2.60 |
| 30–35 | 175 | 5.23 | 2.64 | 2.95 |
| 35–40 | 89 | 5.21 | 3.40 | 3.31 |
| 40+ | 45 | 5.33 | 3.83 | 3.61 |

Average points per player per series, by the team's scoreline:

| scoreline | n | **best 2** | best | sum | mean |
|---|---|---|---|---|---|
| 2–0 winner | 485 | **10.58** | 6.27 | 10.58 | 5.29 |
| 2–1 winner | 283 | **10.91** | 6.35 | 13.00 | 4.38 |
| 2–1 loser | 281 | **9.16** | 5.70 | 10.78 | 3.61 |
| 2–0 loser | 489 | **4.83** | 3.25 | 4.83 | 2.43 |
| 3–0 winner | 45 | **11.24** | 6.11 | 15.29 | 5.10 |
| 3–1 winner | 65 | **12.18** | 6.74 | 19.08 | 4.77 |
| 3–2 winner | 60 | **11.93** | 6.65 | 20.78 | 4.16 |
| 3–2 loser | 61 | **11.38** | 6.49 | 18.49 | 3.74 |
| 3–1 loser | 66 | **9.30** | 5.52 | 13.14 | 3.35 |
| 3–0 loser | 46 | **6.54** | 4.00 | 8.02 | 2.68 |
| all Bo3 | 1,538 | **8.55** | 5.22 | 9.23 | 3.91 |
| all Bo5 | 343 | **10.56** | 5.99 | 16.15 | 3.97 |

Rows count every player who appeared, subs included.

**Best 2 against the "must not reward long games" concern:**

- **Against the sum, it fixes most of it.** A 2–1 winner beats a 2–0 winner by 0.3, not 2.4. A 2–1 loser (9.2) is below a 2–0 winner (10.6); under the sum he was above (10.8). A 3–2 winner beats a 2–0 winner by 1.4, not 10.2.
- **Against best game, it is slightly worse on length** (r 0.38 v 0.32) but spreads scores more: a 2–0 winner leads a 2–0 loser by 5.8, against 3.0 under best game.
- **Winners gain almost nothing from extra games** (r = 0.19). A 2–0 already counts both games, so a third game can only swap a bad one out.
- **Losers still gain from long series** (r = 0.64; best game 0.55, sum 0.80). A 2–0 loser averages 4.8, a 2–1 loser 9.2, a 3–2 loser 11.4. Most of that is fair: the longer a losing side lasts, the more games it has won. But a 3–2 loser still edges a 2–0 winner, 11.4 v 10.6.
- **The Bo5 effect.** A Bo5 gives three to five tries at two good games; a Bo3 gives two or three. Bo5s average 10.6 against 8.6 for Bo3s, 24% more (best game 15% more, sum 75% more). Even a swept side shows it: a 3–0 loser scores 6.5, a 2–0 loser 4.8. Only 34 of the 188 series are Bo5s, and they are mostly later-stage matches, so better teams are part of that gap too.
- **Game length inside a game is untouched.** The series rule doesn't change part A: losers' points still climb with minutes (table above).

By the player's own games played (subs split out):

| games | won? | best 2 | best | sum | mean |
|---|---|---|---|---|---|
| 2 games | yes / no | 10.58 / 4.89 | 6.26 / 3.28 | 10.58 / 4.89 | 5.29 / 2.45 |
| 3 games | yes / no | 11.03 / 8.86 | 6.35 / 5.50 | 13.43 / 10.48 | 4.48 / 3.49 |
| 4 games | yes / no | 12.18 / 9.34 | 6.74 / 5.54 | 19.08 / 13.29 | 4.77 / 3.32 |
| 5 games | yes / no | 11.93 / 11.54 | 6.65 / 6.58 | 20.78 / 18.83 | 4.16 / 3.77 |

Mean per game is the only variant that ignores length entirely, but it gives a 3-game series winner less than a 2–0 winner.

## Top 15, season total (best 2 games per series)

| # | player | team | role | series | games | best-2 total | per series | best-game total | sum total |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Peyz | T1 | bot | 39 | 109 | 446 | 11.44 | 256 | 533 |
| 2 | Keria | T1 | sup | 39 | 109 | 442 | 11.33 | 255 | 526 |
| 3 | Career | Dplus Kia | sup | 43 | 120 | 432 | 10.05 | 247 | 529 |
| 4 | Canyon | Gen.G | jng | 39 | 100 | 410 | 10.51 | 240 | 487 |
| 5 | Chovy | Gen.G | mid | 39 | 100 | 410 | 10.51 | 240 | 489 |
| 6 | Delight | Hanwha Life | sup | 34 | 93 | 403 | 11.85 | 228 | 486 |
| 7 | Lucid | Dplus Kia | jng | 42 | 117 | 401 | 9.55 | 237 | 502 |
| 8 | Duro | Gen.G | sup | 39 | 100 | 401 | 10.28 | 232 | 475 |
| 9 | Kanavi | Hanwha Life | jng | 36 | 99 | 400 | 11.11 | 234 | 469 |
| 10 | Kellin | BNK FEARX | sup | 40 | 111 | 398 | 9.95 | 240 | 486 |
| 11 | Ruler | Gen.G | bot | 39 | 100 | 393 | 10.08 | 234 | 469 |
| 12 | Smash | Dplus Kia | bot | 43 | 120 | 388 | 9.02 | 222 | 476 |
| 13 | Zeka | Hanwha Life | mid | 36 | 99 | 386 | 10.72 | 224 | 448 |
| 14 | Raptor | BNK FEARX | jng | 40 | 111 | 384 | 9.60 | 226 | 470 |
| 15 | Oner | T1 | jng | 38 | 106 | 380 | 10.00 | 225 | 453 |

The same 15 players lead under best 2, best game and the sum; only the order moves. Against best game, Delight climbs from 11th to 6th and Kellin drops from 4th to 10th. Under the sum Lucid is 4th and Smash 9th (Dplus Kia played the most games). Season totals track how much a player played under every variant (best 2 v series played r = 0.82; sum v games played 0.84; players with 10+ series), so the teams that play the most series lead.

## Surprises

1. **No top laner in the top 15**, and 5 supports are. Supports collect assists, so A favours them; top lanes are isolated.
2. **The losing side gets paid for dragging a game out.** That is the length bias, and it lives in A, not in B, C or D.
3. **D at 25 min is nearly dead** (29 of 502 games). LCK is a slow league: median 31.3 min.
4. **B and C give every role exactly the same average** (a lane lead is zero-sum), so they add spread, not role balance.
5. **C is noisy for supports**: Duro got 17 CS-lead points against Career's 74; support CS is a few minions either way.
6. **Deaths toggle** costs 0.33–0.45 a game, most for junglers and supports.

## Files

- Script: `docs/research/backtest/score.py` (`python3 -I score.py <csv> <out_dir>`; standard library only, pandas isn't installed)
- Raw tables: `docs/research/backtest/tables.md`
- Per player per series (not in the repo): `scratchpad/backtest-best2/backtest-series-points.csv`
- Data: `scratchpad/oe-data/oe2026.csv`
