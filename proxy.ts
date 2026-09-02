import { NextRequest, NextResponse } from "next/server";

const SECRET = process.env.ADMIN_PASSWORD
  ? process.env.ADMIN_PASSWORD + "::kkpka-session-v1"
  : null;

async function verify(token?: string): Promise<boolean> {
  if (!SECRET || !token) return false;
  try {
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
    const expiry = Number(payload);
    return Number.isFinite(expiry) && Date.now() < expiry;
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const ok = await verify(req.cookies.get("admin_session")?.value);
  if (!ok) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
