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
and the detail waits for its `/grill`; nothing is built.

| # | Feature | What Craig has said | Status |
|---|---|---|---|
| 1 | [Squad and slots](spec/01-squad-and-slots.md) | Follows FPL: a squad with a bench and auto-subs. It has a flex position and a coach slot. | to grill |
| 2 | [Prices and budget](spec/02-prices-and-budget.md) | Prices, with a Korean feel, for example in won. | to grill |
| 3 | [Transfers](spec/03-transfers.md) | Weekly transfers with −4 hits. | to grill |
| 4 | [Captain](spec/04-captain.md) | A captain, as in FPL. | to grill |
| 5 | [Scoring](spec/05-scoring.md) | A set of toggles, with weights by position. Point values stay low, like FPL's. It must not reward long games, so raw kill totals are out. Points work per series, and a series scores a player's best 2 games (Craig, 11 Nov 2026). Backtested on 2026 LCK data. | to grill |
| 6 | [Chips](spec/06-chips.md) | FPL-style chips with names themed on the league. | to grill |
| 7 | [Achievement book](spec/07-achievement-book.md) | Each achievement is worth about 1 point, and it is packed with LCK memes and history. Example: "Ryu sad face": your opponent loses a solo 1v1, after Faker beat Ryu in 2013. | to grill |
| 8 | [Leagues](spec/08-leagues.md) | FPL-style global leagues, and team supporter leagues. | to grill |
| 9 | [Onboarding](spec/09-onboarding.md) | Copies UCL Fantasy: the first page is one where you can just pick a team, with no sign-up wall. "Its a great way to get people in" (Craig, 11 Nov 2026). | to grill |
| 10 | [Season and gameweeks](spec/10-season-and-gameweeks.md) | The LCK Cup is the beta. Split 1 and Split 2, with chips resetting at the split. | to grill |
| 11 | [Live points](spec/11-live-points.md) | Points that move during a match "would be great". Ask GRID for its feed first; fall back to Riot's unofficial live feed (Craig, 11 Nov 2026). | to grill |

## Out of scope

- A draft game.
- Cash prizes.

## Glossary

Empty until the first `/grill` settles a word.
