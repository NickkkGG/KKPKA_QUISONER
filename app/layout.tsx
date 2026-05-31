import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "DASS-42 KKPKA — Universitas Atma Jaya Yogyakarta",
  description: "Kuesioner Depression Anxiety Stress Scales untuk Mahasiswa Baru UAJY",
  icons: { icon: "/atmalogo.png", apple: "/atmalogo.png" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={inter.variable}>
      <body style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        <Navbar />
        <div>{children}</div>
      </body>
    </html>
  );
}
