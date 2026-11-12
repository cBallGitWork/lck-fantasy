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
| 2 | [Prices and budget](spec/02-prices-and-budget.md) | Prices, with a Korean feel, for example in won. | to grill |
| 3 | [Transfers](spec/03-transfers.md) | Weekly transfers with −4 hits. | to grill |
| 4 | [Captain](spec/04-captain.md) | A captain, as in FPL. | to grill |
| 5 | [Scoring](spec/05-scoring.md) | A set of toggles, with weights by role. Whole numbers, low values, about even for quick and long games. A series scores a player's best 2 games. A quick win is under 25 minutes. The Carry scores ×1.5, rounded down. The table and the coach's scoring are still open. Backtested on 2026 LCK data. | to grill |
| 6 | [Chips](spec/06-chips.md) | FPL-style chips with names themed on the league. | to grill |
| 7 | [Achievement book](spec/07-achievement-book.md) | Each achievement is worth about 1 point, and it is packed with LCK memes and history. Example: "Ryu sad face": your opponent loses a solo 1v1, after Faker beat Ryu in 2013. | to grill |
| 8 | [Leagues](spec/08-leagues.md) | FPL-style global leagues, and team supporter leagues. | to grill |
| 9 | [Onboarding](spec/09-onboarding.md) | Copies UCL Fantasy: the first page is one where you can just pick a team, with no sign-up wall. "Its a great way to get people in" (Craig, 11 Nov 2026). | to grill |
| 10 | [Season and gameweeks](spec/10-season-and-gameweeks.md) | The LCK Cup is a closed beta; Road to MSI and the LCK playoffs are the real test. Each stage's rules are settings, set when the 2027 fixtures are out. A gameweek is one LCK week, its deadline 15 minutes before its first series. | not built |
| 11 | [Live points](spec/11-live-points.md) | Points that move during a series "would be great". Ask GRID for its feed first; fall back to Riot's unofficial live feed (Craig, 11 Nov 2026). | to grill |

## Later

- The values of each stage's settings, set when the 2027 fixture dates come out
  ([spec/10](spec/10-season-and-gameweeks.md)).

## Out of scope

- A draft game.
- Cash prizes.
- A gameweek per match day: "lots of transfers… more admin" (Craig, 11 Nov 2026).
- A coach scored as the average of his players' points, CBLOL's 2026 way (Craig, 11 Nov 2026).

## Glossary

| Term | Meaning | Not |
|---|---|---|
| gameweek | The window one squad and one captain score for, with one deadline. | week |
| series | One fixture between two teams, a Bo3 or Bo5. | match |
| game | One game within a series. | map |
| stage | A part of a competition with its own settings: groups, Road to MSI, play-in, playoffs. | phase |
| round | One round of a knockout bracket. | |
| coach | The slot that is a team, scoring the team's play, shown as its head coach. | team slot |
