# src/screens

One folder per screen in the site map (`docs/design/site-map.html`), named as it is there, each with the approved picture in `docs/design/approved/<name>/`. Each `index.tsx` is the screen's route (`src/router.tsx`), a placeholder until its own issue builds it.

So each screen's issue touches only its own folder:

- A screen imports from `src/parts`, `src/rift`, `src/theme` and `src/fixtures`, never from another screen.
- Its page is a `PageFrame` with `screen` set to its folder's name; `src/router.test.tsx` checks only that.
- Every class in its CSS starts with its folder's name: `.points`, `.points__side`, `.points--live` (`screens.test.ts`).
- Its own tests and its own made-up data live in its folder; data two screens share goes in `src/fixtures/`.
- Links go through `GoLink`, `LinkGo` or the parts' `go` props, typed by `src/paths.ts`.

- `home/`: Home, your team's name as its title.
- `pick-team/`: Pick Team.
- `transfers/`: Transfers.
- `points/`: Points, your team's name as its title.
- `leagues/`: Leagues and one league's table (`/leagues/$leagueId`), with the league forms as sheets over it.
- `stats/`: Stats.
- `live/`: Live.
- `series/`: one series (`/series/$seriesId`).
- `compare/`: two players side by side.
- `perfect-game/`: the week's best team.
- `patch-update/`: the week's new prices.
- `settings/`: Settings.
- `lck-hub/`: the LCK hub: fixtures, results, standings, teams.
- `player-card/`: the full player card (`/player/$playerId`).
- `coach-card/`: the full coach card (`/coach/$coachId`).
- `profile/`: a manager's profile (`/manager/$managerId`).
- `following/`: the managers you follow.
- `pick-team-signed-out/`: the front door (`docs/design/site-flow.md`, Pick team (signed out)). Only `guestSquad.ts` so far, the guest's squad kept in the browser (spec/09); no route until it has its approved picture.
