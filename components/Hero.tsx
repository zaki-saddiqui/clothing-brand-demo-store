// components/Hero.tsx
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-16 sm:py-20 lg:py-28 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Text column */}
          <div className="order-2 md:order-1">
            <h1 className="hero-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Built to last.
              <span className="block text-gray-900">Worn every day.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-gray-700">
              Clean staples, honest pricing, and cloth that survives heavy rotation. No hype — just durable staples you’ll reach for.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {/* Primary CTA */}
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 rounded-full px-6 py-3 bg-black text-white font-semibold text-sm shadow-md transform transition will-change-transform hover:-translate-y-0.5 active:scale-95 focus:outline-none focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-black/30"
                aria-label="Shop the drop"
              >
                Shop the Drop
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              {/* Secondary CTA */}
              <Link
                href="#featured"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 border border-gray-200 text-sm text-gray-800 hover:bg-gray-50 transition"
                aria-label="See featured products"
              >
                See featured
              </Link>
            </div>

            <p className="mt-6 text-sm text-gray-500">Free shipping over $100 • 30-day returns</p>
          </div>

          {/* Image column */}
          <div className="order-1 md:order-2">
            <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-gray-50 soft-card relative">
              {/* subtle overlay for elegance */}
              <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-black/4"></div>

              <img
                src="/images/core-tee-1.png"
                alt="Core Tee — premium cotton tee laid flat on neutral backdrop"
                className="w-full h-full object-cover object-center"
                loading="eager"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
