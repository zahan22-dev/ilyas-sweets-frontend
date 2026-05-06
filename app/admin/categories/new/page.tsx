"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCreateCategory } from "@/hooks/useCategories";
import { useUploadImage } from "@/hooks/useUpload";

export default function NewCategoryPage() {
  const router = useRouter();
  const createCategory = useCreateCategory();
  const uploadImage = useUploadImage();
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
    schema: "",
  });

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
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

    if (!formData.name) {
      alert("Please enter a category name");
      return;
    }

    try {
      await createCategory.mutateAsync(formData);
      router.push("/admin/categories");
    } catch (error) {
      console.error("Failed to create category:", error);
      alert("Failed to create category");
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Category</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Category Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Image (Optional)
          </label>
          <div className="flex items-start gap-4">
            {imagePreview ? (
              <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                <Image src={imagePreview} alt="Preview" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
              </div>
            ) : (
              <div className="w-48 h-48 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                <span className="text-4xl">📁</span>
              </div>
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadImage.isPending}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className={`inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer ${
                  uploadImage.isPending ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {uploadImage.isPending ? "Uploading..." : "📷 Upload Image"}
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Max size: 5MB. Formats: JPG, PNG, WebP
              </p>
              {uploadImage.isPending && (
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-yellow-500 transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="e.g., Special Mix Sweets"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Slug will be auto-generated from the name
          </p>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent min-h-[100px]"
            placeholder="Category description..."
          />
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent min-h-[80px]"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-mono text-sm min-h-[120px]"
            placeholder='{"@context": "https://schema.org", "@type": "CollectionPage"}'
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={createCategory.isPending || uploadImage.isPending}
            className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium disabled:opacity-50"
          >
            {createCategory.isPending ? "Creating..." : "Create Category"}
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
