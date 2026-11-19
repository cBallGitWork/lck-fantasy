// Email through Resend (ARCHITECTURE.md, Services). Its key and addresses are the deployment's
// settings, never code.
import { v } from "convex/values";
import { internalAction } from "../_generated/server";

const RESEND_EMAILS = "https://api.resend.com/emails";
/** The deployment settings email needs: Resend's key, the admin's address and the sender's. */
export const EMAIL_SETTINGS = { key: "RESEND_API_KEY", admin: "ADMIN_EMAIL", from: "EMAIL_FROM" } as const;

function setting(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`The deployment setting ${name} isn't set, so no email can be sent.`);
  return value;
}

/** One plain email to the admin. Throws when Resend refuses it, so the failure shows in Convex's logs. */
export const emailAdmin = internalAction({
  args: { subject: v.string(), text: v.string() },
  handler: async (_ctx, { subject, text }) => {
    const response = await fetch(RESEND_EMAILS, {
      method: "POST",
      headers: { Authorization: `Bearer ${setting(EMAIL_SETTINGS.key)}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: setting(EMAIL_SETTINGS.from), to: setting(EMAIL_SETTINGS.admin), subject, text }),
    });
    if (!response.ok) throw new Error(`Resend refused the email (${response.status}): ${await response.text()}`);
  },
});
