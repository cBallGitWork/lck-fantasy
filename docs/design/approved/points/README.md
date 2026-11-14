# Points

Your gameweek. Reached from **Points** in the top bar. Drawn at 1440 in the shared frame.

**Approved:** Craig, 14 Nov 2026. A start was approved on 13 Nov ("Seems ok as a start?", after "Riff on the left, Bench underneath, Widget/info on right"; PR #47, never merged). On 14 Nov it was brought up to the spec with fresh eyes and less explaining text, Craig picked what stays, and said "File and merge". Names, teams and numbers are a made-up LCK Cup Week 3, not roster data. No `plate.md` yet: this binds layout, content and order, not colour or type. The source is [docs/design/proposals/2026-11-14-points/](../../proposals/2026-11-14-points/) (`points.html`, `brief.md`).

| File | Shows |
|---|---|
| `1440.png`, `points.html` | Saturday, T1 v DK live: your team on the Rift, the bench, Faker's games open, your week, leagues, the week's series |

## Borrowed

- **FPL's Points page**: total beside Average and Highest, the squad with the bench under it, a tap opening a player's breakdown.
- **LiveFPL**: your Carry against the average Carry, points to climb, Killer.
- **Summoner's Rift**: each starter in his lane; Coach and Flex in your base.
- **LoL ranked tiers**: overall rank as "Emerald I" ([spec/08](../../../../spec/08-leagues.md#overall-tiers)).

## Layout

- **Header:** team name and hangul; ‹ week ›; your points, not final, Average, Highest ›; the live bar while a series is live, with Watch ›.
- **Left:** Rift view | Card view (Rift first, then remembered); each starter's points and his series under the shirt; C and V; "Subbed in for Bdd" on an auto-sub; the bench under it.
- **Right:** the tapped player's games (closed until a tap), your week (Star, Flop, Killer), Leagues with moves and the points to the next tier, the week's series, the sponsor slot.

## Controls

- **A player**: opens his games on the right; ✕ closes. Each game shows champion and W/L; the best 2 a series are boxed; the Carry's total shows ×1.5 and the average Carry.
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
