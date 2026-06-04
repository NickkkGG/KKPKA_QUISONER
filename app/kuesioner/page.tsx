"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { QUESTIONS, ANSWERS } from "@/lib/dass42";

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 50 : -50 }),
  center: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 350, damping: 30 } },
  exit:  (dir: number) => ({ opacity: 0, x: dir > 0 ? -50 : 50, transition: { duration: 0.2 } }),
};

// Tombol 3D ala Duolingo
function DuoButton({ onClick, children, style, className }: {
  onClick: () => void; children: React.ReactNode;
  style?: React.CSSProperties; className?: string;
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <div className={`relative ${className}`} style={{ userSelect: "none" }}>
      {/* Shadow layer */}
      <div className="absolute inset-0 rounded-2xl translate-y-1"
        style={{ background: style?.background ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.15)", filter: "blur(1px)" }} />
      <motion.button
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => { setPressed(false); onClick(); }}
        onPointerLeave={() => setPressed(false)}
        animate={{ y: pressed ? 3 : 0, scale: pressed ? 0.97 : 1 }}
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
        className="relative w-full rounded-2xl py-3.5 font-semibold text-sm flex items-center justify-center gap-2"
        style={style}>
        {children}
      </motion.button>
    </div>
  );
}

export default function KuesionerPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(42).fill(-1));
  const [selected, setSelected] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [maxReached, setMaxReached] = useState(0); // soal tertinggi yang pernah dibuka

  useEffect(() => { if (!sessionStorage.getItem("responden")) router.replace("/"); }, [router]);
  useEffect(() => {
    setSelected(answers[current] >= 0 ? answers[current] : null);
    if (current > maxReached) setMaxReached(current);
  }, [current, answers]);

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

  function goBack() {
    if (current > 0 && !isAnimating) { setDirection(-1); setCurrent(c => c - 1); }
  }

  function goNext() {
    if (current < maxReached && !isAnimating) { setDirection(1); setCurrent(c => c + 1); }
  }

  const showBack = current > 0;
  const showNext = current < maxReached;
  const progress = (current + 1) / QUESTIONS.length;
  const totalDots = Math.min(QUESTIONS.length, 7);
  const startDot = Math.max(0, Math.min(current - 3, QUESTIONS.length - totalDots));

  return (
    <main className="flex flex-col relative overflow-hidden"
      style={{ minHeight: "100dvh", background: "linear-gradient(160deg,#003087 0%,#1a4fa0 40%,#2563eb 100%)" }}>

      <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="relative z-10 flex-1 flex flex-col max-w-xl mx-auto w-full px-4 pt-24 pb-6">

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
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
            <span className="text-xs font-medium text-white/60 tabular-nums">
              {current + 1}<span className="text-white/30">/{QUESTIONS.length}</span>
            </span>
          </div>
          <div className="h-1 rounded-full overflow-hidden bg-white/15">
            <motion.div className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg,white,#FFD700)" }}
              animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.4, ease: "easeOut" }} />
          </div>
        </div>

        {/* Question card — centered, full height feel */}
        <div className="flex-1 flex flex-col justify-center mb-6">
          <div className="relative" style={{ minHeight: 140 }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={current} custom={direction}
                variants={slideVariants} initial="enter" animate="center" exit="exit"
                className="absolute inset-0 rounded-3xl flex items-center justify-center p-7 overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, #ffffff 0%, #f0f6ff 100%)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)"
                }}>
                {/* Subtle corner accent top-right */}
                <div className="absolute top-0 right-0 w-16 h-16 rounded-tr-3xl rounded-bl-full opacity-30 pointer-events-none"
                  style={{ background: "linear-gradient(135deg,#003087,transparent)" }} />
                {/* Gold accent bottom-left */}
                <div className="absolute bottom-0 left-0 w-16 h-16 rounded-bl-3xl rounded-tr-full opacity-30 pointer-events-none"
                  style={{ background: "linear-gradient(315deg,#FFD700,transparent)" }} />
                <p className="text-slate-800 text-base sm:text-lg font-semibold leading-relaxed text-center relative z-10">
                  {QUESTIONS[current].text}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Answer buttons */}
        <div className="space-y-2.5 mb-5">
          {ANSWERS.map((ans) => (
            <motion.button key={ans.value}
              whileTap={{ scale: 0.97, y: 2 }}
              onClick={() => handleAnswer(ans.value)}
              className="w-full rounded-2xl px-4 py-3.5 text-left flex items-center gap-3 transition-all"
              style={selected === ans.value ? {
                background: "white",
                border: "2px solid #FFD700",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                transform: "translateX(4px)"
              } : {
                background: "rgba(0,0,0,0.2)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}>
              <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={selected === ans.value
                  ? { background: "#003087", color: "white" }
                  : { background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }}>
                {ans.value}
              </span>
              <span className="text-sm font-medium"
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

        {/* Back / Next buttons */}
        <AnimatePresence>
          {(showBack || showNext) && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex gap-3">
              {showBack && (
                <DuoButton onClick={goBack} className="flex-1"
                  style={{ background: "white", color: "#003087", boxShadow: "0 4px 0 rgba(0,0,0,0.2)" }}>
                  {/* Curved back arrow */}
                  <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="#003087" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 10 C15 10 12 6 7 8 C4 9 3 11 3 11"/>
                    <path d="M3 11 L3 7 M3 11 L7 11"/>
                  </svg>
                  Kembali
                </DuoButton>
              )}
              {showNext && (
                <DuoButton onClick={goNext} className="flex-1"
                  style={{ background: "#FFD700", color: "#003087", boxShadow: "0 4px 0 rgba(0,0,0,0.2)" }}>
                  Lanjut
                  <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="#003087" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 10 C5 10 8 6 13 8 C16 9 17 11 17 11"/>
                    <path d="M17 11 L17 7 M17 11 L13 11"/>
                  </svg>
                </DuoButton>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
