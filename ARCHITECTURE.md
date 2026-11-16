# Architecture

How the product in [SPEC.md](SPEC.md) is built.

**Who decides:** Craig picks the services, because they cost money and are hard to leave. Claude
picks the libraries inside them, because they are cheap to change. Both are written here with a
reason, and a change to either changes this file.

## Services (Craig's)

"Same as draft" (Craig, 11 Nov 2026): the services his Premier League draft product runs on.

| Job | Service | Why |
|---|---|---|
| Backend | [Convex](https://docs.convex.dev): database, live queries, timers, sign-in | live points reach browsers with no extra service; deadlines and price changes are timers saved with the data; one vendor, hard-capped free plan; Craig and Claude already know its rough edges |
| Pages | Vercel, free (Hobby) plan | Hobby is for non-commercial use, which fits: the game is free with no cash prizes. Payments, ads or a donate button would need the paid plan |
| Sign-in | Google and Discord, through Convex Auth (Craig, 13 Nov 2026) | no passwords to keep, and no sign-in email to break across devices |
| Email | Resend, for the opt-in deadline reminder and weekly recap | the free plan's 100 emails a day is the limit to watch at launch |
| LCK stats, live | Riot's unofficial live stats feed, shown as provisional; game ids read from lolesports.com's schedule pages (Craig, 13 Nov 2026; Leaguepedia lacks them) | free and works without a key; unsupported, and can be switched off. GRID, the official partner, is commercial and not asked ([research](docs/research/live-data-sources.md)) |
| LCK stats, settled | Oracle's Elixir's daily CSV, plus Leaguepedia's match data for solo kills and steals (Craig, 13 Nov 2026) | free for fans; Oracle's Elixir has the 15-minute stats, Leaguepedia the lines it lacks. Unchecked: whether Leaguepedia holds solo kills and steals, how fast it lands, and whether it needs a bot login ([research](docs/research/live-data-sources.md)) |

## Libraries (Claude's)

Chosen with the first code (13 Nov 2026), each with a reason. The starting point is the draft
product's set, because it is proven on these services.

| Library | Why |
|---|---|
| Vite with React | a fast dev server and a plain static build, which is all Vercel's Hobby plan needs |
| TanStack Router | typed routes, so a link to a screen that doesn't exist fails the typecheck |
| Convex's React client | the live queries that carry live points to the browser |
| Convex Auth | Google and Discord sign-in inside Convex; it arrives with sign-up (#42) |
| Vitest with `convex-test` | game rules test as plain functions, and Convex functions run in memory, with no deployment |
| TypeScript, ESLint | strict types and lint, both in `npm run verify` |
| Papa Parse | reads Oracle's Elixir's daily CSV, quoted fields included, with errors reported, not skipped (#36) |

`convex/_generated/` is normally written by `npx convex dev`, which needs a Convex deployment. Until
Craig creates one, it is written by hand (#36), and `npx convex dev` will overwrite it. The rules are
pure functions; Convex functions run in memory under `convex-test`.

## Data

[docs/data-model.md](docs/data-model.md) is the model, approved by Craig on 14 Nov 2026. Two rules are fixed:

- FPL's structure is the model for the game. The LCK's facts (teams, players, stages, formats,
  dates) are data held per competition and per season, never hardcoded, so the LCK Cup, the
  splits and later the LEC are rows, not code.
- Every stat a feed sends is kept as it arrived, so scoring can be re-run when a rule changes.

## Where code lives

Each folder has a README saying what goes in it.

| Folder | What lives there |
|---|---|
| `convex/lck/` | The real world: competitions, seasons, stages, teams, players, contracts, series, games, lineups. Filled by feeds, corrected by an admin, never written by the game. |
| `convex/feeds/` | One adapter per stats source (Oracle's Elixir, the live feed). Each maps what the source sends into `convex/lck` and `convex/stats`, and keeps the raw payload. |
| `convex/stats/` | Per-player stats for each game, as the feed sent them, plus the latest live reading. |
| `convex/scoring/` | Scoring rules as data, the engine that turns stats into series points, and the re-score. |
| `convex/gameweeks/` | Gameweeks, deadlines and settling a gameweek. |
| `convex/squads/` | A manager's entry: picks, lineup, captain, bench, auto-subs, transfers, buffs, prices. |
| `convex/leagues/` | Global, supporter and private leagues, and their tables. |
| `convex/following/` | Follow requests, blocks, the feed of followed managers, and trucks. |
| `convex/achievements/` | The achievement book: the pages, the rules that award them, the awards. |
| `convex/signIn/` | Google and Discord sign-in, and turning a squad picked signed out into an entry. |
| `convex/admin/` | Admin tools: corrections, moving a series, re-running a job. |
| `convex/outbound/` | Every call that leaves the server: email, the stats sources, the model API. |
| `src/` | The app's entry (`main.tsx`), its routes (`router.tsx`) and every screen's path (`paths.ts`). |
| `src/theme/` | Every colour, font, size, gap and width, as tokens; nothing else holds a colour. |
| `src/fixtures/` | Made-up data the screens are built on until the backend wires real data. |
| `src/testing/` | Test helpers: a part or screen rendered to HTML or text inside the app's router. |
| `src/screens/` | One folder per screen in the site map (`docs/design/site-map.html`), named as it is there. |
| `src/rift/` | The Rift view and Card view: the map, the tiles, the shirts, the role icons, the bench bar. Builds on `src/parts`; parts never import it. |
| `src/parts/` | Parts shared by two or more screens: the top bar and page frame, tables, tabs, tags, keys, modal, menu, form fields, states (`src/parts/README.md`). |
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
- A screen imports from `src/parts`, `src/rift`, `src/theme` and `src/fixtures`, never from another screen.
- A screen's CSS classes start with its folder's name (`.points__side`); a test fails on any other.
- Before adding a helper or a fixture, search for its home and reuse it.
