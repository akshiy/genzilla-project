import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, Flame, Loader2, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import type { OrderPayload } from '@/lib/types';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: Props) {
  const { items, total, remove, setQty, clear, count } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    customer_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckingOut(true);
    setError(null);
    const payload: OrderPayload = {
      ...form,
      items: items.map((i) => ({ id: i.product.id, name: i.product.name, price: i.product.price, qty: i.quantity })),
      total,
    };
    const { error: insErr } = await supabase.from('orders').insert(payload);
    setCheckingOut(false);
    if (insErr) {
      setError('Something went wrong placing your order. Try again.');
      return;
    }
    clear();
    setPlaced(true);
    setTimeout(() => {
      setPlaced(false);
      onClose();
      setForm({ customer_name: '', email: '', phone: '', address: '', city: '', pincode: '' });
    }, 2600);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#0c0c11]"
          >
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-orange-400" />
            <span className="font-display text-lg font-bold">
              {placed ? 'Order placed' : `Your cart${count ? ` (${count})` : ''}`}
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {placed ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <CheckCircle2 className="mb-5 h-16 w-16 text-green-400 animate-scale-in" />
            <h3 className="font-display text-2xl font-extrabold">You're lit!</h3>
            <p className="mt-2 text-white/60">
              Your order is in. We'll email a confirmation and dispatch within 24 hours.
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <Flame className="mb-4 h-12 w-12 text-white/20" />
            <p className="text-white/50">Your cart is empty.</p>
            <button
              onClick={onClose}
              className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-105"
            >
              Start shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto p-5 no-scrollbar">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="flex gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                  >
                    <img
                      src={item.product.image_url ?? ''}
                      alt={item.product.name}
                      className="h-20 w-20 flex-shrink-0 rounded-xl object-cover"
                    />
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold leading-tight">{item.product.name}</h4>
                        <button
                          onClick={() => remove(item.product.id)}
                          className="text-white/40 transition-colors hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <span className="text-xs text-white/45">{item.product.tagline}</span>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => setQty(item.product.id, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:text-white"
                          >
                            <Minus className="h-3 w-3" />
                          </motion.button>
                          <motion.span
                            key={item.quantity}
                            initial={{ scale: 1.3 }}
                            animate={{ scale: 1 }}
                            className="w-6 text-center text-sm font-semibold"
                          >
                            {item.quantity}
                          </motion.span>
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => setQty(item.product.id, item.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:text-white"
                          >
                            <Plus className="h-3 w-3" />
                          </motion.button>
                        </div>
                        <span className="font-display text-base font-bold">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Checkout form */}
            <div className="border-t border-white/10 p-5">
              <form onSubmit={handleCheckout} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input required placeholder="Name" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} className="rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm placeholder-white/40 outline-none focus:border-orange-400/50" />
                  <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm placeholder-white/40 outline-none focus:border-orange-400/50" />
                </div>
                <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm placeholder-white/40 outline-none focus:border-orange-400/50" />
                <input required placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm placeholder-white/40 outline-none focus:border-orange-400/50" />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm placeholder-white/40 outline-none focus:border-orange-400/50" />
                  <input placeholder="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className="rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm placeholder-white/40 outline-none focus:border-orange-400/50" />
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm text-white/55">Total</span>
                  <span className="font-display text-2xl font-extrabold text-gradient-fire">${total.toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  disabled={checkingOut}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600 py-4 text-base font-bold text-white glow-fire transition-transform hover:scale-[1.02] disabled:opacity-60"
                >
                  {checkingOut ? <><Loader2 className="h-5 w-5 animate-spin" /> Placing order…</> : <><Flame className="h-5 w-5" /> Place order</>}
                </button>
              </form>
            </div>
          </>
        )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
