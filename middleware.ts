import { NextRequest, NextResponse } from "next/server";

const SECRET = (process.env.ADMIN_PASSWORD ?? "fallback") + "::kkpka-session-v1";

async function verify(token?: string): Promise<boolean> {
  if (!token) return false;
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return false;
  const payload = atob(b64);
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  const expected = Array.from(new Uint8Array(sigBuf)).map(b => b.toString(16).padStart(2, "0")).join("");
  if (sig !== expected) return false;
  return Date.now() < Number(payload);
}

export async function middleware(req: NextRequest) {
  const ok = await verify(req.cookies.get("admin_session")?.value);
  if (!ok) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
