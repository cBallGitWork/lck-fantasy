# Stats: references

Research for the Stats page (spec/12, The pages). Gathered 15 Nov 2026 with web search and fetch only, plus the repo's earlier survey. Anything not seen on a fetched page is marked **Unverified**.

## What could not be reached

- FPL's Statistics page renders in the browser; a fetch returned only its title. The FPL facts below come from `docs/research/fantasy-site-pages/fpl.md`, which read the live page with a browser on 13 Nov 2026.
- Oracle's Elixir's stats pages render in the browser; a fetch returned only the title.
- Leaguepedia returns 402 to fetches. Naver's esports pages refuse fetches (see the LCK hub references).

## 1. FPL: Statistics

- Public, at `/en/statistics`, in the signed-out bar. Source: https://fantasy.premierleague.com/en/statistics (via `fpl.md`).
- Controls: "Find a player" search; **View** (All players, Watchlist, each position, each of the 20 clubs); **Sorted by** (Total points by default, then over 40 stats: GW points, price, selected by %, form, goals, bonus, ICT, value, transfers in and out, price rise and fall, xG and more); **Max cost**; Reset. Source: same.
- Columns: Player, £, TSB (selected by), Form, then the sorted stat only. A caption says what that stat is ("Total points earned this season."). Source: same.
- A row's info button opens the player modal: a stat strip with ranks ("1 of 219"), last 3 and next 3 fixtures, History and Fixtures tabs. Source: same.
- The same list sits on Transfers. Source: https://www.premierleague.com/news/2176606
- Help glosses some stats: "Points per match" for players who missed games; "Value (season)" as points per million; Form as the last 30 days. Source: same.
- A "?" help icon sits on Statistics. Source: https://fantasy.premierleague.com/en/help (via `fpl.md`).
- **Teaches:** a few fixed columns plus one chosen stat keeps 40 stats readable; filters are few and plain; the list is a door to the player card.

## 2. Community FPL tools

- onefpl.com's player list has tabs per stat group (e.g. xG). Source: https://onefpl.com/players?tab=xg (search snippet only).
- **Teaches:** grouping stats into tabs is the common answer when one sort menu gets long.

## 3. gol.gg: player list

- Filters: Season, Split, Tournament, Role (ALL, TOP, JUNGLE, MID, BOT, SUPPORT), Leagues. No minimum games filter. Source: https://gol.gg/players/list/season-S16/split-ALL/tournament-ALL/
- Columns: Player, Country, Games, Win rate, KDA, Avg kills, Avg deaths, Avg assists, CSM, GPM, KP%, DMG%, Gold%, VS%, DPM, VSPM, ward stats, GD@15, CSD@15, XPD@15, FB %, FB Victim, Penta Kills, Solo Kills. "Copy table to clipboard". Source: same.
- A player's page has Statistics, Match list, Career History tabs, then General stats, laning, damage and kills (solo kills), vision and champion pool. Values are raw, not against an average. Source: https://gol.gg/players/player-stats/2063/season-ALL/split-ALL/tournament-ALL/
- Team tables add FB% and FT% (first tower), drakes and barons per game. Source: https://gol.gg/teams/list/season-ALL/split-ALL/tournament-LCK%20Summer%202024/ (search snippet).
- **Teaches:** LoL fans read a role filter first and per-game averages, not totals. GD@15, solo kills and first blood are already stats they know, so Flol's lines are familiar words. Team tables are the model for the coach list.

## 4. Oracle's Elixir

- Flol's settled stats come from its daily file (spec/11). The site offers filterable player and team tables and a free non-commercial download. Source: https://grid.gg/oracles-elixir-brings-cutting-edge-valorant-stats-to-esports-fans/ (search summary).
- Columns such as GD10, XPD10, CSPM: **Unverified**; the page was not read.
- **Teaches:** the "@10" and "@15" style is the fan's way to write an early-game lead.

## 5. Leaguepedia

- Each split has a Player Statistics page, and each champion and player a Statistics page per year. Source: https://lol.fandom.com/wiki/LCK_CL/2025_Season/Rounds_3-5/Player_Statistics (search result title). Columns **Unverified**.
- **Teaches:** academy (LCK CL) players have their own stats pages, so listing them is normal.

## 6. Korean sites

- Inven's 선수기록 (player records) lists games, newest first: 일자, 경기 정보, 소환사명, 챔피언, 소환주문, 승패, K, D, A, KDA, 킬관여율. Filters: league and season (LCK by year; 스프링, 서머, PS), 선수명, 챔피언, 상대 선수, a date range. No sort and no position filter seen; it covers to 2024 under "LoL 기록실(구)". Source: https://lol.inven.co.kr/dataninfo/match/playerList.php
- Inven Global ran KDA top 10 tables, plus a mid-only top 5. Source: https://labs.invenglobal.com/articles/2685/longzhu-bdd-dominates-kda-ratio-leaderboard-in-lck-summer-2017
- Naver esports' stat pages: **Unverified**; not reached.
- **Teaches:** Korean readers expect K, D, A and KDA as separate columns, and leaderboards by role.

## Layout ideas

1. FPL's controls in one row: search, View, Sorted by, Max price, with Players | Coaches beside them.
2. Fixed columns from the Transfers picture (role, name, team, price ▲ ▼, form, owned, points), then the sorted line, highlighted.
3. FPL's caption under Sorted by is an explainer sentence; Craig's standing answer is labels and data, no explainer lines, so the line's name alone heads its column.
4. Role chips (Top, Jungle, Mid, Bot, Support) as gol.gg's role filter, in the LCK's order.
5. Totals | Per game toggle, as the card's Season panel.
