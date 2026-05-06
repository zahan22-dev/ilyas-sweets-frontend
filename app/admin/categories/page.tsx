"use client";

import Link from "next/link";
import Image from "next/image";
import { useCategories, useDeleteCategory } from "@/hooks/useCategories";

export default function CategoriesPage() {
  const { data: categories, isLoading, isError, error } = useCategories();
  const deleteCategory = useDeleteCategory();

  async function handleDelete(id: number) {
    if (!confirm("Are you sure? This will affect all products in this category.")) return;

    try {
      await deleteCategory.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Failed to delete category");
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading categories...</div>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
        <Link
          href="/admin/categories/new"
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
        >
          ➕ Add Category
        </Link>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories?.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Category Image */}
            <div className="relative h-40 bg-gray-100">
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-4xl">
                  📁
                </div>
              )}
            </div>

            {/* Category Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-600 mb-3">
                {category._count?.products || 0} products
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  href={`/admin/categories/${category.id}/edit`}
                  className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-center"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => handleDelete(category.id)}
                  disabled={deleteCategory.isPending}
                  className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  {deleteCategory.isPending ? "..." : "🗑️ Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No categories found</p>
          <Link
            href="/admin/categories/new"
            className="inline-block px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Add Your First Category
          </Link>
        </div>
      )}
    </div>
  );
}
