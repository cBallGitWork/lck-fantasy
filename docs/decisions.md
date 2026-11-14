# LCK fantasy: decisions so far

Craig's answers in chat, 26–29 Oct and 11 Nov 2026. This is the history; [SPEC.md](../SPEC.md) is the product, and open items live in [to-grill.md](to-grill.md).

**Contents:** [What it is](#what-it-is) · [Season](#season) · [Squad and slots](#squad-and-slots) · [Scoring](#scoring) · [Chips](#chips) · [Achievement book](#achievement-book) · [Leagues](#leagues) · [Onboarding](#onboarding) · [Foundations](#foundations-11-nov-2026) · [Season grill](#season-and-gameweeks-grill-11-nov-2026) · [Squad grill](#squad-and-slots-grill-11-nov-2026) · [Scoring grill](#scoring-grill-first-round-12-nov-2026) · [Chips grill](#chips-grill-12-nov-2026) · [Prices grill](#prices-grill-12-nov-2026) · [Transfers grill](#transfers-grill-12-nov-2026) · [Captain grill](#captain-grill-12-nov-2026) · [Scoring table](#scoring-table-bench-1213-nov-2026) · [Onboarding grill](#onboarding-grill-13-nov-2026) · [Beta chips grill](#beta-chips-grill-13-nov-2026) · [Knockouts grill](#knockouts-grill-13-nov-2026) · [Leagues grill](#leagues-grill-13-nov-2026) · [Pages grill](#pages-grill-13-nov-2026) · [Korean touches grill](#korean-touches-grill-13-nov-2026) · [Settings and sign-in grill](#settings-and-sign-in-grill-13-nov-2026) · [Live points grill](#live-points-grill-13-nov-2026) · [Picture bits grill](#picture-bits-grill-14-nov-2026) · [Following grill](#following-and-trucks-grill-14-nov-2026) · [Open](#open) · [Research](#research-behind-this)

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

Settled; the spec is [spec/06-buffs.md](../spec/06-buffs.md).

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
- 13 Nov, offered the achievement book as the next grill: "scrap it for now", then "Yes, file it". Parked, under Later in SPEC.md.

## Onboarding grill (13 Nov 2026)

Settled; the spec is [spec/09-onboarding.md](../spec/09-onboarding.md). All by dialog, each
taking the recommendation.

- First page: straight to the picker, with a Log in link. Auto-fill: yes.
- A guest's squad is kept on the device until sign-up.
- Sign-up on Save asks email, team name, favourite team and country.
- Country prefilled, and fixed on the favourite team's rule. Team names as FPL.
- Late joiners as FPL. A guided tour: later.

## Beta chips grill (13 Nov 2026)

Settled; the spec is [spec/06-buffs.md](../spec/06-buffs.md).

- All four chips in the beta; "One for each split when we start. All in beta", then one of each in the beta, yes.
- Hyper Carry at ×2: "Well we have 2 series in a week so x2 a lot. 1.5x good"; then ×2, picked in a dialog; then "Change hypercarry to dual carry, vice carry gets the carry points too". No stand-in if the Carry doesn't play, yes.
- Stages: "Nah allow every stage. Names are too similar though" (Remake and Recall).
- The Free Hit chip: "Limitless. No budget, no team restrictions per team"; it replaces Recall, roles still apply, yes.

## Knockouts grill (13 Nov 2026)

Settled; the spec is [spec/10-season-and-gameweeks.md](../spec/10-season-and-gameweeks.md).

- A knockout gameweek is one week, yes. Every series counts, transfers unlimited, yes.
- The team cap: "Should move to 3 (we have 9 slots max)"; 2 in the regular season, 3 in knockouts, yes.
- The budget: "Keep the budget but increase it. Final 3 means all good teams"; the amount set with the 2027 prices, yes.
- Split 2's start: the raise taken back, yes; squads fixed before Split 2's first deadline, yes; a squad left as it is: "Nah this would be exploit for a team having 3 each of best players", so Flol fixes it, yes. "And transfers locked after end of split 1 opens 2 weeks before split 2".

## Leagues grill (13 Nov 2026)

Settled; the spec is [spec/08-leagues.md](../spec/08-leagues.md).

- Head-to-head: later. A cup: "Cup is just head to head. We stick to points for now".
- Automatic leagues: Overall, country and team, yes. Public leagues: later.
- Favourite team: required; "Fixed but can change anytime before their first gameweek starts and scores".
- Private leagues by code or link, from any gameweek, as in FPL, yes.
- A season table plus one per split, yes; "And have a split 1 and 2 league". The word is table, not leaderboard.
- "Split the global league from split 1 into legend and rise": Split 1's top half to Legend, yes; "Scores carry over"; Split 2 joiners to Rise, yes; Overall only, yes; the whole Overall table stays, yes.
- The Leagues page (later the same day, by dialog): the list of leagues, the table's columns, the maker's admin, and 25 private leagues with no size cap, all as FPL, yes.

## Pages grill (13 Nov 2026)

Settled; the spec is [spec/12-pages.md](../spec/12-pages.md).

- FPL's core pages, with "League/fixtures can be merged into LCK. Can include standings, fixtures, squads"; Settings too.
- Extras: series page, LCK hub, team of the week, price changes. Home: a status page, yes. Teams public, as FPL, yes.
- Points: series inside each player, and rank movement. Chips confirm as FPL, yes. Coach pop-up: "Yes he's essentially the 6th role".
- Stats: "Whatever stats we have with scoring a priority". Player pop-up: champions, lines per game, price history.
- Live in the beta, on LCK's Twitch; a Live now banner, yes; next series and countdown, yes; says so when the feed is down, yes.
- Later: trophy room, difficulty ratings. No predictor, no prizes page.
- Team of the week: "Perfect game. Carry and 7 starters", "Perfect game includes the rules such as 2 per team".
- The player card (later the same day, by dialog): header as FPL, actions as FPL, scoring lines only, yes. Tabs: "Look at other games too and let's see how we can improve"; after the survey, the front strip, a Champions tab, ranks and transfers in and out, yes. "Compare yes watchlist no. News yes"; news written by an admin, Compare in the beta, the coach card with a Roster tab, yes.

## Korean touches grill (13 Nov 2026)

Settled; the spec is [spec/13-korean-touches.md](../spec/13-korean-touches.md). By dialog.

- Fake ads: the header line, banners and the Overall badge; admin data, Craig approves each; memes only, no real player endorsing; tap explains the meme; hangul and English with a made-up note; random, about 10 for the beta. All yes.
- Picked from the ideas list: coffee truck, birthday week, hangul banner. "The trucks were t1 fans sending it to there team with hq after bad play": protest trucks only, to a league-mate below the league's average, yes; preset lines.
- Birthday week and the typed hangul banner, yes.

## Settings and sign-in grill (13 Nov 2026)

Settled; the specs are [spec/12-pages.md](../spec/12-pages.md) (Settings) and [spec/09-onboarding.md](../spec/09-onboarding.md) (sign-in). By dialog.

- Settings: team name, email, banner text, favourite team and country locked with why; time zone; theme follows the device; delete account. All yes.
- Emails: "Add a weekly recap"; both opt-in, off by default, for Resend's 100 a day, yes.
- "And log in pages and how we handle that (Google only so we don't store passwords)". Google only or more: "Your call"; Claude added Discord, where LoL fans are. Sign-up asks team name, favourite team, country; stay signed in until sign-out. Yes.
- Live: "Options of languages, official and streamers"; an admin list, Twitch and YouTube in the beta, official English first and the last pick remembered. All yes.

## Live points grill (13 Nov 2026)

Settled; the spec is [spec/11-live-points.md](../spec/11-live-points.md).

- Live in the beta: "ah we really need live in some way"; from Riot's unofficial feed, provisional; game ids from Leaguepedia, not Riot's schedule key.
- GRID: asked whether they'd just say no, then "Don't bother".
- Final: Oracle's Elixir plus Leaguepedia; "3 hours after each series but lol just has the stats via the game so shouldnt be corrections".
- Ranks and prices: "live ranks - update after each series", on final points; "prices update once a gamweek deadline has passed / new gameweek begins (dont like daily changes)".
- Feed down: no live points, "but we could look at other sites to grab the basic data like kills etc?", placed under Later.

- Live game ids (13 Nov, later): Leaguepedia has no live-feed ids; "Find similar site as another backup?"; none exists, so read them from lolesports.com's pages: "yes".

## Picture bits grill (14 Nov 2026)

Settled; the spec is [spec/12-pages.md](../spec/12-pages.md) and the glossary.

- Rift view and Card view on Pick Team and Transfers, the last choice remembered; greyed players sorted last; Home's muted stream when live and the lineup when idle: yes to each.
- Chips: asked for a league term instead, then picked buffs over spells and ults; the rename goes everywhere, the code through an issue.
- Star and flop: "star and flop takes in ownsership too i believe", then a differential star, "but also remember a carry means you own 150% of them"; yes to the formula with effective ownership.

## Following and trucks grill (14 Nov 2026)

Settled; the spec is [spec/14-following.md](../spec/14-following.md).

- Following in the beta, by request and one-way; the feed's three items; a big Carry at 20+: "Yes, all five". Later: "we could have a notable personalities in the future/show followed teams/players etc".
- Trucks: asked for research on truck culture first, then anyone you follow; coffee and protest with preset lines, one per person a week; sponsor trucks; a Following page; protest lines never name a player; lines take the manager's numbers.
- Lines: "get a comedy writer agent in for it", "buuld a db of lines like a game like fm would for dialogue", "use fpl terms/lingo too, explore that, uk english". The first 63 are drafts in docs/research/truck-lines.md.

## Open

- How the achievements cap and rank: a separate column, and base points decide ties?

## Research behind this

In `docs/research/`. It rests on search-result snippets because the session's network blocked most primary sources, so verify before building on it.

- [LoL esports fantasy landscape](research/lol-esports-fantasy-landscape.md)
- [LCK fantasy deep dive](research/lck-fantasy-deep-dive.md)
- [Esports fantasy design ideas](research/esports-fantasy-design-ideas.md)
- [FPL style weekly game logic](research/fpl-style-weekly-game-logic.md)
- [Fantasy onboarding standards](research/fantasy-onboarding-standards.md)
