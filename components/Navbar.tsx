"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{ background: "#003087", boxShadow: "0 2px 16px rgba(0,48,135,0.4)" }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Logo + nama universitas */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex-shrink-0">
            <Image src="/atmalogo.png" alt="Logo UAJY" width={40} height={40} priority />
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-tight">
              Universitas Atma Jaya Yogyakarta
            </div>
            <div className="text-xs leading-tight" style={{ color: "#FFD700" }}>
              Serviens in lumine veritatis
            </div>
          </div>
        </div>

        {/* Right: Program label */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block w-px h-6 bg-white/20" />
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-white/90">KKPKA</div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Kuesioner Kesehatan Mental</div>
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: "#FFD700", color: "#003087" }}>
            DASS-42
          </div>
        </div>
      </div>

      {/* Gold bottom line */}
      <div className="h-0.5 w-full" style={{ background: "#FFD700" }} />
    </motion.nav>
  );
}
