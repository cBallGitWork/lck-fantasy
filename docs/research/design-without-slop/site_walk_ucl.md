# Site walk: a UCL Fantasy player's view

Walked 18 Nov 2026 on preview data (Week 3, Split 1, Baron Steal FC). Shots are `ucl-<n>.png` in
`scratchpad/design-walk/`. I play UCL Fantasy every matchday and some FPL.

## Screens and their jobs

| Screen | What it's for | Job done | Shot |
|---|---|---|---|
| Home | Status: deadline, live series, your week, following, leagues | Read status, picked a stream | 1 |
| Pick Team | Line up 7 starters + 2 bench, Captain, buffs | Swapped Bdd for Faker; played Bench Boost; Card view | 2, 3, 4 |
| Transfers | Sell and buy against bank and free transfers | Sold Bdd, bought Clozer; Review and confirm | 5, 6, 44 |
| Points | Last week's pitch with points; tap a player for game breakdown | Opened Faker's breakdown | 8, 9 |
| Leagues | Tables for your private and general leagues; create, join | Opened Overall; joined with a bad code (clear error) | 10, 11, 12, 13 |
| Stats | Sortable, filterable player table | Filtered to T1 | 14, 16 |
| Player card | Price, form, owned, fixtures, history, stat points | Opened from Stats | 15, 28 |
| Coach card | Same for the coach, scored on team play | Opened from a series lineup | 26 |
| Compare | Two players side by side | Faker v Chovy | 27 |
| Live | Stream picker beside your live points | Read it | 17 |
| LCK hub | Fixtures, results, standings, teams, news | Fixtures, Standings, Results | 18, 19, 21 |
| Series | One series: score, lineups, your players marked | Opened HLE v DK (Week 4) | 25 |
| Perfect game | The week's best team | Read Week 3 | 30 |
| Price changes | Weekly rises and falls | Read Week 4 | 35 |
| Settings | Team name, hangul banner, time zone, account | Set a banner; Display tab | 29, 31, 32 |
| Manager profile | Another manager's week, leagues, cheers | Opened Minji Park | 33 |
| Following | Feed of followed managers; cheer or jeer; requests | Opened Cheer / Jeer | 36, 37 |
| Front door | Guest picks a team | Not reachable: no link while signed in, and Sign out does nothing | 39 |

## Where it matches UCL Fantasy

- Nav order and names (Pick Team, Transfers, Points, Leagues, Stats) are the UCL/FPL set. I knew where to go at once.
- Pick Team: pitch, bench row with order numbers, C badge on a shirt, next opponents under each player, one save bar with deadline. Same mental model.
- Tap a player: a side panel with Captain, Swap, Full card. Same three moves as UCL's player pop-up.
- Buffs as three cards with Play, one a week: reads like UCL's chips (Wildcard, Limitless, 12th Man).
- Transfers: Free / Cost / Bank, pending swap bar, confirm sheet with bank before and after. Exactly UCL's flow.
- Points: pitch with each player's points and per-series split; tap for a game-by-game breakdown. Like UCL's matchday points pitch.
- Leagues: General (Overall, country, club) plus Private, a code, Find me. UCL has the same split.
- Perfect game is UCL's Team of the Matchday / FPL's Dream Team.

## Where it surprised me

- The pitch is a League map (the Rift), not a football pitch. Clever, but the top laner sits alone top-left and the coach and flex sit bottom-left, so I read it as a map, not a lineup. The fixed save bar covers coach, flex and Delight at 1440 × 900 (shot 2).
- Transfers' rift mixes the bench into the map (Kingen, Cuzz, Bdd on it) and lays players out differently from Pick Team (shot 5). UCL keeps one pitch everywhere.
- Moving the captain to the bench hands the C to the incoming player silently (shot 3). UCL asks you to pick a new captain.
- Selling a player does not filter the list to his role or budget (shot 44). UCL does both at once.
- Clicking a team name with ▾ goes straight to Settings, no menu (shot 29).
- Live puts the week total (25) on the row of a live series worth 5 (shot 17). UCL shows the live delta per match.
- The breakdown never says the Captain is ×1.5: 12 + 5 = 17 but the header says 25 (shot 9). UCL shows a "Captain ×2" line.
- No Help page. UCL's rules are one tap away; Flol's rules (best 2 of 3, flex, coach scoring) need it more.

