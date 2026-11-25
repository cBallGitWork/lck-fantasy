// @vitest-environment node
import { describe, expect, test } from "vitest";
import { expectDeadlinePart, expectInOrder, html, noop, text, trucksOutsideCredit } from "../../testing/render";
import { accept, decline, movesSummary, playersLine, receiverLine, removeFollower, sendCheer, unfollow, type DeadlineItem } from "./feed";
import { FOLLOWING, PICKER_AS_DRAWN } from "./fixtures";
import { FollowingScreen } from ".";
import { FollowingView } from "./FollowingView";
import { CheerPicker } from "./CheerPicker";
import { pickerOn } from "./useCheerPicker";

const view = (data = FOLLOWING) => (
  <FollowingView data={data} onCheer={noop} onAccept={noop} onDecline={noop} onUnfollow={noop} onRemove={noop} onBlock={noop} />
);

describe("the page (1440.png)", () => {
  const out = text(view());

  test("shows the feed, newest first, under a head per gameweek", () => {
    expect(out).not.toContain("KST");
    expectInOrder(out, [
      "Following",
      "팔로잉",
      "Week 3",
      "Not final",
      "Deadline Wed 7:45amMinji Park",
      "Chovy Was Right There",
      "20",
      "GEN 2–1 HLE",
      "Kiin 5 · Canyon 7 · Chovy 8",
      "Ended Sat 10:20am",
      "Cheer / Jeer ›",
      "Jae Kim",
      "NS 0–2 KRX",
      "Rich 4 · ucal 2 (Captain) · Lehends 3",
      "Ended Fri 1:00pm",
      "Cheer / Jeer ›",
      "Dan Okafor",
      "T1 2–1 HLE",
      "Oner 11 · Faker 18 (12 × 1.5) · Keria 5",
      "Cheer sent",
      "Minji Park",
      "Bench Boost, 5 transfers, −18",
      "so far",
      "Doran → Kiin+9",
      "Peyz → Ruler+4",
      "Lehends → Keria−1",
      "+ 2 more",
      "Cheer / Jeer ›",
      "Dan Okafor",
      "2 transfers, −6",
      "Lucid → Oner0",
      "Chovy → Faker+24",
      "Cheer sent",
      "Jae Kim",
      "no transfers",
      "Cheer / Jeer ›",
      "Week 2",
      "Jae Kim",
      "GEN 2–0 BRO",
      "Captain haul",
      "Ruler 21 (14 × 1.5)",
      "Minji Park",
      "Chovy 21",
      "Ended Sun 12:30pm",
    ]);
  });

  test("a week's deadline is the Deadline part, as on Pick Team", () => {
    expectDeadlinePart(html(view()), "Wed 7:45am");
  });

  test("shows requests, cheers and jeers, following and followers on the right, then the sponsor note", () => {
    expectInOrder(out, [
      "Requests2",
      "Ella Wong",
      "Ruler of None",
      "Accept",
      "Decline",
      "Joe Grant",
      "Cheers and jeers",
      "CHOVY CS. RULER DPS. YOUR SQUAD. 화이팅!",
      "Cheer from Minji Park",
      "Truck hire by Sponsor",
      "−6 FOR A SIDEWAYS TRANSFER. WHO SIGNED THIS OFF?",
      "Jeer from Dan Okafor",
      "Truck hire by Sponsor",
      "WINNER WINNER, GANK CHICKEN. 98 PTS.",
      "Sponsor cheer for topping Pub League",
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
    for (const name of ['aria-label="Accept Ella Wong"', 'aria-label="Decline Ella Wong"', 'aria-label="Unfollow Minji Park"', 'aria-label="Remove Minji Park"', 'aria-label="Block Minji Park"', 'aria-label="Cheer or jeer Minji Park"']) {
      expect(markup).toContain(name);
    }
  });

  test("cheers and jeers only the live week: Week 2's rows have none", () => {
    const week2 = out.slice(out.indexOf("Week 2"));
    expect(week2).not.toContain("Cheer / Jeer ›");
    expect(out.match(/Cheer \/ Jeer ›/g)).toHaveLength(4);
  });

  test("a manager's name opens their profile, and the page sits in its frame", () => {
    const page = html(view());
    expect(page).toContain('data-screen="following"');
    expect(page).toContain('href="/manager/minji"');
    expect(page).toContain('href="/manager/priya"');
  });

  test("draws each cheer and jeer received on the shared LED panel", () => {
    expect(html(view())).toContain('<div class="led">−6 FOR A SIDEWAYS TRANSFER. WHO SIGNED THIS OFF?</div>');
  });

  test("a sponsor cheer's panel credits only the sponsor, as its sender: no truck-hire line", () => {
    const panels = html(view()).split('<div class="following__parked">').slice(1);
    const sponsor = panels.filter((p) => p.includes("Sponsor cheer"));
    expect(sponsor).toHaveLength(1);
    expect(sponsor[0]).toContain("갱 치킨 Gank Chicken");
    expect(sponsor[0]).not.toContain("Truck hire");
    expect(panels.filter((p) => p.includes("Truck hire"))).toHaveLength(2);
  });

  test("says Truck only in the truck-hire credit, a sponsor placeholder until its name is approved", () => {
    expect(trucksOutsideCredit(text(view()))).toEqual([]);
    expect(html(view())).toContain('Truck hire by <span class="placeholder quiet">Sponsor</span>');
  });

  test("the screen renders on its fixture", () => {
    expect(text(<FollowingScreen />)).toContain("Bench Boost, 5 transfers, −18");
  });
});

describe("the cheer picker (1440-truck.png)", () => {
  const jae = FOLLOWING.following.find((m) => m.id === PICKER_AS_DRAWN.managerId)!;
  const picker = (
    <CheerPicker
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

  test("shows Jae's week, the kinds, the jeer lines, the preview, then Cancel and Send", () => {
    expectInOrder(text(picker), [
      "Cheer or jeer Jae Kim",
      "Deft Tomorrow · Week 3 · 31 pts so far, no transfers",
      "Cheer",
      "Jeer",
      "MANAGEMENT MUST EXPLAIN THIS CAPTAIN PICK. 2 PTS.",
      "NO TRANSFER AGAIN. IS ANYONE AT HEADQUARTERS?",
      "SET AND FORGET IS NOT A PHILOSOPHY. IT'S A NAP.",
      "31 POINTS. WE ARE NOT ANGRY. WE ARE GUTTED.",
      "THE TEMPLATE WAS RIGHT THERE, MATE.",
      "MANAGEMENT MUST EXPLAIN THIS CAPTAIN PICK. 2 PTS.",
      "You can send Jae one cheer or jeer a week.",
      "Cancel",
      "Send",
    ]);
    expect(trucksOutsideCredit(text(picker))).toEqual([]);
  });

  test("Jeer is chosen, its first line picked, and no cheer line shows", () => {
    const out = html(picker);
    expect(out).toMatch(/aria-pressed="true"[^>]*>Jeer/);
    expect(out.match(/checked=""/g)).toHaveLength(1);
    expect(out).not.toContain("KERIA-TIER");
    expect(out).toContain('<div class="led led--big">MANAGEMENT MUST EXPLAIN THIS CAPTAIN PICK. 2 PTS.</div>');
  });

  test("Send waits for a line", () => {
    const off = html(<CheerPicker receiver={jae} line="" lines={[]} kind="cheer" onKind={noop} onPick={noop} onSend={noop} onClose={noop} />);
    expect(off).toMatch(/<button[^>]*disabled=""[^>]*>Send</);
  });

  test("opens on Cheer, its first line picked", () => {
    expect(pickerOn(FOLLOWING, "jae")).toEqual({ managerId: "jae", kind: "cheer", lineId: "c13" });
    expect(pickerOn(FOLLOWING, "jae", "jeer")).toEqual(PICKER_AS_DRAWN);
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

  test("a sent jeer marks every row of that manager, and a second is refused", () => {
    const sent = sendCheer(FOLLOWING, "jae", "jeer");
    const out = text(view(sent));
    expect(out.match(/Jeer sent/g)).toHaveLength(2);
    expect(out.match(/Cheer \/ Jeer ›/g)).toHaveLength(2);
    expect(() => sendCheer(sent, "jae", "cheer")).toThrow("already");
  });
});

test("summaries read as the picture writes them", () => {
  const moves = (over: Partial<DeadlineItem>): DeadlineItem => ({ kind: "deadline", id: "x", manager: FOLLOWING.following[0]!, transfers: 0, swaps: [], ...over });
  expect(movesSummary(moves({ transfers: 1 }))).toBe("1 transfer");
  expect(movesSummary(moves({ buff: "Bench Boost", transfers: 5, hit: 18 }))).toBe("Bench Boost, 5 transfers, −18");
  expect(playersLine([{ name: "Faker", points: 18, captain: { before: 12 } }], 1.5)).toBe("Faker 18 (12 × 1.5)");
});
