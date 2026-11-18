import { describe, expect, test } from "vitest";
import { chovy, validSquad, zeus } from "../../../convex/squads/fixtures";
import { forgetGuestSquad, GUEST_SQUAD_KEY, keepGuestSquad, onLogIn, readGuestSquad } from "./guestSquad";

const THIS_COMPETITION = "lck-2027-split-1";
const OTHER_COMPETITION = "lck-2027-split-2";

/** The browser's storage, in memory: what is left after the tab closes and comes back. */
function browserStorage(): Storage {
  const items = new Map<string, string>();
  return {
    get length() { return items.size; },
    clear: () => items.clear(),
    getItem: (key) => items.get(key) ?? null,
    key: (index) => [...items.keys()][index] ?? null,
    removeItem: (key) => { items.delete(key); },
    setItem: (key, value) => { items.set(key, value); },
  };
}

describe("a guest's squad kept in the browser (spec/09, Picking as a guest)", () => {
  test("close the tab, come back tomorrow, and the squad is still there", () => {
    const storage = browserStorage();
    keepGuestSquad(storage, THIS_COMPETITION, validSquad());
    expect(readGuestSquad(storage, THIS_COMPETITION)).toEqual({ kept: "squad", squad: validSquad() });
  });

  test("a squad picked part-way is kept as it is", () => {
    const storage = browserStorage();
    const partial = { starters: [{ slot: "top" as const, pick: zeus }], bench: [chovy] };
    keepGuestSquad(storage, THIS_COMPETITION, partial);
    expect(readGuestSquad(storage, THIS_COMPETITION)).toEqual({ kept: "squad", squad: partial });
  });

  test("a first visit has nothing kept", () => {
    expect(readGuestSquad(browserStorage(), THIS_COMPETITION)).toEqual({ kept: "none" });
  });

  test("a squad kept for another competition isn't used in this one", () => {
    const storage = browserStorage();
    keepGuestSquad(storage, THIS_COMPETITION, validSquad());
    expect(readGuestSquad(storage, OTHER_COMPETITION)).toEqual({ kept: "none" });
  });

  test("once forgotten, as after sign-up makes it an entry, nothing is kept", () => {
    const storage = browserStorage();
    keepGuestSquad(storage, THIS_COMPETITION, validSquad());
    forgetGuestSquad(storage);
    expect(readGuestSquad(storage, THIS_COMPETITION)).toEqual({ kept: "none" });
  });

  test("something kept that isn't a squad is reported, not read as one", () => {
    const storage = browserStorage();
    storage.setItem(GUEST_SQUAD_KEY, "{not json");
    expect(readGuestSquad(storage, THIS_COMPETITION)).toMatchObject({ kept: "unreadable" });
    storage.setItem(GUEST_SQUAD_KEY, JSON.stringify({ competitionId: THIS_COMPETITION, squad: { starters: [{ slot: "wing", pick: zeus }], bench: [] } }));
    expect(readGuestSquad(storage, THIS_COMPETITION)).toEqual({ kept: "unreadable", reason: "not a kept squad" });
  });
});

describe("logging in with a guest squad kept (spec/09, Signing in again)", () => {
  test("an account that has a team gets it; the guest squad is dropped", () => {
    const storage = browserStorage();
    keepGuestSquad(storage, THIS_COMPETITION, validSquad());
    onLogIn(storage, true);
    expect(readGuestSquad(storage, THIS_COMPETITION)).toEqual({ kept: "none" });
  });

  test("an account with no team keeps the guest squad, to save on sign-up", () => {
    const storage = browserStorage();
    keepGuestSquad(storage, THIS_COMPETITION, validSquad());
    onLogIn(storage, false);
    expect(readGuestSquad(storage, THIS_COMPETITION)).toEqual({ kept: "squad", squad: validSquad() });
  });
});
