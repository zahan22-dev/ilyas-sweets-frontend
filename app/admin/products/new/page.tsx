"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCategories } from "@/hooks/useCategories";
import { useCreateProduct } from "@/hooks/useProducts";
import { useUploadMultiple } from "@/hooks/useUpload";
import { compressImage, createInstantPreview, revokeInstantPreview, formatFileSize } from "@/lib/utils/imageCompression";

export default function NewProductPage() {
  const router = useRouter();
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const uploadMultiple = useUploadMultiple();
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    ingredients: "",
    categoryId: "",
    productType: "WEIGHT" as "WEIGHT" | "PIECES",
    allowCustomInput: false,
    basePrice: 0,
    metaTitle: "",
    metaDescription: "",
    schema: "",
    stock: 0,
    images: [] as { url: string; isFeatured: boolean }[],
    variants: [] as { label: string; price: number }[],
  });

  // Track uploading states for optimistic preview
  const [uploadingPreviews, setUploadingPreviews] = useState<{ id: string; preview: string; progress: number; file: File; isUploading: boolean }[]>([]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        console.warn("Skipped non-image file", file.name);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("Each image must be smaller than 10MB");
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Create INSTANT blob URL previews (no waiting for processing)
    const previews = validFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      preview: createInstantPreview(file),
      progress: 0,
      file,
      isUploading: true,
    }));
    setUploadingPreviews(prev => [...prev, ...previews]);

    // Process and upload with parallel batches
    try {
      // Compress all images first (faster than sequential)
      const compressedFiles = await Promise.all(
        previews.map(async (previewItem) => {
          const originalSize = previewItem.file.size;
          
          // Skip compression for small images
          if (originalSize < 500 * 1024) {
            return { id: previewItem.id, file: previewItem.file, originalSize };
          }
          
          const compressedBlob = await compressImage(previewItem.file, {
            maxWidth: 1600,
            maxHeight: 1600,
            quality: 0.80,
            maxSizeMB: 1.5,
          });
          
          const compressedFile = new File([compressedBlob], previewItem.file.name, {
            type: 'image/jpeg',
          });
          
          console.log(`Compressed ${previewItem.file.name}: ${formatFileSize(originalSize)} → ${formatFileSize(compressedFile.size)}`);
          
          return { id: previewItem.id, file: compressedFile, originalSize };
        })
      );

      // Upload with progress tracking using parallel batches
      const results = await uploadMultiple.mutateAsync({
        files: compressedFiles.map(cf => cf.file),
        options: {
          maxConcurrency: 3,
          onProgress: (fileName, progress) => {
            setUploadingPreviews(prev => 
              prev.map(p => p.file.name === fileName ? { ...p, progress } : p)
            );
          },
          onComplete: (fileName, result) => {
            console.log(`Uploaded ${fileName} in ${result.uploadTimeMs}ms`);
          },
        }
      });

      // Add successful uploads to form data
      const successfulUploads = results.filter(r => r.success);
      if (successfulUploads.length > 0) {
        const newImages = successfulUploads.map((item, index) => ({
          url: item.result!.url,
          isFeatured: formData.images.length === 0 && index === 0,
        }));

        setFormData({
          ...formData,
          images: [...formData.images, ...newImages],
        });
      }

      // Show error for failed uploads
      const failedUploads = results.filter(r => !r.success);
      if (failedUploads.length > 0) {
        alert(`Failed to upload ${failedUploads.length} image(s). Please try again.`);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image(s)");
    } finally {
      // Clean up blob URLs to free memory
      previews.forEach(p => revokeInstantPreview(p.preview));
      // Clear previews after a short delay
      setTimeout(() => setUploadingPreviews([]), 500);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.name || !formData.categoryId) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await createProduct.mutateAsync({
        ...formData,
        categoryId: parseInt(formData.categoryId),
        variants: formData.variants.filter(v => v.label && v.price > 0),
      });
      router.push("/admin/products");
    } catch (error) {
      console.error("Failed to create product:", error);
      alert("Failed to create product");
    }
  }

  function updateVariant(index: number, field: string, value: any) {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Product Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Image <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <div className="flex items-start gap-4 flex-wrap">
            {/* Optimistic Uploading Previews */}
            {uploadingPreviews.map((preview) => (
              <div key={preview.id} className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-yellow-300 bg-gray-50">
                <img src={preview.preview} alt="Uploading..." className="w-full h-full object-cover opacity-50" />
                {/* Progress Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
                  <div className="w-16 h-16 relative">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-300"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        className="text-yellow-500"
                        strokeDasharray={`${preview.progress}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium">
                      {preview.progress}%
                    </span>
                  </div>
                  <span className="text-white text-xs mt-1">Uploading...</span>
                </div>
              </div>
            ))}
            
            {formData.images.length > 0 ? (
              formData.images.map((img, idx) => (
                <div key={idx} className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200 group">
                  <Image src={img.url} alt={`Preview ${idx + 1}`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                  
                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = formData.images.filter((_, i) => i !== idx);
                      if (img.isFeatured && newImages.length > 0) newImages[0].isFeatured = true;
                      setFormData({ ...formData, images: newImages });
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs z-10"
                  >
                    ×
                  </button>

                  {/* Featured Toggle */}
                  <div className="absolute bottom-0 left-0 w-full bg-black/50 p-1 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <input
                      type="radio"
                      name="featuredImage"
                      checked={img.isFeatured}
                      onChange={() => {
                        const newImages = formData.images.map((imgItem, i) => ({
                          ...imgItem,
                          isFeatured: i === idx,
                        }));
                        setFormData({ ...formData, images: newImages });
                      }}
                      className="cursor-pointer"
                    />
                    <span className="text-[10px] text-white">Featured</span>
                  </div>
                  
                  {/* Featured Badge */}
                  {img.isFeatured && (
                    <div className="absolute top-1 left-1 bg-yellow-500 text-white text-[10px] px-2 py-0.5 rounded-full z-10">
                      ★ Featured
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                <span className="text-gray-400 text-sm">No image</span>
              </div>
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploadMultiple.isPending}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className={`inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer ${
                  uploadMultiple.isPending ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {uploadMultiple.isPending ? "Uploading..." : "📷 Upload Images"}
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Max: 10MB per image. Images auto-compressed to ~1-2MB for fast upload.
              </p>
              {uploadMultiple.isPending && (
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-yellow-500 transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="e.g., Kaju Qatli"
            required
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            required
          >
            <option value="">Select a category</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            rows={3}
            placeholder="Product description..."
          />
        </div>

        {/* Main Product Price - PROMINENT FIELD */}
        <div className="mb-4 bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Main Price (Rs.) *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-semibold text-lg">Rs</span>
            <input
              type="number"
              value={formData.basePrice || ''}
              onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
              className="w-full pl-14 pr-4 py-3 text-xl font-semibold border-2 border-yellow-400 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white"
              min="0"
              step="0.01"
              placeholder="0.00"
              required
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            <span className="font-semibold">This is the main product price.</span> Used for: product listing, fallback when no variants, and custom weight/quantity calculations.
            {formData.productType === 'WEIGHT' ? ' Example: Rs 1200 per kg' : ' Example: Rs 80 per piece'}
          </p>
        </div>

        {/* Stock */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Stock *
          </label>
          <input
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            min="0"
            required
          />
        </div>

        {/* Ingredients */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ingredients
          </label>
          <input
            type="text"
            value={formData.ingredients}
            onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="e.g., Cashews, Sugar, Ghee"
          />
        </div>

        {/* Product Type & Custom Pricing */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Type & Pricing</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Type *</label>
              <select
                value={formData.productType}
                onChange={(e) => setFormData({ ...formData, productType: e.target.value as "WEIGHT" | "PIECES" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="WEIGHT">Weight (e.g., kg, g)</option>
                <option value="PIECES">Pieces (e.g., slice, box)</option>
              </select>
            </div>
            
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                id="allowCustomInput"
                checked={formData.allowCustomInput}
                onChange={(e) => setFormData({ ...formData, allowCustomInput: e.target.checked })}
                className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
              />
              <label htmlFor="allowCustomInput" className="ml-2 block text-sm text-gray-900">
                Allow Custom Input (Dynamic Pricing)
              </label>
            </div>
          </div>

          {/* Base Price - Always Visible */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {formData.productType === 'WEIGHT' ? 'Base Price per KG (Rs.)' : 'Price per Piece (Rs.)'} *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rs</span>
              <input
                type="number"
                value={formData.basePrice || ''}
                onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                min="0"
                step="0.01"
                placeholder={formData.productType === 'WEIGHT' ? 'e.g., 1200' : 'e.g., 80'}
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formData.productType === 'WEIGHT' 
                ? 'Price per kilogram. Used as base for custom weight calculations.' 
                : 'Price per individual piece. Used as base for custom quantity calculations.'}
            </p>
          </div>
        </div>

        {/* Variants */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Product Variants</h3>
              <p className="text-sm text-gray-500">Optional: Add specific size/quantity options</p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({
                ...formData,
                variants: [...formData.variants, { label: "", price: 0 }]
              })}
              className="px-4 py-2 text-sm text-yellow-600 bg-yellow-100 hover:bg-yellow-200 rounded-lg font-medium transition-colors"
            >
              + Add Variant
            </button>
          </div>
          
          {formData.variants.length === 0 ? (
            <p className="text-sm text-gray-400 italic py-4 text-center">
              No variants added. Click "Add Variant" to create size options like 250g, 500g, 1kg.
            </p>
          ) : (
            <div className="space-y-3">
              {formData.variants.map((variant, index) => (
                <div key={index} className="flex gap-3 items-start bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">Label</label>
                    <input
                      type="text"
                      value={variant.label}
                      onChange={(e) => updateVariant(index, "label", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder={formData.productType === 'WEIGHT' ? 'e.g., 500g' : 'e.g., Box of 6'}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">Price (Rs.)</label>
                    <input
                      type="number"
                      value={variant.price || ''}
                      onChange={(e) => updateVariant(index, "price", parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      min="0"
                      placeholder="0"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newVariants = formData.variants.filter((_, i) => i !== index);
                      setFormData({ ...formData, variants: newVariants });
                    }}
                    className="mt-6 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete variant"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
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
            placeholder='{"@context": "https://schema.org", "@type": "Product"}'
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={createProduct.isPending || uploadMultiple.isPending}
            className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium disabled:opacity-50"
          >
            {createProduct.isPending ? "Creating..." : "Create Product"}
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
