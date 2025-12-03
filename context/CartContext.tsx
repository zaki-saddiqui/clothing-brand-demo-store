// context/CartContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  productId: string;
  variantId: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  updateQty: (variantId: string, qty: number) => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "cb_cart_v1";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  function add(item: CartItem) {
    setItems((prev) => {
      const exists = prev.find((x) => x.variantId === item.variantId);
      if (exists) {
        return prev.map((x) => (x.variantId === item.variantId ? { ...x, qty: x.qty + item.qty } : x));
      }
      return [...prev, item];
    });
  }

  function remove(variantId: string) {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  }

  function clear() {
    setItems([]);
  }

  function updateQty(variantId: string, qty: number) {
    setItems((prev) => prev.map((i) => (i.variantId === variantId ? { ...i, qty } : i)));
  }

  return (
    <CartContext.Provider value={{ items, add, remove, clear, updateQty }}>
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
