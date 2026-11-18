import { afterEach, vi } from "vitest";

// Browser storage for a test: a working one holding given values, or one that throws, as a
// private window's can. Tests run in node, which has no localStorage of its own.

/** A storage holding `values`, by key; it keeps what is set. */
export function keptStorage(values: Record<string, string> = {}): Pick<Storage, "getItem" | "setItem"> {
  const kept = new Map(Object.entries(values));
  return { getItem: (key) => kept.get(key) ?? null, setItem: (key, value) => void kept.set(key, value) };
}

/** A storage that throws on every read and write. */
export const blockedStorage: Pick<Storage, "getItem" | "setItem"> = {
  getItem: () => {
    throw new Error("blocked");
  },
  setItem: () => {
    throw new Error("blocked");
  },
};

/** Makes `storage` the browser's localStorage for the test; a file importing this puts it back after each test. */
export function stubStorage(storage: Pick<Storage, "getItem" | "setItem">) {
  vi.stubGlobal("localStorage", storage);
}
afterEach(() => {
  vi.unstubAllGlobals();
});

/** The view a page's View toggle has chosen, from its HTML. */
export const chosenView = (html: string) => /view-toggle__key--on" aria-pressed="true">([^<]+)</.exec(html)?.[1];
