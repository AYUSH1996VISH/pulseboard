import "server-only";

type RateLimitEntry = { count: number; resetAt: number };

const rateLimitStore = new Map<string, RateLimitEntry>();
const MAX_TRACKED_CLIENTS = 10_000;

function clientIdentifier(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

export function checkRateLimit(
  request: Request,
  scope: string,
  limit: number,
  windowMs: number,
) {
  const now = Date.now();
  const key = `${scope}:${clientIdentifier(request)}`;
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    if (rateLimitStore.size >= MAX_TRACKED_CLIENTS) {
      for (const [storedKey, entry] of rateLimitStore) {
        if (entry.resetAt <= now) rateLimitStore.delete(storedKey);
      }
    }
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    const originUrl = new URL(origin);
    const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
    const requestHost = forwardedHost || request.headers.get("host");
    return Boolean(requestHost && originUrl.host === requestHost);
  } catch {
    return false;
  }
}

export async function readJsonBody<T>(request: Request, maximumBytes = 8_192): Promise<T | null> {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return null;
  }

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (!Number.isFinite(declaredLength) || declaredLength > maximumBytes) return null;

  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > maximumBytes) return null;

  try {
    return JSON.parse(body) as T;
  } catch {
    return null;
  }
}

export function securityError(message: string, status: number, retryAfter?: number) {
  return Response.json(
    { error: message },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        ...(retryAfter ? { "Retry-After": String(retryAfter) } : {}),
      },
    },
  );
}

export function containsUnsafeControlCharacters(value: string) {
  return /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value);
}
