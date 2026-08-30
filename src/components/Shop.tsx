import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';
import { useCart } from '@/lib/store';
import { Plus, Flame } from 'lucide-react';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'torch', label: 'Torch' },
  { key: 'classic', label: 'Classic' },
  { key: 'accessories', label: 'Accessories' },
];

export function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('all');
  const [added, setAdded] = useState<string | null>(null);
  const { add } = useCart();

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setProducts(data);
        setLoading(false);
      });
  }, []);

  const filtered = active === 'all' ? products : products.filter((p) => p.category === active);

  const handleAdd = (p: Product) => {
    add(p, 1);
    setAdded(p.id);
    setTimeout(() => setAdded((cur) => (cur === p.id ? null : cur)), 1400);
  };

  return (
    <section id="shop" className="relative py-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-400">
              <Flame className="h-4 w-4" /> The catalog
            </div>
            <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              Pick your <span className="text-gradient-fire">flame</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setActive(c.key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  active === c.key
                    ? 'bg-white text-black'
                    : 'border border-white/15 text-white/70 hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-3xl bg-white/5 animate-shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((p, i) => (
              <article
                key={p.id}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-all duration-500 hover:border-orange-400/40 hover:bg-white/[0.05] animate-rise"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={p.image_url ?? ''}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
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
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-bold leading-tight">{p.name}</h3>
                  <p className="mt-1 text-sm text-white/55">{p.tagline}</p>

                  <div className="mt-auto flex items-center justify-between pt-5">
                    <span className="font-display text-2xl font-extrabold">
                      ${p.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleAdd(p)}
                      className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                        added === p.id
                          ? 'bg-green-500 text-white'
                          : 'bg-white text-black hover:scale-105'
                      }`}
                    >
                      {added === p.id ? 'Added' : (<><Plus className="h-4 w-4" /> Add</>)}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
