# src/rift

The Rift view and Card view: the map, the tiles, the shirts, the role icons and the lineup cards. Import them from `src/rift` (`index.ts`).

- `RiftMap.tsx`: the map: river, lanes, bases, towers, pits.
- `Tile.tsx`: `Tile`, one starter on the Rift (shirt, team, role icon, C or V, name and dot, points with ×1.5, series line, tags, selected, dim or fit), and `Rift`, the map with the tiles stood on it.
- `slots.ts`: where each starter stands: `RIFT_SLOTS` (Points, Perfect game), `RIFT_SLOTS_PICK` (Pick Team).
- `Lineup.tsx`: Card view: `Lineup`, the seven `PlayerCard`s in the broadcast's order, with photo or crest, role head (Flex plays X, Coach 감독), C or V and a footer.
- `RoleIcon.tsx`: the role icons: top, jungle, mid, bot, support, coach, flex.
- `Shirt.tsx`: the plain shirt with a team code.
- `roles.ts`: role names, the lineup order, and each slot's icon and tag.
