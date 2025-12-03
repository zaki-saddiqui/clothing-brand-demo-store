// app/thank-you/page.tsx
import Link from "next/link";
import PRODUCTS from "../../data/products";

type Props = { searchParams?: { orderId?: string } };

export default function ThankYouPage({ searchParams }: Props) {
  const orderId = searchParams?.orderId;
  const recommended = (Array.isArray(PRODUCTS) ? PRODUCTS : [])
    .filter(Boolean)
    .sort((a: any, b: any) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-[rgba(255,255,255,0.02)] to-[rgba(255,255,255,0.01)] ring-1 ring-white/6 rounded-2xl p-10 text-center">
          <div className="mx-auto w-28 h-28 rounded-full bg-white/5 flex items-center justify-center mb-6">
            {/* SVG check with simple stroke animation using <animate> */}
            <svg className="w-14 h-14 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <circle cx="12" cy="12" r="10" stroke="currentColor" className="opacity-10" />
              <path
                d="M7 12.5l2.5 2.5L17 8"
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke="currentColor"
                strokeWidth="1.8"
                fill="none"
              >
                {/* animate stroke-dashoffset via SVG animate; works without client-side css */}
                <animate attributeName="stroke-dasharray" from="0 40" to="40 0" dur="420ms" fill="freeze" />
              </path>
            </svg>
          </div>

          <h1 className="text-3xl font-extrabold mb-2">Thanks — your order’s confirmed</h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            We received your order and sent a confirmation email. We’ll let you know when it ships.
          </p>

          {orderId ? (
            <div className="mt-4 text-sm text-gray-400">
              <span className="mr-2">Order ID:</span>
              <span className="inline-block px-3 py-1 rounded-md bg-white/5 font-mono text-xs">{orderId}</span>
            </div>
          ) : null}

          <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-black font-semibold shadow hover:shadow-lg transition active:scale-95"
            >
              Continue shopping
            </Link>

            <Link
              href="/orders"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-transparent border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition"
              aria-label="View your orders"
            >
              View your orders
            </Link>
          </div>

          <p className="mt-6 text-xs text-gray-500">Questions? Reply to your confirmation email or contact support.</p>
        </div>

        {/* Recommendations */}
        {recommended.length > 0 && (
          <section className="mt-12">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-2xl font-bold">You may also like</h2>
              <Link href="/shop" className="text-sm text-gray-500 hover:text-gray-300">View all</Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {recommended.map((p: any) => {
                const img =
                  p?.variants?.[0]?.images?.[0] ??
                  "/images/core-tee-1.png";
                const priceCents = p?.variants?.[0]?.priceCents ?? 0;
                const price = (priceCents / 100).toLocaleString(undefined, { style: "currency", currency: "USD" });
                return (
                  <article key={p.id} className="bg-[rgba(255,255,255,0.02)] ring-1 ring-white/6 rounded-xl p-3 text-left transition hover:scale-[1.02]">
                    <Link href={`/product/${p.slug}`} className="block">
                      <div className="w-full h-40 rounded-md overflow-hidden bg-gray-800 flex items-center justify-center mb-3">
                        <img src={img} alt={p.title} className="object-cover w-full h-full" />
                      </div>

                      <div className="text-sm font-medium text-white">{p.title}</div>
                      <div className="mt-1 text-xs text-gray-400">{price}</div>
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
