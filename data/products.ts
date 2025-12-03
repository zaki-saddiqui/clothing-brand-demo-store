// data/products.ts
import type { Product } from "../types/product";

const PRODUCTS: Product[] = [
  {
    id: "p1",
    slug: "core-tee",
    title: "Core Tee",
    description: "Premium cotton tee — everyday staple.",
    category: "tops",
    tags: ["basic", "core"],
    featured: true,
    rating: 4.8,
    variants: [
      {
        id: "p1-s-white",
        size: "S",
        color: "white",
        priceCents: 2500,
        inventory: 25,
        images: ["/images/core-tee-1.png", "/images/core-tee-2.png"]
      }
    ]
  },

  {
    id: "p2",
    slug: "heavy-hoodie",
    title: "Heavy Hoodie",
    description: "Thick fleece hoodie built to last.",
    category: "outerwear",
    tags: ["hoodie"],
    featured: true,
    rating: 4.9,
    variants: [
      {
        id: "p2-m-black",
        size: "M",
        color: "black",
        priceCents: 6500,
        inventory: 12,
        images: ["/images/heavy-hoodie-1.png", "/images/core-tee-1.png"]
      }
    ]
  },

  {
    id: "p3",
    slug: "relaxed-shirt",
    title: "Relaxed Shirt",
    description: "Boxy fit, soft washed cotton.",
    category: "tops",
    tags: ["shirt"],
    featured: true,
    rating: 4.6,
    variants: [
      {
        id: "p3-m-ivory",
        size: "M",
        color: "ivory",
        priceCents: 3800,
        inventory: 8,
        images: ["/images/core-tee-2.png"]
      }
    ]
  },

  {
    id: "p4",
    slug: "slim-jet-jeans",
    title: "Slim Jet Jeans",
    description: "Durable denim with a tailored slim fit.",
    category: "bottoms",
    tags: ["jeans"],
    featured: false,
    rating: 4.5,
    variants: [
      {
        id: "p4-32-black",
        size: "32",
        color: "black",
        priceCents: 7200,
        inventory: 6,
        images: ["/images/core-tee-1.png"]
      }
    ]
  },

  {
    id: "p5",
    slug: "stitch-sweater",
    title: "Stitch Sweater",
    description: "Ribbed cuffs and a relaxed silhouette.",
    category: "knitwear",
    tags: ["sweater"],
    featured: true,
    rating: 4.7,
    variants: [
      {
        id: "p5-m-oxford",
        size: "M",
        color: "oxford",
        priceCents: 5800,
        inventory: 4,
        images: ["/images/core-tee-2.png"]
      }
    ]
  },

  {
    id: "p6",
    slug: "runner-shorts",
    title: "Runner Shorts",
    description: "Lightweight shorts with hidden pocket.",
    category: "bottoms",
    tags: ["shorts"],
    featured: false,
    rating: 4.3,
    variants: [
      {
        id: "p6-m-charcoal",
        size: "M",
        color: "charcoal",
        priceCents: 3200,
        inventory: 18,
        images: ["/images/core-tee-1.png"]
      }
    ]
  },

  {
    id: "p7",
    slug: "utility-jacket",
    title: "Utility Jacket",
    description: "Weather-ready with clean minimal lines.",
    category: "outerwear",
    tags: ["jacket"],
    featured: true,
    rating: 4.9,
    variants: [
      {
        id: "p7-m-khaki",
        size: "M",
        color: "khaki",
        priceCents: 9800,
        inventory: 3,
        images: ["/images/heavy-hoodie-1.png"]
      }
    ]
  },

  {
    id: "p8",
    slug: "sneaker-low",
    title: "Sneaker Low",
    description: "Minimal low-profile sneaker, everyday comfort.",
    category: "footwear",
    tags: ["sneakers"],
    featured: false,
    rating: 4.4,
    variants: [
      {
        id: "p8-9-white",
        size: "9",
        color: "white",
        priceCents: 8500,
        inventory: 10,
        images: ["/images/core-tee-1.png"]
      }
    ]
  },

  {
    id: "p9",
    slug: "cap-curve",
    title: "Cap Curve",
    description: "Structured cap with embroidered detail.",
    category: "accessories",
    tags: ["cap"],
    featured: true,
    rating: 4.2,
    variants: [
      {
        id: "p9-os-black",
        size: "OS",
        color: "black",
        priceCents: 1800,
        inventory: 30,
        images: ["/images/core-tee-2.png"]
      }
    ]
  },

  {
    id: "p10",
    slug: "performance-hoodie",
    title: "Performance Hoodie",
    description: "Tech fabric, quick-dry, performance stretch.",
    category: "active",
    tags: ["hoodie","performance"],
    featured: false,
    rating: 4.6,
    variants: [
      {
        id: "p10-l-navy",
        size: "L",
        color: "navy",
        priceCents: 7200,
        inventory: 14,
        images: ["/images/heavy-hoodie-1.png"]
      }
    ]
  }
];

export default PRODUCTS;
