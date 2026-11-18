# Truck lines, drafts for Craig

A database: each line is chosen to fit the receiver's week. ★ = top pick (3 per kind). Weight 1–3 is how often it comes up. Same rows in truck-lines.json. All drafts; Craig picks.

| id | kind | trigger | text | sponsor | placeholders | weight | top |
|---|---|---|---|---|---|---|---|
| p01 | jeer | carry_blank | MANAGEMENT MUST EXPLAIN THE ARMBAND. {carryPts} PTS. |  | carryPts | 3 | ★ |
| p02 | jeer | carry_blank | WE DEMAND THE ARMBAND MEETING MINUTES. ALL OF THEM. |  |  | 2 |  |
| p03 | jeer | carry_blank | CARRY PICKED BY COIN TOSS? 해명하라 (EXPLAIN). |  |  | 2 |  |
| p04 | jeer | carry_blank | "SHOULD'VE CAPTAINED" IS NOT A STRATEGY. EXPLAIN. |  |  | 2 |  |
| p05 | jeer | took_hits | THIS TRUCK WAS FUNDED BY YOUR -{hits}. |  | hits | 3 | ★ |
| p06 | jeer | took_hits | -{hits} FOR A SIDEWAYS TRANSFER. WHO SIGNED THIS OFF? |  | hits | 2 |  |
| p07 | jeer | took_hits | RAGE TRANSFERS ARE NOT A RECOVERY PLAN. |  |  | 2 |  |
| p08 | jeer | rank_down | RED ARROW, {move}. 책임져라 (TAKE RESPONSIBILITY). |  | move | 2 |  |
| p09 | jeer | rank_down | RED ARROW SEASON. WE WANT A TOWN HALL. 간담회 NOW. |  |  | 2 |  |
| p10 | jeer | bottom_of_league | {team} FANS DEMAND A HANDWRITTEN 사과문 (APOLOGY). |  | team | 3 |  |
| p11 | jeer | bottom_of_league | LAST IN {league}. PAST GLORY IS ALL WE HAVE LEFT. |  | league | 2 |  |
| p12 | jeer | bottom_of_league | BOTTOM OF {league}. EVEN YOUR RIVALS FEEL BAD, MATE. |  | league | 1 |  |
| p13 | jeer | bench_outscored_starters | {bench} ON THE BENCH. NOT A HEADACHE. A MIGRAINE. |  | bench | 3 | ★ |
| p14 | jeer | bench_outscored_starters | THE BENCH OUTSCORED THE STARTERS. 해명하라 (EXPLAIN). |  |  | 2 |  |
| p15 | jeer | no_transfer | NO TRANSFER AGAIN. IS ANYONE AT HEADQUARTERS? |  |  | 2 |  |
| p16 | jeer | no_transfer | SET AND FORGET IS NOT A PHILOSOPHY. IT'S A NAP. |  |  | 2 |  |
| p17 | jeer | no_transfer | PLAYING THE LONG GAME? THIS ISN'T A 50-MINUTE LCK MATCH. |  |  | 2 |  |
| p18 | jeer | buff_wasted | BUFF PLAYED. BUFF BOTTLED. 해명하라 (EXPLAIN). |  |  | 2 |  |
| p19 | jeer | buff_wasted | BUFF SAVED SINCE WEEK 1. SPENT ON THIS? 각성하라 (WAKE UP). |  |  | 2 |  |
| p20 | jeer | price_flop | {price} SPENT. WE DEMAND TO SEE THE SPREADSHEET. |  | price | 2 |  |
| p21 | jeer | price_flop | {price} ON ONE PICK. WHO APPROVED THIS BUDGET? |  | price | 2 |  |
| p22 | jeer | price_flop | PRICE-RISE CHASING IS NOT SCOUTING. 해명하라 (EXPLAIN). |  |  | 2 |  |
| p23 | jeer | low_score | FAN PATIENCE: 0/10/0. (A KDA) |  |  | 3 |  |
| p24 | jeer | low_score | {points} POINTS. WE ARE NOT ANGRY. WE ARE GUTTED. |  | points | 2 |  |
| p25 | jeer | low_score | 각성하라 (WAKE UP). {points} PTS IS NOT A STRATEGY. |  | points | 2 |  |
| p26 | jeer | any | THE TEMPLATE WAS RIGHT THERE, MATE. |  |  | 2 |  |
| p27 | jeer | any | WE PARKED HERE. YOUR SQUAD ISN'T MOVING EITHER. |  |  | 2 |  |
| p28 | jeer | any | THE TRUCK DRIVER HAS ALSO LOST FAITH. |  |  | 2 |  |
| p29 | jeer | any | MANAGEMENT IS STILL IN BASE. RECALL IS NOT A PLAN. |  |  | 1 |  |
| p30 | jeer | any | OVERALL RANK IS A NUMBER. YOURS IS A LONG ONE. |  |  | 2 |  |
| p31 | jeer | any | BANDWAGON MISSED. KNEE-JERK TAKEN. EXPLAIN. |  |  | 1 |  |
| c01 | cheer | carry_big | {carryPts} FROM {carry}. 수고했어요 (WELL PLAYED)! |  | carryPts, carry | 3 |  |
| c02 | cheer | carry_big | ARMBAND ON {carry}. PROPER CARRY PICK, MATE. |  | carry | 2 |  |
| c03 | cheer | rank_up | GREEN ARROW, {move}. ICED AMERICANO ON THE HOUSE. |  | move | 2 |  |
| c04 | cheer | rank_up | GREEN ARROW SEASON. 화이팅 (YOU'VE GOT THIS)! |  |  | 2 |  |
| c05 | cheer | rank_up | OR GOING GREEN. TEAM VALUE UP. 화이팅! |  |  | 2 |  |
| c06 | cheer | top_of_league | TOP OF {league}. YOUR MINI-LEAGUE RIVALS ARE GUTTED. |  | league | 3 | ★ |
| c07 | cheer | top_of_league | TOP OF {league}. 대박 (AMAZING). DRINK UP. |  | league | 2 |  |
| c08 | cheer | buff_played | BUFF PLAYED, BUFF PAID. CHEEKY. 화이팅! |  |  | 2 |  |
| c09 | cheer | buff_played | REMAKE OR LIMITLESS, EITHER WAY: CHEEKY. 화이팅! |  |  | 2 |  |
| c10 | cheer | buff_played | BUFF WEEK DONE PROPER. LATTE INCOMING. |  |  | 2 |  |
| c11 | cheer | high_score | {points} POINTS! 커피차 (COFFEE TRUCK) FOR {team}! |  | points, team | 3 |  |
| c12 | cheer | high_score | {points} PTS. 대상혁 (FAKER, THE GOAT) WOULD APPROVE. |  | points | 2 |  |
| c13 | cheer | any | CHOVY CS. RULER DPS. YOUR SQUAD. 화이팅! |  |  | 3 | ★ |
| c14 | cheer | any | THIS COFFEE IS KERIA-TIER SUPPORT. |  |  | 3 | ★ |
| c15 | cheer | any | {player} IN YOUR SQUAD. PROPER TASTE, MATE. |  | player | 2 |  |
| c16 | cheer | any | {team}: A DIFFERENTIAL IN A TEMPLATE WORLD. |  | team | 2 |  |
| c17 | cheer | any | BENCH HEADACHE? HAVE A COFFEE, MATE. |  |  | 1 |  |
| c18 | cheer | any | AUTO-SUB SAVIOUR? NO, MATE. YOU ARE. |  |  | 2 |  |
| c19 | cheer | any | HAPPY GAMEWEEK. PLEASE PENTAKILL. |  |  | 1 |  |
| s01 | sponsor | high_score | WINNER WINNER, GANK CHICKEN. {points} PTS. | 갱 치킨 Gank Chicken | points | 3 | ★ |
| s02 | sponsor | high_score | ELDER BUFF FOR {team}. {points} PTS. | 엘더 인삼 Elder Ginseng | team, points | 2 |  |
| s03 | sponsor | high_score | SPICY WEEK. {points} PTS. RED BUFF ON US. | 레드 버프 떡볶이 Red Buff Tteokbokki | points | 2 |  |
| s04 | sponsor | top_of_league | TOP OF {league}. WE KNOW HOW 2-0 LEADS END. | 역스윕 침대 Reverse Sweep Mattress | league | 3 | ★ |
| s05 | sponsor | top_of_league | {team} TOPS {league}. UNKILLABLE. | 불사대마왕 에너지 Unkillable Demon King Energy | team, league | 2 |  |
| s06 | sponsor | carry_big | THE CARRY GETS THE CREDIT. WE DELIVERED THE ASSISTS. | 서폿 택배 Support Delivery |  | 3 | ★ |
| s07 | sponsor | carry_big | {carryPts} FROM THE ARMBAND. INSURED. MOSTLY. | 바론 스틸 보험 Baron Steal Insurance | carryPts | 2 |  |
| s08 | sponsor | rank_up | {team} MOVED UP {move}. WE HANDLED THE GAP. | 미드 갭 이사 Mid Gap Movers | team, move | 2 |  |
| s09 | sponsor | rank_up | GREEN ARROW. {team} SAW IT ALL COMING. | 와드 안경 Ward Opticians | team | 2 |  |
| s10 | sponsor | buff_played | THE LONG GAME PAID OFF. SLOW-COOKED, PROPER. | 50분 라면 50-Minute Ramyeon |  | 2 |  |
| s11 | sponsor | buff_played | BUFF CASHED IN. ENJOY YOUR ISLAND. NOBODY VISITS. | 탑 아일랜드 여행사 Top Island Travel |  | 2 |  |
| s12 | sponsor | any | {team} WINS THE WEEK. A CLEAR DIFF. | 정글 차이 은행 Jungle Diff Bank | team | 2 |  |
| s13 | sponsor | any | {team} TOOK {league} SOLO. SPOTLESS. | 솔로킬 세탁소 Solo Kill Dry Cleaners | team, league | 1 |  |
