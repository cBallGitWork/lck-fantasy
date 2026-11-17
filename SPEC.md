# SPEC

**Contents:** [What it is](#what-it-is) · [Features](#features) · [Out of scope](#out-of-scope) · [Glossary](#glossary)

Craig's answers and nothing else. They come from chat on 26–29 Oct and 11 Nov 2026
([docs/decisions.md](docs/decisions.md) keeps the history). A feature's detail is settled by its
own `/grill` before it is built, and lands in its `spec/NN-name.md` file. What is still open lives in
[docs/to-grill.md](docs/to-grill.md), never here.

## What it is

**Flol** (Craig, 11 Nov 2026: "the name is FLoL"; written Flol and said "flol", one syllable): a free, season-long fantasy game for the LCK (League of Legends Champions Korea) that copies
FPL's structure: a budget, a squad with a bench, weekly transfers, a captain, buffs, and global
and supporter leagues. It is not a draft game. The theme is Korean.

Players are worldwide and the game is in English first. Deadlines are stored in UTC and shown
in each user's local time. There are no cash prizes.

The LCK goes first because its schedule is more regular than the LEC's three splits. The LCK
Cup is dropped: Split 1 is the beta (Craig, 16 Nov 2026). The main game splits into Split 1 and
Split 2, and buffs reset at the split, the way FPL's chips reset at GW19.

Live points "would be great" (Craig, 11 Nov 2026), and the beta has them ([spec/11](spec/11-live-points.md)).

**The base assumption:** keep the rules as close to FPL's as possible. Where a rule is in doubt,
use FPL's rule, or at least its logic (Craig, 11 Nov 2026).

## Features

A feature's status lives only in this table. `to grill` means Craig has given the outline below
and the detail waits for its `/grill`; `not built` means it is grilled and waits to be built.

| # | Feature | What Craig has said | Status |
|---|---|---|---|
| 1 | [Squad and slots](spec/01-squad-and-slots.md) | A squad of 9: one player per role, a flex player of any role and the coach start; two on the bench. Auto-subs as in FPL, into the player's own role or the flex. The coach is the team: it scores the team's play, shown as its head coach. | partly built: rules, and Pick Team on made-up data; no storage yet |
| 2 | [Prices and budget](spec/02-prices-and-budget.md) | Money as ₩ and m (`₩18.5m`), as FPL. First prices from a formula, adjusted by hand. Prices move weekly at the deadline, mostly on points, a little on demand, down when few own a player, above a floor; the formula is public. Sell at the full current price. | partly built: budget rules, and prices on Transfers, Stats and Patch update on made-up data; made-up prices and the budget stored from data/lck; no price moves yet |
| 3 | [Transfers](spec/03-transfers.md) | One free transfer a week, banking to 3, each extra −6. Unlimited before the season's and Split 2's first deadline, then 2 free in the next gameweek. An admin can top banks up. Locked between the splits; Split 2's window opens 2 weeks before its first deadline, when the knockout budget raise comes back off and Flol fixes any squad left over. | partly built: rules, and Transfers on made-up data; no storage yet |
| 4 | [Carry (captain)](spec/04-captain.md) | A Carry and Vice-carry (FPL's captain and vice) from the six starting players, never the coach. The Carry's points are multiplied; the Vice-carry takes over if the Carry plays no game. | partly built: rules, and the Carry on Pick Team on made-up data; no storage yet |
| 5 | [Scoring](spec/05-scoring.md) | Per game, low whole numbers, about even for quick and long games; a series scores the best 2 games. Players score kills, assists and deaths (each capped at 3), gold lead at 15, solo kills, first blood, deathless games, multikills and steals. The coach scores first tower, most drakes, barons and elders, a quick win, +3 for a series win and −1 for a series loss. The Carry scores ×1.5, rounded down. | partly built: rules, and settled stats loaded and stored; the screens' points are made up |
| 6 | [Buffs](spec/06-buffs.md) | Buffs are data: a name, an effect from the code's list, a count per split, the stages that allow it. One a gameweek. The buffs are Remake, Limitless (no budget or team cap for a week), Bench Boost and Dual Carry (the Vice-carry scores ×1.5 too): one each in the beta, one each per split, in every stage. | partly built: rules, and buffs on Pick Team on made-up data; no storage yet |
| 8 | [Leagues](spec/08-leagues.md) | Every manager joins Overall, their country's league and their team's supporter league; the team is required at sign-up. Leagues rank on total points, with a season table and one per split. In Split 2, Overall splits into Legend (Split 1's top half) and Rise, points carried. Overall shows a LoL tier, Iron to Challenger, from percentile cut-offs. Private leagues by code or link, from any gameweek. | partly built: rules with Overall tiers, and the Leagues screen with its forms on made-up data; leagues stored (the three every manager joins, private leagues by code), not yet wired to the screen |
| 9 | [Onboarding](spec/09-onboarding.md) | Copies UCL Fantasy: a new visitor lands on the pick-a-team page, with Auto-fill, and the squad is kept in the browser. Sign-up comes on Save: Google or Discord, then team name, favourite team, country. Late joiners as in FPL. | partly built: rules, and the guest's squad kept in the browser; no screen or sign-in yet |
| 10 | [Season and gameweeks](spec/10-season-and-gameweeks.md) | Split 1 is the beta, the LCK Cup dropped; Road to MSI and the LCK playoffs are the real test. Each stage's rules are settings, set when the 2027 fixtures are out. A gameweek is one LCK week, its deadline 15 minutes before its first series, knockouts included. In knockouts the team cap rises from 2 to 3, the budget is raised, transfers are unlimited and every series counts. | partly built: the 2027 season's settings and Split 1's gameweeks and deadlines stored from data/lck, made up; no stage rules yet |
| 11 | [Live points](spec/11-live-points.md) | The beta has live points from Riot's unofficial feed, shown as provisional. A series turns final 3 hours after it ends, from Oracle's Elixir and Leaguepedia. Ranks move when a series is final; prices only at the deadline. | partly built: settled-stats rules, a series' final state, an admin's pasted Leaguepedia key and stored, re-runnable loads of series, games, lineups and stats; no live feed or fetching yet |
| 12 | [Pages](spec/12-pages.md) | Home (a status page), Pick Team, Transfers, Points, Leagues, Stats, an LCK hub for the LCK's fixtures, standings and rosters, a series page, player and coach pop-ups, public manager profiles, Perfect game (the week's best team), Patch update (the new prices each gameweek), Live (a stream picker: official broadcasts and co-streamers beside live points), Help and Settings. | partly built: star and flop rules, and every page but Help built to its picture on made-up data; no backend wired yet |
| 13 | [Korean touches](spec/13-korean-touches.md) | Made-up Korean sponsors from LCK memes, each explaining its meme on tap; coffee, protest and sponsor trucks ([spec/14](spec/14-following.md)); a birthday cake on a player's week; a hangul banner for your team; fun team shirts and crests, and where each shows. No points. | not built |
| 14 | [Following and trucks](spec/14-following.md) | Follow other managers by request, one-way, in the beta. A feed of their series points, big Carries and transfers. Truck anyone you follow once a gameweek: coffee to cheer, protest to jeer, from a database of preset lines; sponsor trucks to each private league's weekly top. | partly built: follows, the feed and trucks as rules, and the Following page on made-up data; no storage yet |

## Later

- A watchlist, as FPL's (Craig, 14 Nov 2026) ([spec/03](spec/03-transfers.md)).
- Following personalities (casters, streamers who play), teams and players; reactions other than
  trucks (Craig, 14 Nov 2026) ([spec/14](spec/14-following.md)).
- A second live source, researched if Riot's live feed breaks during the beta (Craig, 13 Nov 2026)
  ([spec/11](spec/11-live-points.md)).
- The achievement book, parked: not in the beta, not grilled (Craig, 13 Nov 2026)
  ([spec/07](spec/07-achievement-book.md)).
- The values of each stage's settings, set when the 2027 fixture dates come out
  ([spec/10](spec/10-season-and-gameweeks.md)).
- Unkillable, a buff with no negative points for a gameweek ([spec/06](spec/06-buffs.md)).
- SOOP and CHZZK streams on the Live page, once their embedding is checked (Craig, 13 Nov 2026)
  ([spec/12](spec/12-pages.md)).
- Head-to-head leagues, and FPL's public leagues of strangers (Craig, 13 Nov 2026).
- A guided tour for newcomers; the beta has the Help page only (Craig, 13 Nov 2026)
  ([spec/09](spec/09-onboarding.md)).
- A line on Points when a manager's tier changes, such as "Promoted to Diamond IV" (Craig, 14 Nov 2026)
  ([spec/08](spec/08-leagues.md)).
- A trophy room of a manager's big achievements, on their profile, and a difficulty rating for each series (Craig, 13 Nov 2026).

## Out of scope

- A draft game.
- Cash prizes.
- A gameweek per match day: "lots of transfers… more admin" (Craig, 11 Nov 2026).
- FPL's selling price, keeping half of a rise: a player sells at his full current price (Craig, 12 Nov 2026).
- A coach scored as the average of his players' points, CBLOL's 2026 way (Craig, 11 Nov 2026).
- The coach as Carry or Vice-carry (Craig, 12 Nov 2026).
- A point for a game won, for players or the coach; role quests; CS and vision lines (Craig, 12 Nov 2026).
- Points for playing (Craig, 13 Nov 2026).
- GRID as a data source: not asked (Craig, 13 Nov 2026).
- Riot's esports schedule API and its key, which is Riot's own (Craig, 13 Nov 2026).
- A cup: "Cup is just head to head. We stick to points for now" (Craig, 13 Nov 2026).
- A prizes page, and a price predictor (Craig, 13 Nov 2026).
- A watchlist, and projected points on the player card (Craig, 13 Nov 2026).

## Glossary

| Term | Meaning | Not |
|---|---|---|
| gameweek | The window one squad and one captain score for, with one deadline. | week |
| series | One fixture between two teams, a Bo3 or Bo5. | match |
| game | One game within a series. | map |
| stage | A part of a competition with its own settings: groups, Road to MSI, play-in, playoffs. | phase |
| round | One round of a knockout bracket. | |
| Carry | The player whose points are multiplied this gameweek: FPL's captain. Vice-carry is the vice-captain. | captain |
| table | A league's ranking: one for the season and one per split. | leaderboard |
| Perfect game | The gameweek's best team under the squad rules: a Carry and 7 starters. | team of the week |
| LCK hub | The LCK's own fixtures, standings and rosters. | fixtures page |
| coach | The slot that is a team, scoring the team's play, shown as its head coach. | team slot |
| tier | An Overall place as a LoL ranked tier, Iron to Challenger (Craig, 14 Nov 2026). | league, rank |
| division | A step within a tier, IV (lowest) to I. | |
| rank | A manager's place in a table. Example: 48,211th. | tier |
| buff | A one-off a manager plays in a gameweek, such as Remake: FPL's chip (Craig, 14 Nov 2026). | chip, boost |
| Card view | The starters as the LCK broadcast's lineup, on Pick Team, Points and Perfect game (Craig, 16 Nov 2026). | List view |
| List view | Transfers' squad as FPL's list: rows grouped by role, with prices and fixtures (Craig, 16 Nov 2026). | Card view |
