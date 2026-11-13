# Home page references

Researched 13 Nov 2026 for the `/design` round on Flol's signed-in Home. This is background, not the product: Home's rules are in `SPEC.md` and `spec/`. It follows `fantasy-site-pages-survey.md`, which left FPL's signed-in Status page unconfirmed.

**Method.** FPL's signed-in pages could not be seen: the browser pane was signed out, and guides show no screenshot of them. Instead, FPL's own front-end code was read. The live bundle (`/assets/index-Dt3D8qHa.js`, fetched 13 Nov 2026) holds the 2026/27 Status page, and the Wayback copy of the 2023 bundle holds the old one. Code gives modules, labels and order, but not the final look. Treat the FPL layout below as **read from code, not seen**. Image search (Bing) returned nothing usable, and Reddit refused automated reads.

## 1. FPL, 2026/27 (live code)

**Where a signed-in manager lands.** Home (`/`) is not a page. It redirects. While the current gameweek is unfinished, it goes to **Points** for that gameweek. Otherwise it goes to **Pick Team**, or to **Status** when Pick Team is unavailable (inferred: between seasons). So Status is a nav item, not the landing page. The 2023 code did the reverse: a signed-in `/` showed Status. ([live bundle](https://fantasy.premierleague.com/assets/index-Dt3D8qHa.js); [2023 bundle](https://web.archive.org/web/2023id_/https://fantasy.premierleague.com/static/js/main.e2abe1f6.chunk.js))

**Signed-in nav order:** Pick Team, Points, Transfers, Leagues, Help, The Scout, Price Changes, Status, Fixtures, Injuries, Statistics, Podcast, Prizes, Sign Out. ([live bundle](https://fantasy.premierleague.com/assets/index-Dt3D8qHa.js))

**Status page (`/status`), top to bottom.** First an ad slot, then a "?" help sheet titled "The Status page explained". Below that are two columns: a wide main column and a narrow side column.

Main column:
1. **"Gameweek N Status"** panel. A banner says "League tables have been updated!" or "League tables and autosubs are updating...". Below it, side by side:
   - a **day table** (Day, Status), one row per match day, with a pill showing Not started, **Live**, Provisional or Confirmed. Live and Confirmed are bright green (`#04FC6F`); Provisional has its own colour. The tooltip says points update live, a day turns Provisional when its matches end, then Confirmed after checks.
   - a **gameweek facts** block: Transfers Made, Wildcards Played, Most Transferred In, Most Captained. In GW1 it shows Chips Played, Most Selected and Most Vice Captained instead.
2. **Top Transfers in** beside **Top Transfers out** this gameweek.
3. **Player of the Week** carousel for the season.
4. **Team of the Week** (dream team) beside **Player Availability** (injury news).
5. **Most Valuable Teams** beside **Best Leagues** (average of each league's top 5).
6. **Latest from The Scout** (articles in a scrolling row).

Side column:
1. **Team card** on a blue-lilac gradient: badge, team name, manager's name and flag. Then the gameweek name and three numbers: **Average, Points (largest), Highest**. Points links to your gameweek; Highest links to the top team's gameweek. Then buttons: Pick Team, Transfers, View Gameweek Recap, View Season Recap (the recaps are Adobe Express images).
2. **Upcoming Deadlines**: the next deadline with a **days : hours : minutes : seconds countdown**, then a list of the next five gameweeks with their deadlines. With reduced motion on, the countdown is replaced by a plain date.
3. **Manager panel**: Points & Rankings (overall points, overall rank, total players, gameweek points, link to Gameweek History), Team Badge, Transfers & Finance (gameweek and total transfers, squad value, in the bank), then Admin links for your own team.

**There are no leagues on Status.** Leagues and their arrows are on the Leagues page and in the app's Fantasy home. The page's help text says gameweek points decide "a green arrow" for gained overall rank and a red one for lost. ([live bundle](https://fantasy.premierleague.com/assets/index-Dt3D8qHa.js))

**Live elsewhere in FPL.** A player's sheet marks a live match with a thin pink-to-orange bar. Ranks and league tables update live from 2026/27. ([live bundle](https://fantasy.premierleague.com/assets/index-Dt3D8qHa.js); [FPL 2026/27 updates](https://fantasy.premierleague.com/en/help/new))

## 2. FPL, 2023 Status page (archived code)

Same idea, plainer. It opened with "You are logged in as [name]", then a strip above the heading (unconfirmed, possibly the deadline), then "Gameweek N Status". Next came the **day table**: Day, Match Points (Live, Provisional, Confirmed) and Bonus Points ("Added"), with a last row for **League Tables** (Updating or Updated). After that: an event card (gameweek name, a **My Team** button, a Prizes link, then Highest Points, Average Points, Transfers Made, Most Transferred In, Wildcards Played, Most Captained), Latest from The Scout, Top Transfers in and out side by side, Player of the Week, a dream team pitch, Most Valuable Teams, Best Leagues and Player Availability. The exact slot of the last few is unconfirmed (minified code). ([2023 bundle](https://web.archive.org/web/2023id_/https://fantasy.premierleague.com/static/js/main.e2abe1f6.chunk.js))

The FPL app's Fantasy home (Craig's screenshots, in the survey) differs: it leads with leagues, each with a rank and a green or red arrow.

## 3. Other fantasy games

| Game | What is known of the signed-in home | Source |
|---|---|---|
| ESPN (2025) | A personalised home: weekly analyst rankings of your starters, then analyst picks. A roster dashboard lists **action items by weekday** (waivers on Tuesday, trade offers to review). Matchup score stays pinned while scrolling; projections update live. No countdown mentioned. | [ESPN](https://africa.espn.com/fantasy/football/story/_/id/45844949/2025-fantasy-football-where-play-new-features-espn); [ESPN Press Room](https://espnpressroom.com/us/press-releases/2025/08/espn-fantasy-football-30th-anniversary-new-design-new-features-all-new-fantasy-app-for-2025/) |
| Yahoo (2025) | Home is a stack of **matchup cards**, one per league; tap a logo for the team, the middle for the matchup. Teams can be reordered. | [Yahoo Help](https://help.yahoo.com/kb/SLN36755.html) |
| Sleeper | Left panel: DMs first, then your leagues for the season, reorderable, archived below. Row contents not described. | [Sleeper blog, 2020](https://sleeper.com/blog/new-left-panel-design/) |
| LTA Fantasy (Riot) | Home always shows the **"Dream Team of the Week"** and the week's top scores. Rosters lock when the weekend's matches start. | [lolesports.com](https://lolesports.com/en-US/news/fantasy); [Riot support](https://support.riotgames.com/en-us/league-of-legends/events/lta-fantasy-faq) |
| AFL Fantasy (2026) | Live comparison with the top 100 and top 1000 each round. Where it sits on screen is unconfirmed. | [AFL.com.au](https://www.afl.com.au/news/1460108) |
| UCL, F1, Sorare | No source described the signed-in home. Unconfirmed. | none found |
| LCK fantasy | No LCK season-long fantasy game found (searched in Korean too). | none found |

## 4. LoL esports sites, for feel

**lolesports.com** (seen at 1440, 13 Nov 2026, signed out). The home is the **schedule** (page title "SCHEDULE"). Top nav: Home, Events & Standings, Power Rankings, Pick'Ems, Rewards, News, Tickets, Login. Three columns:
- **Left rail**: the season's events as a timeline (Regional Split, First Stand, MSI, Worlds), each with dates, the current one highlighted.
- **Centre**: "Today", with arrows to page by day and a league filter. Matches are listed by day: two team tricodes, "Worlds • Swiss", and Bo1, Bo3 or Bo5. Finished results hide behind a **Reveal spoilers** bar. An empty day says "No Matches Scheduled Today".
- **Right rail**: Global Power Rankings (top 3 with logos, link to full table), then News (three items with dates).
No match was live when seen, so the live style was not seen. ([lolesports.com](https://lolesports.com/en-GB/leagues/lck); screenshot in `docs/design/references/home/`)

**LCK and Naver.** `lck.co.kr` did not resolve, and the browser pane blocks `game.naver.com`. Neither was seen.

## What Flol could borrow

All six are Claude's suggestions, not product. Each needs Craig's yes.

1. **Land by state, like FPL 2026/27.** Mid-gameweek, Home leads with the live points; before the deadline, it leads with the countdown and a Pick Team button. One page, two orders.
2. **A team card with three numbers**: Average, your Points (biggest), Highest (links to that team). It is FPL's most compact answer to "how did I do".
3. **A per-series status table**, like FPL's day table: each series of the gameweek with Not started, Live, Provisional or Final. This fits `spec/11`'s provisional points that turn final 3 hours after a series.
4. **A countdown in days : hours : minutes, then the next few deadlines**, with a plain date for reduced motion.
5. **Spoiler cover on results**, as lolesports does. Korean fans often watch replays later.
6. **Leagues with green and red arrows on Home**, as the FPL app does. FPL's web Status leaves them out, but Flol's spec asks for league ranks on Home.
