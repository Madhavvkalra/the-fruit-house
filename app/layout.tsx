import type { Metadata } from "next";
import Link from "next/link";
import { Home, Sparkles, Map, Info } from "lucide-react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Fruit House",
  description: "Premium Wholesale Fruit",
};

// 1. We build the Navbar right here
function Navbar() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm pointer-events-auto">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-4 flex justify-between items-center shadow-2xl">
        <Link href="/" className="flex flex-col items-center text-white/70 hover:text-white transition-colors">
          <Home size={24} />
          <span className="text-[10px] mt-1 font-bold tracking-widest">HOME</span>
        </Link>
        <Link href="/gpt" className="flex flex-col items-center text-green-400 hover:text-green-300 transition-colors drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">
          <Sparkles size={24} />
          <span className="text-[10px] mt-1 font-bold tracking-widest">GPT</span>
        </Link>
        <Link href="/tracker" className="flex flex-col items-center text-white/70 hover:text-white transition-colors">
          <Map size={24} />
          <span className="text-[10px] mt-1 font-bold tracking-widest">TRACK</span>
        </Link>
        <Link href="/about" className="flex flex-col items-center text-white/70 hover:text-white transition-colors">
          <Info size={24} />
          <span className="text-[10px] mt-1 font-bold tracking-widest">STORY</span>
        </Link>
      </div>
    </div>
  );
}

// 2. We inject it into the main layout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-black text-white antialiased`}>
        {children}
        <Navbar />
      </body>
    </html>
  );
}