"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView, animate } from "framer-motion";
import { CheckCircle, Heart, Activity, Zap, RotateCcw } from "lucide-react";
import { calculateScores, interpretDepresi, interpretKecemasan, interpretStress } from "@/lib/dass42";

const LEVEL_STYLE: Record<string, { color: string; bg: string; border: string; text: string }> = {
  Normal:         { color: "#166534", bg: "#f0fdf4", border: "#bbf7d0", text: "#16a34a" },
  Ringan:         { color: "#854d0e", bg: "#fefce8", border: "#fef08a", text: "#ca8a04" },
  Sedang:         { color: "#9a3412", bg: "#fff7ed", border: "#fed7aa", text: "#ea580c" },
  Parah:          { color: "#991b1b", bg: "#fef2f2", border: "#fecaca", text: "#dc2626" },
  "Sangat Parah": { color: "#7f1d1d", bg: "#fef2f2", border: "#fca5a5", text: "#b91c1c" },
};

const SCORE_GRADIENT: Record<string, string> = {
  Normal:         "linear-gradient(135deg,#166534,#16a34a)",
  Ringan:         "linear-gradient(135deg,#854d0e,#ca8a04)",
  Sedang:         "linear-gradient(135deg,#9a3412,#ea580c)",
  Parah:          "linear-gradient(135deg,#991b1b,#dc2626)",
  "Sangat Parah": "linear-gradient(135deg,#7f1d1d,#b91c1c)",
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
    <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 280, damping: 22 }}
      className="rounded-2xl p-5 bg-white"
      style={{ border: `1.5px solid ${s.border}`, boxShadow: `0 4px 20px rgba(0,0,0,0.06)` }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: SCORE_GRADIENT[interpret.level] }}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-slate-700">{label}</span>
        </div>
        <div>
          <span className="text-2xl font-bold tabular-nums" style={{ color: s.text }}>
            <AnimatedNumber value={score} />
          </span>
          <span className="text-slate-300 text-xs">/{maxScore}</span>
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: s.bg }}>
        <motion.div className="h-full rounded-full"
          style={{ background: SCORE_GRADIENT[interpret.level] }}
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ delay: delay + 0.4, duration: 1, ease: [0.34, 1.56, 0.64, 1] }} />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-bold px-2.5 py-0.5 rounded-full text-white"
          style={{ background: SCORE_GRADIENT[interpret.level] }}>
          {interpret.level}
        </span>
        <div className="flex gap-1">
          {["Normal","Ringan","Sedang","Parah","Sangat Parah"].map((lvl) => (
            <div key={lvl} className="w-1.5 h-1.5 rounded-full"
              style={{ background: lvl === interpret.level ? s.text : "#e2e8f0" }} />
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
    <main className="min-h-screen flex items-center justify-center" style={{ background: "#f0f4f8" }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent" />
    </main>
  );

  const dResult = interpretDepresi(scores.depresi);
  const kResult = interpretKecemasan(scores.kecemasan);
  const sResult = interpretStress(scores.stress);
  const order = ["Normal","Ringan","Sedang","Parah","Sangat Parah"];
  const worst = [dResult.level, kResult.level, sResult.level].reduce((a, b) => order.indexOf(a) > order.indexOf(b) ? a : b);

  return (
    <main className="min-h-screen" style={{ background: "#f0f4f8" }}>
      {/* Hero — section biasa, header di dalamnya */}
      <div className="relative" style={{ background: "linear-gradient(135deg,#003087 0%,#1a4fa0 60%,#2563eb 100%)" }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.4) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute top-0 right-0 w-64 h-64 opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle,#FFD700 0%,transparent 70%)" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-24 pb-10 text-center">
          <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-white/20 border border-white/30">
            <CheckCircle className="w-7 h-7 text-white" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold text-white mb-1">Hasil Kuesioner DASS-42</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-blue-200 text-sm">{data.nama} · {data.prodi}</motion.p>
          {saved && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs bg-white/20 text-white border border-white/30">
              <div className="w-1.5 h-1.5 rounded-full bg-green-300" /> Data tersimpan
            </motion.div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Kiri: Score cards */}
          <div className="space-y-4">
            <ScoreCard label="Depresi"   Icon={Heart}    score={scores.depresi}   maxScore={42} interpret={dResult} delay={0.1} />
            <ScoreCard label="Kecemasan" Icon={Activity} score={scores.kecemasan} maxScore={42} interpret={kResult} delay={0.25} />
            <ScoreCard label="Stres"     Icon={Zap}      score={scores.stress}    maxScore={42} interpret={sResult} delay={0.4} />
          </div>

          {/* Kanan: Ringkasan + motivasi */}
          <div className="space-y-4">
            {/* Ringkasan */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6"
              style={{ boxShadow: "0 4px 20px rgba(0,48,135,0.08)", border: "1px solid rgba(0,48,135,0.08)" }}>
              <div className="h-1 w-10 rounded-full mb-4" style={{ background: "linear-gradient(90deg,#003087,#FFD700)" }} />
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Ringkasan Hasil</p>
              <div className="space-y-3">
                {[
                  { label: "Depresi", result: dResult, score: scores.depresi },
                  { label: "Kecemasan", result: kResult, score: scores.kecemasan },
                  { label: "Stres", result: sResult, score: scores.stress },
                ].map((item) => {
                  const s = LEVEL_STYLE[item.result.level];
                  return (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">{item.score}/42</span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
                          style={{ background: SCORE_GRADIENT[item.result.level] }}>
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
              className="bg-white rounded-2xl p-6"
              style={{ boxShadow: "0 4px 20px rgba(0,48,135,0.08)", border: "1px solid rgba(0,48,135,0.08)" }}>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Catatan untuk Kamu</p>
              <p className="text-sm leading-relaxed text-slate-600">{MOTIVASI[worst]}</p>
            </motion.div>

            {/* UAJY */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 }}
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: "rgba(0,48,135,0.05)", border: "1px solid rgba(0,48,135,0.1)" }}>
              <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: "linear-gradient(180deg,#003087,#FFD700)" }} />
              <div>
                <div className="text-xs font-semibold text-slate-600">Universitas Atma Jaya Yogyakarta</div>
                <div className="text-xs text-slate-400 italic">Program KKPKA 2024/2025</div>
              </div>
            </motion.div>

            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              onClick={() => { sessionStorage.clear(); router.push("/"); }}
              className="w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 bg-white transition-colors hover:bg-slate-50"
              style={{ border: "1.5px solid #e2e8f0", color: "#94a3b8" }}>
              <RotateCcw className="w-3.5 h-3.5" /> Isi Ulang Kuesioner
            </motion.button>
          </div>
        </div>
      </div>
    </main>
  );
}
