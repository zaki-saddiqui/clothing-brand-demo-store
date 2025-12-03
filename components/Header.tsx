// // components/Header.tsx
// "use client";
// import Link from "next/link";
// import { useState } from "react";
// import { useCart } from "../context/CartContext";

// export default function Header() {
//   const { items } = useCart();
//   const totalCount = items.reduce((s, i) => s + i.qty, 0);
//   const [open, setOpen] = useState(false);

//   return (
//     <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6">
//         <div className="flex items-center justify-between h-16">
//           <div className="flex items-center gap-6">
//             <Link href="/" className="text-lg font-extrabold">
//               {/* Replace with SVG or image logo if you want */}
//               <span className="inline-block px-2 py-1 rounded bg-black text-white">N</span>
//               <span className="ml-2">Your Brand</span>
//             </Link>

//             <nav className="hidden md:flex items-center gap-4">
//               <Link href="/shop" className="text-sm font-medium text-gray-700 hover:text-black">Shop</Link>
//               <Link href="/about" className="text-sm text-gray-600 hover:text-black">About</Link>
//             </nav>
//           </div>

//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setOpen(!open)}
//               className="relative inline-flex items-center px-3 py-2 border rounded text-sm hover:bg-gray-50"
//               aria-label="Open cart"
//             >
//               {/* simple cart icon */}
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
//                 <path d="M3 3h2l.4 2M7 13h10l3-8H6.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
//                 <circle cx="10" cy="20" r="1" fill="currentColor"></circle>
//                 <circle cx="18" cy="20" r="1" fill="currentColor"></circle>
//               </svg>

//               {totalCount > 0 && (
//                 <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-black rounded-full">
//                   {totalCount}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Minimal cart drawer placeholder (toggle only) */}
//       {open && (
//         <div className="w-full bg-white border-t p-4">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6">
//             <div className="flex items-center justify-between">
//               <div className="text-sm font-medium">Cart ({totalCount})</div>
//               <button onClick={()=>setOpen(false)} className="text-sm text-gray-600">Close</button>
//             </div>
//             <div className="mt-4 text-sm text-gray-600">
//               Cart drawer placeholder — we’ll wire product rows, totals, and checkout next.
//             </div>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }


// components/Header.tsx
"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function Header() {
  // safe cart access — do not destructure directly from possibly-undefined context
  const cart = useCart();
  const items = cart?.items ?? [];
  const totalCount = items.reduce((s, i) => s + (i.qty ?? i.quantity ?? 0), 0);

  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-lg font-extrabold">
              {/* Replace with SVG or image logo if you want */}
              <span className="inline-block px-2 py-1 rounded bg-black text-white">N</span>
              <span className="ml-2">Your Brand</span>
            </Link>

            <nav className="hidden md:flex items-center gap-4">
              <Link href="/shop" className="text-sm font-medium text-gray-700 hover:text-black">Shop</Link>
              <Link href="/about" className="text-sm text-gray-600 hover:text-black">About</Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(!open)}
              className="relative inline-flex items-center px-3 py-2 border rounded text-sm hover:bg-gray-50"
              aria-label="Open cart"
            >
              {/* simple cart icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M3 3h2l.4 2M7 13h10l3-8H6.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <circle cx="10" cy="20" r="1" fill="currentColor"></circle>
                <circle cx="18" cy="20" r="1" fill="currentColor"></circle>
              </svg>

              {totalCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-black rounded-full">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Minimal cart drawer placeholder (toggle only) */}
      {open && (
        <div className="w-full bg-white border-t p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Cart ({totalCount})</div>
              <button onClick={()=>setOpen(false)} className="text-sm text-gray-600">Close</button>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Cart drawer placeholder — we’ll wire product rows, totals, and checkout next.
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
