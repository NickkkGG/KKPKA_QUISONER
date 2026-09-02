import { NextRequest, NextResponse } from "next/server";
import { createToken } from "@/lib/auth";

// Rate limiting sederhana per-IP (in-memory)
const attempts = new Map<string, { count: number; reset: number }>();

export async function POST(req: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    console.error("ADMIN_PASSWORD is not configured");
    return NextResponse.json({ error: "Login admin sedang tidak tersedia" }, { status: 503 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const now = Date.now();
  const rec = attempts.get(ip);

  if (rec && now < rec.reset && rec.count >= 5) {
    return NextResponse.json({ error: "Terlalu banyak percobaan. Coba lagi dalam 15 menit." }, { status: 429 });
  }

  let password: unknown;
  try {
    ({ password } = await req.json());
  } catch {
    return NextResponse.json({ error: "Data login tidak valid" }, { status: 400 });
  }

  if (typeof password === "string" && password.length > 0 && password === process.env.ADMIN_PASSWORD) {
    attempts.delete(ip);
    const res = NextResponse.json({ ok: true });
    res.cookies.set("admin_session", createToken(8), {
      httpOnly: true,
      secure: req.nextUrl.protocol === "https:",
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    });
    return res;
  }

  // Catat percobaan gagal
  const count = rec && now < rec.reset ? rec.count + 1 : 1;
  attempts.set(ip, { count, reset: now + 15 * 60_000 });
  return NextResponse.json({ error: "Password salah" }, { status: 401 });
}
