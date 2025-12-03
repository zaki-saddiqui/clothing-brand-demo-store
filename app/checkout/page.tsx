// app/checkout/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import PRODUCTS from "../../data/products";
import CardNumberInput from "../../components/CardNumberInput";

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();
  const items = (cart && cart.items) || [];
  const clear = cart && cart.clear;
  const update = cart && cart.update;
  const remove = cart && cart.remove;

  // helper to find product by id/slug/variant id
  function findProductByIdOrSlug(key?: string) {
    if (!key || !Array.isArray(PRODUCTS)) return undefined;
    return PRODUCTS.find(
      (p: any) =>
        p.id === key ||
        p.slug === key ||
        (Array.isArray(p.variants) && p.variants.some((v: any) => v.id === key))
    );
  }

  // robust item resolver
  const resolved = useMemo(() => {
    return items.map((it: any) => {
      const variant = it.variant || {};
      const productFromItem =
        it.product ||
        findProductByIdOrSlug(it.productId) ||
        findProductByIdOrSlug(it.productSlug);
      const productFromVariant =
        variant && variant.productId
          ? findProductByIdOrSlug(variant.productId)
          : undefined;
      const product =
        productFromItem ||
        productFromVariant ||
        findProductByIdOrSlug(it.productId);

      const title =
        it.title ||
        variant.title ||
        (product && (product.title || product.name)) ||
        "Product";

      const img =
        it.image ||
        (variant && variant.images && variant.images[0]) ||
        (product &&
          product.variants &&
          product.variants[0] &&
          product.variants[0].images &&
          product.variants[0].images[0]) ||
        "/images/core-tee-1.png";

      const priceCents =
        (typeof it.priceCents === "number" ? it.priceCents : undefined) ??
        (variant && typeof variant.priceCents === "number"
          ? variant.priceCents
          : undefined) ??
        (product &&
        product.variants &&
        product.variants[0] &&
        typeof product.variants[0].priceCents === "number"
          ? product.variants[0].priceCents
          : 0);

      const qty = typeof it.qty === "number" ? it.qty : it.quantity || 1;

      return { raw: it, title, img, priceCents, qty };
    });
  }, [items]);

  const subtotal = useMemo(
    () =>
      resolved.reduce(
        (s: number, r: any) => s + (r.priceCents / 100) * r.qty,
        0
      ),
    [resolved]
  );

  const shippingCost = subtotal > 100 ? 0 : 6.5;
  const taxRate = 0.07; // placeholder
  const tax = +(subtotal * taxRate).toFixed(2);
  const total = +(subtotal + shippingCost + tax).toFixed(2);

  // form state
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");
  const [country, setCountry] = useState("United States");
  const [phone, setPhone] = useState("");
  const [billingSame, setBillingSame] = useState(true);

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      const t = setTimeout(() => router.push("/shop"), 900);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fmt(n: number) {
    return n.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });
  }

  function validate(): boolean {
    setError(null);
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email.");
      return false;
    }
    if (!fullName.trim()) {
      setError("Full name is required.");
      return false;
    }
    if (!address.trim() || !city.trim() || !postal.trim()) {
      setError("Shipping address is incomplete.");
      return false;
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setProcessing(true);
    setError(null);

    try {
      await new Promise((r) => setTimeout(r, 900));
      setSuccess(true);
      if (clear) clear();
      setTimeout(() => {
        router.push("/thank-you");
      }, 1000);
    } catch (err: any) {
      console.error("checkout error", err);
      setError("Payment failed. Try again.");
    } finally {
      setProcessing(false);
    }
  }

  function incQty(item: any) {
    if (update) {
      update(item.raw.variantId || item.raw.variant?.id, (item.qty || 1) + 1);
    }
  }
  function decQty(item: any) {
    if (item.qty <= 1) {
      if (remove) remove(item.raw.variantId || item.raw.variant?.id);
    } else if (update) {
      update(item.raw.variantId || item.raw.variant?.id, item.qty - 1);
    }
  }

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      {/* NUCLEAR-PROOF BACK BUTTON (desktop) */}
      <div className="hidden lg:flex fixed top-24 left-10 z-[999999]">
        <Link
          href="/cart"
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/20 text-gray-200 backdrop-blur-md hover:bg-white/10 hover:text-white transition"
          aria-label="Back to cart"
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
          Back to cart
        </Link>
      </div>

      {/* Mobile floating back (thumb-friendly) */}
      <div className="lg:hidden fixed left-4 bottom-6 z-50">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 border border-white/10 text-gray-200 backdrop-blur-sm shadow-lg hover:bg-black/80 transition"
          aria-label="Back to cart"
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
          Cart
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold">Checkout</h1>
          <p className="mt-2 text-gray-400">
            Complete your order — secure checkout. No surprises.
          </p>
        </header>

        {items.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-lg text-gray-400">
              Your cart is empty. Redirecting to shop…
            </p>
            <Link
              href="/shop"
              className="inline-block mt-6 px-6 py-3 rounded-full bg-white text-black font-semibold"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <section className="lg:col-span-2 space-y-6">
              <div className="bg-[rgba(255,255,255,0.02)] ring-1 ring-white/6 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">
                  Shipping information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex flex-col">
                    <span className="text-xs text-gray-300 mb-2">
                      Full name
                    </span>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="px-3 py-2 rounded-md bg-white/5 border border-white/6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                      required
                    />
                  </label>

                  <label className="flex flex-col">
                    <span className="text-xs text-gray-300 mb-2">Email</span>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="you@example.com"
                      className="px-3 py-2 rounded-md bg-white/5 border border-white/6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                      required
                    />
                  </label>
                </div>

                <div className="mt-3">
                  <label className="flex flex-col">
                    <span className="text-xs text-gray-300 mb-2">Address</span>
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street address, P.O. box, company name, c/o"
                      className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                      required
                    />
                  </label>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="px-3 py-2 rounded-md bg-white/5 border border-white/6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                    required
                  />
                  <input
                    value={postal}
                    onChange={(e) => setPostal(e.target.value)}
                    placeholder="Postal / ZIP"
                    className="px-3 py-2 rounded-md bg-white/5 border border-white/6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                    required
                  />
                  <input
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country"
                    className="px-3 py-2 rounded-md bg-white/5 border border-white/6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                    required
                  />
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone (optional)"
                    className="px-3 py-2 rounded-md bg-white/5 border border-white/6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={billingSame}
                      onChange={(e) => setBillingSame(e.target.checked)}
                      className="accent-white"
                    />
                    <span className="text-gray-300">
                      Billing same as shipping
                    </span>
                  </label>
                </div>
              </div>

              <div className="bg-[rgba(255,255,255,0.02)] ring-1 ring-white/6 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-3">Payment</h2>
                {/* <p className="text-sm text-gray-400 mb-4">This is a demo checkout. No real payment processed.</p> */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    placeholder="Cardholder name"
                    className="px-3 py-2 rounded-md bg-white/5 border border-white/6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                    required
                  />
                  <CardNumberInput
                    className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                    required
                    onChangeRaw={(digits) => {
                      // digits is the unformatted numeric string (e.g. "4242424242424242")
                      // you can save to state for submission:
                      // setCardNumberDigits(digits)
                    }}
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    placeholder="MM / YY"
                    className="px-3 py-2 rounded-md bg-white/5 border border-white/6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                    required
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, ""); // remove all non-digits

                      // MMYY logic
                      if (val.length >= 3) {
                        val = val.slice(0, 2) + "/" + val.slice(2, 4);
                      }

                      e.target.value = val;
                    }}
                  />

                  <input
                    placeholder="CVC"
                    className="px-3 py-2 rounded-md bg-white/5 border border-white/6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                    required
                  />
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={processing}
                    className="px-6 py-3 rounded-full bg-white text-black font-semibold shadow hover:shadow-lg transition active:scale-95"
                  >
                    {processing ? "Processing..." : "Pay now"}
                  </button>

                  <Link
                    href="/shop"
                    className="px-4 py-2 rounded-full border border-white/10 text-sm text-gray-300"
                  >
                    Continue shopping
                  </Link>
                </div>

                {error && (
                  <div className="mt-4 text-sm text-red-400">{error}</div>
                )}
                {success && (
                  <div className="mt-4 text-sm text-green-400">
                    Order placed — redirecting...
                  </div>
                )}
              </div>
            </section>

            <aside className="bg-[rgba(255,255,255,0.02)] ring-1 ring-white/6 rounded-2xl p-6 shadow-sm h-fit">
              <h3 className="text-lg font-semibold">Order summary</h3>

              <div className="mt-4 space-y-4">
                <div>
                  {resolved.map((r: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 py-2 border-b border-white/6 last:border-b-0"
                    >
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-800 flex items-center justify-center flex-shrink-0">
                        <img
                          src={r.img}
                          alt={r.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="text-sm font-medium">{r.title}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {r.qty} × {fmt(r.priceCents / 100)}
                        </div>
                      </div>

                      <div className="text-sm font-semibold">
                        {fmt((r.priceCents / 100) * r.qty)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/6 pt-3">
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>Subtotal</span>
                    <span>{fmt(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-300 mt-2">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0 ? "Free" : fmt(shippingCost)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-300 mt-2">
                    <span>Tax</span>
                    <span>{fmt(tax)}</span>
                  </div>

                  <div className="border-t border-white/6 my-3" />

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>{fmt(total)}</span>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-400">
                  Secure checkout. We do not store your card details in this
                  demo.
                </div>
              </div>
            </aside>
          </form>
        )}
      </div>
    </main>
  );
}
