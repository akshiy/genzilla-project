import { Flame } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
              <Flame className="h-4 w-4 text-white" />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight">
              GEN<span className="text-gradient-fire">ZILLA</span>
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/50">
            <a href="#shop" className="transition-colors hover:text-white">Shop</a>
            <a href="#about" className="transition-colors hover:text-white">About</a>
            <a href="#lookbook" className="transition-colors hover:text-white">Lookbook</a>
            <a href="#contact" className="transition-colors hover:text-white">Contact</a>
          </div>

          <p className="text-xs text-white/35">© 2026 Genzilla Collective. Keep it lit.</p>
        </div>

        <p className="mt-8 text-center text-xs leading-relaxed text-white/30">
          Products are intended for adults 18+. Keep away from children. Use responsibly and in accordance with local regulations.
        </p>
      </div>
    </footer>
  );
}
