// app/product/[slug]/AddToCartSection.tsx
"use client";
import React, { useState } from "react";
import type { Product } from "../../../types/product";
import { useCart } from "../../../context/CartContext";

export default function AddToCartSection({ product }: { product: Product }) {
  const variant = product.variants[0];
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const price = (variant.priceCents / 100).toFixed(2);

  function handleAdd() {
    add({ productId: product.id, variantId: variant.id, qty });
    // brief visual cue could be added — keep minimal for now
  }

  async function handleBuyNow() {
    // create Stripe Checkout session server-side
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineItems: [{ priceCents: variant.priceCents, quantity: qty, name: product.title, variantId: variant.id }] })
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Failed to create checkout session");
    }
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm">Qty</label>
        <input type="number" min={1} value={qty} onChange={(e)=>setQty(Number(e.target.value))} className="w-20 border rounded px-2 py-1" />
      </div>

      <div className="flex gap-3">
        <button onClick={handleAdd} className="px-4 py-2 border rounded">Add to cart</button>
        <button onClick={handleBuyNow} className="px-4 py-2 bg-black text-white rounded">Buy now — ${price}</button>
      </div>
    </div>
  );
}
