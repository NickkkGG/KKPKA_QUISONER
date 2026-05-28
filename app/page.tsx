"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ChevronRight, Shield, Clock, Users, Brain, Activity, Zap } from "lucide-react";
import { PRODI_LIST } from "@/lib/dass42";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const INFO_CARDS = [
  {
    Icon: Brain, label: "Depresi",
    desc: "Mengukur tingkat kesedihan, kehilangan minat, dan perasaan tidak berharga.",
    color: "#3b82f6", bg: "linear-gradient(135deg, #1e3a8a, #2563eb)", accent: "rgba(59,130,246,0.3)"
  },
  {
    Icon: Activity, label: "Kecemasan",
    desc: "Mengukur rasa khawatir berlebihan, ketakutan, dan gejala fisik kecemasan.",
    color: "#8b5cf6", bg: "linear-gradient(135deg, #4c1d95, #7c3aed)", accent: "rgba(139,92,246,0.3)"
  },
  {
    Icon: Zap, label: "Stres",
    desc: "Mengukur tingkat tekanan, mudah marah, dan kesulitan untuk rileks.",
    color: "#0ea5e9", bg: "linear-gradient(135deg, #0c4a6e, #0284c7)", accent: "rgba(14,165,233,0.3)"
  },
];

export default function Home() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [prodi, setProdi] = useState("");
  const [error, setError] = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [3, -3]);
  const rotateY = useTransform(mouseX, [-300, 300], [-3, 3]);

  function handleStart() {
    if (!nama.trim() || !prodi) { setError("Nama dan Program Studi wajib diisi."); return; }
    sessionStorage.setItem("responden", JSON.stringify({ nama: nama.trim(), prodi }));
    router.push("/kuesioner");
  }

  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: "#f0f4f8" }}>
      {/* Hero blue header */}
      <div className="absolute top-0 left-0 right-0 h-80 pointer-events-none"
        style={{ background: "linear-gradient(135deg, #003087 0%, #1a4fa0 60%, #2563eb 100%)" }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute top-0 right-0 w-80 h-80 opacity-15"
          style={{ background: "radial-gradient(circle, #FFD700 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-10 pb-16">
        {/* Hero text */}
        <motion.div variants={container} initial="hidden" animate="show" className="text-center mb-10">
          <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
            style={{ background: "rgba(255,215,0,0.2)", color: "#FFD700", border: "1px solid rgba(255,215,0,0.35)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            Program KKPKA 2024/2025
          </motion.div>
          <motion.h1 variants={item} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
            Kuesioner Kesehatan Mental<br />
            <span style={{ color: "#FFD700" }}>Mahasiswa Baru UAJY</span>
          </motion.h1>
          <motion.p variants={item} className="text-blue-200 text-sm sm:text-base max-w-xl mx-auto mb-6">
            Depression Anxiety Stress Scales (DASS-42)
          </motion.p>
          <motion.div variants={item} className="flex flex-wrap justify-center gap-6">
            {[
              { icon: <Users className="w-4 h-4" />, label: "42 Pertanyaan" },
              { icon: <Clock className="w-4 h-4" />, label: "±10 Menit" },
              { icon: <Shield className="w-4 h-4" />, label: "Data Rahasia" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-blue-200 text-sm">{s.icon}{s.label}</div>
            ))}
          </motion.div>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* Form card — elevated with shadow, distinct from bg */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            style={{ rotateX, rotateY, transformPerspective: 1200, boxShadow: "0 24px 64px rgba(0,48,135,0.18), 0 0 0 1px rgba(0,48,135,0.08)" }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              mouseX.set(e.clientX - rect.left - rect.width / 2);
              mouseY.set(e.clientY - rect.top - rect.height / 2);
            }}
            onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
            className="rounded-3xl overflow-hidden">

            {/* Card top accent */}
            <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #003087, #FFD700)" }} />

            <div className="bg-white p-7">
              {/* Card header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #003087, #1a4fa0)" }}>
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
                    style={{
                      background: "#f8fafc",
                      border: focused === "nama" ? "1.5px solid #003087" : "1.5px solid #e2e8f0",
                      boxShadow: focused === "nama" ? "0 0 0 3px rgba(0,48,135,0.08)" : "none"
                    }} />
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

                {error && (
                  <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 text-xs">{error}</motion.p>
                )}

                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={handleStart}
                  className="w-full py-3.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 mt-1"
                  style={{ background: "linear-gradient(135deg, #003087, #1a4fa0)", boxShadow: "0 4px 20px rgba(0,48,135,0.3)" }}>
                  Mulai Kuesioner <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>

              <p className="text-center text-xs mt-5 text-slate-300">
                Hasil bersifat rahasia · Hanya untuk keperluan akademik
              </p>
            </div>
          </motion.div>

          {/* Info cards — dark gradient, berwarna */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }} className="space-y-4">

            <div className="text-slate-700 font-semibold text-base mb-1 lg:text-white">Apa yang diukur?</div>

            {INFO_CARDS.map((card, i) => (
              <motion.div key={card.label}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.02, x: 4 }}
                className="rounded-2xl p-5 flex items-start gap-4 relative overflow-hidden"
                style={{ background: card.bg, boxShadow: `0 8px 32px ${card.accent}` }}>
                {/* Glow blob */}
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${card.accent} 0%, transparent 70%)`, transform: "translate(30%,-30%)" }} />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}>
                  <card.Icon className="w-5 h-5 text-white" />
                </div>
                <div className="relative">
                  <div className="text-sm font-bold text-white mb-1">{card.label}</div>
                  <div className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>{card.desc}</div>
                </div>
              </motion.div>
            ))}

            {/* UAJY motto */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: "rgba(0,48,135,0.06)", border: "1px solid rgba(0,48,135,0.1)" }}>
              <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: "linear-gradient(180deg, #003087, #FFD700)" }} />
              <div>
                <div className="text-xs font-semibold text-slate-600">Universitas Atma Jaya Yogyakarta</div>
                <div className="text-xs text-slate-400 italic">Serviens in lumine veritatis</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
