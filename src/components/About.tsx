import { Flame, Recycle, Wind, Shield, Sparkles, Zap } from 'lucide-react';

const FEATURES = [
  { icon: Wind, title: 'Windproof', body: 'Torch flames that hold steady in a storm. Light it anywhere.' },
  { icon: Recycle, title: 'Refillable', body: 'Butane refills, not landfills. Every lighter is built to last.' },
  { icon: Shield, title: 'Child-safe', body: 'Dual-action strikes and safety locks on every model.' },
  { icon: Zap, title: 'Fast dispatch', body: 'Ordered today, out the door within 24 hours.' },
];

export function About() {
  return (
    <section id="about" className="relative py-28">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(255,80,0,0.04),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-5">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-400">
              <Sparkles className="h-4 w-4" /> Our story
            </div>
            <h2 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              Built for the <span className="text-gradient-fire">feed-first</span> generation
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-white/65">
              Genzilla started in a bedroom with a single question — why do lighters all look
              the same? We design refillable lighters, torch flames, and collectible matchbooks
              that feel like they belong on your shelf and your story.
            </p>
            <p className="mt-4 text-base leading-relaxed text-white/55">
              Every piece is windproof, reusable, and made to be seen. No disposable culture,
              no boring chrome. Just flame, reimagined.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {['Refillable', 'Windproof', 'Gen Z owned', 'Carbon-aware shipping'].map((t) => (
                <span key={t} className="glass rounded-full px-4 py-2 text-sm font-medium text-white/80">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="group glass rounded-3xl p-6 transition-all duration-500 hover:border-orange-400/40 animate-rise"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 text-orange-400 transition-transform group-hover:scale-110">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-bold">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/55">{f.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Big quote */}
        <div className="mt-20 overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-orange-500/10 via-red-600/5 to-transparent p-10 text-center md:p-16">
          <Flame className="mx-auto mb-6 h-10 w-10 animate-flicker text-orange-400" />
          <p className="mx-auto max-w-3xl font-display text-2xl font-extrabold leading-tight md:text-4xl">
            "We don't sell fire. We sell the moment you decide to
            <span className="text-gradient-fire"> light it up.</span>"
          </p>
          <p className="mt-6 text-sm uppercase tracking-[0.2em] text-white/40">— Genzilla Collective</p>
        </div>
      </div>
    </section>
  );
}
