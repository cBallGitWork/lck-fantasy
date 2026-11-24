# Team colour

Team colour off the Rift: a small bar of a team's own colour before its code wherever a list names a team, and the team's kit either side of the time on a fixture.

**Approved:** Craig, 24 Nov 2026. On the new look: a slight lack of colour, lots of blue and white, and it doesn't need much. Seven reviewers named team identity beside the team codes first. Crests were tried and set aside the same day (Craig: text is better for the teams, as the crests are our own creation), and he chose the code with a bar of the team's colour: "Yes, colour bar".

| File | Shows |
|---|---|
| `1440-fixtures.png` | The LCK's fixtures, shot from the built app: the rows centred as FPL's and UCL Fantasy's, each team's code and kit either side of the time (Craig, 24 Nov 2026: "Yes, centre them"). The kit in place of the bar there is Claude's call, on Craig's "your call": five reviewers found the bar too thin for a row about two teams, where FPL and UCL Fantasy show a badge |
| `1440-stats.png` | Stats: a bar before each player's team |

## Rules

- The bar is 4px wide and as tall as its line's letters, 4px before the code.
- Its colour is the team's kit, from `data/lck/teams.json`: the body's colour, or the next of pattern and collar where the body doesn't show on the navy (GEN's black gives gold, KRX's navy pink, BRO's dark green orange).
- A fixture shows each team's kit at 28px in the bar's place (`data/lck/shirts/`).
- The bar is on the live score, a series list, and beside a player's team on Stats, Transfers, Home and Live.
- Never a tinted row, a wash or a coloured code: the code stays `--text` or `--mid`.
