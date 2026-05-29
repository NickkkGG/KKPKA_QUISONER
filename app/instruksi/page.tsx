"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, Heart, Shield, AlertCircle } from "lucide-react";

const TIMER_SECONDS = 5;

const INSTRUCTIONS = [
  {
    icon: <Heart className="w-5 h-5" style={{ color: "#003087" }} />,
    title: "Jawab dengan Jujur",
    desc: "Tidak ada jawaban benar atau salah. Jawablah sesuai kondisi yang kamu rasakan dalam beberapa minggu terakhir.",
  },
  {
    icon: <AlertCircle className="w-5 h-5" style={{ color: "#003087" }} />,
    title: "Kondisi Saat Ini",
    desc: "Jawablah berdasarkan perasaan dan kondisi yang kamu alami saat ini, bukan kondisi ideal yang kamu inginkan.",
  },
  {
    icon: <Clock className="w-5 h-5" style={{ color: "#003087" }} />,
    title: "Cara Menjawab",
    desc: "Pilih salah satu dari 4 pilihan: Tidak Pernah (0), Kadang-kadang (1), Sering (2), atau Hampir Selalu (3).",
  },
  {
    icon: <Shield className="w-5 h-5" style={{ color: "#003087" }} />,
    title: "Data Bersifat Rahasia",
    desc: "Semua jawaban hanya digunakan untuk keperluan akademik KKPKA dan tidak akan disebarluaskan.",
  },
];

function DuoButton({ onClick, disabled, children }: {
  onClick: () => void; disabled: boolean; children: React.ReactNode;
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <div className="relative w-full" style={{ userSelect: "none" }}>
      <div className="absolute inset-0 rounded-2xl translate-y-1"
        style={{ background: disabled ? "rgba(0,0,0,0.1)" : "rgba(0,48,135,0.4)" }} />
      <motion.button
        onPointerDown={() => !disabled && setPressed(true)}
        onPointerUp={() => { if (!disabled) { setPressed(false); onClick(); } }}
        onPointerLeave={() => setPressed(false)}
        animate={{ y: pressed ? 3 : 0, scale: pressed ? 0.98 : 1 }}
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
        disabled={disabled}
        className="relative w-full rounded-2xl py-4 font-bold text-base flex items-center justify-center gap-2 transition-colors"
        style={disabled ? {
          background: "#e2e8f0", color: "#94a3b8", cursor: "not-allowed"
        } : {
          background: "linear-gradient(135deg,#003087,#1a4fa0)", color: "white",
          boxShadow: "0 4px 0 rgba(0,48,135,0.3)"
        }}>
        {children}
      </motion.button>
    </div>
  );
}

export default function InstruksiPage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("responden")) { router.replace("/"); return; }
  }, [router]);

  useEffect(() => {
    if (timeLeft <= 0) { setReady(true); return; }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const pct = ((TIMER_SECONDS - timeLeft) / TIMER_SECONDS) * 100;

  return (
    <main style={{ minHeight: "100dvh", background: "#f0f4f8" }}>
      {/* Hero */}
      <div className="relative" style={{ background: "linear-gradient(135deg,#003087 0%,#1a4fa0 60%,#2563eb 100%)" }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.4) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 max-w-lg mx-auto px-4 pt-20 pb-8 text-center">
          <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center bg-white/20 border border-white/30">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white mb-1">Sebelum Memulai</h1>
          <p className="text-blue-200 text-sm">Baca instruksi berikut dengan seksama</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Instruction cards */}
        {INSTRUCTIONS.map((item, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }}
            className="bg-white rounded-2xl p-5 flex items-start gap-4"
            style={{ boxShadow: "0 2px 12px rgba(0,48,135,0.08)", border: "1px solid rgba(0,48,135,0.06)" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(0,48,135,0.08)" }}>
              {item.icon}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 mb-0.5">{item.title}</div>
              <div className="text-xs text-slate-500 leading-relaxed">{item.desc}</div>
            </div>
          </motion.div>
        ))}

        {/* Skala jawaban */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, type: "spring", stiffness: 300 }}
          className="bg-white rounded-2xl p-5"
          style={{ boxShadow: "0 2px 12px rgba(0,48,135,0.08)", border: "1px solid rgba(0,48,135,0.06)" }}>
          <div className="h-1 w-8 rounded-full mb-3" style={{ background: "linear-gradient(90deg,#003087,#FFD700)" }} />
          <div className="text-sm font-bold text-slate-800 mb-3">Skala Jawaban</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { val: "0", label: "Tidak Pernah" },
              { val: "1", label: "Kadang-kadang" },
              { val: "2", label: "Sering" },
              { val: "3", label: "Hampir Selalu" },
            ].map(s => (
              <div key={s.val} className="flex items-center gap-2 rounded-xl px-3 py-2"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#003087,#1a4fa0)", color: "white" }}>
                  {s.val}
                </span>
                <span className="text-xs text-slate-600 font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Timer + button */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }} className="pb-4">

          {/* Timer bar */}
          <AnimatePresence>
            {!ready && (
              <motion.div exit={{ opacity: 0 }} className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-400">Harap baca instruksi...</span>
                  <span className="text-xs font-bold tabular-nums" style={{ color: "#003087" }}>
                    {timeLeft}s
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-slate-100">
                  <motion.div className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg,#003087,#FFD700)" }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.9, ease: "linear" }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <DuoButton onClick={() => router.push("/kuesioner")} disabled={!ready}>
            {ready ? (
              <><CheckCircle className="w-5 h-5" /> Saya Mengerti, Mulai Kuesioner</>
            ) : (
              <>Mohon baca instruksi ({timeLeft}s)</>
            )}
          </DuoButton>
        </motion.div>
      </div>
    </main>
  );
}
