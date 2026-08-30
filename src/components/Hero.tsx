import { useEffect, useState } from 'react';
import { Flame, ArrowDown, Sparkles } from 'lucide-react';

export function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section id="top" className="relative min-h-screen overflow-hidden">
      {/* Background gradient + grain */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,90,0,0.18),transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(255,0,80,0.12),transparent_50%)]" />
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E\")",
        }}
      />

      {/* Floating flame orbs */}
      <div className="pointer-events-none absolute left-[8%] top-[22%] h-72 w-72 rounded-full bg-orange-500/20 blur-[100px] animate-float-slow" />
      <div className="pointer-events-none absolute right-[10%] top-[40%] h-96 w-96 rounded-full bg-red-600/15 blur-[120px] animate-float-slow" style={{ animationDelay: '2s' }} />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-5 pt-36 pb-20 text-center md:pt-44">
        <div
          className={`mb-7 flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-white/80 transition-all duration-700 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-orange-400" />
          The Gen Z lighter collective
        </div>

        <h1
          className={`font-display text-6xl font-extrabold leading-[0.95] tracking-tight transition-all duration-700 sm:text-7xl md:text-8xl lg:text-9xl ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <span className="block">LIGHT</span>
          <span className="block text-gradient-fire">YOUR ERA</span>
        </h1>

        <p
          className={`mt-7 max-w-xl text-base leading-relaxed text-white/65 md:text-lg transition-all delay-150 duration-700 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          Refillable lighters, torch flames, and collectible matchbooks built for the
          feed-first generation. Windproof. Reusable. Unapologetically loud.
        </p>

        <div
          className={`mt-10 flex flex-col items-center gap-4 sm:flex-row transition-all delay-300 duration-700 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <a
            href="#shop"
            className="group relative flex items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-8 py-4 text-base font-bold text-white glow-fire transition-transform hover:scale-105"
          >
            <Flame className="h-5 w-5 animate-flicker" />
            Shop the drop
          </a>
          <a
            href="#about"
            className="flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/5"
          >
            Our story
          </a>
        </div>

        {/* Stat strip */}
        <div
          className={`mt-20 grid w-full max-w-2xl grid-cols-3 gap-4 transition-all delay-500 duration-700 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          {[
            ['50K+', 'Lighters lit'],
            ['4.9', 'Avg rating'],
            ['24H', 'Dispatch'],
          ].map(([n, l]) => (
            <div key={l} className="glass rounded-2xl px-4 py-5">
              <div className="font-display text-2xl font-extrabold text-gradient-fire md:text-3xl">{n}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-white/50">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <a
        href="#shop"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 transition-colors hover:text-white"
        aria-label="Scroll to shop"
      >
        <ArrowDown className="h-6 w-6 animate-bounce" />
      </a>
    </section>
  );
}
