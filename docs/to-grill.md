# To grill

What Craig hasn't settled yet. Nothing here is the product until a `/grill` moves it into
[SPEC.md](../SPEC.md). A grill deletes the lines it settles.

## An LEC game, talk only (17 Nov 2026)

- A second game for the LEC, which starts 15 Jan 2027 with three splits; its schedule differs
  from the LCK's. Each split as last summer's: 8 weeks, some with 5 match days (Craig, from the
  LEC's commissioner, 17 Nov 2026).
- An Overall league that runs all year, across the three splits.
- The same core as the LCK (budget and the like), with buffs and other settings tuned for it.
- The same pages as the LCK's, with the LEC's differences, and its own sponsors (Craig, 17 Nov
  2026).
- Each player's country flag beside his name in the player list and pop-up; not in the LCK, where
  nearly all are Korean. Needs players' nationality in the data (Craig, 17 Nov 2026).
- In both games, each manager's country flag beside his name in league tables and on his
  profile; the country is already set at sign-up (Craig, 17 Nov 2026).
- Crests for the LEC teams made as the LCK's were ([docs/design/approved/crests](design/approved/crests/README.md)):
  Flol's own shape, the team's colours and code, and a mark from a fan meme, never the real logo
  (Craig, 17 Nov 2026).

## Leagues, parked (14 Nov 2026)

- A chart of the league's ranks week by week.

## Achievements, parked (13 Nov 2026)

Not grilled until Craig picks the achievement book up again. Open then: how achievements cap
and rank (a separate column, and do base points decide ties?).

Craig's drafts (12–13 Nov 2026), with his names:

- Unkillable Demon King: win with Faker when he has 0 deaths.
- Flame Horizon: your laner beats their lane opponent by 100 CS.
- Got excited: own a KT player; KT wins game 1, then loses the series.
- Church of Chovy (named only).
- Get the trucks: you start two T1 players who lose.
- Cut the western shit: your coach loses a game in under 25 minutes.
- LS: win a game on Renekton. Supportal Kombat (DoA). OK Bro (OKSavingsBank BRION).
- Champion achievements tied to lore, such as your bot on Xayah and your support on Rakan in
  the same gameweek.

How Craig wants them: Xbox-style achievements from LCK and wider LoL memes (Reddit, casters, old
heads, teams, champions), never FPL-style stat trophies; once a year, worth a point or two.
Claude's drafts and their sources are in
[docs/research/achievement-memes.md](research/achievement-memes.md); none is the product.

## Open from the foundations work (11 Nov 2026)

- The screens and the look ([docs/design/](design/)). Craig asked whether player portraits can appear on the Rift (11 Nov 2026); shirts are settled in [spec/13](../spec/13-korean-touches.md#shirts-and-crests).

## Live reading (17 Nov 2026)

Left open by the live reading's review (#34), built as LoL has them until Craig says.

- Are the 15:00 gold mark and the multikill timers (10 s a kill, 30 s for a penta) data per
  competition, or the game's own constants?
- A player with no same-role opponent in the feed scores 0 for gold lead at 15, with no log.
  Should that raise an admin alert instead?

## Pages, built on made-up data (15 Nov 2026)

States and rules the approved pictures don't draw. Each page shows what is drawn; these wait.

- Home: can a stream that isn't live be picked? How many streams before More ▾ (built 5)? Do star
  and flop show effective ownership, as spec/12 says (Faker 22 · 31%)?
- Transfers: how a sold slot looks before a buy; what the list shows when no one is sold; which
  reason shows when over budget and team full; does a Carry's replacement take the C; Coach chip.
- Following: empty lines for no requests, cheers or follows; does Block confirm first; is cheer
  or jeer, or a line, picked when the picker opens?
- Pick Team: what counts as one change in the bar; Make Carry on a player not starting; can a swap
  start from the bench, as FPL allows?
- Points: a Series win row for the Coach; a week total under non-Carry players; bench taps.
- Leagues: what a bare /leagues opens; the default tab; page size and Find me; the line under
  Overall's name per tab; where a row's › goes.
- League forms: what Copy link copies; Join with a bad code; the 25-league cap message; Remove's
  confirm text.
- Stats: a `+` on each row that opens Transfers with that player chosen, so a scout isn't a dead
  end (design panel, 16 Nov 2026).
- Stats: second click flips the sort; Max price steps; 0.0 or — for no games; an empty result.
- Live: can a greyed stream be picked; the remembered stream when idle.
- Series: VOD as ↗ or ›; an unknown series id; a coach's empty game as — or 0.
- Compare: the search's role groups and caps; what /compare opens with no players.
- Perfect game: open with no one tapped or the Carry; the sum row's label; the week in the URL.
- Price changes: the Set line before the first move; sort order; the week in the URL.
- Settings: an empty hangul banner; the save bar's list; Save team's rules; Privacy and Terms
  routes. The picture draws the reminder On; spec/12 says both emails are off by default (built off).
- LCK hub: ‹ on Fixtures for a past week; a stage before it starts; an academy with no roster.
- Player card: the Vice-carry's keys; This week before any game; what Swap and Transfer out do;
  History's week total with or without the Carry's ×1.5.
- Coach card: This week before any series; mid-series History.
- Profile: cancelling a follow request; how a week's transfer cost reads; place or number ranks;
  a sponsor cheer's credit line.
- Transfers Undo: a confirm made under a buff has no Undo, so the confirm before it can't be undone.
