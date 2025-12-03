// app/shop/page.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import FilterBar from "../../components/FilterBar";
import ProductCard from "../../components/ProductCard";
import PRODUCTS from "../../data/products";
import type { Product } from "../../types/product";

/**
 * Client-side shop page
 * - Debounced search (short)
 * - Category list derived from products
 * - Sort by price
 * - "Load more" pagination
 */

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<string>("none");
  const [perPage, setPerPage] = useState(12);

  // simple debounce for search input to avoid too many re-renders
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 220);
    return () => clearTimeout(t);
  }, [search]);

  // derive categories dynamically so you never hardcode them
  const categories = useMemo(() => {
    const set = new Set<string>();
    PRODUCTS.forEach((p: Product) => set.add(p.category || "uncategorized"));
    return ["all", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    const s = debouncedSearch.toLowerCase();
    const list = PRODUCTS.filter((p: Product) => {
      const matchesSearch =
        !s ||
        p.title.toLowerCase().includes(s) ||
        (p.description && p.description.toLowerCase().includes(s)) ||
        (p.tags && p.tags.join(" ").toLowerCase().includes(s));

      const matchesCategory = category === "all" || p.category === category;
      return matchesSearch && matchesCategory;
    });

    // stable sort by the first variant price
    list.sort((a: Product, b: Product) => {
      if (sort === "price-asc") {
        return (a.variants[0].priceCents || 0) - (b.variants[0].priceCents || 0);
      }
      if (sort === "price-desc") {
        return (b.variants[0].priceCents || 0) - (a.variants[0].priceCents || 0);
      }
      return 0;
    });

    return list;
  }, [debouncedSearch, category, sort]);

  const visible = useMemo(() => filtered.slice(0, perPage), [filtered, perPage]);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 mt-18">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Shop All Products</h1>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* reuse FilterBar but override categories prop by controlling category externally */}
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
            sort={sort}
            onSortChange={setSort}
          />
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg text-gray-600">No products found for your search.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {filtered.length > visible.length && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setPerPage((n) => n + 12)}
                className="px-6 py-3 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition"
              >
                Load more
              </button>
            </div>
          )}

          <div className="mt-6 text-sm text-gray-500">
            Showing {Math.min(visible.length, filtered.length)} of {filtered.length} results
          </div>
        </>
      )}
    </main>
  );
}
