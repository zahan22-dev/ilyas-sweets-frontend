"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCreateHeroBanner } from "@/hooks/useHeroBanners";
import { uploadService } from "@/lib/services/upload";

export default function NewHeroBannerPage() {
  const router = useRouter();
  const { mutateAsync: createBanner } = useCreateHeroBanner();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleSubmit = async () => {
    if (!imageFile) {
      setError("Please select a banner image.");
      return;
    }
    setError(null);

    try {
      // Step 1 — upload image to Cloudinary, get back URL
      setUploading(true);
      const { url: imageUrl } = await uploadService.uploadImage(imageFile);
      setUploading(false);

      // Step 2 — save banner with the URL (no base64 in body)
      setSaving(true);
      await createBanner({ title: "", imageUrl, isActive, order: sortOrder });
      router.push("/admin/hero-banners");
    } catch (err: any) {
      setUploading(false);
      setSaving(false);
      setError(err?.message ?? "Something went wrong. Please try again.");
    }
  };

  const isLoading = uploading || saving;
  const buttonLabel = uploading
    ? "Uploading image…"
    : saving
    ? "Saving banner…"
    : "Create Banner";

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Hero Banner</h1>
        <button
          onClick={() => router.push("/admin/hero-banners")}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">

        {/* ── Image upload ──────────────────────────────────────────────── */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Banner Image <span className="text-red-500">*</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 hover:border-yellow-400 rounded-lg p-6 text-center text-gray-500 hover:text-yellow-600 transition-colors"
          >
            {imagePreview ? "Click to change image" : "Click to choose image"}
          </button>

          {imagePreview && (
            <div className="mt-3 relative w-full rounded-lg overflow-hidden border border-gray-200" style={{ aspectRatio: "1920/600" }}>
              <Image
                src={imagePreview}
                alt="Banner preview"
                fill
                className="object-cover"
              />
            </div>
          )}

          <p className="mt-2 text-xs text-gray-400">
            Recommended: 1920 × 600 px for desktop
          </p>
        </div>

        {/* ── Display order ─────────────────────────────────────────────── */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Display Order <span className="text-gray-400">(0 = first)</span>
          </label>
          <input
            type="number"
            min={0}
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* ── Active toggle ─────────────────────────────────────────────── */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 accent-yellow-500"
          />
          <span className="text-sm text-gray-700">
            Active (visible on homepage)
          </span>
        </label>

        {/* ── Error ────────────────────────────────────────────────────── */}
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        {/* ── Actions ──────────────────────────────────────────────────── */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed text-gray-900 font-semibold py-2.5 rounded-lg transition-colors"
          >
            {buttonLabel}
          </button>
          <button
            onClick={() => router.push("/admin/hero-banners")}
            disabled={isLoading}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}