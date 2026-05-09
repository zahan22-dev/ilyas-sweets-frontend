"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAdminCoupon, useUpdateCoupon } from "@/hooks/useCoupons";

export default function EditCouponPage() {
  const router = useRouter();
  const params = useParams();
  const couponId = parseInt(params.id as string);
  
  const { data: coupon, isLoading } = useAdminCoupon(couponId);
  const updateCoupon = useUpdateCoupon();
  
  const [formData, setFormData] = useState(coupon || {
    code: "",
    name: "",
    description: "",
    discountType: "FIXED" as "FIXED" | "PERCENTAGE",
    discountValue: 0,
    minPurchase: undefined as number | undefined,
    maxDiscount: undefined as number | undefined,
    usageLimit: undefined as number | undefined,
    active: true,
    startsAt: "",
    endsAt: "",
  });

  React.useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code,
        name: coupon.name || "",
        description: coupon.description || "",
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minPurchase: coupon.minPurchase,
        maxDiscount: coupon.maxDiscount,
        usageLimit: coupon.usageLimit,
        active: coupon.active,
        startsAt: coupon.startsAt ? new Date(coupon.startsAt).toISOString().slice(0, 16) : "",
        endsAt: coupon.endsAt ? new Date(coupon.endsAt).toISOString().slice(0, 16) : "",
      });
    }
  }, [coupon]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code.trim() || formData.discountValue <= 0) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await updateCoupon.mutateAsync({ 
        id: couponId,
        data: {
          ...formData,
          code: formData.code.trim().toUpperCase(),
        }
      });
      router.push("/admin/coupons");
    } catch (error: any) {
      alert(error.message || "Failed to update coupon");
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Coupon</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Code (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code</label>
          <input
            type="text"
            value={formData.code}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
          />
        </div>

        {/* Name & Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              placeholder="e.g. Welcome Offer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              placeholder="e.g. 10% off on first order"
            />
          </div>
        </div>

        {/* Discount Type & Value */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
            <select
              value={formData.discountType}
              onChange={(e) => setFormData({ ...formData, discountType: e.target.value as "FIXED" | "PERCENTAGE" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
            >
              <option value="FIXED">Fixed Amount</option>
              <option value="PERCENTAGE">Percentage</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Value {formData.discountType === "PERCENTAGE" && "(%)"} {formData.discountType === "FIXED" && "(Rs.)"}
            </label>
            <input
              type="number"
              value={formData.discountValue}
              onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              placeholder="0"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        {/* Min Purchase & Max Discount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min. Purchase (Rs.)</label>
            <input
              type="number"
              value={formData.minPurchase ?? ""}
              onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value ? parseFloat(e.target.value) : undefined })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              placeholder="Leave empty for no minimum"
              step="0.01"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max. Discount (Rs.)</label>
            <input
              type="number"
              value={formData.maxDiscount ?? ""}
              onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value ? parseFloat(e.target.value) : undefined })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              placeholder="Leave empty for no limit"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        {/* Usage Limit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Usage Limit</label>
          <input
            type="number"
            value={formData.usageLimit ?? ""}
            onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value ? parseInt(e.target.value) : undefined })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
            placeholder="Leave empty for unlimited usage"
            min="1"
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Starts At</label>
            <input
              type="datetime-local"
              value={formData.startsAt}
              onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expires At</label>
            <input
              type="datetime-local"
              value={formData.endsAt}
              onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        </div>

        {/* Active Status */}
        <div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-700">Active (visible to customers)</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={updateCoupon.isPending}
            className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium disabled:opacity-50"
          >
            {updateCoupon.isPending ? "Updating..." : "Update Coupon"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
