import "server-only";

const configuredSupabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

function getValidatedSupabaseUrl() {
  if (!configuredSupabaseUrl) return null;

  try {
    const url = new URL(configuredSupabaseUrl);
    const isOfficialSupabaseHost = url.hostname.endsWith(".supabase.co");
    const hasUnexpectedUrlParts = Boolean(url.username || url.password || url.search || url.hash);

    if (url.protocol !== "https:" || !isOfficialSupabaseHost || hasUnexpectedUrlParts) {
      return null;
    }

    return url.origin;
  } catch {
    return null;
  }
}

const supabaseUrl = getValidatedSupabaseUrl();

export const isSupabaseConfigured = Boolean(supabaseUrl && serviceRoleKey);

export async function supabaseRequest(path: string, init: RequestInit = {}) {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase is not configured");
  }

  return fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
    signal: init.signal || AbortSignal.timeout(8_000),
  });
}
