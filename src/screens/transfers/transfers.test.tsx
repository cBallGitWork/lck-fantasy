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

const named = (name: string) => [...TRANSFERS_PICTURE.squad, ...TRANSFERS_PICTURE.players].find((p) => p.name === name)!;

describe("Rift view mid-transfer (approved/transfers/1440.png)", () => {
  const out = text(<TransfersPage {...TRANSFERS_PICTURE} />);
  const page = html(<TransfersPage {...TRANSFERS_PICTURE} />);

  test("the title line: the week, the deadline, then the views", () => {
    expectInOrder(out, ["Transfers", "이적", "Split 1 Week 4", "Deadline Wed 7:45am 9h 45m", "Rift view", "List view"]);
    expect(out).not.toContain("Card view");
  });

  test("all nine on the Rift by role, each role said once, no bench; each tile its price and both of the week's opponents", () => {
    expectInOrder(out, ["Top", "×₩14.0m", "HLE Zeus", "v DK, NS", "×₩6.5m", "NS Kingen", "v DNS, HLE", "Jungle", "Canyon", "Cuzz", "Mid", "Faker", "Bdd", "Bot", "Ruler", "Support", "Delight", "Coach", "kkOma"]);
    expect(page.match(/class="transfers__group-role">Top</g)).toHaveLength(1);
    expect(page).not.toContain("bench-bar");
    expect(page).toContain('aria-label="Sell Zeus"');
  });

  test("the bought player has the green outline", () => {
    expect(page).toMatch(/class="tile transfers__tile--new[^"]*"[^>]*>(?:(?!class="tile ).)*NS <\/span>Kingen/);
  });

  test("Your transfers beside it: free transfers, cost and bank on their chips, the draft, Reset, Review and confirm", () => {
    expectInOrder(out, ["Your transfers", "Free transfers0", "Cost−6", "Bank₩5.5m", "Siwoo ₩11.5m → Kingen ₩6.5m", "−6", "Reset", "Review and confirm ›"]);
    expect(page).toMatch(/transfers__chip-red">−6/);
    expect(page).toMatch(/transfers__chip-green">₩5.5m/);
  });

  test("Confirmed · Week 4 under it: newest first, when and what it cost, Undo on the newest only", () => {
    expectInOrder(out, ["Confirmed · Week 4", "Kiin → Zeus", "Tue 9:10pm · −6", "Undo", "Peyz → Ruler, Lehends → Delight", "Mon 6:02pm · No cost"]);
    expect(out.match(/Undo/g)).toHaveLength(1);
  });

  test("the card under them shows the player just bought, with × Sell", () => {
    expectInOrder(out, ["Kingen", "NS · Top · ₩6.5m", "× Sell", "Full card ›", "Season · among 10 tops", "Points", "Owned", "Gold lead at 15", "games", "Solo kills", "Kills per game", "Deaths per game", "Assists per game", "First blood", "Last 3 series", "Next 3 series", "v DNS", "Thu · Bo3", "v HLE", "Sat · Bo3"]);
    expect(page).toContain('class="crest"');
    expect(out).not.toMatch(/Form\b/);
  });

  test("the list: Players, what the last + did (nothing yet), role tabs, tools, then rows by role, each with both opponents and +", () => {
    expectInOrder(out, ["Players", "All roles", "Top", "Jungle", "Mid", "Bot", "Support", "Coach", "Sort: Points ▾", "Team: All ▾", "Top", "Price", "Pts", "Owned", "Next", "PerfecT", "KT", "₩7.0m27", "v T1, DK", "Jungle", "Mid", "Chovy"]);
    expect(page).toMatch(/class="transfers__note" role="status"><\/p>/);
  });

  test("your own players are left out of the list, and nothing there carries a price arrow", () => {
    expect(page).not.toContain('aria-label="Buy Kingen"');
    expect(page).not.toContain('aria-label="Buy Zeus"');
    expect(page).not.toMatch(/class="(rise|fall)"/);
  });

  test("the list's team bars are the wide ones; the page ends with the sponsor", () => {
    expect(page).toContain("team-bar");
    expectInOrder(out, ["Ssong", "Sponsor", "All sponsors are made up."]);
  });
});

describe("a player just sold (approved/transfers/1440-sold.png)", () => {
  const plan = { sold: { flex: null }, replacing: "flex" as const };
  const out = text(<TransfersPage {...TRANSFERS_PICTURE} initialPlan={plan} />);
  const page = html(<TransfersPage {...TRANSFERS_PICTURE} initialPlan={plan} />);

  test("his slot is dashed with + and ↺ Siwoo; the list is Replacing Siwoo and opens on his role", () => {
    expect(page).toContain('aria-label="Buy a Top"');
    expect(page).toContain('aria-label="Restore Siwoo"');
    expect(out).toContain("↺ Siwoo");
    expectInOrder(out, ["Replacing Siwoo", "All roles"]);
    expect(page).toMatch(/aria-pressed="true"[^>]*>Top</);
    expect(page).not.toContain('aria-label="Buy Chovy"');
  });

  test("the draft is Siwoo → —, Review and confirm off with 1 player to buy", () => {
    expectInOrder(out, ["Siwoo ₩11.5m → —", "1 player to buy", "Review and confirm ›"]);
    expect(page).toMatch(/<button[^>]*disabled=""[^>]*>Review and confirm/);
  });

  test("before any tap the card shows the player just sold, with + Buy", () => {
    expectInOrder(out, ["Siwoo", "DK · Top · ₩11.5m", "+ Buy"]);
  });
});

