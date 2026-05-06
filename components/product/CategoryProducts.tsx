"use client";

import ProductCard from "./ProductCard";

interface Product {
  id: number;
  name: string;
  slug: string;
  basePrice?: number;
  stock: number;
  images: { imageUrl: string; isFeatured?: boolean }[];
  variants?: { id: number; label: string; price: number }[];
  category?: { name: string };
}

interface CategoryProductsProps {
  products: Product[];
}

export default function CategoryProducts({ products }: CategoryProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
