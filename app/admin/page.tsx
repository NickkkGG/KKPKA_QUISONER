"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true); setError("");
    const res = await fetch("/api/admin-login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) { router.push("/admin/dashboard"); }
    else { setError("Password salah."); setLoading(false); }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]"
          style={{ background: "radial-gradient(circle, rgba(219,234,254,0.6) 0%, transparent 70%)" }} />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-8 w-full max-w-sm z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #dbeafe, #eff6ff)", border: "1px solid #bfdbfe" }}>
            <Lock className="w-6 h-6 text-blue-500" />
          </div>
          <h1 className="text-xl font-bold gradient-text">Admin KKPKA</h1>
          <p className="text-xs mt-1 text-slate-400">Akses terbatas — masukkan password</p>
        </div>
        <div className="space-y-4">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Password admin..."
            className="w-full rounded-xl px-4 py-3 text-slate-800 placeholder-slate-300 focus:outline-none text-sm transition-all"
            style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0" }}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <motion.button whileTap={{ scale: 0.97 }} onClick={handleLogin} disabled={loading}
            className="gradient-btn w-full py-3 rounded-xl font-semibold text-white disabled:opacity-50">
            {loading ? "Memverifikasi..." : "Masuk"}
          </motion.button>
        </div>
      </motion.div>
    </main>
  );
}
