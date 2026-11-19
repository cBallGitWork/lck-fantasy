# Site walk: Flol as it stands, 18 Nov 2026

**Contents:** 1 What Flol is · 2 Screen map · 3 Journeys · 4 Parts that repeat · 5 What reads as generic AI UI · 6 What the reskin must keep · 7 What the template must cover · 8 What nobody could reach

> Four Claude agents walked the preview build at 1440 wide, on made-up data (Split 1, Week 3, the team Baron Steal FC). Mobile width was not walked. The four lenses: a design PM (does each screen trace to the spec), a UX reviewer (layout, density, plate.md), an FPL veteran (can I do my weekly jobs fast) and an LCK fan (does it feel like the LCK).
>
> Screenshots are in `/private/tmp/claude-501/-Users-craigball-lck-fantasy--claude-worktrees-lck-fantasy-ui-reskin-289376/2641090e-293d-450d-8ebd-83506bf7ddb7/scratchpad/design-walk/`, named by walker: `pm-N`, `ux-N`, `fpl-player-N`, `lck-fan-N`. That folder is temporary and can be wiped.

## 1. What Flol is

Flol is FPL for the LCK. You hold 9 players (Top, Jungle, Mid, Bot, Support, a Flex, a Coach and a 2-man bench) bought from ₩100.0m, set a Captain and play buffs each week before a deadline shown in your time and KST, and make transfers within free transfers, a bank and a team cap. Points come per game, best two games a series, and show live while a series is on, beside a stream picker. Around that sit leagues (Overall, country, team supporters and private leagues with codes), a stats table that is the scoring rules, player and coach cards, price changes, the LCK's own fixtures, standings and rosters, a feed of managers you follow with once-a-week cheers and jeers shown as an LED truck, and settings with a hangul team banner.

## 2. Screen map

17 screens reached. Density is the walkers' agreed reading.

| Screen | For | Main jobs | Density |
|---|---|---|---|
| Home `/` | Where am I this week, what needs doing | Deadline and jump to Pick Team / Transfers; live points (94, average, highest); watch the live series; cheer or jeer; league ranks | Medium; the stream box eats the fold |
| Pick Team `/pick-team` | Set starters, bench order, Captain, buff | Swap with bench; Captain; play a buff; Rift or Card view; Save team | Medium; Card view denser than the Rift |
| Transfers `/transfers` | Sell and buy within budget, free transfers, team cap | Sell (×), buy (+) from a filtered market; watch cost and bank; confirm; undo | High; FPL-like |
| Points `/points` | How my team scored, per player, series and game | Step weeks; per-series split per player; player sheet by game; average and highest; Star, Flop, Killer | Medium-high |
| Perfect game `/perfect-game` | The week's best possible team | Best 7 with Captain; compare with yours; step weeks | Medium; reuses Points |
| Leagues `/leagues` | Where I stand in every league; run private ones | Read a table (Season / Split); switch league; open a rival; create, join, copy code; admin; Overall with Find me | High; 12-row tables |
| Manager profile `/manager/:id` | A rival's team and history | Their week by slot; History (FPL's Gameweek History); Transfers; follow | Medium-high |
| Stats `/stats` | Research picks | Filter role, team, max price, weeks; Totals / Per game; sort; search; open a card; Price changes | Very high; 16 columns, the densest screen |
| Player card `/player/:id` | Everything on one player | Captain, Swap, Transfer out, Compare; last 3 / next 3; tabs; season breakdown | High but ordered |
| Coach card `/coach/:id` | The same card for the coach slot | Transfer out, Compare; objective breakdown; Roster tab | High |
| Compare `/compare/:id` | Two players side by side | Season, form, price, owned, last 3, next 3, every scoring line; change the second player | High; mirrored |
| Price changes `/price-changes` | Who rose and fell at the deadline | Rises and falls (Was, Now, Owned); step weeks | Medium; two tables |
| LCK hub `/lck` | The LCK's fixtures, results, standings, rosters, news | Fixtures by match day in two times; results; group standings with stage tabs; rosters with hangul and prices; news | Medium-high |
| Series `/series/:id` | One series in Flol's terms | Score and state; each player's champion, KDA, points per game; coach lines; VODs | Very high but orderly |
| Live `/live` | Watch with live points beside it | Pick a stream; your players' live points; rest of your week | Low |
| Following `/following` | Feed of managers you follow | Their series points, Captains, transfers; cheer or jeer; requests; follow lists | Medium |
| Settings `/settings` | Team identity, display, emails, account | Team name and hangul banner with preview; time zone, theme; emails; sign out, download data, delete | Low; a form |

