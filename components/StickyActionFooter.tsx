"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FOOTER_MOTION = { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const };

function DuoButton({ onClick, disabled, children }: {
  onClick: () => void; disabled: boolean; children: React.ReactNode;
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <div className="relative z-0 w-full isolate" style={{ userSelect: "none" }}>
      <div className="absolute inset-0 rounded-2xl translate-y-1 -z-10"
        style={{ background: disabled ? "rgba(0,0,0,0.1)" : "rgba(0,48,135,0.4)" }} />
      <motion.button
        type="button"
        onPointerDown={() => !disabled && setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        onClick={() => !disabled && onClick()}
        animate={{ y: pressed ? 3 : 0, scale: pressed ? 0.98 : 1 }}
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
        disabled={disabled}
        className="relative z-0 w-full rounded-2xl py-4 font-bold text-base flex items-center justify-center gap-2 transition-colors"
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

type StickyActionFooterProps = {
  ready: boolean;
  timeLeft: number;
  progress: number;
  timerHint: string;
  onAction: () => void;
  children: React.ReactNode;
};

export default function StickyActionFooter({
  ready, timeLeft, progress, timerHint, onAction, children,
}: StickyActionFooterProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white"
      style={{
        boxShadow: "0 -4px 24px rgba(0,48,135,0.1)",
        paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
      }}>
      <div className="max-w-lg mx-auto px-4 pt-3">
        <AnimatePresence initial={false}>
          {!ready && (
            <motion.div
              key="countdown"
              initial={{ opacity: 1, height: "auto", marginBottom: 12 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 12 }}
              exit={{
                opacity: 0,
                height: 0,
                marginBottom: 0,
                transition: {
                  height: FOOTER_MOTION,
                  marginBottom: FOOTER_MOTION,
                  opacity: { duration: 0.28, ease: FOOTER_MOTION.ease },
                },
              }}
              className="relative z-20 overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500">{timerHint}</span>
                <span className="text-xs font-bold tabular-nums" style={{ color: "#003087" }}>
                  {timeLeft}s
                </span>
              </div>
              <div
                className="relative h-3 w-full rounded-full overflow-hidden"
                style={{ background: "#e2e8f0", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.06)" }}>
                <motion.div
                  className="absolute left-0 top-0 bottom-0 rounded-full"
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.08, ease: "linear" }}
                  style={{
                    background: "linear-gradient(90deg,#003087 0%,#1a4fa0 55%,#FFD700 100%)",
                    boxShadow: "0 0 0 1px rgba(0,48,135,0.15)",
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <DuoButton onClick={onAction} disabled={!ready}>
          {children}
        </DuoButton>
      </div>
    </div>
  );
}
