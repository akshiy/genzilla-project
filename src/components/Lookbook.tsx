import { Flame } from 'lucide-react';

const IMAGES = [
  'https://images.pexels.com/photos/7742848/pexels-photo-7742848.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/6365187/pexels-photo-6365187.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/14754790/pexels-photo-14754790.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/6580543/pexels-photo-6580543.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/38489198/pexels-photo-38489198.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/14057996/pexels-photo-14057996.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
];

export function Lookbook() {
  return (
    <section id="lookbook" className="relative py-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-12 text-center">
          <div className="mb-3 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-400">
            <Flame className="h-4 w-4" /> Lookbook
          </div>
          <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
            In the <span className="text-gradient-fire">wild</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/55">
            Shot on the street, styled for the feed. Tag #genzilla to be featured.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {IMAGES.map((src, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 ${
                i === 0 ? 'col-span-2 row-span-2 md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <img
                src={src}
                alt="Lookbook"
                loading="lazy"
                className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                  i === 0 ? 'aspect-square md:aspect-[2/2]' : 'aspect-square'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