Not reached: the front door (Pick your squad) and Help. See section 8.

## 3. Journeys

Clicks counted from Home, one per click or tap; typing not counted.

| Job | Path | Clicks | Notes |
|---|---|---|---|
| Swap a starter with the bench | Pick Team → bench player → starter → Save team | 4 | Valid targets outlined; Save turns gold. No confirmation after saving (pm-44) |
| Change Captain | Pick Team → player → Captain (side panel) → Save team | 4 | No C control on the tile, as FPL has (FPL walker) |
| Play a buff | Pick Team → Play → Save team | 3 | Card goes "On · unsaved" with Cancel; other buffs lock |
| Make a transfer | Transfers → × → + → Review and confirm › → Confirm | 5 | Market re-titles "Replacing X" and filters to his role. An unaffordable + does nothing and says nothing (fpl-player-42) |
| Undo a transfer | Transfers → Undo | 2 | |
| See why a player scored | Points → player | 2 | Sheet boxes the best 2 games. Its series link usually dead-ends (fpl-player-31) |
| See the Perfect game | Home → Highest 121 › | 1 | Numbers disagree with Points (section 5) |
| Find me in Overall | Leagues → Overall → Find me | 3 | Leagues opens on Pub League, not an overview |
| Look at a rival | Leagues → row → History | 3 | Rival shows as a table, not a pitch |
| Make a private league | Leagues → Create a league → Create | 3 | Name field opens pre-filled (pm-12) |
| Research a player | Stats → player → Compare › | 3 | Card shows Faker whoever you click (bug) |
| Research a coach | Stats → Coaches → coach | 3 | Card shows kkOma whoever you click (bug) |
| Price check | Stats → Price changes › | 2 | |
| This week's fixtures, standings | LCK; LCK → Standings | 1; 2 | Most fixture and result rows lead to "No such series" |
| Watch live | Live (nav) → stream | 2 | Home's Live › and Points' Watch › also land here |
| Cheer or jeer | Home → Cheer / Jeer › → line → Send | 3 | LED truck preview in the dialog |
| Answer a follow request | Home → Following › → Accept | 2 | |
| Change settings | Team chip ▾ → tab | 2 | The ▾ opens no menu; it goes straight to Settings |
| Delete account | Team chip → Account → Delete account → confirm | 4 | Dialog lists what goes |
| Sign out | Team chip → Account → Sign out | 3 | Does nothing in preview |

## 4. Parts that repeat

The component list a template must cover. Every walker saw all of these unless noted.

