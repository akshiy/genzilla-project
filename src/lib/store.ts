import { useEffect, useState, useCallback } from 'react';
import type { CartItem, Product } from './types';

const CART_KEY = 'genzilla_cart';

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('genzilla-cart-change'));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(readCart);

  useEffect(() => {
    const sync = () => setItems(readCart());
    window.addEventListener('genzilla-cart-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('genzilla-cart-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const add = useCallback((product: Product, qty = 1) => {
    const current = readCart();
    const existing = current.find((i) => i.product.id === product.id);
    if (existing) {
      existing.quantity += qty;
      writeCart([...current]);
    } else {
      writeCart([...current, { product, quantity: qty }]);
    }
  }, []);

  const remove = useCallback((productId: string) => {
    writeCart(readCart().filter((i) => i.product.id !== productId));
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    const current = readCart();
    const item = current.find((i) => i.product.id === productId);
    if (!item) return;
    item.quantity = Math.max(1, qty);
    writeCart([...current]);
  }, []);

  const clear = useCallback(() => writeCart([]), []);

  const count = items.reduce((n, i) => n + i.quantity, 0);
  const total = items.reduce((n, i) => n + i.product.price * i.quantity, 0);

  return { items, count, total, add, remove, setQty, clear };
}
