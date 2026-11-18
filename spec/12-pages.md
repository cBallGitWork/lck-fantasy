# Pages

**Contents:** [The pages](#the-pages) · [Home](#home) · [Pick Team and Transfers](#pick-team-and-transfers) · [The player card](#the-player-card) · [Settings](#settings) · [The coach card](#the-coach-card) · [Buffs](#buffs) · [Words](#words)

Craig's answers only, from the `/grill` of 13 Nov 2026. Where this file is silent the rule is
FPL's, or FPL's logic ([SPEC.md](../SPEC.md), the base assumption). Open questions are in
[docs/to-grill.md](../docs/to-grill.md). Each page's layout is set by its approved picture
(`docs/design/approved/`), not here. The survey behind this list is
[docs/research/fantasy-site-pages-survey.md](../docs/research/fantasy-site-pages-survey.md).

## The pages

- **Home**: a status page, not the Points page: the deadline, the last gameweek's points, free
  transfers and league ranks. See [Home](#home).
- **Pick Team** and **Transfers**, as FPL's. See [Pick Team and
  Transfers](#pick-team-and-transfers).
- **Points**: the current or last gameweek. Each player opens their series, with each game's
  points. Ranks show how far they moved, overall and in each league.
  - Rift view and Card view, Rift on the first visit, then remembered, as Pick Team.
  - Your own week (Craig, 14 Nov 2026): your Star, the top starter after the Captain ×1.5; your
    Flop, the lowest starter who played; and the Killer, the top scorer you don't own, each with
    ownership. Home keeps the global star and flop.
  - The Captain's games show your Captain's points beside the average Captain's.
  - A player's breakdown shows his total alone; only the Captain's has the average Captain's under it,
    as FPL (Craig, 17 Nov 2026).
  - The coach's breakdown ends each series with its own row under its games: `Series win +3` or
    `Series loss −1` (Craig, 17 Nov 2026).
  - A bench player opens his breakdown too, as FPL: his points in grey when they don't count (no
    Bench Boost, no auto-sub), `Didn't play` when he has no games (Craig, 17 Nov 2026).
  - Your Overall tier and ≈ points to promote, or to avoid demotion
    ([spec/08](08-leagues.md#overall-tiers)).
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
  - A column sorts highest first only, as FPL. Max price lists each price the players hold,
    highest first, as FPL's Max cost. Per game shows `—` for a player with no games, not 0.0.
    Filters that match no one show `No players` in place of the table (Craig, 17 Nov 2026).
  - It links to Price changes. The picture is `docs/design/approved/stats/`.
- **LCK hub**: the LCK's own fixtures, standings and team rosters. There is no separate Fixtures
  page.
  - Tabs: Fixtures, Results, Standings and Teams, each its own (Craig, 15 Nov 2026). Standings
    show W, L, sets won and lost, +/−, Win % and the last 5.
  - Teams shows each team's LCK roster beside its academy (LCK CL) roster.
  - Sheep Esports' latest LCK headlines sit beside the tabs, each with a thumbnail, linking out.
    They come from Sheep's LCK tag page (Craig, 15 Nov 2026).
  - The picture is `docs/design/approved/lck-hub/`.
  - Fixtures' ‹ stops at the current week; past weeks are on Results (Craig, 17 Nov 2026).
  - A stage not yet started says when it starts, from the competition's data. Example: "Starts
    Wed 12 Mar" (Craig, 17 Nov 2026).
  - Every LCK team has an academy roster in the LCK CL, so Teams has no empty academy column
    (Craig, 17 Nov 2026).
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
  - A coach's cell for a game his team didn't play shows `—`. A link to a series that doesn't
    exist shows `No such series` and `LCK hub ›` (Craig, 17 Nov 2026). The VOD link leaves Flol,
    so it ends with `↗` (plate.md).
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
  ([spec/08](08-leagues.md#overall-tiers)). Its private leagues show too, as in FPL; a History row
  opens that week's team (Craig, 14 Nov 2026). Its layout is the approved picture
  (`docs/design/approved/profile/`).
- **Perfect game**: the gameweek's best team, a Captain and 7 starters, picked under the squad
  rules, such as the team cap ([spec/01](01-squad-and-slots.md)).
  - The 7 starter slots, with one of them as Captain; the Captain's ×1.5 counts in its total. The cap
    applies, the budget does not (Craig, 16 Nov 2026). FPL's Team of the Week has no captain and
    ignores both.
  - It builds live, with a Not final tag until the week is final.
  - Reached from links on Points and Home.
  - Rift view or Card view, the shared remembered view (see [Pick Team and Transfers](#pick-team-and-transfers)). Your own players are marked
    (Craig, 15 Nov 2026).
- **Price changes** (Craig, 16 Nov 2026: back from Patch update, which all five QA testers read as
  LoL patch notes): the new prices for a
  gameweek, set once the deadline before it passes ("just shows the new prices, thats it really").
  Past moves only, no prediction.
  - Reached from links on Stats and Transfers. ‹ Week › arrows go back through past weeks
    (Craig, 16 Nov 2026).
  - Rises and falls side by side. A rise is Korean red, a fall blue, on every screen that shows
    a price move (Craig, 16 Nov 2026).
  - Each row: player, team and role, the price before and after, and owned. A dot marks your
    own players. Titled by the gameweek the prices are for ("Gameweek 4 prices"), with when they
    were set; no next move, no filters, no explainer lines (Craig, 15 Nov 2026). The picture is
    `docs/design/approved/price-changes/`.
  - Before the first move: "No moves yet", and no Set line (Craig, 17 Nov 2026).
  - In Rises and in Falls, the biggest move first, then the most owned (Craig, 17 Nov 2026).
  - Each week has its own address, as Points: `/price-changes/4` is Gameweek 4's prices, and
    bare `/price-changes` opens the latest (Craig, 17 Nov 2026).
- **Live**: in the beta. It embeds a stream beside the manager's live points. Its points panel
  waits on the live points spec ([spec/11](11-live-points.md)).
  - A picker chooses the stream. The list is admin data (name, language, platform, channel): the
    LCK's official broadcasts in each language, and co-streamers Craig approves, such as
    Caedrel.
  - The beta embeds Twitch and YouTube only. SOOP and CHZZK are later, once their embedding is
    checked.
  - It opens on the official English stream, then remembers each manager's last pick. Streams
    not live show greyed out.
  - A greyed stream can't be picked; only a live one can (Craig, 17 Nov 2026).
  - If the remembered pick isn't live when a series starts, the official English stream plays,
    and the pick is kept for next time (Craig, 17 Nov 2026).
  - Home's picker shows 5 streams, then More ▾ (Craig, 17 Nov 2026).
  - The points panel shows the week's total with Average and Highest, as Points (Craig, 14 Nov
    2026).
  - With nothing live, it shows the next series and a countdown.
  - If the live feed is down, the points panel says so; final points follow
    ([spec/11](11-live-points.md)).
  - Home embeds the stream while a series is live ([Home](#home)); it never redirects.
- **Following**: the feed, follows, requests and cheers and jeers received
  ([spec/14](14-following.md)).
- **Help**: the rules, as FPL's Rules page (Craig, 17 Nov 2026).
  - One page of sections, each a heading and a few short lines, with a contents list at the top:
    Squad, Transfers, Captain, Scoring, Buffs, Prices, Leagues, Ranks. Each section has its own
    link, such as `/help#prices`. No questions-and-answers section in the beta.
  - Scoring shows the full points table, every line for players and the coach with its points,
    read from the same data the scoring uses ([spec/05](05-scoring.md)).
  - Prices explains a price move in plain words with one example, not the formula
    ([spec/02](02-prices-and-budget.md)).
  - Ranks holds the tier cut-offs ([spec/08](08-leagues.md#overall-tiers)).
  - Reached from a Help link in every page's foot, beside Privacy and Terms, and in the team-name
    ▾ menu; links such as Price changes' How prices move › open its section. Not in the top bar.
- **Settings** ([below](#settings)).

## Home

Craig's yes in the Home design round, grilled 14 Nov 2026. Its layout is the approved picture
(`docs/design/approved/home/`).

- **A series live:** the stream, muted, with the Live page's picker and the manager's remembered
  pick. **Live ›** opens the Live page.
- **Nothing live:** the manager's 7 starters for the week as a broadcast lineup, with C;
  the next series on stream and when; **Pick Team ›**.
- **Star and flop** of the last gameweek, the same pair for every manager, each shown with its
  points and effective ownership.
  - Effective ownership: the share of managers starting a player, a Captain counting 1.5. Example:
    40% of managers start Faker and 20% of all managers make him Captain, so 50%.
  - It counts the team as it scored, as FPL sites do: an auto-sub and a Bench Boost bench count
    as starting, and anyone taking the ×1.5 counts 1.5, both Captains under Double Captain
    count 2 (Craig, 15 Nov 2026; ×2 from 17 Nov 2026).
  - Star: the most points × (1 − effective ownership). Example: Kiin, 15 points at 8%, beats
    Chovy, 18 at 45% (13.8 against 9.9).
  - Flop: the fewest points among the 10 highest by effective ownership. Example: Faker, 2 points
    at 62%.
  - The coach is in the running for both, as the 6th role (Craig, 15 Nov 2026). Example: Gen.G's
    coach, 12 points at 30%, scores 8.4 and beats a player's 8.0 for star.
  - Ties: a star tie goes to the lower effective ownership, a flop tie to the higher; everyone
    tied at 10th joins the flop's pool. Still tied, both are shown (Craig, 15 Nov 2026).

## Pick Team and Transfers

Grilled 14 Nov 2026.

- Pick Team has Rift view and Card view, Transfers Rift view and List view (FPL's Pitch View and
  List View). The first visit opens on Rift view; after that each manager's last choice is
  remembered (Craig, 16 Nov 2026, the view `/grill`):
  - Pick Team, Points and Perfect game share one choice: Card view picked on Points opens Pick
    Team and Perfect game on Card view too.
  - Transfers remembers its own. Its List view, FPL's list with prices and fixtures, is a different
    thing from Card view.
  - The choice is kept in the browser, so per device, and a guest's is kept too.
- On Pick Team, swaps, the Captain and buffs take effect only when the manager
  presses Save (Craig, 13 Nov 2026). Reset clears what isn't saved.
- On Transfers, a player the manager can't buy (over the budget, or his team is full) stays in
  the list, greyed, with why, and sorts last.
- Each player in a list shows ▲ or ▼ for his last price move (prices move weekly at the
  deadline, [spec/02](02-prices-and-budget.md)); his card shows the amount. Example: Faker
  ▲ ₩0.5m. Before a player's price first moves, nothing shows.
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
- **Buttons**, as FPL's, by where it opened: transfer in or out, Make Captain,
  substitute.
- **Compare**, in the beta: two players side by side, with header stats, form, scoring lines and
  next series.
  - A sheet over the card. The second player comes from a search, his role listed first. Any role
    with any role; a coach only with a coach (Craig, 16 Nov 2026).
  - The better number in each row is marked; there is no overall verdict. The next 3 series show,
    as on the player card.
  - Rows: Season with its rank, Form, Price, Owned, the last 3 and next 3 series, then each scoring
    line's total, per game and points. Only Season, Form and line points are marked. No buttons, a
    Change link on the second player, and no mark on a series where the two meet (Craig, 16 Nov
    2026). No transfers row: "get rid of the fluff lines".
  - The search lists every player of his role first, with no cap; typing narrows it, and Other
    roles › opens the rest. A bare /compare, with no player, goes to Stats (Craig, 17 Nov 2026).
  - The picture is `docs/design/approved/compare/`.

## Settings

Grilled 13 Nov 2026.

- Team name, changeable any time, as in FPL.
- The email address, from the Google or Discord account.
- The hangul banner text ([spec/13](13-korean-touches.md), once it merges).
- Favourite team and country: changeable until the manager's first gameweek starts, then shown
  "Locked since your first gameweek" ([spec/08](08-leagues.md)).
- Time zone: the browser's, or one the manager picks. Example: a 16:45 KST deadline shows as
  08:45 in London.
- Light, dark, or follow the device.
- Sign out, and delete the account and its data. A private league the manager made passes to
  its next member (Craig, 16 Nov 2026): the one who joined earliest; a league with no other
  member is deleted (Craig, 15 Nov 2026).
- Reached from the team name at the right of the top bar. Four tabs, Team, Display, Emails and
  Account ("maybe get differen tparts into tabs", Craig, 15 Nov 2026), saved with one Save
  button for every tab. The picture is `docs/design/approved/settings/`.
  The team name and the hangul banner are capped at 20 characters, as FPL's name is.
- Emails, both opt-in and off by default: a deadline reminder 24 hours before, and a weekly recap
  once the gameweek is final (points, rank moves in each league, best player, any jeer). No
  marketing. Off by default because Resend's free plan sends 100 emails a day.
- Your data, as GDPR asks ("settings need to include gdrp concersn etc", Craig, 15 Nov 2026,
  taking every recommendation):
  - Download my data: a JSON file at once, of the team, squads, transfers, leagues, follows and
    settings.
  - A line saying what is public: team name, favourite team, country, banner, points.
  - Delete erases at once; backups clear within 30 days, and the sheet says so. The sheet lists
    what goes and who each private league passes to.
  - Privacy and Terms links and a privacy contact email at the foot. Their text is
    [docs/legal/](../docs/legal/), plain pages with no picture (Craig, 15 Nov 2026).
  - No cookie banner: Flol keeps only essential cookies and browser storage (sign-in, the guest
    squad, remembered views and theme), with no analytics or ads.
  - The banner text is any text up to 20 characters, moderated like team names (spec/13); Latin
    letters are allowed, as in 바론 스틸 FC (Claude's call on Craig's "your call").
- With the banner empty, the Settings preview shows a greyed 배너 in the hangul's place; Profile
  shows just the team name (Craig, 17 Nov 2026).
- The save bar counts and names every unsaved change, across all tabs. Example: "2 changes:
  team name, theme" (Craig, 17 Nov 2026).
- Privacy and Terms are their own pages, `/privacy` and `/terms`, linked from Settings' foot and
  the sign-up tick (Craig, 17 Nov 2026).

## The coach card

The same as the player card, with the coach's lines in place of a player's. A Roster tab, the
team's players and prices, replaces Champions.

- This week before his team's first series lists the week's series with opponent and time,
  points as —, filling in as played, as the player card (Craig, 17 Nov 2026).
- History shows a series being played, tagged Live, with its points so far (Craig, 17 Nov 2026).

## Buffs

Buffs confirm as in FPL's Bench Boost: each can be cancelled until the deadline
([spec/06](06-buffs.md)).

## Words

From the words `/grill` of 16 Nov 2026, after the first QA panel
([#214](https://github.com/cBallGitWork/lck-fantasy/issues/214)) and a second panel asked for
suggestions.

- A word is explained by a hover: one short line, under about 8 words, shown on hover on desktop
  and on tap on the phone, the same look everywhere. Never a key, a legend or an explainer line
  (Craig, 16 Nov 2026).
- The hovers:

| Word | Where | Hover |
|---|---|---|
| Killer | Points, Your week | Top scorer you don't own |
| Flex | Pick Team and Points, the slot's label | Any role |
| Emerald I (any tier) | Home, Points, Leagues | Overall rank as a LoL tier |
| C | the Captain's badge, everywhere | Scores ×1.5 this week (×2 under Double Captain) |

- Killer and the buff names stay; the hover explains them (Craig, 16 Nov 2026). Captain replaced
  Carry, and Double Captain Dual Carry (Craig, 17 Nov 2026).

### The Broadcast voice

From the words grill of 18 Nov 2026.

- Every word a player reads is written in the Broadcast voice, by the `broadcast` writer
  (`.claude/agents/broadcast.md`), so Flol reads as if LCK fans wrote it.
- The only Korean word in English text is 화이팅 (fighting), for a cheer.
- The week is shown as Split 1 Week 3, or Week 3 where the split is clear; never Gameweek,
  Matchweek or GW.
- Game and series only: never set, map or match.
- Each screen's words move into its `words.ts` and are rewritten in the voice, one pull request a
  screen, in this order: Pick Team, Home, Transfers, Points, Leagues, then the rest. Four reader
  personas score each rewrite; it merges on green, and Craig reads a before and after page once a
  round of screens is done.
- Cheer and jeer lines and the buffs' descriptions are data Craig approves line by line: the
  writer drafts rewrites of them for Craig, never changes them itself.
