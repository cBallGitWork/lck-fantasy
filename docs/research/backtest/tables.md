## Data
| league | split | playoffs | rows |
|---|---|---|---|
| LCK | Cup | 0 | 1500 |
| LCK | Rounds 1-2 | 0 | 2448 |
| LCK | Rounds 1-2 | 1 | 240 |
| LCK | Rounds 3-4 | 0 | 1176 |
| LCK | Rounds 3-4 | 1 | 660 |
| LCKC | Kickoff | 0 | 1404 |
| LCKC | Rounds 1-2 | 0 | 2652 |
| LCKC | Rounds 3-4 | 0 | 1224 |
| LCKC | Rounds 3-4 | 1 | 612 |

LCK games: 502; series: 188; games per series: {1: 1, 2: 97, 3: 65, 4: 13, 5: 12}; player-game rows: 5020; player-series rows: 1891

## Game lengths (min)
min 22.0, p10 25.8, p25 28.4, median 31.3, p75 35.6, p90 39.4, max 50.2

| game under | share of games |
|---|---|
| 22 min | 0% |
| 24 min | 2% |
| 25 min | 6% |
| 26 min | 11% |
| 28 min | 22% |
| 30 min | 38% |

## Per-game points (base A+B+C+D) distribution
| pts | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| share | 4.6% | 10.4% | 14.0% | 15.7% | 16.1% | 14.3% | 11.8% | 6.8% | 4.1% | 1.5% | 0.6% | 0.1% | 0.0% |

## Per-role points per series: mean (sd) [p90]
| variant | top | jng | mid | bot | sup | all |
|---|---|---|---|---|---|---|
| Best game | 4.46 (1.68) [7.0] | 5.78 (2.17) [8.3] | 5.40 (2.06) [8.0] | 5.41 (2.05) [8.0] | 5.65 (2.14) [8.0] | 5.34 (2.08) [8.0] |
| Series sum | 8.61 (4.37) [14.0] | 11.25 (5.38) [18.0] | 10.39 (5.08) [17.0] | 10.69 (5.48) [18.0] | 11.26 (5.64) [19.0] | 10.45 (5.30) [17.0] |
| Series mean/game | 3.20 (1.29) [5.0] | 4.20 (1.68) [6.1] | 3.87 (1.56) [6.0] | 3.97 (1.69) [6.0] | 4.27 (1.65) [6.3] | 3.90 (1.63) [6.0] |
| Best, B tiered | 4.53 (1.73) [7.0] | 5.84 (2.23) [9.0] | 5.48 (2.15) [8.0] | 5.58 (2.19) [8.0] | 5.65 (2.14) [8.0] | 5.42 (2.14) [8.0] |
| Sum, B tiered | 8.71 (4.44) [14.3] | 11.32 (5.45) [18.0] | 10.50 (5.16) [17.0] | 10.92 (5.67) [19.0] | 11.26 (5.64) [19.0] | 10.55 (5.38) [17.0] |
| Best, deaths on | 4.20 (1.81) [7.0] | 5.43 (2.37) [8.0] | 5.19 (2.16) [8.0] | 5.15 (2.20) [8.0] | 5.35 (2.32) [8.0] | 5.07 (2.23) [8.0] |
| Sum, deaths on | 7.67 (4.33) [13.0] | 10.05 (5.44) [17.0] | 9.52 (5.09) [16.0] | 9.76 (5.50) [17.0] | 10.16 (5.63) [17.0] | 9.44 (5.30) [16.0] |

