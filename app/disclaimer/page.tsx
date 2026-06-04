"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ChevronRight } from "lucide-react";
import { useReadCountdown } from "@/lib/useReadCountdown";

const TIMER_SECONDS = 5;

const DISCLAIMER_ITEMS = [
  {
    text: (
      <>
        DASS-42 merupakan alat ukur psikologis yang digunakan untuk{" "}
        <strong>membantu mengenali tingkat stres, kecemasan, dan depresi</strong> yang dirasakan dalam periode tertentu.
      </>
    ),
  },
  {
    text: (
      <>
        Hasil yang ditampilkan <strong>bukan merupakan diagnosis klinis</strong> dan{" "}
        <strong>tidak dapat digunakan sebagai satu-satunya dasar</strong> untuk menentukan kondisi kesehatan mental seseorang.
      </>
    ),
  },
  {
    text: (
      <>
        <strong>Hasil asesmen ini bersifat reflektif dan edukatif</strong> untuk{" "}
        <strong>membantu peserta meningkatkan kesadaran terhadap kondisi psikologis diri.</strong>
      </>
    ),
  },
  {
    text: (
      <>
        Apabila hasil menunjukkan tingkat yang tinggi atau peserta merasa membutuhkan bantuan lebih lanjut, disarankan untuk
        berkonsultasi dengan psikolog, konselor, atau tenaga profesional terkait.
      </>
    ),
  },
];

function DuoButton({ onClick, disabled, children }: {
  onClick: () => void; disabled: boolean; children: React.ReactNode;
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <div className="relative w-full shrink-0" style={{ userSelect: "none" }}>
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl translate-y-1"
        style={{ background: disabled ? "rgba(0,0,0,0.1)" : "rgba(0,48,135,0.4)" }} />
      <motion.button
        onPointerDown={() => !disabled && setPressed(true)}
        onPointerUp={() => { if (!disabled) { setPressed(false); onClick(); } }}
        onPointerLeave={() => setPressed(false)}
        animate={{ y: pressed ? 3 : 0, scale: pressed ? 0.98 : 1 }}
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
        disabled={disabled}
        className="relative w-full rounded-xl sm:rounded-2xl py-3 sm:py-4 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors"
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
  const { timeLeft, progress, ready } = useReadCountdown(TIMER_SECONDS);

  useEffect(() => {
    if (!sessionStorage.getItem("responden")) { router.replace("/"); return; }
  }, [router]);

  return (
    <main
      className="flex flex-col overflow-hidden bg-[#f0f4f8]"
      style={{ height: "calc(100dvh - 4.125rem)" }}>
      {/* Header ringkas */}
      <header
        className="shrink-0 relative"
        style={{ background: "linear-gradient(135deg,#003087 0%,#1a4fa0 60%,#2563eb 100%)" }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.4) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="relative z-10 max-w-lg mx-auto px-4 py-2.5 sm:py-3 flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 bg-white/20 border border-white/30">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0 text-left">
            <h1 className="text-base sm:text-lg font-bold text-white leading-tight">Disclaimer</h1>
            <p className="text-[10px] sm:text-xs text-blue-200 leading-snug">Harap baca sebelum melanjutkan</p>
          </div>
        </div>
      </header>

      {/* Satu kotak — isi + timer + tombol */}
      <section className="flex flex-1 flex-col min-h-0 px-3 sm:px-4 py-2 sm:py-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex flex-1 flex-col min-h-0 bg-white rounded-2xl px-3.5 py-3 sm:px-5 sm:py-4"
          style={{ boxShadow: "0 2px 12px rgba(0,48,135,0.08)", border: "1px solid rgba(0,48,135,0.06)" }}>
          <div className="h-0.5 w-7 rounded-full mb-2 sm:mb-3 shrink-0" style={{ background: "linear-gradient(90deg,#003087,#FFD700)" }} />

          <ol className="flex-1 min-h-0 space-y-1.5 sm:space-y-2.5 overflow-hidden [@media(max-height:700px)]:space-y-1">
            {DISCLAIMER_ITEMS.map((item, i) => (
              <li key={i} className="flex gap-2 sm:gap-2.5 items-start">
                <span
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 mt-px"
                  style={{ background: "linear-gradient(135deg,#003087,#1a4fa0)", color: "white" }}>
                  {i + 1}
                </span>
                <p className="text-[10.5px] sm:text-xs text-slate-600 leading-snug sm:leading-relaxed [@media(max-height:700px)]:text-[10px] [@media(max-height:700px)]:leading-[1.35]">
                  {item.text}
                </p>
              </li>
            ))}
          </ol>

          <div className="shrink-0 pt-2.5 sm:pt-3 mt-2 sm:mt-3 border-t border-slate-100">
            <AnimatePresence>
              {!ready && (
                <motion.div exit={{ opacity: 0 }} className="mb-2.5 sm:mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] sm:text-xs text-slate-400">Harap baca disclaimer...</span>
                    <span className="text-[10px] sm:text-xs font-bold tabular-nums" style={{ color: "#003087" }}>
                      {timeLeft}s
                    </span>
                  </div>
                  <div className="h-1.5 sm:h-2 rounded-full overflow-hidden bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${progress}%`,
                        background: "linear-gradient(90deg,#003087,#FFD700)",
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <DuoButton onClick={() => router.push("/instruksi")} disabled={!ready}>
              {ready ? (
                <><ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" /> Saya Mengerti, Lanjutkan</>
              ) : (
                <>Mohon baca disclaimer ({timeLeft}s)</>
              )}
            </DuoButton>
          </div>
        </motion.div>
      </section>
    </main>
  );
}