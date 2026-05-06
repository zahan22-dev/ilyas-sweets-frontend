import { categoriesService, Category } from "@/lib/services/categories";
import ShopProducts from "@/components/product/ShopProducts";

export const metadata = {
  title: "Shop Premium Sweets | Ilyas Sweets",
  description: "Explore our complete collection of premium sweets, savory snacks, and traditional desserts.",
};

export default async function ShopPage() {
  let categories: Category[] = [];

  try {
    categories = await categoriesService.getAll();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    // Return empty array on error - will show empty state
  }

  return (
    <main className="bg-[#FEFFFF] min-h-screen">
      {/* Shop Header */}
      <section className="bg-[#111111] py-16 md:py-20 px-6 lg:px-12 rounded-b-[3rem] relative overflow-hidden mb-12 z-10">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="container mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-black font-heading text-white tracking-tighter leading-[0.9] uppercase mb-4">
            Our <span className="text-[#FFC702]">Shop</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 font-bold max-w-2xl mx-auto">
            Discover our handcrafted collection of premium sweets and savory delights
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 lg:px-12">
        <ShopProducts categories={categories} />
      </div>
    </main>
  );
}
