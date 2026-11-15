# src/rift

The Rift view and Card view: the map, the tiles, the shirts, the role icons, the lineup cards and the bench. Import them from `src/rift` (`index.ts`). The Rift builds on `src/parts`, through its `index.ts`; parts never import the Rift.

- `RiftMap.tsx`: the map: river, lanes, bases, towers, pits.
- `Tile.tsx`: `Tile`, one starter on the Rift (shirt, team, role icon, C or V, name and dot, points with ×1.5, series line, tags, selected, dim or fit), and `Rift`, the map with the tiles stood on it.
- `slots.ts`: where each starter stands, in the pictures' px on the 984 × 560 Rift: `RIFT_SLOTS` (Points, Perfect game), `RIFT_SLOTS_PICK` (Pick Team). A tile stands at the same share of the Rift at any width.
- `Lineup.tsx`: Card view: `Lineup`, the seven `LineupCard`s (not the Player card screen) in the broadcast's order, with photo or crest, role head (Flex plays X, Coach 감독), C or V and a footer.
- `RoleIcon.tsx`: the role icons: top, jungle, mid, bot, support, coach, flex.
- `Shirt.tsx`: the plain shirt with a team code.
- `roles.ts`: role names, the lineup order, and each slot's icon and tag.
- `BenchBar.tsx`: the bench bar, its slim tiles (`BenchTile`, which can be chosen) and the swap key (`BenchSwap`).
- `PlayerPanel.tsx`: a tapped player's panel: shirt, name, meta, ✕, then the page's body.