describe("List view (approved/transfers/1440-list.png)", () => {
  const out = text(<TransfersPage {...TRANSFERS_PICTURE} view="List view" />);
  const page = html(<TransfersPage {...TRANSFERS_PICTURE} view="List view" />);

  test("the nine by role in the Rift's place: shirt and name, team, last week, price, form, total, both opponents, ×", () => {
    expectInOrder(out, ["Top", "Week 3", "Price", "Form", "Total", "Next", "Zeus", "HLE", "14₩14.0m16.048v DK, NS×", "Kingen", "NS", "Jungle", "Canyon", "Mid", "Faker", "Bot", "Ruler", "Support", "Delight", "Coach", "kkOma"]);
    expect(page).not.toContain('class="rift"');
    expect(page).toContain("transfers__row--new");
  });

  test("the card sits under the table", () => {
    expectInOrder(out, ["kkOma", "× Sell", "Season · among 10 tops"]);
  });

  test("a sold player's row offers him back", () => {
    const sold = { sold: { top: null }, replacing: "top" as const };
    expect(html(<TransfersPage {...TRANSFERS_PICTURE} view="List view" initialPlan={sold} />)).toContain('aria-label="Restore Zeus"');
  });
});

describe("the confirm sheet (approved/transfers/1440-confirm.png)", () => {
  test("Out and In, one row a transfer with each team and price, then free transfers used, cost and bank, the deadline, Back and Confirm", () => {
    const plan = { sold: { flex: named("Kingen"), bench1: named("Hype") }, replacing: null };
    const out = text(<TransfersPage {...TRANSFERS_PICTURE} initialPlan={plan} reviewing />);
    expectInOrder(out, [
      "Confirm your transfers",
      "Out",
      "In",
      "Siwoo DK ₩11.5m",
      "→",
      "Kingen NS ₩6.5m",
      "Bdd KT ₩5.0m",
      "→",
      "Hype KRX ₩5.5m",
      "Free transfers used0",
      "Cost−12",
      "Bank₩0.5m → ₩5.0m",
      "Deadline Wed 7:45am",
      "Back",
      "Confirm",
    ]);
  });

  test("its deadline is the Deadline part, and it stands off the page", () => {
    const out = html(<TransfersPage {...TRANSFERS_PICTURE} reviewing />);
    expectDeadlinePart(out.slice(out.indexOf("transfers__sheet-deadline")), "Wed 7:45am");
    expect(out).toContain("modal__box--strong");
  });
});

describe("before any change", () => {
  const out = text(<TransfersPage {...TRANSFERS_PICTURE} initialPlan={EMPTY_PLAN} />);
  const page = html(<TransfersPage {...TRANSFERS_PICTURE} initialPlan={EMPTY_PLAN} />);

  test("no cost, the bank as it stands, Review and confirm off with No changes, and no card yet", () => {
    expectInOrder(out, ["Free transfers0", "Cost0", "Bank₩0.5m", "No changes", "Review and confirm ›", "Players"]);
    expect(page).toMatch(/<button[^>]*disabled=""[^>]*>Review and confirm/);
    expect(page).not.toContain("transfers__card");
  });

  test("the list shows every player under All roles, coaches included", () => {
    expect(page).toMatch(/aria-pressed="true"[^>]*>All roles/);
    for (const p of TRANSFERS_PICTURE.players) expect(page).toContain(`aria-label="Buy ${p.name}"`);
  });
});

describe("once Siwoo → Kingen is confirmed (#215)", () => {
  const { squad, players, rules, confirms } = TRANSFERS_PICTURE;
  const after = confirmTransfers(squad, players, rules, [{ out: named("Siwoo").id, in: named("Kingen").id }], lineupIds(squad, PICTURE_PLAN));
  const confirm = { id: "c3", local: "Tue 10:00pm", moves: after.moves, hit: after.hit };
  const out = text(<TransfersPage {...TRANSFERS_PICTURE} squad={after.squad} rules={after.rules} confirms={[confirm, ...confirms]} initialPlan={EMPTY_PLAN} />);

  test("the squad has Kingen, the bank is the new one, and nothing is left to review", () => {
    expectInOrder(out, ["Kingen", "Free transfers0", "Cost0", "Bank₩5.5m", "No changes"]);
    expect(out).not.toContain("DK Siwoo");
  });

  test("the swap heads Confirmed · Week 4 with its cost and the only Undo", () => {
    expectInOrder(out, ["Confirmed · Week 4", "Siwoo → Kingen", "Tue 10:00pm · −6", "Undo", "Kiin → Zeus", "Peyz → Ruler"]);
    expect(out.match(/Undo/g)).toHaveLength(1);
  });
});

describe("Rift view or List view", () => {
  test("the first visit opens on Rift view", () => {
    expect(html(<TransfersPage {...TRANSFERS_PICTURE} />)).toContain('class="rift"');
  });

  test("the manager's last choice, List view, is what opens", () => {
    const page = html(<TransfersPage {...TRANSFERS_PICTURE} view="List view" />);
    expect(page).toContain("transfers__squad");
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
  expect(await htmlAt(transfersSelling("faker"))).toContain('aria-label="Restore Faker"');
  expect(await htmlAt(transfersSelling("bdd"))).toContain('aria-label="Restore Bdd"');
  expect(await htmlAt(transfersSelling("nobody"))).not.toContain("transfers__empty");
});

test("Transfers has no buff keys: every buff is played on Pick Team (spec/06)", () => {
  const out = text(<TransfersPage {...TRANSFERS_PICTURE} />);
  for (const buff of [...BUFFS, "Remake", "Limitless"]) expect(out).not.toContain(buff);
});