## Broken or contradicting (preview data, but it confuses)

- Every finished-series link goes to "No such series": Points sheet, LCK Results (shots 20, 22, 24). Only future series open.
- A player or coach card ignores its address: /player/chovy and /coach/homme both show Faker or kkOma (shots 26, 28). Faker's card offers Captain and Swap even when opened as Chovy.
- Free transfers: Home says 2, Transfers says 0 (shots 1, 5).
- Deadline countdown: Home 3d 19h 35m, every other page 9h 45m, same Wed 07:45.
- Week 3: Home and Points say 94, not final, average 74, highest 121; Perfect game says Final, average 79, highest 128, your points 109 (shot 30). Transfers' list says Faker 22, kkOma 16 for Week 3; Points says 25 and 10.
- Season total: Leagues 302, Delete account 187.
- Settings' hangul banner is empty but Home shows 바론 스틸 FC.
- Minji: profile 93 with Bench Boost (bench 9 not added); Following's sheet says 58 so far.
- Sign out does nothing and says nothing (shot 39). Join a league ignores Enter.
- Fixtures: rows stop at half width with an empty right half; unlabelled 4–2 records beside teams; a "Yours" header over a time column (shot 18).
- Modal scrims stop part way down the page, leaving rows bright under the sheet (shots 6, 9, 37). May be the full-page shot, worth a check.
- Bench in Card view stays as shirts while starters are crests (shot 4). Shirt labels overflow the shirt in Transfers' list (shot 44).

## What UCL Fantasy does better (structure, not look)

1. One pitch, everywhere: Pick Team, Transfers, Points, profiles and Perfect game draw the same squad in the same places. A profile is a pitch, not a table.
2. A matchday header block: matchday points, average, highest, overall rank and the deadline in one strip, the same on Pick Team and Points.
3. Selling filters the market to that slot and what you can afford, with "Remaining budget" pinned.
4. The captain multiplier and chip effects as lines in the points breakdown.
5. Live: per-match minute and live delta on the pitch itself, not in a side list.
6. Player pop-up first, full profile second; the pop-up's buttons depend on whether you own him.
7. A visible Help/Rules link in the nav or the footer.
8. Guest flow: one obvious "Pick your team" entry the whole time you are signed out.

## Reads as generic AI UI

- Three equal outlined stat tiles (Free transfers / Cost / Bank), shot 5.
- Three identical buff cards, title + grey line + Play, shot 2.
- Dashed placeholder boxes everywhere: Sponsor, Badge, thumbnail, stream, portrait (shots 1, 18, 17, 27). Fine for preview, but they set the rhythm of the page.
- Little outlined tags for every state (Not final, Live, Locked, Bench Boost, Bo3), shots 9, 29, 33.
- Monospace for every figure, even dates and times, so the page reads like a terminal (shots 2, 18).
- Navy with one gold button and a two-column 1fr + 360px layout on every page: tidy, but every screen looks alike, shots 1, 10, 14.
- The rift's abstract navy squares and circles read as a placeholder, not a map (shot 2).

## What a design template must cover (from a UCL player)

- The squad picture: one component for pitch view and list view, used by Pick Team, Transfers, Points, profile, Perfect game, Live; starter, flex, coach, bench slots; states for captain, not starting, injured/benched, selected, swap target, sold, new, live, finished, didn't play.
- The week header: week, deadline with local and KST, points, average, highest, rank and tier.
- The player sheet and full card, with owned and not-owned button sets.
- The market list: filter by role, team, price; sort; owned %, price change; "sell" pre-filters it.
- Buff cards: available, on and unsaved, used, locked.
- Confirm sheets: transfers, buffs, delete, with what changes and what it costs.
- Tables: league, stats, fixtures, standings, price changes; your row highlighted; movement arrows; paging and Find me.
- Live states: provisional, live, final; per-game points; stream picker.
- Empty, loading, error and "no such" pages that always offer a way on.
- Help reachable from every page; the guest front door reachable while signed out.
- One rule for figures (which are mono, which are not) and one for tags, so states don't all look like boxes.
