# LCK fantasy: decisions so far

Craig's answers in chat, 26–29 Oct and 11 Nov 2026. This is the history; [SPEC.md](../SPEC.md) is the product, and open items live in [to-grill.md](to-grill.md).

## What it is

- The name is FLoL (Craig, 11 Nov 2026).
- A free, season-long fantasy game for the LCK that copies FPL's structure. It is not a draft game.
- Players are worldwide and the game is in English first. Deadlines are stored in UTC and shown in each user's local time.
- The LCK goes first because its schedule is more regular than the LEC's three splits.
- There are no cash prizes.

## Season

- The LCK Cup (January–March 2027) is the beta and the test.
- The main game splits into Split 1 and Split 2. Chips reset at the split, the way FPL's reset at GW19.
- Whether to include playoffs is undecided.

## Squad and slots

- It follows FPL: a squad with a bench, auto-subs, prices, transfers with −4 hits, and a captain.
- It has a flex position and a coach slot.
- Prices have a Korean feel, for example in won. Craig lived in Korea and understands the culture.

## Scoring

- Scoring is a set of toggles, with weights by position. The specifics come later.
- Point values stay low, like FPL's.
- Scoring must not reward long games, so raw kill totals are out.
- Ideas so far:
  - 1 point per 3 kills + assists;
  - gold lead at 15 minutes;
  - CS;
  - a bonus for winning quickly.
- Points work per series. One open toggle is whether a player scores from their best game or from the series as a whole.
- The scoring will be backtested on 2026 LCK data, Oracle's Elixir's 2026 CSV. That needs the file uploaded or Google Drive allowed in the network settings.

## Chips

- FPL-style chips with names themed on the league.
- Suggested names, not yet chosen: Remake (Wildcard), Stand-in (Free Hit), Sixth Man (Bench Boost), Baron Buff (Triple Captain), Unkillable (No Negative).

## Achievement book

- Each achievement is worth a very small amount, about 1 point.
- It is packed with LCK memes and history.
- Example: "Ryu sad face": your opponent loses a solo 1v1, after Faker beat Ryu in 2013.

## Leagues

- FPL-style global leagues.
- Team supporter leagues.

## Onboarding

- Many LoL fantasy games open with a sign-up wall, and that puts new users off.
- UCL Fantasy lets you pick your squad first. Copy that: let people pick their squad before they sign up.

## Foundations (11 Nov 2026)

- Services: "same as draft": Convex, Vercel's free plan and Resend magic links ([ARCHITECTURE.md](../ARCHITECTURE.md)).
- Stats: "live points would be great".
- This round is the repo setup and spec, the site flow and designs, the LCK data layer and a scoring backtest. No app skeleton: "cant be bothered with that".
- The repo is this one, `lck-fantasy`.
- A series scores a player's "best 2 games of a series".
- Live points: ask GRID first, and fall back to Riot's unofficial live feed.
- The base assumption: "keep rules as close to fpl (or at least the logic if ever in doubt)".
- Onboarding "copies fantasy UCL, its a page where you can just pick a team, its a great way to get people in".
- "Lets build folder structure etc" and "draw a site map".
- The look: "research lck colours and lol. i like shirts, see if player portraits appear too". The pitch view becomes a Rift view with the lanes, each player in "the equivalent of a shirt".
- How we work is ported from the draft product: hooks, skills, reviewer agents and the build pipeline.

## Open

- Playoffs: include them or not, and if so as a side game.
- Scoring per series: best game or the whole series.
- Size of the squad and bench, and what the flex slot can hold.
- How the coach slot scores.
- The chip set and names.
- How the achievements cap and rank: a separate column, and base points decide ties?

## Research behind this

In `docs/research/`. It rests on search-result snippets because the session's network blocked most primary sources, so verify before building on it.

- [LoL esports fantasy landscape](research/lol-esports-fantasy-landscape.md)
- [LCK fantasy deep dive](research/lck-fantasy-deep-dive.md)
- [Esports fantasy design ideas](research/esports-fantasy-design-ideas.md)
- [FPL style weekly game logic](research/fpl-style-weekly-game-logic.md)
- [Fantasy onboarding standards](research/fantasy-onboarding-standards.md)
