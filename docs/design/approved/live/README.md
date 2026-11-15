# Live

The Live page: a stream beside the manager's live points (spec/12, Live). It is reached from **Live** in the top bar, whose dot shows while a series is live, and from **Live ›** on Home's stream. It is part of the beta.

**Approved:** Craig, 14 Nov 2026, "save". He asked for "live first", and to keep Average and Highest beside the total ("Keep them"). The names, teams and numbers are a made-up LCK Cup at the moment of the Points picture: Week 3 Saturday, T1 v DK game 2 live, Baron Steal FC on 94. Every player's points match Points; the idle shot's finished T1 2–0 DK matches the Series page. There is no `plate.md` yet, so this binds layout, content and order, not colour or type. The source is [docs/design/proposals/2026-11-14-live/](../../proposals/2026-11-14-live/) (`live.html`, `brief.md`).

| File | Shows |
|---|---|
| `1440.png`, `live.html` | A series live: T1 1–0 DK, game 2 |
| `1440-idle.png`, `live.html?v=idle` | Nothing live: Sunday morning, the next series and a countdown |
| `1440-down.png`, `live.html?v=down` | The live feed down, at the same moment as the live shot |

## Borrowed

- **Twitch theatre mode**: the video is wide, with a column beside it where chat would be. Flol puts your points there.
- **The LCK broadcast's scorebug**: each team in a white box with the series score between them on black, then the game and the format.
- **FPL's Points**: your total with Average and Highest, then each player's week points.

## Layout

- **Type**: plate.md's sizes: 44 the total and the countdown, 28 the next series, 20 every points figure and the score, 14 body, 12 labels and the C and V marks, 11 tags. The nav, its live dot included, is shared.
- **Stage** (dark, the main column only; the rest of the page is the usual ground): the stream at 984 × 554 (16:9, beside the 360 right column), the scorebug under it, then the picker.
- **Picker**: one chip per stream, showing name, language and platform. The one you're watching is filled; streams that are not live are dashed and greyed. **More ▾** opens the full list, with each stream's channel.
- **Points panel**, no captions:
  - your week, with a Not final tag, Average and Highest;
  - your players in the live series, each with his role icon, his week points (the Carry ×1.5 included) and this series' games beneath, the live game tagged Live;
  - then the rest of your week, and **Points ›**.
- **Nothing live**: the stage shows the next series, its time (yours and KST) and a countdown. The scorebug shows the last series as final, and every chip is greyed.
- **Feed down**: a black bar at the top of the panel, "Live points down · Final points follow". The live series' games show dashes, and the total leaves them out.

## Controls

- **A stream chip**: switches the stream. The pick is remembered for next time (spec/12).
- **More ▾**: the full streams list.
- **Points ›**: opens Points.
- **A player**: opens his card (the [player card](../player-card/)).

## Placeholders

| What | Issue |
|---|---|
| Live points | #34 |
| Final points, Average and Highest | #33 |
| Series, games, scorebug | #36 |
| The streams list | spec/12; admin data, no issue yet |
| The stream embed | no issue yet; Twitch and YouTube only in the beta |
| Solo kills and steals at final (Points marks them, this page doesn't yet) | #34 |
