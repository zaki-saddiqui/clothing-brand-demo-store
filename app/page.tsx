// app/page.tsx
import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import SocialProof from "../components/SocialProof";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer"
import { getAllProducts } from "../lib/products";

export default function HomePage() {
  const products = getAllProducts();

  return (
    <main>
      <Hero />

      {/* Featured products */}
      <FeaturedProducts products={products.length ? products : []} />

      {/* Social proof */}
      <SocialProof />

      {/* Newsletter CTA */}
      <Newsletter />

      {/* Minimal footer */}
      {/* <Footer /> */}
    </main>
  );
}
