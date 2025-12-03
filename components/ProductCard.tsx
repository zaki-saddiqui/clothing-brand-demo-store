// // components/ProductCard.tsx
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import type { Product } from "../types/product";
// import { useCart } from "../context/CartContext";

// function Star({ filled }: { filled: boolean }) {
//   return (
//     <svg className={`h-4 w-4 ${filled ? "text-yellow-400" : "text-gray-300"}`} viewBox="0 0 20 20" fill={filled ? "currentColor" : "none"}>
//       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.196 3.674a1 1 0 00.95.69h3.862c.969 0 1.371 1.24.588 1.81l-3.124 2.27a1 1 0 00-.364 1.118l1.197 3.674c.3.921-.755 1.688-1.54 1.118l-3.124-2.27a1 1 0 00-1.176 0l-3.124 2.27c-.784.57-1.838-.197-1.539-1.118l1.197-3.674a1 1 0 00-.364-1.118L2.45 9.101c-.783-.57-.38-1.81.588-1.81h3.862a1 1 0 00.95-.69l1.199-3.674z" />
//     </svg>
//   );
// }

// const PLACEHOLDER_SVG = encodeURIComponent(`
//   <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'>
//     <rect width='100%' height='100%' fill='#f3f4f6'/>
//     <g fill='#d1d5db' font-family='Inter,Arial' font-size='28' font-weight='600'>
//       <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'>No image</text>
//     </g>
//   </svg>
// `);
// const PLACEHOLDER_DATA_URI = `data:image/svg+xml;utf8,${PLACEHOLDER_SVG}`;

// export default function ProductCard({ product }: { product: Product }) {
//   const variant = product.variants[0];
//   const price = (variant.priceCents / 100).toFixed(2);
//   const [hover, setHover] = useState(false);
//   const { add } = useCart();
//   const lowStock = variant.inventory <= 5;

//   function quickAdd(e: React.MouseEvent) {
//     e.preventDefault();
//     add({ productId: product.id, variantId: variant.id, qty: 1 });
//   }

//   function handleImgError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
//     const img = e.currentTarget;
//     if (!img.dataset.fallback) {
//       img.dataset.fallback = "1";
//       img.src = PLACEHOLDER_DATA_URI;
//     }
//   }

//   const imgSrc = (variant.images && variant.images[0]) || PLACEHOLDER_DATA_URI;

//   return (
//     <Link href={`/product/${product.slug}`} className="block group" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
//       <article className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
//         <div className="relative w-full h-56 bg-gray-50 overflow-hidden">
//           <img
//             src={imgSrc}
//             alt={product.title}
//             onError={handleImgError}
//             className={`w-full h-full object-cover transition-all duration-500 ${hover ? "scale-105" : "scale-100"}`}
//             draggable={false}
//             loading="lazy"
//           />
//           {lowStock && <div className="absolute top-3 left-3 bg-white/90 text-sm text-red-600 px-2 py-1 rounded-full font-semibold ring-1 ring-red-100">Low stock</div>}
//         </div>

//         <div className="p-4">
//           <h3 className="text-sm font-semibold text-gray-900">{product.title}</h3>
//           <p className="mt-1 text-xs text-gray-500 line-clamp-2">{product.description}</p>

//           <div className="mt-3 flex items-center justify-between">
//             <div className="flex items-center gap-1">
//               <div className="flex">
//                 {Array.from({ length: 5 }).map((_, i) => <Star key={i} filled={i < Math.round(product.rating || 0)} />)}
//               </div>
//               <span className="text-xs text-gray-500 ml-1">{product.rating?.toFixed(1)}</span>
//             </div>

//             <span className="text-sm font-bold text-gray-900">${price}</span>
//           </div>

//           <button onClick={quickAdd} className="mt-3 w-full rounded-full bg-black text-white text-sm font-medium py-2 flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 active:scale-95">
//             Add to Cart
//             <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 3h2l.4 2M7 13h10l3-8H6.4" /></svg>
//           </button>
//         </div>
//       </article>
//     </Link>
//   );
// }



