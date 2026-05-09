"use client";

import Link from "next/link";
import { useState } from "react";
import { useAdminCoupons, useDeleteCoupon } from "@/hooks/useCoupons";

export default function CouponsPage() {
  const { data: coupons, isLoading, error } = useAdminCoupons();
  const deleteCoupon = useDeleteCoupon();
  const [searchTerm, setSearchTerm] = useState("");

  async function handleDelete(id: number) {
    if (!confirm("Delete this coupon?")) return;
    try {
      await deleteCoupon.mutateAsync(id);
    } catch (error) {
      alert("Failed to delete coupon");
    }
  }

  const filteredCoupons = coupons?.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Coupons Management</h1>
        <Link
          href="/admin/coupons/new"
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
        >
          ➕ Create Coupon
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by code or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
          />
          <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Code</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Value</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Min Purchase</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Used/Limit</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">Loading...</td>
              </tr>
            ) : filteredCoupons?.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">No coupons found</td>
              </tr>
            ) : (
              filteredCoupons?.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-900">{coupon.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{coupon.discountType}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `Rs. ${coupon.discountValue}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {coupon.minPurchase ? `Rs. ${coupon.minPurchase}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {coupon.usageLimit ? `${coupon.usedCount}/${coupon.usageLimit}` : 'Unlimited'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      coupon.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {coupon.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <Link
                      href={`/admin/coupons/${coupon.id}/edit`}
                      className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      disabled={deleteCoupon.isPending}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 font-medium disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredCoupons?.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            {searchTerm ? `No coupons found matching "${searchTerm}"` : "No coupons created yet"}
          </p>
          <Link
            href="/admin/coupons/new"
            className="inline-block px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            Create Your First Coupon
          </Link>
        </div>
      )}
    </div>
  );
}
