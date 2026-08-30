import { useState } from 'react';
import { Flame, Mail, Instagram, Send } from 'lucide-react';

export function Contact() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    setEmail('');
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section id="contact" className="relative py-24">
      <div className="mx-auto max-w-4xl px-5">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-orange-500/10 via-red-600/5 to-transparent p-10 text-center md:p-16">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-500/20 blur-3xl" />
          <Flame className="mx-auto mb-6 h-12 w-12 animate-flicker text-orange-400" />
          <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">
            Join the <span className="text-gradient-fire">collective</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/60">
            Early access to drops, restock alerts, and 10% off your first order. No spam, just fire.
          </p>

          <form onSubmit={submit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-full border border-white/15 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-orange-400/50"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-6 py-3.5 text-sm font-bold text-white glow-fire transition-transform hover:scale-105"
            >
              <Send className="h-4 w-4" />
              {sent ? "You're in!" : 'Subscribe'}
            </button>
          </form>

          <div className="mt-10 flex items-center justify-center gap-6">
            <a href="#" aria-label="Instagram" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all hover:border-orange-400/50 hover:text-orange-400">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Email" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all hover:border-orange-400/50 hover:text-orange-400">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
