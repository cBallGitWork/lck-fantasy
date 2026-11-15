# LCK hub

The LCK's own fixtures, results, standings and team rosters, with Sheep Esports' LCK news beside them (spec/12, LCK hub). There is no separate Fixtures page. It is reached from **LCK** in the top bar.

**Approved:** Craig, 15 Nov 2026, "save". Along the way he asked for Sheep's LCK articles on the page, with thumbnails; "a full league tab, fixtures in its own tab, results in its own tab"; and Teams as its own tab, academy rosters included, "as they would be in the game too". The names, teams and numbers are a made-up LCK Cup at the Pick Team picture's moment (Week 4, Tuesday 22:00 London, after Week 3), not roster data. There is no `plate.md` yet, so this binds layout, content and order, not colour or type. The source is [docs/design/proposals/2026-11-15-lck-hub/](../../proposals/2026-11-15-lck-hub/) (`hub.html`, `brief.md`, `hub-references.md`).

| File | Shows |
|---|---|
| `1440.png`, `hub.html` | Fixtures: Week 4 |
| `1440-results.png`, `hub.html?v=results` | Results: Week 3 |
| `1440-standings.png`, `hub.html?v=standings` | Standings: the two groups |
| `1440-teams.png`, `hub.html?v=teams` | Teams: T1 and T1 Esports Academy |

## Borrowed

- **FPL's Fixtures & Results**: one week at a time, with its deadline.
- **lolesports.com**: the stage tabs (Groups, Play-In, Playoffs) under the page's tabs.
- **Korean press**: 바론 그룹 and 장로 그룹, sets won and lost, and the role order top, jungle, mid, bot, support, coach.

## Layout

- **Head**: the competition in English and Korean, and the week's deadline at the right on every tab.
- **Tabs**: Fixtures, Results, Standings, Teams. The stage tabs sit under them, except on Teams.
- **Fixtures**: the week by day; each series with its time (yours and KST) and each team's record. Bo3 shows once, in the header.
- **Results**: the last week by day; the winner bold, the loser grey.
- **Standings**: one table per group: W, L, sets won, sets lost, +/−, Win % and Last 5 (oldest first).
- **Teams**: a team picker, then the LCK roster beside its academy (LCK CL) roster, role order, each player with his price. The LCK coach is last; there is no academy coach.
- **News**: Sheep Esports' latest LCK headlines, each with a thumbnail and date, linking out; then **More on Sheep Esports ↗**.

## Controls

- **A tab, a stage**: switches the view.
- **‹ ›** on Fixtures and Results: the week before or after.
- **A series**: opens the Series page.
- **A team** in the picker: shows its rosters.
- **A player or coach**: opens his card ([player card](../player-card/), [coach card](../coach-card/)).
- **A headline**: opens the article on Sheep Esports.

## Placeholders

| What | Issue |
|---|---|
| Fixtures, results, standings, rosters | #36 |
| Prices in 억 (academy prices made up) | #22 |
| Sheep headlines and thumbnails, from its LCK tag page | #116, Sheep's permission |
| The Play-In and Playoffs stages | spec/10; data per competition |
