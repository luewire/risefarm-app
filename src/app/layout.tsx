import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RISEFARM - Pelopor Agritech Ubi Nusantara",
  description: "Pasokan Ubi yang Stabil, Terukur, dan Siap untuk Skala Bisnis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full scroll-smooth`}>
      <body className="font-sans text-[#4A3B32] bg-[#FDFBF7] selection:bg-orange-200 selection:text-orange-900 overflow-x-hidden min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
