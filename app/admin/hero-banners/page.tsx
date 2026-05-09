"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAdminHeroBanners, useDeleteHeroBanner, useUpdateHeroBanner } from "@/hooks/useHeroBanners";

export default function HeroBannersPage() {
  const router = useRouter();
  const { data: banners, isLoading } = useAdminHeroBanners();
  const { mutateAsync: deleteBanner } = useDeleteHeroBanner();
  const { mutateAsync: updateBanner } = useUpdateHeroBanner();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this banner?")) return;
    setDeletingId(id);
    try {
      await deleteBanner(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (id: number, current: boolean) => {
    await updateBanner({ id, data: { isActive: !current } });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading…
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hero Banners</h1>
        <button
          onClick={() => router.push("/admin/hero-banners/new")}
          className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + Add Banner
        </button>
      </div>

      {!banners?.length ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🎨</p>
          <p className="text-lg font-medium">No banners yet</p>
          <p className="text-sm mt-1">Add your first banner to show on the homepage.</p>
          <button
            onClick={() => router.push("/admin/hero-banners/new")}
            className="mt-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold px-5 py-2 rounded-lg"
          >
            Add Banner
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {banners.map((banner: any) => (
            <div
              key={banner.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 p-4"
            >
              {/* Image thumbnail */}
              <div
                className="relative flex-shrink-0 rounded-lg overflow-hidden bg-gray-100"
                style={{ width: 180, height: 56 }}
              >
                {banner.imageUrl ? (
                  <Image
                    src={banner.imageUrl}
                    alt="Banner"
                    fill
                    className="object-cover"
                    sizes="180px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No image
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500">Order: {banner.order ?? 0}</p>
                <span
                  className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${
                    banner.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {banner.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleToggleActive(banner.id, banner.isActive)}
                  className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {banner.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  disabled={deletingId === banner.id}
                  className="text-xs px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  {deletingId === banner.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}