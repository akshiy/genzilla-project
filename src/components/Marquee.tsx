import { Flame } from 'lucide-react';

export function Marquee() {
  const items = [
    'FREE SHIPPING OVER $75',
    'NEW DROP — NEON GHOST',
    'REFILLABLE. REUSABLE. ICONIC.',
    'GEN Z APPROVED',
    'WINDPROOF TORCH FLAME',
    'SHIPS IN 24H',
  ];
  const loop = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-amber-500/10 py-2.5">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {loop.map((t, i) => (
          <span key={i} className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            <Flame className="h-3.5 w-3.5 text-orange-400" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