- **Frame:** top bar (gold Flol wordmark, 8 nav links, live dot on Live, "presented by" sponsor slot, team-name chip ▾); page title 28/700 with hangul after it; main column plus a 360 right column of titled stacks (2px rule, title, grey count); sponsor box; footer with "All sponsors are made up." and Riot's legal line. Exceptions today: Stats and Settings drop the side column; Live and the manager profile have no title.
- **Banner head:** team name with hangul, tier with rank and move (Home, Points); the gold hangul banner on the manager profile.
- **Rift pitch:** stylised Summoner's Rift with tiles by lane (shirt, C mark, FLEX and "Coach 감독" labels, white name plate, dark band for fixtures, points or price) and a numbered bench strip ("1. Mid"). On Pick Team, Transfers, Points, Perfect game and the front door.
- **Card view:** 7 tall broadcast-lineup cards, Top to Coach, with role icon, crest, name, team, fixtures, form, price.
- **View toggle:** Rift view | Card view (or List view), butted segments.
- **Sticky action bar:** change count, Reset, deadline, one gold primary (Pick Team, Transfers, front door).
- **Header figures:** Free transfers / Cost / Bank (Transfers); Picked / Bank / Team cap (front door).
- **Week stepper and score head:** ‹ Split 1 · Week 3 ›, big total, Not final / Final, Average, Highest › (Points, Perfect game, profile, Price changes, LCK).
- **Deadline block:** "Deadline Wed 07:45 16:45 KST" with a boxed countdown (Home, Pick Team, Transfers, LCK, Following, dialogs).
- **Time pair:** your time in mono, KST beside it in grey.
- **Series list and series line:** day, teams, times or score and state; "v DK 2–0 · Sat"; "W3 · Sat v DK" on cards.
- **Scorebug:** team, record, game score, team (Series, Live).
- **Data tables:** 40px rows, small grey heads, name + team code left, Plex Mono figures right, your row highlighted, rank move ▲/▼ in text colour, › at row end, sortable heads with the sorted column shaded, sticky head and name column, pager, the "⋯" jump to your neighbourhood, Find me.
- **Player row:** role icon, handle, team code, owned dot (●), price with ▲ red / ▼ blue.
- **Player name block:** tile (handle), row (handle + team + dot), card (handle 40/700, hangul, legal name small, "Mid · T1").
- **Marks and tags:** C for Captain, owned dot, 🎂 birthday, "Not starting" / "!", Live (filled), Not final (dashed), Final, Locked, Big Captain, POG, buff names.
- **Last 3 | Next 3 strip** with a divider (player card, coach card, Compare).
- **Tabs:** words with a 2px cream underline (Season/Split, Players/Coaches, Fixtures/Results/Standings/Teams, Points/History/Transfers, Settings, card tabs).
- **Filter row:** role toggle with icons, team and price selects, search, Totals / Per game.
- **Buff cards:** name, one line, "1 left", Play; on, unsaved and locked states.
- **Dialogs:** 1056 card (player, coach, Compare) and 544 sheet (points sheet, confirm transfers, create league, cheer, delete account), dim behind, ✕, Back/Cancel plus one gold primary.
- **Keys:** one gold fill per screen, outlined secondary, › text links.
- **Stream picker:** official feeds by language plus co-streamers (Home, Live).
- **LED truck panel:** dot-matrix caps with "Cheer/Jeer from X · Truck hire by Sponsor" (Home, Following, profile, cheer dialog).
- **Team marks:** meme crests on cards; grey shirts with a team code on tiles and lists; bare codes on the LCK hub.
- **Role glyphs** in Stats, Transfers, Live, Series, Teams.
- **Placeholders:** dashed boxes for Sponsor, Badge, stream, thumbnail, portrait, privacy email.

## 5. What reads as generic AI UI

Walker count in brackets. "Look" is the AI-template feel; "Sloppy" is broken or made-up data that disagrees with itself, which makes any screen look machine-made.

### Agreed by two or more

**Look**

- **Dashed placeholder boxes everywhere** (4): Badge and Sponsor in the header and footer, the stream box, news thumbnails, Compare's "portrait", Settings' "privacy email". Read as wireframe left in the build. pm-1, ux-1, fpl-player-1, lck-fan-1, pm-19, ux-17, fpl-player-22, pm-21, ux-10, fpl-player-25, pm-26, fpl-player-27, ux-9, fpl-player-33.
- **Big empty black stream box** with grey "LCK · English · Twitch" text (3). pm-1, ux-1, fpl-player-1, fpl-player-27.
- **Three boxed stat tiles** for Free transfers / Cost / Bank: small label over big number, item 1 on plate.md's Never list (3). ux-3, fpl-player-6, lck-fan-3.
- **Meme crests** (T1 truck, GEN tiger, HLE chick) instead of club badges (3). ux-25, lck-fan-2, lck-fan-10, lck-fan-25, pm-3.
- **One squad drawn several ways:** crests on starters, shirts on the bench, a portrait box on Compare, a crest on the card (2). pm-3, pm-19, lck-fan-17.
- **Template shirts:** identical grey outline tees with a code, no team colour, so T1 red and GEN gold are lost (2). fpl-player-2, lck-fan-2.
- **Stream options as a stack of identical bordered buttons or pills** (2). ux-1, ux-8, fpl-player-1.
- **Buff cards as card-per-item with an explainer line each** (2: PM, UX). pm-2, ux-2. The FPL walker liked the one-line explainers (fpl-player-5); spec says a hover explains a buff.
- **Unselected Rift tiles greyed**, so the squad looks disabled (2). ux-2, fpl-player-2.
- **Role glyphs crude and unreadable at 12px** (2). ux-7, lck-fan-3, lck-fan-6.
- **Stats' right half is an even run of figures** with no grouping of scoring stats from counts (2). ux-7, fpl-player-19.
- **Series head's cream "v" block** looks like a button (2). ux-13, fpl-player-32. The fan read the same box as a scorebug and liked it (lck-fan-45).
- **No team crests or colours** on league rows or the LCK hub, only three-letter codes (2). fpl-player-14, lck-fan-24.
- **Live has no page title**, unlike every other page (2). ux-8, lck-fan-7.

