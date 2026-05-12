'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCartContext } from '@/providers/CartProvider';
import toast from 'react-hot-toast';

export default function ProductClient({ product }: { product: any }) {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(
    product.variants?.length > 0 ? product.variants[0] : null
  );
  
  // Custom Input State
  const [useCustom, setUseCustom] = useState(product.variants?.length === 0);
  const [customValue, setCustomValue] = useState<number>(1);

  const parsePrice = (price: any): number => {
    if (price == null) return 0;
    if (typeof price === 'number') return price;
    if (typeof price === 'string') return Number(price) || 0;
    if (typeof price === 'object' && '$numberDecimal' in price) {
      return Number(price.$numberDecimal) || 0;
    }
    return 0;
  };

  const basePrice = parsePrice(product.basePrice);
  const defaultVariant = product.variants?.length > 0 ? product.variants[0] : null;
  const effectiveVariant = selectedVariant || defaultVariant;
  const { addToCart, isLoading } = useCartContext();

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCustomValue(isNaN(val) ? 0 : val);
    setUseCustom(true);
    setSelectedVariant(null);
  };

  const handleVariantSelect = (variant: any) => {
    setSelectedVariant(variant);
    setUseCustom(false);
  };

  const calculatePrice = (): number => {
    if (useCustom && product.allowCustomInput && basePrice > 0) {
      return basePrice * Number(customValue || 0);
    }

    const variantPrice = effectiveVariant ? parsePrice(effectiveVariant.price) : 0;
    if (variantPrice > 0) {
      return variantPrice;
    }

    if (basePrice > 0) {
      return basePrice;
    }

    return 0;
  };

  const currentPrice = calculatePrice();

  const handleAddToCart = async () => {
    if (!useCustom && !selectedVariant) {
      toast.error('Please select a size or enter a custom amount');
      return;
    }

    try {
      await addToCart({
        productId: product.id,
        variantId: !useCustom ? selectedVariant?.id : undefined,
        quantity,
        customValue: useCustom ? customValue : undefined,
      });
      toast.success(`${product.name} added to cart!`);
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Failed to add to cart';
      toast.error(message);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 mb-32">
      {/* Gallery (Left) */}
      <div className="w-full lg:w-1/2 flex flex-col md:flex-row gap-6 min-w-0">
        {/* Thumbnails */}
        <div className="flex md:flex-col gap-4 order-2 md:order-1 min-w-0">
          {product.images?.map((image: any, idx: number) => (
            <div
              key={idx}
              onClick={() => setActiveImage(idx)}
              className={`w-20 h-20 md:w-28 md:h-28 rounded-3xl overflow-hidden cursor-pointer border-4 ${
                idx === activeImage ? "border-[#FFC702]" : "border-transparent hover:border-[#FFC702]"
              } transition-all duration-300 relative`}
            >
              <Image
                src={image.imageUrl}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Main Image */}
        <div className="relative w-full h-100 md:h-150 rounded-[3rem] overflow-hidden order-1 md:order-2 shadow-[0_30px_60px_rgba(0,0,0,0.15)] group bg-gray-100 border-8 border-white">
          {product.category && (
            <div className="absolute top-6 left-6 bg-[#FFC702] text-[#111111] px-5 py-2 rounded-full text-[14px] font-black z-20 shadow-md tracking-widest uppercase">
              {product.category.name}
            </div>
          )}
          {product.images?.[activeImage]?.imageUrl ? (
            <Image
              src={product.images[activeImage].imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700 z-10"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-6xl">
              📦
            </div>
          )}
        </div>
      </div>

      {/* Details (Right) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center min-w-0">
        <div className="space-y-8">
          {/* Title & Description */}
          <div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-heading text-[#111111] tracking-tighter leading-[0.9] uppercase mb-4">
              {product.name}
            </h1>
            <p className="text-3xl font-black text-[#FF8A00] mb-6">
              Rs. {Number(currentPrice).toFixed(0)}
            </p>
            {product.description && (
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                {product.description}
              </p>
            )}
            {product.ingredients && (
              <p className="text-sm text-gray-500">
                <strong>Ingredients:</strong> {product.ingredients}
              </p>
            )}
            <p className="text-sm font-bold text-gray-700 mt-4">
              <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </p>
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <h3 className="text-xl font-black uppercase tracking-widest text-[#111111] mb-4">Select Size</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.variants.map((variant: any) => (
                  <div
                    key={variant.id}
                    onClick={() => handleVariantSelect(variant)}
                    className={`border-2 rounded-xl p-3 cursor-pointer text-center transition-all ${
                      !useCustom && selectedVariant?.id === variant.id
                        ? "border-[#FFC702] bg-[#FFC702]/10"
                        : "border-gray-200 hover:border-[#FFC702]"
                    }`}
                  >
                    <span className="font-bold text-[#111111] block mb-1">
                      {variant.label}
                    </span>
                    <span className="text-sm text-gray-600 font-bold">
                      Rs. {variant.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Input */}
          {product.allowCustomInput && (
            <div>
              <h3 className="text-xl font-black uppercase tracking-widest text-[#111111] mb-4">
                Custom {product.productType === 'WEIGHT' ? 'Weight' : 'Quantity'}
              </h3>
              <div 
                className={`flex flex-col sm:flex-row gap-3 items-center p-4 border-2 rounded-2xl transition-all ${
                  useCustom ? "border-[#FFC702] bg-[#FFC702]/5" : "border-gray-200"
                }`}
                onClick={() => setUseCustom(true)}
              >
                <input
                  type="number"
                  value={customValue}
                  onChange={handleCustomChange}
                  placeholder={`Enter ${product.productType === 'WEIGHT' ? 'weight' : 'quantity'}`}
                  className="flex-1 min-w-0 w-full bg-transparent border-none focus:outline-none text-xl font-black text-[#111111]"
                  min="0.1"
                  step={product.productType === 'WEIGHT' ? '0.1' : '1'}
                />
                <span className="text-lg font-black text-gray-400">
                  {product.productType === 'WEIGHT' ? 'kg' : 'pieces'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Base price: Rs. {product.basePrice} per {product.productType === 'WEIGHT' ? 'kg' : 'piece'}
              </p>
            </div>
          )}

          {/* Quantity Selector */}
          <div>
            <h3 className="text-xl font-black uppercase tracking-widest text-[#111111] mb-4">Quantity</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center bg-gray-100 rounded-full p-1.5 border-2 border-gray-200 w-full sm:w-auto min-w-0">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#111111] font-black hover:text-[#FFC702] transition-colors shadow-sm text-xl"
                >
                  -
                </button>
                <span className="w-16 text-center font-black text-xl text-[#111111]">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#111111] font-black hover:text-[#FFC702] transition-colors shadow-sm text-xl"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="pt-6">
            <button 
              onClick={handleAddToCart}
              disabled={isLoading || product.stock === 0}
              className={`w-full py-6 rounded-full font-black uppercase tracking-[0.15em] transition-all duration-500 flex items-center justify-center gap-3 relative overflow-hidden group/btn ${
                product.stock === 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-linear-to-r from-[#FFC702] to-[#FF8A00] text-[#111111] shadow-[0_15px_30px_rgba(255,199,2,0.3)] hover:shadow-[0_20px_40px_rgba(255,199,2,0.5)] hover:scale-[1.02]'
              }`}
            >
              <span className="absolute inset-0 bg-white/30 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out"></span>
              <span className="relative z-10 flex items-center gap-2 text-[17px]">
                {isLoading ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                {!isLoading && product.stock > 0 && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:translate-x-2 transition-transform">
                    <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="m2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                  </svg>
                )}
              </span>
            </button>
            
            {/* Trust Badges */}
            <div className="mt-8 pt-8 border-t-2 border-gray-100 flex items-center justify-between text-gray-500 text-sm font-bold">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                Secure Checkout
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                Fast Delivery
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                Quality Guarantee
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
