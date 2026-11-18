# Help

The rules and a beginner's guide, as FPL's Help (spec/12, Help). Reached from the Help link in every page's foot, beside Privacy and Terms, and from the team-name ▾ menu. Price changes' `How prices move ›` opens `/help#prices`. Not in the top bar.

**Approved:** Craig, 17 Nov 2026: "Approved". On the way there he asked for tabs, more readable text, writing "like a real person", a read by three new players (a League player who doesn't know fantasy games, an FPL player who doesn't know League, and a total beginner), an introduction like FPL's, a line on what a week is ("Wed to Sunday"), and then FPL's own layout: "go look at fpl", "we need more sections". After the approval he asked for the guide to be "broken up" and said "its just sucha long page", so each section became its own page with the text kept. The page follows the Captain rename of [#298](https://github.com/cBallGitWork/lck-fantasy/pull/298) (Captain, no vice-captain, Double Captain). The source is `help.html`.

| File | Shows |
|---|---|
| `1440.png`, `help.html` | Help tab, first page: the intro and Flol in 60 seconds |
| `1440-help-step4.png`, `help.html#points-scored` | Help tab, one step on its own page with Back and Next |
| `1440-rules.png`, `help.html#rules` | Rules tab, first item open |
| `1440-rules-open.png` | Rules tab with Captain, Player prices and How players score open |

## Since approval

- The buffs were reworked after this picture (spec/06, #319): Remake and Limitless are gone, Double Captain is ×2 and Coach Diff is new. The Rules text follows spec/06, not the picture's buff list.

## Borrowed

- **FPL's Help** ([notes](../../../research/fpl-help-pages.md)): Help and Rules tabs; the guide's intro, "in 60 seconds", seven steps that say where to click and what to look for, a weekly checklist and a glossary; a Help menu beside the guide; Rules as groups of items that open and close; a deadlines item.

## Controls

- **Tabs**: Help | Rules. Help opens first.
- **Help menu**: the guide shows one section at a time; each line opens its section, and Back and Next under it step through them in order. The intro sits above Flol in 60 seconds only.
- **A rule**: tap its title to open or close it. In Rules only Squad size starts open.
- **A link to a rule** (`/help#prices`): opens Rules with that item open and in view.
- **Price changes ›**: opens Price changes.

## Placeholders

- **Deadlines**: each week's date and time come from the competition's schedule data (spec/10); greyed until the schedule is loaded.
- **The tables** (scoring lines, buffs, tier cut-offs) are read from the same data the game uses (spec/05, spec/06, spec/08). The build is [#314](https://github.com/cBallGitWork/lck-fantasy/issues/314).
