// // components/FeaturedProducts.tsx
// import ProductCard from "./ProductCard";
// import type { Product } from "../types/product";
// import Link from "next/link";

// export default function FeaturedProducts({ products }: { products: Product[] }) {
//   // Defensive: ensure products is an array
//   const arr = Array.isArray(products) ? products : [];
//   const featured = arr.filter((p) => p && p.featured);
//   const list = (featured.length ? featured : arr).slice(0, 8);

//   return (
//     <section id="featured" className="max-w-7xl mx-auto px-6 py-12">
//       <div className="flex items-baseline justify-between">
//         <h2 className="text-2xl font-bold">Featured</h2>
//         <Link href="/shop" className="text-sm text-gray-600 hover:text-gray-900">View all</Link>
//       </div>
//       <div className="mt-6">
//         {list.length === 0 ? (
//           <div className="text-sm text-gray-500 mt-4">No featured products to show. Fix suggestions:
//             <ul className="list-disc ml-6 mt-2 text-xs text-gray-600">
//               <li>Ensure <code>data/products.ts</code> exports products and is imported by <code>lib/products.ts</code>.</li>
//               <li>Ensure product objects include <code>slug</code>, <code>variants</code> and at least one <code>images</code> entry.</li>
//               <li>Restart dev server after edits.</li>
//             </ul>
//           </div>
//         ) : (
//           <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
//             {list.map((p) => (
//               <ProductCard key={p.id} product={p} />
//             ))}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }



// components/FeaturedProducts.tsx
import ProductCard from "./ProductCard";
import type { Product } from "../types/product";
import Link from "next/link";

export default function FeaturedProducts({ products }: { products: Product[] }) {
  // Defensive: ensure products is an array
  const arr = Array.isArray(products) ? products : [];
  const featured = arr.filter((p) => p && p.featured);
  const list = (featured.length ? featured : arr).slice(0, 8);

  return (
    <section id="featured" className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-baseline justify-between">
        <h2 className="text-2xl font-bold">Featured</h2>
        <Link href="/shop" className="text-sm text-gray-600 hover:text-gray-900">View all</Link>
      </div>

      <div className="mt-2 text-sm text-gray-500 max-w-xl">
        {/* short descriptive line — remove if you don't want it */}
      </div>

      <div className="mt-6">
        {list.length === 0 ? (
          <div className="text-sm text-gray-500 mt-4">No featured products to show. Fix suggestions:
            <ul className="list-disc ml-6 mt-2 text-xs text-gray-600">
              <li>Ensure <code>data/products.ts</code> exports products and is imported by <code>lib/products.ts</code>.</li>
              <li>Ensure product objects include <code>slug</code>, <code>variants</code> and at least one <code>images</code> entry.</li>
              <li>Restart dev server after edits.</li>
            </ul>
          </div>
        ) : (
          /* 
            IMPORTANT: grid-cols-1 at base forces single column on the smallest screens (mobile).
            Then we step up at sm/md/lg breakpoints.
          */
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
