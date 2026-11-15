# src/parts

Parts shared by two or more screens, each drawn one way everywhere (`docs/design/plate.md`, Parts and States). Each has its own CSS file, using theme tokens only. Import them from `src/parts` (`index.ts`). Parts never import `src/rift`; the Rift builds on the parts.

- `TopBar.tsx`: the top bar: Flol, the eight items with `active`, the sponsor, the account menu or `Sign in`.
- `PageFrame.tsx`: the top bar, then the main column and the 360px side column (`sideFirst` for Leagues).
- `PageHead.tsx`: title and hangul, ‹ week ›, the key figure, its tags, up to three figures, a link.
- `Tag.tsx`: a tag: plain, `Live` filled, `Not final` dashed.
- `ViewToggle.tsx`: butted keys, the chosen one on paper (`Rift view | Card view`).
- `Tabs.tsx`: a page's or a card's sections, the chosen one underlined.
- `LinkGo.tsx`: a link ending `›` (`go`), or `↗` leaving Flol (`out`).
- `Deadline.tsx`: `Deadline Wed 07:45  16:45 KST` and the countdown.
- `Time.tsx`: your time, then KST in mid grey.
- `MeDot.tsx`: your player's dot.
- `Table.tsx`: 40px rows, figures right, long names truncated with their full text, a sorted head, column groups, a row's `›` (`open`); sticky head and name column for the wide table.
- `SideSection.tsx`: a side column section: 2px rule, 14px title, its count or state.
- `SeriesList.tsx`: the week's series: day, teams, then score and state, or the time.
- `Menu.tsx`: a key that opens a list of links and actions (a league's Admin menu; the account menu once its items are settled).
- `States.tsx`: `Loading` (fill bars), `Empty` (a title, one line), `ErrorState` (a title, one line, `Try again ›`).
- `Modal.tsx`: a card (1056) or sheet (544) over a dimmed page; ✕, Esc, focus kept inside.
- `Field.tsx`: a form field: label above, 40px, an error line under.
- `BuffCard.tsx`: a buff: name, what it does, how many left, Play.
- `MainAction.tsx`: the screen's one filled key; disabled with its reason.
- `OutlinedKey.tsx`: any other key; disabled with its reason.
- `Crest.tsx`: a team's crest at a measure, from `data/lck/crests/<code>.svg` (docs/design/approved/crests/); a dashed round box with the code where none is drawn.
- `Placeholder.tsx`: a dashed box with one word (sponsor, photo).
- `SponsorNote.tsx`: `All sponsors are made up.`
- `money.ts`: an amount in 억, and the note for overseas players (spec/02).
- `GoLink.tsx`: a link inside Flol through the router, typed by `src/paths.ts` (`Go`).
- `selectable.ts`: makes a tile or card a key: click, Enter or Space.
- `cx.ts`: joins class names.
