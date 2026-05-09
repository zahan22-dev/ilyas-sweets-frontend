import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { productsService, Product } from "@/lib/services/products";
import ProductClient from "./ProductClient";

function getAvailabilityMessage(slug: string): string | null {
  // Define availability rules based on product slugs
  const availabilityRules: Record<string, string> = {
    'aloo-samosa': 'Available only 12 pm - 6 pm',
    'chicken-roll': 'Available only 12 pm - 6 pm',
    'beef-samosa': 'Available only 12 pm - 6 pm',
    'vegetable-roll': 'Available only 12 pm - 6 pm',
    'halwa-puri': 'Available only Saturday and Sunday'
  };

  return availabilityRules[slug] || null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await productsService.getBySlug(slug);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    return {
      title: product.metaTitle || product.name,
      description: product.metaDescription || product.description,
      alternates: {
        canonical: `${siteUrl}/product/${slug}`
      },
      openGraph: {
        title: product.metaTitle || product.name,
        description: product.metaDescription || product.description,
        images: product.images?.[0]?.imageUrl ? [product.images[0].imageUrl] : [],
      },
    };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let product;
  try {
    product = await productsService.getBySlug(slug);
  } catch (error) {
    return (
      <main className="bg-[#FEFFFF] min-h-[80vh] pt-40 pb-40 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-black font-heading text-[#111111] mb-6 uppercase tracking-tighter">Product <span className="text-[#FFC702]">Not Found</span></h1>
          <p className="text-2xl text-gray-500 font-bold mb-10">We couldn't find the sweet you're looking for.</p>
          <Link href="/shop" className="px-12 py-5 bg-[#FFC702] text-[#111111] font-black rounded-full uppercase tracking-widest hover:bg-[#e6b300] hover:scale-105 transition-all duration-300 inline-block shadow-[0_10px_20px_rgba(255,199,2,0.3)]">
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  // Fetch related products from same category
  let relatedProducts: Product[] = [];
  try {
    if (product.category?.slug) {
      const categoryProducts = await productsService.getAll(product.category.slug);
      relatedProducts = categoryProducts
        .filter(p => p.id !== product.id)
        .slice(0, 4);
    }
    
    // If not enough products from same category, fetch from all products
    if (relatedProducts.length < 4) {
      const allProducts = await productsService.getAll();
      const otherProducts = allProducts
        .filter(p => p.id !== product.id && !relatedProducts.find(rp => rp.id === p.id))
        .slice(0, 4 - relatedProducts.length);
      relatedProducts = [...relatedProducts, ...otherProducts];
    }
  } catch (error) {
    console.error('Failed to fetch related products:', error);
  }

  return (
    <>
      {product.schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(product.schema) }}
        />
      )}
    <main className="bg-[#FEFFFF] min-h-screen pt-32 pb-40">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Breadcrumb - Clean: Home > Category > Product */}
        <div className="flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-gray-400 mb-12">
          <Link href="/" className="hover:text-[#FFC702] transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/category/${product.category?.slug}`} className="hover:text-[#FFC702] transition-colors">
            {product.category?.name || 'Category'}
          </Link>
          <span>/</span>
          <span className="text-[#111111] truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Availability Strip */}
        {getAvailabilityMessage(slug) && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 px-6 py-4 mb-8 rounded-r-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {getAvailabilityMessage(slug)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Product Section */}
        <ProductClient product={product} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="border-t-4 border-gray-100 pt-20">
            <h2 className="text-4xl md:text-5xl font-black font-heading text-[#111111] tracking-tighter leading-[0.9] uppercase mb-12 text-center">
              You Might Also <span className="text-[#FFC702]">Like</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/product/${relatedProduct.slug}`}
                  className="group bg-white rounded-[2rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] border-2 border-gray-50 overflow-hidden hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] hover:scale-[1.02] transition-all duration-300"
                >
                  {/* Product Image */}
                  <div className="relative h-64 bg-gray-100 overflow-hidden">
                    {relatedProduct.images?.[0]?.imageUrl ? (
                      <Image
                        src={relatedProduct.images[0].imageUrl}
                        alt={relatedProduct.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-4xl">
                        📦
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-black font-heading text-[#111111] uppercase tracking-tight leading-tight mb-2 group-hover:text-[#FFC702] transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {relatedProduct.description}
                    </p>

                    {/* Price Range */}
                    <div className="mb-4">
                      {relatedProduct.variants && relatedProduct.variants.length > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">From</span>
                          <span className="font-bold text-[#111111]">
                            Rs. {Math.min(...relatedProduct.variants.map((v: any) => v.price))}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                      <span className="inline-block bg-[#FFC702] text-[#111111] px-6 py-3 rounded-full font-black uppercase tracking-widest text-sm hover:bg-[#e6b300] transition-colors">
                        View Details
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
    </>
  );
}
