import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder";
const serverKey = process.env.SUPABASE_SECRET_KEY ?? "placeholder";

// Supabase publishable/secret keys use the `sb_*` format and are valid only as
// `apikey`; supabase-js also sends them as a JWT Bearer token by default.
// Strip only that fallback while preserving real user-session Bearer tokens.
function fetchForApiKey(key: string): typeof fetch {
  const newFormatKey = key.startsWith("sb_publishable_") || key.startsWith("sb_secret_");
  if (!newFormatKey) return fetch;

  return async (input, init) => {
    const headers = new Headers(init?.headers);
    if (headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
    return fetch(input, { ...init, headers });
  };
}

// Client untuk browser (mahasiswa submit)
export const supabase = createClient(
  url,
  anonKey,
  { global: { fetch: fetchForApiKey(anonKey) } }
);

// Client untuk server/admin (bypass RLS)
export const supabaseAdmin = createClient(
  url,
  serverKey,
  { global: { fetch: fetchForApiKey(serverKey) } }
);