**Sloppy**

- **Deadline disagrees:** Home 3d 19h 35m, every other screen 9h 45m, same Wed 07:45 deadline (4). pm-1, ux-1, fpl-player-1, fpl-player-2, lck-fan-1.
- **Sticky save bar covers the Rift's bottom row** (Coach, Flex, kkOma, Siwoo) (4). pm-2, ux-2, fpl-player-2, fpl-player-5, lck-fan-2.
- **Perfect game disagrees with Points** for the same week: Final vs Not final; average 79 vs 74; highest 128 vs 121; your points 109 vs 94 (4). pm-40, ux-16, fpl-player-11, lck-fan-14.
- **Sign out does nothing** (4). pm-42, ux-21, fpl-player-33, lck-fan-29.
- **Card opens over a blank page and the nav marks the wrong tab** (Pick Team or nothing) (4). pm-15, ux-14, ux-17, fpl-player-20, fpl-player-22, lck-fan-25.
- **Player and coach cards always show Faker and kkOma** whoever you click (3). pm-15, pm-17, ux-14, fpl-player-20, fpl-player-23.
- **Most series links dead-end at "No such series"** (3). pm-23, pm-24, fpl-player-28, fpl-player-31, lck-fan-22, lck-fan-33, lck-fan-36.
- **Live and Home show week totals as series points:** Faker "G1 4 · G2 1" then 25 (3). pm-26, fpl-player-27, lck-fan-7, lck-fan-1.
- **Team chip has a ▾ but no menu** (3). pm-32, ux-24, fpl-player-33.
- **T1 v DK is live 1–0 on Home, Points and Live, but Final 2–0 on Series, Results and the profile** (2). pm-31, lck-fan-45, lck-fan-22, lck-fan-15.
- **Free transfers:** Home says 2, Transfers says 0 (2). fpl-player-1, fpl-player-6, lck-fan-1.
- **The dim behind dialogs stops short**, leaving rows or the bench bright (2). pm-7, pm-9, ux-23, ux-35.
- **Transfers opens with a transfer already pending** (Siwoo → Kingen), so the empty start is never seen (2). pm-5, fpl-player-6.
- **Transfers' Rift lays players out differently from Pick Team's**, with no separate bench (2). pm-5, fpl-player-6.
- **Minji's Pub League rank:** 1st on the table, 3rd on her profile (2). pm-38, lck-fan-5, lck-fan-15.
- **Price changes dates Week 4 prices "Set Wed 13 Jan"**, inside Week 3 (2). pm-20, lck-fan-12.
- **Series head names DK in full ("Dplus KIA") but not T1** (2). pm-31, lck-fan-45.

### Single sightings

**Look**

- Wide empty bands and dead lower halves: under Home's countdown, Price changes, Series, Following, profile History, Settings' right 400px (UX). ux-1, ux-18, ux-13, ux-19, ux-31, ux-9.
- Filter chips read as pills; "All roles" a filled cream chip (UX). ux-3, ux-8.
- Too many equal-weight keys: Captain, Swap with bench, Transfer out on the card; Accept and Decline on every request (UX). ux-14, ux-19.
- Live banner "Live T1 v DK, game 2 Watch ›" is a wide bordered strip of empty space (UX). ux-4.
- Pagination numbers in heavy boxes (UX). ux-32.
- Price changes: thick coloured rules carry the meaning; rows lack ▲/▼ (UX). ux-18.
- Fixtures table centred in a wide band with empty space (UX). ux-10.
- Manager profile has no page title; the banner stands in (UX). ux-11.
- List view's team code overflows the shirt (UX). ux-26.
- Save team greyed with no reason beside it (UX). ux-2.
- Following is a long run of same-weight cards; nothing pulls the eye (FPL). fpl-player-35.
- Pitch decoration (grey squares, dashed circles) is noise (FPL). fpl-player-2.
- Sponsor box inside the Overall table head (FPL). fpl-player-14.
- Team records beside codes ("4–2 HLE v DK 3–3") read as series scores (fan). lck-fan-8.
- The 🎂 is the only emoji and looks pasted on (fan). lck-fan-4.
- "Max 2 from GEN" floats mid-table, not by its cause (PM). pm-46.

