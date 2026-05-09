"use client";

import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useAdminOrders } from "@/hooks/useOrders";
import { useCoupons }  from "@/hooks/useCoupons";
import { useHeroBanners } from "@/hooks/useHeroBanners";

export default function AdminDashboard() {
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: orders, isLoading: ordersLoading } = useAdminOrders();
  const { data: coupons, isLoading: couponsLoading } = useCoupons();
  const { data: banners, isLoading: bannersLoading } = useHeroBanners();

  const loading =
    productsLoading ||
    categoriesLoading ||
    ordersLoading ||
    couponsLoading ||
    bannersLoading;

  const stats = {
    products: products?.length || 0,
    categories: categories?.length || 0,
    orders: orders?.length || 0,
    pendingOrders: orders?.filter((o) => o.status === "PENDING").length || 0,
    activeCoupons: coupons?.filter((c: any) => c.isActive).length || 0,
    activeBanners: banners?.filter((b: any) => b.isActive).length || 0,
  };

  const statCards = [
    {
      label: "Total Products",
      value: stats.products,
      icon: "🍰",
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Categories",
      value: stats.categories,
      icon: "📁",
      color: "bg-green-50 text-green-700",
    },
    {
      label: "Total Orders",
      value: stats.orders,
      icon: "📦",
      color: "bg-purple-50 text-purple-700",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      icon: "⏳",
      color: "bg-yellow-50 text-yellow-700",
    },
    {
      label: "Active Coupons",
      value: stats.activeCoupons,
      icon: "🎟️",
      color: "bg-pink-50 text-pink-700",
    },
    {
      label: "Active Banners",
      value: stats.activeBanners,
      icon: "🎨",
      color: "bg-orange-50 text-orange-700",
    },
  ];

  const quickActions = [
    {
      href: "/admin/products/new",
      icon: "➕",
      title: "Add New Product",
      description: "Create a new product with variants",
    },
    {
      href: "/admin/categories/new",
      icon: "📁",
      title: "Add Category",
      description: "Create a new product category",
    },
    {
      href: "/admin/orders",
      icon: "📦",
      title: "Manage Orders",
      description: "View and update order status",
    },
    {
      href: "/admin/coupons",
      icon: "🎟️",
      title: "Manage Coupons",
      description: "Create and manage discount coupons",
    },
    {
      href: "/admin/hero-banners",
      icon: "🎨",
      title: "Hero Banners",
      description: "Manage homepage hero banners",
    },
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Dashboard Overview
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div
                className={`w-11 h-11 rounded-lg ${stat.color} flex items-center justify-center text-xl`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickActions.map((action) => (
            <a
              key={action.href}
              href={action.href}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="text-3xl mb-2">{action.icon}</div>
              <h3 className="font-semibold text-gray-900 group-hover:text-yellow-600">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{action.description}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}