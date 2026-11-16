# Points: a player's breakdown (sheet)

**Screen:** Points (docs/design/approved/points/). A tap on a starter's tile (Rift view) or card (Card view), or a bench tile, opens a sheet over the dimmed page with that player's points for the week. It replaces the games panel at the top of the side column (Craig, 16 Nov 2026: tapping a player "didn't do anything, should show that gameweek's points breakdown like FPL"; the panel opened off-screen). ✕ or Esc closes.

**Jobs**
- See why a player scored what he did this week, game by game (FPL's points breakdown; Points README, Controls: "A player: opens his games").
- See which games counted: a series scores its best 2 games (spec/05, How it works).
- Open a series' page (Points README: each series opens its Series page) and his card (Full stats ›).

**Data, each with its spec line**
- Name, team, role; C or V (spec/04). Portrait slot holds the team crest until photos exist (approved/shirts README, placement rules).
- His week's points; the Carry shows only his result, never the ×1.5 working (Points README, Changed by Craig 16 Nov). Not final / Live tags (plate, Tag).
- Each series: opponent, result, series points (best 2 games, spec/05).
- Each game: champion, W/L or Live with the game clock; each scoring line from spec/05's player table with its value and points, only lines that apply; the game's points; counted games boxed, the dropped game dimmed.
- Average Carry (existing panel).
- Placeholders: stats and lines (#36), live points (#34), final points (#33), scoring (#30).

**Made-up data (Points' moment, Saturday, T1 v DK game 2 live):** Faker, Carry. v HLE W 2–1: Azir 6/1/9 = 5, Taliyah 2/4/5 = 2 (dropped), Galio 4/0/14 = 7 → 12. v DK 1–0: Orianna 5/2/8 = 4, Sylas live 1/0/2 at 14:20 = 1 → 5. 17 × 1.5 = 25.

**Coach (Craig, 16 Nov 2026: "yes coach version"):** the same sheet with spec/05's coach lines (first tower, most drakes, most barons, most elders, quick win; a line that scored in no game is left out), each counted game boxed, then `Series won +3` or `Series lost −1` once a series is over. No C, no Average Carry. kkOma: v HLE 2 + 3 + 3 = 8, v DK live 2 + 0 = 2, 10 in all (coach.png).
**Rows:** 32px in a sheet (Claude's call, Craig: "your call"). **×1.5:** hidden (Craig). **C:** 32px (Craig: "make C bigger").
