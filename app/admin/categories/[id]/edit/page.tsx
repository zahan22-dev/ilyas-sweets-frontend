"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useAdminCategory, useUpdateCategory } from "@/hooks/useCategories";
import { useUploadImage } from "@/hooks/useUpload";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = Number(params.id);

  const { data: category, isLoading: categoryLoading } = useAdminCategory(categoryId);
  const updateCategory = useUpdateCategory();
  const uploadImage = useUploadImage();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    sortOrder: 0,
    metaTitle: "",
    metaDescription: "",
    schema: "",
  });

  // Load category data when available
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        image: category.image || "",
        sortOrder: (category as any).sortOrder ?? 0,
        metaTitle: category.metaTitle || "",
        metaDescription: category.metaDescription || "",
        schema: category.schema ? JSON.stringify(category.schema, null, 2) : "",
      });
      if (category.image) setImagePreview(category.image);
    }
  }, [category]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    try {
      setUploadProgress(0);
      const result = await uploadImage.mutateAsync({
        file,
        onProgress: (progress) => setUploadProgress(progress),
      });
      setFormData({ ...formData, image: result.url });
      setImagePreview(result.url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter a category name");
      return;
    }

    try {
      let schemaData = null;
      if (formData.schema.trim()) {
        try {
          schemaData = JSON.parse(formData.schema);
        } catch {
          alert("Invalid JSON in schema field");
          return;
        }
      }

      await updateCategory.mutateAsync({
        id: categoryId,
        data: {
          name: formData.name,
          description: formData.description,
          image: formData.image,
          sortOrder: formData.sortOrder,
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
          schema: schemaData,
        },
      });
      router.push("/admin/categories");
    } catch (error) {
      console.error("Failed to update category:", error);
      alert("Failed to update category");
    }
  }

  if (categoryLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading category...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Category not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Category</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Category Image</label>
          <div className="flex flex-col md:flex-row items-start gap-4">
            {imagePreview ? (
              <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                <Image
                  src={imagePreview}
                  alt="Category preview"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-full md:w-48 h-48 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                <span className="text-gray-400 text-sm">No image selected</span>
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadImage.isPending}
                className="hidden"
                id="category-image-upload"
              />
              <label
                htmlFor="category-image-upload"
                className={`inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer ${
                  uploadImage.isPending ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {uploadImage.isPending ? "Uploading..." : "📷 Upload Image"}
              </label>
              <p className="text-xs text-gray-500 mt-2">Max size: 5MB. Formats: JPG, PNG, WebP</p>
              {uploadImage.isPending && (
                <div className="mt-4 w-full rounded-full bg-gray-200 h-2 overflow-hidden">
                  <div className="h-full bg-yellow-500 transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="e.g., Premium Sweets"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            rows={3}
            placeholder="Category description..."
          />
        </div>

        {/* Sort Order */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort Order
          </label>
          <input
            type="number"
            min="0"
            value={formData.sortOrder}
            onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
            className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Lower numbers appear first on homepage and shop (0 = top)
          </p>
        </div>

        <hr className="my-8" />
        <h2 className="text-xl font-bold text-gray-900 mb-4">SEO Details</h2>

        {/* Meta Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Title
          </label>
          <input
            type="text"
            value={formData.metaTitle}
            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="SEO Title"
          />
        </div>

        {/* Meta Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Description
          </label>
          <textarea
            value={formData.metaDescription}
            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent min-h-20"
            placeholder="SEO Meta Description..."
          />
        </div>

        {/* Schema JSON */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Schema JSON (LD-JSON)
          </label>
          <textarea
            value={formData.schema}
            onChange={(e) => setFormData({ ...formData, schema: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-mono text-sm min-h-30"
            placeholder='{"@context": "https://schema.org", "@type": "CollectionPage"}'
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={updateCategory.isPending || uploadImage.isPending}
            className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium disabled:opacity-50"
          >
            {updateCategory.isPending ? "Updating..." : "Update Category"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}