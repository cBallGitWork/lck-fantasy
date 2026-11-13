# Points

The gameweek Points page, at 1440. A manager reaches it from **Points** in the top bar; another manager's week opens from a league table.

**Approved:** Craig, 13 Nov 2026: "Seems ok as a start?", on this picture, after he called the slimmed version "terrible" and said "Riff on the left, Bench underneath, Widget/info on right". A start: details are still open (below).

No `plate.md` yet: the look is set at the reskin round, so this binds layout, content and order, never colour or type.

## Borrowed

- **FPL's desktop Points page**: the header row (average, highest, the big total box, week rank, transfers), the bench strip under the squad, the Out/In auto-sub table, a click on a player opening his breakdown. Research: `docs/research/points-page-references.md`.
- **Summoner's Rift**: the squad stands on the map, with LoL's position icons and team shirts (Craig, 13 Nov 2026).

## Layout

- **Header:** team name and its hangul; ‹ week ›; average · highest · **total** (provisional while a series is live or not final) · week rank (as of the last final series) · transfers; one line naming the live and provisional series.
- **Left:** the Rift, each starter in his lane: shirt, role icon, name, points, each series' points; C and V marks; Flex and Coach labelled; a live dot.
- **Under the Rift:** the bench, then the Automatic subs table (Out / In), provisional until the series is final.
- **Right:** the tapped player's games, then the hangul banner and manager name, Ranks, the week's series, the sponsor slot.

## Controls

- A starter or bench tile: opens his games at the top of the right column. One open at a time; ✕ closes it.
- The player panel: each series, each game with champion and W/L; the best 2 games of a series are boxed; Carry ×1.5 shown on the total; "Full stats ›" opens the stat lines.
- ‹ ›: previous and next week; no next arrow past the current week.
- Highest ›: the top team's week. Transfers ›: the week's transfers. All leagues ›: Leagues.

## Placeholders

| What | Issue |
|---|---|
| Series, games and player stats | #36 |
| Live points | #34 |
| Final points and ranks moving | #33 |
| Game and series scoring | #30 |
| Carry ×1.5 | #19 |
| Auto-subs | #14 |
| Leagues and ranks | #38 |
| Hangul banner, sponsor slots, birthday cake | spec/13, no issue yet |

## Still open

From the four-reviewer panel and the skeptic round (LoL fan, FPL manager, UX designer, behaviour expert):
- Rank arrow colour: green up (FPL) or red up (Korean). Decided at the reskin.
- A Pitch/List switch, as FPL has.
- A "still to play" line under the total.
- Where the protest truck (spec/13) sits when someone else opens this page.
- Fun ideas to grill: the 확정/잠정 seal, the multikill banner, a kill feed on the Live page. The A–D post-game grade was dropped.
