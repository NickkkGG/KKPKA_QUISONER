import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";

function isMissingNoHpColumn(error: unknown) {
  const message = error instanceof Error ? error.message : JSON.stringify(error);
  const code = typeof error === "object" && error !== null && "code" in error
    ? String((error as { code?: unknown }).code ?? "")
    : "";
  return code === "PGRST204" || /no[_ ]?hp.*column|column.*no[_ ]?hp/i.test(message);
}

export async function GET(req: NextRequest) {
  if (!verifyToken(req.cookies.get("admin_session")?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    console.error("Supabase server configuration is missing");
    return NextResponse.json({ error: "Konfigurasi database belum tersedia di server." }, { status: 503 });
  }

  try {
    const selectWithPhone = "id, nama, npm, no_hp, email, usia, jenjang, prodi, answers, skala_depresi, interpretasi_depresi, skala_kecemasan, interpretasi_kecemasan, skala_stress, interpretasi_stress, created_at";
    const selectLegacy = "id, nama, npm, email, usia, jenjang, prodi, answers, skala_depresi, interpretasi_depresi, skala_kecemasan, interpretasi_kecemasan, skala_stress, interpretasi_stress, created_at";
    const primaryResult = await supabaseAdmin
      .from("responden")
      .select(selectWithPhone)
      .order("created_at", { ascending: false });
    let data: unknown[] | null = primaryResult.data;
    let error = primaryResult.error;

    if (error && isMissingNoHpColumn(error)) {
      const legacyResult = await supabaseAdmin
        .from("responden")
        .select(selectLegacy)
        .order("created_at", { ascending: false });
      data = legacyResult.data;
      error = legacyResult.error;
    }

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
    const normalizedData = (data ?? []).map((row) => {
      const record = row as Record<string, unknown>;
      const phoneCandidate = typeof record.no_hp === "string" && record.no_hp.trim()
        ? record.no_hp
        : typeof record.email === "string" ? record.email : "";
      const noHp = /^\d{10,15}$/.test(phoneCandidate.trim()) ? phoneCandidate.trim() : "";
      const rest = { ...record };
      delete rest.no_hp;
      delete rest.email;
      return { ...rest, noHp };
    });
    return NextResponse.json(normalizedData);
  } catch (error) {
    console.error("Supabase request failed while loading DASS-42 responses", error);
    return NextResponse.json({ error: "Database tidak dapat dihubungi. Periksa URL Supabase." }, { status: 503 });
  }
}