## Component share of base points (all games), and mean per game by role
| component | share | top | jng | mid | bot | sup |
|---|---|---|---|---|---|---|
| A K+A/3 | 74% | 2.21 | 3.19 | 2.88 | 2.99 | 3.33 |
| B gold@15>0 | 13% | 0.50 | 0.50 | 0.50 | 0.50 | 0.50 |
| C cs@15>0 | 12% | 0.49 | 0.49 | 0.49 | 0.49 | 0.47 |
| D win<25m | 1% | 0.03 | 0.03 | 0.03 | 0.03 | 0.03 |
| B tiered (alt) | — | 0.54 | 0.52 | 0.54 | 0.58 | 0.50 |
| deaths -1/4 (alt) | — | -0.35 | -0.45 | -0.33 | -0.35 | -0.43 |

## Game-length bias (Pearson r)
| measure | r |
|---|---|
| per game: A K+A/3 vs game length | 0.20 |
| per game: B gold@15>0 vs game length | 0.00 |
| per game: C cs@15>0 vs game length | -0.01 |
| per game: D win<25m vs game length | -0.27 |
| per game: deaths -1/4 (alt) vs game length | -0.11 |
| per game: base points vs game length | 0.14 |
| per game: raw K+A vs game length | 0.20 |
| winners only: base points vs length | -0.07 |
| losers only: base points vs length | 0.47 |
| per series: best vs games played | 0.32 |
| per series: best vs total series minutes | 0.31 |
| per series: sum vs games played | 0.68 |
| per series: sum vs total series minutes | 0.67 |
| per series: mean vs games played | 0.06 |
| per series: mean vs total series minutes | 0.07 |

### Mean points per series by games played and series result
| games | won series? | n | best | sum | mean |
|---|---|---|---|---|---|
| 1 | yes | 5 | 2.60 | 2.60 | 2.60 |
| 1 | no | 19 | 1.89 | 1.89 | 1.89 |
| 2 | yes | 488 | 6.26 | 10.58 | 5.29 |
| 2 | no | 485 | 3.28 | 4.89 | 2.45 |
| 3 | yes | 322 | 6.35 | 13.43 | 4.48 |
| 3 | no | 323 | 5.50 | 10.48 | 3.49 |
| 4 | yes | 65 | 6.74 | 19.08 | 4.77 |
| 4 | no | 65 | 5.54 | 13.29 | 3.32 |
| 5 | yes | 60 | 6.65 | 20.78 | 4.16 |
| 5 | no | 59 | 6.58 | 18.83 | 3.77 |

### Mean per-game points by game-length band, winners vs losers
| length | n games | winners | losers | K+A/3 (all) |
|---|---|---|---|---|
| 0-25 | 29 | 6.32 | 1.27 | 2.30 |
| 25-30 | 164 | 5.33 | 1.84 | 2.60 |
| 30-35 | 175 | 5.23 | 2.64 | 2.95 |
| 35-40 | 89 | 5.21 | 3.40 | 3.31 |
| 40-+ | 45 | 5.33 | 3.83 | 3.61 |

## Top 15 by season total (best game per series)
| # | player | team | role | series | games | best-game total | sum total | sum/game | A | B | C | D |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Peyz | T1 | bot | 39 | 109 | 256 | 533 | 4.89 | 375 | 84 | 70 | 4 |
| 2 | Keria | T1 | sup | 39 | 109 | 255 | 526 | 4.83 | 413 | 67 | 42 | 4 |
| 3 | Career | Dplus Kia | sup | 43 | 120 | 247 | 529 | 4.41 | 384 | 66 | 74 | 5 |
| 4 | Kellin | BNK FEARX | sup | 40 | 111 | 240 | 486 | 4.38 | 386 | 55 | 44 | 1 |
| 5 | Canyon | Gen.G | jng | 39 | 100 | 240 | 487 | 4.87 | 376 | 55 | 53 | 3 |
| 6 | Chovy | Gen.G | mid | 39 | 100 | 240 | 489 | 4.89 | 346 | 66 | 74 | 3 |
| 7 | Lucid | Dplus Kia | jng | 42 | 117 | 237 | 502 | 4.29 | 357 | 63 | 77 | 5 |
| 8 | Ruler | Gen.G | bot | 39 | 100 | 234 | 469 | 4.69 | 358 | 53 | 55 | 3 |
| 9 | Kanavi | Hanwha Life Esports | jng | 36 | 99 | 234 | 469 | 4.74 | 350 | 58 | 55 | 6 |
| 10 | Duro | Gen.G | sup | 39 | 100 | 232 | 475 | 4.75 | 407 | 48 | 17 | 3 |
| 11 | Delight | Hanwha Life Esports | sup | 34 | 93 | 228 | 486 | 5.23 | 355 | 60 | 66 | 5 |
| 12 | Raptor | BNK FEARX | jng | 40 | 111 | 226 | 470 | 4.23 | 363 | 60 | 46 | 1 |
| 13 | Oner | T1 | jng | 38 | 106 | 225 | 453 | 4.27 | 359 | 43 | 47 | 4 |
| 14 | Zeka | Hanwha Life Esports | mid | 36 | 99 | 224 | 448 | 4.53 | 333 | 57 | 52 | 6 |
| 15 | Smash | Dplus Kia | bot | 43 | 120 | 222 | 476 | 3.97 | 339 | 66 | 66 | 5 |

