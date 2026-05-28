import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password === process.env.ADMIN_PASSWORD) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("admin_auth", "1", { httpOnly: true, maxAge: 60 * 60 * 8, path: "/" });
    return res;
  }
  return NextResponse.json({ error: "Password salah" }, { status: 401 });
}
