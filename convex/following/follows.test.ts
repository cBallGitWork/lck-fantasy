import { describe, expect, test } from "vitest";
import { following, NO_FOLLOWS } from "./fixtures";
import { acceptFollow, block, followedBy, removeFollower, requestFollow, requestProblems, unfollow } from "./follows";
import { Refused } from "./refused";

/** Jun follows Minji, and she accepted. */
const junFollowsMinji = () => following(NO_FOLLOWS, "jun", "minji");

describe("following (spec/14, Following)", () => {
  test("a request shows nothing until accepted, and is one-way", () => {
    const asked = requestFollow(NO_FOLLOWS, "jun", "minji");
    expect(followedBy(asked, "jun")).toEqual([]);
    const accepted = acceptFollow(asked, "minji", "jun");
    expect(followedBy(accepted, "jun")).toEqual(["minji"]);
    expect(followedBy(accepted, "minji")).toEqual([]);
  });

  test("she sees his only if she asks too", () => {
    const both = following(junFollowsMinji(), "minji", "jun");
    expect(followedBy(both, "minji")).toEqual(["jun"]);
  });

  test("no following yourself, no asking twice, no accepting a request never made", () => {
    expect(requestProblems(NO_FOLLOWS, "jun", "jun")).toEqual([{ rule: "followSelf" }]);
    expect(requestProblems(junFollowsMinji(), "jun", "minji")).toEqual([{ rule: "alreadyAsked", accepted: true }]);
    expect(() => acceptFollow(NO_FOLLOWS, "minji", "jun")).toThrow(Refused);
  });
});

describe("ending a follow (spec/14, Following)", () => {
  test("a manager can unfollow", () => {
    expect(followedBy(unfollow(junFollowsMinji(), "jun", "minji"), "jun")).toEqual([]);
    expect(() => unfollow(NO_FOLLOWS, "jun", "minji")).toThrow(Refused);
  });

  test("a manager can remove a follower, who can ask again", () => {
    const removed = removeFollower(junFollowsMinji(), "minji", "jun");
    expect(followedBy(removed, "jun")).toEqual([]);
    expect(requestProblems(removed, "jun", "minji")).toEqual([]);
  });

  test("a block hides the blocked manager both ways, and neither can ask again", () => {
    const mutual = following(junFollowsMinji(), "minji", "jun");
    const blocked = block(mutual, "minji", "jun");
    expect(followedBy(blocked, "jun")).toEqual([]);
    expect(followedBy(blocked, "minji")).toEqual([]);
    expect(requestProblems(blocked, "jun", "minji")).toEqual([{ rule: "blocked" }]);
    expect(requestProblems(blocked, "minji", "jun")).toEqual([{ rule: "blocked" }]);
  });
});
