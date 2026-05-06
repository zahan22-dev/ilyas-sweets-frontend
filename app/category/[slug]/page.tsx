import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { categoriesService } from "@/lib/services/categories";
import CategoryProducts from "@/components/product/CategoryProducts";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await categoriesService.getBySlug(slug);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    return {
      title: category.metaTitle || category.name,
      description: category.metaDescription || category.description,
      alternates: {
        canonical: `${siteUrl}/category/${slug}`
      },
      openGraph: {
        title: category.metaTitle || category.name,
        description: category.metaDescription || category.description,
        images: category.image ? [category.image] : [],
      },
    };
  } catch {
    return { title: "Category" };
  }
}

export default async function CategoryDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let category;
  try {
    category = await categoriesService.getBySlug(slug);
  } catch (error) {
    return (
      <main className="bg-[#FEFFFF] min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-black font-heading text-[#111111] mb-6 uppercase tracking-tighter">Category <span className="text-[#FFC702]">Not Found</span></h1>
          <p className="text-2xl text-gray-500 font-bold mb-10">We couldn't find the category you're looking for.</p>
          <Link href="/shop" className="px-12 py-5 bg-linear-to-r from-[#FFC702] to-[#701515] text-white font-black rounded-full uppercase tracking-widest hover:scale-105 transition-transform inline-block shadow-lg">
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      {category.schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(category.schema) }}
        />
      )}
    <main className="bg-[#FEFFFF] min-h-screen">
      {/* Category Header */}
      <section className="bg-[#111111] py-20 px-6 lg:px-12 rounded-b-[4rem] relative overflow-hidden mb-20 z-10">
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
        {category.image && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] z-0 opacity-40">
             <Image src={category.image} alt={category.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover blur-[80px]" />
          </div>
        )}
        <div className="container mx-auto relative z-10 text-center">
          <h1 className="text-6xl md:text-8xl lg:text-[7.5rem] font-black font-heading text-white tracking-tighter leading-[0.9] uppercase mb-6">
            {category.name}
          </h1>
          <p className="text-xl md:text-2xl text-[#FFC702] font-bold max-w-2xl mx-auto uppercase tracking-widest">
            {category.products?.length || 0} Premium {category.products?.length === 1 ? 'Item' : 'Items'}
          </p>
          {category.description && (
            <p className="text-lg text-white/80 mt-6 max-w-3xl mx-auto">
              {category.description}
            </p>
          )}
        </div>
      </section>

      <div className="container mx-auto px-6 lg:px-12">
        {category.products && category.products.length > 0 ? (
          <CategoryProducts products={category.products} />
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🍪</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-4">No products in this category yet</h3>
            <p className="text-gray-500 mb-8">Check back soon for new delicious items!</p>
            <Link
              href="/shop"
              className="inline-block bg-[#FFC702] text-[#111111] px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-[#e6b300] transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </main>
    </>
  );
}
