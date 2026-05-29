"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, Brain, Activity, Zap } from "lucide-react";
import { JENJANG_LIST, PRODI_BY_JENJANG } from "@/lib/dass42";

const INFO_CARDS = [
  { Icon: Brain,    label: "Depresi",   desc: "Mengukur tingkat kesedihan, kehilangan minat, dan perasaan tidak berharga.", bg: "linear-gradient(135deg,#1e3a8a,#2563eb)" },
  { Icon: Activity, label: "Kecemasan", desc: "Mengukur rasa khawatir berlebihan, ketakutan, dan gejala fisik kecemasan.", bg: "linear-gradient(135deg,#4c1d95,#7c3aed)" },
  { Icon: Zap,      label: "Stres",     desc: "Mengukur tingkat tekanan, mudah marah, dan kesulitan untuk rileks.", bg: "linear-gradient(135deg,#0c4a6e,#0284c7)" },
];

const inputStyle = (focused: boolean) => ({
  background: "#f8fafc",
  border: focused ? "1.5px solid #003087" : "1.5px solid #e2e8f0",
  boxShadow: focused ? "0 0 0 3px rgba(0,48,135,0.08)" : "none",
});

export default function Home() {
  const router = useRouter();
  const [form, setForm] = useState({ nama: "", npm: "", email: "", usia: "", jenjang: "", prodi: "" });
  const [focused, setFocused] = useState<string | null>(null);
  const [error, setError] = useState("");

  function set(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val, ...(key === "jenjang" ? { prodi: "" } : {}) }));
  }

  function handleStart() {
    const { nama, npm, email, usia, jenjang, prodi } = form;
    if (!nama.trim() || !npm.trim() || !email.trim() || !usia || !jenjang || !prodi) {
      setError("Semua field wajib diisi."); return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError("Format email tidak valid."); return; }
    sessionStorage.setItem("responden", JSON.stringify({ nama: nama.trim(), npm: npm.trim(), email: email.trim(), usia, jenjang, prodi }));
    router.push("/kuesioner");
  }

  const prodiList = form.jenjang ? PRODI_BY_JENJANG[form.jenjang] : [];

  return (
    <main style={{ minHeight: "100dvh", background: "#f0f4f8" }}>
      {/* Hero */}
      <div className="relative" style={{ background: "linear-gradient(135deg,#003087 0%,#1a4fa0 60%,#2563eb 100%)" }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.4) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute top-0 right-0 w-80 h-80 opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle,#FFD700 0%,transparent 70%)" }} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-16 text-center">
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
            Kuesioner Kesehatan Mental<br />
            <span style={{ color: "#FFD700" }}>Mahasiswa Baru UAJY</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-blue-200 text-sm sm:text-base">
            Depression Anxiety Stress Scales (DASS-42)
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Form card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-white rounded-3xl overflow-hidden"
            style={{ boxShadow: "0 8px 40px rgba(0,48,135,0.12)" }}>
            <div className="h-1.5" style={{ background: "linear-gradient(90deg,#003087,#FFD700)" }} />
            <div className="p-6 sm:p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#003087,#1a4fa0)" }}>
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-base font-bold text-slate-800">Data Diri</div>
                  <div className="text-xs text-slate-400">Isi semua field sebelum memulai</div>
                </div>
              </div>

              <div className="space-y-3.5">
                {/* Nama */}
                <div>
                  <label className="text-xs font-semibold mb-1 block text-slate-500 uppercase tracking-wider">Nama Lengkap</label>
                  <input type="text" value={form.nama} onChange={e => set("nama", e.target.value)}
                    onFocus={() => setFocused("nama")} onBlur={() => setFocused(null)}
                    placeholder="Masukkan nama lengkap..."
                    className="w-full rounded-xl px-4 py-3 text-slate-800 placeholder-slate-300 focus:outline-none text-sm transition-all"
                    style={inputStyle(focused === "nama")} />
                </div>

                {/* NPM */}
                <div>
                  <label className="text-xs font-semibold mb-1 block text-slate-500 uppercase tracking-wider">NPM</label>
                  <input type="text" value={form.npm} onChange={e => set("npm", e.target.value)}
                    onFocus={() => setFocused("npm")} onBlur={() => setFocused(null)}
                    placeholder="Nomor Pokok Mahasiswa..."
                    className="w-full rounded-xl px-4 py-3 text-slate-800 placeholder-slate-300 focus:outline-none text-sm transition-all"
                    style={inputStyle(focused === "npm")} />
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-semibold mb-1 block text-slate-500 uppercase tracking-wider">Email</label>
                  <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                    onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                    placeholder="email@student.uajy.ac.id"
                    className="w-full rounded-xl px-4 py-3 text-slate-800 placeholder-slate-300 focus:outline-none text-sm transition-all"
                    style={inputStyle(focused === "email")} />
                </div>

                {/* Usia */}
                <div>
                  <label className="text-xs font-semibold mb-1 block text-slate-500 uppercase tracking-wider">Usia</label>
                  <input type="number" value={form.usia} onChange={e => set("usia", e.target.value)}
                    onFocus={() => setFocused("usia")} onBlur={() => setFocused(null)}
                    placeholder="Usia dalam tahun..." min={15} max={60}
                    className="w-full rounded-xl px-4 py-3 text-slate-800 placeholder-slate-300 focus:outline-none text-sm transition-all"
                    style={inputStyle(focused === "usia")} />
                </div>

                {/* Jenjang */}
                <div>
                  <label className="text-xs font-semibold mb-1 block text-slate-500 uppercase tracking-wider">Jenjang Studi</label>
                  <div className="flex gap-2">
                    {JENJANG_LIST.map(j => (
                      <button key={j} type="button" onClick={() => set("jenjang", j)}
                        className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                        style={form.jenjang === j ? {
                          background: "linear-gradient(135deg,#003087,#1a4fa0)", color: "white",
                          boxShadow: "0 4px 12px rgba(0,48,135,0.3)"
                        } : {
                          background: "#f8fafc", color: "#64748b", border: "1.5px solid #e2e8f0"
                        }}>
                        {j}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prodi — muncul setelah jenjang dipilih */}
                <motion.div
                  initial={false}
                  animate={{ opacity: form.jenjang ? 1 : 0.4, y: form.jenjang ? 0 : 4 }}
                  transition={{ duration: 0.2 }}>
                  <label className="text-xs font-semibold mb-1 block text-slate-500 uppercase tracking-wider">Program Studi</label>
                  <select value={form.prodi} onChange={e => set("prodi", e.target.value)}
                    disabled={!form.jenjang}
                    className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none appearance-none transition-all disabled:opacity-50"
                    style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: form.prodi ? "#1e293b" : "#94a3b8" }}>
                    <option value="" disabled>{form.jenjang ? "Pilih program studi..." : "Pilih jenjang dulu..."}</option>
                    {prodiList.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </motion.div>

                {error && <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 text-xs">{error}</motion.p>}

                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={handleStart}
                  className="w-full py-3.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 mt-1"
                  style={{ background: "linear-gradient(135deg,#003087,#1a4fa0)", boxShadow: "0 4px 20px rgba(0,48,135,0.3)" }}>
                  Mulai Kuesioner <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>

              <p className="text-center text-xs mt-5 text-slate-300">Hasil bersifat rahasia · Hanya untuk keperluan akademik</p>
            </div>
          </motion.div>

          {/* Info cards */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-700">Apa yang diukur?</h2>
            {INFO_CARDS.map((card, i) => (
              <motion.div key={card.label}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.02, x: 4 }}
                className="rounded-2xl p-5 flex items-start gap-4 relative overflow-hidden"
                style={{ background: card.bg, boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}>
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-20 pointer-events-none"
                  style={{ background: "radial-gradient(circle,white 0%,transparent 70%)", transform: "translate(30%,-30%)" }} />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/20">
                  <card.Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white mb-1">{card.label}</div>
                  <div className="text-xs leading-relaxed text-white/75">{card.desc}</div>
                </div>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className="rounded-2xl p-4 flex items-center gap-3 bg-white"
              style={{ boxShadow: "0 2px 12px rgba(0,48,135,0.06)", border: "1px solid rgba(0,48,135,0.08)" }}>
              <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: "linear-gradient(180deg,#003087,#FFD700)" }} />
              <div>
                <div className="text-xs font-semibold text-slate-600">Universitas Atma Jaya Yogyakarta</div>
                <div className="text-xs text-slate-400 italic">Serviens in lumine veritatis</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
