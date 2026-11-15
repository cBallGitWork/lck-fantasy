# Compare: references

Research for Compare: two players side by side (spec/12, The player card). Gathered 15 Nov 2026 with web search and fetch only, plus the repo's earlier survey. Anything not seen on a fetched page is marked **Unverified**.

## What could not be reached

- FPL's own site renders in the browser; fetches return only the title. Whether FPL's web game or app has a compare view is **Unverified**; none was seen in the repo's survey (`docs/research/fantasy-site-pages/fpl.md`), whose player modal has no compare link.
- Fantasy Football Hub and FPL Review compare pages did not come up in search.
- Leaguepedia returns 402. Naver's esports pages refuse fetches. Oracle's Elixir renders in the browser.

## 1. FPL: the player modal, the thing being compared

- Header: position, name, club, price, and a strip of Form, Pts/Match, GW Pts, Total Pts, Total Bonus, ICT Index and TSB %, each with a rank ("1 of 219"). Then Form (last 3 gameweeks) beside Fixtures (next 3, with difficulty). Source: https://fantasy.premierleague.com/en/statistics (via `fpl.md`).
- **Teaches:** Flol's card already copies this strip; Compare can set two strips one above the other, row for row, without new stats.

## 2. Community FPL compare tools

- **Statz.ai**: any two players. Columns: Player, Club, Price, Owned by, FPL points, one position stat (clean sheets or xGI), and next five fixtures as one average difficulty. The better value is not marked in the table; a verdict sits in text below. Per-90 rates hide until a player has enough minutes. Source: https://statz.ai/fpl/compare
- **Onside Arena**: two players head to head, picked by name in the URL (`/compare/haaland-vs-salah`), with an AI buy pick. Source: https://onsidearena.com/compare (search summary).
- **FPL.my**: price, total points, points per game, ownership, goals, assists, clean sheets for two players, plus a recommendation score. Source: https://www.toolmage.com/en/tool/fplmy/ (search summary).
- **Fantasy Football Scout** (members only): two players or two teams from drop-downs. Stats grouped (Goal threat, Expected statistics, Distribution), a percentage reading of who wins overall, date ranges ("Last Gameweek", a gameweek range) and a Versus filter by opponent. Source: https://www.fantasyfootballscout.co.uk/how-to-use-the-comparison-tool-in-the-members-area
- **Fantasy Football Community**: up to three players, tables side by side. Source: https://fantasyfootballcommunity.com/?p=22280 (search summary).
- **Teaches:** the shared core is small: price, owned, points, points per game, a few position stats, next fixtures. Picking is by search or drop-down. Verdicts and scores are extras; Flol's spec asks for none.

## 3. LCK sites

- **gol.gg**: no player compare page found. A player's page has General stats (record, win rate, KDA, CS and gold per minute, KP), laning (CSD@15), Aggression (DPM, solo kills) and Champion pool, all raw values. Source: https://gol.gg/players/player-stats/2063/season-ALL/split-ALL/tournament-ALL/
- gol.gg's game pages set the ten players in role columns, TOP to SUPPORT, side by side. Source: https://gol.gg/game/stats/76534/page-fullstats/ (search result).
- **Inven** 선수기록: a 상대 선수 (opponent) box filters one player's games by who he faced; it is not a side-by-side view. Source: https://lol.inven.co.kr/dataninfo/match/playerList.php
- **Broadcast**: the LCK's own lane matchup graphic (two players of a role, stats facing across the middle) is the familiar picture. **Unverified**: from memory; no source was read for it, and `docs/research/lck-visual-research.md` does not cover it.
- lolesports.com, Oracle's Elixir, Leaguepedia, Naver: no compare view found. **Unverified**.
- **Teaches:** LoL fans compare by lane: mid against mid. A same-role default fits how they already think; a mirrored layout, stats down the middle, fits the broadcast.

## Layout ideas

1. Two columns, each the card's header (portrait, role and team, name and hangul) and meta line; the stat labels down the middle, as the broadcast's lane matchup.
2. Rows: price, form, owned, season, transfers in and out; then the nine scoring lines, total and per game; then last 3 and next 3 series.
3. The better value in each row bold; equal values plain.
4. The second column headed by a change link, opening a search with the same role first.
5. Same frame as the card: a sheet at 1440, ✕ back to the card.
