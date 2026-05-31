import { NextRequest, NextResponse } from "next/server";
import { createToken } from "@/lib/auth";

// Rate limiting sederhana per-IP (in-memory)
const attempts = new Map<string, { count: number; reset: number }>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const now = Date.now();
  const rec = attempts.get(ip);

  if (rec && now < rec.reset && rec.count >= 5) {
    return NextResponse.json({ error: "Terlalu banyak percobaan. Coba lagi dalam 15 menit." }, { status: 429 });
  }

  const { password } = await req.json();

  if (password === process.env.ADMIN_PASSWORD) {
    attempts.delete(ip);
    const res = NextResponse.json({ ok: true });
    res.cookies.set("admin_session", createToken(8), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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
