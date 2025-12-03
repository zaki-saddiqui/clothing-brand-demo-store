// app/about/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#070707]">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* HERO */}
        <section className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            About Our Brand
          </h1>

          {/* streaming subhead */}
          <div className="mt-4">
            <div className="relative inline-block overflow-hidden">
              <p className="streaming text-sm sm:text-base md:text-lg font-medium text-gray-300/90">
                Built to last. Designed for real life. Everyday essentials with
                uncompromising quality.
              </p>
              {/* subtle shine */}
              <div className="absolute inset-0 pointer-events-none bg-linear-to-r from-transparent via-white/7 to-transparent mix-blend-screen opacity-0 animate-shimmer"></div>
            </div>
          </div>

          <p className="mt-6 text-base sm:text-lg text-gray-400 max-w-3xl mx-auto">
            We create essential clothing with craftsmanship and restraint. No
            loud logos, no seasonal hysteria — just pieces you rely on.
          </p>

          <div className="mt-10">
            <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/core-tee-1.png"
                alt="Brand hero"
                fill
                className="object-cover object-center transform transition-transform duration-900 ease-out hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent rounded-2xl pointer-events-none"></div>
            </div>
          </div>
        </section>

        {/* STORY + CARDS */}
        <section className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Our Story</h2>

            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p className="stream-slow">
                We started with a simple belief: essentials should last. Our
                mission is to craft timeless pieces that combine durability,
                comfort, and clean design. No loud branding — only considered
                details and materials that stand up to everyday use.
              </p>

              <p className="stream-slow">
                Fabrics are stress-tested; patterns are refined over dozens of
                iterations. We build pieces like tools — reliable, simple, and
                ready to be worn.
              </p>
            </div>

            <div className="mt-8">
              <Link
                href="/shop"
                className="inline-block px-6 py-3 rounded-full bg-white text-black font-semibold shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
              >
                Explore the Collection
              </Link>
            </div>
          </div>

          {/* Feature cards — dark glass style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: "Premium Fabrics",
                body: "Every garment starts with carefully sourced cotton blends designed for lasting comfort.",
              },
              {
                title: "Modern Minimalism",
                body: "Clean silhouettes, muted tones, and timeless design — nothing extra.",
              },
              {
                title: "Built to Last",
                body: "Tested for durability and shape-retention. These pieces work as hard as you do.",
              },
              {
                title: "Transparent Pricing",
                body: "Honest costs without middlemen — quality shouldn’t be priced by hype.",
              },
            ].map((c, i) => (
              <article
                key={c.title}
                className="relative bg-[rgba(255,255,255,0.02)] ring-1 ring-white/4 rounded-2xl p-6 backdrop-blur-sm shadow-sm hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <h3 className="text-lg font-semibold text-gray-50 mb-2">
                  {c.title}
                </h3>
                <p className="text-gray-300 text-sm">{c.body}</p>

                {/* subtle floating dot accent */}
                <span className="absolute -left-3 top-6 h-3 w-3 bg-linear-to-br from-indigo-400 to-rose-400 rounded-full opacity-90" />
              </article>
            ))}
          </div>
        </section>

        {/* CTA BANNER WITH SIGNUP */}
        <section className="mt-20 py-14 px-6 rounded-xl bg-linear-to-r from-white/3 to-white/2 ring-1 ring-white/10 backdrop-blur-md">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-white">
              We make garments you can count on
            </h3>
            <p className="mt-3 text-gray-300">
              Get early access to restocks, drops, and private offers.
            </p>

            {/* Signup form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Subscribed — Your email has been added! (client-only)");
              }}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full sm:w-80 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 transition"
              />

              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-white text-black font-semibold shadow-md hover:shadow-lg hover:bg-gray-200 transition active:scale-95"
              >
                Join Now
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
