// @vitest-environment node
import { describe, expect, test } from "vitest";
import { html, text } from "../../testing/render";
import { AdminPage, PasswordForm, playedLine, simMoment, type Alert, type Read } from "./AdminPage";
import type { SimState } from "../../../convex/admin/sim";
import { WORDS } from "./words";

/** A day in January 2027, at `hour` in KST (UTC+9), the league's zone the sim runs on. */
const kst = (day: number, hour: number) => Date.UTC(2027, 0, day, hour - 9);

/** The admin's own zone: London, UTC+0 in January. */
const ZONE = "Europe/London";

const page = (sim: Read<SimState>, alerts: Read<Alert[]> = [], tab?: "Sim" | "Alerts") => (
  <AdminPage sim={sim} alerts={alerts} tab={tab} zone={ZONE} onPress={() => Promise.reject(new Error("unpressed"))} />
);

describe("the admin section (#398)", () => {
  test("the Sim tab shows the sim's date in the admin's own time, and both keys", () => {
    const state = { sim: true, now: kst(16, 0), gamesLeft: true } as const;
    const out = html(page(state));
    expect(out).toContain('data-screen="admin"');
    expect(text(page(state))).toContain("Sim date: Fri 15 Jan 15:00");
    expect(out).not.toContain("KST");
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
    expect(out).toContain("Fri 15 Jan 09:00T1 v Gen.G game 1: the live feed is down.");
    expect(text(page({ sim: false }, [], "Alerts"))).toContain(WORDS.noAlerts);
  });

  test("the password form says why a password was refused", () => {
    expect(text(<PasswordForm onPassword={() => {}} refused={WORDS.refused.wrongPassword} />)).toContain(WORDS.refused.wrongPassword);
  });
});

describe("a press's line", () => {
  test("names the day played, its series and any deadline passed", () => {
    expect(playedLine({ to: kst(16, 0), series: 2, deadlines: [1] }, ZONE)).toBe("Fri 15 Jan: 2 series played, GW1 deadline passed");
    expect(playedLine({ to: kst(17, 0), series: 1, deadlines: [] }, ZONE)).toBe("Sat 16 Jan: 1 series played");
    expect(playedLine({ to: kst(18, 0), series: 9, deadlines: [2, 3] }, ZONE)).toBe("Sun 17 Jan: 9 series played, GW2, GW3 deadlines passed");
    expect(playedLine({ to: null, series: 0, deadlines: [] }, ZONE)).toBe(WORDS.noGamesLeft);
  });

  test("a moment is written in the admin's own zone, with no label", () => {
    expect(simMoment(kst(15, 17), ZONE)).toBe("Fri 15 Jan 08:00");
    expect(simMoment(kst(15, 17), "Asia/Seoul")).toBe("Fri 15 Jan 17:00");
    expect(simMoment(kst(15, 17), ZONE, false)).toBe("Fri 15 Jan");
  });
});
