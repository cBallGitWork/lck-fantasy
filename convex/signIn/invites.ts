// Personal invites to the closed tests (spec/10, The road to launch, step 2): while a season's sign-up
// isn't open, only an account with an invite Craig made signs up. One invite is one person, who may
// then play every region's test. Codes are made the way private leagues' are (convex/leagues).
import { v } from "convex/values";
import type { Doc } from "../_generated/dataModel";
import { internalMutation, internalQuery, type MutationCtx } from "../_generated/server";
import { joinCode, normalCode } from "../leagues/membership";
import inviteData from "../../data/invites.json";

/** How many invites Craig can make, across every region: data/invites.json, which he raises. */
export const INVITE_CAP: number = inviteData.cap;

/** Why a closed test turns a sign-up away: no invite, a code that isn't one, or one someone else
 *  signed up with. */
export type InviteRefusal = { rule: "closed" } | { rule: "noInvite"; code: string } | { rule: "inviteUsed" };

/** Why `account` can't sign up while sign-up is closed, given the invite it already holds, if any,
 *  and the one its link carries; null when it can. */
export function inviteRefusal(account: string, held: Doc<"invites"> | null, code: string | undefined, linked: Doc<"invites"> | null): InviteRefusal | null {
  if (held !== null) return null;
  if (code === undefined || code.trim() === "") return { rule: "closed" };
  if (linked === null) return { rule: "noInvite", code };
  if (linked.used !== undefined && linked.used.account !== account) return { rule: "inviteUsed" };
  return null;
}

/** The sign-up check for a closed test: lets `account` in, claiming its link's invite on first use,
 *  or says why not. Run inside Save team, so a refused Save claims nothing. */
export async function admit(ctx: MutationCtx, account: string, code: string | undefined, at: number): Promise<InviteRefusal | null> {
  const held = await ctx.db.query("invites").withIndex("by_account", (q) => q.eq("used.account", account)).first();
  const linked = code === undefined ? null : await inviteByCode(ctx, normalCode(code));
  const refusal = inviteRefusal(account, held, code, linked);
  if (refusal === null && held === null && linked !== null) await ctx.db.patch(linked._id, { used: { account, at } });
  return refusal;
}

/** Craig makes an invite for one person; its code goes in their personal link. Refused past the cap. */
export const makeInvite = internalMutation({
  args: { for: v.string() },
  handler: async (ctx, args) => {
    const made = (await ctx.db.query("invites").collect()).length;
    if (made >= INVITE_CAP) throw new Error(`All ${INVITE_CAP} invites are made; raise the cap in data/invites.json.`);
    let code: string;
    do code = joinCode("", Math.random);
    while ((await inviteByCode(ctx, code)) !== null);
    await ctx.db.insert("invites", { code, for: args.for.trim() });
    return code;
  },
});

/** Every invite, oldest first: who it is for, its code, and when it was used, if it has been. */
export const invites = internalQuery({
  args: {},
  handler: async (ctx) =>
    (await ctx.db.query("invites").collect()).map((invite) => ({ for: invite.for, code: invite.code, usedAt: invite.used?.at ?? null })),
});

const inviteByCode = (ctx: MutationCtx, code: string) => ctx.db.query("invites").withIndex("by_code", (q) => q.eq("code", code)).unique();
