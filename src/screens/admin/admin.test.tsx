// @vitest-environment node
import { describe, expect, test } from "vitest";
import { html, text } from "../../testing/render";
import { AdminPage, PasswordForm, playedLine, simMoment, type Alert, type Read } from "./AdminPage";
import type { SimState } from "../../../convex/admin/sim";
import { WORDS } from "./words";

/** A day in January 2027, at `hour` in KST (UTC+9). */
const kst = (day: number, hour: number) => Date.UTC(2027, 0, day, hour - 9);

const page = (sim: Read<SimState>, alerts: Read<Alert[]> = [], tab?: "Sim" | "Alerts") => (
  <AdminPage sim={sim} alerts={alerts} tab={tab} onPress={() => Promise.reject(new Error("unpressed"))} />
);

describe("the admin section (#398)", () => {
  test("the Sim tab shows the sim's date and both keys", () => {
    const state = { sim: true, now: kst(16, 0), gamesLeft: true } as const;
    const out = html(page(state));
    expect(out).toContain('data-screen="admin"');
    expect(text(page(state))).toContain("Sim date: Sat 16 Jan 00:00 KST");
    expect(out.match(/<button type="button" class="admin__press key-off">/g)).toHaveLength(2);
  });

  test("the keys are greyed out once no game is left", () => {
    const out = html(page({ sim: true, now: kst(16, 0), gamesLeft: false }));
    expect(out.match(/disabled=""/g)).toHaveLength(2);
    expect(out).toContain(WORDS.noGamesLeft);
  });

  test("the real site, a sim whose clock isn't started, and a failed read say so", () => {
    expect(text(page({ sim: false }))).toContain(WORDS.notSim);
    expect(text(page({ sim: true, now: null }))).toContain(WORDS.notStarted);
    expect(text(page(new Error("Server down")))).toContain("Server down");
  });

  test("Alerts lists each alert with its moment, or says there are none", () => {
    const alerts = [{ at: kst(15, 18), message: "T1 v Gen.G game 1: the live feed is down." }];
    const out = text(page({ sim: false }, alerts, "Alerts"));
    expect(out).toContain("Fri 15 Jan 18:00 KST");
    expect(out).toContain("T1 v Gen.G game 1: the live feed is down.");
    expect(text(page({ sim: false }, [], "Alerts"))).toContain(WORDS.noAlerts);
  });

  test("the password form says why a password was refused", () => {
    expect(text(<PasswordForm onPassword={() => {}} refused={WORDS.refused.wrongPassword} />)).toContain(WORDS.refused.wrongPassword);
  });
});

describe("a press's line", () => {
  test("names the day played, its series and any deadline passed", () => {
    expect(playedLine({ to: kst(16, 0), series: 2, deadlines: [1] })).toBe("Fri 15 Jan: 2 series played, GW1 deadline passed");
    expect(playedLine({ to: kst(17, 0), series: 1, deadlines: [] })).toBe("Sat 16 Jan: 1 series played");
    expect(playedLine({ to: kst(18, 0), series: 9, deadlines: [2, 3] })).toBe("Sun 17 Jan: 9 series played, GW2, GW3 deadlines passed");
    expect(playedLine({ to: null, series: 0, deadlines: [] })).toBe(WORDS.noGamesLeft);
  });

  test("a moment is written in the region's zone", () => {
    expect(simMoment(kst(15, 17))).toBe("Fri 15 Jan 17:00 KST");
    expect(simMoment(kst(15, 17), false)).toBe("Fri 15 Jan");
  });
});
