// @vitest-environment node
import { describe, expect, test } from "vitest";
import { html, text } from "../../testing/render";
import { TRANSFERS_PICTURE, SQUAD } from "./fixtures";
import { EMPTY_PLAN } from "./plan";
import { TransfersPage, under } from "./TransfersPage";

/** Fails unless each piece is found after the one before it. */
function expectInOrder(out: string, pieces: string[]) {
  let from = 0;
  for (const piece of pieces) {
    const at = out.indexOf(piece, from);
    expect(at, `"${piece}" after position ${from}`).toBeGreaterThanOrEqual(0);
    from = at + piece.length;
  }
}

describe("Rift view mid-transfer (transfers.html)", () => {
  const out = text(<TransfersPage {...TRANSFERS_PICTURE} />);

  test("the head, the strip and the controls, in the picture's order", () => {
    expectInOrder(out, [
      "Transfers",
      "이적",
      "LCK Cup Week 4 · Deadline Wed 07:45 16:45 KST 9h 45m",
      "Free transfers 0",
      "Pending hit −6",
      "Bank ₩1.5m",
      "Remake",
      "Limitless",
      "Rift view",
      "Card view",
      "Show: Fixtures ▾",
    ]);
  });

  test("the Rift with Kingen in the Flex, the bench, then the changes bar", () => {
    expectInOrder(out, [
      "Zeus",
      "v DK · v NS",
      "Canyon",
      "Faker",
      "kkOma",
      "Coach 감독",
      "Kingen",
      "v DNS · v HLE",
      "Flex · plays Top",
      "Delight",
      "Ruler",
      "Bench",
      "Bdd",
      "Cuzz",
      "1 transfer · −6 · Siwoo ₩7.5m → Kingen ₩6.5m · bank ₩0.5m → ₩1.5m",
      "Reset",
      "Review and confirm ›",
    ]);
    expect(out).not.toContain("Siwoo DK");
  });

  test("the list replacing Siwoo: the buyable by points, then the greyed with why", () => {
    expectInOrder(out, [
      "Replacing Siwoo",
      "All roles",
      "Support",
      "Sort: Points ▾",
      "Team: All ▾",
      "Player",
      "Price",
      "Pts",
      "Owned",
      "Next",
      "Kingen NS₩6.5m389%v DNS Thu✓",
      "DuDu DNS₩6.0m336%v NS Thu+",
      "Hype KRX",
      "Clear BFX",
      "Clozer BRO",
      "Pollu BRO",
      "Chovy GENTeam full₩17.5m",
      "Keria T1Team full",
      "Aiming DKOver budget",
      "ShowMaker DKOver budget",
      "Lucid DKOver budget",
      "PerfecT KTTeam full",
    ]);
  });

  test("a greyed row can't be bought; the picked one is pressed; price moves show ▲ or ▼", () => {
    const page = html(<TransfersPage {...TRANSFERS_PICTURE} />);
    expect(page).toMatch(/disabled=""[^>]*aria-label="Chovy: Team full"/);
    expect(page).toMatch(/aria-pressed="true"[^>]*aria-label="Buy Kingen"/);
    expect(page).toMatch(/Kingen<\/b> NS.*?class="rise"/);
    expect(page).toMatch(/DuDu<\/b> DNS.*?class="fall"/);
    expect(page).not.toMatch(/Clozer<\/b> BRO.*?class="(rise|fall)".*?Pollu/);
  });

  test("the week's confirms, newest first, Undo on the newest only", () => {
    expectInOrder(out, ["Confirmed · Week 4", "your time · KST", "Tue 21:10", "06:10 KST", "Kiin → Zeus", "−6", "Undo", "Mon 18:02", "03:02 KST", "Peyz → Ruler, Lehends → Delight", "Free"]);
    expect(out.match(/Undo/g)).toHaveLength(1);
  });

  test("a confirm made under a buff has no Undo", () => {
    const confirms = [{ ...TRANSFERS_PICTURE.confirms[0]!, buff: "Remake" }];
    expect(text(<TransfersPage {...TRANSFERS_PICTURE} confirms={confirms} />)).not.toContain("Undo");
  });
});

describe("the confirm sheet (confirm.html)", () => {
  test("out, in, cost and bank, then Back or Confirm with the deadline", () => {
    const out = text(<TransfersPage {...TRANSFERS_PICTURE} reviewing />);
    expectInOrder(out, [
      "Confirm your transfers",
      "Out",
      "Siwoo DK · Flex · ₩7.5m",
      "In",
      "Kingen NS · Flex, plays Top · ₩6.5m",
      "Cost",
      "−6 · no free transfers left",
      "Bank",
      "₩0.5m → ₩1.5m",
      "Back",
      "Confirm",
      "Deadline Wed 07:45 16:45 KST",
    ]);
  });
});

describe("before any change", () => {
  const out = text(<TransfersPage {...TRANSFERS_PICTURE} initialPlan={EMPTY_PLAN} />);

  test("the squad as it stands, no hit, and Review and confirm off with why", () => {
    expectInOrder(out, ["Free transfers 0", "Pending hit 0", "Bank ₩0.5m", "Siwoo", "Flex · plays Top", "No changes", "Review and confirm ›", "Players"]);
    expect(html(<TransfersPage {...TRANSFERS_PICTURE} initialPlan={EMPTY_PLAN} />)).toMatch(/<button[^>]*disabled=""[^>]*>Review and confirm/);
  });
});

describe("Rift view or Card view", () => {
  test("the first visit opens on Rift view", () => {
    expect(html(<TransfersPage {...TRANSFERS_PICTURE} />)).toContain('class="rift"');
  });

  test("the manager's last choice, Card view, is what opens", () => {
    const page = html(<TransfersPage {...TRANSFERS_PICTURE} view="Card view" />);
    expect(page).not.toContain('class="rift"');
    expect(page).toContain('class="lineup"');
    expect(page).toMatch(/aria-pressed="true"[^>]*>Card view/);
  });
});

test("Show puts fixtures, price or owned under a player", () => {
  const zeus = SQUAD[0]!;
  expect(under("Fixtures", zeus, TRANSFERS_PICTURE.fixtures)).toBe("v DK · v NS");
  expect(under("Price", zeus, TRANSFERS_PICTURE.fixtures)).toBe("₩16.0m");
  expect(under("Owned", zeus, TRANSFERS_PICTURE.fixtures)).toBe("31%");
});
