"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AdminAuthGuard from "@/components/AdminAuthGuard";
import { useLogout } from "@/hooks/useAuth";
import { useAdminNotifications, OrderNotification } from "@/hooks/useAdminNotifications";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const logout = useLogout();
  const { notifications, unreadCount, markAllRead, clearAll } =
    useAdminNotifications();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Products", href: "/admin/products", icon: "🍰" },
    { name: "Categories", href: "/admin/categories", icon: "📁" },
    { name: "Orders", href: "/admin/orders", icon: "📦" },
    { name: "Branches", href: "/admin/branches", icon: "🏪" },
    { name: "Coupons", href: "/admin/coupons", icon: "🎟️" },
    { name: "Hero Banners", href: "/admin/hero-banners", icon: "🎨" },
  ];

  // Close notification dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotifOpen = () => {
    setNotifOpen((prev) => !prev);
    if (!notifOpen) markAllRead();
  };

  const handleNotifClick = (n: OrderNotification) => {
    setNotifOpen(false);
    router.push("/admin/orders");
  };

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
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
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
        <div className="lg:pl-64 transition-all duration-300">
          {/* Top Bar */}
          <div className="sticky top-0 z-40 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                ☰
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                Admin Dashboard
              </h2>
            </div>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={handleNotifOpen}
                className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Notifications"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 text-sm">
                      Order Notifications
                    </h3>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAll}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-400 text-sm">
                        <div className="text-3xl mb-2">📭</div>
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => handleNotifClick(n)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-sm flex-shrink-0">
                              📦
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                New Order #{n.orderId}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {n.customerName} · Rs.{" "}
                                {Math.round(n.totalAmount).toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {n.fulfillmentType} · {n.itemCount} item
                                {n.itemCount !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  <div className="px-4 py-2 border-t border-gray-100">
                    <Link
                      href="/admin/orders"
                      onClick={() => setNotifOpen(false)}
                      className="block text-center text-xs font-bold text-yellow-600 hover:text-yellow-700 py-1"
                    >
                      View All Orders →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Page Content */}
          <main className="p-6">{children}</main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
