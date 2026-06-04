"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ChevronRight } from "lucide-react";

const TIMER_SECONDS = 3;

const DISCLAIMER_PARAGRAPHS = [
  <>
    DASS-42 merupakan alat ukur psikologis yang digunakan untuk{" "}
    <strong>membantu mengenali tingkat stres, kecemasan, dan depresi</strong> yang dirasakan dalam periode tertentu.
  </>,
  <>
    Hasil yang ditampilkan <strong>bukan merupakan diagnosis klinis</strong> dan{" "}
    <strong>tidak dapat digunakan sebagai satu-satunya dasar</strong> untuk menentukan kondisi kesehatan mental seseorang.
  </>,
  <>
    <strong>Hasil asesmen ini bersifat reflektif dan edukatif</strong> untuk{" "}
    <strong>membantu peserta meningkatkan kesadaran terhadap kondisi psikologis diri.</strong>
  </>,
  <>
    Apabila hasil menunjukkan tingkat yang tinggi atau peserta merasa membutuhkan bantuan lebih lanjut, disarankan untuk
    berkonsultasi dengan psikolog, konselor, atau tenaga profesional terkait.
  </>,
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

export default function DisclaimerPage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) { setReady(true); return; }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const pct = ((TIMER_SECONDS - timeLeft) / TIMER_SECONDS) * 100;

  return (
    <main style={{ minHeight: "100dvh", background: "#f0f4f8" }}>
      <div className="relative" style={{ background: "linear-gradient(135deg,#003087 0%,#1a4fa0 60%,#2563eb 100%)" }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.4) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 max-w-lg mx-auto px-4 pt-20 pb-8 text-center">
          <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center bg-white/20 border border-white/30">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white mb-1">Disclaimer</h1>
          <p className="text-blue-200 text-sm">Harap baca informasi berikut sebelum melanjutkan</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-white rounded-2xl p-5 sm:p-6"
          style={{ boxShadow: "0 2px 12px rgba(0,48,135,0.08)", border: "1px solid rgba(0,48,135,0.06)" }}>
          <div className="h-1 w-8 rounded-full mb-4" style={{ background: "linear-gradient(90deg,#003087,#FFD700)" }} />
          <div className="space-y-4">
            {DISCLAIMER_PARAGRAPHS.map((para, i) => (
              <p key={i} className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }} className="pb-4">

          <AnimatePresence>
            {!ready && (
              <motion.div exit={{ opacity: 0 }} className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-400">Harap baca disclaimer...</span>
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

          <DuoButton onClick={() => router.push("/daftar")} disabled={!ready}>
            {ready ? (
              <><ChevronRight className="w-5 h-5" /> Saya Mengerti, Lanjutkan</>
            ) : (
              <>Mohon baca disclaimer ({timeLeft}s)</>
            )}
          </DuoButton>
        </motion.div>
      </div>
    </main>
  );
}