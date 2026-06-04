"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, ChevronRight } from "lucide-react";
import { useReadCountdown } from "@/lib/useReadCountdown";
import StickyActionFooter from "@/components/StickyActionFooter";

const TIMER_SECONDS = 5;

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

export default function DisclaimerPage() {
  const router = useRouter();
  const { timeLeft, progress, ready } = useReadCountdown(TIMER_SECONDS);

  useEffect(() => {
    if (!sessionStorage.getItem("responden")) { router.replace("/"); return; }
  }, [router]);

  return (
    <main className="min-h-dvh bg-[#f0f4f8] pb-40">
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

      <div className="max-w-lg mx-auto px-4 py-6">
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
      </div>

      <StickyActionFooter
        ready={ready}
        timeLeft={timeLeft}
        progress={progress}
        timerHint="Harap baca disclaimer..."
        onAction={() => router.push("/instruksi")}>
        {ready ? (
          <><ChevronRight className="w-5 h-5" /> Saya Mengerti, Lanjutkan</>
        ) : (
          <>Mohon baca disclaimer ({timeLeft}s)</>
        )}
      </StickyActionFooter>
    </main>
  );
}