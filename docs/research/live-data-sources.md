# LCK fantasy: per-player stats sources

Desk research, 11 Nov 2026. Public pages and keyless public endpoints only. No sign-ups, no keys used.
"Checked" means I fetched it today. "Unverified" means I read it second-hand or could not test it.

## Contents

1. The short answer
2. Comparison table
3. Riot's lolesports feeds
4. GRID
5. Oracle's Elixir
6. Leaguepedia Cargo API
7. Riot developer terms
8. Recommendation
9. Decisions for Craig

## 1. The short answer

- Only one source gives live per-player numbers for free: Riot's unofficial livestats feed. It works without a key (checked). Riot has never supported it for third parties.
- The only official live source is GRID. It is commercial and priced per deal. Its free "Open Access" page now redirects to its paid plans (checked).
- Settled points are easy: Oracle's Elixir publishes a free 2026 CSV, updated once a day (checked).
- Leaguepedia has the right table but blocks anonymous queries hard (checked: rate-limited on every query).

## 2. Comparison table

| Source | Per-player fields | Speed | Reliability | Terms | Cost |
|---|---|---|---|---|---|
| Riot livestats feed (`feed.lolesports.com/livestats/v1`) | K, D, A, CS, total gold, level, health; `details` adds kill share, damage share, wards, items | Live. Frames every ~0.3-0.5 s, served in 10-second windows. Delay vs the game: unverified | No SLA. "Never fully supported" (Riot, 2022). Format can change | Unofficial. No licence to use it | Free |
| Riot esports API (`esports-api.lolesports.com`) | Schedule, matches, game ids. No player stats | Live schedule | As above | Needs an `x-api-key` header. The key is Riot's own, from lolesports.com, not issued to us | Free |
| GRID | Full official live and historical data | Live (WebSocket) and post-match | Official, contracted SLA | Licensed per agreement | Custom price, commercial only |
| Oracle's Elixir | ~one row per player per game: K, D, A, CS, gold, damage, vision, `golddiffat15`, `csdiffat15`, `gamelength` | Once a day | Good. Long-running, used widely | Free for analysts and fans; follows Riot's policies; credit needed | Free |
| Leaguepedia `ScoreboardPlayers` | K, D, A, CS, gold, damage to champions, vision score, items, runes, win | After the game; exact lag unverified | Good data, but anonymous API is rate-limited | CC BY-SA 3.0 (as credited by Oracle's Elixir) | Free |

## 3. Riot's lolesports feeds

**What it returns (checked today).** I called `GET /livestats/v1/window/{gameId}` and `/details/{gameId}` on a Worlds 2023 game with no key. Both returned 200.

- `window`: per player `participantId`, `totalGold`, `level`, `kills`, `deaths`, `assists`, `creepScore`, `currentHealth`, `maxHealth`. Per team: gold, kills, towers, inhibitors, barons, dragons. `gameState` is `in_game` or `finished`.
- `details`: adds `totalGoldEarned`, `killParticipation`, `championDamageShare`, `wardsPlaced`, `wardsDestroyed`, items, runes, ability order and combat stats.
- Metadata maps each participant to `esportsPlayerId`, name, champion and role.
- `startingTime` must be a multiple of 10 seconds. The server says so: `"startingTime must be evenly divisible by 10 seconds"`.
- One call returns one 10-second window. Frames inside it were 0.3-0.5 seconds apart.
- A time after the game ends returns the final state with `gameState: "finished"`.

**Not in the feed.** Vision score, absolute damage, first blood, objective credit per player. Only shares and team totals.

**Key.** The `livestats` feed needs no key (checked). The `esports-api` (schedule and game ids) needs `x-api-key`. Community docs print a shared key lifted from lolesports.com. Riot does not issue it. There is no legitimate way to get our own (unverified: I found no Riot sign-up for it).

**Game ids.** You need the esports game id to call livestats. It comes from the keyed `esports-api`. Leaguepedia's `MatchScheduleGame` also holds Riot ids (`RiotPlatformGameId`, `RiotGameId`), but whether they match the livestats id is unverified.

**Delay.** Unverified. The feed is widely said to run close to the broadcast, which itself runs minutes behind the server. Riot's own data site says unofficial data "is delayed and cannot be delivered reliably" (https://riotesportsdata.com/product-overview/).

**LCK coverage in 2026.** Unverified. I could not get a 2026 LCK game id without the keyed API.

**Reliability.** No SLA, no changelog. Riot's 2022 dev diary: the old feed "was never publicized and never fully supported", yet was "being used by many popular fan sites" (https://lolesports.com/en-US/news/dev-diary-introducing-the-new-lol-esports-data-portal, 10 Jun 2022). Riot's data site: "Unofficial results may change or be invalid" (https://riotesportsdata.com/product-overview/). I found no public outage log.

**Riot's position on fan use.** No statement allows it. Riot points data users to GRID: "Reach out to our partners to get access to Riot Games Esports Data and scores" (https://riotesportsdata.com/product-overview/).

## 4. GRID

**What it is.** Riot's exclusive official esports data partner for LoL and VALORANT since a December 2023 deal (https://grid.gg/riot-games-and-grid-announce-exclusive-global-esports-data-partnership/).

**Returns.** Live server data and multi-year archives: "Granular data at the speed you need, direct from the game server" and "multi-year archives for supported titles" (https://grid.gg/fan/).

**Cost and terms.** "Every plan on this page is commercial and custom-priced to the use case." and "Use of GRID data is licensed within the scope, territory and term of the relevant agreement." (https://grid.gg/plans/). Live API and WebSocket sit in the Media plan.

**Free tier.** `https://grid.gg/open-access/` now redirects (308) to `/plans/` (checked today). Search snippets of the old page said Open Access was free for fans and independent developers, historical only, for CS2 and Dota 2. Not LoL (unverified now the page is gone). `https://grid.gg/get-league-of-legends/` returns 410 Gone.

**Fantasy.** GRID markets live stats for fantasy, and powered E-GO's LoL fantasy season from 2024 (https://esportslegal.news/2024/01/18/e-go-app-partners-with-grid-to-elevate-league-of-legends-fantasy-esports-experience/). No free fantasy tier is published. Only sales (sales@grid.gg) can say.

## 5. Oracle's Elixir

**Where (checked today).** One CSV per year in a public Google Drive folder: https://drive.google.com/drive/folders/1gLSw0RLjBbtaNy0dgnGQDAZOHIgCe-HH. `2026_LoL_esports_match_data_from_OraclesElixir.csv` is there, modified today. Linked from https://oracleselixir.com/tools/downloads.

**Speed.** "Data files are updated ONCE PER DAY. There is no value in downloading the files more frequently than this." (downloads page). So a game is in the file within about a day. Exact time of day: unverified.

**Columns.** Twelve rows per game: ten players and two teams. Key columns: `gameid`, `datacompleteness`, `league`, `date`, `position`, `playername`, `playerid`, `teamname`, `champion`, `gamelength` (seconds), `result`, `kills`, `deaths`, `assists`, `golddiffat15`, `csdiffat15`, `xpdiffat15`. Column list is from users' analyses, not an official dictionary (unverified; I did not download the file). `*at15` is blank for games under 15 minutes (unverified).

**Terms.** "It is provided free of charge, and is intended for use by analysts, commentators, and fans." and "Game statistics are the property of Riot Games, and any usage of such data must follow Riot Games' terms and policies." (https://oracleselixir.com/tools/downloads). Unclear cases: "contact Tim Sevenhuysen".

**Reliability.** Long-running (files back to 2014) and widely used. One person runs it. Riot's 2022 dev diary names it as a community user of Riot's official data portal.

## 6. Leaguepedia Cargo API

**Fields (checked today via `cargofields`).** `ScoreboardPlayers` has `Name`, `Link`, `Team`, `Champion`, `Role`, `Kills`, `Deaths`, `Assists`, `Gold`, `CS`, `DamageToChampions`, `VisionScore`, `Items`, `Runes`, `Pentakills`, `TeamKills`, `TeamGold`, `PlayerWin`, `DateTime_UTC`, `GameId`, `MatchId`, `Tournament`, `OverviewPage`. No 15-minute diffs; game length lives in `ScoreboardGames`.

**Speed.** Unverified. Usually filled within hours of a game, from Riot's post-game data. I could not time it: every anonymous `cargoquery` today returned `"code":"ratelimited"`. Wiki pages returned 403/402 to my fetches. In practice you need a logged-in bot account to query it (unverified; the `mwrogue` client supports bot passwords).

**Licence.** CC BY-SA 3.0, per Oracle's Elixir's credit: "Some content is provided courtesy of Leaguepedia, under a CC-BY-SA 3.0 license" (oracleselixir.com). I could not open Fandom's own licence page (unverified). Share-alike applies to the data we republish, not to our code.

## 7. Riot developer terms

**General policies, last updated 29 May 2025** (https://developer.riotgames.com/policies/general):

- "Products should use supported services from Riot Games for data ingestion"
- "Your product cannot feature betting or gambling functionality."
- "You must have a free tier of access for players, which may include advertising"
- No line on esports data or fantasy games.

**API Terms, last updated 9 Dec 2013** (https://developer.riotgames.com/terms):

- "You may only access the Riot Games API with the API Key(s) provided to You by Riot." So the shared lolesports key is not ours to use, if the esports API counts as a Riot Games API (unverified; it is not on the developer site).
- Banned uses include using the API "to sponsor or operate any contest, sweepstakes or other promotion". A free fantasy league with no prizes may still be a "contest". Unverified how Riot reads this.

**Legal Jibber Jabber, last updated August 2018** (https://www.riotgames.com/en/legal):

- Free fan projects get a "personal, non-exclusive, non-sublicenseable, non-transferable, revocable, limited" licence.
- "You may not create commercial Projects."
- Public projects must say they were made under the policy and that "Riot Games does not endorse or sponsor this project."
- Nothing on esports data, fantasy or gambling.

**Riot's own public API** (match data for ranked games) does not carry LCK pro games. They run on a separate tournament server (unverified, widely reported).

## 8. Recommendation

1. **Settled points from Oracle's Elixir.** Free, stated for fan use, daily, and has the 15-minute diffs. Credit it and Riot. Leaguepedia is the backup, if we register a bot account.
2. **Live points: none from an official free feed, because none exists.** Two honest options:
   - **A. Live from Riot's livestats feed, shown as "provisional".** Score K/D/A/CS/gold live, then overwrite with the Oracle's Elixir numbers next day. Accept it may break or be blocked with no warning. Do not use the keyed `esports-api`; get game ids another way (Leaguepedia or by hand).
   - **B. Ask GRID first.** Email sales@grid.gg: free, non-commercial, no prizes, LCK only. If they say yes, that is the clean live source.
3. My pick: **B now, A as the fallback** if GRID says no or wants money. No prizes, ever, to stay clear of the "contest" and gambling lines.
4. Score only fields both sources share: kills, deaths, assists, CS, gold, win. Vision, damage and 15-minute diffs settle next day only.

## 9. Decisions for Craig

1. **Should live points come from Riot's unofficial feed, knowing Riot has never allowed it and can switch it off?**
   Recommended: yes, as provisional points only, if GRID says no.
2. **Should I email GRID to ask for free LCK live data for a non-commercial fan game?**
   Recommended: yes, before we build on the unofficial feed.
3. **Should the settled score come from Oracle's Elixir, a day after each match?**
   Recommended: yes.
4. **Should live scoring use only kills, deaths, assists, CS, gold and win, with vision and damage added next day?**
   Recommended: yes.
5. **Should the game promise never to offer prizes?**
   Recommended: yes. Riot's API terms ban running a "contest" and its policies ban gambling.
