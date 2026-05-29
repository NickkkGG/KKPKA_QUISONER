"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { QUESTIONS, ANSWERS } from "@/lib/dass42";

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 50 : -50 }),
  center: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 350, damping: 30 } },
  exit:  (dir: number) => ({ opacity: 0, x: dir > 0 ? -50 : 50, transition: { duration: 0.2 } }),
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
  const totalDots = Math.min(QUESTIONS.length, 7);
  const startDot = Math.max(0, Math.min(current - 3, QUESTIONS.length - totalDots));

  return (
    <main className="flex flex-col relative overflow-hidden"
      style={{ minHeight: "100dvh", background: "linear-gradient(160deg,#003087 0%,#1a4fa0 40%,#2563eb 100%)" }}>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="absolute top-0 right-0 w-96 h-96 opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle,#FFD700 0%,transparent 70%)" }} />

      <div className="relative z-10 flex-1 flex flex-col max-w-xl mx-auto w-full px-4 pt-24 pb-10">

        {/* Progress + nav */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <motion.button whileTap={{ scale: 0.9 }}
              onClick={() => { if (current > 0 && !isAnimating) { setDirection(-1); setCurrent(c => c - 1); } }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${current > 0 ? "shadow-md hover:shadow-lg" : "opacity-0 pointer-events-none"}`}
              style={{ background: "white" }}>
              <ArrowLeft className="w-4 h-4" style={{ color: "#003087" }} />
            </motion.button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalDots }, (_, i) => {
                const idx = startDot + i;
                const isActive = idx === current;
                const isDone = idx < current;
                return (
                  <motion.div key={idx}
                    animate={{ width: isActive ? 20 : 6, opacity: isActive ? 1 : isDone ? 0.5 : 0.25 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="h-1.5 rounded-full"
                    style={{ background: isActive ? "#FFD700" : "white" }} />
                );
              })}
            </div>

            <span className="text-xs font-medium text-white/60 tabular-nums w-8 text-right">
              {current + 1}/{QUESTIONS.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1 rounded-full overflow-hidden bg-white/15">
            <motion.div className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg,white,#FFD700)" }}
              animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.4, ease: "easeOut" }} />
          </div>
        </div>

        {/* Question card */}
        <div className="relative mb-6" style={{ minHeight: 120 }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={current} custom={direction}
              variants={slideVariants} initial="enter" animate="center" exit="exit"
              className="absolute inset-0 bg-white rounded-2xl p-6"
              style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.25)" }}>
              <p className="text-slate-800 text-base sm:text-lg font-semibold leading-relaxed">{q.text}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Answer buttons — biru gelap semi-transparan, kontras dengan hero */}
        <div className="space-y-2.5">
          {ANSWERS.map((ans, i) => (
            <motion.button key={ans.value}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 400, damping: 30 }}
              whileTap={{ scale: 0.98 }} onClick={() => handleAnswer(ans.value)}
              className="w-full rounded-xl px-4 py-3.5 text-left flex items-center gap-3 transition-all"
              style={selected === ans.value ? {
                background: "white",
                border: "2px solid #FFD700",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                transform: "translateX(4px)"
              } : {
                background: "rgba(0,0,0,0.2)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}>
              <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all"
                style={selected === ans.value
                  ? { background: "#003087", color: "white" }
                  : { background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }}>
                {ans.value}
              </span>
              <span className="text-sm font-medium transition-colors"
                style={{ color: selected === ans.value ? "#003087" : "rgba(255,255,255,0.9)" }}>
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
