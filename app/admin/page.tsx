"use client";

import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useAdminOrders } from "@/hooks/useOrders";

export default function AdminDashboard() {
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: orders, isLoading: ordersLoading } = useAdminOrders();

  const loading = productsLoading || categoriesLoading || ordersLoading;

  const stats = {
    products: products?.length || 0,
    categories: categories?.length || 0,
    orders: orders?.length || 0,
    pendingOrders: orders?.filter((o) => o.status === "PENDING").length || 0,
  };

  const statCards = [
    { label: "Total Products", value: stats.products, icon: "🍰", color: "bg-blue-50 text-blue-700" },
    { label: "Categories", value: stats.categories, icon: "📁", color: "bg-green-50 text-green-700" },
    { label: "Total Orders", value: stats.orders, icon: "📦", color: "bg-purple-50 text-purple-700" },
    { label: "Pending Orders", value: stats.pendingOrders, icon: "⏳", color: "bg-yellow-50 text-yellow-700" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/products/new"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="text-3xl mb-2">➕</div>
            <h3 className="font-semibold text-gray-900 group-hover:text-yellow-600">Add New Product</h3>
            <p className="text-sm text-gray-600 mt-1">Create a new product with variants</p>
          </a>
          <a
            href="/admin/categories/new"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="text-3xl mb-2">📁</div>
            <h3 className="font-semibold text-gray-900 group-hover:text-yellow-600">Add Category</h3>
            <p className="text-sm text-gray-600 mt-1">Create a new product category</p>
          </a>
          <a
            href="/admin/orders"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="text-3xl mb-2">📦</div>
            <h3 className="font-semibold text-gray-900 group-hover:text-yellow-600">Manage Orders</h3>
            <p className="text-sm text-gray-600 mt-1">View and update order status</p>
          </a>
        </div>
      </div>
    </div>
  );
}
