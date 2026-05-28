"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Download, LogOut, Users, AlertTriangle } from "lucide-react";

type Responden = {
  id: string; nama: string; prodi: string;
  skala_depresi: number; interpretasi_depresi: string;
  skala_kecemasan: number; interpretasi_kecemasan: string;
  skala_stress: number; interpretasi_stress: string;
  created_at: string;
};

const LEVEL_COLOR: Record<string, string> = {
  Normal: "text-green-600", Ringan: "text-yellow-600",
  Sedang: "text-orange-600", Parah: "text-red-600", "Sangat Parah": "text-red-700",
};
const LEVEL_BG: Record<string, string> = {
  Normal: "bg-green-50 border-green-200", Ringan: "bg-yellow-50 border-yellow-200",
  Sedang: "bg-orange-50 border-orange-200", Parah: "bg-red-50 border-red-200", "Sangat Parah": "bg-red-50 border-red-300",
};

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<Responden[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin-data")
      .then((r) => { if (r.status === 401) { router.replace("/admin"); return null; } return r.json(); })
      .then((d) => { if (d) { setData(d); setLoading(false); } });
  }, [router]);

  async function handleExport() {
    const { utils, writeFile } = await import("xlsx");
    const rows = data.map((r) => ({
      Nama: r.nama, "Program Studi": r.prodi,
      "Skala Depresi": r.skala_depresi, "Interpretasi Depresi": r.interpretasi_depresi,
      "Skala Kecemasan": r.skala_kecemasan, "Interpretasi Kecemasan": r.interpretasi_kecemasan,
      "Skala Stress": r.skala_stress, "Interpretasi Stress": r.interpretasi_stress,
      "Tanggal": new Date(r.created_at).toLocaleString("id-ID"),
    }));
    const ws = utils.json_to_sheet(rows);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data DASS-42");
    writeFile(wb, "Data_DASS42_KKPKA.xlsx");
  }

  const filtered = data.filter(
    (r) => r.nama.toLowerCase().includes(search.toLowerCase()) || r.prodi.toLowerCase().includes(search.toLowerCase())
  );
  const atRisk = data.filter(r => ["Parah","Sangat Parah"].includes(r.interpretasi_depresi) ||
    ["Parah","Sangat Parah"].includes(r.interpretasi_kecemasan) || ["Parah","Sangat Parah"].includes(r.interpretasi_stress)).length;

  return (
    <main className="min-h-screen px-4 py-8" style={{ background: "#f8f9fc" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold gradient-text">Dashboard Admin</h1>
            <p className="text-slate-400 text-sm">DASS-42 KKPKA · {data.length} responden</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors">
              <Download className="w-4 h-4" /> Export Excel
            </button>
            <button onClick={() => { document.cookie = "admin_auth=; max-age=0; path=/"; router.push("/admin"); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
              <LogOut className="w-4 h-4" /> Keluar
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {[
            { label: "Total Responden", value: data.length, icon: <Users className="w-5 h-5 text-blue-500" />, bg: "bg-blue-50 border-blue-200" },
            { label: "Perlu Perhatian", value: atRisk, icon: <AlertTriangle className="w-5 h-5 text-orange-500" />, bg: "bg-orange-50 border-orange-200" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`rounded-2xl p-4 border ${s.bg} flex items-center gap-3`}>
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">{s.icon}</div>
              <div>
                <div className="text-2xl font-bold text-slate-800">{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama atau prodi..."
          className="w-full sm:w-72 rounded-xl px-4 py-2.5 text-slate-700 placeholder-slate-300 focus:outline-none text-sm mb-4 transition-all"
          style={{ background: "white", border: "1.5px solid #e2e8f0" }}
        />

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-slate-400">Memuat data...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400">Belum ada data responden.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {["Nama", "Prodi", "Depresi", "Kecemasan", "Stress", "Tanggal"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-800">{r.nama}</td>
                      <td className="px-4 py-3 text-slate-500">{r.prodi}</td>
                      {[
                        { level: r.interpretasi_depresi, score: r.skala_depresi },
                        { level: r.interpretasi_kecemasan, score: r.skala_kecemasan },
                        { level: r.interpretasi_stress, score: r.skala_stress },
                      ].map((item, j) => (
                        <td key={j} className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${LEVEL_BG[item.level]} ${LEVEL_COLOR[item.level]}`}>
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
