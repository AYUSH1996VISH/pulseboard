import { products } from "@/data/products";
import { isSupabaseConfigured, supabaseRequest } from "@/lib/supabase-rest";
import { checkRateLimit, containsUnsafeControlCharacters, isSameOrigin, readJsonBody, securityError } from "@/lib/request-security";

type RequestBody = { title?: string; description?: string; productId?: string; category?: string; email?: string; website?: string };
const allowedCategories = new Set(["Experience", "Analytics", "Integrations", "Collaboration", "Other"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return securityError("Request origin is not allowed.", 403);
  const rateLimit = checkRateLimit(request, "request", 10, 60 * 60 * 1000);
  if (!rateLimit.allowed) return securityError("Too many request attempts.", 429, rateLimit.retryAfter);

  const body = await readJsonBody<RequestBody>(request, 6_144);
  if (body?.website) return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  const title = body?.title?.trim();
  const description = body?.description?.trim();
  const email = body?.email?.trim().toLowerCase();
  const validProduct = products.some((product) => product.id === body?.productId);

  if (!title || title.length < 5 || title.length > 120 || containsUnsafeControlCharacters(title) || !description || description.length < 20 || description.length > 2000 || containsUnsafeControlCharacters(description) || !validProduct || !allowedCategories.has(body?.category || "") || (email && (email.length > 254 || !emailPattern.test(email)))) {
    return securityError("Please complete all required fields.", 400);
  }

  if (!isSupabaseConfigured) {
    return Response.json({ ok: true, mode: "demo", requestId: `demo_${Date.now()}` }, { headers: { "Cache-Control": "no-store" } });
  }

  const response = await supabaseRequest("submitted_requests", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ title, description, product_id: body?.productId, category: body?.category, email: email || null }),
  });

  if (!response.ok) {
    return securityError("Unable to save request.", 502);
  }

  const rows = (await response.json()) as Array<{ id: string }>;
  return Response.json({ ok: true, mode: "live", requestId: rows[0]?.id }, { headers: { "Cache-Control": "no-store" } });
}
