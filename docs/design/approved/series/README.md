# Series

The Series page: one series, its games and each player's lines in each game (spec/12, Series page). It has its own link and opens from every series row anywhere: the LCK hub's Fixtures and Results, Points' series and the player card's series strip. **‹ LCK** goes back to the hub. It is part of the beta.

**Approved:** Craig, 16 Nov 2026, "Save". Along the way he asked for POG ("series seems basic"), cut the draft strip ("i dont think we need draft info overload") and cut the Your players total ("its fluff"). The names, teams and numbers are a made-up LCK Cup Week 3 (Saturday 16 Jan), opened at the LCK hub's moment (Week 4, Tuesday). They match the Points, Live and hub pictures. There is no `plate.md` yet, so this picture binds layout, content and order, not colour or type. The source is [docs/design/proposals/2026-11-16-series/](../../proposals/2026-11-16-series/) (`brief.md`, `panel.md`).

| File | Shows |
|---|---|
| `1440.png`, `series.html` | Final, 2–0: T1 v DK |
| `1440-21.png`, `series.html?v=f21` | Final, 2–1: GEN v HLE. The dropped game is greyed; Zeka sat out G3 and a sub took his place |
| `1440-live.png`, `series.html?v=live` | Live: T1 1–0 DK, game 2 at 14:20 |
| `1440-next.png`, `series.html?v=next` | Before it starts: HLE v DK, Week 4 |

## Borrowed

- **Points' player drawer**: games as columns, the best 2 boxed and a dropped game greyed. The Series page is ten of these drawers at once.
- **Live's scorebug**: each team in a white box, the series score between them on black. Here it runs full width.
- **gol.gg and Inven**: one column per game, each with its winner and length.

## Layout

- **Type**: 28 team codes in the scorebug, 20 the series score and each player's series total, 14 body and per-game points, 12 labels. The nav is shared.
- **Scorebug**: team code and record, the score between. The loser greys once the series is final; while it is live, neither does. A record is as of when the page is opened, so it is the record before the series while the series is live.
- **The line under it**: a Final tag, or Live and a dashed Not final tag with "Solo kills, steals at final". Then the format, competition, week, day and time (yours, then KST), and Watch › while live or before the start.
- **Two grids**, one per team, side by side:
  - one row per player in role order, then the coach under a rule;
  - the name with its Hangul beside it, and ■ after your own players;
  - a column per game, headed with W or L, its length and VOD ›. A live game's header is ● and its clock;
  - each game cell holds the champion, K/D/A and the points, with the best 2 boxed and a dropped game greyed and unboxed;
  - POG sits over the points of each game's Player of the Game;
  - the Series column shows the best-2 total;
  - the coach cell shows the coach lines that scored (1st tower, Drakes, Baron, Elder, Quick win). The coach's series total adds W +3 or L −1 once the series is final.
- **A player who sat out a game**: a dash in that game. A sub has his own row, marked "· sub" beside his role.
- **Before it starts**: both rosters, 48px rows, coach last.

## Controls

- **‹ LCK**: back to the LCK hub.
- **VOD ›**: that game's VOD on lolesports.
- **Watch ›**: opens Live.
- **A player or coach**: opens his card (the [player card](../player-card/), the [coach card](../coach-card/)).

## Not drawn

- Series POG, picks and bans, blue or red side, the last meeting, team colours and a Your players total: each was cut by Craig in this round.
- Stats marks your players with a dot, but this page uses ■ because Points keeps ● for live. The two should agree at the plate.
- Live's sidebar shows Siwoo's game 2 as 0/1/1, which can't score his 1. This picture has 1/0/1 with first blood.

## Placeholders

| What | Issue |
|---|---|
| Series, games, players, champions, K/D/A and every line | #36 |
| Best 2 per series, coach lines, +3 and −1 | #30 |
| Live and provisional points | #34 |
| Final points, 3 hours after | #33 |
| POG per game, VOD links | spec/12; no issue yet (#36 may not fetch them) |
