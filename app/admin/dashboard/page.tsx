"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Download, LogOut, Users, AlertTriangle, Activity, Filter, ArrowUpDown, Trash2, X } from "lucide-react";
import { ANSWERS, QUESTIONS } from "@/lib/dass42";

const ANSWER_LABEL: Record<number, string> = Object.fromEntries(ANSWERS.map(a => [a.value, a.label]));

type Responden = {
  id: string; nama: string; npm: string; email: string; usia: number; jenjang: string; prodi: string;
  answers: number[];
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
  const [riskFilter, setRiskFilter] = useState("all");
  const [sortBy, setSortBy] = useState("terbaru");
  const [errMsg, setErrMsg] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/admin-data")
      .then(async (r) => {
        if (r.status === 401) { router.replace("/admin"); return null; }
        const d = await r.json();
        if (!r.ok) { setErrMsg(d.error ?? "Gagal memuat data"); setLoading(false); return null; }
        return d;
      })
      .then((d) => { if (d) { setData(Array.isArray(d) ? d : []); setLoading(false); } })
      .catch(() => {
        setErrMsg("Tidak dapat terhubung ke server");
        setLoading(false);
      });
  }, [router]);

  async function handleExport() {
    const ExcelJS = (await import("exceljs")).default;
    const wb = new ExcelJS.Workbook();
    wb.creator = "KKPKA UAJY";

    const NAVY = "FF003087";
    const GOLD = "FFFFD700";
    const LEVEL_FILL: Record<string, string> = {
      Normal: "FFD1FAE5", Ringan: "FFFEF9C3", Sedang: "FFFFEDD5",
      Parah: "FFFEE2E2", "Sangat Parah": "FFFECACA",
    };
    const LEVEL_FONT: Record<string, string> = {
      Normal: "FF166534", Ringan: "FF854D0E", Sedang: "FF9A3412",
      Parah: "FFB91C1C", "Sangat Parah": "FF7F1D1D",
    };

    // ===== Sheet 1: Data Responden =====
    const ws = wb.addWorksheet("Data Responden", { views: [{ state: "frozen", ySplit: 1 }] });
    const cols = [
      { header: "No", key: "no", width: 5 },
      { header: "Nama", key: "nama", width: 24 },
      { header: "NPM", key: "npm", width: 14 },
      { header: "Email", key: "email", width: 26 },
      { header: "Usia", key: "usia", width: 6 },
      { header: "Jenjang", key: "jenjang", width: 9 },
      { header: "Program Studi", key: "prodi", width: 20 },
      ...Array.from({ length: 42 }, (_, i) => ({ header: `Q${i + 1}`, key: `q${i + 1}`, width: 16 })),
      { header: "Skor Depresi", key: "sd", width: 12 },
      { header: "Interpretasi Depresi", key: "id", width: 18 },
      { header: "Skor Kecemasan", key: "sk", width: 13 },
      { header: "Interpretasi Kecemasan", key: "ik", width: 20 },
      { header: "Skor Stres", key: "ss", width: 11 },
      { header: "Interpretasi Stres", key: "is", width: 18 },
      { header: "Tanggal Pengisian", key: "tgl", width: 20 },
    ];
    ws.columns = cols;

    // Header style
    ws.getRow(1).eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
      cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
      cell.border = { bottom: { style: "medium", color: { argb: GOLD } } };
    });
    ws.getRow(1).height = 28;

    // Data rows
    data.forEach((r, i) => {
      const qAnswers = Object.fromEntries(
        (r.answers ?? []).map((v, idx) => [`q${idx + 1}`, ANSWER_LABEL[v] ?? "-"])
      );
      const row = ws.addRow({
        no: i + 1, nama: r.nama, npm: r.npm, email: r.email, usia: r.usia,
        jenjang: r.jenjang, prodi: r.prodi,
        ...qAnswers,
        sd: r.skala_depresi, id: r.interpretasi_depresi,
        sk: r.skala_kecemasan, ik: r.interpretasi_kecemasan,
        ss: r.skala_stress, is: r.interpretasi_stress,
        tgl: new Date(r.created_at).toLocaleString("id-ID"),
      });
      // Warnai sel interpretasi
      [["id", r.interpretasi_depresi], ["ik", r.interpretasi_kecemasan], ["is", r.interpretasi_stress]].forEach(([key, lvl]) => {
        const cell = row.getCell(key as string);
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: LEVEL_FILL[lvl] ?? "FFFFFFFF" } };
        cell.font = { bold: true, color: { argb: LEVEL_FONT[lvl] ?? "FF000000" } };
        cell.alignment = { horizontal: "center" };
      });
      const qKeys = Array.from({ length: 42 }, (_, j) => `q${j + 1}`);
      ["no", "usia", "jenjang", "sd", "sk", "ss", ...qKeys].forEach(k => row.getCell(k).alignment = { horizontal: "center" });
      if (i % 2 === 1) {
        ["no","nama","npm","email","usia","jenjang","prodi","sd","sk","ss","tgl",...qKeys].forEach(k => {
          row.getCell(k).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF1F5F9" } };
        });
      }
    });

    // ===== Sheet 2: Pedoman Interpretasi =====
    const ws2 = wb.addWorksheet("Pedoman Interpretasi");
    ws2.columns = [{ width: 22 }, { width: 16 }, { width: 16 }, { width: 16 }];

    ws2.addRow(["PEDOMAN PENILAIAN DASS-42"]).font = { bold: true, size: 14, color: { argb: NAVY } };
    ws2.addRow([]);
    ws2.addRow(["Skala Jawaban"]).font = { bold: true, size: 12 };
    [["Tidak ada / tidak pernah", 0], ["Kadang-kadang", 1], ["Sering", 2], ["Sangat sesuai / hampir setiap saat", 3]]
      .forEach(r => ws2.addRow(r));
    ws2.addRow([]);

    const hdr = ws2.addRow(["Tingkat", "Depresi", "Kecemasan", "Stres"]);
    hdr.eachCell(c => {
      c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
      c.font = { bold: true, color: { argb: "FFFFFFFF" } };
      c.alignment = { horizontal: "center" };
    });
    const thresholds = [
      ["Normal", "0 – 9", "0 – 7", "0 – 14"],
      ["Ringan", "10 – 13", "8 – 9", "15 – 18"],
      ["Sedang", "14 – 20", "10 – 14", "19 – 25"],
      ["Parah", "21 – 27", "15 – 19", "26 – 33"],
      ["Sangat Parah", "28+", "20+", "34+"],
    ];
    thresholds.forEach(t => {
      const row = ws2.addRow(t);
      row.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: LEVEL_FILL[t[0]] } };
      row.getCell(1).font = { bold: true, color: { argb: LEVEL_FONT[t[0]] } };
      [2,3,4].forEach(i => row.getCell(i).alignment = { horizontal: "center" });
    });

    // Referensi pertanyaan Q1-Q42
    ws2.addRow([]);
    ws2.addRow(["Daftar Pertanyaan"]).font = { bold: true, size: 12 };
    const qh = ws2.addRow(["Kode", "Pertanyaan"]);
    qh.eachCell(c => {
      c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
      c.font = { bold: true, color: { argb: "FFFFFFFF" } };
    });
    ws2.getColumn(2).width = 70;
    QUESTIONS.forEach((q, i) => {
      const row = ws2.addRow([`Q${i + 1}`, q.text]);
      row.getCell(1).font = { bold: true };
      row.getCell(2).alignment = { wrapText: true };
    });

    // Download
    const buf = await wb.xlsx.writeBuffer();
    const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Data_DASS42_KKPKA_${new Date().toISOString().slice(0,10)}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleLogout() {
    await fetch("/api/admin-logout", { method: "POST" });
    router.push("/admin");
  }

  async function handleDeleteAll() {
    setDeleting(true);
    setErrMsg("");
    try {
      const r = await fetch("/api/admin-delete-all", { method: "POST" });
      if (r.status === 401) { router.replace("/admin"); return; }
      const d = await r.json();
      if (!r.ok) { setErrMsg(d.error ?? "Gagal menghapus data"); return; }
      setData([]);
      setShowDelete(false);
      setConfirmText("");
    } catch {
      setErrMsg("Terjadi kesalahan saat menghapus data");
    } finally {
      setDeleting(false);
    }
  }

  const isAtRisk = (r: Responden) => ["Parah","Sangat Parah"].includes(r.interpretasi_depresi) ||
    ["Parah","Sangat Parah"].includes(r.interpretasi_kecemasan) || ["Parah","Sangat Parah"].includes(r.interpretasi_stress);
  const totalScore = (r: Responden) => r.skala_depresi + r.skala_kecemasan + r.skala_stress;

  const filtered = data
    .filter((r) =>
      r.nama?.toLowerCase().includes(search.toLowerCase()) ||
      r.prodi?.toLowerCase().includes(search.toLowerCase()) ||
      r.npm?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((r) => riskFilter === "all" || (riskFilter === "risk" ? isAtRisk(r) : !isAtRisk(r)))
    .sort((a, b) => {
      if (sortBy === "nama") return (a.nama ?? "").localeCompare(b.nama ?? "");
      if (sortBy === "risiko") return totalScore(b) - totalScore(a);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  const atRisk = data.filter(isAtRisk).length;

  return (
    <main style={{ minHeight: "100dvh", background: "#eef2f7" }}>
      {/* Header biru UAJY — berisi header + stats */}
      <div className="relative" style={{ background: "linear-gradient(135deg,#003087 0%,#1a4fa0 60%,#2563eb 100%)" }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.4) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-8">
          {/* Top row */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
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
              <button onClick={() => { setConfirmText(""); setShowDelete(true); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ background: "rgba(220,38,38,0.9)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <Trash2 className="w-4 h-4" /> Hapus Semua
              </button>
            </div>
          </div>

          {/* Stats — di dalam hero biru */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Responden", value: data.length, icon: <Users className="w-5 h-5 text-white" />, grad: "linear-gradient(135deg,#1e40af,#3b82f6)" },
              { label: "Perlu Perhatian", value: atRisk, icon: <AlertTriangle className="w-5 h-5 text-white" />, grad: "linear-gradient(135deg,#9a3412,#ea580c)" },
              { label: "Bukan Prioritas Tinggi", value: data.length - atRisk, icon: <Activity className="w-5 h-5 text-white" />, grad: "linear-gradient(135deg,#166534,#16a34a)" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-5 flex items-center gap-4"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.grad }}>
                  {s.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-blue-100">{s.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-10">
        {/* Toolbar: search + filter + sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:items-center sm:justify-between">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, NPM, atau prodi..."
            className="w-full sm:w-80 rounded-xl px-4 py-2.5 text-slate-700 placeholder-slate-400 focus:outline-none text-sm"
            style={{ background: "white", border: "1.5px solid #cbd5e1", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
          />
          <div className="flex gap-2">
            {/* Filter risiko */}
            <div className="flex items-center gap-1.5 rounded-xl px-3 py-2.5" style={{ background: "white", border: "1.5px solid #cbd5e1" }}>
              <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}
                className="text-sm text-slate-600 focus:outline-none bg-transparent cursor-pointer">
                <option value="all">Semua</option>
                <option value="risk">Perlu Perhatian (Parah/Sangat Parah)</option>
                <option value="normal">Bukan Prioritas Tinggi</option>
              </select>
            </div>
            {/* Sort */}
            <div className="flex items-center gap-1.5 rounded-xl px-3 py-2.5" style={{ background: "white", border: "1.5px solid #cbd5e1" }}>
              <ArrowUpDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="text-sm text-slate-600 focus:outline-none bg-transparent cursor-pointer">
                <option value="terbaru">Terbaru</option>
                <option value="nama">Nama A-Z</option>
                <option value="risiko">Total Skor Mentah Tertinggi</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-4 rounded-xl px-4 py-3 text-xs leading-relaxed text-slate-500"
          style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <strong className="text-slate-700">Kriteria dashboard:</strong>{" "}
          Setiap jawaban diberi nilai 0-3; masing-masing subskala menjumlahkan 14 item sehingga skornya 0-42.
          <b>Perlu Perhatian</b> berarti minimal satu skala berada pada level <b>Parah</b> atau <b>Sangat Parah</b>.
          <b> Bukan Prioritas Tinggi</b> berarti tidak ada skala pada dua level tersebut, sehingga masih dapat mencakup Normal, Ringan, atau Sedang.
          <span className="block mt-1"><b>Total skor mentah</b> adalah penjumlahan Depresi + Kecemasan + Stres (0-126) untuk pengurutan saja, bukan diagnosis klinis.</span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #e2e8f0", boxShadow: "0 4px 24px rgba(0,48,135,0.08)" }}>
          {loading ? (
            <div className="p-12 text-center text-slate-400">Memuat data...</div>
          ) : errMsg ? (
            <div className="p-12 text-center text-red-500 text-sm">Error: {errMsg}</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400">Belum ada data responden.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "#f8fafc" }} className="border-b border-slate-100">
                    {["Nama", "NPM", "Jenjang", "Prodi", "Usia", "Depresi (level/skor)", "Kecemasan (level/skor)", "Stres (level/skor)", "Total mentah", "Tanggal"].map((h) => (
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
                      <td className="px-4 py-3 text-slate-600 font-semibold whitespace-nowrap">
                        {totalScore(r)}
                      </td>
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

      {/* Modal konfirmasi hapus semua data */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => !deleting && setShowDelete(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden"
            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
            onClick={(e) => e.stopPropagation()}>
            <div className="p-5 flex items-start gap-3" style={{ background: "#fef2f2", borderBottom: "1px solid #fecaca" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(220,38,38,0.12)" }}>
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-800">Hapus Semua Data?</h3>
                <p className="text-xs text-slate-500 mt-0.5">Tindakan ini permanen dan tidak dapat dibatalkan.</p>
              </div>
              <button onClick={() => !deleting && setShowDelete(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                Seluruh <span className="font-bold text-slate-800">{data.length} data responden</span> akan dihapus
                secara permanen dari database. Pastikan Anda sudah mengekspor data ke Excel terlebih dahulu jika diperlukan.
              </p>
              <div>
                <label className="text-xs font-medium text-slate-500">Ketik <span className="font-bold text-red-600">HAPUS</span> untuk mengonfirmasi</label>
                <input type="text" value={confirmText} onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="HAPUS" autoFocus
                  className="w-full mt-1.5 rounded-xl px-4 py-2.5 text-slate-700 focus:outline-none text-sm"
                  style={{ background: "white", border: "1.5px solid #cbd5e1" }} />
              </div>
              {errMsg && <p className="text-xs text-red-500">{errMsg}</p>}
              <div className="flex gap-2 pt-1">
                <button onClick={() => !deleting && setShowDelete(false)} disabled={deleting}
                  className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-slate-600 transition-all"
                  style={{ background: "#f1f5f9", border: "1px solid #e2e8f0" }}>
                  Batal
                </button>
                <button onClick={handleDeleteAll} disabled={confirmText !== "HAPUS" || deleting}
                  className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-all flex items-center justify-center gap-2"
                  style={confirmText !== "HAPUS" || deleting
                    ? { background: "#fca5a5", cursor: "not-allowed" }
                    : { background: "#dc2626" }}>
                  {deleting ? "Menghapus..." : <><Trash2 className="w-4 h-4" /> Hapus Permanen</>}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
