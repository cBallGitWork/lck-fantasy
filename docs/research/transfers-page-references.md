# Transfers / market screen: how other games do it

Research for Flol's transfers wireframe, 13 Nov 2026. [S] = sourced (URL given), [R] = from memory of the
live product, not re-checked this session, [I] = my inference. Few vendors publish UI teardowns, so screen
detail is thinner than rule detail; treat [R] items as things to eyeball before copying.

## FPL (the model)

- Flow: remove a player with the X on his pitch card, pick a replacement in the "Player Selection" column,
  then "Make Transfers", then "Confirm". [S] https://www.premierleague.com/news/2174907
- Same position only; must fit the budget; a fourth player from one club is refused. [S] same URL
- Prices on the Transfers page are *selling* prices; a List view shows current, selling and purchase price
  (CP/SP/PP). [S] same URL and https://www.premierleague.com/en/news/2858775
- Free transfers bank to 5, −4 each extra. [S] https://onefpl.com/blog/fpl-2026-27-changes
- Desktop list sits in a sidebar beside the pitch, with View (all / position / club / watchlist), "Sorted by"
  (default total points) and a Max cost dropdown; clicking the removed slot narrows the list to that position.
  [R] (default stat "Total points" is [S] https://www.premierleague.com/news/2174907)
- Top strip shows free transfers, cost in points and money remaining, updating live as you swap. [R]; a
  third-party planner copies it as "Transfers 0 / 2, Cost 0 pts, Bank 7.4" and warns "Too many selected from"
  a club. [S] https://fpl.team/plan/
- No published source on whether unaffordable players are greyed or hidden. [R] they stay listed; the block
  comes when you pick. [I] Flol's "greyed with a reason" is clearer than FPL here.
- Confirm modal lists outs and ins, the points cost, and offers the chip; a confirmed transfer can't be undone.
  [S] https://onefpl.com/blog/can-you-undo-fpl-transfer ; modal contents [R]
- Wildcard on desktop: a chip button on the Transfers page opens a pop-up, "Play Chip". On the app: make
  transfers, Next, tap "Wildcard Available" to make it "Wildcard Active", Confirm.
  [S] https://www.fantasyfootballhub.co.uk/articles/what-is-the-fantasy-premier-league-wildcard-and-when-to-use-it
- Wildcard stays "Pending" (cancellable) until a second transfer is confirmed; Free Hit can't be cancelled
  once its transfers are confirmed. [S] https://onefpl.com/blog/can-you-undo-fpl-transfer

### FPL 2026/27 changes that touch this screen
- Pitch and List views on Transfers can be switched to show fixture difficulty, ownership (with rising/falling),
  next opponent, form, or price-change progress, without leaving the page.
  [S] https://onefpl.com/blog/fpl-2026-27-changes , https://www.fantasyfootballscout.co.uk/2026/07/21/fpl-2026-27-new-ways-to-view-your-fpl-squad
- Official Price Change Predictor: % progress to a rise/fall, labels like "Likely to Drop" in green/red, sortable,
  filter by your team or watchlist. [S] https://www.premierleague.com/en/news/4680462/whats-new-in-202627-fantasy-price-change-predictor
- Auto Pick now skips players unlikely to start; a short quiz builds a first squad. [S] https://onefpl.com/blog/fpl-2026-27-changes
- Two sets of chips (one per half). [S] same URL

## UCL Fantasy
- 2 free transfers a matchday, −4 each extra, from the overall score. [S] https://www.fantasyfootballscout.co.uk/2026/08/31/how-to-play-uefa-champions-league-fantasy-2026-27-rules-scoring-chips
- Playing Wildcard or Limitless *cancels transfers already made that matchday and their deductions*; Limitless
  lifts the budget for one matchday then reverts. [S] same URL
- [I] Lesson: chip choice should come before or wipe the draft, never silently stack with paid hits.

## F1 Fantasy
- Wildcard = unlimited free transfers inside the cap; Limitless = unlimited transfers, no cap, team reverts
  after the weekend; one chip per race. [S] https://www.motorsportmagazine.com/articles/single-seaters/f1/f1-fantasy-chips-what-they-are-and-when-to-use-them/ , https://fanamp.com/f1-news/limitless-chip-explained
- Limitless example: a $180.1M team under a $109M cap. [S] https://fanamp.com/f1-news/limitless-chip-explained
  [I] So under Limitless the budget figure should switch to "no cap", not show a huge negative bank.
- 2026: transfers are *netted* — try a swap and swap back, only the final change counts.
  [S] https://www.motorsport.com/f1/news/f1-fantasy-2026-prizes-and-changes-coming-to-this-season-explained/10800060/
- 2025: price moves were predictable (above/below average score over last 3 races). [S] https://www.fanamp.com/f1-news/f1-fantasy-2025-key-rule-changes-you-need-to-know

## Esports
- LTA Fantasy (Riot, 2025): 50-coin budget, values move weekly, Market opens/closes on a set clock, roster locks
  before matches. [S] https://lolesports.com/en-US/news/lta-fantasy-is-here
- Split 3 added a "Sell All Players" button in the Market and a reworked player view; a team-variety bonus
  (+5% to +20%) replaced stacking. [S] https://lolesports.com/en-US/news/lta-fantasy---split-3-whats-new
- HLTV Fantasy (CS2): $1M for five, max two per team; boosters show their past hit rate in the UI.
  [S] https://pley.gg/cs2/hltv-fantasy-season-kicks-off-with-blast-bounty-finals/ , https://community.skin.club/en/news/how-to-win-hltv-fantasy-league-with-james-banks
- DraftKings LoL: $50,000 cap, CPT slot scores 1.5x, Team slot. [S] https://www.rotowire.com/esports/article/dfs-101-how-to-play-league-of-legends-on-draftkings-50118
  Builder shows remaining salary and average per open slot. [R]
- Old Fantasy LCS: league draft, players lock when their region's games start. [S] https://nexus.leagueoflegends.com/en-us/2018/06/fantasy-lcs-is-live/
  No transfer-screen detail found.

## Other
- Sleeper: add/drop from the player card; a full roster forces you to pick who drops; card shows ownership
  across your leagues. [S] https://support.sleeper.com/en/articles/4007347-how-to-add-or-drop-players ,
  https://support.sleeper.com/en/articles/6365463-how-to-view-cross-league-ownership
- Sorare: marketplace filter lets you set your budget to see only cards in range.
  [S] https://sorare.com/help/a/21771177173533/-
- Kicker, AFL Fantasy, ESPN: no usable UI source found this session.

## Ideas worth borrowing (ranked)
1. Click a squad slot to filter the list to that role and to what you can afford (FPL [R]; Sorare budget filter [S]).
2. Net transfers: swap out and back costs nothing (F1 2026 [S]); with a Reset button (FPL [R]).
3. Switchable map overlay: next series, ownership, form, price trend (FPL 2026/27 [S]).
4. Price-change arrow or % on each row (FPL predictor [S]; F1 predictable prices [S]).
5. Chip as a toggle in the strip that turns cost to 0 / bank to "no cap" live, and wipes paid hits like UCL [S].
6. Remaining bank *and* average per empty slot during Remake (DraftKings [R]).
7. "Sell all" for Remake/Limitless (LTA Fantasy [S]).
8. Watchlist as a list view (FPL [S]).

## Where our wireframe differs from the pattern
- Selling vs buying price: FPL shows selling price on the squad; we should say which ours is. [S]
- Chip placement: FPL/UCL let chips be picked at confirm; if Remake is chosen after paid swaps, the sheet
  must show the hit vanishing. [I]
- Greyed-but-visible is better than FPL's late refusal; keep it, but sort greyed rows last. [I]
