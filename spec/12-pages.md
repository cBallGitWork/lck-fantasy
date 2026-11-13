# Pages

Craig's answers only, from the `/grill` of 13 Nov 2026. Where this file is silent the rule is
FPL's, or FPL's logic ([SPEC.md](../SPEC.md), the base assumption). Open questions are in
[docs/to-grill.md](../docs/to-grill.md). Each page's layout is set by its approved picture
(`docs/design/approved/`), not here. The survey behind this list is
[docs/research/fantasy-site-pages-survey.md](../docs/research/fantasy-site-pages-survey.md).

## The pages

- **Home**: a status page, not the Points page: the deadline, the last gameweek's points, free
  transfers and league ranks. While a series is live it shows a Live now banner.
- **Pick Team** and **Transfers**, as FPL's.
- **Points**: the current or last gameweek. Each player opens their series, with each game's
  points. Ranks show how far they moved, overall and in each league.
- **Leagues** ([spec/08](08-leagues.md)).
- **Stats**: every stat Flol holds, the scoring lines first ("Whatever stats we have with scoring
  a priority", Craig, 13 Nov 2026).
- **LCK hub**: the LCK's own fixtures, standings and team rosters. There is no separate Fixtures
  page.
- **Series page**: one series, its games and each player's lines in each game.
- **Player pop-up**: FPL's, plus the champion played, the scoring lines in each game, and the
  player's price history.
- **Coach pop-up**: the coach has its own, since it scores different lines ("he's essentially the
  6th role", Craig, 13 Nov 2026).
- **Manager profile**: public, as in FPL. Any manager's points, history and transfers open from a
  league table.
- **Perfect game**: the gameweek's best team, a Carry and 7 starters, picked under the squad
  rules, such as the team cap ([spec/01](01-squad-and-slots.md)).
- **Price changes**: the week's rises and falls. Past moves only, no prediction.
- **Live**: in the beta. It embeds the LCK's Twitch stream beside the manager's live points.
  - With nothing live, it shows the next series and a countdown.
  - If the live feed is down, the points panel says so; final points follow
    ([spec/11](11-live-points.md)).
  - Home shows a Live now banner while a series is live; it never redirects.
- **Help** and **Settings**.

## Chips

Chips confirm as in FPL: Remake and Recall are final once confirmed, like FPL's Wildcard and Free
Hit; Bench Boost and Hyper Carry can be cancelled until the deadline
([spec/06](06-chips.md)).
