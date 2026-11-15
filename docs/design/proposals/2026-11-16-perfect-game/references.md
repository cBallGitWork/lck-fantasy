# Perfect game: references

Research for Perfect game: the gameweek's best team, a Carry and 7 starters, under the squad rules (spec/12 lines 44–45). Gathered 15 Nov 2026 with web search, web fetch and FPL's public API. Anything not confirmed by a fetched page, the API or a search result is marked **Unverified**.

## What could not be reached

- FPL's Team of the Week page renders in the browser; a fetch returns only the title. Its API was read instead.
- lolesports.com and LTA Fantasy pages were not opened; the LTA facts come from the repo's earlier research.

## 1. FPL: Team of the Week

- The page is `/en/team-of-the-week/{gw}`, public. "Team of the Week, Gameweek 10" shows the XI's total and "Player of the Week" (name, club, points), with the Points view's Pitch and List toggle and fixtures panel. The old name Dream Team lives on in the "Times in Dream Team" stat; `/en/dream-team` is gone. Source: `docs/research/fantasy-site-pages/fpl.md`, citing https://fantasy.premierleague.com/en/team-of-the-week/10
- The API gives 11 players, each with points and a pitch position, and a top player. Source: https://fantasy.premierleague.com/api/dream-team/10/ (read 15 Nov 2026).
- Checked across 2026/27 GW1–10 against https://fantasy.premierleague.com/api/bootstrap-static/:
  - Always a legal formation, 1 keeper, 3–5 defenders, 2–5 midfielders, 1–3 forwards (GW9 is 5-2-3).
  - No captain: the total is the plain sum. The week's top manager often beats it: GW2 161 against 143, GW4 151 against 146, GW10 139 against 132.
  - The 3-per-club rule does not apply: GW7 has 4 from one club.
  - No budget: an XI costs £60–82m at today's prices, and only 11 are picked, so price never binds.
  - The top player is the week's best scorer. GW10 had two on 16; the dream team and the gameweek named different ones, so the tie-break is not public.
- Each player carries `in_dreamteam` and `dreamteam_count`; the season's most is 3. Source: bootstrap-static, as above.
- FPL's Status page shows Team of the Week beside Player Availability, and a Player of the Week carousel above. Source: `docs/research/home-page-references.md`.
- The BBC's FPL Team of the Week is a different thing: an editor's picks for the next week, inside £100m, as a Free Hit. Source: https://www.aol.com/articles/captain-palmer-joao-pedro-fpl-092905869.html (search summary).
- **Teaches:** the best team drawn exactly like your own team's view, with one star player. FPL keeps the shape rule and drops price, club cap and captain. Flol keeps the cap (Craig) and names a Carry (Craig), so its total is closer to a real manager's.

## 2. Other fantasy games

- LTA Fantasy (Riot, 2025): Home always shows the Dream Team of the Week and the week's top scores. Source: `docs/research/home-page-references.md`, citing https://lolesports.com/en-US/news/fantasy
- UEFA's Team of the Week (articles, about 2019 to 2023): a legal formation from the top scorers; ties go to fewer minutes, then total points, then lower price. Source: `docs/research/fantasy-site-pages/ucl.md`, citing https://www.uefa.com/uefachampionsleague/news/026d-135db0655d83-0bcef3502b07-1000--champions-league-fantasy-football-team-of-the-week
- **Teaches:** a dream team is a Home item in an esports fantasy game, and a tie-break exists elsewhere if Craig wants one.

## 3. The LCK's own best teams

- Each game has a Player of the Game, voted by casters, observers and press. The season's POG points decide the Player of the Split. Sources: https://www.leagueoflegends.com/ko-kr/news/esports/2020-lck-awards-announcement/ and https://www.invenglobal.com/articles/18760/gen-chovy-on-being-tied-with-faker-in-pog-points-im-happy-that-it-has-become-an-entertaining-aspect-for-the-fans (search summaries).
- The LCK names All-Pro teams each split: one player per role. Source: https://www.invenglobal.com/articles/12054/opinion-who-will-be-on-the-lck-all-pro-team (search result title). First, second and third teams: **Unverified**.
- **Unverified:** an official LCK team of the week. None was found.
- **Teaches:** LCK fans already know a five-role best team. Flol's adds the flex and the coach, and is weekly, not per split.

## 4. Sites showing a series and its games

The Perfect game shows week points, not games, but each player links to his series. See [../2026-11-16-series/references.md](../2026-11-16-series/references.md) for FPL's match detail, lolesports, gol.gg, Oracle's Elixir, the broadcast's post-game and Inven.

## 5. What to borrow

1. **The Points page's Rift view and Card view**, with the toggle: each player in his lane, Coach and Flex in the base, C on the Carry. Source: approved points; FPL (section 1).
2. **Total over the team**, Week 3, ‹ › arrows. Source: FPL (section 1); approved points.
3. **The Carry as the week's star**, its points shown as 17 × 1.5 = 25. Source: FPL's Player of the Week (section 1); approved points' Carry box.
4. **Under each player, his series**, each opening the Series page. Source: approved points, the line under each shirt.
