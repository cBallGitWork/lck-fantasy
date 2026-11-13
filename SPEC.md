# SPEC

**Contents:** [What it is](#what-it-is) · [Features](#features) · [Out of scope](#out-of-scope) · [Glossary](#glossary)

Craig's answers and nothing else. They come from chat on 26–29 Oct and 11 Nov 2026
([docs/decisions.md](docs/decisions.md) keeps the history). A feature's detail is settled by its
own `/grill` before it is built, and lands in its `spec/NN-name.md` file. What is still open lives in
[docs/to-grill.md](docs/to-grill.md), never here.

## What it is

**Flol** (Craig, 11 Nov 2026: "the name is FLoL"; written Flol and said "flol", one syllable): a free, season-long fantasy game for the LCK (League of Legends Champions Korea) that copies
FPL's structure: a budget, a squad with a bench, weekly transfers, a captain, chips, and global
and supporter leagues. It is not a draft game. The theme is Korean.

Players are worldwide and the game is in English first. Deadlines are stored in UTC and shown
in each user's local time. There are no cash prizes.

The LCK goes first because its schedule is more regular than the LEC's three splits. The LCK
Cup (January–March 2027) is the beta and the test. The main game splits into Split 1 and
Split 2, and chips reset at the split, the way FPL's reset at GW19.

Live points "would be great" (Craig, 11 Nov 2026).

**The base assumption:** keep the rules as close to FPL's as possible. Where a rule is in doubt,
use FPL's rule, or at least its logic (Craig, 11 Nov 2026).

## Features

A feature's status lives only in this table. `to grill` means Craig has given the outline below
and the detail waits for its `/grill`; `not built` means it is grilled and waits to be built.

| # | Feature | What Craig has said | Status |
|---|---|---|---|
| 1 | [Squad and slots](spec/01-squad-and-slots.md) | A squad of 9: one player per role, a flex player of any role and the coach start; two on the bench. Auto-subs as in FPL, into the player's own role or the flex. The coach is the team: it scores the team's play, shown as its head coach. | not built |
| 2 | [Prices and budget](spec/02-prices-and-budget.md) | Money in 억. First prices from a formula, adjusted by hand. Prices move weekly at the deadline, mostly on points, a little on demand, down when few own a player, above a floor; the formula is public. Sell at the full current price. | not built |
| 3 | [Transfers](spec/03-transfers.md) | One free transfer a week, banking to 3, each extra −4. Unlimited before the season's and Split 2's first deadline, then 2 free in the next gameweek. An admin can top banks up. | not built |
| 4 | [Carry (captain)](spec/04-captain.md) | A Carry and Vice-carry (FPL's captain and vice) from the six starting players, never the coach. The Carry's points are multiplied; the Vice-carry takes over if the Carry plays no game. | not built |
| 5 | [Scoring](spec/05-scoring.md) | Per game, low whole numbers, about even for quick and long games; a series scores the best 2 games. Players score kills, assists and deaths (each capped at 3), gold lead at 15, solo kills, first blood, deathless games, multikills and steals. The coach scores first tower, most drakes, barons and elders, a quick win, +3 for a series win and −1 for a series loss. The Carry scores ×1.5, rounded down. | not built |
| 6 | [Chips](spec/06-chips.md) | Chips are data: a name, an effect from the code's list, a count per split, the stages that allow it. One a gameweek. Names so far: Remake, Recall, Bench Boost, Hyper Carry. The set is picked before the beta. | not built |
| 8 | [Leagues](spec/08-leagues.md) | FPL-style global leagues, and team supporter leagues. | to grill |
| 9 | [Onboarding](spec/09-onboarding.md) | Copies UCL Fantasy: a new visitor lands on the pick-a-team page, with Auto-fill, and the squad is kept in the browser. Sign-up comes on Save: email link, team name, favourite team, country. Late joiners as in FPL. | not built |
| 10 | [Season and gameweeks](spec/10-season-and-gameweeks.md) | The LCK Cup is a closed beta; Road to MSI and the LCK playoffs are the real test. Each stage's rules are settings, set when the 2027 fixtures are out. A gameweek is one LCK week, its deadline 15 minutes before its first series. | not built |
| 11 | [Live points](spec/11-live-points.md) | Points that move during a series "would be great". Ask GRID for its feed first; fall back to Riot's unofficial live feed (Craig, 11 Nov 2026). | to grill |

## Later

- The achievement book, parked: not in the beta, not grilled (Craig, 13 Nov 2026)
  ([spec/07](spec/07-achievement-book.md)).
- The values of each stage's settings, set when the 2027 fixture dates come out
  ([spec/10](spec/10-season-and-gameweeks.md)).
- Unkillable, a chip with no negative points for a gameweek ([spec/06](spec/06-chips.md)).
- A guided tour for newcomers; the beta has the Help page only (Craig, 13 Nov 2026)
  ([spec/09](spec/09-onboarding.md)).

## Out of scope

- A draft game.
- Cash prizes.
- A gameweek per match day: "lots of transfers… more admin" (Craig, 11 Nov 2026).
- FPL's selling price, keeping half of a rise: a player sells at his full current price (Craig, 12 Nov 2026).
- A coach scored as the average of his players' points, CBLOL's 2026 way (Craig, 11 Nov 2026).
- The coach as Carry or Vice-carry (Craig, 12 Nov 2026).
- A point for a game won, for players or the coach; role quests; CS and vision lines (Craig, 12 Nov 2026).
- Points for playing (Craig, 13 Nov 2026).

## Glossary

| Term | Meaning | Not |
|---|---|---|
| gameweek | The window one squad and one captain score for, with one deadline. | week |
| series | One fixture between two teams, a Bo3 or Bo5. | match |
| game | One game within a series. | map |
| stage | A part of a competition with its own settings: groups, Road to MSI, play-in, playoffs. | phase |
| round | One round of a knockout bracket. | |
| Carry | The player whose points are multiplied this gameweek: FPL's captain. Vice-carry is the vice-captain. | captain |
| coach | The slot that is a team, scoring the team's play, shown as its head coach. | team slot |
