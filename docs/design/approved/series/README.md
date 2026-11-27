# Series

The Series page: one series, its games and each player's lines in each game (spec/12, Series page). It has its own link and opens from every series row anywhere: the LCK hub's Fixtures and Results, Points' series and the player card's series strip. **‹ LCK** goes back to the hub. It is part of the beta.

**Approved:** Craig, 16 Nov 2026, "Save". Along the way he asked for POG ("series seems basic"), cut the draft strip ("i dont think we need draft info overload") and cut the Your players total ("its fluff"); on 27 Nov he brought your points back as the You and Average line. The names, teams and numbers are a made-up LCK Cup Week 3 (Saturday 16 Jan), opened at the LCK hub's moment (Week 4, Tuesday). They match the Points, Live and hub pictures. This picture binds layout, content and order; [plate.md](../../plate.md) binds how it is drawn. The source is [docs/design/proposals/2026-11-16-series/](../../proposals/2026-11-16-series/) (`brief.md`, `panel.md`).

**Changed by Craig, 27 Nov 2026:** redrawn in the new look ([plate.md](../../plate.md)), each grid under a band with its team's crest, code and full name. The line under the scorebug ends with `You 22 · Average 14` ([spec/12](../../../../spec/12-pages.md), Series page): your points from the series beside the average manager's, rounded down. The scorebug shows crest, code and record only; a team's full name shows once, in its grid's band. The words beside Not final are gone.

**Redrawn again, Craig, 27 Nov 2026:** the first redraw read to him as a dull mess of text and squares with no League in it, and he asked for icons and for first blood and the rest to show, as FPL and UCL fantasy set a finished match's events under its score. So: the scorebug is the page's hero; each game has a card of its events; a game cell carries a mark for each scoring line; your players' rows are filled. He approved the direction the same day, asked which of 3/2/9 was which, and took the Hangul names off this page for the space; a second review round cleaned it up. He still found it short of colour, with a dull grey font and role icons too small, and took the Captain's C and ×1.5 off this page; the design team (a League player, a visual designer and a sceptic) then gave it its colour: a colour a mark, filled points, team colour on the scorebug, the game lines and the grids, and the deaths figure in red. Last, he had the marks under K/D/A removed and the events moved into each team's table. The four reviewers' findings are in `git log` for this folder, not a panel file.

| File | Shows |
|---|---|
| `1440.png`, `series.html` | Final, 2–0: T1 v DK |
| `1440-21.png`, `series.html?v=f21` | Final, 2–1: GEN v HLE. The dropped game is greyed; Zeka sat out G3 and a sub took his place |
| `1440-live.png`, `series.html?v=live` | Live: T1 1–0 DK, game 2 at 14:20 |
| `1440-next.png`, `series.html?v=next` | Before it starts: HLE v DK, Week 4 |

## Borrowed

- **Points' player drawer**: games as columns, the best 2 boxed and a dropped game greyed. The Series page is ten of these drawers at once.
- **Live's scorebug**: each team on a panel with its crest, the series score between them, turned over. Here it runs full width.
- **gol.gg and Inven**: one column per game.
- **FPL's and UCL fantasy's finished match** (looked at 27 Nov 2026): under the score, a row an event (goals, assists, saves, cards, bonus) with each team's names and a count, `Anderson (1)`; UCL leads with the Player of the Match. Here each team's events head its own table.

## Layout

