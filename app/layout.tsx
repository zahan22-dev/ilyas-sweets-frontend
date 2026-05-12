import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Script from "next/script";
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
  description:
    "The finest premium sweets and savory snacks delivered fresh to your door. Experience authentic taste and quality.",
  themeColor: "#ffffff",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/android-chrome-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "manifest", url: "/site.webmanifest" },
      { rel: "shortcut icon", url: "/favicon.ico" },
      { rel: "icon", url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { rel: "icon", url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
      { rel: "msapplication-config", url: "/browserconfig.xml" },
    ],
  },
  manifest: "/site.webmanifest",
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
        
        {/* Microsoft Clarity */}
        <Script id="ms-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "wonyjb46in");
          `}
        </Script>

        <QueryProvider>
          <CartProvider>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <PublicLayout>{children}</PublicLayout>
          </CartProvider>
        </QueryProvider>
      </body>
    </html>
  );
}