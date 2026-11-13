# LCK fantasy: decisions so far

Craig's answers in chat, 26–29 Oct and 11 Nov 2026. This is the history; [SPEC.md](../SPEC.md) is the product, and open items live in [to-grill.md](to-grill.md).

**Contents:** [What it is](#what-it-is) · [Season](#season) · [Squad and slots](#squad-and-slots) · [Scoring](#scoring) · [Chips](#chips) · [Achievement book](#achievement-book) · [Leagues](#leagues) · [Onboarding](#onboarding) · [Foundations](#foundations-11-nov-2026) · [Season grill](#season-and-gameweeks-grill-11-nov-2026) · [Squad grill](#squad-and-slots-grill-11-nov-2026) · [Scoring grill](#scoring-grill-first-round-12-nov-2026) · [Chips grill](#chips-grill-12-nov-2026) · [Prices grill](#prices-grill-12-nov-2026) · [Transfers grill](#transfers-grill-12-nov-2026) · [Captain grill](#captain-grill-12-nov-2026) · [Scoring table](#scoring-table-bench-1213-nov-2026) · [Knockouts grill](#knockouts-grill-13-nov-2026) · [Open](#open) · [Research](#research-behind-this)

## What it is

- The name is Flol, said "flol" as one syllable (Craig, 11 Nov 2026). It is written Flol, not FLoL, to keep Riot's "LoL" mark out of the name.
- A free, season-long fantasy game for the LCK that copies FPL's structure. It is not a draft game.
- Players are worldwide and the game is in English first. Deadlines are stored in UTC and shown in each user's local time.
- The LCK goes first because its schedule is more regular than the LEC's three splits.
- There are no cash prizes.

## Season

- The LCK Cup (January–March 2027) is the beta and the test.
- The main game splits into Split 1 and Split 2. Chips reset at the split, the way FPL's reset at GW19.

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

## Season and gameweeks grill (11 Nov 2026)

Settled; the spec is [spec/10-season-and-gameweeks.md](../spec/10-season-and-gameweeks.md).

- The Cup "is a proof of concept/beta test, just do both": groups and knockouts score. Later: "lck cup just a closed beta anyways"; Road to MSI and the LCK playoffs are "the real test".
- Knockouts: "we probably need to remove the budget too, as its based around not getting the top guys", and "can increase the max players per squad too".
- Uneven weeks: first "i dont like that as towards the end some teams will plkay more, funnels picks to just them", then "i think every series should count". A gameweek per match day is out: "lots of transfers/betting on one team more admin". Stacking in thin weeks is still open: "every gameweek would just be stacking 2 teams".
- "we dont know what they are, but we can code/build the ability change it whenever", and the values are decided "when the fixture dates come out next year".
- Round 1: per-stage settings as data, yes; settings change only before a deadline, yes; deadline "15 mins before" the first series; Road to MSI in Split 1, yes; the glossary, yes.

## Squad and slots grill (11 Nov 2026)

Settled; the spec is [spec/01-squad-and-slots.md](../spec/01-squad-and-slots.md).

- Round 1: one per role plus a flex and the coach start, yes; a bench of 2, yes; the flex holds any role, yes; auto-subs into own role or flex, in bench order, yes.
- The coach: "id like more info on cblol", "coach could be towers, drakes, smart strats (example can we detect if they build for early or late and fix accordingly?) winning opent to ideas", and "coach is essentially the \"team\" but we will use a head coach as the role figurehead".
- Round 2: coach counts toward the team cap, yes; slot follows the listed role, yes; the coach scores the team's play, not CBLOL's average, yes; smart strats to the scoring grill, yes; no bench coach, yes; the pick stays through a coach change, yes.
- Auto-sub gaps the review found: a missing flex takes any bench player, yes; each bench player takes his own role before the flex, in bench order, yes; a bench player who didn't play is skipped, yes.

## Scoring grill, first round (12 Nov 2026)

The philosophy is settled in [spec/05-scoring.md](../spec/05-scoring.md); the table and the coach wait for a later session.

- "score philoshpes / full numbers no decimals / lower amounts / scoring thats even ish for both quick hames and linger games. in other fantasy lol games (research) cumulative scoring means longer games good".
- A point per game won: "will do later". A quick win: "25 min". The Carry: "×1.5", rounded down, yes.
- The table and the coach in a later session, with a new backtest, yes.

## Chips grill (12 Nov 2026)

Settled; the spec is [spec/06-chips.md](../spec/06-chips.md).

- "we will have chips, undecided yet, but build the ability for us to make them"; chips as data, from a list of effects, yes.
- Names: "Captain is Carry, Triple Cap is Hyper Carry. Bench Boost. Something shop related for Free Hit?"; Recall for the Free Hit, Remake for the Wildcard, the Vice-carry, yes.
- Unkillable: later. One chip a gameweek, yes.
- "1 chip a week, Transfer dont roll for a free hit or WC".

## Prices grill (12 Nov 2026)

Settled; the spec is [spec/02-prices-and-budget.md](../spec/02-prices-and-budget.md).

- Money in 억, yes.
- First prices: "combo of both", a formula from last season adjusted by hand, yes; the coach priced like a player, yes.
- Moves: "yes on performance, a little on demand and reduction for when nobody (relatively) is picking them (means their price was too high) but have a price floor"; weekly at the deadline, yes; the formula public, yes.
- Selling: "Full current price".

## Transfers grill (12 Nov 2026)

Settled; the spec is [spec/03-transfers.md](../spec/03-transfers.md).

- One free transfer a week, yes; the coach counts as a transfer, yes; unlimited before the first deadline, yes.
- Banking: "Up to 3. gw2 they start on 2".
- Split 2: "split 2 you get unlimited before its first week", then the same as the season's start, yes.
- An admin top-up to the cap, as FPL's AFCON one, yes.

## Captain grill (12 Nov 2026)

Settled; the spec is [spec/04-captain.md](../spec/04-captain.md).

- The multiplier: "willl be a multiplier, undecided yet, depends on scoring".
- A vice-captain as in FPL, yes; picked from the six starters, yes; never the coach, yes.
- In the chips grill: "Captain is Carry", and the vice is the Vice-carry, yes.

## Scoring table bench (12–13 Nov 2026)

Settled; the spec is [spec/05-scoring.md](../spec/05-scoring.md). Worked live against 2025 and 2026 LCK data.

- Spread: "I need you to elevate a good distribution of teams and roles"; "5 in top 20 is fine… Top 10 would be a problem"; mids "should be a tad higher too".
- Kills: "No FPL values simplicity", then "Just top and supp 2 kills then"; support kills stayed at 1 per 2 ("Supp, 2 sounds best?").
- Assists: "Ok assists we change for 1 every 5". Deaths: "Supports 1 per 4 deaths". Caps: "The point of caps was to stop long games", "Can of two too small", a cap of 3 for supports too, "Yes".
- Lines: "Change cs siff to Gold diff" ("Cs ans gold prob too linked"); solo kills, "Just +1 is fine" ("An isolated kill where there's no assist"); "Deathless game 1 point / First blood 1 point"; "Quadra penta bonus can return"; steals, "Maybe just +1 for a steal, simple".
- Out: "Top teams already at top so don't need winning"; "Ditch roles quests for now"; "Remove quick win and keep for coach"; vision, Claude's call when asked ("Your call"), then dropped with support kills at 1 per 2.
- The coach: "Most drakes / Most barons / Most elders / First tower / Most grubs / Series bonus win", then "Remove grubs" and "Ok series bonus"; "I'd like coaches to be just under other roles".
- Teams: a whole 2025 team in the top 10 is "Fine geng dominated".
- After the review (13 Nov): "No playing points"; "Coach can go below zero", with the line that does it left open ("leave the coach thing"); ties, "Yes tie nobody gets points"; the series win, "+2", then "Or +3?", "Sure".
- The 2026 top 50 under the final rules: "It's fine". Prices: "we price the top coaches a little higher than others".
- The coach penalty: "-1 for losing a series that's it"; Gen.G's coach moves from 5th to 6th in 2026, and "Pricing sorts that out anyways".
- Achievements: "Achievements list, a love letter to lck lore"; "Think like Xbox achievements / The Reddit memes etc"; stored for later, "Ok let's store the achieved tor now".

## Knockouts grill (13 Nov 2026)

Settled; the spec is [spec/10-season-and-gameweeks.md](../spec/10-season-and-gameweeks.md).

- A knockout gameweek is one week, yes. Every series counts, transfers unlimited, yes.
- The team cap: "Should move to 3 (we have 9 slots max)"; 2 in the regular season, 3 in knockouts, yes.
- The budget: "Keep the budget but increase it. Final 3 means all good teams"; the amount set with the 2027 prices, yes.

## Open

- How the achievements cap and rank: a separate column, and base points decide ties?

## Research behind this

In `docs/research/`. It rests on search-result snippets because the session's network blocked most primary sources, so verify before building on it.

- [LoL esports fantasy landscape](research/lol-esports-fantasy-landscape.md)
- [LCK fantasy deep dive](research/lck-fantasy-deep-dive.md)
- [Esports fantasy design ideas](research/esports-fantasy-design-ideas.md)
- [FPL style weekly game logic](research/fpl-style-weekly-game-logic.md)
- [Fantasy onboarding standards](research/fantasy-onboarding-standards.md)
