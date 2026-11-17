// @vitest-environment node
import { describe, expect, test } from "vitest";
import { expectDeadlinePart, expectInOrder, html, noop, text } from "../../testing/render";
import { accept, decline, movesSummary, playersLine, receiverLine, removeFollower, sendTruck, unfollow, type DeadlineItem } from "./feed";
import { FOLLOWING, PICKER_AS_DRAWN } from "./fixtures";
import { FollowingScreen } from ".";
import { FollowingView } from "./FollowingView";
import { TruckPicker } from "./TruckPicker";

const view = (data = FOLLOWING) => (
  <FollowingView data={data} onTruck={noop} onAccept={noop} onDecline={noop} onUnfollow={noop} onRemove={noop} onBlock={noop} />
);

describe("the page (1440.png)", () => {
  const out = text(view());

  test("shows the feed, newest first, under a head per gameweek", () => {
    expectInOrder(out, [
      "Following",
      "팔로잉",
      "Week 3",
      "Not final",
      "Deadline Wed 07:45 16:45 KST",
      "Minji Park",
      "Chovy Was Right There",
      "20",
      "GEN 2–1 HLE",
      "Kiin 5 · Canyon 7 · Chovy 8",
      "Ended Sat 10:20 19:20 KST",
      "Truck ›",
      "Jae Kim",
      "NS 0–2 KRX",
      "Rich 4 · ucal 2 (Captain) · Lehends 3",
      "Ended Fri 13:00 22:00 KST",
      "Truck ›",
      "Dan Okafor",
      "T1 2–1 HLE",
      "Oner 11 · Faker 18 (12 × 1.5) · Keria 5",
      "Coffee sent",
      "Minji Park",
      "Limitless, 5 transfers",
      "so far",
      "Doran → Kiin+9",
      "Peyz → Ruler+4",
      "Lehends → Keria−1",
      "+ 2 more",
      "Truck ›",
      "Dan Okafor",
      "2 transfers, −6",
      "Lucid → Oner0",
      "Chovy → Faker+24",
      "Coffee sent",
      "Jae Kim",
      "no transfers",
      "Truck ›",
      "Week 2",
      "Jae Kim",
      "GEN 2–0 BRO",
      "Big Captain",
      "Ruler 21 (14 × 1.5)",
      "Minji Park",
      "Chovy 21",
      "Ended Sun 12:30 21:30 KST",
    ]);
  });

  test("a week's deadline is the Deadline part, as on Pick Team", () => {
    expectDeadlinePart(html(view()), "Wed 07:45");
  });

  test("shows requests, trucks, following and followers on the right, then the sponsor note", () => {
    expectInOrder(out, [
      "Requests2",
      "Ella Wong",
      "Ruler of None",
      "Accept",
      "Decline",
      "Joe Grant",
      "Trucks",
      "CHOVY CS. RULER DPS. YOUR SQUAD. 화이팅!",
      "Coffee from Minji Park",
      "THIS TRUCK WAS FUNDED BY YOUR −6.",
      "Protest from Dan Okafor",
      "WINNER WINNER, GANK CHICKEN. 98 PTS.",
      "Sponsor truck, Pub League top",
      "갱 치킨 Gank Chicken",
      "Following3 of 50",
      "Minji Park",
      "Unfollow",
      "Dan Okafor",
      "Jae Kim",
      "Followers5",
      "Minji Park",
      "Remove",
      "Block",
      "Tom Reid",
      "Sam Hill",
      "Priya Shah",
      "Zeus Juice",
      "All sponsors are made up.",
    ]);
  });

  test("each repeated key names its manager for a screen reader", () => {
    const markup = html(view());
    for (const name of ['aria-label="Accept Ella Wong"', 'aria-label="Decline Ella Wong"', 'aria-label="Unfollow Minji Park"', 'aria-label="Remove Minji Park"', 'aria-label="Block Minji Park"', 'aria-label="Truck Minji Park"']) {
      expect(markup).toContain(name);
    }
  });

  test("trucks only the live week: Week 2's rows have none", () => {
    const week2 = out.slice(out.indexOf("Week 2"));
    expect(week2).not.toContain("Truck ›");
    expect(out.match(/Truck ›/g)).toHaveLength(4);
  });

  test("a manager's name opens their profile, and the page sits in its frame", () => {
    const page = html(view());
    expect(page).toContain('data-screen="following"');
    expect(page).toContain('href="/manager/minji"');
    expect(page).toContain('href="/manager/priya"');
  });

  test("draws each truck received on the shared LED panel", () => {
    expect(html(view())).toContain('<div class="led">THIS TRUCK WAS FUNDED BY YOUR −6.</div>');
  });

  test("the screen renders on its fixture", () => {
    expect(text(<FollowingScreen />)).toContain("Limitless, 5 transfers");
  });
});

