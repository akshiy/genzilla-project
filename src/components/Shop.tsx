import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';
import { useCart } from '@/lib/store';
import { Flame, Search } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { Reveal } from '@/components/Reveal';

export function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('all');
  const [query, setQuery] = useState('');
  const [added, setAdded] = useState<string | null>(null);
  const { add } = useCart();

  useEffect(() => {
    supabase.from('products').select('*').eq('published', true).order('created_at', { ascending: false }).then(({ data, error }) => {
      if (!error && data) setProducts(data as Product[]);
      setLoading(false);
    });
  }, []);

  const categories = useMemo(() => ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))], [products]);
  const filtered = products.filter(p => {
    const matchesCategory = active === 'all' || p.category === active;
    const haystack = `${p.name} ${p.tagline ?? ''} ${p.description ?? ''} ${p.category} ${(p.tags ?? []).join(' ')}`.toLowerCase();
    return matchesCategory && haystack.includes(query.toLowerCase());
  });

  const handleAdd = (p: Product) => {
    add(p, 1);
    setAdded(p.id);
    setTimeout(() => setAdded(cur => (cur === p.id ? null : cur)), 1400);
  };

  return (
    <section id="shop" className="relative py-24">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-400">
              <Flame className="h-4 w-4" /> The catalog
            </div>
            <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              Pick your <span className="text-gradient-fire">flame</span>
            </h2>
          </div>
          <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 md:w-auto">
            <Search className="h-4 w-4 text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/35 md:w-56"
              placeholder="Search products…"
            />
          </div>
        </Reveal>

        <LayoutGroup>
          <Reveal delay={0.1} className="mb-7 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`relative rounded-full px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                  active === c ? 'text-black' : 'border border-white/15 text-white/70 hover:text-white'
                }`}
              >
                {active === c && (
                  <motion.span
                    layoutId="category-pill"
                    className="absolute inset-0 rounded-full bg-white"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{c}</span>
              </button>
            ))}
          </Reveal>
        </LayoutGroup>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-3xl bg-white/5 animate-shimmer" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center text-white/45">
            No products match your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 [perspective:1200px]">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} onAdd={handleAdd} added={added === p.id} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
