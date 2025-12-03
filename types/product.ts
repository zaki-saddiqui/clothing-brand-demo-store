// types/product.ts
export type Variant = {
  id: string;
  size?: string;
  color?: string;
  priceCents: number;
  inventory: number;
  images: string[];
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  tags?: string[];
  variants: Variant[];
  featured?: boolean;
  rating?: number;
};
