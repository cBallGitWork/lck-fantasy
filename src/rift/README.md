# src/rift

The Rift view and Card view: the map, the tiles, the shirts, the role icons, the lineup cards and the bench. Import them from `src/rift` (`index.ts`). The Rift builds on `src/parts`, through its `index.ts`; parts never import the Rift.

- `RiftMap.tsx`: the map: river, lanes, bases, towers, pits, drawn in the Rift's own square (`measure.rift`, 720), which the Rift keeps at any width (`--ratio-rift`), centred in the main column (Craig, 16 Nov 2026).
- `Tile.tsx`: `Tile`, one player on the Rift or the bench, drawn as FPL's tile (Craig, 16 Nov 2026): a price chip over it (Transfers) and `×` to sell; the Flex's or Coach's label (`FLEX`, `Coach 감독`); the shirt on a faint card, C and his news flag at its top corners; a white name plate with your dot; then a dark band: points and series, or fixtures; selected, dim or fit. No role icon and no crest. `Rift`, the map with the tiles stood on it.
- `slots.ts`: where each starter stands, in px of the 720 square: `RIFT_SLOTS` (Pick Team, Points, Perfect game): top in top lane, jungle in the jungle, mid in mid lane, Bot over Support in bot lane, Coach and Flex by the blue base. A tile stands at the same share of the Rift at any width.
- `Lineup.tsx`: Card view: `Lineup`, the seven `LineupCard`s (not the Player card screen) in the broadcast's order, with photo or crest, role head (Flex plays X, Coach 감독), C and a footer, dim or fit.
- `MarkBadge.tsx`: the Captain's C, round and filled, one way everywhere, `small`, `card` or `sheet`; `Mark` and `MARK_NAME`. The page places it.
- `SlotName.tsx`: a slot's label on a tile or a lineup card; the Flex's with its hover, Any role.
- `RoleIcon.tsx`: the role icons: top, jungle, mid, bot, support, coach, flex.
- `Shirt.tsx`: the plain shirt with a team code.
- `roles.ts`: role names, the five player roles (`ROLE_KEYS`), the lineup order, the squad's size, each slot's icon and tag, the role a Flex plays (`flexPlays`); a player's role or coach (`PersonRole`), and the squad's nine places (`SquadSlot`, `BENCH_SLOTS`, `isBench`).
- `views.ts`: the two views' names, `Rift view | Card view` (`VIEWS`, `RIFT_VIEW`, `BoardView`).
- `BenchBar.tsx`: the bench bar, its tiles (`BenchTile`: the Rift's own `Tile` under its order and role, `1. Mid`, as FPL's bench and its `1. DEF`; it can be chosen). No swap key: tap one bench player, then the other (Craig, 16 Nov 2026).
- `PlayerPanel.tsx`: a tapped player's panel: shirt, name, meta, ✕, then the page's body. The body's pieces: `PanelSeries` (`v HLE`, its result, its games), `PanelGame` (a game, counted points boxed), `PanelSum` with `PanelSumLabel` (the sum), `PanelFoot` (`Full stats ›`).
