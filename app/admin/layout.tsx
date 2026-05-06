"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminAuthGuard from "@/components/AdminAuthGuard";
import { useLogout } from "@/hooks/useAuth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const logout = useLogout();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Products", href: "/admin/products", icon: "🍰" },
    { name: "Categories", href: "/admin/categories", icon: "📁" },
    { name: "Orders", href: "/admin/orders", icon: "📦" },
    { name: "Branches", href: "/admin/branches", icon: "🏪" },
  ];

  // Don't show sidebar on login page
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <AdminAuthGuard>{children}</AdminAuthGuard>;
  }

  return (
    <AdminAuthGuard>
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Ilyas Sweets</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-yellow-50 text-yellow-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={logout}
            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`lg:pl-64 transition-all duration-300`}>
        {/* Top Bar */}
        <div className="sticky top-0 z-40 h-16 bg-white border-b border-gray-200 flex items-center px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
          >
            ☰
          </button>
          <h2 className="text-lg font-semibold text-gray-900">Admin Dashboard</h2>
        </div>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
    </AdminAuthGuard>
  );
}
