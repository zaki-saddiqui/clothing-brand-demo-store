// app/product/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductClient from "../../../components/ProductClient";
import PRODUCTS from "../../../data/products";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // params may be a promise-like value — await it
  // (safe even if it's already a plain object)
  // @ts-ignore
  const pparams = await params;
  const slug = pparams.slug;
  const product = Array.isArray(PRODUCTS) ? PRODUCTS.find((x: any) => x.slug === slug) : undefined;
  return {
    title: product ? `${product.title} — YourBrand` : "Product",
    description: product?.description ?? "Product"
  };
}

export default async function ProductPage({ params }: Props) {
  // await params in case it's a promise-like object
  // @ts-ignore
  const pparams = await params;
  const slug = pparams.slug;

  if (!Array.isArray(PRODUCTS)) {
    return (
      <main className="min-h-screen bg-[#070707] text-white">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <h1 className="text-3xl font-bold mb-4">Developer error — products export invalid</h1>
          <p className="text-gray-300">Make sure <code>data/products.ts</code> exports an array as the default export.</p>
        </div>
      </main>
    );
  }

  const product = PRODUCTS.find((p: any) => p.slug === slug);

  if (!product) return notFound();

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* ProductClient is a client component and handles interactions */}
        {/* pass plain product object */}
        {/* @ts-ignore */}
        <ProductClient product={product} />
      </div>
    </main>
  );
}
