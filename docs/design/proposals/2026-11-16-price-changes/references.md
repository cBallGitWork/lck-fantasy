# Price changes: references

Research for the Price changes page (spec/12). Gathered 15 Nov 2026 with web search and fetch only. Anything not seen on a fetched page or in a search result is marked **Unverified**.

## What could not be reached

- `fantasy.premierleague.com/en/price-changes` renders in the browser; the fetch returned only its title. The facts below come from the repo's earlier browser survey and the Premier League's own article.
- `livefpl.net/prices` returned only a cookie banner.
- `fplstatistics.co.uk` failed its TLS check.
- `fplform.com` price pages returned 404; no FPLForm price page was found by search.

## 1. FPL's own Price Changes page

The brief assumed FPL has none. It has one, new for 2026/27, in its main nav.

- Tabs "Predictions" and "Recent Price Changes"; filters Rise & drop / Rise / Drop / Locked, and position; a countdown to the next change and "Updates every 15 minutes". Columns: Player, Status, Progress %, Predicted Progress %, Ownership Trend, Current Price. Source: repo `docs/research/fantasy-site-pages/fpl.md`, citing https://fantasy.premierleague.com/en/price-changes
- The PL says the table can be sorted by who is most likely to move, and filtered by your team, your watchlist or all players. Source: https://www.premierleague.com/en/news/4680462/whats-new-in-202627-fantasy-price-change-predictor
- FPL prices change daily, at 00:00 UK time from 2026/27. Source: search summary of https://www.draftfantasy.com/blog/fpl-price-change-predictor and https://onefpl.com/blog/fpl-price-change-predictor-explained-2026-27
- Price Changes sits in the main nav. Source: same Draft Fantasy article; repo `fpl.md`.

**Teaches:** a past-moves tab can live beside nothing else. Flol keeps only the "Recent" half: no Progress %, Status or Predicted columns (SPEC.md, Out of scope).

## 2. Community sites

### fpl.page

- "Price Change History": "Track all confirmed price rises and falls." Grouped under date headings, newest first, with Show more for older days. Source: https://fpl.page/pricechanges
- Each date has two tables, "Price rises" and "Price falls"; empty ones say "No price rises". Columns: icon, Player, Team (three letters), Cost. Sorted by name. Source: same.
- Filters: search, position, team, a My Team option. Source: same.

**Teaches:** the closest model for Flol. One heading per move, rises and falls apart, few columns.

### LiveFPL

- A predictor: each player's progress to a rise or fall as a percentage; 100% means likely to rise that night. Filter by team, search, sort by progress. Source: search summaries of https://www.fantasyfootballscout.co.uk/fpl-price-changes
- Page layout: **Unverified** (not reached).

**Teaches:** what Flol leaves out. Its whole page is prediction.

### FPL Statistics

- A "Target" column: near +100 a rise is likely, near −100 a fall. Built on net transfers in (NTI) and out. Source: search summary of https://www.fantasyfootballscout.co.uk/2023/06/01/when-do-fpl-price-changes-take-place
- Its past-changes list: **Unverified**.

**Teaches:** also prediction-led; nothing to borrow but the green/red sign of direction.

### FPLForm

- No price page found. **Unverified** whether one exists.

### Explainers

- OneFPL's explainer has a Rule / Specification / Manager Impact table, an FAQ and a link to the live page. Source: https://onefpl.com/fpl-price-changes

**Teaches:** the "how prices move" text belongs on Help, as spec/02 already says, and is linked from the page.

## 3. Korean feel

- In Korea a rise is red and a fall is blue, the reverse of US markets. Source: https://view.asiae.co.kr/en/article/2026071309151503447
- KRX's mascots: Hwangbi, a red bull, for a rising market; Woongbi, a blue bear, for a falling one. Source: https://www.koreatimes.co.kr/business/banking-finance/20231026/krx-launches-promotion-campaign-of-its-bull-and-bear-characters
- Korean headlines say stocks "turned red" when they rose. Source: https://www.asiae.co.kr/en/article/2022041909261892722
- Korean labels: 상승 (rise), 하락 (fall), ▲ and ▼ beside the figure, as on Naver's stock pages. **Unverified** for Naver's exact layout (not fetched).

**Teaches:** a Korean board look, red ▲ and blue ▼, for a page that is about money in 억. It clashes with FPL's green arrow, which Flol's spec uses in tiers and trucks; Craig's call.

## 4. Flol's own approved parts

- `approved/transfers/`: the price column, ▲/▼ in its own column, nothing before a first move.
- `approved/player-card/`: "18.5억 ▲0.5" in the meta line; History shows each week's price once.
- `approved/lck-hub/`: the week's ‹ › arrows.
- `approved/home/`: the deadline card's "your time · KST", for the next-move line.
