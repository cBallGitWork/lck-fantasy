# Build Flol's points page from FPL's bones

> Background, never the product (CLAUDE.md). How a series scores (best 2 games) and what scores (multikills yes, POG no) are already settled in spec/05; this report's open calls on them predate that read.

**Contents:** FPL's page anatomy · Breakdowns open in a drawer · Live, provisional and final · Rank movement · How LoL shows player lines · What Flol can borrow · Fun ideas with a LoL spin · Gaps · Conclusion

FPL's 2026/27 Points page is the clearest model. It has a manager column on the left and a main column with a stat header, the pitch, the bench, an auto-sub table and the week's fixtures. Clicking a player opens a right-hand drawer with a match card and a Statistic / Value / Points table. Live scoring is now the norm: FPL adds projected bonus during matches and confirms scores at a fixed "lock" time the next morning. Rank movement is shown by direction only, with green and red circles and no number. LoL sites show a player's game as one row: champion, name, build, then KDA and CS on the right, in top-to-support order. A series is a row of game tabs that grows as games are played. Flol can borrow FPL's page frame whole and swap in LoL's row and series shapes for the breakdown. Riot's own LTA Fantasy shows a series can be averaged or summed, so the screen must show the game lines behind whichever rule Craig picks. No official LCK fantasy game exists today, so Flol has no local rival to copy or beat on screen.

## FPL's page puts the score centre and the manager left

