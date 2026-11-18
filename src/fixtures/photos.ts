// Each player's media-day portrait for the split, held as data per competition:
// data/lck/photos/<year>/split-<n>/<handle>.<jpg|png|webp>, saved from the LCK's Flickr and served
// by Flol (spec/13). None are saved until the 2027 media days are shot, so every card shows its
// team's crest.

import season from "../../data/lck/season-2027.json";

/** Every saved portrait's URL, by `<year>/split-<n>/<handle>`. */
const PHOTOS: Record<string, string> = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>("../../data/lck/photos/*/*/*.{jpg,png,webp}", { eager: true, query: "?url", import: "default" }),
  ).map(([path, url]) => [path.match(/([^/]+\/[^/]+\/[^/]+)\.\w+$/)?.[1] ?? path, url]),
);

const [split] = season.splits;
if (!split) throw new Error("data/lck/season-2027.json has no split");

/** The split the pictures show. */
const PHOTO_SPLIT = `${season.year}/split-${split.number}`;

/** A player's portrait for the pictures' split, by handle; none until it is saved. */
export const photoOf = (handle: string): string | undefined => PHOTOS[`${PHOTO_SPLIT}/${handle}`];
