"use client";
import { useEffect, useState } from "react";

/** Countdown detik + progress bar 0→100% selaras (isi kiri ke kanan). */
export function useReadCountdown(seconds: number) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const startedAt = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = (now - startedAt) / 1000;
      const pct = Math.min(100, (elapsed / seconds) * 100);
      setProgress(pct);

      if (elapsed >= seconds) {
        setProgress(100);
        setTimeLeft(0);
        setReady(true);
        return;
      }

      setTimeLeft(Math.ceil(seconds - elapsed));
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seconds]);

  return { timeLeft, progress, ready };
}
