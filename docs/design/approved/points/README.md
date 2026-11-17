# Points

Your gameweek. Reached from **Points** in the top bar. Drawn at 1440 in the shared frame.

**Approved:** Craig, 14 Nov 2026. A start was approved on 13 Nov ("Seems ok as a start?", after "Riff on the left, Bench underneath, Widget/info on right"; PR #47, never merged). On 14 Nov it was brought up to the spec with fresh eyes and less explaining text, Craig picked what stays, and said "File and merge". Names, teams and numbers are a made-up LCK Cup Week 3, not roster data. Redrawn to [plate.md](../../plate.md) on 15 Nov 2026; this binds layout, content and order, and plate.md how it is drawn. The source is [docs/design/proposals/2026-11-14-points/](../../proposals/2026-11-14-points/) (`points.html`, `brief.md`).

| File | Shows |
|---|---|
| `1440.png`, `points.html` | Saturday, T1 v DK live: your team on the Rift, the bench bar, Faker's games open in the side column, which is gone: the sheet, below, replaces it, and the picture isn't redrawn, your week, leagues, the week's series |
| `breakdown.png`, `breakdown.html` | A tapped player's breakdown sheet: Faker, the Carry, two series |
| `breakdown-coach.png`, `breakdown-coach.html` | The same sheet for the coach: kkOma |
| `breakdown-brief.md`, `bg.png` | The sheet's brief; the page behind it |

## Changed by Craig, 16 Nov 2026

After using the built page; these override the picture.

- The Carry shows only his result (`25`), never the working (`17×1.5`, `12 + 5 = 17 × 1.5`), on his tile, his card and his games. Perfect game follows.
- No auto-sub line (`Subbed in for Bdd`) on a tile or a card.
- The bottom row tidied: Coach stands under Top and Flex under Jungle, and Support and Bot stand a little higher, so the four shirts sit on one line. Perfect game shares the places. Replaced later that day by the square Rift's places, below.
- Each series in a player's games opens its Series page.
- Your week moves below Leagues and the week's series, above the sponsor.
- A series in a player's games is its opponent alone: `v DK`, no day.
- The Rift is square (later that day), 720 a side, centred in the main column, and the map redrawn for it: lanes, river, bases, towers and pits (`measure.rift`).
- Each starter in his place: top in top lane, jungle in the jungle, mid in mid lane, Bot over Support (Craig, 16 Nov 2026) together in bot lane, Coach and Flex by the blue base.
- Tiles as FPL's: the shirt on a faint lighter card, C or V at its top right and a news flag `!` at its top left, a white name plate, then a dark band (fixtures, or points and series). No role icon on a tile: his place on the Rift says it; the Flex's and Coach's place is a label over the shirt (`FLEX`, `Coach 감독`), and nothing goes under a Flex's tile: no `Flex · plays Top`, no `Not starting` tag (his flag `!` stays at the shirt's corner, the words in his card). No team crests on the tiles. The points sit in the dark band, the series under them. Pick Team and Perfect game share the places.
- The bench shows the Rift's own tiles (shirt on its card, name plate, points band, `Didn't play` under a dash), each under its order and role, `1. Mid`, as FPL's bench and its `1. DEF`.
- Live said once per place: on the head's live bar, the open game's row and the week's series (a shared list, kept). A tile's or card's series line and a series result in a player's games drop it: `v DK 5`, `1–0`.
- `Final` on the head alone (Changed by Craig, 16 Nov 2026): a series result in a player's games is `W 2–1`, not `W 2–1 · final`; the head's tag is `Final`, or `Not final` while the week isn't, `Live` while a game is. Perfect game, reached by Highest ›, keeps its `Final` and drops `Cap 2`.
- A tap opens a breakdown sheet (Changed by Craig, 16 Nov 2026: "tapping a player card on points rift view didn't do anything, should show that gameweek's points breakdown like FPL"; "your call" on popup or scroll; then "huge info dump", so slimmed; approved with "File both approve"). A 544 modal over the page, replacing the side panel: portrait, name and hangul, a bigger C or V, the total, then Average Carry for the Carry. Each series is a header (day, opponent, result ›, its points) over one 32px row per game (the pictures draw 40; 32 binds): champion and W/L, K/D/A, the bonus lines that scored as words, the points boxed when counted and in `--mid` when dropped. The ×1.5 stays hidden: the total is his result. The coach gets the same sheet with his lines and the series' +3 or −1. Full stats › at the foot.
- Week arrows as FPL's (Changed by Craig, 16 Nov 2026): ‹ and › are 32px keys, text on paper with a mid edge, beside the week. Each is a link by the router, the week in the path (`/points/2`; `/points` is the latest), so a week can be linked; › is a disabled key at the latest week and ‹ at Week 1. The made-up data has Weeks 1 and 2, final, to step back to.

## Borrowed

- **FPL's Points page**: total beside Average and Highest, the squad with the bench under it, a tap opening a player's breakdown.
- **LiveFPL**: your Carry against the average Carry, points to climb, Killer.
- **Summoner's Rift**: each starter in his lane; Coach and Flex in your base.
- **LoL ranked tiers**: overall rank as "Emerald I" ([spec/08](../../../../spec/08-leagues.md#overall-tiers)).

## Layout

- **Header:** team name and hangul; ‹ week ›; your points, not final, Average, Highest ›; the live bar while a series is live, with Watch ›.
- **Left:** Rift view | Card view (Rift first, then remembered); each starter's points and his series under the shirt; C and V; under the pitch the bench bar, one row: order, role icon, name, team and the week's points, "Didn't play" and — for a bench player with no games (redrawn 15 Nov 2026 from the grey band of two shirts).
- **Right:** Leagues with moves and the points to the next tier, the week's series, your week (Star, Flop, Killer), the sponsor slot.

## Controls

- **A player, coach or bench tile**: opens his breakdown sheet; ✕, Esc or the page behind closes it. Each series (`v HLE ›`) opens its Series page.
- **Full stats ›**: the player card.
- **‹ ›**: the week before or after (`/points/2`); off at Week 1 and past the current week.
- **Highest ›**: the top team's week. **All leagues ›**: Leagues.

## Placeholders

| What | Issue |
|---|---|
| Series, games, stats | #36 |
| Live points | #34 |
| Final points, ranks | #33 |
| Scoring | #30 |
| Carry ×1.5 | #19 |
| Auto-subs | #14 |
| Leagues | #38 |
| Buffs, hits (shown beside the total when played or taken) | #25, #20 |
| Overall tiers | #108, #109 |
| Hangul banner, sponsors, birthday cake | spec/13 |

## Still open

Overall rank as tiers is specced in [spec/08](../../../../spec/08-leagues.md#overall-tiers). The profile's Points tab follows this page's Card view.
