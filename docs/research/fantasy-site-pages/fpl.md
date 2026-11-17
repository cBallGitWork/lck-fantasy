# Fantasy Premier League (FPL): page inventory

**Contents:** top navigation and grouping · each page · signed in, seen 14 Nov 2026 · app-only and web-only features · URL patterns

Method and date note: the live site was read directly on 13 Nov 2026 in a signed-out browser, and signed in, on Craig's own team, on 14 Nov 2026 (see [Signed in](#signed-in-seen-14-nov-2026); nothing was changed). By then the game is in its 2026/27 season, so what the live pages show is 2026/27. Where a 2026/27 page differs from 2025/26 it is flagged below. On 13 Nov the signed-in-only pages (Pick Team, Transfers, squad selection, account settings) could not be opened, so the sections before [Signed in](#signed-in-seen-14-nov-2026) describe them from official help text and articles; that section says what was seen on 14 Nov. "Live site" below means fantasy.premierleague.com as read on 13 Nov 2026.

## Top navigation, signed out and signed in, and how pages are grouped

### Takeaway
Signed out, the FPL bar has 8 items: Home, Prizes, The Scout, Price Changes, Injuries, Podcast, Help and Statistics. Above it sits a "Fantasy" switcher for FPL Challenge and FPL Draft, and above that the wider Premier League site bar. Every URL now carries a language prefix (`/en/`). Signed-in team pages (Points, Pick Team, Transfers) exist and are named in the official FAQ, but I could not see the signed-in bar itself on 13 Nov. (Seen 14 Nov 2026; see [Signed in](#signed-in-seen-14-nov-2026).)

### Cited Findings
- On the signed-out live site, the FPL sub-nav reads "Home, Prizes, The Scout, Price Changes, Injuries, Podcast, Help, Statistics". Above it, a "Fantasy" product switcher links "FPL Challenge" (fplchallenge.premierleague.com) and "FPL Draft" (draft.premierleague.com) — [FPL home, live site](https://fantasy.premierleague.com/en/)
- Nav targets: Home `/en/`, Prizes `/en/prizes`, The Scout `/en/the-scout`, Price Changes `/en/price-changes`, Help `/en/help`, Statistics `/en/statistics`. Injuries and Podcast leave the FPL site for premierleague.com (`/latest-player-injuries/`, `/official-fpl-podcast/`) — [FPL home, live site](https://fantasy.premierleague.com/en/)
- The FPL site sits inside the Premier League site shell. The outer header has Matches, Table, Statistics, Fantasy (with Fantasy Premier League, Fantasy Draft and Fantasy Challenge), News, Injuries, Games & Trivia, Players, Clubs and Video. The footer has language switches (English, Español, Arabic, Thai), Cookie Policy, Manage Cookies and "Appearance" (`premierleague.com/en/settings/appearance`) — [FPL home, live site](https://fantasy.premierleague.com/en/)
- The signed-out home page is a sign-up pitch. It says "Register to Play Fantasy Premier League" and claims "over 11 million players". It has "Log in" and "Register now" buttons, three selling points (Pick Your Squad with a £100m budget for 15 players; Create and Join Leagues; Compete Against Friends) and a "Latest from The Scout" article feed — [FPL home, live site](https://fantasy.premierleague.com/en/)
- The official FAQ names manager-facing tabs: "Go to the Points tab for your team and select Gameweek History" and "Go to the Transfers tab for your team and scroll down to the Transfers and Finance section" — [FPL FAQs, live site](https://fantasy.premierleague.com/en/help/faqs)
- Official articles name "Pick Team" and "Transfers" pages, and in 2026/27 managers "switch between new squad views on the 'Pick Team', 'Points' and 'Transfers' pages" — [PL: FPL basics, making transfers (20 Jul 2026)](https://www.premierleague.com/en/news/2174907/fpl-basics-making-transfers); [PL: changes for 2026/27](https://www.premierleague.com/en/news/4679873/all-you-need-to-know-about-changes-to-fpl-for-202627)
- The Help page says: "On web, you can also select the help icon whenever it appears to view information about the current page." A "?" button appears on Statistics, Fixtures and the Points view — [FPL Help, live site](https://fantasy.premierleague.com/en/help)
- Opening `/en/leagues` while signed out shows the register/log-in pitch instead of the leagues page, so Leagues is a signed-in page — [FPL leagues URL, live site](https://fantasy.premierleague.com/en/leagues)

### Inferences
- The pages fall into three groups. **My team** (signed in): Points, Pick Team, Transfers and Leagues & Cups. **Public game data** (signed out too): Statistics, Fixtures, Price Changes, Team of the Week, and any manager's Points and History pages. **Content and help**: The Scout, Podcast, Injuries, Prizes and Help (Rules, FAQs, T&Cs, New).
- Fixtures is not in the signed-out nav, yet `/en/fixtures` loads signed out. It is reached from the fixtures panel on Points pages, and probably from the signed-in nav.

### Gaps
- I could not see the signed-in nav bar. Before 2025 it was, from memory without a source: Status (home), Points, Pick Team, Transfers, Leagues & Cups, Fixtures, The Scout, Podcast, Stats, Prizes, Help. Whether 2025/26 kept a "Status" page is unconfirmed; no source mentioned one. (Closed 14 Nov 2026: the bar was seen and Status exists; see [Signed in](#signed-in-seen-14-nov-2026).)
- I could not confirm the account menu (sign-out, team details, email preferences). The FAQ has a question "How do I change my team name or the team I support?", but its answer was collapsed.

## Each page: what it shows and what the manager does there

### Takeaway
A manager needs these pages: the Points view of any manager (pitch or list, gameweek stats, fixtures panel, manager sidebar), Pick Team (line-up, captain, bench order, Bench Boost and Triple Captain), Transfers (player list beside the pitch, Make Transfers then Confirm, where Wildcard and Free Hit are played), Entry History, Transfer History, league standings with phase filters, cups, Team of the Week, Statistics, Fixtures with FDR, Price Changes, Help, Prizes and The Scout. A player modal opens over any list.

### Cited Findings

**Points / gameweek view (`/en/entry/{id}/event/{gw}`, public)**
- The page shows the team name, "Gameweek 10", and the gameweek numbers: Average Points, Highest Points (linking to that manager's entry), the team's Total Points, GW Rank and Transfers (linking to the transfer list). There is a previous/next gameweek arrow (`/en/entry/1/event/9`) and a "Team of the Week" link — [FPL entry event page, live site](https://fantasy.premierleague.com/en/entry/1/event/10)
- A "Pitch / List" toggle sits beside a view selector ("Points, Current Price, Form, Ownership, Price Change"). The pitch shows the 11 starters with points each, and "Substitutes" shows GKP plus bench slots numbered "1. MID, 2. DEF, 3. DEF" — [FPL entry event page, live site](https://fantasy.premierleague.com/en/entry/1/event/10)
- Below the pitch, a "Fixtures" panel shows that gameweek's date range, the deadline ("Deadline: Fri 6 Nov, 18:30"), a note that all times are local, results with FT, and "Watch Live On" broadcaster links — [FPL entry event page, live site](https://fantasy.premierleague.com/en/entry/1/event/10)
- The manager sidebar, shown on every entry page, holds:
  - team and manager name, and "Report Offensive Name" (`/en/help/report-name?entryId=1`)
  - **Points & Rankings**: Overall points, Overall rank, Total players (11,289,081), Gameweek points, and a "Gameweek History" link
  - **Fan League** with "View League"
  - **My Leagues**, grouped as Broadcaster Leagues (e.g. Sky Sports League), Invitational Classic Leagues and General Leagues (country, Gameweek 1 start, club, Overall, Second Chance, Top 1% 25/26, Top 10% 25/26), each with a rank, plus "Create/Join Leagues" (`/en/leagues`)
  - **My Cups**, grouped as League cups, General cups and Broadcaster cups
  - **Transfers**: a "Transfer History" link and Total transfers
  - **Finance**: Squad value and In the bank, "Values at the last deadline"
  
  — [FPL entry event page, live site](https://fantasy.premierleague.com/en/entry/1/event/10)
- 2026/27 change: Pick Team, Points and Transfers gained switchable squad views showing FDR, ownership and next opponent, with form and price-change likelihood added once the season started — [PL: changes for 2026/27](https://www.premierleague.com/en/news/4679873/all-you-need-to-know-about-changes-to-fpl-for-202627)
- 2026/27 change: global and mini-league standings now update live during matches, and projected bonus points are added after 20 minutes of each match. Gameweek lockdown moved to 09:00 UK time the day after the final match — [PL: changes for 2026/27](https://www.premierleague.com/en/news/4679873/all-you-need-to-know-about-changes-to-fpl-for-202627)

**Pick Team**
- Each gameweek the manager chooses 11 starters from 15, orders the bench, and picks a captain (points doubled) and a vice-captain (doubled if the captain doesn't play) — [FPL Help, live site](https://fantasy.premierleague.com/en/help)
- Formation: 1 GK, at least 3 DEF and at least 1 FWD — [FPL FAQs, live site](https://fantasy.premierleague.com/en/help/faqs)
- Automatic substitutions are processed at the end of the gameweek in bench order, GK for GK, and outfield subs only if the formation stays legal. "Playing" means appearing or receiving a card — [FPL Rules, live site](https://fantasy.premierleague.com/en/help/rules)
- Bench Boost and Triple Captain "can be used when saving your team on the Pick Team page" and "can be cancelled before the Gameweek deadline" — [FPL Rules, live site](https://fantasy.premierleague.com/en/help/rules)
- Changes take effect only if saved before the deadline, which is 90 minutes before the first kick-off of the gameweek and "will not change within 24 hours of the scheduled time". The Rules page lists all 38 deadlines in a table — [FPL Rules, live site](https://fantasy.premierleague.com/en/help/rules)

**Transfers**
- The flow: on the Transfers page, click the "X" on a player's card on the pitch, choose a replacement in the "Player Selection" column on the left (same position, within budget, at most 3 per club), click "Make Transfers" below the pitch, then "Confirm". The price shown is the selling price — [PL: FPL basics, making transfers (20 Jul 2026)](https://www.premierleague.com/en/news/2174907/fpl-basics-making-transfers)
- Transfers are unlimited and free before the season. After that, 1 free transfer per gameweek, rolling over to a maximum of 5. Each extra transfer costs 4 points (a "points hit") — [FPL Help, live site](https://fantasy.premierleague.com/en/help); [PL basics, transfers](https://www.premierleague.com/en/news/2174907/fpl-basics-making-transfers)
- Selling price: the manager keeps half of any rise, rounded down to £0.1m (bought £7.5m, now £7.8m, sells for £7.6m) — [FPL Rules, live site](https://fantasy.premierleague.com/en/help/rules)
- Players are added to a Watchlist from the player profile ("Add to Watchlist"), and the Watchlist appears on the Transfers page. "Watchlist" is also a filter option on Statistics — [Fantasy Football Scout comment, via search summary](https://www.fantasyfootballscout.co.uk/comment/27222254); [FPL Statistics, live site](https://fantasy.premierleague.com/en/statistics)
- The FAQ includes "Can I cancel my transfers?", "I think I'm missing a free transfer" and "Why does my Wildcard still show as 'Pending' after I've made a transfer?". The last implies the Wildcard shows a Pending state on the Transfers page until confirmed — [FPL FAQs, live site](https://fantasy.premierleague.com/en/help/faqs)
- 2025/26 only: free transfers were topped up to the maximum of 5 in GW16 for AFCON. This was not repeated in 2026/27 — [PL: 2025/26 changes](https://www.premierleague.com/en/news/4362211); [PL: 2026/27 changes](https://www.premierleague.com/en/news/4679873/all-you-need-to-know-about-changes-to-fpl-for-202627)

**Chips**
- There are 4 chips, each given twice a season (first half and second half), 8 in all. Only one chip can be played per gameweek, and unused first-half chips are lost. The Assistant Manager chip was dropped for 2025/26. In 2025/26 the first set had to be used by the GW19 deadline (18:30 GMT, Tue 30 Dec 2025) — [PL: 2025/26 changes](https://www.premierleague.com/en/news/4362211)
- Where each chip is played and the cancel rules (2026/27 Rules page, same as 2025/26):
  - **Bench Boost / Triple Captain**: played on Pick Team when saving; can be cancelled before the deadline.
  - **Free Hit**: "played when confirming your transfers and cannot be cancelled once confirmed". Available from after GW1. Can't be played in consecutive gameweeks (GW19, then not before GW21). The squad and bank revert at the next deadline.
  - **Wildcard**: "played when confirming transfers and cannot be cancelled once played". Not available in GW1. The second one is available from the GW19 deadline to season end.
  - Wildcard and Free Hit keep banked free transfers.
  
  — [FPL Rules, live site](https://fantasy.premierleague.com/en/help/rules); [PL: FPL basics, chips (20 Jul 2026)](https://www.premierleague.com/en/news/2174900/fpl-basics-chips)
- Once played, a Wildcard makes every transfer in that gameweek free, including those made before it was played — [FPL FAQs, live site](https://fantasy.premierleague.com/en/help/faqs)
- The FAQ also has "Why is a chip listed as Unavailable?" and "Is my chip active?", which implies chip buttons show states such as Unavailable and Active — [FPL FAQs, live site](https://fantasy.premierleague.com/en/help/faqs)
- Chips used appear on the Entry History page as Date / Name / Active GW, e.g. "Fri 28 Aug 18:25, Bench Boost, GW2" — [FPL entry history, live site](https://fantasy.premierleague.com/en/entry/1/history)

**Player detail modal** (opened by "View player information" on any player row)
- Header: position, full name, club, links to "Player Profile" and "Buy Player Shirt" (both external), price with "View all Price Predictions", and a stat strip: Form, Pts/Match, GW Pts, Total Pts, Total Bonus, ICT Index and TSB %, each with a rank such as "1 of 219" — [FPL Statistics → player modal, live site](https://fantasy.premierleague.com/en/statistics)
- Summary blocks: Form (last 3 gameweeks with opponent, home/away and points) and Fixtures (next 3, each with a numeric "Fixture difficulty") — [same](https://fantasy.premierleague.com/en/statistics)
- Tabs:
  - **History**: "This Season" per gameweek: GW, Opponent, Result, Pts, ST, MP, GS, A, xG, xA, xGI, CS, GC, xGC, T, CBI, R, DC, OG, PS, PM, YC, RC, S, BP, BPS, I, C, T, II, NT (net transfers), TSB, £. Below that, Totals and Per 90 rows, then "Previous Seasons" (the same stats plus £S and £E, start and end price).
  - **Fixtures**: the rest of the season.
  
  — [same](https://fantasy.premierleague.com/en/statistics)

**Statistics (`/en/statistics`, public)**
- Contains "Find a player" search and three dropdowns:
  - **View**: All players, Watchlist, by position (GK/DEF/MID/FWD), or by each of the 20 clubs.
  - **Sorted by**: Total points, Gameweek points, Price, Teams selected by %, Minutes, Goals, Assists, Clean sheets, Goals conceded, Own goals, Pens saved, Pens missed, Yellow cards, Red cards, Saves, Bonus, BPS, Influence, Creativity, Threat, ICT Index, Form, Times in Dream Team, Value (form), Value (season), Points per match, Transfers in/out (season and gameweek), Price rise/fall (season and gameweek), xA, xG, xGI, xGC, Starts, Tackles, CBI, Recoveries, Defensive Contributions.
  - **Max cost**: £15.8m down to £4.3m.
  
  There is also a Reset button. Table columns: Player, £, TSB, Form, plus the sorted stat (e.g. TP). A caption explains the stat ("Total points earned this season.") — [FPL Statistics, live site](https://fantasy.premierleague.com/en/statistics)
- The "DC" (defensive contribution) stat was new for 2025/26 — [Fantasy Football Scout](https://www.fantasyfootballscout.co.uk/comment/27222041)

**Fixtures (`/en/fixtures`, public)**
- Titled "Fixtures & Results", with two tabs, "Fixtures" and "FDR". It shows one gameweek at a time with its date range, deadline, local-time note, kick-off times and "Watch Live On" links — [FPL fixtures, live site](https://fantasy.premierleague.com/en/fixtures)
- FAQ entries cover "What is the Fixture Difficulty Rating (FDR)?", blank gameweeks (players score 0) and double gameweeks — [FPL FAQs, live site](https://fantasy.premierleague.com/en/help/faqs)

**Price Changes (`/en/price-changes`, public; new for 2026/27)**
- Tabs: "Predictions" and "Recent Price Changes". Filters: Rise & drop / Rise / Drop / Locked, and position. There is an "Understanding Price Changes" explainer, a countdown to the next change (00:00 local) and "Updates every 15 minutes". Columns: Player, Status (e.g. "Likely to drop"), Progress %, Predicted Progress %, Ownership Trend, Current Price — [FPL price changes, live site](https://fantasy.premierleague.com/en/price-changes)
- The Price Change Predictor is new in 2026/27 and did not exist in 2025/26 — [PL: 2026/27 changes](https://www.premierleague.com/en/news/4679873/all-you-need-to-know-about-changes-to-fpl-for-202627)
- Prices don't change before the season starts. During it they move with transfer popularity — [FPL Rules, live site](https://fantasy.premierleague.com/en/help/rules)

**Leagues & Cups**
- League types: invitational (private) leagues and cups, made by creating a league and sharing its unique code, with a cup created automatically alongside. A manager can join up to 30 private leagues (no size limit) and up to 5 public leagues of randomly assigned teams — [FPL Rules, live site](https://fantasy.premierleague.com/en/help/rules)
- Global leagues entered automatically: Overall; country; favourite-club supporters; managers who started the same gameweek; Second Chance (from GW21); the Fantasy Cup. Leagues with entry conditions: 1% League 25/26 and 10% League 25/26 (top ranks last season; new in 2025/26) and Rookie League (first-season managers; new in 2026/27) — [FPL Rules, live site](https://fantasy.premierleague.com/en/help/rules); [PL: 2025/26 changes](https://www.premierleague.com/en/news/4362211)
- Classic scoring ranks by total points; ties go to fewer transfers (Wildcard and Free Hit transfers excluded), and then share the place. Monthly phases run August to May, plus Overall. A team cannot leave a classic league if it is in that league's cup — [FPL Rules](https://fantasy.premierleague.com/en/help/rules); [FAQs](https://fantasy.premierleague.com/en/help/faqs)
- Head-to-head: 3 points for a win, 1 for a draw. Fixtures are generated at the league's first gameweek, which locks the league. An odd number of teams adds an "average" team. Ties go to total points. An optional knock-out stage runs over up to 3 gameweeks — [FPL Rules, live site](https://fantasy.premierleague.com/en/help/rules)
- Cups: random draw each round, winner is the higher gameweek score minus hits. Tie-breaks: most goals scored, then fewest conceded, then a virtual coin toss. A "BYE" means progressing without a match — [FPL Rules](https://fantasy.premierleague.com/en/help/rules); [FAQs](https://fantasy.premierleague.com/en/help/faqs)
- Classic standings page (`/en/leagues/{id}/standings/c`): league name and "View Cup Info". A phase dropdown (Overall, August, September, October, November so far), Reset, and "Last updated" with a timestamp. Columns: Rank, Team & Manager, GW, Total. 50 rows per page with "Next". Each team links to its Points view — [FPL Overall league, live site](https://fantasy.premierleague.com/en/leagues/314/standings/c)
- Cup URLs look like `/en/leagues/{id}/cup-not-started` before a cup begins — [FPL entry event page, live site](https://fantasy.premierleague.com/en/entry/1/event/10)
- FAQ league-admin questions: invite managers, close the league to new entries, renew from last season, why a manager was removed, why you can't leave, how to view other teams, why you're not in your club or country league, can you change country — [FPL FAQs, live site](https://fantasy.premierleague.com/en/help/faqs)
- Joining is through "Create & Join New Leagues & Cups", with an "Invite Friends" code to share — [Fantasy Football Community, via search](https://fantasyfootballcommunity.com/?p=82175)

**Entry History (`/en/entry/{id}/history`, public)**
- "This Season", per gameweek: GW, OR (overall rank), rank movement, % Rank, OP (overall points), GWR, GWP, PB (points on bench), TM (transfers made), TC (transfer cost), £m (team value). Then "Chips" (Date, Name, Active GW) and "Previous Seasons" (Season, Points, Rank, % Finish), ending with a "Career Average" row — [FPL entry history, live site](https://fantasy.premierleague.com/en/entry/1/history)
- The career average compared with all managers was new in 2026/27 — [PL: 2026/27 changes](https://www.premierleague.com/en/news/4679873/all-you-need-to-know-about-changes-to-fpl-for-202627)

**Transfer History (`/en/entry/{id}/transfers`, public)**
- Columns: Time, In, Out, Active (GW). It lists every transfer of the season, including those made under a Wildcard or Free Hit — [FPL entry transfers, live site](https://fantasy.premierleague.com/en/entry/1/transfers)

**Team of the Week (`/en/team-of-the-week/{gw}`, public)**
- "Team of the Week, Gameweek 10" shows the XI's total points and "Player of the Week" (name, club, points), with the same Pitch/List toggle, view selector and fixtures panel as the Points view. The old name "Dream Team" survives in the "Times in Dream Team" stat; `/en/dream-team` returns "Page not found" — [FPL team of the week, live site](https://fantasy.premierleague.com/en/team-of-the-week/10); [/en/dream-team, live site](https://fantasy.premierleague.com/en/dream-team)

**Help (`/en/help`), Rules, FAQs, T&Cs, New, Prizes**
- Help is a "New to Fantasy Premier League? Start here" guide with these anchors: FPL in 60 seconds, Steps 1–7 (Build squad, Pick line-up, Choose captain, Points, Transfers, Chips, Leagues), Gameweek checklist, FPL glossary, Ready for more. Sub-tabs: Rules `/en/help/rules`, FAQs `/en/help/faqs`, T&Cs `/en/help/terms`, NEW `/en/help/new` — [FPL Help, live site](https://fantasy.premierleague.com/en/help)
- Rules is an accordion with these sections: Selecting Your Initial Squad (Squad Size, Budget, Players Per Team); Managing your squad; Transfers (rules, Wildcards, Player Prices); Chips; Deadlines (38-row table); Scoring (incl. defensive contributions, assists, bonus, the full BPS table); Leagues; Cups — [FPL Rules, live site](https://fantasy.premierleague.com/en/help/rules)
- FAQ groups: myPremierLeague account (sign in, delete account, link old account), initial squad, managing your team (change team name or supported club), offensive names and badge images (report form), chips, leagues, cups, transfers, wildcards, blank and double gameweeks, player data, defensive contribution, bonus, assists, automatic subs, PL transfers, weekly and monthly prizes, Premier League app — [FPL FAQs, live site](https://fantasy.premierleague.com/en/help/faqs)
- Prizes (`/en/prizes`) has tabs "Winners" and "Prizes" and lists overall prizes for 1st, runner-up, 3rd and 4th–10th. The FAQ refers to weekly and monthly prizes, with ties going to the lowest team ID — [FPL prizes, live site](https://fantasy.premierleague.com/en/prizes); [FAQs](https://fantasy.premierleague.com/en/help/faqs)

**Sign-up and squad selection**
- Sign-up uses a myPremierLeague account ("Log in", "Register now") — [FPL home](https://fantasy.premierleague.com/en/); [FAQs](https://fantasy.premierleague.com/en/help/faqs)
- Initial squad: 15 players, £100.0m, at most 3 per club — [FPL Help](https://fantasy.premierleague.com/en/help); [Rules](https://fantasy.premierleague.com/en/help/rules)
- A "full player list you can view and print" is offered for picking a squad — [FPL FAQs, live site](https://fantasy.premierleague.com/en/help/faqs)
- 2026/27 added guided squad selection on the website: beginners answer a few questions and get a squad matched to their preferences, and experienced managers can skip it — [PL: 2026/27 changes](https://www.premierleague.com/en/news/4679873/all-you-need-to-know-about-changes-to-fpl-for-202627)
- 2025/26 added a team badge creator using Adobe Express and Firefly generative AI. It continued in 2026/27 along with Adobe Express "Gameweek Recaps" — [PL: 2025/26 changes](https://www.premierleague.com/en/news/4373187/whats-new-for-202526-changes-in-fantasy-premier-league); [PL: 2026/27 changes](https://www.premierleague.com/en/news/4679873/all-you-need-to-know-about-changes-to-fpl-for-202627)

**The Scout (`/en/the-scout`)**
- An editorial feed of premierleague.com articles and videos: fixture analysis, price-change round-ups, "lessons from" match videos, suspension watch, chip strategy, basics explainers, Team of the Season so far — [FPL home "Latest from The Scout", live site](https://fantasy.premierleague.com/en/)

### Inferences
- Any manager's Points, History and Transfers pages are public by ID. That is how "viewing another manager's team" works, from league tables and from the "Highest Points" link.
- The manager sidebar (ranks, leagues, cups, transfers, finance) appears on every entry page, so a copy needs it as one shared component, not a separate page.

### Gaps
- No source showed the Pick Team or Transfers screens themselves: chip button placement, the confirm-transfers dialog wording, how a hit is displayed, or the Wildcard/Free Hit confirmation modal. They need a signed-in look. (Partly closed 14 Nov 2026: Pick Team and Transfers were seen, chip tiles included; see [Signed in](#signed-in-seen-14-nov-2026).)
- I did not see the create-league form (fields such as classic or H2H, start gameweek, H2H knock-out option, closing entries) or the cup page once a cup has started.
- I found no source on account settings or email preferences; they live in the myPremierLeague account on premierleague.com.
- I found no source confirming whether a "Status" home page still exists for signed-in managers in 2025/26. (Closed 14 Nov 2026: it does; see below.)

## Signed in, seen 14 Nov 2026

### Takeaway
Signed in, the bar is Pick Team, Points, Transfers, Leagues, Help, The Scout, Price Changes, Status, Fixtures, Injuries, Statistics, Podcast, Prizes, Sign Out. Status exists and is the busiest page: the gameweek's whole story in one place. Every team page shares the manager sidebar on the left and puts the pitch on the right; a player opens in a drawer from the right, not a modal. Seen in Gameweek 11, deadline Sat 21 Nov 11:00 local time, on Craig's team (no transfers, captain or chip changes were made).

### Seen
- **Shared sidebar**, on Pick Team, Points, Transfers and Status: team name and manager; Points & Rankings (overall points, overall rank, total players, gameweek points, a Gameweek History link); Team Badge with Edit My Badge (made with Adobe Express, a sponsor); Fan League (the favourite club's crest, View League); My Leagues, grouped invitational classic, invitational head-to-head and general, each with rank and a green up or red down arrow; My Cups; Transfers (this gameweek's, total, Transfer History); Finance (squad value, in the bank); Admin (Team Details, User Profile).
- **Pick Team**: gameweek and deadline at the top; four chip tiles in a row, each saying "Played GWn" once used; a hint line "To change your captain use the menu which appears when clicking on a player"; Pitch or List; a dropdown that changes the line under every shirt: Opponent, Points, Current Price, Selling Price, FDR, Form, Ownership, Price Change. Shirts carry small badges: C, V, an injury triangle, and a yellow name bar for a doubt. The bench sits under the pitch as GKP, then 1, 2, 3 with each one's position. A share button sits beside the title. Below the pitch: a Team news carousel by fixture, then the gameweek's fixtures by day, each marked "Watch Live On" a broadcaster.
- **Points**: gameweek arrows either side of "Gameweek 10"; a strip of Average Points (55), Highest Points (139, a link to that team), Total Points in a large tile (63), GW Rank, and Transfers (a link); a Team of the Week link under it; Pitch or List; the same dropdown, set to Points. A player opens a right-hand drawer: name, the match and score with its broadcaster, then a Points breakdown table of Statistic, Value, Points (e.g. Minutes played 85 → 2 pts, Goals scored 1 → 4 pts) and View full profile.
- **Transfers**: Player Selection on the left (search by name, position filter, sort, a max-price filter, a "566 players shown" bar, players grouped by position with price and total points, owned players greyed with a ×); the pitch on the right with each player's selling price above the shirt; above it the Wildcard and Free Hit tiles and four counters: Players selected 15/15, Budget £0.2m, Free transfers 2, Cost 0 pts. Auto Pick, Reset and Make Transfers sit under the pitch.
- **Leagues & Cups**: Leagues and Cups tabs; Join a League, Create a League, Renew Your Leagues (carries last season's leagues on); tables with Current Rank and Last Rank. Craig's general leagues: Adobe Express Badge League (sponsor), country (Cocos Islands), Gameweek 1 (the start week), Newcastle (club), Overall, Second Chance, Top 10% 25/26 (last season's top 10%).
- **A league table**: name, a Report Offensive Name button, View Cup info, a phase filter (Overall), "Last updated Sat 14 Nov 13:53", then Rank with movement, Team & Manager, GW, Total. The viewer's own row is highlighted.
- **Status**: each match day of the last gameweek as CONFIRMED; transfers made (9,423,215), wildcards played, most transferred in, most captained; top 5 transfers in and out with counts; Player of the Week for every gameweek of the season (GW1 to GW38, blank ahead); Team of the Week; Player Availability (injury lines such as "Calf injury - 75% chance of playing", "Suspended until 5 Dec"); Most Valuable Teams; Best Leagues (average of each league's top 5); The Scout feed; the manager's last gameweek beside average and highest; a live countdown to the next deadline; Upcoming Deadlines.

### Inferences
- Status is its own page in the bar, beside Pick Team and Points. Flol's Home ([spec/12](../../../spec/12-pages.md)) folds a status page into Home; FPL's Status shows what such a page holds once the season is running.
- The pitch dropdown is one control that turns the pitch into a price, form, ownership or fixture view. It covers what Flol's Transfers picture handles with separate views.
- League housekeeping FPL treats as standard: renewing leagues into a new season, reporting an offensive team name, and showing when a table last updated.

### For Flol: seen in FPL, not in the spec yet
Claude's notes, not Craig's wants. Each is FPL's rule, so it already applies where a spec file is silent ([SPEC.md](../../../SPEC.md), the base assumption), but none has been asked:
- Reporting an offensive team name, and what an admin does with one.
- Renewing private leagues into the next season.
- Status lines: most captained, top transfers in and out, how many played each chip, Player of the Week for every gameweek.
- Average and highest points on the Points page, the highest linking to that team.
- A broadcaster under each series ("Watch Live On"), which Flol's Live page could feed.
- The leagues FPL adds beyond Overall, country and club: a league per start gameweek, Second Chance (points from a later gameweek), and last season's top 10%.

## App-only and web-only features

### Takeaway
FPL is played on fantasy.premierleague.com and inside the official Premier League app, which carries Classic, Draft and Challenge with live points. Officially web-only items are the help icon, guided squad selection (2026/27) and career-average comparison. No official app-only FPL feature was found.

### Cited Findings
- The Premier League app listing says "Full management of your Fantasy Premier League squad from anywhere", "Track live FPL points" and "Classic, Draft and Challenge formats all in one place". "Smart alerts" for line-ups and goals are listed but not tied to Fantasy — [App Store: Premier League app](https://apps.apple.com/us/app/1138895159)
- The FPL FAQ has a "Premier League app" section. If a manager has trouble near a deadline in the app, it tells them to use the FPL website instead — [FPL FAQs, live site](https://fantasy.premierleague.com/en/help/faqs)
- Web-only, per official text: the per-page help icon ("On web…"), guided initial squad selection ("through the website") and career-average comparison ("on the Fantasy website") — [FPL Help](https://fantasy.premierleague.com/en/help); [PL: 2026/27 changes](https://www.premierleague.com/en/news/4679873/all-you-need-to-know-about-changes-to-fpl-for-202627)
- The site and app were redesigned in late July 2025 with Microsoft AI features, including a chatbot companion. Launch problems were reported: sign-in failures, and endless loading on Android and with privacy blockers — [Consultancy.uk, 12 Aug 2025](https://www.consultancy.uk/news/41215/ai-ux-fantasy-premier-league-overhaul-leaves-some-fans-disenchanted); [Broadcast Now](https://www.broadcastnow.co.uk/tech-innovation/fan-engagement-premier-league-overhauls-app-and-website/5206642.article)
- Several unofficial FPL apps exist (We Play FPL, xFPL, FPL Wizard), not affiliated with the Premier League — [search results: App Store / Google Play listings](https://apps.apple.com/us/app/we-play-fpl-your-fantasy-hq/id6446408524?uo=4)

### Inferences
- The FPL FAQ speaks only of the "Premier League app" and an older standalone listing ("The OG FPL app", id324266640) still appears in search. This suggests the main PL app is now the official mobile home of FPL, but I found no source saying the standalone app was retired.

### Gaps
- I found no source listing which FPL push notifications exist (deadline reminders, price changes, live goals for your players).
- I found no source confirming whether the AI assistant or chatbot launched inside FPL itself, or only as the separate "Premier League Companion".

## URL patterns for key pages

### Takeaway
All pages are under `fantasy.premierleague.com/en/`. Manager pages key on the entry ID and league pages on the league ID. The public JSON API under `/api/` mirrors them.

### Cited Findings
Web paths, from the live site:
- `/en/` home; `/en/prizes`; `/en/the-scout`; `/en/price-changes`; `/en/statistics`; `/en/fixtures` — [FPL, live site](https://fantasy.premierleague.com/en/)
- `/en/help`, `/en/help/rules`, `/en/help/faqs`, `/en/help/terms`, `/en/help/new`, `/en/help/report-name?entryId={id}` — [FPL Help, live site](https://fantasy.premierleague.com/en/help)
- `/en/entry/{id}/event/{gw}` (points view), `/en/entry/{id}/history`, `/en/entry/{id}/transfers` — [FPL entry pages, live site](https://fantasy.premierleague.com/en/entry/1/event/10)
- `/en/leagues` (create/join, signed in), `/en/leagues/{id}/standings/c` (classic), `/en/leagues/{id}/cup-not-started` (cup before it starts) — [FPL entry event page, live site](https://fantasy.premierleague.com/en/entry/1/event/10)
- `/en/team-of-the-week/{gw}` — [FPL, live site](https://fantasy.premierleague.com/en/team-of-the-week/10)

API mirrors, all under `/api/`:
- `bootstrap-static/` holds players, clubs, gameweeks, chips and rules — [Medium: FPL API guide](https://medium.com/@frenzelts/fantasy-premier-league-api-endpoints-a-detailed-guide-acbd5598eb19)
- `element-summary/{player_id}/` holds the modal's fixtures, history and past seasons — [same](https://medium.com/@frenzelts/fantasy-premier-league-api-endpoints-a-detailed-guide-acbd5598eb19)
- `entry/{id}/`, `entry/{id}/history/`, `entry/{id}/event/{gw}/picks/` and `event/{gw}/live/` — [ExFPL API reference](https://hexdocs.pm/ex_fpl/api-reference.html)
- `leagues-classic/{id}/standings/` returns 50 rows per page, with a page parameter — [ExFPL API reference](https://hexdocs.pm/ex_fpl/api-reference.html)
- `me/` and `my-team/{id}/` need sign-in — [ExFPL API reference](https://hexdocs.pm/ex_fpl/api-reference.html)
- The API is undocumented and can change without notice — [sportsapis.dev](https://sportsapis.dev/fpl-api)

### Inferences
- Head-to-head standings probably follow `/en/leagues/{id}/standings/h`, mirroring `/c` for classic. Not verified.

### Gaps
- I could not see the signed-in paths for Pick Team, Transfers, squad selection or create/join league forms. (Partly closed 14 Nov 2026: Pick Team, Transfers and Leagues & Cups were seen; see [Signed in](#signed-in-seen-14-nov-2026).)
- From memory without a source, before 2025 they were `/my-team`, `/transfers`, `/squad-selection`, `/leagues/create`, `/leagues/join`. Whether they now carry `/en/` is unconfirmed.
- The old `/dream-team/{gw}` path is gone, replaced by `/en/team-of-the-week/{gw}`, as observed.
