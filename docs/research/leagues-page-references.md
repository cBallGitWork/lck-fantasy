# Leagues page references

Researched 13 Nov 2026 for the `/design` round on Flol's **Leagues** page. Background, not the product: the rules are in `spec/08-leagues.md`. It adds to `fantasy-site-pages-survey.md` (which already covers FPL's join and create screens from guides) and uses the method of `home-page-references.md`.

**Contents:** [Method](#method) · [FPL: one league's table](#1-fpl-one-leagues-table-seen) · [FPL: My leagues](#2-fpl-my-leagues-read-from-code) · [FPL: create, join, invite, admin](#3-fpl-create-join-invite-admin-read-from-code) · [FPL signed in](#3b-fpl-signed-in-seen) · [LiveFPL](#4-livefpl-seen) · [UCL Fantasy](#4b-ucl-fantasy-seen-signed-in) · [F1 Fantasy](#4c-f1-fantasy-seen-signed-in) · [Other games](#5-other-games) · [LCK feel](#6-lck-feel) · [What Flol could borrow](#what-flol-could-borrow)

## Method

- FPL's public standings were **seen** signed out at 1440 wide in the browser pane. FPL's signed-in pages (My leagues, create, join, admin) were **read from code**, the live bundle `/assets/index-Dt3D8qHa.js`, fetched 13 Nov 2026: labels, order and styles, not the final look ([bundle](https://fantasy.premierleague.com/assets/index-Dt3D8qHa.js)).
- LiveFPL and lolesports.com were seen in the browser pane. Nothing was signed into, no form submitted. On lolesports the cookie banner was answered "Reject Non-Essential".
- Not reachable: game.naver.com (blocked by the pane), inven's standings page (old URL 404s; none linked from [lol.inven.co.kr](https://lol.inven.co.kr/)), the VCT factions leaderboard ([404](https://valorantesports.com/en-GB/pickems/113482263742879102/factions/leaderboard)), Sorare help (unsupported-browser page). F1, UCL and Sleeper league pages are signed-in only.

## 1. FPL: one league's table (seen)

Overall league, `/leagues/314/standings/c` ([FPL](https://fantasy.premierleague.com/en/leagues/314/standings/c)). Screenshots: `docs/design/references/leagues/`.

- **Top to bottom:** league name as the heading, with **Report Offensive Name** on the right; **View Cup Info →**; a filter chip for the phase (shows "Overall") and a **Reset** button; "Last updated: Fri 13 Nov 23:09 (local time)"; then the table.
- **Columns:** Rank · Team & Manager · GW · Total. Team & Manager is one cell: the team's badge, the **team name in bold** on top (a link to that team's gameweek, `/entry/{id}/event/{gw}`), the manager's name below. GW and Total are right-aligned; their headers carry a tooltip ("Gameweek points", "Total points").
- **Movement:** a 16 px round icon right after the rank number. Green with an up chevron for up, red with a down chevron for down, grey for the same. A manager with no last rank gets a separate icon in the primary colour. No number of places is shown. (Seen; colours from code: `up`, `down` uses the error colour, `same` the outline grey.)
- **Ties share a rank:** two 5s, then 7; three 15s, then 18.
- **Pagination:** 50 rows a page, a **Next** button below (and Previous after page 1), by `?page_standings=2`. No jump to a page, no search, no "find me".
- **Phases are a filter, not tabs.** The chip "Filter by phase" opens a list: Overall, August, September, October, November (months so far). It sets `?phase=4` and returns to page 1. A month table keeps its own movement arrows and its own "Last updated" (October showed "Tue 3 Nov"), and Reset returns to Overall ([October](https://fantasy.premierleague.com/en/leagues/314/standings/c?phase=4)).
- **Own row (from code):** the signed-in manager's row gets the blue brand gradient and white text, and the line above it is dropped. Your row is pinned under row 50 when you are further down (seen signed in; section 3b).
- **Updating banner (code):** "League tables are currently being re-calculated. The table below may still contain old data." Empty league: "Standings data will appear here when the league starts."
- **Header buttons (code):** "Invite people to join this league" for the admin (or members, by code privacy); "Join this league" for a visitor when the code is public.
- **New entries (code):** an invitational league can show a second table, **New entries** (Team, Manager), paged the same way.
- At 1440 the table sits in a column of about two thirds of the width; the right column was empty signed out (seen).

## 2. FPL: My leagues (read from code)

Page **Leagues & Cups** (`/leagues`), with a **Leagues | Cups** toggle under the title ([bundle](https://fantasy.premierleague.com/assets/index-Dt3D8qHa.js)).

- **Buttons first, in a row:** Join a League · Create a League · Renew Your Leagues (outlined).
- **Then one table per league type, in this order:** Invitational Classic Leagues; General Leagues; Broadcaster Leagues; Invitational Head-to-Head; Public Classic; Public Head-to-Head. The last four show only when not empty; an empty Invitational section says "No Invitational Classic Leagues joined yet."
- **Columns:** League · Current Rank (number plus the movement icon) · Last Rank · an actions column. Ranks use thousands separators; a missing rank shows "-".
- **Within a section, leagues sort A to Z** by name. So Overall is not pinned first by the code; General Leagues hold Overall, country, club, start gameweek and others (survey).
- **Actions per row:** **Leave league** (opens "Are you sure you want to leave {league}?" with "Yes, I want to leave this league" and "No, I don't want to leave"); or **Manage league** for the admin (to `/leagues/{id}/admin/c`); else "No actions available".
- The Status page's side panel has a smaller **My Leagues** card: league name, rank and arrow per row, a **Create/Join Leagues** button, and a **Fan League** card with the club badge and **View League**.

## 3. FPL: create, join, invite, admin (read from code)

- **Create** (`/leagues/create`): "Choose a League Type to Create": Classic Scoring (**Create a League & Cup**) or Head-to-Head. The classic form, "Create an Invitational League", now has only **League Name** (Maximum 30 characters) and **Scoring starts** (a gameweek list), then **Create League**. The cup is made with every classic league. After saving, it returns to `/leagues`. Over the cap: "You may only enter …" (message cut in code).
- **Join** (`/leagues/join`): "Choose a League Type to Join", then "Join an Invitational League & Cup": one field, **League Code**, and **Join League**. A link `/leagues/auto-join/{code}` joins after "Please press confirm to join league: {name}."
- **Invite** (`/leagues/{id}/invite`): "Invite players to join {league}", "Code to join this league: {code}", **Copy auto join link**, **Copy email text** and "Share league code by email".
- **Admin** (`/leagues/{id}/admin/c`), "League Administration" with **Invite players** at top right, then in order: the code with **Regenerate** (inferred from labels); **League Details** form (League Name, **League code privacy**: All game players / League members / League administrator, Scoring starts, **Close league to new entries**, **Update League**); **Add League suspensions** (search a manager, **Suspend Player**; a suspended manager cannot rejoin); **Remove League Suspensions** (only if any); **Change League Administrator**; **Delete League** ("The players entered in the league will still exist…").

## 3b. FPL signed in (seen)

Seen 14 Nov 2026 in Craig's own Chrome, signed in, at about 1370 wide. Nothing was clicked but links; no other manager's name is recorded here. Admin pages were not seen: Craig runs no league.

- **My leagues** (`/leagues`) matches the code in section 2. **Leagues | Cups** is a two-part toggle; the three buttons sit in a row under it. Sections seen: Invitational Classic, General, Invitational Head-to-Head. The movement arrow sits after **Current Rank**; **Last Rank** is a plain number. **Leave league** is an exit icon in a fourth column with no header; General leagues have no icon. The right column is empty but for a **?** help button.
- **Own row:** a blue-to-violet gradient band with white text; the arrow keeps its colour. **When you are below page 1, your row is pinned** as the last row of page 1, under row 50, with your real rank (115), then **Next**. This settles section 1's open question.
- **Head-to-head league** opens on **Matches**, with a **Matches | Standings** toggle. Matches: an **All Teams** filter, a gameweek dropdown ("Gameweek 10 - current") and **Reset**; each fixture is one row: home manager's name over team name, right-aligned, two boxed scores, then the away side left-aligned. Manager is on top here; the classic table puts the team on top.
- **Head-to-head standings:** Rank (with arrow) · Team & Manager · W · D · L · Score · Pts. A win is 3 points, a draw 1 (9-0-1 makes 27); Score is total FPL points, the tiebreak.
- **Create** (`/leagues/create`): two blocks, each a short paragraph and a button: **Create a League & Cup** (classic: ranked on total points, join or leave any time) and **Create Head-to-Head League** (a schedule made at the first round; then the league locks, no joining or leaving).
- **Join** (`/leagues/join`): "You can join up to 30 invitational leagues and 5 public leagues." Two blocks: **Join Invitational League & Cup** (needs a code) and **Join Public League** (a small random group).
- **Cups tab** (`/leagues/cups`): **League cups** (one per invitational classic league) and **General cups** (Overall, country, club and others); columns Cup · Gameweek · Result, empty until a cup starts.

## 4. LiveFPL (seen)

FFScout Mods & Cons league, Gameweek 10 ([LiveFPL](https://plan.livefpl.net/leagues/8449)).

- **Controls above the table:** Autosubs On/Off; a league picker; a sort field (Total, GW Net Score, GW Gross Score, Players Remaining, Overall Rank, Free Transfers, Team Value, Active Chip) with **Sort ▼**; five icon buttons (Ownership / Captains, Compare two teams, Export to Excel, Search table ⌘K, Awards of the Week); **Compact View | Detailed View**.
- **Title bar:** "{league} — Live Gameweek 10 Table".
- **Columns:** Pos · Manager · Yet (players yet to play) · (C) · GW · Total, and a chevron. Manager cell: team name, manager name, **OR** (overall rank) and chips still unused as small pills (WC, BB, FH, TC).
- **(C):** captain's name in bold, vice-captain small below.
- **Movement:** an arrow icon left of the position, with the places moved as a small number (e.g. +4).
- **GW with hits:** "77 (-4)=73".
- **Detailed view** adds a second line per manager: FT (free transfers), TV (team value), PLAYED 12/12, a favourite heart, and each transfer as a pill: out player struck through in red → in player, and the net points it made, e.g. "(-2)" or "(+6)". Several transfers end with a sum: "(+18 − 4 = +14)". Compact view drops that line.
- **The chevron expands the row inline:** the 15 players as shirts with name, a percentage bar (likely ownership in the league; unconfirmed) and points; the bench in black.

## 4b. UCL Fantasy (seen signed in)

Seen 14 Nov 2026 in Craig's Chrome on a throwaway account with an auto-filled team, "Flol Research" ([UCL Fantasy](https://gaming.uefa.com/en/uclfantasy/leagues)). The leagues page appears only once a team is saved. A test league, "Flol Test", was made to see its pages.

- **Leagues hub**, one narrow centred column: **Private leagues**, then **Public leagues**.
  - Empty: one card, "Compete against your friends", with **Create a league** and **Join a league**.
  - After joining one: a row per league (name, "No other members", an **Invite** button), then two small cards side by side: "Do you have a league code? **Join**" and "Looking to start a league? **Create**".
  - Public: **World leaderboard** (globe icon, "1.25m+ members"), then a dismissible **Join a club league** card: a strip of club badges, a **Select a club** list and **Join**. The club league is opt-in, not automatic.
- **Create:** a modal with one field, league name (24 characters, counted down), and **Create a league**. It opens straight onto the new league with a "League created!" toast.
- **Join:** a modal with one field, league code (12 characters), and **Join a league**.
- **New league page:** "Invite your friends" and a **share card**: a branded graphic with the league name, "League code jHJNCf" and #UCLfantasy, made to be screenshotted and posted. Under it: **Copy code** and **Copy auto-join link**.
- **League settings** (a cog on the league page): league name with a pencil to rename, **Invite friends**, the member list ("craig (You)") and **Delete league**. Nothing else.
- **Leaderboard** (World): header "Worldleaderboard · 1.25m+ members", then a **phase stepper**: ‹ Overall ▾ › with a dropdown of Overall, Matchday 4, 3, 2, 1.
  - Columns: Rank · team (fan-face avatar, team name over manager name) · MD4 · Total.
  - Movement is a small green or red triangle **under** the rank number. Ties share a rank (1, 1, 3).
  - **Load more rows**, not pages, after 20 rows.
  - **Your row is pinned below the table**, set apart with a cyan left edge, showing "-" for rank and points until you score.
- **Avatars:** every manager has a cartoon fan face (scarves, hats, emoji-style), picked in the game, in place of a club badge.

## 4c. F1 Fantasy (seen signed in)

Seen 14 Nov 2026 in Craig's Chrome on a throwaway account ([F1 Fantasy](https://fantasy.formula1.com/en/leagues)). The site blocked requests for a while (a 403 from its CDN) and the team save failed with "Something went wrong", but the leagues pages opened.

- **Onboarding sets the leagues.** After the team is named, "Complete Your Profile" asks **Country of Residence**, **Favourite Team** and **Favourite Driver**, plus a terms tick. Those three answers become leagues at once.
- **Leagues page**, top to bottom:
  - "Leagues" with **+ Create a league** (outlined) and **Join a league** (red).
  - **Featured leagues**: a carousel of big image cards (sponsor and team mini-leagues, broadcasters, circuits), each with a logo, "Mini", total teams, a lock date and **JOIN**, or a red **LEAGUE ENDED** flag. **View All** and arrows.
  - **Leagues**: one wide row each for **Global League** (GLOBAL, 2.2m+ teams), **United Kingdom** (COUNTRY, 404k+), **Williams** (TEAM, 108k+) and **Alexander Albon** (DRIVER, 22.1k+). Each row has a badge (flag, team logo, driver photo), the type in small capitals, the total teams, and a chip on the right for your team: "T1 0".
  - Two big coloured cards: **Create and compete** (green) and **Join more leagues!** ("There's no limit to the number of leagues you can be a part of").
- **A league's table** (the Albon league): header with the driver's photo, name, DRIVER and total teams, and your T1 chip. **Overall ▾** opens a list of races (Australian Grand Prix, Chinese Grand Prix, and so on). A **Show only my team(s)** switch, since a player may run up to 3 teams.
  - Columns: Position · Name (team name over manager) · Pts · **Team**, then a chevron.
  - **The Team column shows the whole squad** as small round driver faces and constructor badges.
  - Movement is a dot (same), a green up arrow or a red down arrow, left of the position. Ties share a position.
  - **A side panel** shows the selected row's team for the last race: team name, manager, cost cap, points, and each driver with points (the boosted one marked 2X, negatives in red).
- **Create a league** is a page, not a modal, with a live preview card on the right ("League Title"):
  - **League Name** (max 25 characters).
  - **Type of league**: Classic ("Players only able to join with an invite"), Head-2-Head ("Battle against your opponents race by race") or Public ("Anyone can join your league").
  - **Unlimited Participants** switch; else **Maximum no. of teams** (a stepper, 10 by default) and **Teams per user** (3).
  - **Select Teams →** (which of your teams enter) and **Discard**.

## 5. Other games

| Game | Leagues as found | Source |
|---|---|---|
| F1 Fantasy | Auto-entered into Global, Country, Constructor (favourite team) and Driver leagues; private leagues, head-to-head, followed leagues, themed mini-leagues. Table layout: not found. | [formula1.com](https://www.formula1.com/en/latest/article/boost-the-fun-with-friends-and-family-this-season-f1-fantasy-is-back.2xVBBN90riZiaYXeYhOe0Z) |
| UCL Fantasy | Auto-entered into overall, country and supported team; create from a **Create a league** button on the right of the Leagues tab, share the code; up to 20 private leagues (older rules). Old leagues can be reactivated. Table: not found. | [UEFA](https://www.uefa.com/uefachampionsleague/news/02a8-2160b1c17739-195ff0005133-1000--champions-league-fantasy-football-all-you-need-to-know-and-h/); [FF Reports](https://www.fantasyfootballreports.com/how-to-create-league-ucl-fantasy/) |
| LTA Fantasy | Up to 13 leagues; a new league counts from its creation; rename yes; delete, leave and kick not available. Leaderboards for conferences (North, South), teams, streamers, friends. | [Riot support](https://support.riotgames.com/en-us/league-of-legends/events/lta-fantasy-faq) |
| Sleeper | Head-to-head; standings in third-party tools show Team, W/L, PF, PA. Native layout not found. | [TRMNL recipe](https://trmnl.com/recipes/141171) |
| Sorare | Divisions with promotion and relegation by percentage each period (from a search summary; page not readable). | [Sorare help](https://sorare.com/help/a/16039119819805/how-the-division-works-in-arena) |
| KBOOM | A free LoL fantasy game (LEC, LCS, LCK, LPL, Worlds) built on collected player cards sold in packs; private leagues sit behind a sign-in. Signed out, the Worlds league page showed only a real-team table: # · Team · W · L · WR. Seen 14 Nov 2026. | [KBOOM](https://app.kboom.gg) |
| VCT Pick'Em | Ten creator-led factions; join one, locked at group stage; the leaderboard averages the top 75% of members (from search summaries; page now 404). | [esports.gg](https://esports.gg/guides/valorant/valorant-champions-2025-all-factions); [Sportskeeda](https://www.sportskeeda.com/valorant/valorant-champions-2025-how-join-faction) |

## 6. LCK feel

**lolesports.com** (seen). Each split is a "Split N: LCK Standings" page: title, a pill (COMPLETED), months and REGIONAL, then **stage cards as tabs**, each a small label over a name with a tick when done: SEASON, EVENT & TEAMS **Overview** · GROUPS **Groups** · BRACKET **Play-Ins** · BRACKET **Regional Championship** ([Split 3](https://lolesports.com/en-GB/tournament/115548147890329817/stage/115548147896621274)).
- **Legend and Rise** sit side by side as two equal cards: "LEGEND GROUP" and "RISE GROUP" headers, five rows each: rank, team logo, team name, record "5W - 3L". The rank order does not follow the record shown (Dplus KIA 4th at 6W - 2L), so the order likely carries points from before (unconfirmed). Screenshot saved.
- **Regular season table** (Split 2): Team Rankings · Series Win / Loss · Win / Loss %, ten rows, rank, logo, name, "15W - 3L", "83%" ([Split 2](https://lolesports.com/en-GB/tournament/115548128960088078/stage/115548128961398799)). No movement arrows, no game difference.
- Korean sites (Naver, inven) were not seen; see Method.

## What Flol could borrow

Each is Claude's suggestion, not product; each needs Craig's yes.

1. **Split as a phase filter that resets to page 1, as FPL's months** (Claude's suggestion): Season, Split 1, Split 2, each with its own arrows and "Last updated". The spec asks for tabs; three fit as tabs where FPL's ten months needed a dropdown.
2. **Legend and Rise as two equal side-by-side cards, as lolesports draws the LCK's groups** (Claude's suggestion), beside or above the whole Overall table in Split 2.
3. **FPL's Team & Manager cell and the own-row highlight** (Claude's suggestion): bold team name over manager name, one link per row, your row in a solid brand band.
4. **Arrow plus places moved, as LiveFPL** (Claude's suggestion): FPL shows only the arrow; LiveFPL's "+4" says more in the same space.
5. **My leagues as FPL's table, ordered as the spec says** (Claude's suggestion): League · Rank with arrow · Last rank · Leave or Manage, but Overall, country, team first, not A to Z.
6. **One admin page in FPL's order** (Claude's suggestion): code and link to copy, details (name, scoring starts), remove a manager, delete last. FPL's code privacy, suspensions and admin hand-over are not in the spec and would be Craig's call.