**Sloppy**

- Save team gives no confirmation (PM). pm-44.
- Light theme does nothing (PM). pm-34.
- An unaffordable buy does nothing and says nothing (FPL). fpl-player-42.
- Captain multiplier never shown on Points: 12 + 5 shows as 25 with no "× 1.5"; Following does show it (FPL). fpl-player-10, fpl-player-35.
- Points head has no transfer hit or buff played, which FPL shows (FPL). fpl-player-9.
- Confirm dialog's bank ₩0.5m → ₩5.5m vs ₩5.5m in the head (UX). ux-23.
- Faker's sheet: games 5 + 2 + 7 = 14, series head says 12 (fan). lck-fan-42.
- Faker "1st of 10 mids" on Pick Team, 2nd behind Chovy on Stats and his card (fan). lck-fan-2.
- kkOma W3 Sat v DK: 8 on his card, 2 on Points (PM). pm-17. His card shows ▲0.5; Stats shows no change (fan). lck-fan-25.
- Player card's History misses W2 Fri and all of Week 3 (fan). lck-fan-10. This week tab is empty with no empty state (PM). pm-18.
- Minji: 93 skips her Bench Boost (should be 102) (PM), pm-38; 58 pts in the cheer dialog vs 20 on Home (PM), pm-37.
- Delete says 12 following, 9 followers; Following says 3 and 5 (PM). pm-35.
- Settings: banner field empty while Home shows 바론 스틸 FC; no Save on the Team tab (PM). pm-32.
- Overall opens on Split 1, Pub League on Season (PM). pm-11.
- News dated Mon 18 Jan while the app sits in mid-Week 3 (fan). lck-fan-8.
- Two names for one state: "Didn't play" vs "Not in KT's lineup"; "1. Mid" vs "Bench 1 · Mid" (fan). lck-fan-4, lck-fan-15.
- Words: "Sets W / Sets L" uses the banned word "set" (PM), pm-22-Standings; buff cards and the cheer dialog carry explainer lines (PM), pm-2, pm-37; "Truck hire by Sponsor" breaks plate.md's Words (fan), lck-fan-1, lck-fan-18; "WINNER WINNER, GANK CHICKEN" is a PUBG line (fan), lck-fan-18.
- POG tag on Series has no spec line (PM). pm-31. The fan liked it.
- Overall shows no tier though spec/08 says it does (PM). pm-11.
- "All sponsors are made up." under a page with no sponsor (fan). lck-fan-5.

## 6. What the reskin must keep

Walker count in brackets where more than one named it.

