import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!verifyToken(req.cookies.get("admin_session")?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    console.error("Supabase server configuration is missing");
    return NextResponse.json({ error: "Konfigurasi database belum tersedia di server." }, { status: 503 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("responden")
      .select("id, nama, npm, email, usia, jenjang, prodi, answers, skala_depresi, interpretasi_depresi, skala_kecemasan, interpretasi_kecemasan, skala_stress, interpretasi_stress, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load DASS-42 responses", error);
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      const connectionError = /fetch failed|enotfound|eai_again|econnrefused|timeout/i.test(errorMessage);
      return NextResponse.json({
        error: connectionError
          ? "Database tidak dapat dihubungi. Periksa URL Supabase."
          : "Database tidak dapat mengambil data. Periksa struktur tabel Supabase.",
      }, { status: 503 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Supabase request failed while loading DASS-42 responses", error);
    return NextResponse.json({ error: "Database tidak dapat dihubungi. Periksa URL Supabase." }, { status: 503 });
  }
}
