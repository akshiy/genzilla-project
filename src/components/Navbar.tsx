import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Flame } from 'lucide-react';
import { useCart } from '@/lib/store';
import { supabase } from '@/lib/supabase';

interface Props { onOpenCart: () => void }

export function Navbar({ onOpenCart }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<any>({ store_name: 'GENZILLA', logo_url: '' });
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    supabase.from('store_settings').select('store_name,logo_url').limit(1).maybeSingle().then(({ data }) => { if (data) setSettings(data); });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      animate={{ paddingTop: scrolled ? 12 : 20, paddingBottom: scrolled ? 12 : 20 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${scrolled ? 'glass' : 'bg-transparent'}`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5">
        <a href="#top" className="flex items-center gap-2.5">
          {settings.logo_url ? (
            <img src={settings.logo_url} alt={settings.store_name} className="h-9 w-9 rounded-xl object-cover" />
          ) : (
            <motion.span
              whileHover={{ rotate: [0, -8, 8, -4, 0] }}
              transition={{ duration: 0.5 }}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 glow-fire"
            >
              <Flame className="h-5 w-5 text-white" />
            </motion.span>
          )}
          <span className="font-display text-xl font-extrabold tracking-tight">{settings.store_name || 'GENZILLA'}</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {[['Shop', '#shop'], ['Drops', '#drops'], ['About', '#about'], ['Lookbook', '#lookbook'], ['Contact', '#contact']].map(([label, href]) => (
            <a key={href} href={href} className="group relative text-sm font-medium text-white/70 transition-colors hover:text-white">
              {label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <motion.button
          onClick={onOpenCart}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.04 }}
          className="group relative flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold transition-colors hover:border-orange-400/50 hover:bg-orange-500/10"
        >
          <ShoppingBag className="h-4 w-4" />
          <span className="hidden sm:inline">Cart</span>
          <AnimatePresence>
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 px-1 text-[11px] font-bold text-white"
              >
                {count}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </nav>
    </motion.header>
  );
}
