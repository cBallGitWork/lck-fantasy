# Series page: references

Research for the Series page: one series, its games and each player's lines in each game (spec/12 line 36). Gathered 15 Nov 2026 with web search, web fetch and FPL's public API. Anything not confirmed by a fetched page, the API or a search result is marked **Unverified**.

## What could not be reached

- FPL's site and the Premier League's match centre render in the browser; fetches return only the title. FPL's own API was read instead.
- lolesports.com match and VOD pages render in the browser. Only third-party descriptions were found.
- Oracle's Elixir's site returned only its title. Leaguepedia (402) and Liquipedia (403) block fetches, as in the hub research.
- gol.gg's series Summary page reset the connection. Its game pages could be read.
- Sheep Esports' match pages sit behind its security check.

## 1. FPL: the fixture and its stats

- Craig's screenshot of FPL's match page (13 Nov 2026): the score, gameweek and date, tabs Match Details and Player Stats, a link to each club's report, then goals, assists, cards, saves and bonus points, split by side. Source: `docs/research/fantasy-site-pages-survey.md`, row 25.
- FPL's fixtures API gives each finished fixture the score, minutes, `finished` and `finished_provisional`, and a stats list. The stats are goals scored, assists, own goals, penalties saved, penalties missed, yellow cards, red cards, saves, bonus, BPS and defensive contribution. Each splits into home (`h`) and away (`a`), each a list of player and value. Source: https://fantasy.premierleague.com/api/fixtures/?event=10 (read 15 Nov 2026).
- The match lists only stats that score or decide bonus. No shots, possession or passes.
- Live BPS shows by opening a match from the Fixtures tab; in the app, Fixtures and Results, then the match. Source: search summary of https://www.fantasyfootballhub.co.uk/articles/fpl-bonus-points
- The Points view has the same fixtures panel under the pitch. Source: `docs/research/fantasy-site-pages/fpl.md`.
- **Teaches:** one series, each stat split by side, only what scores. Provisional and final are flags on the same record.

## 2. lolesports.com

- Some finished schedule rows hide the score behind "Reveal spoilers"; not every row has it. Source: https://www.techbloat.com/riots-lol-esports-schedule-match-info-scores-and-replay-options.html (third-party).
- A match page offers VODs by provider and language, with a game selector where available. It may hold the full broadcast or one game. Source: same, and https://techyorker.com/lol-esports-vods-schedules-and-scores-find-official-match-links/ (third-party).
- **Unverified:** any per-player stats on the match page. An undated review says the VOD stats panel did not work for LCK games. Source: search summary, https://www.esportsheaven.com/?p=6872
- **Teaches:** VODs live per game, and some fans want results hidden.

## 3. gol.gg

- A game page's title is the two teams, then the tournament, "Fearless Draft", the date and the week. Series tabs: Preview, Game 1, Game 2, Game 3, Summary. Game sub-tabs: Summary, All stats, Builds, Timeline, Plays. Source: https://gol.gg/game/stats/77262/page-game/
- The header shows no series score, only the game's result, length and patch. Source: https://gol.gg/game/stats/77264/page-game/
- Each team block: WIN or LOSS, kills, towers, drakes by type, barons, team gold, first blood and first tower marks, five bans, five picks. Then one row per player: champion, name, runes, spells, items, K/D/A, CS. Source: the 77262 page above.
- Below: an event timeline, plates, gold and damage share by role, vision. Source: same.
- `page-fullstats` holds the full per-player table: KDA, CS, gold, vision, damage. Source: https://gol.gg/game/stats/71620/page-fullstats (search result).
- **Teaches:** the game tabs across the top of a series, and a team block with the objectives the coach scores on.

## 4. Oracle's Elixir

- One CSV per year, about one row per player per game: K, D, A, CS, gold, damage, vision, gold and CS difference at 15, game length. Updated daily. Source: `docs/research/live-data-sources.md`, section 5, and https://oracleselixir.com/tools/downloads
- Its site has stats tables and player profiles with split-by-split stats and champion pools. Source: https://www.patreon.com/oracleselixir/posts/player-profiles-46107331 (search summary).
- No page showing one series and its games was found. **Unverified** whether one exists.
- **Teaches:** the data is per game per player, so the page's grid is the data's shape. Gold at 15 is the line it carries that others don't.

## 5. Leaguepedia

- Tournament pages carry tabs Overview, Team Rosters, Picks & Bans, Scoreboards, Runes, Match History, Champion Stats, Player Stats. Source: https://lol.fandom.com/wiki/LCK/2026_Season/Cup (search snippet).
- Its scoreboard table holds name, team, champion, role, K, D, A, gold, CS, damage, vision, items, runes, pentakills and win. Source: `docs/research/live-data-sources.md`, section 6.
- **Unverified:** the scoreboard's layout; the page was not reached.

## 6. The LCK broadcast's post-game

- Each game has a Player of the Game, voted by a panel of casters, observers and press; the season's POG points crown the Player of the Split. Panel size changed over the years. Sources: https://www.leagueoflegends.com/ko-kr/news/esports/2020-lck-awards-announcement/ and https://www.invenglobal.com/articles/18760/gen-chovy-on-being-tied-with-faker-in-pog-points-im-happy-that-it-has-become-an-entertaining-aspect-for-the-fans (search summaries).
- Example: Prince won game two's POG with 9 of 13 votes. Source: https://www.oneesports.gg/league-of-legends/lsb-prince-standee-sivir-pog/ (search summary).
- 2026 added a win-probability graph, a match timeline and an early-lead read-out, from GRID and CHZZK. Source: https://esports.gg/news/league-of-legends/lck-viewing-experience-chzzk-grid
- The 2021 rebrand's post-match graphic is on Inven Global's CDN. Source: `docs/research/lck-visual-research.md`, citing https://www.invenglobal.com/articles/12982/the-new-era-of-lck-is-here-a-visual-journey-into-the-new-broadcast-and-lol-park
- **Unverified:** the 2026 post-game screen's rows; no written description was found. Blue side left, red right, roles top to support, is the house layout (same repo file, unverified).
- **Teaches:** fans know a per-game star. Flol's own per-game points can play that part without a vote.

## 7. Korean sites

- Inven's 경기기록 (match records): "경기 세부 결과". One row per set, not per series: date and event, stage and set (e.g. "결승전 5세트"), each team's K/D/A and W or L, five picks, five bans under "BAN", then "KILL SCORE" (6 : 12) and "PLAY TIME" (32분 14초), and "펼치기 ▼" to open more. Latest row 3 Nov 2024. Source: https://lol.inven.co.kr/dataninfo/match/teamList.php
- Naver Esports was not reachable, as in the hub research.
- **Teaches:** Korean fans read a series set by set, with 세트 as the unit. Kill score and play time are the two numbers per set.

## 8. What to borrow

1. **Series header as Live's scorebug**: both teams boxed, 2–0 between, Bo3, the day and time. Sources: approved live; FPL (section 1).
2. **Game strip under it**: G1, G2, each with winner, length and side. Sources: gol.gg tabs (3); Inven's set rows (7).
3. **Two team blocks, blue left, red right**, each a grid: role, player, then one column per game with champion, K/D/A and points, best 2 boxed, series total last. Sources: approved Points drawer; FPL's split by side (1).
4. **Coach as the sixth row**, his lines per game, then +3 or −1. Source: approved coach-card.
5. **Not final** tag and "at final" cells while live. Source: approved Live and Points.
