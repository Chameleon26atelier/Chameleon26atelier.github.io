import { env } from "cloudflare:workers";
import { getChatGPTUser } from "@/app/chatgpt-auth";

function configuredAdminEmails() {
  return new Set(
    (env.ADMIN_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export async function requireAdminApi(): Promise<{ userId: string; email: string } | null> {
  const user = await getChatGPTUser();
  if (!user) return null;

  const email = user.email.trim().toLowerCase();
  if (!configuredAdminEmails().has(email)) return null;

  const existing = await env.DB.prepare("SELECT user_id FROM admins WHERE user_id = ?").bind(user.userId).first();
  if (existing) return { userId: user.userId, email };

  await env.DB.prepare("INSERT OR IGNORE INTO admins (user_id, email) VALUES (?, ?)").bind(user.userId, email).run();
  const claimed = await env.DB.prepare("SELECT user_id FROM admins WHERE user_id = ?").bind(user.userId).first();
  return claimed ? { userId: user.userId, email } : null;
}
