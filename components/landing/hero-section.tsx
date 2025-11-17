"use client";
import Image from "next/image";
import { Spotlight } from "@/components/ui/spotlight";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-white pt-28 pb-16 overflow-hidden">
      {/* Spotlight background (amber-orangish) */}
      <Spotlight
        className="top-0 left-1/2 -translate-x-1/2 opacity-40"
        fill="#f59e0b"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 flex flex-col items-center text-center">
        {/* Title with subtle animation and gradient text */}
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
          Find compatible{" "}
          <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
            roommates
          </span>{" "}
          & rooms
        </h1>

        {/* Subtitle with slight delay animation */}
        <p className="mt-3 text-gray-600 text-base md:text-lg font-light animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          Share your room with the right people
        </p>

        {/* Illustration with shadow and animation */}
        <div className="mt-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
          <div className="relative group">
            {/* Subtle glow effect behind image */}
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-200/30 to-orange-200/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <Image
              src="/home.png"
              alt="Roommates illustration"
              width={520}
              height={360}
              className="w-full h-auto object-contain relative z-10 drop-shadow-xl transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Optional: Subtle decorative elements */}
        <div className="mt-12 flex items-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span>Verified profiles</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse delay-150" />
            <span>Safe & secure</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse delay-300" />
            <span>Easy matching</span>
          </div>
        </div>
      </div>
    </section>
  );
}