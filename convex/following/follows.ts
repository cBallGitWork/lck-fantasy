// Who follows whom (spec/14-following.md, Following): by request and one-way, so a follow shows
// in the follower's feed once the followed manager accepts. Either side can end it, and a block
// ends both ways and keeps them apart.

export interface Follow {
  follower: string;
  followed: string;
  accepted: boolean;
}

export interface Block {
  blocker: string;
  blocked: string;
}

export interface Follows {
  follows: Follow[];
  blocks: Block[];
}

export type FollowProblem =
  | { rule: "followSelf" }
  | { rule: "alreadyAsked"; accepted: boolean }
  | { rule: "blocked" }
  | { rule: "noRequest" }
  | { rule: "notFollowing" };

/** Thrown by a follow change that breaks a rule, never applied silently. */
export class FollowError extends Error {
  constructor(readonly problem: FollowProblem) {
    super(`Follow refused: ${problem.rule}.`);
  }
}

function findFollow(state: Follows, follower: string, followed: string): Follow | undefined {
  return state.follows.find((follow) => follow.follower === follower && follow.followed === followed);
}

function without(state: Follows, follower: string, followed: string): Follow[] {
  return state.follows.filter((follow) => !(follow.follower === follower && follow.followed === followed));
}

/** Whether either manager has blocked the other. */
export function blockedEitherWay(state: Follows, a: string, b: string): boolean {
  return state.blocks.some(
    (block) => (block.blocker === a && block.blocked === b) || (block.blocker === b && block.blocked === a),
  );
}

/** Why `follower` can't ask to follow `followed`; empty when he can. */
export function requestProblems(state: Follows, follower: string, followed: string): FollowProblem[] {
  if (follower === followed) return [{ rule: "followSelf" }];
  if (blockedEitherWay(state, follower, followed)) return [{ rule: "blocked" }];
  const existing = findFollow(state, follower, followed);
  return existing ? [{ rule: "alreadyAsked", accepted: existing.accepted }] : [];
}

/** A manager asks to follow another; nothing shows until it is accepted. */
export function requestFollow(state: Follows, follower: string, followed: string): Follows {
  const [problem] = requestProblems(state, follower, followed);
  if (problem) throw new FollowError(problem);
  return { ...state, follows: [...state.follows, { follower, followed, accepted: false }] };
}

/** The followed manager accepts a request waiting for him. */
export function acceptFollow(state: Follows, manager: string, follower: string): Follows {
  const request = findFollow(state, follower, manager);
  if (!request || request.accepted) throw new FollowError({ rule: "noRequest" });
  return { ...state, follows: [...without(state, follower, manager), { ...request, accepted: true }] };
}

/** The follower stops following, or withdraws a request not yet accepted. */
export function unfollow(state: Follows, follower: string, followed: string): Follows {
  if (!findFollow(state, follower, followed)) throw new FollowError({ rule: "notFollowing" });
  return { ...state, follows: without(state, follower, followed) };
}

/** The followed manager removes a follower, or turns a waiting request down. */
export function removeFollower(state: Follows, manager: string, follower: string): Follows {
  return unfollow(state, follower, manager);
}

/** A block ends any follow between the two, either way, and stops either asking again. */
export function block(state: Follows, blocker: string, blocked: string): Follows {
  if (blocker === blocked) throw new FollowError({ rule: "followSelf" });
  const between = (follow: Follow) =>
    (follow.follower === blocker && follow.followed === blocked) || (follow.follower === blocked && follow.followed === blocker);
  const already = state.blocks.some((row) => row.blocker === blocker && row.blocked === blocked);
  return {
    follows: state.follows.filter((follow) => !between(follow)),
    blocks: already ? state.blocks : [...state.blocks, { blocker, blocked }],
  };
}

/** The managers whose weeks show in `manager`'s feed: those who accepted him, and not blocked. */
export function followedBy(state: Follows, manager: string): string[] {
  return state.follows
    .filter((follow) => follow.follower === manager && follow.accepted)
    .map((follow) => follow.followed)
    .filter((followed) => !blockedEitherWay(state, manager, followed));
}
