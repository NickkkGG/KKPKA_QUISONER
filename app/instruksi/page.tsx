"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useReadCountdown } from "@/lib/useReadCountdown";
import StickyActionFooter from "@/components/StickyActionFooter";

const TIMER_SECONDS = 5;

const INSTRUCTIONS = [
  {
    title: "Jawablah dengan Jujur",
    desc: "Tidak ada jawaban benar atau salah. Pilih jawaban yang paling menggambarkan kondisi yang benar-benar Anda alami.",
  },
  {
    title: "Fokus pada Pengalaman 1 Minggu Terakhir",
    desc: "Jawablah berdasarkan pengalaman, perasaan, dan kondisi yang Anda rasakan selama satu minggu terakhir, bukan berdasarkan kondisi yang Anda harapkan atau inginkan.",
  },
  {
    title: "Pilih Jawaban yang Paling Sesuai",
    desc: "Setiap pernyataan memiliki empat pilihan jawaban. Pilih satu jawaban yang paling menggambarkan pengalaman Anda.",
  },
  {
    title: "Tidak Ada Penilaian Baik atau Buruk",
    desc: "Hasil kuesioner ini bukan untuk menilai kemampuan, kepribadian, maupun kinerja Anda. Jawaban yang jujur akan membantu memberikan gambaran yang lebih akurat mengenai kondisi diri.",
  },
  {
    title: "Kerahasiaan Data",
    desc: "Data dan jawaban yang terekam akan dijaga kerahasiaannya serta hanya digunakan untuk keperluan pengembangan layanan, edukasi, dan pemetaan kebutuhan kesehatan mental di lingkungan Universitas Atma Jaya Yogyakarta.",
  },
  {
    title: "Penting untuk Diketahui",
    desc: "DASS-42 merupakan alat skrining dan refleksi diri, bukan alat diagnosis klinis. Hasil yang diperoleh tidak dapat digunakan untuk menentukan diagnosis gangguan psikologis dan tidak menggantikan pemeriksaan oleh psikolog atau psikiater.",
  },
];

const SKALA_JAWABAN = [
  { val: "0", label: "Tidak Pernah" },
  { val: "1", label: "Kadang-kadang" },
  { val: "2", label: "Sering" },
  { val: "3", label: "Hampir Selalu" },
];

export default function InstruksiPage() {
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
        <div className="relative z-10 max-w-lg mx-auto px-4 pt-20 pb-6 text-center">
          <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center bg-white/20 border border-white/30">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white mb-1">Instruksi Pengisian</h1>
          <p className="text-blue-200 text-sm">Baca instruksi berikut dengan seksama</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-white rounded-2xl p-5 sm:p-6"
          style={{ boxShadow: "0 2px 12px rgba(0,48,135,0.08)", border: "1px solid rgba(0,48,135,0.06)" }}>
          <div className="h-1 w-8 rounded-full mb-4" style={{ background: "linear-gradient(90deg,#003087,#FFD700)" }} />
          <h2 className="text-sm font-bold text-slate-800 mb-3">Petunjuk Pengisian</h2>

          <ol className="space-y-3 mb-5">
            {INSTRUCTIONS.map((item, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{ background: "linear-gradient(135deg,#003087,#1a4fa0)", color: "white" }}>
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-800 leading-snug">{item.title}</div>
                  <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-2.5">Skala Jawaban</h3>
            <div className="grid grid-cols-2 gap-1.5">
              {SKALA_JAWABAN.map(s => (
                <div key={s.val} className="flex items-center gap-2 rounded-lg px-2.5 py-1.5"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#003087,#1a4fa0)", color: "white" }}>
                    {s.val}
                  </span>
                  <span className="text-[11px] sm:text-xs text-slate-600 font-medium leading-tight">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <StickyActionFooter
        ready={ready}
        timeLeft={timeLeft}
        progress={progress}
        timerHint="Harap baca instruksi..."
        onAction={() => router.push("/kuesioner")}>
        {ready ? (
          <><CheckCircle className="w-5 h-5" /> Saya Mengerti, Mulai Kuesioner</>
        ) : (
          <>Mohon baca instruksi ({timeLeft}s)</>
        )}
      </StickyActionFooter>
    </main>
  );
}