## Top 15 by season total (series sum)
| # | player | team | role | series | games | best-game total | sum total | sum/game | A | B | C | D |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Peyz | T1 | bot | 39 | 109 | 256 | 533 | 4.89 | 375 | 84 | 70 | 4 |
| 2 | Career | Dplus Kia | sup | 43 | 120 | 247 | 529 | 4.41 | 384 | 66 | 74 | 5 |
| 3 | Keria | T1 | sup | 39 | 109 | 255 | 526 | 4.83 | 413 | 67 | 42 | 4 |
| 4 | Lucid | Dplus Kia | jng | 42 | 117 | 237 | 502 | 4.29 | 357 | 63 | 77 | 5 |
| 5 | Chovy | Gen.G | mid | 39 | 100 | 240 | 489 | 4.89 | 346 | 66 | 74 | 3 |
| 6 | Canyon | Gen.G | jng | 39 | 100 | 240 | 487 | 4.87 | 376 | 55 | 53 | 3 |
| 7 | Kellin | BNK FEARX | sup | 40 | 111 | 240 | 486 | 4.38 | 386 | 55 | 44 | 1 |
| 8 | Delight | Hanwha Life Esports | sup | 34 | 93 | 228 | 486 | 5.23 | 355 | 60 | 66 | 5 |
| 9 | Smash | Dplus Kia | bot | 43 | 120 | 222 | 476 | 3.97 | 339 | 66 | 66 | 5 |
| 10 | Duro | Gen.G | sup | 39 | 100 | 232 | 475 | 4.75 | 407 | 48 | 17 | 3 |
| 11 | Raptor | BNK FEARX | jng | 40 | 111 | 226 | 470 | 4.23 | 363 | 60 | 46 | 1 |
| 12 | Ruler | Gen.G | bot | 39 | 100 | 234 | 469 | 4.69 | 358 | 53 | 55 | 3 |
| 13 | Kanavi | Hanwha Life Esports | jng | 36 | 99 | 234 | 469 | 4.74 | 350 | 58 | 55 | 6 |
| 14 | Oner | T1 | jng | 38 | 106 | 225 | 453 | 4.27 | 359 | 43 | 47 | 4 |
| 15 | Zeka | Hanwha Life Esports | mid | 36 | 99 | 224 | 448 | 4.53 | 333 | 57 | 52 | 6 |

Season totals, players with 10+ series (n=53): r(sum total, games played) = 0.84; r(best total, series played) = 0.84

Top 50 by best-game points per series (10+ series), by role: {'sup': 10, 'bot': 12, 'jng': 10, 'mid': 10, 'top': 8}

Supports: share of games with csdiffat15 > 0 = 47%; blank golddiffat15/csdiffat15 rows in LCK: see console
