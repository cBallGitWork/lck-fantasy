# Series

The Series page: one series, its games and each player's lines in each game (spec/12, Series page). It has its own link and opens from every series row anywhere: the LCK hub's Fixtures and Results, Points' series and the player card's series strip. **‹ LCK** goes back to the hub. It is part of the beta.

**Approved:** Craig, 16 Nov 2026, "Save". Along the way he asked for POG ("series seems basic"), cut the draft strip ("i dont think we need draft info overload") and cut the Your players total ("its fluff"); on 27 Nov he brought your points back as the You and Average line. The names, teams and numbers are a made-up LCK Cup Week 3 (Saturday 16 Jan), opened at the LCK hub's moment (Week 4, Tuesday). They match the Points, Live and hub pictures. This picture binds layout, content and order; [plate.md](../../plate.md) binds how it is drawn. The source is [docs/design/proposals/2026-11-16-series/](../../proposals/2026-11-16-series/) (`brief.md`, `panel.md`).

**Changed by Craig, 16 Nov 2026:** the page says each thing once. Each grid is headed by its team's code (the scorebug names the teams); each game's length, VOD and live clock show once, in the left grid's heads, with W or L still on both; no Live tag in the G2 heads (the meta line says it).

**Changed by Craig, 27 Nov 2026:** redrawn in the new look ([plate.md](../../plate.md)), each grid under a band with its team's crest, code and full name. The line under the scorebug ends with `You 27 · Average 14` ([spec/12](../../../../spec/12-pages.md), Series page): your points from the series beside the average manager's, rounded down. Your Captain carries his C, and his Series cell shows the total after ×1.5 with the sum under it (`15`, `10 ×1.5`), so You adds up from the page. The scorebug shows crest, code and record only; a team's full name shows once, in its grid's band. The words beside Not final are gone.

**Redrawn again, Craig, 27 Nov 2026:** the first redraw read to him as a dull mess of text and squares with no League in it, and he asked for icons and for first blood and the rest to show, as FPL and UCL fantasy set a finished match's events under its score. So: the scorebug is the page's hero; each game has a card of its events; a game cell carries a mark for each scoring line; your players' rows are filled. He approved the direction the same day. The four reviewers' findings are in `git log` for this folder, not a panel file.

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
- **FPL's and UCL fantasy's finished match** (looked at 27 Nov 2026): under the score, a row an event (goals, assists, saves, cards, bonus), the event's mark in the middle and each team's names on its own side; UCL leads with the Player of the Match.

## Layout

- **Type**: 44 team codes and 48 the series score in the scorebug, 32 You, 20 Average, a game card's title and each player's series total, 14 body, K/D/A and per-game points, 12 labels and champions. The nav is shared.
- **Scorebug**, 112 tall: team crest (72), code and record, the score between. The loser's code drops to plain weight once the series is final; while it is live, neither does. A record is as of when the page is opened, so it is the record before the series while the series is live.
- **The line under it**: a Final tag, or Live and a dashed Not final tag. Then the format, competition, week, day and time (your local time), and Watch › while live or before the start. At the right, You and Average, once the series has started; You is the larger.
- **A card a game**, side by side under that line: `Game 1`, the winner's crest and `T1 won`, then its length and VOD ›; a live game shows the Live tag and its clock. Under the head, a row for each event that happened, in this order: Player of the Game, First blood, Solo kills, Steals, Quadra, Penta, then the coach lines 1st tower, Drakes, Baron, Elder, Quick win. The event's mark and word sit in the middle, the left team's names to its left and the right team's to its right. A player carries his C and your dot; a count over one reads `×2`; a coach line names the team by its bar and code. An event nobody got has no row.
- **Two grids**, one per team, side by side:
  - one row per player in role order, then the coach under a rule;
  - the name with its Hangul beside it, and a round dot after your own players, whose rows are filled (`--fill`);
  - a column per game, headed `Game 1` with W or L, or the Live tag;
  - each game cell holds the champion (12, `--mid`), K/D/A after a sword, then a mark for each line that scored beyond them: first blood, a solo kill (one a kill), a steal, a quadra or penta, the gold lead at 15, a deathless game. At the right, the points, with the best 2 boxed and a dropped game greyed and unboxed. Rows are 68 tall;
  - a gold crown sits over the points of each game's Player of the Game;
  - the Series column shows the best-2 total;
  - the coach cell shows a mark for each coach line that scored (1st tower, Drakes, Baron, Elder, Quick win). The coach's series total adds W +3 or L −1 once the series is final.
- **A player who sat out a game**: a dash in that game. A sub has his own row, marked "· sub" beside his role.
- **Before it starts**: both rosters, 48px rows, coach last.

## Controls

- **‹ LCK**: back to the LCK hub.
- **VOD ›**: that game's VOD on lolesports.
- **Watch ›**: opens Live.
- **A player or coach**: opens his card (the [player card](../player-card/), the [coach card](../coach-card/)).

## Not drawn

- Series POG, picks and bans, blue or red side, the last meeting, and team colours: each was cut by Craig on 16 Nov 2026.
- Champion portraits: [plate.md](../../plate.md) allows none of Riot's artwork, so a champion is his name. Craig has not been asked to change that.

## Marks

Drawn for Flol in `series.html`'s symbols, none of them Riot's; [plate.md](../../plate.md), A scoring line's mark, is the rule. Sword: K/D/A. Drop: first blood. Two arrows meeting: solo kill. Bolt: steal. Star outline: quadra or penta. Coin: gold lead at 15. Shield: deathless. Gold crown: Player of the Game. Tower, flame, horned head, ringed flame, stopwatch: 1st tower, Drakes, Baron, Elder, Quick win.

## Placeholders

| What | Issue |
|---|---|
| Series, games, players, champions, K/D/A and every line | #36 |
| Best 2 per series, coach lines, +3 and −1 | #30 |
| Live and provisional points | #34 |
| Final points, 3 hours after | #33 |
| POG per game, VOD links | spec/12; no issue yet (#36 may not fetch them) |
