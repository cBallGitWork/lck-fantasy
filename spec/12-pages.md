# Pages

**Contents:** [The pages](#the-pages) · [Home](#home) · [Pick Team and Transfers](#pick-team-and-transfers) · [The player card](#the-player-card) · [Settings](#settings) · [The coach card](#the-coach-card) · [Buffs](#buffs)

Craig's answers only, from the `/grill` of 13 Nov 2026. Where this file is silent the rule is
FPL's, or FPL's logic ([SPEC.md](../SPEC.md), the base assumption). Open questions are in
[docs/to-grill.md](../docs/to-grill.md). Each page's layout is set by its approved picture
(`docs/design/approved/`), not here. The survey behind this list is
[docs/research/fantasy-site-pages-survey.md](../docs/research/fantasy-site-pages-survey.md).

## The pages

- **Home**: a status page, not the Points page: the deadline, the last gameweek's points, free
  transfers and league ranks. See [Home](#home).
- **Pick Team** and **Transfers**, as FPL's. See [Pick Team and Transfers](#pick-team-and-transfers).
- **Points**: the current or last gameweek. Each player opens their series, with each game's
  points. Ranks show how far they moved, overall and in each league.
- **Leagues** ([spec/08](08-leagues.md)).
- **Stats**: every stat Flol holds, the scoring lines first ("Whatever stats we have with scoring
  a priority", Craig, 13 Nov 2026).
- **LCK hub**: the LCK's own fixtures, standings and team rosters. There is no separate Fixtures
  page.
- **Series page**: one series, its games and each player's lines in each game.
- **Player pop-up**: see [The player card](#the-player-card).
- **Coach pop-up**: the coach has its own, since it scores different lines ("he's essentially the
  6th role", Craig, 13 Nov 2026). See [The coach card](#the-coach-card).
- **Manager profile**: public, as in FPL. Any manager's points, history and transfers open from a
  league table.
- **Perfect game**: the gameweek's best team, a Carry and 7 starters, picked under the squad
  rules, such as the team cap ([spec/01](01-squad-and-slots.md)).
- **Price changes**: the week's rises and falls. Past moves only, no prediction.
- **Live**: in the beta. It embeds a stream beside the manager's live points. Its points panel
  waits on the live points spec ([spec/11](11-live-points.md)).
  - A picker chooses the stream. The list is admin data (name, language, platform, channel): the
    LCK's official broadcasts in each language, and co-streamers Craig approves, such as
    Caedrel.
  - The beta embeds Twitch and YouTube only. SOOP and CHZZK are later, once their embedding is
    checked.
  - It opens on the official English stream, then remembers each manager's last pick. Streams
    not live show greyed out.
  - With nothing live, it shows the next series and a countdown.
  - If the live feed is down, the points panel says so; final points follow
    ([spec/11](11-live-points.md)).
  - Home embeds the stream while a series is live ([Home](#home)); it never redirects.
- **Help**, and **Settings** ([below](#settings)).

## Home

Craig's yes in the Home design round, grilled 14 Nov 2026. Its layout is the approved picture
(`docs/design/approved/home/`).

- **A series live:** the stream, muted, with the Live page's picker and the manager's remembered
  pick. **Live ›** opens the Live page.
- **Nothing live:** the manager's 7 starters for the week as a broadcast lineup, with C and V;
  the next series on stream and when; **Pick Team ›**.
- **Star and flop** of the last gameweek, the same pair for every manager, each shown with its
  points and effective ownership.
  - Effective ownership: the share of managers starting a player, a Carry counting 1.5. Example:
    40% start Faker, 20% of them as Carry, so 50%.
  - Star: the most points × (1 − effective ownership). Example: Kiin, 15 points at 8%, beats
    Chovy, 18 at 45% (13.8 against 9.9).
  - Flop: the fewest points among the 10 highest by effective ownership. Example: Faker, 2 points
    at 62%.

## Pick Team and Transfers

Grilled 14 Nov 2026.

- Both have Rift view and Card view (FPL's Pitch View and List View). The first visit opens on
  Rift view; after that each manager's last choice is remembered.
- On Transfers, a player the manager can't buy (over the budget, or his team is full) stays in
  the list, greyed, with why, and sorts last.
- Each player in a list shows ▲ or ▼ for his last price move (prices move weekly at the
  deadline, [spec/02](02-prices-and-budget.md)); his card shows the amount. Example: Faker
  ▲ ₩0.5억.
- Transfers lists the gameweek's confirmed transfers at the top, each with Undo
  ([spec/03](03-transfers.md#undoing-a-transfer)).

## The player card

What opens when a manager taps a player (the `/grill` of 13 Nov 2026, after a look at FPL,
F1 Fantasy, Sleeper and gol.gg).

- **Header**, as FPL's: team, role, price, owned by %, form (average of the last 4 gameweeks)
  and season total. The stats show their rank. Example: form 7.3, 2nd of 10 mids. Once the game
  is live it also shows the gameweek's transfers in and out.
- **News**: a short line and a flag an admin writes by hand, as FPL's staff do. Example: Benched
  for the Wednesday series.
- **Front**, before any tab: his points in the last 3 gameweeks and his next series. Example:
  9 · 14 · 6, next T1 v Gen.G, Wednesday, Bo3.
- **Tabs**:
  - This week: each series and each game, with the champion, the scoring lines, the points, and
    which 2 games counted.
  - Fixtures: his team's next series, Bo3 or Bo5.
  - History: each gameweek's points and price, then past seasons.
  - Champions: each champion he has played this season, with games and average points.
- **Season stats**: the scoring lines only ([spec/05](05-scoring.md)), as per-game averages and
  totals.
- **Buttons**, as FPL's, by where it opened: transfer in or out, Make Carry, Make Vice-carry,
  substitute.
- **Compare**, in the beta: two players side by side, with header stats, form, scoring lines and
  next series.

## Settings

Grilled 13 Nov 2026.

- Team name, changeable any time, as in FPL.
- The email address, from the Google or Discord account.
- The hangul banner text ([spec/13](13-korean-touches.md), once it merges).
- Favourite team and country: changeable until the manager's first gameweek scores, then shown
  locked, with why ([spec/08](08-leagues.md)).
- Time zone: the browser's, or one the manager picks. Example: a 16:45 KST deadline shows as
  08:45 in London.
- Light, dark, or follow the device.
- Sign out, and delete the account and its data.
- Emails, both opt-in and off by default: a deadline reminder 24 hours before, and a weekly
  recap once the gameweek is final (points, rank moves in each league, best player, any protest
  truck). No marketing. Off by default because Resend's free plan sends 100 emails a day.

## The coach card

The same as the player card, with the coach's lines in place of a player's. A Roster tab, the
team's players and prices, replaces Champions.

## Buffs

Buffs confirm as in FPL: Remake and Limitless are final once confirmed, like FPL's Wildcard and
Free Hit; Bench Boost and Dual Carry can be cancelled until the deadline
([spec/06](06-buffs.md)).
