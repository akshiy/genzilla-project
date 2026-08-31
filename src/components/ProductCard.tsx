import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Plus, Check } from 'lucide-react';
import type { Product } from '@/lib/types';

interface Props {
  product: Product;
  index: number;
  onAdd: (p: Product) => void;
  added: boolean;
}

// Small burst of spark particles fired from the add-to-cart button
function SparkBurst() {
  const sparks = Array.from({ length: 8 });
  return (
    <>
      {sparks.map((_, i) => {
        const angle = (i / sparks.length) * Math.PI * 2;
        const dist = 26 + Math.random() * 14;
        return (
          <motion.span
            key={i}
            className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-gradient-to-br from-orange-300 to-red-500"
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{
              opacity: 0,
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              scale: 0,
            }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          />
        );
      })}
    </>
  );
}

export function ProductCard({ product: p, index, onAdd, added }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [burst, setBurst] = useState(false);
  const price = Number(p.sale_price ?? p.price);

  // Raw pointer offset within the card, in -0.5..0.5 range
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 220, damping: 20, mass: 0.5 });
  const springY = useSpring(mvY, { stiffness: 220, damping: 20, mass: 0.5 });

  // Tilt rotation derived from pointer position
  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-10, 10]);
  // Glow follows the pointer
  const glowX = useTransform(springX, [-0.5, 0.5], ['0%', '100%']);
  const glowY = useTransform(springY, [-0.5, 0.5], ['0%', '100%']);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mvX.set((e.clientX - rect.left) / rect.width - 0.5);
    mvY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    mvX.set(0);
    mvY.set(0);
  };

  const handleAdd = () => {
    onAdd(p);
    setBurst(true);
    setTimeout(() => setBurst(false), 600);
  };

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: (index % 8) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      whileHover={{ y: -10, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
      }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-colors duration-500 hover:border-orange-400/40 hover:bg-white/[0.05] [transform-style:preserve-3d]"
    >
      {/* Cursor-follow glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(180px circle at ${glowX} ${glowY}, rgba(255,120,40,0.28), transparent 65%)`,
        }}
      />

      <div className="relative aspect-square overflow-hidden">
        <motion.img
          src={p.image_url ?? ''}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-cover"
          style={{ scale: useTransform(springX, () => 1) }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.12 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {p.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
            {p.badge}
          </span>
        )}
        {p.stock < 50 && p.stock > 0 && (
          <span className="absolute right-3 top-3 rounded-full border border-amber-400/40 bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-300 backdrop-blur">
            Low stock
          </span>
        )}
        {p.stock <= 0 && (
          <span className="absolute right-3 top-3 rounded-full border border-red-400/40 bg-black/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-red-300 backdrop-blur">
            Sold out
          </span>
        )}
      </div>

      <div className="relative z-20 flex flex-1 flex-col p-5" style={{ transform: 'translateZ(30px)' }}>
        <h3 className="font-display text-lg font-bold leading-tight">{p.name}</h3>
        <p className="mt-1 text-sm text-white/55">{p.tagline}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <div>
            <span className="font-display text-2xl font-extrabold">₹{price.toFixed(0)}</span>
            {p.sale_price != null && (
              <span className="ml-2 text-sm text-white/35 line-through">₹{Number(p.price).toFixed(0)}</span>
            )}
          </div>
          <motion.button
            disabled={p.stock <= 0}
            onClick={handleAdd}
            whileTap={{ scale: 0.9 }}
            className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              p.stock <= 0
                ? 'cursor-not-allowed bg-white/10 text-white/35'
                : added
                ? 'bg-green-500 text-white'
                : 'bg-white text-black'
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  className="flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" /> Added
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  className="flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" /> Add
                </motion.span>
              )}
            </AnimatePresence>
            <AnimatePresence>{burst && <SparkBurst />}</AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
