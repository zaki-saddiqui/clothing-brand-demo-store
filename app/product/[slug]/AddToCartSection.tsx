// app/product/[slug]/AddToCartSection.tsx
"use client";
import React, { useState } from "react";
import type { Product } from "../../../types/product";
import { useCart } from "../../../context/CartContext";

export default function AddToCartSection({ product }: { product: Product }) {
  const variant = product.variants[0];
  const [qty, setQty] = useState(1);

  // safe cart access
  const cart = useCart();
  const add = cart?.add;

  const price = ((variant?.priceCents ?? 0) / 100).toFixed(2);

  function handleAdd() {
    if (!add) {
      console.warn("Cart context not available — cannot add to cart.");
      return;
    }

    // Variant may not have `title` in your types — use safe fallbacks
    const variantTitle =
      // @ts-ignore - runtime safeguard: prefer explicit title, then name, then color, else undefined
      (variant && (variant.title ?? (variant as any).name ?? (variant as any).color)) ??
      undefined;

    const payload = {
      productId: product.id,
      productSlug: product.slug,
      title: product.title,
      variantId: variant?.id,
      variantTitle,
      priceCents: variant?.priceCents ?? 0,
      qty,
      image:
        variant?.images?.[0] ??
        product?.variants?.[0]?.images?.[0] ??
        "/images/core-tee-1.png",
      variant,
    };

    add(payload as any);
  }

  async function handleBuyNow() {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lineItems: [
            {
              priceCents: variant?.priceCents ?? 0,
              quantity: qty,
              name: product.title,
              variantId: variant?.id,
            },
          ],
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to create checkout session");
      }
    } catch (err) {
      console.error("checkout error", err);
      alert("Failed to create checkout session");
    }
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm">Qty</label>
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="w-20 border rounded px-2 py-1"
        />
      </div>

      <div className="flex gap-3">
        <button onClick={handleAdd} className="px-4 py-2 border rounded">
          Add to cart
        </button>
        <button
          onClick={handleBuyNow}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Buy now — ${price}
        </button>
      </div>
    </div>
  );
}
