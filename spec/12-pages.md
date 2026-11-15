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
  - Rift view and Card view, Rift on the first visit, then remembered, as Pick Team.
  - Your own week (Craig, 14 Nov 2026): your Star, the top starter after the Carry ×1.5; your
    Flop, the lowest starter who played; and the Killer, the top scorer you don't own, each with
    ownership. Home keeps the global star and flop.
  - The Carry's games show your Carry's points beside the average Carry's.
  - Your Overall tier and ≈ points to promote, or to avoid demotion ([spec/08](08-leagues.md#overall-tiers)).
  - Its layout is the approved picture (`docs/design/approved/points/`).
- **Leagues** ([spec/08](08-leagues.md)).
- **Stats**: every stat Flol holds, the scoring lines first ("Whatever stats we have with scoring
  a priority", Craig, 13 Nov 2026).
  - A Players | Coaches switch. Each line shows its count (14 kills, not +5); the points from
    each line are on the player card. Season totals, with a Totals | Per game toggle that divides
    every line by games; the season by default, one gameweek as an option. Filters: role, team,
    max price and a name search (Craig, 16 Nov 2026).
  - Each row also shows price and its last move, form, owned and points, as FPL's list does. Any
    column sorts. Your own players carry a dot. Academy players are listed, after everyone with
    games (Craig, 16 Nov 2026).
  - It links to Patch update. The picture is `docs/design/approved/stats/`.
- **LCK hub**: the LCK's own fixtures, standings and team rosters. There is no separate Fixtures
  page.
  - Tabs: Fixtures, Results, Standings and Teams, each its own (Craig, 15 Nov 2026). Standings
    show W, L, sets won and lost, +/−, Win % and the last 5.
  - Teams shows each team's LCK roster beside its academy (LCK CL) roster.
  - Sheep Esports' latest LCK headlines sit beside the tabs, each with a thumbnail, linking out.
    They come from Sheep's LCK tag page (Craig, 15 Nov 2026).
  - The picture is `docs/design/approved/lck-hub/`.
- **Series page**: one series, its games and each player's lines in each game.
  - A page with its own link, opened from every series row anywhere (Craig, 16 Nov 2026).
  - One grid per team: its players down the side, the games as columns, as in the Points drawer.
    Each cell shows the champion, K/D/A and points; the best 2 are boxed and a dropped game is
    greyed, as on Points (Craig, 16 Nov 2026).
  - Each game shows its winner, length, a POG badge on its Player of the Game and a VOD link to
    lolesports. No series POG, picks, bans or sides: "i dont think we need draft info overload"
    (Craig, 16 Nov 2026).
  - The scorebug shows each team's record as of now. The coach row shows the coach lines that
    scored and the series +3 or −1. Your own players carry a mark; there is no total of your
    players' points (Craig, 16 Nov 2026).
  - While live: provisional points, a Not final tag, solo kills and steals at final
    ([spec/11](11-live-points.md)).
  - A player who sat out a game shows a dash there; a sub has his own row.
  - Before it starts: the time (yours and KST), the format, both rosters and Watch ›.
  - The picture is `docs/design/approved/series/`.
- **Player pop-up**: see [The player card](#the-player-card).
- **Coach pop-up**: the coach has its own, since it scores different lines ("he's essentially the
  6th role", Craig, 13 Nov 2026). See [The coach card](#the-coach-card).
- **Manager profile**: public, as in FPL. Any manager's points, history and transfers open from a
  league table. Its tier shows by the team name, and History keeps each season's final tier and rank
  ([spec/08](08-leagues.md#overall-tiers)). Its private leagues show too, as in FPL; a History row opens that week's team
  (Craig, 14 Nov 2026). Its layout is the approved picture (`docs/design/approved/profile/`).
- **Perfect game**: the gameweek's best team, a Carry and 7 starters, picked under the squad
  rules, such as the team cap ([spec/01](01-squad-and-slots.md)).
  - The 7 starter slots, with one of them as Carry; the Carry's ×1.5 counts in its total. The cap
    applies, the budget does not (Craig, 16 Nov 2026). FPL's Team of the Week has no captain and ignores both.
  - It builds live, with a Not final tag until the week is final.
  - Reached from links on Points and Home.
- **Patch update**, named as LoL's patches (Craig, 16 Nov 2026; it was Price changes): the week's rises and falls. Past moves only, no prediction.
  - Reached from links on Stats and Transfers. ‹ Week › arrows go back through past weeks
    (Craig, 16 Nov 2026).
  - Rises and falls side by side. A rise is Korean red, a fall blue, on every screen that shows
    a price move (Craig, 16 Nov 2026).
  - Before the first move: "No moves yet".
- **Live**: in the beta. It embeds a stream beside the manager's live points. Its points panel
  waits on the live points spec ([spec/11](11-live-points.md)).
  - A picker chooses the stream. The list is admin data (name, language, platform, channel): the
    LCK's official broadcasts in each language, and co-streamers Craig approves, such as
    Caedrel.
  - The beta embeds Twitch and YouTube only. SOOP and CHZZK are later, once their embedding is
    checked.
  - It opens on the official English stream, then remembers each manager's last pick. Streams
    not live show greyed out.
  - The points panel shows the week's total with Average and Highest, as Points (Craig, 14 Nov
    2026).
  - With nothing live, it shows the next series and a countdown.
  - If the live feed is down, the points panel says so; final points follow
    ([spec/11](11-live-points.md)).
  - Home embeds the stream while a series is live ([Home](#home)); it never redirects.
- **Following**: the feed, follows, requests and trucks received ([spec/14](14-following.md)).
- **Help**, with a Ranks section holding the tier cut-offs ([spec/08](08-leagues.md#overall-tiers)),
  and **Settings** ([below](#settings)).

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
- On Pick Team, swaps, the Carry, the Vice-carry and buffs take effect only when the manager
  presses Save (Craig, 13 Nov 2026). Reset clears what isn't saved.
- On Transfers, a player the manager can't buy (over the budget, or his team is full) stays in
  the list, greyed, with why, and sorts last.
- Each player in a list shows ▲ or ▼ for his last price move (prices move weekly at the
  deadline, [spec/02](02-prices-and-budget.md)); his card shows the amount. Example: Faker
  ▲ ₩0.5억. Before a player's price first moves, nothing shows.
- Transfers lists each of the gameweek's confirms at the top, each with one Undo
  ([spec/03](03-transfers.md#undoing-a-transfer)).

## The player card

What opens when a manager taps a player (the `/grill` of 13 Nov 2026, after a look at FPL,
F1 Fantasy, Sleeper and gol.gg).

- **Header**, as FPL's: team, role, price, owned by %, form (average of the last 4 gameweeks)
  and season total. The stats show their rank. Example: form 7.3, 2nd of 10 mids. Once the game
  is live it also shows the gameweek's transfers in and out.
- **News**: a short line and a flag an admin writes by hand, as FPL's staff do. Example: Benched
  for the Wednesday series.
- **Front**, before any tab: his points in the last 3 series and the next 3 series, by series,
  not by gameweek (Craig, 14 Nov 2026). Example: 10 · 12 · 5, next T1 v KT, Wednesday, Bo3.
- **Tabs**:
  - This week: each series and each game, with the champion, the scoring lines, the points, and
    which 2 games counted.
  - Fixtures: his team's next series, Bo3 or Bo5.
  - History: each series' points, with each gameweek's price and total shown once, then past
    seasons: past LCK seasons scored by Flol's lines, as many years as the data allows (Craig,
    14 Nov 2026).
  - Champions: each champion he has played this season, with games and average points.
- **Season stats**: the scoring lines only ([spec/05](05-scoring.md)), as per-game averages and
  totals, beside every tab (Craig, 14 Nov 2026).
- **Buttons**, as FPL's, by where it opened: transfer in or out, Make Carry, Make Vice-carry,
  substitute.
- **Compare**, in the beta: two players side by side, with header stats, form, scoring lines and
  next series.
  - A sheet over the card. The second player comes from a search, his role listed first. Any role
    with any role; a coach only with a coach (Craig, 16 Nov 2026).
  - The better number in each row is marked; there is no overall verdict. The next 3 series show,
    as on the player card.

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
- Sign out, and delete the account and its data. A private league the manager made passes to
  its next member (Craig, 16 Nov 2026).
- Reached from the team name at the right of the top bar. One page, saved with a Save button.
  The team name and the hangul banner are capped at 20 characters, as FPL's name is.
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
