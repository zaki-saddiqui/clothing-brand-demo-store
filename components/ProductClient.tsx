// components/ProductClient.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext"; // adjust path if needed

type Variant = {
  id?: string;
  title?: string;
  size?: string;
  color?: string;
  priceCents?: number;
  images?: string[];
};

type Product = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  variants: Variant[];
  featured?: boolean;
  category?: string;
};

export default function ProductClient({ product }: { product: Product }) {
  const cart = useCart();
  const add = cart?.add;
  const items = cart?.items ?? [];

  // gallery (dedupe)
  const allImages = useMemo(() => {
    const imgs: string[] = [];
    (product.variants || []).forEach((v) => {
      (v.images || []).forEach((src) => {
        if (src && !imgs.includes(src)) imgs.push(src);
      });
    });
    if (imgs.length === 0) imgs.push("/images/core-tee-1.png");
    return imgs;
  }, [product]);

  const [activeIndex, setActiveIndex] = useState(0);

  // variant selection
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  useEffect(() => {
    setSelectedVariantIndex(0);
  }, [product.slug]);

  const selectedVariant =
    product.variants && product.variants[selectedVariantIndex];

  const [qty, setQty] = useState(1);
  useEffect(() => {
    setQty(1);
  }, [selectedVariantIndex]);

  const priceCents =
    selectedVariant?.priceCents ??
    (product.variants && product.variants[0]?.priceCents) ??
    0;

  function fmt(n: number) {
    return n.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });
  }

  // add to cart
  function handleAddToCart() {
    const payload = {
      productId: product.id,
      productSlug: product.slug,
      title: product.title,
      variantId: selectedVariant?.id,
      variantTitle: selectedVariant?.title,
      priceCents,
      qty,
      image:
        (selectedVariant &&
          selectedVariant.images &&
          selectedVariant.images[0]) ||
        allImages[0],
      variant: selectedVariant,
    };

    if (add) {
      add(payload);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    } else {
      console.warn(
        "Cart context missing - implement add() on CartContext",
        payload
      );
    }
  }

  const [justAdded, setJustAdded] = useState(false);

  // sync active image when variant changes
  useEffect(() => {
    const vImgs = selectedVariant?.images ?? [];
    if (vImgs.length) {
      const idx = allImages.indexOf(vImgs[0]);
      if (idx >= 0) setActiveIndex(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariantIndex]);

  // Ensure the absolute back button is focused friendly for keyboard users
  useEffect(() => {
    // no-op placeholder in case we want to manage focus or analytics later
  }, []);

  return (
    <>
      {/* NUCLEAR-PROOF BACK BUTTON (desktop) */}
      <div className="hidden lg:flex fixed top-24 left-10 z-[999999]">
        <Link
          href="/shop"
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/20 text-gray-200 backdrop-blur-md hover:bg-white/10 hover:text-white transition"
          aria-label="Back to shop"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to shop
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative">
        {/* Left: Gallery */}
        <div>
          <div className="rounded-2xl overflow-hidden bg-gray-900 shadow-2xl">
            <div className="relative w-full h-[420px] sm:h-[520px] bg-black">
              <Image
                src={allImages[activeIndex]}
                alt={product.title}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="mt-4 flex gap-3 overflow-auto">
            {allImages.map((src, i) => (
              <button
                key={src + i}
                onClick={() => setActiveIndex(i)}
                aria-label={`View image ${i + 1}`}
                className={`rounded-md overflow-hidden ring-1 ring-white/6 p-0.5 focus:outline-none ${
                  i === activeIndex
                    ? "ring-2 ring-white/30"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                <img
                  src={src}
                  alt={`${product.title} ${i + 1}`}
                  className="w-20 h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info + purchase */}
        <div className="space-y-6 relative">
          {/* (Desktop back also added above as fixed.) */}

          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold">
              {product.title}
            </h1>
            <div className="mt-2 text-sm text-gray-400">{product.category}</div>
            <div className="mt-4 text-2xl font-bold">
              {fmt(priceCents / 100)}
            </div>
          </div>

          <div className="bg-[rgba(255,255,255,0.02)] ring-1 ring-white/6 rounded-2xl p-6 shadow-sm">
            {product.variants && product.variants.length > 1 && (
              <div className="mb-4">
                <label className="text-sm text-gray-300 block mb-2">
                  Variant
                </label>
                <div className="flex gap-2 flex-wrap">
                  {product.variants.map((v, idx) => {
                    const label =
                      v.title ??
                      (v.size
                        ? `Size: ${v.size}`
                        : v.color ?? `Variant ${idx + 1}`);
                    const isActive = selectedVariantIndex === idx;
                    return (
                      <button
                        key={v.id ?? idx}
                        onClick={() => setSelectedVariantIndex(idx)}
                        className={`px-3 py-2 rounded-md border transition ${
                          isActive
                            ? "bg-white text-black border-white/10 font-semibold"
                            : "bg-transparent text-gray-300 border-white/5 hover:bg-white/3"
                        }`}
                        aria-pressed={isActive}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* RESPONSIVE ACTIONS: qty + add + view cart */}
            <div className="flex flex-wrap items-center gap-3 justify-center">
              {/* Qty control - fixed size, won't shrink */}
              <div className="flex items-center rounded-full bg-white/5 p-1 flex-shrink-0">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 rounded-full text-white/90 hover:bg-white/10 focus:outline-none"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <div className="px-4 text-sm font-medium" aria-live="polite">
                  {qty}
                </div>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-3 py-1 rounded-full text-white/90 hover:bg-white/10 focus:outline-none"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Primary CTA: Add to cart - priority, expands on small screens */}
              <button
                onClick={handleAddToCart}
                className="w-full sm:w-0 min-w-[150px] flex-1 sm:flex-none px-6 py-3 rounded-full bg-white text-black font-semibold shadow hover:shadow-lg active:scale-95 transition text-center whitespace-nowrap"
                aria-label="Add to cart"
              >
                {justAdded ? "Added" : "Add to cart"}
              </button>

              {/* Secondary CTA: View cart - becomes full width on very small screens */}
              <Link
                href="/cart"
                className="w-full sm:w-auto px-4 py-3 rounded-full border border-white/8 text-sm text-gray-200 inline-flex items-center justify-center gap-2"
                aria-label="View cart"
              >
                View cart
              </Link>
            </div>

            <div className="mt-3 text-sm text-gray-400 flex justify-center">
              {selectedVariant && selectedVariant.priceCents === 0 ? (
                <span className="text-yellow-300">
                  Price not available — check variant or contact support
                </span>
              ) : (
                <span>
                  Free returns within 30 days • Free shipping over $100
                </span>
              )}
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-gray-300">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p>{product.description}</p>
          </div>

          {/* Mobile floating Shop button */}
          <div className="lg:hidden fixed left-4 bottom-6 z-50">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 border border-white/10 text-gray-200 backdrop-blur-sm shadow-lg hover:bg-black/80 transition"
              aria-label="Shop"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Shop
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
