import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  calculateScores,
  interpretDepresi,
  interpretKecemasan,
  interpretStress,
  JENJANG_LIST,
  PRODI_BY_JENJANG,
} from "@/lib/dass42";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }

  const { nama, npm, email, usia, jenjang, prodi, answers } = body as Record<string, unknown>;
  const namaValue = typeof nama === "string" ? nama.trim() : "";
  const npmValue = typeof npm === "string" ? npm.trim() : "";
  const emailValue = typeof email === "string" ? email.trim().toLowerCase() : "";
  const jenjangValue = typeof jenjang === "string" ? jenjang.trim() : "";
  const prodiValue = typeof prodi === "string" ? prodi.trim() : "";
  const usiaValue = typeof usia === "number"
    ? usia
    : typeof usia === "string" && /^\d+$/.test(usia.trim())
      ? Number(usia)
      : NaN;
  const validAnswers = Array.isArray(answers)
    && answers.length === 42
    && answers.every((answer) => Number.isInteger(answer) && answer >= 0 && answer <= 3);

  if (
    namaValue.length < 2 || namaValue.length > 120
    || !/^\d{1,20}$/.test(npmValue)
    || !/^\S+@\S+\.\S+$/.test(emailValue) || emailValue.length > 254
    || !Number.isInteger(usiaValue) || usiaValue < 15 || usiaValue > 60
    || !JENJANG_LIST.includes(jenjangValue)
    || !PRODI_BY_JENJANG[jenjangValue]?.includes(prodiValue)
    || !validAnswers
  ) {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    console.error("Supabase server configuration is missing");
    return NextResponse.json({ error: "Layanan penyimpanan sedang tidak tersedia" }, { status: 503 });
  }

  const normalizedAnswers = answers as number[];
  const { depresi, kecemasan, stress } = calculateScores(normalizedAnswers);

  try {
    const { error } = await supabaseAdmin.from("responden").insert({
      nama: namaValue,
      npm: npmValue,
      email: emailValue,
      usia: usiaValue,
      jenjang: jenjangValue,
      prodi: prodiValue,
      answers: normalizedAnswers,
      skala_depresi: depresi,
      interpretasi_depresi: interpretDepresi(depresi).level,
      skala_kecemasan: kecemasan,
      interpretasi_kecemasan: interpretKecemasan(kecemasan).level,
      skala_stress: stress,
      interpretasi_stress: interpretStress(stress).level,
    });

    if (error) {
      console.error("Failed to save DASS-42 response", error);
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      const connectionError = /fetch failed|enotfound|eai_again|econnrefused|timeout/i.test(errorMessage);
      return NextResponse.json({
        error: connectionError
          ? "Database tidak dapat dihubungi. Periksa URL Supabase."
          : "Database tidak dapat menyimpan jawaban. Periksa struktur tabel Supabase.",
      }, { status: 503 });
    }
  } catch (error) {
    console.error("Supabase request failed while saving DASS-42 response", error);
    return NextResponse.json({ error: "Database tidak dapat dihubungi. Periksa URL Supabase dan coba lagi." }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
