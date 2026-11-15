# Series page: panel round 1 (16 Nov 2026)

These are the FPL player's, the LCK fan's and UX's findings on `s-final.png` and `s-next.png`. The PM's review was still running when this was written. Three fixes are already in: the team record is cut from the grid headings, the coach's lines are shorter, and Watch › sits beside the time.

## To fix next

1. **G1 kills ≠ deaths.** T1's kills total 16, but DK's deaths total 15. Make BeryL's Braum 0/5/5 (it still scores 0).
2. **The scorebug.** It is about 700 wide in a 1376 column. Make it full width, as Live's is.
3. **"T1 · 5–1"** repeats the team name inside the box. Show "5–1" alone.
4. **The Korean name** sits under the name on Final and beside it on Next. Put it beside on both.
5. **Points per game and the series total** are both 20 bold. Make per-game points 14 bold and keep 20 for the total only.
6. **The best 2 are not visible**, because a 2–0 counts both games. Add a 2–1 view, for example GEN 2–1 HLE from Week 3, with the dropped game unboxed as on Points.
7. **The coach cell** repeats Win and Loss, which the game header already shows. Cut them, and write "+3" or "−1" in the total cell without the word "series".
8. **The "–" dash** is in --soft, which fails contrast. Use --mid.
9. **The Next view** has 60px rows that are mostly empty. Use 48px rows, or one merged table with the role in the middle.
10. **The dot for your players.** Points uses ● for live, so this dot clashes with it. Use a different mark for your players, for example a small square.

## Craig's calls

- A VOD link per game on a final series, to lolesports: yes, or no?
- Before a series: add one line on the last meeting ("last met: T1 2–1, Week 1"), or nothing?
- Team colours: a thin team-colour edge on the scorebug, or stay monochrome?
- Show each team's side (blue or red) per game: yes, or no?
- A live view at game 2, 14:20, matching Points: draw it?

## The PM's review (in after the rest)

- Every number checks out against spec/05, Points and the hub.
- The PM asks for the live view too (see the calls), and confirms fix 6 is needed.
- Further calls for Craig:
  - Team records beside the names: keep or drop? They have no spec line.
  - K/D/A in each game cell: keep, or champion and points only, as spec/12 says literally?
  - The dot on your players needs a spec line if it stays.

## Craig, 16 Nov 2026

- "series seems basic". Offered a POG badge, a picks-and-bans strip, kill score and gold, team colours, and "your points from this series"; Claude recommended 1, 2 and 5. Craig: "ok".
- Next round adds:
  - **POG**: a Player of the Game badge on each game's POG cell, plus the series POG;
  - **Draft strip**: one row per game, picks and bans with the blue and red side;
  - **Your points**: one line at the top, the sum of your players in this series (e.g. "Your players: 21").
- These need spec/12 lines on save. They widen the earlier "winner, length and champions only".
