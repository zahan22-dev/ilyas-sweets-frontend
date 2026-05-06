"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/lib/services/auth";

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  // Login page shows immediately; protected pages wait for auth check
  const [checked, setChecked] = useState(isLoginPage);

  useEffect(() => {
    // Ensure axios always has the token from localStorage
    authService.initializeAuth();

    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated && !isLoginPage) {
      // Not authenticated on a protected page → go to login
      router.push("/admin/login");
    } else if (isAuthenticated && isLoginPage) {
      // Already authenticated on login page → go to dashboard
      router.push("/admin");
    } else {
      setChecked(true);
    }
  }, [pathname, router, isLoginPage]);

  // Block render until auth is verified (prevents protected-page content flash)
  if (!checked) return null;

  return <>{children}</>;
}
