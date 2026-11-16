# Points

Your gameweek. Reached from **Points** in the top bar. Drawn at 1440 in the shared frame.

**Approved:** Craig, 14 Nov 2026. A start was approved on 13 Nov ("Seems ok as a start?", after "Riff on the left, Bench underneath, Widget/info on right"; PR #47, never merged). On 14 Nov it was brought up to the spec with fresh eyes and less explaining text, Craig picked what stays, and said "File and merge". Names, teams and numbers are a made-up LCK Cup Week 3, not roster data. Redrawn to [plate.md](../../plate.md) on 15 Nov 2026; this binds layout, content and order, and plate.md how it is drawn. The source is [docs/design/proposals/2026-11-14-points/](../../proposals/2026-11-14-points/) (`points.html`, `brief.md`).

| File | Shows |
|---|---|
| `1440.png`, `points.html` | Saturday, T1 v DK live: your team on the Rift, the bench bar, Faker's games open, your week, leagues, the week's series |

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

## Borrowed

- **FPL's Points page**: total beside Average and Highest, the squad with the bench under it, a tap opening a player's breakdown.
- **LiveFPL**: your Carry against the average Carry, points to climb, Killer.
- **Summoner's Rift**: each starter in his lane; Coach and Flex in your base.
- **LoL ranked tiers**: overall rank as "Emerald I" ([spec/08](../../../../spec/08-leagues.md#overall-tiers)).

## Layout

- **Header:** team name and hangul; ‹ week ›; your points, not final, Average, Highest ›; the live bar while a series is live, with Watch ›.
- **Left:** Rift view | Card view (Rift first, then remembered); each starter's points and his series under the shirt; C and V; under the pitch the bench bar, one row: order, role icon, name, team and the week's points, "Didn't play" and — for a bench player with no games (redrawn 15 Nov 2026 from the grey band of two shirts).
- **Right:** the tapped player's games (closed until a tap), Leagues with moves and the points to the next tier, the week's series, your week (Star, Flop, Killer), the sponsor slot.

## Controls

- **A player**: opens his games on the right; ✕ closes. Each series (`v HLE`) opens its Series page. Each game shows champion and W/L; the best 2 a series are boxed; the Carry's total shows his result and the average Carry.
- **Full stats ›**: the player card.
- **‹ ›**: the week before or after; no › past the current week.
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
