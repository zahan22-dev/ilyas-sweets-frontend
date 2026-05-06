import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { CartProvider } from "@/providers/CartProvider";
import PublicLayout from "@/components/layout/PublicLayout";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Ilyas Sweets | Premium Authentic Sweets & Snacks",
  description: "The finest premium sweets and savory snacks delivered fresh to your door. Experience authentic taste and quality.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <CartProvider>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <PublicLayout>
              {children}
            </PublicLayout>
          </CartProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

