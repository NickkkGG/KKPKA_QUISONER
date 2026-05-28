import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "DASS-42 KKPKA — Universitas Atma Jaya Yogyakarta",
  description: "Kuesioner Depression Anxiety Stress Scales untuk Mahasiswa Baru UAJY",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={inter.variable}>
      <body style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        <Navbar />
        <div className="pt-16">{children}</div>
      </body>
    </html>
  );
}