- **Home:** deadline countdown with local time and KST at the top, beside gold Pick Team and outlined Transfers and the free-transfer count (4); "Your week" big figure with average, highest and "Not final" (4); league mini-table with moves (3); team name with hangul, tier, rank and move (3); the LED cheer/jeer panel (3); live players "In this series" (2); stream list with real co-streamers and the Korean feed (1).
- **Pick Team:** Rift view and Card view with the toggle, Card view as the broadcast lineup (4); tile anatomy with the C mark, "FLEX" and "Coach 감독" labels and opponents under each name (4); the sticky bar with change count, Reset, deadline and gold Save (4); buff cards with play, cancel and unsaved states (3); side panel driven by the selected tile, with form, owned, last 3, Captain and Full card (2); numbered bench with role (2); two-click swap with valid targets outlined (2); week's series as match days with both times (2); "Not starting" and the Flex "plays X" label (1).
- **Transfers:** Free transfers / Cost / Bank at the top, in a non-tile form, bank red below zero (3); market with role tabs in fan order, search, sort, team filter, Next and + (4); "Replacing X" state (2); pending bar with strikethrough on the outgoing player (3); confirm dialog with bank before → after (4); confirmed log with Undo (3); List view grouped by role (2).
- **Points:** week stepper, big total, Not final, average, Highest › (4); points on each tile with per-series split (4); player sheet by game with champion, W/L, KDA, counted games boxed and the scoring tags (4); Star / Flop / Killer (3); the week's results with Live / Not final tags (2); live strip with Watch › (1).
- **Perfect game:** the same pitch and head as Points, with "Your points ›" back (4).
- **Leagues:** columns rank, move, team · manager, Captain, week, total with your row highlighted and the gap to 1st (4); Overall's top 7 + "⋯" + your neighbourhood, pager and Find me (4); Season / Split tabs (3); side list of General and Private leagues with rank, move and size (3); code chip, Copy link, Admin menu (2); supporter leagues by LCK team (1).
- **Manager profile:** the gold hangul banner header, the strongest Korean moment in the app (4); Points / History / Transfers tabs with History as FPL's (3); slot table by role with the bench (3); Buffs left (2); cheers as LED panels (1).
- **Stats:** the wide sortable table with sticky head and name column and the sorted column shaded (4); filters on one line with Totals / Per game (4); price move inline ▲ red / ▼ blue and the owned dot (4); separate Coaches stats (3); Price changes › link (2).
- **Player and coach card:** broadcast lower-third head: handle 40/700, hangul, legal name small (4); last 3 | next 3 strip (4); season breakdown by scoring line (4); actions on the card (3); Champions tab and past seasons "LCK, scored by Flol" (2); one shell for player and coach, coach lines and Roster tab, no Captain on a coach (3).
- **Compare:** mirrored table with a centre label spine, better figure bold, last 3 / next 3, Change › (4).
- **Price changes:** Rises and Falls side by side, red and blue, Was / Now / Owned, week stepper (4).
- **LCK hub:** Fixtures / Results / Standings / Teams tabs with Groups / Play-In / Playoffs (4); match-day fixtures with both times and records (4); standings with Last 5 (3); rosters with hangul names and prices (3); Baron / Elder group names with hangul (3); news column with ↗ (1).
- **Series:** scorebug head with records (3); per-game boxed points with the series total (3); coach row with objectives and the series bonus (2); role-ordered lineups with hangul and owned dot (3); VOD ↗ links (1).
- **Live:** stream with picker under it, scorebug with Live tag, your players' per-game live points (4).
- **Following:** week-grouped feed with figures first, transfers with their point gain, Captain maths "12 × 1.5", "Big Captain" (4); cheer / jeer once a week, "Cheer sent", preset lines with a truck preview (4); requests with Accept / Decline (3).
- **Settings:** Team / Display / Emails / Account tabs (2); hangul banner with live preview (4); locked fields shown as a value with "Locked" (2); time zone with a deadline preview in both times (2); delete dialog's "what goes" list (1).
- **Across the app:** hangul after every title; red rise / blue fall; one gold action per screen; your time beside KST; the made-up fan team names ("Chovy Was Right There", "Smeb Nostalgia").

## 7. What the template must cover

Merged and ranked. The count is walkers who named it as a template need or flagged its lack as a problem.

**Before shooting any reskin** (PM, fan): fix the preview data and the bugs in section 5's Sloppy list. Pictures judged on contradicting numbers will mislead reviewers.

