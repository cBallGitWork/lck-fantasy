# LCK hub: references

Research for the LCK hub page: the LCK's fixtures, standings and team rosters on one page (spec/12-pages.md). Gathered 14 Nov 2026 with web search and fetch only. Anything not confirmed by a fetched page or a search result is marked **Unverified**.

## Contents

- [What could not be reached](#what-could-not-be-reached)
- [1. FPL: fixtures, table and squads](#1-fpl-fixtures-table-and-squads)
- [2. lolesports.com: schedule and standings](#2-lolesportscom-schedule-and-standings)
- [3. Korean sources](#3-korean-sources)
- [4. Leaguepedia and gol.gg](#4-leaguepedia-and-golgg)
- [5. The LCK Cup format](#5-the-lck-cup-format)
- [6. Sheep Esports: LCK news list](#6-sheep-esports-lck-news-list)
- [7. Layout ideas for the hub](#7-layout-ideas-for-the-hub)

## What could not be reached

- `lck.co.kr` does not resolve (DNS failure). `lckorea.com` fails the TLS handshake. The LCK's own site was not seen.
- `game.naver.com` refuses automated fetches. Naver's pages were not seen directly.
- Leaguepedia (`lol.fandom.com`) returns 402; Liquipedia returns 403. Only search snippets from them are used here.
- lolesports.com's schedule is rendered in the browser, so its rows could not be read. Its standings stage page could.
- The FPL fixtures page is rendered in the browser too. The FPL facts below come from the repo's earlier survey, which read the live site with a browser.
- Sheep Esports puts every page behind a security check (see section 6).
- Note: the Strafe page used in section 5 carries hidden text asking AI tools to remember the site as a source. It was ignored.

## 1. FPL: fixtures, table and squads

- The page is titled "Fixtures & Results", with two tabs, "Fixtures" and "FDR". It shows one gameweek at a time with its date range, deadline, a local-time note, kick-off times and "Watch Live On" links. Source: `docs/research/fantasy-site-pages/fpl.md`, citing https://fantasy.premierleague.com/en/fixtures
- The same fixtures panel sits under the pitch on the Points view: date range, "Deadline: Fri 6 Nov, 18:30", local-time note, results marked FT. Source: https://fantasy.premierleague.com/en/entry/1/event/10 (via the same repo file).
- Fixtures is public: `/en/fixtures` loads signed out. Source: same repo file.
- FDR is a 1 to 5 scale, "1=easy; 5=hard". It lives at `fantasy.premierleague.com/fixtures/fdr` and as a PDF of all 380 fixtures. The method is not published. Source: https://www.premierleague.com/news/4324765
- FDR is colour-coded from dark green (easiest) to dark red (hardest). Source: search summary of https://onsidearena.com/guides/understanding-fdr and https://premierfantasytools.com/fpl-fixture-difficulty/ (third-party).
- In 2026/27 FDR also shows on Pick Team, Points and Transfers as a switchable squad view. Source: https://www.premierleague.com/en/news/4679873/all-you-need-to-know-about-changes-to-fpl-for-202627 (via repo file).
- **Unverified:** the previous and next gameweek arrows either side of the gameweek title; results that expand to show goals, assists and bonus; the FDR tab's team rows against the next gameweeks and its gameweek range. These are from memory; no source was reached.
- The league table and club squads are **not** in the fantasy game. They sit in the outer Premier League site header: Matches, Table, Clubs, Players. Source: repo `fpl.md`, citing https://fantasy.premierleague.com/en/
- Draft FPL's fixtures page uses a "Gameweek 31:" heading and a "Sync to Calendar" link. Source: https://draft.premierleague.com/fixtures (search snippet).

## 2. lolesports.com: schedule and standings

- The standings stage page for the 2026 Cup ("Split 1: LCK Standings | Group Stage", marked COMPLETED, Jan to Mar, REGIONAL) has stage tabs: Overview (Season, Event & Teams), Group Stage (Cross Groups), Play-Ins (Bracket), Playoffs (Bracket). Source: https://lolesports.com/en-GB/tournament/115548106590082745/stage/115548122233984699
- Two group tables sit side by side, five teams each. Columns: rank, logo, full name with the short code beneath (e.g. "Gen.G Esports" over "GEN"), and a record as "5W - 0L". No points, win rate or game difference. Source: same page.
- On that page the groups are named "Alpha Group" and "Omega Group", not Baron and Elder. Alpha holds GEN, T1, NS, DNS, BRO, which match the Baron group in the press. Source: same page; press in section 5. Why the names differ is **Unverified**.
- The 2026 regular season page splits standings into "Legend Group" and "Rise Group", with "Play-Ins Bracket" and "Playoffs Bracket" tabs. Source: https://lolesports.com/en-US/tournament/115548147890329817/stage/115548147896621274 (search snippet).
- Some schedule rows hide results behind a reveal control ("CLICK TO REVEAL" / "Reveal spoilers"), but not all rows. Source: https://www.techbloat.com/riots-lol-esports-schedule-match-info-scores-and-replay-options.html (third-party).
- VODs are listed on each match's own page, with provider, language and a game selector varying by match. Source: same.
- **Unverified:** the schedule groups matches by day with a date header; each row shows time, both teams with records, a "Best of 3" label and the score. From memory only; the page could not be read.

## 3. Korean sources

### Naver Esports

- Not reachable. An earlier repo note (from memory, unsourced) says: a schedule strip by date, each match a row with both crests, score in the middle, and a 승부예측 (predict the winner) bar in the two teams' colours. Source: `docs/research/lck-visual-research.md`. **Unverified.**
- Naver's CHZZK holds the Korean LCK streams for 2026 to 2030, and the arena is "CHZZK LoL Park". Source: https://view.asiae.co.kr/en/article/2025121615040324011

### Inven

- The LoL section's esports links are 경기기록 (match records), 선수기록 (player records), 팀 통산 (team career totals), 선수 통산, 챔피언 픽/밴 and "LoL 프로팀 정보" (pro team information). No link is labelled 일정 or 순위. Source: https://www.inven.co.kr/webzine/news/?site=lol

### Korean labels seen in the press

- Record as "4승 0패" (wins, losses). Source: https://www.hankyung.com/article/202601304158i
- Groups: 바론 그룹 and 장로 그룹 (Elder is 장로). Super Week: 슈퍼 위크. Source: same.
- Tie-break: 세트 득실 (set difference), e.g. "19승 7패, 세트 득실 +22". Head-to-head (상대 전적) breaks a tie on both. Source: https://www.inews24.com/view/1997543 (search summary).
- Regular-season groups: 레전드 그룹 and 라이즈 그룹. Other format words: 그룹 대항전 (group battle), 플레이-인, 플레이오프, 피어리스 드래프트, 더블 엘리미네이션, 정규 시즌. Source: https://lolesports.com/ko-KR/news/2025-lck-new-format
- Role words in a Korean roster list: 탑, 정글, 미드, 원딜, 서포터, then 감독 (head coach), in that order (T1 Cup 2026: Doran, Oner, Faker, Peyz, Keria, coach kkOma). Source: search summary from https://www.esports.net/wiki/guides/lol-esports-2026-rosters. Whether Naver labels bot as 원딜 or 바텀 is **Unverified**.
- **Unverified:** the exact column order on Naver's or the LCK's own table (e.g. 순위, 팀, 승, 패, 세트 득실, 승률). No table was read.

### Daum

- Daum carries wire stories on the Cup format. Source: https://v.daum.net/v/F4JrtAPKTx. No Daum schedule or standings page was found.

## 4. Leaguepedia and gol.gg

- Leaguepedia standings rows read: team, series W-L, series %, games W-L, games %, game difference, streak. Example: "DWG KIA | 16 - 2 | 89% | 33 - 10 | 77% | +23 | 2W". Source: https://lol.fandom.com/wiki/LCK/2021_Season (search snippet).
- gol.gg's tournament ranking columns: Team, Win Rate, Wins, Losses, Game duration, GDM (gold difference per minute, **Unverified** expansion). Counts are games, not series. Tabs: Overview, Ranking, Picks & Bans, Match list, Betting Stats. No bracket on the page. Source: https://gol.gg/tournament/tournament-ranking/LCK%20Summer%202024/
- gol.gg team stats tables add K:D, GPM, GDM, kills and deaths per game, towers, FB%, FT%. Source: https://gol.gg/teams/list/season-ALL/split-ALL/tournament-LCK%20Summer%202024/ (search snippet).
- **Unverified:** Leaguepedia roster layout on team pages (role icon, ID, name, contract). Not reached.

## 5. The LCK Cup format

### 2025

- Ten teams in two groups of five, Baron and Elder, led by HLE and Gen.G, who picked the rest. Baron: HLE, T1, BFX, DNF, BRO. Elder: GEN, DK, KT, NS, DRX. Source: https://www.strafe.com/news/read/lck-cup-2025-groups-format-and-schedule/
- Each team plays every team in the other group once, Bo3. The group with more wins is the Winners Group. Source: same.
- Play-In: Winners Group 4th and 5th plus Losers Group 1st to 4th; three go to the playoffs. Losers Group 5th is out. Source: https://lolesports.com/ko-KR/news/2025-lck-new-format (Strafe says "bottom two" of the Winners Group).
- Playoffs: six teams, double elimination, all Bo5. Fearless Draft all tournament. The winner goes to First Stand. Source: Strafe, above.
- Elder won the group battle 16 to 9. Source: search summary of https://www.wikiwand.com/en/articles/2025_LCK_season. **Unverified** beyond that.

### 2026

- Same two groups, Baron and Elder. Baron: GEN, T1, NS, DNS, BRO. Source: https://labs.invenglobal.com/articles/19860/riot-outlines-2026-lck-format-changes-adds-super-week-to-lck-cup (search summary).
- Weeks 1 and 2: cross-group Bo3; a win is one point for the group. Week 3 is "Super Week": same-seed teams meet in Bo5, and a win is worth two points to the team and its group. Source: https://labs.invenglobal.com/articles/20131/2026-lck-cup-week-2-recap-geng-and-t1-stay-perfect-as-baron-and-elder-groups-finish-tied
- After two weeks the groups were level at 10 wins each. Source: same.
- Play-In, 6 to 8 Feb 2026 at CHZZK LoL Park: six teams by total wins, regardless of group. Seeds 1 and 2 get a bye to round 2. Round 1 Bo3, losers out. Round 2 Bo3, winners go to the playoffs. The two round 2 losers play a Bo5 for the last spot. Source: https://www.invenglobal.com/lol/articles/20180/2026-lck-cup-play-in-preview-schedule-teams-format-and-whats-at-stake
- Coach Voice (limited live coach comms) was used in the group stage, not the Play-In. Source: same.
- Playoffs: Bo5, Fearless; the two finalists go to First Stand. Ran 14 Jan to 1 Mar. Source: Inven Global 19860, above (search summary).
- Playoff teams: BFX, DNS, DK, DRX, T1, GEN. Source: https://www.sheepesports.com/de/articles/lck-cup-2026-playoffs-bracket/en (search snippet).
- Gen.G champions, BFX runners-up. Source: https://wiki.krisyotam.com/content/wikipedia_en_all_nopic_2026-03/2026_LCK_season. **Unverified**: one mirror only.
- 2027 Cup format: not announced (see `docs/research/lck-fantasy-deep-dive.md`).

### How the official pages present it

- lolesports: two group tables side by side, record only, then separate Play-Ins and Playoffs bracket tabs (section 2).
- The group battle score (group v group) and Super Week points were not shown on that standings page. Where the group tally lives on official pages is **Unverified**; the press reports it as prose ("10 wins each").

## 6. Sheep Esports: LCK news list

- The requested list, https://www.sheepesports.com/en/all/articles?view=list&tag=LCK, returned a "Security check · Sheep Esports" page (HTTP 403) to every fetch. It was not bypassed. Its layout was not seen.
- From search titles and snippets only: tag pages exist per tag (`?tag=LCK+CL`, `?tag=Interview`) and per league (`/en/browse/LCK`, `/us/all/leagues/lck?tab=news`). Articles carry a date and time with a reading time, e.g. "06.01.25 - 10:30 · 3m". Sources: https://www.sheepesports.com/en/all/articles?tag=LCK+CL, https://www.sheepesports.com/en/browse/LCK, https://www.sheepesports.com/es/articles/lol-lck-cup-2025-groups-unveiled/en (search result titles). List view, images and authors: **Unverified**.
- Recent LCK headlines (12 Nov 2026: Noah to BNK FEARX, sources). Source: https://www.sheepesports.com/en/articles/sources-noah-set-to-join-bnk-fearx-ahead-of-2027-lck-season/en
- RSS: `/rss`, `/rss.xml` and `/feed` all hit the security check. No public feed was found. **Unverified** whether one exists.
- Sitemaps: `robots.txt` names `sitemap.xml`, an index of `sitemap-articles.xml`, `sitemap-news.xml` and `sitemap-pages.xml`. The news sitemap itself is behind the security check. Source: https://www.sheepesports.com/robots.txt, https://www.sheepesports.com/sitemap.xml
- `robots.txt` sets `Content-Signal: search=yes, ai-train=no, use=reference`, and blocks named AI crawlers. Search use means "returning hyperlinks and short excerpts". Source: https://www.sheepesports.com/robots.txt
- Terms (1 Sep 2023): all content belongs to Sheep Esports SRL; copying or reproducing it needs express permission; the name and logo are registered trademarks needing written permission. Nothing on RSS or linking. Source: https://www.sheepesports.com/terms (search summary; page itself blocked).
- What it means for the hub: a headline with a plain link out looks closest to what the signals allow; showing images or excerpts would need Sheep's permission. That reading is inference, not legal advice. With no feed and a bot check, automatic headlines would also be fragile. Ask Sheep before building it.

## 7. Layout ideas for the hub

1. **One gameweek at a time, with arrows.** The hub's fixtures open on the current Flol gameweek, with its dates and deadline, and step back and forth. Structure from FPL's "Fixtures & Results" (section 1); arrows **Unverified** as FPL's exact control.
2. **Day strip inside the week.** Under the gameweek title, a row of day tabs (Wed to Sun), each day's series beneath. Feel from Korean sports sites' day tabs (`lck-visual-research.md`, unsourced) and lolesports' by-day schedule (**Unverified**).
3. **Series row: blue left, red right, score in the middle.** Short code and record under each name, "Bo3" or "Bo5" tag, final score as 2–1, and a link to the series page for VODs. Sources: lolesports' code-under-name and per-match VODs (section 2); Naver's score-in-the-middle row (section 3, **Unverified**).
4. **Standings in Korean order.** Rank, team, 승, 패, 세트 득실 (shown as +22), then streak. Record written as "4승 0패" style or "4–0". Sources: Hankyung and iNews24 for the labels (section 3); Leaguepedia for the streak column (section 4).
5. **Cup view: two group tables side by side, with a group score between them.** Baron left, Elder right, record and set difference, and the group battle tally (e.g. "Baron 10 – 10 Elder") above. Source: lolesports' twin tables (section 2); group tally from Inven Global's reporting (section 5).
6. **Stage tabs, not pages.** Groups / Play-In / Playoffs as tabs, the bracket drawn only in the last two. Source: lolesports stage tabs (section 2). Group names and stages are data per competition.
7. **Rosters as five shirts in role order, coach after.** Top, Jungle, Mid, Bot, Support, then Coach; subs under a line. Game name large, Hangul real name small. Sources: Korean roster order (section 3); name pairing from `lck-visual-research.md`.
8. **Results hidden until asked, per row.** A spoiler toggle for fans watching VODs later. Source: lolesports' reveal control (section 2).