- **Type**: 44 team codes and 48 the series score in the scorebug, 32 You, 28 each player's series total, 20 Average and a game line's title, 16 names and per-game points, 14 body and K/D/A, 12 labels and champions. The nav is shared.
- **Scorebug**, 112 tall: a 16px bar of the team's colour at each outer edge, team crest (72), code and record, and between them a 96px cell for each team's games won, the winner's turned over (white, dark figure). While it is live both cells follow the same rule, the leader's turned over. The loser's code drops to plain weight once the series is final; while it is live, neither does. A record is as of when the page is opened, so it is the record before the series while the series is live.
- **The line under it**: a Final tag, or Live and a dashed Not final tag. Then the format, competition, week, day and time (your local time), and Watch › while live or before the start. At the right, You and Average, once the series has started; You is the larger.
- **A line a game**, side by side under that line, its left edge the winner's colour: `Game 1`, the winner's crest and `T1 won`, then at the right a gold crown and the Player of the Game, the game's length and `VOD ↗`; a live game shows the Live tag and its clock.
- **Two grids**, one per team, side by side. The whole page below the scorebug is cut by team (Craig, 27 Nov 2026: the events were by game and the points by team):
  - under the game heads, the team's events over the series, a row a scoring line either team earned, in this order: First blood, Solo kills, Steals, Quadras, Pentas, Gold lead at 15, Deathless, First tower, Most drakes, Most barons, Most elders, Quick win. The line's mark sits on a 28px square of its own colour before its word; then who earned it, a name once with its count after it when over one, `Faker (2)`, as FPL; a coach line names its games, `Game 1 Game 2`. A line the other team alone earned shows a dash, so the two tables' players line up;
  - one row per player in role order, then the coach under a rule;
  - the name, with no Hangul (Craig, 27 Nov 2026), and a round dot after your own players, whose rows are filled (`--fill`) with a 4px white bar at the left; no Captain's C and no ×1.5 here (Craig, 27 Nov 2026), so a Series total is the player's own and You is the sum of yours;
  - a column per game, headed `Game 1` with W or L, or the Live tag, and under it a sword, a red skull and a green hand for kills, deaths and assists, as League's scoreboard heads them;
  - each game cell holds the champion, and K/D/A with the deaths figure in red; no marks under it, the events above saying who earned what (Craig, 27 Nov 2026: the marks meant nothing there). At the right, the points, the best 2 on a filled white square (red for a minus) and a dropped game greyed and bare. Rows are 60 tall, the role icon 28;
  - a gold crown sits over the points of each game's Player of the Game;
  - the Series column shows the best-2 total;
  - the coach's game cell shows his points alone, his lines being in the events above. The coach's series total adds W +3 or L −1 once the series is final.
- **A player who sat out a game**: a dash in that game. A sub has his own row, marked "· sub" beside his role.
- **Before it starts**: both rosters, 40px rows, coach last.

## Controls

- **‹ LCK**: back to the LCK hub.
- **VOD ↗**: that game's VOD on lolesports.
- **Watch ›**: opens Live.
- **A player or coach**: opens his card (the [player card](../player-card/), the [coach card](../coach-card/)).

## Not drawn

- Series POG, picks and bans, blue or red side, the last meeting, and team colours: each was cut by Craig on 16 Nov 2026.
- Champion portraits: [plate.md](../../plate.md) allows none of Riot's artwork, so a champion is his name. Craig has not been asked to change that.

## Marks

Drawn for Flol in `series.html`'s symbols, none of them Riot's; [plate.md](../../plate.md), A scoring line's mark, is the rule. Each has its own colour, named once in `series.html` (`--m-*`). Sword, red skull, green hand: kills, deaths, assists. Red drop: first blood. Two blades meeting: solo kill. Yellow bolt: steal. Gold star outline: quadra and penta, one mark for both. Gold coin with a rising arrow: gold lead at 15 minutes. Green skull struck through: deathless. Gold crown: Player of the Game. Blue tower, orange dragon's head, purple crowned eye, teal ringed dragon, green stopwatch: First tower, Most drakes, Most barons, Most elders, Quick win.

## Placeholders

| What | Issue |
|---|---|
| Series, games, players, champions, K/D/A and every line | #36 |
| Best 2 per series, coach lines, +3 and −1 | #30 |
| Live and provisional points | #34 |
| Final points, 3 hours after | #33 |
| POG per game, VOD links | spec/12; no issue yet (#36 may not fetch them) |
