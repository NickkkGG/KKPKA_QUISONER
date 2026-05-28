"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Activity, Heart, Zap } from "lucide-react";
import { QUESTIONS, ANSWERS } from "@/lib/dass42";

const SCALE_CONFIG = {
  depression: { label: "Depresi",   Icon: Heart,    gradient: "linear-gradient(135deg,#1e3a8a,#2563eb)", pill: "#3b82f6" },
  anxiety:    { label: "Kecemasan", Icon: Activity, gradient: "linear-gradient(135deg,#4c1d95,#7c3aed)", pill: "#8b5cf6" },
  stress:     { label: "Stres",     Icon: Zap,      gradient: "linear-gradient(135deg,#0c4a6e,#0284c7)", pill: "#0ea5e9" },
};

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 350, damping: 30 } },
  exit:  (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60, transition: { duration: 0.2 } }),
};

export default function KuesionerPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(42).fill(-1));
  const [selected, setSelected] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => { if (!sessionStorage.getItem("responden")) router.replace("/"); }, [router]);
  useEffect(() => { setSelected(answers[current] >= 0 ? answers[current] : null); }, [current, answers]);

  function handleAnswer(val: number) {
    if (isAnimating) return;
    setSelected(val);
    const newAnswers = [...answers];
    newAnswers[current] = val;
    setAnswers(newAnswers);
    setIsAnimating(true);
    setTimeout(() => {
      if (current < QUESTIONS.length - 1) { setDirection(1); setCurrent(c => c + 1); }
      else { sessionStorage.setItem("answers", JSON.stringify(newAnswers)); router.push("/hasil"); }
      setIsAnimating(false);
    }, 380);
  }

  const progress = (current + 1) / QUESTIONS.length;
  const q = QUESTIONS[current];
  const sc = SCALE_CONFIG[q.scale as keyof typeof SCALE_CONFIG];
  const { Icon } = sc;
  const totalDots = Math.min(QUESTIONS.length, 7);
  const startDot = Math.max(0, Math.min(current - 3, QUESTIONS.length - totalDots));

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg,#0a0f1e 0%,#0d1b3e 50%,#0a0f1e 100%)" }}>

      {/* Subtle bg glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(37,99,235,0.12) 0%, transparent 60%)" }} />

      <div className="w-full max-w-lg z-10">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-5">
          <motion.button whileTap={{ scale: 0.9 }}
            onClick={() => { if (current > 0 && !isAnimating) { setDirection(-1); setCurrent(c => c - 1); } }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${current > 0 ? "border border-white/15 hover:bg-white/10" : "opacity-0 pointer-events-none"}`}>
            <ArrowLeft className="w-4 h-4 text-white/60" />
          </motion.button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalDots }, (_, i) => {
              const idx = startDot + i;
              const isActive = idx === current;
              const isDone = idx < current;
              return (
                <motion.div key={idx}
                  animate={{ width: isActive ? 24 : 6, opacity: isActive ? 1 : isDone ? 0.5 : 0.2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="h-1.5 rounded-full"
                  style={{ background: isActive ? "#FFD700" : isDone ? "#60a5fa" : "rgba(255,255,255,0.3)" }} />
              );
            })}
          </div>

          <span className="text-xs tabular-nums text-white/40">{current + 1}<span className="text-white/20">/{QUESTIONS.length}</span></span>
        </div>

        {/* Progress bar */}
        <div className="h-1 rounded-full mb-6 overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
          <motion.div className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg,#003087,#FFD700)" }}
            animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
        </div>

        {/* Scale badge */}
        <motion.div key={q.scale} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
          style={{ background: sc.gradient, color: "white", boxShadow: `0 4px 16px rgba(0,0,0,0.4)` }}>
          <Icon className="w-3.5 h-3.5" /> {sc.label}
        </motion.div>

        {/* Question card — putih terang, kontras dengan bg gelap */}
        <div className="relative mb-5" style={{ minHeight: 130 }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={current} custom={direction}
              variants={slideVariants} initial="enter" animate="center" exit="exit"
              className="absolute inset-0 rounded-3xl p-6"
              style={{ background: "white", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
              <p className="text-slate-800 text-base sm:text-lg font-semibold leading-relaxed">{q.text}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Answer buttons — putih semi-transparan dengan border jelas */}
        <div className="space-y-2.5">
          {ANSWERS.map((ans, i) => (
            <motion.button key={ans.value}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 400, damping: 30 }}
              whileTap={{ scale: 0.98 }} onClick={() => handleAnswer(ans.value)}
              className="w-full rounded-2xl px-4 py-3.5 text-left flex items-center gap-3.5 transition-all"
              style={selected === ans.value ? {
                background: "white",
                border: "2px solid #FFD700",
                boxShadow: "0 4px 24px rgba(255,215,0,0.25)",
                transform: "translateX(6px)"
              } : {
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}>
              <motion.span animate={selected === ans.value ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={selected === ans.value
                  ? { background: "#FFD700", color: "#003087" }
                  : { background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)" }}>
                {ans.value}
              </motion.span>
              <span className="text-sm font-medium"
                style={{ color: selected === ans.value ? "#1e293b" : "rgba(255,255,255,0.8)" }}>
                {ans.label}
              </span>
              {selected === ans.value && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                  className="ml-auto w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: "#FFD700" }}>
                  <svg viewBox="0 0 10 10" className="w-3 h-3" fill="none" stroke="#003087" strokeWidth="2.5">
                    <path d="M2 5l2.5 2.5L8 3"/>
                  </svg>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </main>
  );
}
