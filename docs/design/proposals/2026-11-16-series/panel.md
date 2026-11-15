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

## Round 2 (16 Nov 2026)

- In: the 10 fixes above; POG on each game's K/D/A line and the series POG; the draft strip (blue then red, picks top to support, bans on one line); your players' series total; a 2–1 view (GEN 2–1 HLE).
- Craig on the 5 calls: "As recommended", so:
  - a VOD link per finished game, on the draft strip;
  - no last-meeting line;
  - the scorebug stays monochrome;
  - each game's side shows on the draft strip;
  - a live view drawn: T1 1–0 DK, G2 at 14:20, Live and Not final, Watch ›.
- The live view keeps Live's numbers (Faker G1 4, G2 1; Siwoo 2, 1; kkOma 2, 0). Live's sidebar shows Siwoo's G2 as 0/1/1, which can't score 1 by spec/05; the Series page uses 2/1/1.

## Round 3 (16 Nov 2026)

- Craig: "i dont think we need draft info overload". The draft strip is cut, and the VOD link moved to each game's header. The side per game went with the strip.
- A fresh panel of all four reviewers. Fixed:
  - POG stacks above the points box, so it is no longer clipped;
  - the coach reads "1st tower", "Quick win", and the series line reads "W +3" or "L −1";
  - "Solo kills, steals at final" shows on the live view;
  - ■ before Your players keys the mark;
  - kills no longer fall from live to final: Siwoo's G2 is 1/0/1 live with first blood and 1/2/3 at final, so his total is 4 and Your players is 22;
  - records are as of opening: T1 4–1 and DK 3–2 while live.
- Not taken: the PM's Aiming G1 (3/3/2 scores 0, correct as drawn); UX unboxing the live game (Points boxes it).

## Round 4 (16 Nov 2026)

Craig on the round 3 calls, "As recommended":
- Your players counts the Carry ×1.5, rounded down, as Points does; the Carry wears Points' C. T1 v DK reads 27, live 12.
- No series POG; POG stays per game.
- Team records and K/D/A in each cell stay; spec/12 needs both lines on save.
- No blue or red side.
- A sat-out player is drawn: Zeka misses G3 of GEN 2–1 HLE (a dash), and a made-up academy mid, Kael, has his own "Mid · sub" row.
