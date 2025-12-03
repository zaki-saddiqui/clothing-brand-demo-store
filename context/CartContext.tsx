// // context/CartContext.tsx
// "use client";

// import React, { createContext, useContext, useEffect, useState } from "react";

// export type CartItem = {
//   productId: string;
//   variantId: string;
//   qty: number;
// };

// type CartContextValue = {
//   items: CartItem[];
//   add: (item: CartItem) => void;
//   remove: (variantId: string) => void;
//   clear: () => void;
//   updateQty: (variantId: string, qty: number) => void;
// };

// const CartContext = createContext<CartContextValue | undefined>(undefined);

// const STORAGE_KEY = "cb_cart_v1";

// export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [items, setItems] = useState<CartItem[]>([]);

//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem(STORAGE_KEY);
//       if (raw) setItems(JSON.parse(raw));
//     } catch (e) {}
//   }, []);

//   useEffect(() => {
//     try {
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
//     } catch (e) {}
//   }, [items]);

//   function add(item: CartItem) {
//     setItems((prev) => {
//       const exists = prev.find((x) => x.variantId === item.variantId);
//       if (exists) {
//         return prev.map((x) => (x.variantId === item.variantId ? { ...x, qty: x.qty + item.qty } : x));
//       }
//       return [...prev, item];
//     });
//   }

//   function remove(variantId: string) {
//     setItems((prev) => prev.filter((i) => i.variantId !== variantId));
//   }

//   function clear() {
//     setItems([]);
//   }

//   function updateQty(variantId: string, qty: number) {
//     setItems((prev) => prev.map((i) => (i.variantId === variantId ? { ...i, qty } : i)));
//   }

//   return (
//     <CartContext.Provider value={{ items, add, remove, clear, updateQty }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export function useCart() {
//   const ctx = useContext(CartContext);
//   if (!ctx) throw new Error("useCart must be used within CartProvider");
//   return ctx;
// }



























// context/CartContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  productId: string;
  productSlug?: string;
  title?: string;
  variantId?: string | number;
  variantTitle?: string;
  priceCents: number;
  qty: number;
  image?: string;
  // allow extra data
  [k: string]: any;
};

export type CartContextValue = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (productId: string, variantId?: string | number) => void;
  update: (productId: string, variantId: string | number | undefined, patch: Partial<CartItem> | ((it: CartItem) => CartItem)) => void;
  clear: () => void;
  totalItems: number;
  totalCents: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "nevbird_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // load from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch (e) {
      console.warn("Cart load failed", e);
    }
  }, []);

  // persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Cart save failed", e);
    }
  }, [items]);

  const totalItems = useMemo(() => items.reduce((s, it) => s + (it.qty || 0), 0), [items]);
  const totalCents = useMemo(() => items.reduce((s, it) => s + (it.priceCents || 0) * (it.qty || 0), 0), [items]);

  function add(item: CartItem) {
    setItems((prev) => {
      // merge if same productId + variantId
      const idx = prev.findIndex((p) => p.productId === item.productId && (p.variantId ?? "") === (item.variantId ?? ""));
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + (item.qty || 1) };
        return copy;
      }
      return [...prev, { ...item, qty: item.qty ?? 1 }];
    });
  }

  function remove(productId: string, variantId?: string | number) {
    setItems((prev) => prev.filter((p) => !(p.productId === productId && (variantId === undefined || (p.variantId ?? "") === (variantId ?? "")))));
  }

  function update(
    productId: string,
    variantId: string | number | undefined,
    patch: Partial<CartItem> | ((it: CartItem) => CartItem)
  ) {
    setItems((prev) =>
      prev.map((it) => {
        if (it.productId !== productId) return it;
        if (variantId !== undefined && (it.variantId ?? "") !== (variantId ?? "")) return it;
        const next = typeof patch === "function" ? patch(it) : { ...it, ...patch };
        // ensure qty doesn't drop below 1
        if (next.qty === undefined || next.qty === null) next.qty = it.qty ?? 1;
        if (next.qty <= 0) return null as any; // mark for removal
        return next;
      }).filter(Boolean) as CartItem[]
    );
  }

  function clear() {
    setItems([]);
  }

  const value: CartContextValue = {
    items,
    add,
    remove,
    update,
    clear,
    totalItems,
    totalCents,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue | undefined {
  return useContext(CartContext);
}
