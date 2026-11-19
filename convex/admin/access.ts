// Who may use the admin section (spec/11, Live: an admin-only page): whoever has the admin password, a
// setting on the Convex deployment, until Convex Auth is wired and an admin is a signed-in account.
import { ConvexError, v } from "convex/values";

/** The deployment setting holding the admin password. */
export const ADMIN_PASSWORD_SETTING = "ADMIN_PASSWORD";

/** Every admin call's argument: the password the admin typed. */
export const adminPassword = v.string();

/** Why an admin call was refused, for the page to say. */
export type AdminRefusal = { rule: "noPasswordSet" | "wrongPassword" };

/** Refuses a call whose password isn't the deployment's, and every call on a deployment with none. */
export function requireAdmin(password: string) {
  const set = process.env[ADMIN_PASSWORD_SETTING];
  if (set === undefined || set === "") throw new ConvexError<AdminRefusal>({ rule: "noPasswordSet" });
  if (password !== set) throw new ConvexError<AdminRefusal>({ rule: "wrongPassword" });
}
