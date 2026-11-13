# Architecture

How the product in [SPEC.md](SPEC.md) will be built. No code exists yet.

**Who decides:** Craig picks the services, because they cost money and are hard to leave. Claude
picks the libraries inside them, because they are cheap to change. Both are written here with a
reason, and a change to either changes this file.

## Services (Craig's)

"Same as draft" (Craig, 11 Nov 2026): the services his Premier League draft product runs on.

| Job | Service | Why |
|---|---|---|
| Backend | [Convex](https://docs.convex.dev): database, live queries, timers, sign-in | live points reach browsers with no extra service; deadlines and price changes are timers saved with the data; one vendor, hard-capped free plan; Craig and Claude already know its rough edges |
| Pages | Vercel, free (Hobby) plan | Hobby is for non-commercial use, which fits: the game is free with no cash prizes. Payments, ads or a donate button would need the paid plan |
| Sign-in email | Resend, magic links | no passwords to keep; the free plan's 100 emails a day is the limit to watch at launch |
| LCK stats, live | Riot's unofficial live stats feed, shown as provisional; game ids from Leaguepedia (Craig, 13 Nov 2026) | free and works without a key; unsupported, and can be switched off. GRID, the official partner, is commercial and not asked ([research](docs/research/live-data-sources.md)) |
| LCK stats, settled | Oracle's Elixir's daily CSV, plus Leaguepedia's match data for solo kills and steals (Craig, 13 Nov 2026) | free for fans; Oracle's Elixir has the 15-minute stats, Leaguepedia the lines it lacks and usually lands within hours |

## Libraries (Claude's)

Chosen with the first code, each with a reason. The starting point is the draft product's set
(a Vite React app with TanStack Router, Convex Auth, Vitest with `convex-test`), because it is
proven on these services.

## Data

[docs/data-model.md](docs/data-model.md) is the proposal. Two rules are fixed:

- FPL's structure is the model for the game. The LCK's facts (teams, players, stages, formats,
  dates) are data held per competition and per season, never hardcoded, so the LCK Cup, the
  splits and later the LEC are rows, not code.
- Every stat a feed sends is kept as it arrived, so scoring can be re-run when a rule changes.

## Where code lives

The folders exist now, each with a README saying what goes in it. No code yet.

| Folder | What lives there |
|---|---|
| `convex/lck/` | The real world: competitions, seasons, stages, teams, players, contracts, series, games, lineups. Filled by feeds, corrected by an admin, never written by the game. |
| `convex/feeds/` | One adapter per stats source (Oracle's Elixir, the live feed). Each maps what the source sends into `convex/lck` and `convex/stats`, and keeps the raw payload. |
| `convex/stats/` | Per-player stats for each game, as the feed sent them, plus the latest live reading. |
| `convex/scoring/` | Scoring rules as data, the engine that turns stats into series points, and the re-score. |
| `convex/gameweeks/` | Gameweeks, deadlines and settling a gameweek. |
| `convex/squads/` | A manager's entry: picks, lineup, captain, bench, auto-subs, transfers, chips, prices. |
| `convex/leagues/` | Global, supporter and private leagues, and their tables. |
| `convex/achievements/` | The achievement book: the pages, the rules that award them, the awards. |
| `convex/signIn/` | Magic-link sign-in, and turning a squad picked signed out into an entry. |
| `convex/admin/` | Admin tools: corrections, moving a series, re-running a job. |
| `convex/outbound/` | Every call that leaves the server: email, the stats sources, the model API. |
| `src/screens/` | One folder per screen in the site map (`docs/design/site-map.md`), named as it is there. |
| `src/rift/` | The Rift view: the map, the lanes, the shirts and the role icons. |
| `src/parts/` | Parts shared by two or more screens: tables, the player row, buttons. |
| `data/` | Seed data held per competition and season: teams, kit colours, stages. Data, never constants in code. |
| `tests/` | Tests that cross features: a replayed gameweek, the signed-out pick to sign-up path. |
| `docs/design/approved/` | One folder per screen with the picture Craig approved. An approved picture binds the layout. |
| `spec/` | One file per feature, Craig's answers only. |
| `docs/` | Decisions, research, design proposals, the data model. |
| `scripts/` | Checks and one-off tools run from the command line. |
| The studio kit | The files `.studio/kit.json` lists: hook helpers and checks every studio project shares, copied from the private `cBallGitWork/studio` repository at the commit it names. Change them there and copy the kit in again (`node bin/copy-kit.mjs <this checkout>` in studio); `scripts/studio-kit.mjs`, in verify, fails a copy edited here (11 Nov 2026). |

The rules:

- A feature's server code, its tests and its fixtures sit in its one `convex/` folder.
- `convex/lck` and `convex/stats` never import from the game's folders (`squads`, `leagues`, `achievements`). The game reads the real world; it never writes it.
- Only `convex/feeds` talks to a stats source, and only `convex/outbound` leaves the server.
- A screen imports from `src/parts` and `src/rift`, never from another screen.
- Before adding a helper or a fixture, search for its home and reuse it.
