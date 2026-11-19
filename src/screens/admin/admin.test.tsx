// @vitest-environment node
import { describe, expect, test } from "vitest";
import { html, text } from "../../testing/render";
import { AdminPage, PasswordForm, playedLine, simMoment, type Alert, type Read } from "./AdminPage";
import type { SeasonReport } from "../../../convex/admin/seasonReport";
import type { SimState } from "../../../convex/admin/sim";
import { WORDS, type AdminTab } from "./words";

/** A day in January 2027, at `hour` in KST (UTC+9). */
const kst = (day: number, hour: number) => Date.UTC(2027, 0, day, hour - 9);

const page = (sim: Read<SimState>, alerts: Read<Alert[]> = [], tab?: AdminTab, report: Read<SeasonReport> = undefined) => (
  <AdminPage
    sim={sim}
    alerts={alerts}
    report={report}
    tab={tab}
    onPress={() => Promise.reject(new Error("unpressed"))}
    onClose={() => Promise.reject(new Error("unclosed"))}
  />
);

const alert = (fields: Partial<Alert>): Alert => ({
  id: "a1", at: kst(15, 18), kind: "feedDown", message: "T1 v Gen.G game 1: the live feed is down.", names: ["game-1"], open: true, ...fields,
});

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

  test("Alerts lists each alert with its moment, kind and names, or says there are none", () => {
    const out = text(page({ sim: false }, [alert({})], "Alerts"));
    expect(out).toContain("Fri 15 Jan 18:00 KST");
    expect(out).toContain(WORDS.kind.feedDown);
    expect(out).toContain("T1 v Gen.G game 1: the live feed is down.");
    expect(out).toContain("game-1");
    expect(text(page({ sim: false }, [], "Alerts"))).toContain(WORDS.noAlerts);
  });

  test("an open alert has a Close key; a closed one says so", () => {
    const open = html(page({ sim: false }, [alert({})], "Alerts"));
    expect(open).toContain(`>${WORDS.close}</button>`);
    const closed = html(page({ sim: false }, [alert({ open: false })], "Alerts"));
    expect(closed).not.toContain(`>${WORDS.close}</button>`);
    expect(closed).toContain(WORDS.closedAlert);
  });

  test("Report shows open alerts by kind, the mismatches and the prices", () => {
    const report: SeasonReport = {
      season: "LCK 2027",
      openAlerts: { feedDown: 1, noLaneOpponent: 0, pointsMismatch: 2 },
      mismatches: 3,
      prices: {
        roles: [{ role: "mid", start: { dearest: { name: "Faker", won: 18_500_000 }, cheapest: { name: "Zeka", won: 15_000_000 } }, end: null }],
        weeks: [{ gameweek: 2, rises: 3, falls: 1 }],
        risers: [{ name: "Faker", won: 400_000 }],
        fallers: [],
      },
    };
    const out = text(page({ sim: false }, [], "Report", report));
    expect(out).toContain("LCK 2027");
    expect(out).toContain(`${WORDS.kind.feedDown} 1 · ${WORDS.kind.noLaneOpponent} 0 · ${WORDS.kind.pointsMismatch} 2`);
    expect(out).toContain(`${WORDS.mismatches}: 3`);
    expect(out).toContain("Faker ₩18.5m, Zeka ₩15.0m");
    expect(out).toContain("Week 2: 3 up, 1 down");
    expect(out).toContain(`${WORDS.risers}: Faker ₩0.4m`);
    expect(out).toContain(`${WORDS.fallers}: ${WORDS.none}`);
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
