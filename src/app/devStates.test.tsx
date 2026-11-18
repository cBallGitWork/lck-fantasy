// @vitest-environment node
import { afterEach, expect, test, vi } from "vitest";
import { DEV_STATE_PARAM } from "../parts";
import { DEV_STATES, DEV_STATES_PATH } from "./devStates";
import { htmlAt, plain, trucksOutsideCredit } from "../testing/render";

/** What each picture shows that marks its state, as the page draws it. */
const KEY: Record<string, string> = {
  "home/live": "1/0/2",
  "home/idle": "Week 4 lineup",
  "pick-team/pick": "Rift view",
  "pick-team/cards": "Photo",
  "pick-team/swap": "On · unsaved",
  "transfers/transfers": "Review and confirm",
  "transfers/confirm": "Confirm your transfers",
  "points/points": "Zeus",
  "leagues/league": "Pub League",
  "leagues/overall": "Unkillable FC",
  "leagues/admin": "Remove a manager",
  "leagues/create": "Scoring starts",
  "leagues/created": "OFF-9R3D",
  "leagues/join": "Code or link",
  "leagues/member": "FLOL-22XB",
  "leagues/delete": "Delete Pub League?",
  "leagues/leave": "Leave Flol Discord?",
  "stats/stats": "Players",
  "stats/pergame": 'aria-pressed="true">Per game',
  "stats/coaches": "Most barons",
  "live/live": "1/0/2",
  "live/idle": "Next · Sunday",
  "live/down": "Live points down",
  "series/series": "Doran",
  "series/f21": "Gen.G",
  "series/live": "Not final",
  "series/next": "Split 1 · Week 4 · Wed 20 Jan",
  "compare/compare": "Chovy",
  "compare/pick": 'placeholder="Find a player"',
  "compare/coaches": "Coach · GEN",
  "perfect-game/rift": 'href="/player/faker"',
  "perfect-game/card": "Photo",
  "price-changes/patch": "Week 4",
  "settings/settings": "1 change: hangul banner",
  "settings/display": "Time zone",
  "settings/emails": "Deadline reminder",
  "settings/account": "Sign out",
  "settings/delete": "Backups clear within 30 days",
  "lck-hub/hub": "20–24 Jan",
  "lck-hub/results": "13–17 Jan",
  "lck-hub/standings": "Baron group",
  "lck-hub/teams": "Academy",
  "player-card/card": "+1,204 / −310 this week",
  "player-card/week": "+842 / −126 this week",
  "player-card/fixtures": "Rested for Wednesday",
  "player-card/champs": "Avg pts",
  "coach-card/coach": "+310 / −95 this week",
  "coach-card/week": "+204 / −58 this week",
  "coach-card/roster": "Oner",
  "profile/points": "Highest",
  "profile/history": "Week rank",
  "profile/transfers": "Pts gained",
  "following/following": "Cheer / Jeer ›",
  "following/truck": "One cheer or jeer to Jae a week.",
};

const named = DEV_STATES.map((s) => ({ ...s, name: `${s.page}/${s.state}` }));
const withParam = named.filter((s) => s.url.includes(`${DEV_STATE_PARAM}=`));

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

test("every listed state has its key content, and every key a state", () => {
  expect(Object.keys(KEY).sort()).toEqual(named.map((s) => s.name).sort());
  expect(new Set(named.map((s) => s.name)).size).toBe(named.length);
});

test.each(named)("$name opens at $url and shows its picture's key content", async ({ name, url, picture }) => {
  const warn = vi.spyOn(console, "warn");
  expect(await htmlAt(url)).toContain(KEY[name]);
  expect(warn).not.toHaveBeenCalled();
  expect(picture).toMatch(/^docs\/design\/approved\/[a-z-]+\/1440(-\w+)?\.png$/);
});

test.each(named)("$name says Truck only in the truck-hire credit", async ({ url }) => {
  expect(trucksOutsideCredit(plain(await htmlAt(url)))).toEqual([]);
});

test.each(withParam)("$name is the param's doing: its route alone doesn't show it", async ({ name, url }) => {
  expect(await htmlAt(url.split("?")[0]!)).not.toContain(KEY[name]);
});

test("a build ignores the param", async () => {
  vi.stubEnv("DEV", false);
  const idle = withParam.find((s) => s.name === "home/idle")!;
  expect(await htmlAt(idle.url)).not.toContain(KEY["home/idle"]);
});

test("a state a screen can't open is said, not dropped", async () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  expect(await htmlAt(`/?${DEV_STATE_PARAM}=nope`)).toContain(KEY["home/live"]);
  expect(warn).toHaveBeenCalledWith(expect.stringContaining('No dev state "nope"'));
});

test("/dev/states links every state", async () => {
  const page = await htmlAt(DEV_STATES_PATH);
  for (const { url, picture } of DEV_STATES) {
    expect(page).toContain(`href="${url.replace(/&/g, "&amp;")}"`);
    expect(page).toContain(picture);
  }
});