1. **One coherent made-up dataset** (4). The same week shows the same score, state, average and highest on every screen; live points add up on screen; one source for the deadline.
2. **The Rift pitch as one part in four modes** (4): pick (swappable, valid targets, selected, Captain), transfer (price chip, ×), points (points with per-series split, "Didn't play"), empty (front door: dashed slots, +). Rift and Card views share its data. Same bench, Flex and Coach in every mode. The sticky bar never covers it. Unselected tiles stay readable.
3. **Team identity** (4): a PES-style club badge and a team colour for each of the ten LCK teams, usable on shirts, rows, the scorebug and cards. One crest-or-shirt rule per context. Real art or a defined stand-in for every placeholder (stream, thumbnail, portrait, badge, sponsor).
4. **A table system** (4): 16 columns at 1440 down to a 4-column mini table; mono figures; your-row highlight; rank move; owned dot; sticky key column; sortable heads; "⋯" jump; pager; Find me; column grouping for wide stat tables; standings with Last 5.
5. **One status and mark vocabulary** (4): Live, Not final, Final, Not starting, Locked, Big Captain, buff names, C, owned dot, 🎂; rank ▲/▼ in text colour, price ▲ red / ▼ blue, never colour alone. One name per state.
6. **The time and deadline block** (4): your time + KST and a boxed countdown, one source; the match-day schedule block.
7. **The Korean layer as parts, not decoration** (4): hangul after every title (Live included), the gold banner head, the LED truck panel, red-up / blue-down, Baron / Elder groups, "Coach 감독".
8. **The page frame** (3): top bar, title + hangul, main + 360 side column, footer; stated variants for full width (Stats), dark stage (Live), banner pages (Home, Points, profile). Decide the team chip: a menu or a plain link.
9. **Dialogs and sheets** (3): confirm, form, chooser with preview, destructive with "what goes", and the 1056 card. Each dims the whole page with the page behind still showing.
10. **Empty, loading, error, disabled and done states** (3): empty tabs, "No such series", a saved confirmation, the front door as the guest state, and actions you can't take (unaffordable, team cap, deadline passed) shown greyed with a reason, never silent.
11. **The player and coach card shell** (3): head facts with ranks, last 3 | next 3, actions, tabs, points-per-line breakdown; shared with Compare's head.
12. **Totals that are not stat tiles** (3): Free transfers / Cost / Bank and Picked / Bank / Team cap as a line of figures in the head.
13. **Words** (3): the glossary binds ("game" not "set"; Captain; week; series); no "Truck" in the sponsor line; broadcast stat names (K/D/A, GD@15, Solo kills, First blood). Walkers split on explainers: PM and UX want none (spec: a hover explains a buff), FPL wants one line where FPL has no equivalent (buffs, Flex, Coach, Bo3).
14. **Series as the unit** (2): scorebug, series line, per-game row (champion, W/L, KDA, points), Bo3 / Bo5, and a fixture row with room for "your players in this series".
15. **Page-head kit** (2): week stepper, big total, tags, average, highest, plus room for buff played and transfer hit.
16. **Player row and name block at three sizes** (2): tile, row, card.
17. **Role marks** (2): Top, Jungle, Mid, Bot, Support, Flex, Coach, always in that order, readable at 12px.
18. **Buffs without the card-per-item look** (2): name, count, Play, with on, unsaved and locked states.
19. **Stream and co-stream picker as a first-class part**, not a button stack (2).
20. **Captain mark with a visible × 1.5** wherever Captain points show (2).
21. **Key hierarchy** (1): one gold fill, outlined secondary, › links, and how to show three actions on one object without a row of equal keys.
22. **Filter row without pills** (1).
23. **A rule for short pages** (1) so Settings, Series, Price changes and profile History don't end in a large empty area.
24. **Rivals on the pitch too** (1), not only as a table.

**Spec questions the walk raised, for Craig, not template work:** POG on Series (no spec line); no tier on the Overall table though spec/08 says one; no Save on the Settings Team tab; "Sets W / L" vs the glossary's "game"; "Truck hire by" vs plate.md's Words; whether Baron / Elder groups match the real 2027 LCK format.

## 8. What nobody could reach

- **Front door (Pick your squad) and its sign-up sheets** (4): Sign out does nothing, no link reaches it while signed in, and the walk tool can't type an address. Judged only from `docs/design/approved/front-door/1440.png`.
- **Help** (4): not built, no link.
- **Most series pages** (3): only `/series/w3-sat-2` (T1 v DK) and `/series/w3-sat-1` (GEN v HLE) resolve, plus upcoming HLE v DK; finished series from Results or the Points sheet hit "No such series".
- **Cards for anyone but Faker and kkOma** (3): the address changes, the card doesn't.
- **The account menu** (3): the ▾ has none.
- **Empty, loading and error states** (1): the preview data is always full.
- **Not opened for time:** Leagues' Join dialog and the Admin sub-actions (rename, remove, delete); the profile's Transfers tab; the card's Fixtures tab (PM).
- **LCK hub's Play-In and Playoffs views and the Results week stepper:** the walk tool's clicks timed out (fan).
- **The live T1 v DK series page:** Home's Live › and Points' Watch › go to /live instead (FPL).
- **Mobile width:** not walked by anyone.

One process note: partway through, another session rewrote the shared walk script to save shots as `ucl-*.png`. The FPL walker's shots (fpl-player-1 to 42) were all taken before that.
