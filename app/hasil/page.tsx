"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView, animate } from "framer-motion";
import { CheckCircle, Heart, Activity, Zap, RotateCcw } from "lucide-react";
import { calculateScores, interpretDepresi, interpretKecemasan, interpretStress } from "@/lib/dass42";

const LEVEL_STYLE: Record<string, { color: string; bg: string; border: string; gradient: string }> = {
  Normal:         { color: "#fff", bg: "linear-gradient(135deg,#166534,#16a34a)", border: "#4ade80", gradient: "linear-gradient(135deg,#166534,#16a34a)" },
  Ringan:         { color: "#fff", bg: "linear-gradient(135deg,#854d0e,#ca8a04)", border: "#facc15", gradient: "linear-gradient(135deg,#854d0e,#ca8a04)" },
  Sedang:         { color: "#fff", bg: "linear-gradient(135deg,#9a3412,#ea580c)", border: "#fb923c", gradient: "linear-gradient(135deg,#9a3412,#ea580c)" },
  Parah:          { color: "#fff", bg: "linear-gradient(135deg,#991b1b,#dc2626)", border: "#f87171", gradient: "linear-gradient(135deg,#991b1b,#dc2626)" },
  "Sangat Parah": { color: "#fff", bg: "linear-gradient(135deg,#7f1d1d,#b91c1c)", border: "#fca5a5", gradient: "linear-gradient(135deg,#7f1d1d,#b91c1c)" },
};

const MOTIVASI: Record<string, string> = {
  Normal: "Kondisi mentalmu dalam keadaan baik. Pertahankan pola hidup sehat dan terus jaga keseimbanganmu.",
  Ringan: "Ada sedikit tekanan yang kamu rasakan. Istirahat cukup dan berbagi cerita dengan orang terdekat bisa membantu.",
  Sedang: "Kondisi ini perlu perhatian lebih. Jangan ragu untuk berbicara dengan konselor atau orang yang kamu percaya.",
  Parah: "Kondisi ini memerlukan penanganan. Segera konsultasikan dengan konselor kampus atau tenaga kesehatan mental.",
  "Sangat Parah": "Tolong segera hubungi konselor atau tenaga kesehatan mental. Kamu tidak harus menghadapi ini sendirian.",
};

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const ctrl = animate(0, value, {
      duration: 1.2, ease: "easeOut",
      onUpdate: v => { if (ref.current) ref.current.textContent = Math.round(v).toString(); },
    });
    return ctrl.stop;
  }, [inView, value]);
  return <span ref={ref}>0</span>;
}

