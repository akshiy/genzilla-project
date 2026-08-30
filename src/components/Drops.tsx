import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';
import { useCart } from '@/lib/store';
import { Plus, Flame } from 'lucide-react';

export function Drops() {
  const [products, setProducts] = useState<Product[]>([]);
  const { add } = useCart();

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setProducts(data);
      });
  }, []);

  if (products.length === 0) return null;

  return (
    <section id="drops" className="relative py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,80,0,0.08),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-5">
        <div className="mb-12 text-center">
          <div className="mb-3 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-400">
            <Flame className="h-4 w-4" /> Featured drops
          </div>
          <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
            The ones <span className="text-gradient-fire">everyone's</span> posting
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {products.slice(0, 2).map((p, i) => (
            <article
              key={p.id}
              className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] animate-scale-in"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={p.image_url ?? ''}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {p.badge && (
                  <span className="absolute left-5 top-5 rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                    {p.badge}
                  </span>
                )}
                <div className="absolute bottom-5 left-5 right-5">
                  <h3 className="font-display text-2xl font-extrabold md:text-3xl">{p.name}</h3>
                  <p className="mt-1 text-sm text-white/70">{p.tagline}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 p-5">
                <p className="text-sm leading-relaxed text-white/60 line-clamp-2">{p.description}</p>
              </div>
              <div className="flex items-center justify-between px-5 pb-5">
                <span className="font-display text-2xl font-extrabold">${p.price.toFixed(2)}</span>
                <button
                  onClick={() => add(p, 1)}
                  className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black transition-transform hover:scale-105"
                >
                  <Plus className="h-4 w-4" /> Add to cart
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