describe("the truck picker (1440-truck.png)", () => {
  const jae = FOLLOWING.following.find((m) => m.id === PICKER_AS_DRAWN.managerId)!;
  const picker = (
    <TruckPicker
      receiver={jae}
      line={receiverLine(FOLLOWING, jae)}
      lines={FOLLOWING.receivers.jae!.lines}
      kind={PICKER_AS_DRAWN.kind}
      picked={PICKER_AS_DRAWN.lineId}
      onKind={noop}
      onPick={noop}
      onSend={noop}
      onClose={noop}
    />
  );

  test("shows Jae's week, the kinds, the protest lines, the preview, then Cancel and Send truck", () => {
    expectInOrder(text(picker), [
      "Truck Jae Kim",
      "Deft Tomorrow · Week 3 · 31 pts so far, no transfers",
      "Coffee 커피차",
      "Protest 시위 트럭",
      "MANAGEMENT MUST EXPLAIN THIS CAPTAIN PICK. 2 PTS.",
      "NO TRANSFER AGAIN. IS ANYONE AT HEADQUARTERS?",
      "SET AND FORGET IS NOT A PHILOSOPHY. IT'S A NAP.",
      "31 POINTS. WE ARE NOT ANGRY. WE ARE GUTTED.",
      "THE TEMPLATE WAS RIGHT THERE, MATE.",
      "MANAGEMENT MUST EXPLAIN THIS CAPTAIN PICK. 2 PTS.",
      "One truck to Jae a week.",
      "Cancel",
      "Send truck",
    ]);
  });

  test("Protest is chosen, its first line picked, and no coffee line shows", () => {
    const out = html(picker);
    expect(out).toMatch(/aria-pressed="true"[^>]*>Protest/);
    expect(out.match(/checked=""/g)).toHaveLength(1);
    expect(out).not.toContain("KERIA-TIER");
    expect(out).toContain('<div class="led led--big">MANAGEMENT MUST EXPLAIN THIS CAPTAIN PICK. 2 PTS.</div>');
  });

  test("Send truck waits for a line", () => {
    const off = html(<TruckPicker receiver={jae} line="" lines={[]} kind="coffee" onKind={noop} onPick={noop} onSend={noop} onClose={noop} />);
    expect(off).toMatch(/<button[^>]*disabled=""[^>]*>Send truck/);
  });
});

describe("the controls", () => {
  test("Accept makes the asker a follower; Decline drops the request", () => {
    const accepted = accept(FOLLOWING, "ella");
    expect(accepted.requests.map((m) => m.id)).toEqual(["joe"]);
    expect(accepted.followers.map((m) => m.id)).toContain("ella");
    expect(decline(FOLLOWING, "joe").requests.map((m) => m.id)).toEqual(["ella"]);
    expect(text(view(accepted))).toContain("Followers6");
  });

  test("Unfollow takes the manager out of Following and the feed", () => {
    const after = unfollow(FOLLOWING, "jae");
    expect(after.following.map((m) => m.id)).toEqual(["minji", "dan"]);
    expect(after.feed.flatMap((w) => w.items).some((i) => i.manager.id === "jae")).toBe(false);
    expect(text(view(after))).toContain("Following2 of 50");
  });

  test("Remove (and Block, which calls it) takes a follower off the list", () => {
    expect(removeFollower(FOLLOWING, "tom").followers.map((m) => m.id)).toEqual(["minji", "dan", "sam", "priya"]);
  });

  test("a sent truck marks every row of that manager, and a second is refused", () => {
    const sent = sendTruck(FOLLOWING, "jae", "protest");
    const out = text(view(sent));
    expect(out.match(/Protest sent/g)).toHaveLength(2);
    expect(out.match(/Truck ›/g)).toHaveLength(2);
    expect(() => sendTruck(sent, "jae", "coffee")).toThrow("already");
  });
});

test("summaries read as the picture writes them", () => {
  const moves = (over: Partial<DeadlineItem>): DeadlineItem => ({ kind: "deadline", id: "x", manager: FOLLOWING.following[0]!, transfers: 0, swaps: [], ...over });
  expect(movesSummary(moves({ transfers: 1 }))).toBe("1 transfer");
  expect(movesSummary(moves({ buff: "Limitless", transfers: 5 }))).toBe("Limitless, 5 transfers");
  expect(playersLine([{ name: "Faker", points: 18, captain: { before: 12 } }], 1.5)).toBe("Faker 18 (12 × 1.5)");
});