function ScoreCard({ label, Icon, score, maxScore, interpret, delay }: {
  label: string; Icon: React.ElementType; score: number; maxScore: number;
  interpret: { level: string; color: string }; delay: number;
}) {
  const s = LEVEL_STYLE[interpret.level];
  const pct = Math.min((score / maxScore) * 100, 100);
  return (
    <motion.div initial={{ opacity: 0, y: 24, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 280, damping: 22 }}
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{ background: s.bg, boxShadow: `0 8px 32px rgba(0,0,0,0.3)` }}>
      {/* Glow top-right */}
      <div className="absolute top-0 right-0 w-28 h-28 rounded-full pointer-events-none opacity-30"
        style={{ background: `radial-gradient(circle, white 0%, transparent 70%)`, transform: "translate(40%,-40%)" }} />

      <div className="flex items-center justify-between mb-4 relative">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/20">
            <Icon className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-white">{label}</span>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold text-white tabular-nums"><AnimatedNumber value={score} /></span>
          <span className="text-white/40 text-xs">/{maxScore}</span>
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden mb-3 bg-black/20">
        <motion.div className="h-full rounded-full bg-white/80"
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ delay: delay + 0.4, duration: 1, ease: [0.34, 1.56, 0.64, 1] }} />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-white">{interpret.level}</span>
        <div className="flex gap-1">
          {["Normal","Ringan","Sedang","Parah","Sangat Parah"].map((lvl) => (
            <div key={lvl} className="w-1.5 h-1.5 rounded-full"
              style={{ background: lvl === interpret.level ? "white" : "rgba(255,255,255,0.2)" }} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function HasilPage() {
  const router = useRouter();
  const [data, setData] = useState<{ nama: string; prodi: string } | null>(null);
  const [scores, setScores] = useState<{ depresi: number; kecemasan: number; stress: number } | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const responden = sessionStorage.getItem("responden");
    const answersRaw = sessionStorage.getItem("answers");
    if (!responden || !answersRaw) { router.replace("/"); return; }
    const parsed = JSON.parse(responden);
    const answers: number[] = JSON.parse(answersRaw);
    setData(parsed);
    setScores(calculateScores(answers));
    fetch("/api/submit", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...parsed, answers }),
    }).then(() => setSaved(true));
  }, [router]);

  if (!data || !scores) return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: "#0a0f1e" }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 rounded-full border-2 border-yellow-400 border-t-transparent" />
    </main>
  );

  const dResult = interpretDepresi(scores.depresi);
  const kResult = interpretKecemasan(scores.kecemasan);
  const sResult = interpretStress(scores.stress);
  const order = ["Normal","Ringan","Sedang","Parah","Sangat Parah"];
  const worst = [dResult.level, kResult.level, sResult.level].reduce((a, b) => order.indexOf(a) > order.indexOf(b) ? a : b);

  return (
    <main className="min-h-screen px-4 py-10 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg,#0a0f1e 0%,#0d1b3e 50%,#0a0f1e 100%)" }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 70% 10%, rgba(37,99,235,0.12) 0%, transparent 60%)" }} />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8">
          <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#003087,#1a4fa0)", boxShadow: "0 8px 32px rgba(0,48,135,0.5)" }}>
            <CheckCircle className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold text-white mb-1">Hasil Kuesioner DASS-42</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-white/60 text-sm">{data.nama} · {data.prodi}</motion.p>
          {saved && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs"
              style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" /> Data tersimpan
            </motion.div>
          )}
        </motion.div>

        {/* 2-column layout on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left: Score cards */}
          <div className="space-y-4">
            <ScoreCard label="Depresi"   Icon={Heart}    score={scores.depresi}   maxScore={42} interpret={dResult} delay={0.1} />
            <ScoreCard label="Kecemasan" Icon={Activity} score={scores.kecemasan} maxScore={42} interpret={kResult} delay={0.25} />
            <ScoreCard label="Stres"     Icon={Zap}      score={scores.stress}    maxScore={42} interpret={sResult} delay={0.4} />
          </div>

          {/* Right: Summary + motivasi */}
          <div className="space-y-4">
            {/* Summary card */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="rounded-2xl p-6"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">Ringkasan Hasil</p>
              <div className="space-y-3">
                {[
                  { label: "Depresi", result: dResult, score: scores.depresi },
                  { label: "Kecemasan", result: kResult, score: scores.kecemasan },
                  { label: "Stres", result: sResult, score: scores.stress },
                ].map((item) => {
                  const s = LEVEL_STYLE[item.result.level];
                  return (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-sm text-white/70">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/40">{item.score}/42</span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
                          style={{ background: s.bg }}>
                          {item.result.level}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Motivasi */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}
              className="rounded-2xl p-6"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">Catatan untuk Kamu</p>
              <p className="text-sm leading-relaxed text-white/80">{MOTIVASI[worst]}</p>
            </motion.div>

            {/* UAJY info */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 }}
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: "rgba(0,48,135,0.3)", border: "1px solid rgba(0,48,135,0.5)" }}>
              <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: "linear-gradient(180deg,#003087,#FFD700)" }} />
              <div>
                <div className="text-xs font-semibold text-white/80">Universitas Atma Jaya Yogyakarta</div>
                <div className="text-xs text-white/40 italic">Program KKPKA 2024/2025</div>
              </div>
            </motion.div>

            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              onClick={() => { sessionStorage.clear(); router.push("/"); }}
              className="w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
              <RotateCcw className="w-3.5 h-3.5" /> Isi Ulang Kuesioner
            </motion.button>
          </div>
        </div>
      </div>
    </main>
  );
}
