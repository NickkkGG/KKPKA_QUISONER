import crypto from "crypto";

const SECRET = process.env.ADMIN_PASSWORD
  ? process.env.ADMIN_PASSWORD + "::kkpka-session-v1"
  : null;

// Buat token bertanda tangan: base64(expiry).hmac
export function createToken(hours = 8): string {
  if (!SECRET) throw new Error("ADMIN_PASSWORD is not configured");
  const expiry = Date.now() + hours * 3600_000;
  const payload = String(expiry);
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${Buffer.from(payload).toString("base64")}.${sig}`;
}

// Verifikasi token: cek signature valid + belum kadaluarsa
export function verifyToken(token?: string): boolean {
  if (!SECRET || !token) return false;
  try {
    const [b64, sig] = token.split(".");
    if (!b64 || !sig) return false;
    const payload = Buffer.from(b64, "base64").toString();
    const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
    // timing-safe compare
    if (sig.length !== expected.length) return false;
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
    const expiry = Number(payload);
    return Number.isFinite(expiry) && Date.now() < expiry;
  } catch {
    return false;
  }
}
