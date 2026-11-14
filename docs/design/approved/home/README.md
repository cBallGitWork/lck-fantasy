# Home

The signed-in start page, at 1440. A manager reaches it from **Home** in the top bar or the Flol wordmark, and lands on it after sign-in. It has two states: a series live, and nothing live.

**Approved:** Craig, 13 Nov 2026. He said Home looked "too similar to points and transfers" and "should probably have the live stream viewer"; on the redraw, "In think so", then yes to the muted stream, the lineup when nothing is live, and star and flop, then "Yes" to saving. Names, teams and numbers are a made-up LCK Cup Week 3, not roster data. No `plate.md` yet: this binds layout, content and order, not colour or type.

| File | Shows |
|---|---|
| `1440.png`, `live.html` | A series live: the stream with its picker, your week beside it |
| `1440-idle.png`, `idle.html` | Nothing live: your Week 4 lineup on a broadcast stage, last week's points |

## Borrowed

- **FPL's old Status page**: your points between Average and Highest, Pick Team and Transfers beside the deadline countdown. Research: [docs/research/home-page-references.md](../../../research/home-page-references.md).
- **An LCK lineup reveal**: the starters stand on angled name plates, from a broadcast shot Craig sent.
- **lolesports.com**: the series as fans read it, "KRX 1–0 BRO · Game 2 · Bo3". Shot in [docs/design/references/home/](../../references/home/).

## Layout

- **Top:** the team name and its hangul.
- **Left, live:** the stream, muted, the series and **Live ›** over it; the stream picker under it (spec/12's list).
- **Left, idle:** Week 4 lineup: the seven starters (five roles, Flex, Coach) with C and V; the next series on stream and when; **Pick Team ›**.
- **Right, live:** your week (not final) with Average and Highest; your players in this series with live points; who is still to play; **Points ›**.
- **Right, idle:** last week (final) with Average and Highest; star and flop; **Points ›**.
- **Below, three cards:** the deadline (countdown, your time and KST, Pick Team, Transfers, free transfers); Following, an idea only (below); Leagues (rank and move, the sponsor's badge on Overall, **All leagues ›**).
- **Bottom:** a sponsor banner and "All sponsors are made up." (spec/13).
- The nav's Live dot shows only while a series is live.

## Still open

- The stream on Home, the lineup when idle, and star and flop are specced in [spec/12](../../../../spec/12-pages.md#home) (14 Nov 2026). Star and flop now use effective ownership, so the drawn pair is a placeholder.
- **Following** (follows, a feed, trucks as reactions) is parked for a later grill, in to-grill. The card is drawn as an idea, not the product.

## Placeholders

| What | Issue |
|---|---|
| Live points, in play and to play | #34 |
| Final points, Average and Highest | #33 |
| Free transfers | #20 |
| Leagues, ranks and moves | #38 |
| Series and player stats | #36 |
| Streams list and picker | spec/12, no issue yet |
| Sponsor slots and badge | spec/13, no issue yet |
