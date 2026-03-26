"use client";

import Link from "next/link";
import { Home, Sparkles, Map, Info } from "lucide-react";

export default function Navbar() {
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
