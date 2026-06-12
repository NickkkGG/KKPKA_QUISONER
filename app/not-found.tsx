"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

export default function NotFound() {
 return (
 <main className="flex min-h-dvh items-center justify-center px-4 py-10" style={{ background: "#f0f4f8" }}>
 <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white text-center" style={{ boxShadow: "0 8px 40px rgba(0,48,135,0.12)" }}>
 <div className="relative px-6 py-14" style={{ background: "linear-gradient(135deg,#003087 0%,#1a4fa0 60%,#2563eb 100%)" }}>
 <div className="absolute inset-0 opacity-10 pointer-events-none"
 style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.4) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
 <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="relative z-10">
 <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-3xl bg-white/20 border border-white/30">
 <Image src="/atmalogo.png" alt="UAJY" width={80} height={80} />
 </div>
 <h1 className="mt-3 text-xl font-bold text-white">Halaman Tidak Ditemukan</h1>
 <p className="mt-2 text-sm text-blue-200">Alamat yang Anda tuju tidak tersedia atau sudah dipindahkan.</p>
 </motion.div>
 </div>

 <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }} className="p-6">
 <p className="mb-5 text-sm leading-relaxed text-slate-500">
 Silakan kembali ke halaman awal untuk mengisi kuesioner DASS-42 KKPKA Universitas Atma Jaya Yogyakarta.
 </p>
 <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all"
 style={{ background: "linear-gradient(135deg,#003087,#1a4fa0)", boxShadow: "0 4px 20px rgba(0,48,135,0.3)" }}>
 <Home className="h-4 w-4" /> Kembali ke Beranda
 </Link>
 </motion.div>
 </div>
 </main>
 );
}
