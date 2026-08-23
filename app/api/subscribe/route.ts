import { isSupabaseConfigured, supabaseRequest } from "@/lib/supabase-rest";
import { checkRateLimit, isSameOrigin, readJsonBody, securityError } from "@/lib/request-security";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedSources = new Set(["homepage_newsletter", "changelog_newsletter"]);

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return securityError("Request origin is not allowed.", 403);
  const rateLimit = checkRateLimit(request, "subscribe", 5, 60 * 60 * 1000);
  if (!rateLimit.allowed) return securityError("Too many subscription attempts.", 429, rateLimit.retryAfter);

  const body = await readJsonBody<{ email?: string; source?: string; website?: string }>(request, 2_048);
  if (body?.website) return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  const email = body?.email?.trim().toLowerCase();

  if (!email || email.length > 254 || !emailPattern.test(email) || !allowedSources.has(body?.source || "")) {
    return securityError("Enter a valid email address.", 400);
  }

  if (!isSupabaseConfigured) {
    return Response.json({ ok: true, mode: "demo" }, { headers: { "Cache-Control": "no-store" } });
  }

  const response = await supabaseRequest("newsletter_subscribers?on_conflict=email", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ email, source: body?.source || "website" }),
  });

  if (!response.ok) {
    return securityError("Unable to save subscription.", 502);
  }

  return Response.json({ ok: true, mode: "live" }, { headers: { "Cache-Control": "no-store" } });
}
