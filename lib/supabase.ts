import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";

// Client untuk browser (mahasiswa submit)
export const supabase = createClient(
  url,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder"
);

// Client untuk server/admin (bypass RLS)
export const supabaseAdmin = createClient(
  url,
  process.env.SUPABASE_SECRET_KEY ?? "placeholder"
);
