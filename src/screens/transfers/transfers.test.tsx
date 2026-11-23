// @vitest-environment node
import { describe, expect, test } from "vitest";
import { VIEW_KEYS } from "../../parts";
import { PATHS, transfersSelling } from "../../paths";
import { BUFFS } from "../../fixtures/competition";
import { expectDeadlinePart, expectInOrder, html, htmlAt, text } from "../../testing/render";
import { blockedStorage, chosenView, keptStorage, stubStorage } from "../../testing/storage";
import { PICTURE_PLAN, TRANSFERS_PICTURE } from "./fixtures";
import { lineupIds } from "./lineup";
import { confirmTransfers, EMPTY_PLAN } from "./plan";
import { TransfersPage } from "./TransfersPage";

describe("Rift view mid-transfer (transfers.html, changed by Craig 16 Nov 2026)", () => {
  const out = text(<TransfersPage {...TRANSFERS_PICTURE} />);
  const page = html(<TransfersPage {...TRANSFERS_PICTURE} />);

  test("the head with free transfers, cost and bank, then the controls", () => {
    expectInOrder(out, [
      "Transfers",
      "이적",
      "Split 1 Week 4 · Deadline Wed 07:45 9h 45m",
      "Free transfers 0",
      "Cost −6",
      "Bank ₩5.5m",
      "Rift view",
      "List view",
    ]);
    expect(out).not.toContain("Show:");
    expect(out).not.toContain("Card view");
  });

  test("all nine on the Rift by role, no bench, each with his price over his shirt; the two Tops together", () => {
    expectInOrder(out, ["₩14.0m", "Zeus", "₩6.5m", "Kingen", "₩15.5m", "Canyon", "₩4.0m", "Cuzz", "₩18.5m", "Faker", "₩5.0m", "Bdd", "₩16.0m", "Ruler", "₩10.0m", "Delight", "₩7.0m", "kkOma"]);
    expect(page).not.toContain("bench-bar");
    expect(out).not.toContain("Siwoo DK");
  });

  test("no price arrows and no crests on the page", () => {
    expect(page).not.toMatch(/class="(rise|fall)"/);
    expect(page).not.toContain("crest");
  });

  test("the changes bar: each transfer, Reset, Review and confirm", () => {
    expectInOrder(out, ["Siwoo ₩11.5m → Kingen ₩6.5m", "Reset", "Review and confirm ›"]);
  });

  test("the list: everyone buyable, Next the opponent alone", () => {
    expectInOrder(out, ["Players", "All roles", "Support", "Sort: Points ▾", "Team: All ▾", "Player", "Price", "Pts", "Owned", "Next", "Chovy GEN₩17.5m6141%v BRO+", "Keria T1"]);
    expect(out).not.toMatch(/v [A-Z0-9]+ (Mon|Tue|Wed|Thu|Fri|Sat|Sun)/);
  });

  test("the week's confirms, newest first, Undo on the newest only", () => {
    expectInOrder(out, ["Confirmed · Week 4Tue 21:10Kiin → Zeus", "−6", "Undo", "Mon 18:02Peyz → Ruler, Lehends → Delight", "No cost"]);
    expect(out.match(/Undo/g)).toHaveLength(1);
  });

});

describe("List view (Craig, 16 Nov 2026)", () => {
  const out = text(<TransfersPage {...TRANSFERS_PICTURE} view="List view" />);

  test("the nine by role, as FPL's list: last week, price, form, total, next, ×", () => {
    expectInOrder(out, [
      "Player",
      "Week 3",
      "Price",
      "Form",
      "Total",
      "Next",
      "Top",
      "Zeus HLE14₩14.0m16.048v DK×",
      "Kingen NS8₩6.5m8.024v DNS×",
      "Jungle",
      "Canyon GEN",
      "Cuzz KT",
      "Mid",
      "Faker T1",
      "Bdd KT",
      "Bot",
      "Ruler GEN",
      "Support",
      "Delight HLE",
      "Coach",
      "kkOma T1",
    ]);
    expect(html(<TransfersPage {...TRANSFERS_PICTURE} view="List view" />)).not.toContain('class="rift"');
  });

  test("a removed player's row offers him back", () => {
    const plan = { sold: { top: null }, replacing: "top" as const };
    expect(html(<TransfersPage {...TRANSFERS_PICTURE} view="List view" initialPlan={plan} />)).toContain('aria-label="Restore Zeus"');
  });
});

describe("the confirm sheet (confirm.html, changed by Craig 16 Nov 2026)", () => {
  test("one row per transfer, out → in with each price, then cost, bank and free transfers used", () => {
    const kingen = TRANSFERS_PICTURE.players.find((p) => p.name === "Kingen")!;
    const hype = TRANSFERS_PICTURE.players.find((p) => p.name === "Hype")!;
    const plan = { sold: { flex: kingen, bench1: hype }, replacing: null };
    const out = text(<TransfersPage {...TRANSFERS_PICTURE} initialPlan={plan} reviewing />);
    expectInOrder(out, [
      "Confirm your transfers",
      "Siwoo DK ₩11.5m",
      "→",
      "Kingen NS ₩6.5m",
      "Bdd KT ₩5.0m",
      "→",
      "Hype KRX ₩5.5m",
      "Cost",
      "−12",
      "Bank",
      "₩0.5m → ₩5.0m",
      "Free transfers used",
      "0 of 0",
      "Back",
      "Confirm",
      "Deadline Wed 07:45",
    ]);
  });

  test("its deadline is the Deadline part, as on Pick Team", () => {
    const out = html(<TransfersPage {...TRANSFERS_PICTURE} reviewing />);
    expectDeadlinePart(out.slice(out.indexOf("transfers__sheet-deadline")), "Wed 07:45");
  });

  test("it stands out from the page", () => {
    expect(html(<TransfersPage {...TRANSFERS_PICTURE} reviewing />)).toContain("modal__box--strong");
  });
});

