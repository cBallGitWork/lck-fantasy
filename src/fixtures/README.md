# src/fixtures

Made-up data the screens are built on until the backend wires real data.

Only data two or more screens share lives here. A screen's own made-up data goes in its folder (`src/screens/<name>/fixtures.ts`), so screens built side by side never edit the same file.

- `week3.ts`: the Split 1 Week 3 the approved pictures share, and the three moments they catch. It re-exports the five files below, so a screen imports the week from one place.
- `competition.ts`: the teams, the competition's values (the Carry's multiplier, counted games, series length, team cap, hit, buffs), how a series and the Carry score (`seriesPoints`, `carried`), the sample manager Baron Steal FC, and a card's id (`playerId`).
- `weeks.ts`: Weeks 1 and 2 final, Week 3's series at Points' moment and final, Week 4's fixtures, both deadlines, Week 4's free transfers, a day's two series times, and the pictures' moments as instants, from which every countdown is worked (`countdown`).
- `squads.ts`: Baron Steal FC's squads at the Points and Pick Team moments and once Week 3 is final, and his games in Weeks 1 and 2 (`WEEK1_PLAYED`, `WEEK2_PLAYED`, `squadIn`), whose totals Points and Leagues share (`MY_EARLIER_WEEKS`); every page's Week 3 points for them are worked from these games (`MY_WEEK3`, `rawWeekOf`), and so are his four in Week 3's perfect game.
- `players.ts`: the Stats picture's players and coaches, Bdd and Cuzz, and the made-up rest of the LCK (`OFF_PAGE_PLAYERS`): one row each, every page's price, owned %, season points and form for them (`statsOf`, `formOf`).
- `games.ts`: each game's winner (`winnerOf`), and Baron Steal FC's Week 3 games, champion, K/D/A and the lines that scored, at Points' moment or once final (`weekGamesOf`): Points' sheet, Series, Live, Home, Perfect game and the cards all show these.
- `standings.ts`: the two groups' standings after Week 3, as the LCK hub, Series and Stats share them (`standingOf`, `recordOf`, `gamesOf`).
- `t1Season.ts`: T1's series played and to come, and Faker's and kkOma's season figures, as their cards and Compare share them.
- `myLeagues.ts`: Baron Steal FC's Overall rank and tier, his four other leagues, and his season total, as Home, Points and Leagues list them.
- `series.ts`: a series by its id, a team's series, its opponent, and a series read from one team's side.
- `rosters.ts`: the LCK teams' rosters in role order with hangul (`ROSTERS`, `hangulOf`), and T1's prices.
- `managers.ts`: the made-up managers Minji, Jae and Dan, as Following, Profile, Leagues and Home show them, and Minji's Weeks 1 to 3.
