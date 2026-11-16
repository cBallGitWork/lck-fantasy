# src/parts

Parts shared by two or more screens, each drawn one way everywhere (`docs/design/plate.md`, Parts and States). Each has its own CSS file, using theme tokens only. Import them from `src/parts` (`index.ts`). Parts never import `src/rift`; the Rift builds on the parts.

- `TopBar.tsx`: the top bar: Flol, the eight items with `active`, the sponsor, the account menu or `Sign in`.
- `PageFrame.tsx`: the top bar, then the main column and the 360px side column.
- `Columns.tsx`: the frame's two columns (main, then the 360px side) for a page whose head runs full width above them.
- `PageHead.tsx`: title and hangul, ‹ week ›, the key figure, its tags, up to three figures, a link.
- `WeekArrow.tsx`: a week's ‹ or ›: a link, or a key; off in the rule's grey where there is no week that way.
- `Tag.tsx`: a tag: plain, `Live` filled, `Not final` dashed.
- `ViewToggle.tsx`: butted keys, the chosen one on paper (`Rift view | Card view`).
- `Tabs.tsx`: a page's or a card's sections, the chosen one underlined.
- `LinkGo.tsx`: a link ending `›` (`go`), or `↗` leaving Flol (`out`).
- `Deadline.tsx`: `Deadline Wed 07:45  16:45 KST` and the countdown.
- `Time.tsx`: your time, then KST in mid grey.
- `MeDot.tsx`: your player's dot.
- `Table.tsx`: 40px rows, figures right, long names truncated with their full text, a sorted head, column groups, a row's `›` (`open`); sticky head and name column for the wide table.
- `SideSection.tsx`: a side column section: 2px rule, 14px title, its count or state.
- `SectionHead.tsx`: a main-column section's head: 2px ink rule, 14px bold title, its note in mid grey.
- `SeriesList.tsx`: the week's series: day, teams, then score and state, or the time.
- `SeriesStrip.tsx`: a card's series strip: the last 3 with points (`Live` while live), a 2px ink rule, the next 3 with `Bo3`, the first in ink (player card, coach card).
- `Menu.tsx`: a key that opens a list of links and actions (a league's Admin menu; the account menu once its items are settled).
- `States.tsx`: `Loading` (fill bars), `Empty` (a title, one line), `ErrorState` (a title, one line, `Try again ›`).
- `Modal.tsx`: a card (1056) or sheet (544) over a dimmed page; ✕, Esc, focus kept inside.
- `Field.tsx`: a form field: label above, 40px, an error line under.
- `BuffCard.tsx`: a buff: name, what it does, how many left, Play.
- `Toast.tsx`: a short message at the foot of the page that goes by itself after `TOAST_MS` (`Kingen added`, `Team full: 2 from T1`).
- `MainAction.tsx`: the screen's one filled key; disabled with its reason.
- `OutlinedKey.tsx`: any other key; disabled with its reason.
- `Crest.tsx`: a team's crest at a measure, from `data/lck/crests/<code>.svg` (docs/design/approved/crests/); a dashed round box with the code where none is drawn.
- `Placeholder.tsx`: a dashed box with one word (sponsor, photo).
- `TierShield.tsx`: Overall's tier shield with its division (spec/08); the page sizes and colours it through its class names.
- `SponsorNote.tsx`: `All sponsors are made up.`
- `money.ts`: an amount in 억 (`eok` for a price held in 억, `eokToWon`), and the note for overseas players (spec/02).
- `figures.ts`: counts, places (`2nd`, `2nd of 10 mids`), signed points, `+in / −out`, scores (`2–1`, `W 2–1`), per-game and one-decimal figures, per cents, `Bo3` and absence (`—`), written one way everywhere.
- `Move.tsx`: `PriceMove` (▲ 0.5, a page's class beside it) and `RankMove` (▲ 6,904); no CSS of its own, base.css draws them.
- `GoLink.tsx`: a link inside Flol through the router, typed by `src/paths.ts` (`Go`).
- `selectable.ts`: makes a tile or card a key: click, Enter or Space.
- `cx.ts`: joins class names.
- `devState.ts`: `useDevState`, the approved picture's state a screen opens on `?state=` in dev only (`src/devStates.ts` lists them).
