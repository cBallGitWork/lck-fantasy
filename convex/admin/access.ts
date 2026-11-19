// Who may use the admin section (spec/11, Live: an admin-only page): whoever holds the admin key, a
// setting on the Convex deployment, until Convex Auth is wired and an admin is a signed-in account.
import { ConvexError, v } from "convex/values";

/** The deployment setting holding the admin key. */
export const ADMIN_KEY_SETTING = "ADMIN_KEY";

/** Every admin call's argument: the key the admin typed. */
export const adminKey = v.string();

/** Why an admin call was refused, for the page to say. */
export type AdminRefusal = { rule: "noKeySet" | "wrongKey" };

/** Refuses a call whose key isn't the deployment's, and every call on a deployment with no key set. */
export function requireAdmin(key: string) {
  const set = process.env[ADMIN_KEY_SETTING];
  if (set === undefined || set === "") throw new ConvexError<AdminRefusal>({ rule: "noKeySet" });
  if (key !== set) throw new ConvexError<AdminRefusal>({ rule: "wrongKey" });
}
