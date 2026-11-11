# SPEC

**Contents:** [What it is](#what-it-is) · [Features](#features) · [Out of scope](#out-of-scope) · [Glossary](#glossary)

Craig's answers and nothing else. They come from chat on 26–29 Oct and 11 Nov 2026
([docs/decisions.md](docs/decisions.md) keeps the history). A feature's detail is settled by its
own `/grill` before it is built, and lands in `spec/NN-name.md`. What is still open lives in
[docs/to-grill.md](docs/to-grill.md), never here.

## What it is

A free, season-long fantasy game for the LCK (League of Legends Champions Korea) that copies
FPL's structure: a budget, a squad with a bench, weekly transfers, a captain, chips, and global
and supporter leagues. It is not a draft game. The theme is Korean.

Players are worldwide and the game is in English first. Deadlines are stored in UTC and shown
in each user's local time. There are no cash prizes.

The LCK goes first because its schedule is more regular than the LEC's three splits. The LCK
Cup (January–March 2027) is the beta and the test. The main game splits into Split 1 and
Split 2, and chips reset at the split, the way FPL's reset at GW19.

Live points "would be great" (Craig, 11 Nov 2026).

## Features

A feature's status lives only in this table. `to grill` means Craig has given the outline below
and the detail waits for its `/grill`; nothing is built.

| # | Feature | What Craig has said | Status |
|---|---|---|---|
| 1 | Squad and slots | Follows FPL: a squad with a bench and auto-subs. It has a flex position and a coach slot. | to grill |
| 2 | Prices and budget | Prices, with a Korean feel, for example in won. | to grill |
| 3 | Transfers | Weekly transfers with −4 hits. | to grill |
| 4 | Captain | A captain, as in FPL. | to grill |
| 5 | Scoring | A set of toggles, with weights by position. Point values stay low, like FPL's. It must not reward long games, so raw kill totals are out. Points work per series. Backtested on 2026 LCK data. | to grill |
| 6 | Chips | FPL-style chips with names themed on the league. | to grill |
| 7 | Achievement book | Each achievement is worth about 1 point, and it is packed with LCK memes and history. Example: "Ryu sad face": your opponent loses a solo 1v1, after Faker beat Ryu in 2013. | to grill |
| 8 | Leagues | FPL-style global leagues, and team supporter leagues. | to grill |
| 9 | Onboarding | Pick your squad before you sign up, as UCL Fantasy does. No sign-up wall first. | to grill |
| 10 | Season and gameweeks | The LCK Cup is the beta. Split 1 and Split 2, with chips resetting at the split. | to grill |
| 11 | Live points | Points that move during a match "would be great". | to grill |

## Out of scope

- A draft game.
- Cash prizes.

## Glossary

Empty until the first `/grill` settles a word.
