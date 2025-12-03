// lib/products.ts
import PRODUCTS from "../data/products";
import type { Product } from "../types/product";

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
