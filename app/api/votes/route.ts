import { features } from "@/data/features";
import { isSupabaseConfigured, supabaseRequest } from "@/lib/supabase-rest";
import { checkRateLimit, isSameOrigin, readJsonBody, securityError } from "@/lib/request-security";

const visitorIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return securityError("Request origin is not allowed.", 403);
  const rateLimit = checkRateLimit(request, "vote", 30, 60 * 60 * 1000);
  if (!rateLimit.allowed) return securityError("Too many vote attempts.", 429, rateLimit.retryAfter);

  const body = await readJsonBody<{ featureId?: string; visitorId?: string }>(request, 1_024);
  const feature = features.find((item) => item.id === body?.featureId);

  if (!feature || !body?.visitorId || !visitorIdPattern.test(body.visitorId)) {
    return securityError("Invalid vote.", 400);
  }

  if (!isSupabaseConfigured) {
    return Response.json({ ok: true, mode: "demo" }, { headers: { "Cache-Control": "no-store" } });
  }

  const response = await supabaseRequest("rpc/cast_vote", {
    method: "POST",
    body: JSON.stringify({ p_feature_id: feature.id, p_visitor_id: body.visitorId }),
  });

  if (!response.ok) {
    return securityError("Unable to record vote.", 502);
  }

  const count = (await response.json()) as number;
  return Response.json({ ok: true, mode: "live", count }, { headers: { "Cache-Control": "no-store" } });
}