The page is titled "View Latest Gameweek Points", with the team name as the heading and previous/next gameweek arrows under it ([FPL entry 1, GW10](https://fantasy.premierleague.com/en/entry/1/event/10)). The header row runs **Average Points, Highest Points, a large gradient box with the manager's Total Points, GW Rank, and Transfers**. A "Team of the Week" link sits under the big box (same page). A points hit shows as a small red **"-4 pts" pill** beside the transfer count. The big box still shows the gross score; the API stores points and transfer cost apart ([FPL entry 12](https://fantasy.premierleague.com/en/entry/12/event/10); [API picks](https://fantasy.premierleague.com/api/entry/12/event/10/picks/)). A played chip hangs as a white tab under the big box. Under Bench Boost the bench strip glows, showing it scores ([FPL entry 94](https://fantasy.premierleague.com/en/entry/94/event/10)).

Below the header sit a **Pitch | List** toggle and an overlay menu: Points, Current Price, Form, Ownership, Price Change. These views are new for 2026/27 ([Premier League](https://www.premierleague.com/en/news/4679873/all-you-need-to-know-about-changes-to-fpl-for-202627)). Each pitch tile is a shirt, a name bar and a points bar. Captain points show already doubled. Small corner badges mark **C, V, a Team of the Week star and injury flags** ([FPL entry 1](https://fantasy.premierleague.com/en/entry/1/event/10)). The list view groups by position, with stat columns Pts, MP, GS, A, CS and so on (same page).

Auto-subs are not drawn on the tiles. The subbed-in players simply stand on the pitch and the absent starters sit on the bench with 0. A plain **"Automatic Substitutions" table (Player out | Player in)** sits below the bench ([FPL entry 7](https://fantasy.premierleague.com/en/entry/7/event/10)). Under that sits the gameweek's fixtures block with scores and "FT".

The left column is the manager: Points & Rankings, the fan league, every league with a movement marker, cups, transfers and finance ([FPL entry 1](https://fantasy.premierleague.com/en/entry/1/event/10)). Older FPL put this column on the right (inference, from memory of past layouts).

| Zone | What FPL puts there |
|---|---|
| Header | Average · Highest · big Total Points box · GW Rank · Transfers (with hit pill) |
| Under header | Chip tab, Team of the Week link, Pitch/List toggle, overlay menu |
| Main | Pitch with badges, bench strip with order labels, auto-sub table, fixtures |
| Left column | Manager, points and ranks, leagues with arrows, cups, transfers, finance |
| On click | Right drawer: match card, Statistic / Value / Points table, "View full profile" |

## Breakdowns open in a drawer, one row per scoring event

Clicking a tile dims the page and opens a **right-side drawer**. It shows the full name, a match card (teams, score, "FT", broadcaster), then a **"Points breakdown" table with columns Statistic | Value | Points**, for example "Minutes played | 90 | 2 pts" ([FPL entry 1](https://fantasy.premierleague.com/en/entry/1/event/10)). The API behind it gives one block per fixture, each with a list of stat, value and points ([API live](https://fantasy.premierleague.com/api/event/1/live/)). So a double gameweek already splits by match. That is the hook for a Bo3 or Bo5 (inference).

US apps go further. Sleeper shows box scores already converted to your league's points, so nobody does the sums in their head ([Sleeper blog](https://sleeper.com/blog/what-features-does-sleeper-have-that-other-platforms-dont-have/)). Sorare shows two layers: the player's match score, then the card's boosted score ([Sorare help](https://sorare.com/help/a/22364431546269/how-does-our-fantasy-scoring-system-work)). That maps onto FPL's captain double: show the raw score and the multiplied one (inference). Kicker's matchday view shows your players' points next to your optimal line-up and the top team of the day ([kicker](https://www.kicker.de/so_funktioniert_das_managerspiel_interactive_in_der_app-783340/slideshow)). F1 Fantasy scores each driver per session: qualifying, sprint, race ([f1pitwall.dev](https://f1pitwall.dev/blog/f1-fantasy-scoring-2026)). A breakdown grouped by session maps neatly onto games in a series (inference; F1's actual screen was not seen).

## Live, provisional and final are three states with a clock

FPL now adds **projected bonus after 20 minutes of each match** and updates every league as matches run. Scores are confirmed at **"lock", 09:00 UK the day after the gameweek's last match** ([Premier League](https://www.premierleague.com/en/news/4679873/all-you-need-to-know-about-changes-to-fpl-for-202627)). The API flags each gameweek `finished` and `data_checked` ([API bootstrap-static](https://fantasy.premierleague.com/api/bootstrap-static/)). Riot's LTA Fantasy shows scores "in real time" once the market closes and settles results on Mondays. Its own pages disagree on the hour ([Riot Support](https://support.riotgames.com/en-us/league-of-legends/events/lta-fantasy-faq); [lolesports](https://lolesports.com/en-US/news/lta-fantasy-is-here)). Kicker shows points during the matchday but evaluates them only after it ends ([kicker.ch](https://www.kicker.ch/jetzt-punkte-checken-und-neu-aufstellen-das-kicker-managerspiel-zur-wm-2026-1222845/artikel)).

No source showed how any game styles "provisional" on screen. A live FPL gameweek was not running when the page was read. Trust is the real issue. ESPN's top complaint is live scores that lag or freeze, and stat corrections that flip results hours later. Sleeper is praised for speed ([unstar.app](https://unstar.app/blog/sleeper-espn-yahoo-nfl-cbs-fantasy-sports-apps-ranked-2026)). So the inference is: label the state in words (Live, Provisional, Final), state the lock time, and show a "last updated" time. That beats any extra visual.

## Rank movement is a coloured dot, and the colour is a choice

FPL marks each league row with a **green up circle, red down circle or grey dot**, with no number for the size of the move ([FPL entry 94](https://fantasy.premierleague.com/en/entry/94/event/10)). The API compares `entry_rank` with `entry_last_rank` ([API entry 1](https://fantasy.premierleague.com/api/entry/1/)). It also holds percentile rank, and 2026/27 added percentage-finish comparisons in history ([API history](https://fantasy.premierleague.com/api/entry/12/history/)). Third-party tools add the number, as in "▲1" ([livefpl](https://livefpl.com/blog/fpl-live-points)). Esports pools lean on percentiles: HLTV pays season points by placement percentile, up to the top 1% ([dotesports](https://dotesports.com/?p=626308)).

Colour clashes here. **In Korea, red means rising**, the reverse of the US ([Asia Economy](https://view.asiae.co.kr/en/article/2026071309151503447)). China, Japan and Taiwan do the same ([Benzinga](https://www.benzinga.com/general/education/21/10/23258001/did-you-know-you-dont-want-to-be-in-the-green-if-youre-trading-in-china-japan-or-taiwan)). Blue for falling is widely believed but unsourced. FPL players expect green up. Korean fans expect red up. One must be picked and kept everywhere. Red ▲ is the Korean-feeling choice (inference). That is a look call for Craig.

## LoL shows a game as one row and a series as growing tabs

Every stats site found lists players **top, jungle, mid, ADC, support**, five per team. gol.gg's game summary row runs champion and name, runes, spells, six items and trinket, then **KDA and CS last** ([gol.gg game](https://gol.gg/game/stats/82956/page-game/)). The team header carries kills, towers, dragons by type, Baron, team gold and WIN or LOSS. The page also labels patch, game time and "Fearless Draft" (same page). Its "All stats" view flips the table: players become columns and 57 stat rows run down, from KDA to multikills, steals and gold at 15 ([gol.gg full stats](https://gol.gg/game/stats/81357/page-fullstats/)).

A series on gol.gg is a tab row: **Preview, Game 1 … Game N, Summary**. Unplayed games get no tab, so a 2–0 shows two games only ([gol.gg](https://gol.gg/game/stats/81357/page-fullstats/)). Riot's 2020 broadcast HUD put gold at the centre of the top bar. It also moved from blue/red side branding to team colours ([lolesports.com](https://lolesports.com/en-US/news/summer-broadcast-updates-the-hud)). The 2021 LCK rebrand chose a minimal, boxy sans-serif look, with stats shown "with no distractions" ([Inven Global](https://www.invenglobal.com/articles/12982/the-new-era-of-lck-is-here-a-visual-journey-into-the-new-broadcast-and-lol-park)). That favours compact tables over decorative cards (inference).

LCK fans already follow a points race. **POG points** accrue per game from votes, and the split's leader wins Player of the Split. Peyz led with 1,100 in 2024 Summer ([OSEN](https://osen.co.kr/article/G1112400748); [Kukinews](https://www.kukinews.com/article/view/kuk202408200031)). Some 2025–26 English coverage says "Player of the Match (POM)" instead ([Inven Global](https://www.invenglobal.com/valorant/articles/19582/faker-reaches-700-wins-in-lck)). The current LCK label needs checking before either goes on screen.

Riot's LoL fantasy history splits on how a series counts. LTA Fantasy (2025) **averages** a player's games over the weekend, with some bonuses paid per game ([Riot Support](https://support.riotgames.com/en-us/league-of-legends/events/lta-fantasy-faq); [lolesports](https://lolesports.com/en-US/news/lta-fantasy---split-3-whats-new)). Old Fantasy LCS **summed** every game ([Upcomer](https://upcomer.com/riot-games-changing-fantasy-lcs)). It fell to about 10% of its peak and was dropped ([esports.net](https://www.esports.net/news/lol/riot-sets-aside-fantasy-lcs-what-are-the-alternatives/)). LTA also pays for objective steals (Baron +4, Elder +4, Dragon +2) and gold lead at 14 minutes. Either way, the game line is the natural unit of a breakdown (inference). How Flol scores a series is Craig's call, not this report's.

## What Flol can borrow

All of this section is inference unless cited above.

The frame can come from FPL whole: the header row with a big centre total, the chip tab, the hit pill, the pitch with C/V badges, the bench strip, the auto-sub table, and the left manager column with league arrows. FPL players will find their way at once. Only the look changes, per the Korean theme.

The drawer is where LoL comes in. Keep FPL's right-hand drawer and its Statistic / Value / Points table. Above it, add a **game tab row (G1 · G2 · G3)** like gol.gg, with only played games shown and a series total. Each tab carries the champion icon, which matters under Fearless Draft. The match card becomes a series score bug, "T1 2 : 1 GEN", in team colours, not side colours.

The list view can follow the LoL scoreboard: role order top to support, identity left, numbers right, points last and largest. The pitch's lines can map to roles the same way.

State needs words and a clock: Live while games run, Provisional until a stated lock, then Final, each with a "last updated" time. That follows FPL's lock and LTA's Monday settle, and answers the top complaint about rival apps.

## Fun ideas with a LoL spin

These are all inference. Any that changes scoring needs a grill first.

| Idea | What it is | Where it comes from |
|---|---|---|
| Kill-feed of points | A running feed of scoring events in the order they happened: "Faker · 펜타킬 · +X", styled like the in-game kill feed | Sleeper's play-by-play; ESPN's Matchup Moments; the in-game feed |
| Gold graph of the week | Your points over the week as a line, with icons where big events landed (Baron steal, penta) | gol.gg's gold graph with objective icons |
| Hangul moment labels | 퍼스트 블러드, 더블킬 … 펜타킬 on breakdown rows | The Korean client's announcer lines (unsourced, general knowledge) |
| POG mark | A POG (or POM) badge on the player's game tab | The LCK's POG points race |
| Grade letter | S/A/B per player per game, after the client's post-game grade | The client's D- to S+ grade; Riot's formula is unpublished |
| Optimal line-up | Your score next to the best line-up your squad could have picked | Kicker's matchday view |
| Team of the Week star | A star on any player in the week's best XI, with a link to it | FPL's star badge; LTA's Dream Team of the Week |
| Glowing chip zone | The part of the squad a chip touches lights up, as FPL's bench does under Bench Boost | FPL |
| Shareable week card | A post-lock recap image of your week and top player | FPL's Adobe Express recap |
| Fearless strip | A row of every champion your players used this week, greyed once used | gol.gg's Fearless Draft label |

## Gaps

No live gameweek was seen, so no game's live or provisional styling was confirmed. No screen of any esports fantasy game was seen; LTA's rules and HLTV's pages blocked fetches. The LCK broadcast's series score bug, the current client scoreboard and Korean sites (Naver, Daum, Inven, op.gg) were not described. Typefaces, number formats and hangul versus Latin names on Korean sites are unsourced. Whether the LCK still pays 100 POG points per award is not confirmed.

## Conclusion

The page splits cleanly in two. FPL owns the frame: how a week's score, chips, bench and ranks sit around the squad. LoL owns the breakdown: a player's week is not one match but a series of games, each with a champion, a result and a row of stats. The design job is to keep FPL's frame untouched and make the drawer speak LoL. The open calls for Craig are how a series scores (average or sum), the colour of a rising rank (red or green), and whether POG and multikills score. Each changes what the drawer must show, so they come before the picture.
