"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, Shield, Clock, Users, Brain, Activity, Zap } from "lucide-react";
import { PRODI_LIST } from "@/lib/dass42";

const INFO_CARDS = [
  { Icon: Brain,    label: "Depresi",   desc: "Mengukur tingkat kesedihan, kehilangan minat, dan perasaan tidak berharga.", bg: "linear-gradient(135deg,#1e3a8a,#2563eb)" },
  { Icon: Activity, label: "Kecemasan", desc: "Mengukur rasa khawatir berlebihan, ketakutan, dan gejala fisik kecemasan.", bg: "linear-gradient(135deg,#4c1d95,#7c3aed)" },
  { Icon: Zap,      label: "Stres",     desc: "Mengukur tingkat tekanan, mudah marah, dan kesulitan untuk rileks.", bg: "linear-gradient(135deg,#0c4a6e,#0284c7)" },
];

export default function Home() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [prodi, setProdi] = useState("");
  const [error, setError] = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  function handleStart() {
    if (!nama.trim() || !prodi) { setError("Nama dan Program Studi wajib diisi."); return; }
    sessionStorage.setItem("responden", JSON.stringify({ nama: nama.trim(), prodi }));
    router.push("/kuesioner");
  }

  return (
    <main className="min-h-screen" style={{ background: "#f0f4f8" }}>
      {/* ===== HERO SECTION ===== */}
      <div className="relative" style={{ background: "linear-gradient(135deg,#003087 0%,#1a4fa0 60%,#2563eb 100%)" }}>
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.4) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute top-0 right-0 w-80 h-80 opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle,#FFD700 0%,transparent 70%)" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-16 text-center">
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
            Kuesioner Kesehatan Mental<br />
            <span style={{ color: "#FFD700" }}>Mahasiswa Baru UAJY</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-blue-200 text-sm sm:text-base mb-8">
            Depression Anxiety Stress Scales (DASS-42)
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 mb-2">
            {[
              { icon: <Users className="w-4 h-4" />, label: "42 Pertanyaan" },
              { icon: <Clock className="w-4 h-4" />, label: "±10 Menit" },
              { icon: <Shield className="w-4 h-4" />, label: "Data Rahasia" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-blue-200 text-sm">{s.icon}{s.label}</div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ===== CONTENT SECTION ===== */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Form card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl overflow-hidden"
            style={{ boxShadow: "0 8px 40px rgba(0,48,135,0.12)" }}>
            <div className="h-1.5" style={{ background: "linear-gradient(90deg,#003087,#FFD700)" }} />
            <div className="p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#003087,#1a4fa0)" }}>
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-base font-bold text-slate-800">Mulai Kuesioner</div>
                  <div className="text-xs text-slate-400">Isi data diri terlebih dahulu</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold mb-1.5 block text-slate-500 uppercase tracking-wider">Nama Lengkap</label>
                  <input type="text" value={nama} onChange={(e) => setNama(e.target.value)}
                    onFocus={() => setFocused("nama")} onBlur={() => setFocused(null)}
                    placeholder="Masukkan nama lengkap..."
                    className="w-full rounded-xl px-4 py-3 text-slate-800 placeholder-slate-300 focus:outline-none text-sm transition-all"
                    style={{ background: "#f8fafc", border: focused === "nama" ? "1.5px solid #003087" : "1.5px solid #e2e8f0", boxShadow: focused === "nama" ? "0 0 0 3px rgba(0,48,135,0.08)" : "none" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1.5 block text-slate-500 uppercase tracking-wider">Program Studi</label>
                  <select value={prodi} onChange={(e) => setProdi(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none appearance-none"
                    style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: prodi ? "#1e293b" : "#94a3b8" }}>
                    <option value="" disabled>Pilih program studi...</option>
                    {PRODI_LIST.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                {error && <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 text-xs">{error}</motion.p>}
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={handleStart}
                  className="w-full py-3.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2"
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
