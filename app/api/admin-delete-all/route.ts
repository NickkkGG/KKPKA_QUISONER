import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!verifyToken(req.cookies.get("admin_session")?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Hapus semua baris pada tabel responden.
  // Filter `gt(created_at, epoch)` dipakai agar perintah delete punya kondisi
  // (Supabase menolak delete tanpa filter) namun tetap mencakup seluruh data.
  const { error, count } = await supabaseAdmin
    .from("responden")
    .delete({ count: "exact" })
    .gt("created_at", "1970-01-01");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, deleted: count ?? 0 });
}
