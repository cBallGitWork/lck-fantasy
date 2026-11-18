// @vitest-environment node
// Following's 17 Nov 2026 rules (spec/14, Following): Block asks first, and an empty part says so in one line.
import type { ReactElement } from "react";
import { describe, expect, test } from "vitest";
import { expectInOrder, noop, text } from "../../testing/render";
import { FOLLOWING, FOLLOWING_EMPTY } from "./fixtures";
import { FollowingPage } from ".";
import { BlockSheet } from "./BlockSheet";
import { FollowingView } from "./FollowingView";

const view = (data = FOLLOWING) => (
  <FollowingView data={data} onCheer={noop} onAccept={noop} onDecline={noop} onUnfollow={noop} onRemove={noop} onBlock={noop} />
);

describe("Block asks first", () => {
  const minji = FOLLOWING.followers.find((m) => m.id === "minji")!;

  test("Block opens the confirm, Minji still a follower: Block Minji?, what it does, Back, Block", () => {
    const out = text(<FollowingPage data={FOLLOWING} initialBlocking="minji" />);
    expectInOrder(out, ["Followers5", "Minji Park", "Block Minji?", "They can't follow you again.", "Back", "Block"]);
    expect(text(<FollowingPage data={FOLLOWING} />)).not.toContain("Block Minji?");
  });

  test("Back closes the confirm; Block blocks", () => {
    const calls: string[] = [];
    const sheet = BlockSheet({ follower: minji, onBlock: () => calls.push("block"), onClose: () => calls.push("back") });
    const keys = (sheet.props.children as ReactElement<{ onBack: () => void; children: ReactElement<{ onClick: () => void }> }>[])[1]!;
    keys.props.onBack();
    keys.props.children.props.onClick();
    expect(calls).toEqual(["back", "block"]);
  });
});

describe("an empty part says so in one line", () => {
  const out = text(view(FOLLOWING_EMPTY));

  test("no follow requests: No requests", () => {
    expectInOrder(out, ["Requests0", "No requests"]);
    expect(text(view())).not.toContain("No requests");
  });

  test("no cheers or jeers this gameweek: No cheers or jeers this week", () => {
    expectInOrder(out, ["Cheers and jeers", "No cheers or jeers this week"]);
    expect(text(view())).not.toContain("No cheers or jeers this week");
  });

  test("following no one: the feed reads You follow no one", () => {
    expectInOrder(out, ["팔로잉", "You follow no one", "Requests"]);
    expect(text(view())).not.toContain("You follow no one");
  });
});
