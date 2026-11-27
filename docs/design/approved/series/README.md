# Series

The Series page: one series, its games, its events and each player's lines in each game (spec/12, Series page). It has its own link and opens from every series row anywhere: the LCK hub's Fixtures and Results, Points' series and the player card's series strip. **‹ LCK** goes back to the hub. It is part of the beta.

**Approved:** Craig, 27 Nov 2026, "Yes, save it". The page was redrawn from scratch that day, after three redraws read to him as text and grey squares with no League in it. He asked for one idea, the design team first, and sent FPL's finished-match page: "two tab system needed id imagine". Four designers (a League player, a visual designer, an FPL player and an LCK fan) each came back with the same idea, the broadcast's lineup strip: both teams facing each other across a centre spine. Along the way he moved each name beside its series total ("i dont like on player stats where the player name is so far away from their total week score") and centred each event, its name under its mark. Which tab opens first and how a coach's lines read he left to Claude.

The names, teams and numbers are a made-up LCK Cup Week 3 (Saturday 16 Jan), opened at the LCK hub's moment (Week 4, Tuesday). They match the Points, Live and hub pictures. This picture binds layout, content and order; [plate.md](../../plate.md) binds how it is drawn. The first approval was 16 Nov 2026 ([proposals/2026-11-16-series/](../../proposals/2026-11-16-series/)); the reviewers' findings for this round are in the PR.

| File | Shows |
|---|---|
| `1440.png`, `series.html` | Final, 2–0: T1 v DK, the Events tab |
| `1440-stats.png`, `series.html?t=players` | The same series, the Player stats tab |
| `1440-21.png`, `series.html?v=f21&t=players` | Final, 2–1: GEN v HLE. The dropped game is greyed; Zeka sat out game 3 and a sub took his place |
| `1440-live.png`, `series.html?v=live&t=players` | Live: T1 1–0 DK, game 2 at 14:20 |
| `1440-next.png`, `series.html?v=next` | Before it starts: HLE v DK, Week 4 |

## Borrowed

- **FPL's finished match**: the score, then two tabs, Match details and Player stats; under Match details a block an event, its name centred and each team's names either side with a count, `Anderson (1)`.
- **The broadcast's lineups strip** ([references/broadcast/](../../references/broadcast/)): five role rows, the two teams mirrored about a centre column.
- **Live's scorebug**: each team on a panel with its crest, the series score between them, turned over.
- **Points' player drawer**: the best 2 games filled, a dropped game greyed.

## Layout

- **Scorebug**, 112 tall: a 16px bar of the team's colour at each outer edge, the crest (72), code and record, and between them a 96px cell for each team's games won, the winner's turned over. While it is live the leader's is turned over. The loser's code drops to plain weight once the series is final. A record is as of when the page is opened.
- **The line under it**: a Final tag, or Live and a dashed Not final tag; the format, competition, week, day and time (yours); Watch › while live or before the start. At the right, You and Average, once the series has started.
- **A line a game**, side by side, its left edge the winner's colour: `Game 1`, the winner's crest and `T1 won`, then a gold crown and the Player of the Game, the length and `VOD ↗`; a live game shows the Live tag and its clock.
- **Tabs**, centred over the spine: `Events`, which opens first, and `Player stats`. None before the series starts.
- **The board**, one panel for both teams: a `--head-band` head with each team's crest, colour bar, code and name at its own end, a 4px rule of its colour under it.
- **Events**: a row an event somebody earned, in this order: First blood, Solo kills, Steals, Quadras, Pentas, Gold lead at 15, Deathless, then under a rule the coach's lines: First tower, Most drakes, Most barons, Most elders, Quick win. The centre cell, 192 wide on `--band`, holds the event's mark on a 32px square of its colour with its name under it. Each team's names face it, a count after a name when over one, `Faker (2)`; a coach's line names him and its games, `kkOma Game 1 Game 2`. A side that didn't earn it shows a dash. While live, Solo kills and Steals wait for the final.
- **Player stats**: a row a role, 72 tall, its icon at 40 over its word in the 96px spine; the coach last, under a rule.
  - Each side, from the spine outwards: the series total (28) on a filled `--head-band` column, a minus on `--down` (Craig, 27 Nov 2026: make it stand out more), the name, then a cell a game, headed `Game 1` with W or L, or the Live tag.
  - A game cell holds the champion and the points on one line, and under it kills, deaths and assists, each figure behind its own mark: a sword in `--text`, a red skull, a green hand. The best 2 games' points sit on a filled white square (red for a minus); a dropped game is greyed and bare. A gold crown sits before the points of the Player of the Game.
  - The coach's cell holds his points and the marks of the lines he scored; his total adds `W +3` or `L −1` once the series is final.
  - Your own players carry the round dot after the name, on a filled (`--fill`) half-row with a 4px white bar at its outer edge. No Captain's C and no ×1.5 here, so You is the sum of yours on the page.
- **A player who sat out a game**: a dash in that game. A sub has his own row under the player he replaced, marked `Sub`; the player facing them stands as tall as both.
- **Before it starts**: both rosters facing each other across the spine, coach last.

## Controls

- **‹ LCK**: back to the LCK hub.
- **Events, Player stats**: the two tabs.
- **VOD ↗**: that game's VOD on lolesports.
- **Watch ›**: opens Live.
- **A player or coach**: opens his card (the [player card](../player-card/), the [coach card](../coach-card/)).

## Not drawn

- Series POG, picks and bans, blue or red side and the last meeting: each was cut by Craig on 16 Nov 2026.
- Champion portraits: [plate.md](../../plate.md) allows none of Riot's artwork, so a champion is his name.

## Open

- The role icons, the same on Live, Stats and Transfers, look close to Riot's own position icons at 40px, and Top and Bot are hard to tell apart (the reviewers, 27 Nov 2026). Left as they are here; a redraw of the set would be for every page at once.
- The 2–1's made-up data plays a champion twice in the series (Xin Zhao, K'Sante, Azir). It matches the Points picture, so both change together or not at all.

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
