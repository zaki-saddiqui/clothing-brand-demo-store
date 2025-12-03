// components/FilterBar.tsx
"use client";

import React from "react";

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  sort: string;
  onSortChange: (v: string) => void;
  categories?: string[]; // optional list; if not provided the page can compute its own
};

export default function FilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  categories,
}: Props) {
  const defaultCategories = categories ?? ["all", "tops", "bottoms", "outerwear", "knitwear", "footwear", "accessories", "active"];

  return (
    <div className="w-full flex flex-col sm:flex-row sm:items-center gap-3">
      <label htmlFor="shop-search" className="sr-only">Search products</label>
      <input
        id="shop-search"
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search products..."
        className="flex-1 min-w-0 px-4 py-2 rounded-md border border-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-900 transition"
      />

      <select
        aria-label="Category"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="px-3 py-2 rounded-md border border-gray-900 bg-black focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-300"
      >
        {defaultCategories.map((c) => (
          <option key={c} value={c}>
            {c === "all" ? "All categories" : c.charAt(0).toUpperCase() + c.slice(1)}
          </option>
        ))}
      </select>

      <select
        aria-label="Sort by"
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-3 py-2 rounded-md border border-gray-200 bg-black focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-300"
      >
        <option value="none">Sort</option>
        <option value="price-asc">Price: Low → High</option>
        <option value="price-desc">Price: High → Low</option>
      </select>
    </div>
  );
}
