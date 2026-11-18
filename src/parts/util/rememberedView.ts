// The view a manager last chose, kept in this browser, so per device, a guest's too (spec/12, Pick
// Team and Transfers). Where storage is blocked (a private window) the first view opens and nothing is kept.

/** Where each remembered view is kept: Pick Team, Points and Perfect game share one; Transfers keeps its own. */
export const VIEW_KEYS = { board: "flol.boardView", transfers: "flol.transfersView" } as const;
export type ViewKey = (typeof VIEW_KEYS)[keyof typeof VIEW_KEYS];

type ViewStorage = Pick<Storage, "getItem" | "setItem">;

const browserStorage = (): ViewStorage | undefined => (typeof localStorage === "undefined" ? undefined : localStorage);

/** The view kept under `key`, or the first of `views` on the first visit, for an unknown value, or where storage can't be read. */
export function rememberedView<T extends string>(key: ViewKey, views: readonly [T, ...T[]], storage = browserStorage()): T {
  try {
    const kept = storage?.getItem(key);
    return views.find((v) => v === kept) ?? views[0];
  } catch {
    return views[0];
  }
}

/** Keeps `view` under `key`; where storage is blocked, the view is simply not remembered. */
export function rememberView(key: ViewKey, view: string, storage = browserStorage()) {
  try {
    storage?.setItem(key, view);
  } catch {
    // Storage blocked: nothing kept, the page goes on.
  }
}
