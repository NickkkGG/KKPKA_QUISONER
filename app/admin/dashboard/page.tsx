"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Download, LogOut, Users, AlertTriangle, Activity } from "lucide-react";

type Responden = {
  id: string; nama: string; npm: string; email: string; usia: number; jenjang: string; prodi: string;
  skala_depresi: number; interpretasi_depresi: string;
  skala_kecemasan: number; interpretasi_kecemasan: string;
  skala_stress: number; interpretasi_stress: string;
  created_at: string;
};

const LEVEL_COLOR: Record<string, string> = {
  Normal: "text-green-700 bg-green-50 border-green-200",
  Ringan: "text-yellow-700 bg-yellow-50 border-yellow-200",
  Sedang: "text-orange-700 bg-orange-50 border-orange-200",
  Parah: "text-red-700 bg-red-50 border-red-200",
  "Sangat Parah": "text-red-800 bg-red-100 border-red-300",
};

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<Responden[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin-data")
      .then((r) => { if (r.status === 401) { router.replace("/admin"); return null; } return r.json(); })
      .then((d) => { if (d) { setData(Array.isArray(d) ? d : []); setLoading(false); } });
  }, [router]);

  async function handleExport() {
    const { utils, writeFile } = await import("xlsx");
    const rows = data.map((r) => ({
      Nama: r.nama, NPM: r.npm, Email: r.email, Usia: r.usia, Jenjang: r.jenjang, "Program Studi": r.prodi,
      "Skala Depresi": r.skala_depresi, "Interpretasi Depresi": r.interpretasi_depresi,
      "Skala Kecemasan": r.skala_kecemasan, "Interpretasi Kecemasan": r.interpretasi_kecemasan,
      "Skala Stress": r.skala_stress, "Interpretasi Stress": r.interpretasi_stress,
      "Tanggal Pengisian": new Date(r.created_at).toLocaleString("id-ID"),
    }));
    const ws = utils.json_to_sheet(rows);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data DASS-42");
    writeFile(wb, `Data_DASS42_KKPKA_${new Date().toISOString().slice(0,10)}.xlsx`);
  }

  async function handleLogout() {
    await fetch("/api/admin-logout", { method: "POST" });
    router.push("/admin");
  }

  const filtered = data.filter((r) =>
    r.nama?.toLowerCase().includes(search.toLowerCase()) ||
    r.prodi?.toLowerCase().includes(search.toLowerCase()) ||
    r.npm?.toLowerCase().includes(search.toLowerCase())
  );
  const atRisk = data.filter(r => ["Parah","Sangat Parah"].includes(r.interpretasi_depresi) ||
    ["Parah","Sangat Parah"].includes(r.interpretasi_kecemasan) || ["Parah","Sangat Parah"].includes(r.interpretasi_stress)).length;

  return (
    <main style={{ minHeight: "100dvh", background: "#f0f4f8" }}>
      {/* Header biru UAJY */}
      <div className="relative" style={{ background: "linear-gradient(135deg,#003087 0%,#1a4fa0 60%,#2563eb 100%)" }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.4) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Image src="/atmalogo.png" alt="UAJY" width={44} height={44} />
              <div>
                <h1 className="text-xl font-bold text-white">Dashboard Administrator</h1>
                <p className="text-blue-200 text-sm">DASS-42 KKPKA · Universitas Atma Jaya Yogyakarta</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "#FFD700", color: "#003087" }}>
                <Download className="w-4 h-4" /> Export Excel
              </button>
              <button onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white transition-all"
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <LogOut className="w-4 h-4" /> Keluar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content — stats cards overlap header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-12 relative z-10 pb-10">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Responden", value: data.length, icon: <Users className="w-5 h-5 text-white" />, grad: "linear-gradient(135deg,#003087,#2563eb)" },
            { label: "Perlu Perhatian", value: atRisk, icon: <AlertTriangle className="w-5 h-5 text-white" />, grad: "linear-gradient(135deg,#9a3412,#ea580c)" },
            { label: "Kondisi Normal", value: data.length - atRisk, icon: <Activity className="w-5 h-5 text-white" />, grad: "linear-gradient(135deg,#166534,#16a34a)" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-5 flex items-center gap-4"
              style={{ boxShadow: "0 4px 24px rgba(0,48,135,0.1)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.grad }}>
                {s.icon}
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800">{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama, NPM, atau prodi..."
          className="w-full sm:w-80 rounded-xl px-4 py-2.5 text-slate-700 placeholder-slate-300 focus:outline-none text-sm mb-4"
          style={{ background: "white", border: "1.5px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        />

        {/* Table */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 4px 24px rgba(0,48,135,0.08)" }}>
          {loading ? (
            <div className="p-12 text-center text-slate-400">Memuat data...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400">Belum ada data responden.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "#f8fafc" }} className="border-b border-slate-100">
                    {["Nama", "NPM", "Jenjang", "Prodi", "Usia", "Depresi", "Kecemasan", "Stress", "Tanggal"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.02, 0.5) }}
                      className="border-b border-slate-50 hover:bg-blue-50/40 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">{r.nama}</td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{r.npm}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-md text-xs font-medium" style={{ background: "rgba(0,48,135,0.08)", color: "#003087" }}>{r.jenjang}</span></td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{r.prodi}</td>
                      <td className="px-4 py-3 text-slate-500">{r.usia}</td>
                      {[
                        { level: r.interpretasi_depresi, score: r.skala_depresi },
                        { level: r.interpretasi_kecemasan, score: r.skala_kecemasan },
                        { level: r.interpretasi_stress, score: r.skala_stress },
                      ].map((item, j) => (
                        <td key={j} className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${LEVEL_COLOR[item.level]}`}>
                            {item.level}
                          </span>
                          <span className="text-slate-300 text-xs ml-1.5">({item.score})</span>
                        </td>
                      ))}
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap text-xs">
                        {new Date(r.created_at).toLocaleDateString("id-ID")}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
