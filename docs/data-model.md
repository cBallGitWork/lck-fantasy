# Data model: a proposal

How the LCK could be held as data. This is Claude's proposal, not Craig's answers: nothing here
is the product until a `/grill` moves it into [SPEC.md](../SPEC.md). Lines marked **ask** need
his call. The facts come from [the 2026 calendar](research/lck-2026-season-calendar.md).

**Contents:** [The shape](#the-shape) · [The real world](#the-real-world) ·
[Gameweeks](#gameweeks) · [Stats and points](#stats-and-points) · [The game](#the-game) ·
[What the LCK forces](#what-the-lck-forces)

## The shape

Two halves, kept apart:

- **The real world**: what happened in the LCK. It comes from a feed and is never edited by the
  game, only corrected by an admin.
- **The game**: what managers did. It reads the real world and never writes to it.

Every real-world row belongs to a competition and a season, so the LCK Cup, Split 1, Split 2
and later another league are rows, not code.

## The real world

| Table | One row is | Key fields |
|---|---|---|
| `competitions` | a league the game can run on | name (LCK), region, time zone (KST) |
| `seasons` | one year of it | competition, year |
| `stages` | a block with one format | season, name (LCK Cup, Rounds 1–2, Road to MSI, Rounds 3–4, Play-In, Playoffs), format (round robin, double elimination), series length (Bo3, Bo5), Fearless Draft or not, start and end dates, which split of the game it counts in |
| `teams` | an LCK team | name, short code, crest |
| `players` | a person | handle (Faker), real name, country, the feed's ids |
| `contracts` | a player at a team for a spell | player, team, role, from, to, starter or substitute |
| `series` | one Bo3 or Bo5 | stage, the two teams, scheduled start (UTC), state (to come, live, final), score in games, winner |
| `games` | one game in a series | series, game number, sides (blue, red), length in seconds, winner, patch |
| `gameLineups` | who played a game | game, player, team, role, champion |

Notes:

- **Role is on the contract and on the lineup, not on the player.** A player can change role
  between spells, and a stand-in can play out of role for one game. The lineup is what happened;
  the contract is what the game lists him as.
- **The coach** is a `contracts` row with the role `coach`. The coach slot picks the team, not
  the person: its pick holds a team, which scores the team's play and shows whoever holds the
  team's current coach contract, so a change of head coach changes no pick
  ([spec/01](../spec/01-squad-and-slots.md)). What it scores from is open (to-grill).
- **Roles** are a fixed list for LoL: top, jungle, mid, bot, support, plus coach. This is a rule
  of the sport, like FPL's four positions, so it can be a constant.
- **Substitutes and call-ups.** LCK teams register more than five players and promote from the
  Challengers league mid-split. A new `contracts` row adds the player to the game's player list
  from its start date.

## Gameweeks

| Table | One row is | Key fields |
|---|---|---|
| `gameweeks` | one round of the fantasy game | season, number, split, deadline (UTC), first and last series, state (to come, live, final) |

- A gameweek is a list of series, not a date range worked out in code. An admin can move a
  series between gameweeks, which covers postponements.
- **Proposal:** in the regular stages a gameweek is the LCK's own week, Wednesday to Sunday. Every
  team plays exactly two Bo3s in it, so there are no blanks or doubles there.
- **Proposal:** one deadline per gameweek, a fixed time before its first series. **ask:** how long
  before (FPL uses 90 minutes).
- **ask:** Road to MSI, the Play-In and the playoffs are uneven: four teams sit out Road to MSI,
  and in the playoffs a team can play none, one or three Bo5s in a week. Whether these are
  gameweeks at all is the open playoffs question.
- **ask:** the LCK Cup's format differs from the splits, and it needs the same mapping once its
  2027 schedule is out.

## Stats and points

| Table | One row is | Key fields |
|---|---|---|
| `gameStats` | one player in one game, as the feed sent it | game, player, kills, deaths, assists, CS, gold, gold difference at 15, CS difference at 15, plus the raw payload |
| `liveFrames` | the latest live reading for a game in play | game, player, the same stats so far, game clock, read at |
| `scoringRules` | one toggle of the scoring | season, stat, role, the rule (per N, threshold, bonus), points, on or off |
| `seriesPoints` | one player's points for one series | series, player, points, the breakdown line by line, provisional or final |

- **Raw stats are kept, points are worked out.** A rule change re-scores every series from
  `gameStats`, and the breakdown shows a manager where each point came from.
- **Points are per series**, as Craig said. Whether a series takes the best game or all of them is
  one field on the rules (to-grill).
- **Live and final are separate.** Live points are provisional readings; a series turns final when
  the settled stats arrive, and only final points move prices and ranks.
- **Scoring rules are data per season**, with a weight per role, so the toggles and position
  weights Craig described need no code change to tune.

## The game

| Table | One row is | Key fields |
|---|---|---|
| `managers` | a signed-in person | name, country, favourite team |
| `entries` | a manager's team in one season | manager, season, team name, bank |
| `picks` | an entry's squad for one gameweek | entry, gameweek, player (a team for the coach slot), slot (role, flex, coach, bench order), captain, vice-captain, buy price |
| `transfers` | one player out, one in | entry, gameweek, out, in, prices, free or a −4 hit |
| `chipPlays` | a chip used | entry, gameweek, chip |
| `prices` | a player's price over time | player, season, from gameweek, price in won |
| `entryGameweeks` | an entry's result for a gameweek | entry, gameweek, points, hits, rank, the auto-subs made |
| `leagues` | a mini-league | name, kind (overall, country, supporter, private, Legend, Rise), join code |
| `leagueEntries` | an entry in a league | league, entry, joined from gameweek |
| `achievements` | one page of the achievement book | name, the story, the rule that awards it, points |
| `achievementAwards` | an entry earning one | entry, achievement, series, gameweek |

- **A squad before sign-up.** The onboarding rule (pick first, sign up after) means a squad can
  exist with no manager. The draft squad lives in the browser, and becomes an `entries` row on
  sign-up.
- **A team always has a lineup.** `picks` rows are copied forward at each deadline, so an entry
  that does nothing still fields last week's team.
- **Chips, slots and squad sizes are data per season**, so they can be tuned after the beta.

## What the LCK forces

Things FPL never has to handle, which the model above allows for:

1. **A series is several games.** Points per series, with best-game or whole-series as a rule.
2. **Series length is unknown in advance.** A Bo3 lasts two or three games, so anything summed
   rewards the loser of a 2–1 less than the winner of a 2–0 only if the rules say so. The
   backtest measures this.
3. **Ten teams, five roles.** The player pool is about 50 starters, against FPL's 500 or more.
   Squads will overlap far more, so prices and the flex slot carry more of the game.
4. **Fearless Draft** in the post-season means a player's champions run out over a series. The
   lineup keeps the champion, so a later rule or achievement can read it.
5. **Roster moves mid-split** arrive as new contracts, and a benched starter is the LCK's
   version of an injury.
6. **Long breaks.** MSI leaves about six weeks with no series. Gameweeks simply stop and start.
7. **Patches.** Each game keeps its patch, so stats can be compared within one.