describe("before any change", () => {
  test("the squad as it stands, no cost, and Review and confirm off with why", () => {
    const out = text(<TransfersPage {...TRANSFERS_PICTURE} initialPlan={EMPTY_PLAN} />);
    expectInOrder(out, ["Free transfers 0", "Cost 0", "Bank ₩0.5m", "Siwoo", "No changes", "Review and confirm ›", "Players"]);
    expect(html(<TransfersPage {...TRANSFERS_PICTURE} initialPlan={EMPTY_PLAN} />)).toMatch(/<button[^>]*disabled=""[^>]*>Review and confirm/);
  });
});

describe("once Siwoo → Kingen is confirmed (#215)", () => {
  const { squad, players, rules, confirms } = TRANSFERS_PICTURE;
  const id = (name: string) => [...squad, ...players].find((p) => p.name === name)!.id;
  const after = confirmTransfers(squad, players, rules, [{ out: id("Siwoo"), in: id("Kingen") }], lineupIds(squad, PICTURE_PLAN));
  const confirm = { id: "c3", local: "Tue 22:00", moves: after.moves, hit: after.hit };
  const out = text(<TransfersPage {...TRANSFERS_PICTURE} squad={after.squad} rules={after.rules} confirms={[confirm, ...confirms]} initialPlan={EMPTY_PLAN} />);

  test("the squad has Kingen, the bank is the new one, and nothing is left to review", () => {
    expectInOrder(out, ["Free transfers 0", "Cost 0", "Bank ₩5.5m", "Kingen", "No changes"]);
    expect(out).not.toContain("Siwoo DK");
  });

  test("the swap heads Confirmed · Week 4 with its cost and the only Undo", () => {
    expectInOrder(out, ["Confirmed · Week 4", "Tue 22:00", "Siwoo → Kingen", "−6", "Undo", "Kiin → Zeus", "Peyz → Ruler"]);
    expect(out.match(/Undo/g)).toHaveLength(1);
  });
});

describe("Rift view or List view", () => {
  test("the first visit opens on Rift view", () => {
    expect(html(<TransfersPage {...TRANSFERS_PICTURE} />)).toContain('class="rift"');
  });

  test("the manager's last choice, List view, is what opens", () => {
    const page = html(<TransfersPage {...TRANSFERS_PICTURE} view="List view" />);
    expect(page).toContain('class="transfers__squad"');
    expect(page).toMatch(/aria-pressed="true"[^>]*>List view/);
  });

  test("the route opens on the view Transfers kept, apart from the one Pick Team shares, and on Rift where storage is blocked", async () => {
    stubStorage(keptStorage({ [VIEW_KEYS.transfers]: "List view" }));
    expect(chosenView(await htmlAt(PATHS.transfers))).toBe("List view");
    stubStorage(keptStorage({ [VIEW_KEYS.board]: "Card view" }));
    expect(chosenView(await htmlAt(PATHS.transfers))).toBe("Rift view");
    stubStorage(blockedStorage);
    expect(chosenView(await htmlAt(PATHS.transfers))).toBe("Rift view");
  });
});

test("arriving from a player card's Transfer out, his slot is sold, whatever slot he stands in", async () => {
  const sold = new RegExp(`class="tile tile--selected tile--empty"(?:(?!class="tile ).)*title="Mid"`);
  expect(await htmlAt(transfersSelling("faker"))).toMatch(sold);
  expect(await htmlAt(transfersSelling("bdd"))).toMatch(sold);
  expect(await htmlAt(transfersSelling("nobody"))).not.toContain("tile--empty");
});

describe("a sold player's slot (spec/12, A sold player's slot)", () => {
  const plan = { sold: { top: null }, replacing: "top" as const };
  const page = html(<TransfersPage {...TRANSFERS_PICTURE} initialPlan={plan} />);
  const tile = page.match(/<div class="tile [^"]*tile--empty"(?:(?!<div class="tile[ "]).)*/)?.[0] ?? "";

  test("is a dashed empty slot with his role and +, as the front door's, and ↺ to put him back", () => {
    expect(page.match(/tile--empty/g)).toHaveLength(1);
    expect(tile).toContain('title="Top"');
    expect(tile).toContain('class="tile__sell" aria-hidden="true">↺');
    expect(tile).toMatch(/class="tile__line[^"]*">\+</);
    expect(tile).not.toContain("Zeus");
    expect(tile).not.toContain("tile__price");
    expect(page).not.toContain("tile--dim");
  });
});

describe("before anyone is sold (spec/12)", () => {
  const out = text(<TransfersPage {...TRANSFERS_PICTURE} initialPlan={EMPTY_PLAN} />);
  const page = html(<TransfersPage {...TRANSFERS_PICTURE} initialPlan={EMPTY_PLAN} />);

  test("the list shows every player under All roles, coaches included", () => {
    expect(page).toMatch(/aria-pressed="true"[^>]*>All roles/);
    for (const p of TRANSFERS_PICTURE.players) expect(page).toContain(`aria-label="Buy ${p.name}"`);
  });

  test("the role chips are All roles, the five roles, then Coach", () => {
    expectInOrder(out, ["All roles", "Top", "Jungle", "Mid", "Bot", "Support", "Coach", "Sort: Points ▾"]);
  });
});

test("Transfers has no buff keys: every buff is played on Pick Team (spec/06)", () => {
  const out = text(<TransfersPage {...TRANSFERS_PICTURE} />);
  for (const buff of [...BUFFS, "Remake", "Limitless"]) expect(out).not.toContain(buff);
});
