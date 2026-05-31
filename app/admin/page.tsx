"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Lock, ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [showPw, setShowPw] = useState(false);

  async function handleLogin() {
    setLoading(true); setError("");
    const res = await fetch("/api/admin-login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) { router.push("/admin/dashboard"); }
    else { const d = await res.json(); setError(d.error ?? "Password salah."); setLoading(false); }
  }

  return (
    <main className="flex" style={{ minHeight: "100dvh", background: "#f0f4f8" }}>
      {/* Left panel — branding UAJY (hidden di mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: "linear-gradient(135deg,#003087 0%,#1a4fa0 60%,#2563eb 100%)" }}>
        {/* Grid + glow */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.4) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle,#FFD700 0%,transparent 70%)" }} />

        {/* Logo + nama */}
        <div className="relative z-10 flex items-center gap-3">
          <Image src="/atmalogo.png" alt="UAJY" width={48} height={48} />
          <div>
            <div className="text-white font-bold leading-tight">Universitas Atma Jaya</div>
            <div className="text-yellow-400 text-sm">Yogyakarta</div>
          </div>
        </div>

        {/* Tengah */}
        <div className="relative z-10">
          <ShieldCheck className="w-12 h-12 text-yellow-400 mb-5" />
          <h2 className="text-3xl font-bold text-white leading-tight mb-3">
            Panel Administrator<br />KKPKA
          </h2>
          <p className="text-blue-200 text-sm max-w-sm">
            Sistem manajemen data kuesioner kesehatan mental mahasiswa baru. Akses terbatas hanya untuk administrator resmi.
          </p>
        </div>

        <div className="relative z-10 text-blue-300/60 text-xs italic">
          Serviens in lumine veritatis
        </div>
      </div>

      {/* Right panel — form login */}
      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm">
          {/* Logo mobile */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <Image src="/atmalogo.png" alt="UAJY" width={56} height={56} />
            <div className="text-center mt-3">
              <div className="font-bold text-slate-800">Universitas Atma Jaya</div>
              <div className="text-sm text-slate-400">Yogyakarta</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden"
            style={{ boxShadow: "0 8px 40px rgba(0,48,135,0.12)" }}>
            <div className="h-1.5" style={{ background: "linear-gradient(90deg,#003087,#FFD700)" }} />
            <div className="p-8">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "linear-gradient(135deg,#003087,#1a4fa0)" }}>
                <Lock className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-800 mb-1">Login Administrator</h1>
              <p className="text-sm text-slate-400 mb-6">Masukkan password untuk mengakses dashboard</p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold mb-1.5 block text-slate-500 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                      placeholder="••••••••"
                      className="w-full rounded-xl px-4 py-3 pr-11 text-slate-800 placeholder-slate-300 focus:outline-none text-sm transition-all"
                      style={{
                        background: "#f8fafc",
                        border: focused ? "1.5px solid #003087" : "1.5px solid #e2e8f0",
                        boxShadow: focused ? "0 0 0 3px rgba(0,48,135,0.08)" : "none"
                      }} />
                    <button type="button" onClick={() => setShowPw(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {error && <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 text-xs">{error}</motion.p>}
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={handleLogin} disabled={loading}
                  className="w-full py-3.5 rounded-xl font-semibold text-white text-sm disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg,#003087,#1a4fa0)", boxShadow: "0 4px 20px rgba(0,48,135,0.3)" }}>
                  {loading ? "Memverifikasi..." : "Masuk ke Dashboard"}
                </motion.button>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-slate-300 mt-5">
            Halaman ini dilindungi · Akses tercatat
          </p>
        </motion.div>
      </div>
    </main>
  );
}
