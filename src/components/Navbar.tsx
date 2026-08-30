import { useEffect, useState } from 'react';
import { ShoppingBag, Flame } from 'lucide-react';
import { useCart } from '@/lib/store';

interface Props {
  onOpenCart: () => void;
}

export function Navbar({ onOpenCart }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass py-3' : 'py-5 bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 glow-fire">
            <Flame className="h-5 w-5 text-white" />
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight">
            GEN<span className="text-gradient-fire">ZILLA</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {[
            ['Shop', '#shop'],
            ['Drops', '#drops'],
            ['About', '#about'],
            ['Lookbook', '#lookbook'],
            ['Contact', '#contact'],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              {label}
            </a>
          ))}
        </div>

        <button
          onClick={onOpenCart}
          className="group relative flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold transition-all hover:border-orange-400/50 hover:bg-orange-500/10"
        >
          <ShoppingBag className="h-4 w-4" />
          <span className="hidden sm:inline">Cart</span>
          {count > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 px-1 text-[11px] font-bold text-white animate-scale-in">
              {count}
            </span>
          )}
        </button>
      </nav>
    </header>
  );
}
