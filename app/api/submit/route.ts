import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { calculateScores, interpretDepresi, interpretKecemasan, interpretStress } from "@/lib/dass42";

export async function POST(req: NextRequest) {
  const { nama, prodi, answers } = await req.json();

  if (!nama || !prodi || !Array.isArray(answers) || answers.length !== 42) {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }

  const { depresi, kecemasan, stress } = calculateScores(answers);

  const { error } = await supabase.from("responden").insert({
    nama,
    prodi,
    answers,
    skala_depresi: depresi,
    interpretasi_depresi: interpretDepresi(depresi).level,
    skala_kecemasan: kecemasan,
    interpretasi_kecemasan: interpretKecemasan(kecemasan).level,
    skala_stress: stress,
    interpretasi_stress: interpretStress(stress).level,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