// components/ProductCard.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "../types/product";
import { useCart } from "../context/CartContext";

function Star({ filled }: { filled: boolean }) {
  return (
    <svg className={`h-4 w-4 ${filled ? "text-yellow-400" : "text-gray-300"}`} viewBox="0 0 20 20" fill={filled ? "currentColor" : "none"}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.196 3.674a1 1 0 00.95.69h3.862c.969 0 1.371 1.24.588 1.81l-3.124 2.27a1 1 0 00-.364 1.118l1.197 3.674c.3.921-.755 1.688-1.54 1.118l-3.124-2.27a1 1 0 00-1.176 0l-3.124 2.27c-.784.57-1.838-.197-1.539-1.118l1.197-3.674a1 1 0 00-.364-1.118L2.45 9.101c-.783-.57-.38-1.81.588-1.81h3.862a1 1 0 00.95-.69l1.199-3.674z" />
    </svg>
  );
}

const PLACEHOLDER_SVG = encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'>
    <rect width='100%' height='100%' fill='#f3f4f6'/>
    <g fill='#d1d5db' font-family='Inter,Arial' font-size='28' font-weight='600'>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'>No image</text>
    </g>
  </svg>
`);
const PLACEHOLDER_DATA_URI = `data:image/svg+xml;utf8,${PLACEHOLDER_SVG}`;

export default function ProductCard({ product }: { product: Product }) {
  const variant = product.variants[0];
  const price = ((variant?.priceCents ?? 0) / 100).toFixed(2);
  const [hover, setHover] = useState(false);

  // SAFE cart access — do not destructure directly from possibly-undefined context
  const cart = useCart();
  const add = cart?.add;

  const lowStock = (variant?.inventory ?? 0) <= 5;

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();

    if (!add) {
      // defensive: warn in dev if cart provider missing
      console.warn("Cart provider missing — cannot quick-add.");
      return;
    }

    const payload = {
      productId: product.id,
      productSlug: product.slug,
      title: product.title,
      variantId: variant?.id,
      variantTitle:
        // safe fallbacks — variant types may not have 'title'
        // @ts-ignore runtime fallback
        (variant && (variant.title ?? (variant as any).name ?? (variant as any).color)) ?? undefined,
      priceCents: variant?.priceCents ?? 0,
      qty: 1,
      image: (variant?.images && variant.images[0]) ?? "/images/core-tee-1.png",
      variant,
    };

    add(payload as any);
  }

  function handleImgError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    const img = e.currentTarget;
    if (!img.dataset.fallback) {
      img.dataset.fallback = "1";
      img.src = PLACEHOLDER_DATA_URI;
    }
  }

  const imgSrc = (variant?.images && variant.images[0]) || PLACEHOLDER_DATA_URI;

  return (
    <Link href={`/product/${product.slug}`} className="block group" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <article className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative w-full h-56 bg-gray-50 overflow-hidden">
          <img
            src={imgSrc}
            alt={product.title}
            onError={handleImgError}
            className={`w-full h-full object-cover transition-all duration-500 ${hover ? "scale-105" : "scale-100"}`}
            draggable={false}
            loading="lazy"
          />
          {lowStock && <div className="absolute top-3 left-3 bg-white/90 text-sm text-red-600 px-2 py-1 rounded-full font-semibold ring-1 ring-red-100">Low stock</div>}
        </div>

        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900">{product.title}</h3>
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">{product.description}</p>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} filled={i < Math.round(product.rating || 0)} />)}
              </div>
              <span className="text-xs text-gray-500 ml-1">{product.rating?.toFixed(1)}</span>
            </div>

            <span className="text-sm font-bold text-gray-900">${price}</span>
          </div>

          <button onClick={quickAdd} className="mt-3 w-full rounded-full bg-black text-white text-sm font-medium py-2 flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 active:scale-95">
            Add to Cart
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 3h2l.4 2M7 13h10l3-8H6.4" /></svg>
          </button>
        </div>
      </article>
    </Link>
  );
}
