// app/cart/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useState } from "react";
import PRODUCTS from "../../data/products";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const router = useRouter();
  const cart = useCart();
  const items = cart?.items ?? [];
  const add = cart?.add;
  const remove = cart?.remove;
  const clear = cart?.clear;
  const update = cart?.update;

  // helper: find product by id or slug
  function findProductByIdOrSlug(key?: string) {
    if (!key) return undefined;
    return PRODUCTS.find(
      (p: any) =>
        p.id === key ||
        p.slug === key ||
        (p.variants || []).some((v: any) => v.id === key)
    );
  }

  // resolve display fields for an item robustly
  function resolveItem(it: any) {
    // raw item
    const raw = it;

    // try to get ids
    const productId =
      raw.productId ??
      raw.id ??
      (raw.product && (raw.product.id ?? raw.product.slug)) ??
      undefined;

    // variantId might be stored in variantId, variant?.id or variantId inside raw
    const variantId = raw.variantId ?? (raw.variant && raw.variant.id) ?? null;

    // locate product (try product from raw, product id, variant id or slug)
    const productFromItem = raw.product ?? findProductByIdOrSlug(productId) ?? undefined;
    const productFromVariant = variantId ? findProductByIdOrSlug(variantId) : undefined;
    const product =
      productFromItem || productFromVariant || findProductByIdOrSlug(productId) || undefined;

    // variant object if embedded
    const variant = raw.variant ?? (product?.variants ? product.variants.find((v: any) => v.id === variantId) : undefined) ?? {};

    // title precedence
    const title =
      raw.title ||
      variant?.title ||
      variant?.name ||
      product?.title ||
      product?.name ||
      "Product";

    // image precedence
    const img =
      raw.image ||
      (variant && variant.images && variant.images[0]) ||
      (product && product.variants && product.variants[0] && product.variants[0].images && product.variants[0].images[0]) ||
      "/images/core-tee-1.png";

    // price precedence (in cents)
    const priceCents =
      typeof raw.priceCents === "number"
        ? raw.priceCents
        : typeof variant?.priceCents === "number"
        ? variant.priceCents
        : typeof product?.variants?.[0]?.priceCents === "number"
        ? product.variants[0].priceCents
        : 0;

    // quantity
    const qty = typeof raw.qty === "number" ? raw.qty : typeof raw.quantity === "number" ? raw.quantity : 1;

    return {
      productId,
      variantId,
      title,
      img,
      priceCents,
      qty,
      raw,
    };
  }

  const resolved = useMemo(() => items.map(resolveItem), [items]);

  const subtotal = useMemo(() => {
    return resolved.reduce((sum: number, it: any) => {
      return sum + (it.priceCents / 100) * (it.qty || 1);
    }, 0);
  }, [resolved]);

  const shipping = subtotal > 100 ? 0 : 6.5;
  const total = subtotal + shipping;

  // helpers to perform cart mutations in a consistent way
  function safeUpdateQty(productId: string | undefined, variantId: any, nextQty: number) {
    if (!productId) {
      console.warn("safeUpdateQty: missing productId", { productId, variantId, nextQty });
      return;
    }
    // if update exists, use updater function (keeps shape)
    if (update) {
      try {
        update(productId, variantId, (current: any) => {
          // current might be undefined if context implementation differs; guard it
          const cur = current ?? { productId, variantId, qty: 0, priceCents: 0 };
          return { ...cur, qty: Math.max(0, nextQty) };
        });
        return;
      } catch (e) {
        console.warn("update failed, falling back to remove/add", e);
      }
    }

    // fallback: if add exists, compute delta
    if (add) {
      // to change qty to nextQty we need current qty
      const existing = items.find(
        (it: any) =>
          (it.productId === productId || it.id === productId) &&
          ((it.variantId ?? null) === (variantId ?? null) || it.variant?.id === variantId)
      );
      const curQty = existing ? (existing.qty ?? existing.quantity ?? 1) : 0;
      const delta = nextQty - curQty;
      if (delta === 0) return;
      add({
        productId,
        variantId,
        qty: delta,
        priceCents: existing?.priceCents ?? undefined,
        title: existing?.title,
        image: existing?.image,
      } as any);
      return;
    }

    // last resort: if remove available and nextQty <= 0
    if (remove && nextQty <= 0) {
      remove(productId, variantId);
    }
  }

  function increase(it: any) {
    const { productId, variantId, qty } = it;
    safeUpdateQty(productId, variantId, qty + 1);
  }

  function decrease(it: any) {
    const { productId, variantId, qty } = it;
    const next = Math.max(0, qty - 1);
    if (next === 0) {
      // remove item
      if (remove) {
        remove(productId, variantId);
        return;
      }
      // if update exists, set qty 0 and CartContext should remove it
      if (update) {
        update(productId, variantId, (curr: any) => ({ ...curr, qty: 0 }));
        return;
      }
      // fallback: use add with negative delta
      if (add) {
        add({ productId, variantId, qty: -1 } as any);
        return;
      }
    } else {
      safeUpdateQty(productId, variantId, next);
    }
  }

  function removeItem(it: any) {
    const { productId, variantId } = it;
    if (remove) {
      remove(productId, variantId);
      return;
    }
    if (update) {
      update(productId, variantId, (curr: any) => ({ ...curr, qty: 0 }));
      return;
    }
    console.warn("No remove/update function on cart context");
  }

  function handleClear() {
    if (clear) clear();
  }

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, []);

  function fmt(v: number) {
    return v.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });
  }

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold">Your Cart</h1>
          <p className="mt-2 text-gray-400">
            Review items, update quantities, or checkout when ready.
          </p>
        </header>

        {resolved.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-lg text-gray-400">Your cart is empty.</p>
            <Link
              href="/shop"
              className="inline-block mt-6 px-6 py-3 rounded-full bg-white text-black font-semibold"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {resolved.map((it: any, idx: number) => {
                const price = it.priceCents / 100;
                const lineTotal = price * it.qty;
                const priceZero = it.priceCents === 0;

                return (
                  <div
                    key={`${it.productId ?? "p"}-${it.variantId ?? idx}-${idx}`}
                    className="relative bg-[rgba(255,255,255,0.02)] ring-1 ring-white/6 rounded-xl p-4 flex gap-4 items-center"
                  >
                    <div className="w-28 h-20 rounded-md overflow-hidden bg-gray-800 flex items-center justify-center shrink-0">
                      <img
                        src={it.img}
                        alt={it.title}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-semibold text-white">{it.title}</div>
                        </div>

                        <div className={`text-sm font-semibold ${priceZero ? "text-yellow-300" : "text-gray-100"}`}>
                          {fmt(lineTotal)}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex items-center rounded-full bg-white/5 p-1">
                          <button
                            onClick={() => decrease(it)}
                            className="px-3 py-1 rounded-full text-white/90 hover:bg-white/10 transition"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <div className="px-3 text-sm font-medium">{it.qty}</div>
                          <button
                            onClick={() => increase(it)}
                            className="px-3 py-1 rounded-full text-white/90 hover:bg-white/10 transition"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(it)}
                          className="text-sm text-red-400 hover:text-red-300 transition"
                        >
                          Remove
                        </button>

                        {priceZero && (
                          <div className="ml-3 text-xs text-yellow-200/90 bg-yellow-900/10 px-2 py-1 rounded">
                            Price unavailable
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="bg-[rgba(255,255,255,0.02)] ring-1 ring-white/6 rounded-xl p-6 h-fit sticky top-6">
              <h3 className="text-lg font-semibold">Order summary</h3>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Subtotal</span>
                  <span>{fmt(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-300">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : fmt(shipping)}</span>
                </div>

                <div className="border-t border-white/6 my-3" />

                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span>{fmt(total)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full px-4 py-3 rounded-full bg-white text-black font-semibold shadow hover:shadow-lg transition active:scale-95"
                >
                  Checkout
                </button>

                <button
                  onClick={handleClear}
                  className="w-full px-4 py-2 rounded-full border border-white/6 text-sm text-gray-300"
                >
                  Clear cart
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
