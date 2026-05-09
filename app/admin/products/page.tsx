"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useProducts, useDeleteProduct } from "@/hooks/useProducts";

export default function ProductsPage() {
  const { data: products, isLoading, isError, error } = useProducts();
  const deleteProduct = useDeleteProduct();
  const [searchTerm, setSearchTerm] = useState("");

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product");
    }
  }

  // Filter products based on search term
  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error: {error?.message}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
        >
          ➕ Add Product
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts?.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Product Image */}
            <div className="relative h-48 bg-gray-100">
              {product.images?.[0]?.imageUrl ? (
                <Image
                  src={product.images[0].imageUrl}
                  alt={product.name}
                  fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-600">{product.category?.name}</p>
                <p className="text-sm font-bold text-gray-700">Stock: {product.stock}</p>
              </div>
              
              {/* Variants */}
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Variants:</p>
                <div className="flex flex-wrap gap-1">
                  {product.variants?.map((variant: any) => (
                    <span
                      key={variant.id}
                      className="text-xs px-2 py-1 bg-gray-100 rounded"
                    >
                      {variant.label}: Rs. {variant.price}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-center"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={deleteProduct.isPending}
                  className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  {deleteProduct.isPending ? "..." : "🗑️ Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            {searchTerm ? `No products found matching "${searchTerm}"` : "No products found"}
          </p>
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm("")}
              className="inline-block px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors mr-4"
            >
              Clear Search
            </button>
          ) : null}
          <Link
            href="/admin/products/new"
            className="inline-block px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Add Your First Product
          </Link>
        </div>
      )}
    </div>
  );
}
