'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductCardProps {
  title?: string;
  price?: string;
  image?: string;
  imageAlt?: string;
  showButton?: boolean;
  isAnimated?: boolean;
  onAddToCart?: () => void;
}

export default function ProductCard({ 
  title = "Oxford Shoe", 
  price = "$99", 
  image = "/oxford-shoe.png",
  imageAlt = "Product image",
  showButton = false,
  isAnimated = false,
  onAddToCart
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart();
    } else {
      console.log(`Added ${title} to cart`);
    }
  };

  return (
    <div 
      className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-64 h-80 flex flex-col items-center justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative w-full h-40 flex items-center justify-center mb-4">
        <div 
          className={`relative transition-all duration-300 ease-out ${
            isAnimated && isHovered 
              ? 'transform rotate-12 scale-110' 
              : 'transform rotate-0 scale-100'
          }`}
        >
          {image && !imageError ? (
            <div className="relative w-32 h-20 rounded-lg shadow-lg overflow-hidden">
              <Image
                src={image}
                alt={imageAlt}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ) : (
            // Fallback placeholder when image fails to load or no image provided
            <div className="w-32 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg shadow-lg flex items-center justify-center">
              <div className="w-24 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-md relative">
                {/* Shoe details placeholder */}
                <div className="absolute inset-0 flex flex-col justify-between p-1">
                  <div className="flex justify-between">
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-16 h-0.5 bg-gray-500"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Title */}
      <h3 className="text-lg font-bold text-black text-center mb-2">
        {title}
      </h3>

      {/* Price */}
      <p className="text-red-600 text-lg font-semibold text-center mb-4">
        {price}
      </p>

      {/* Add to Cart Button - only show if showButton is true */}
      {showButton && (
        <button 
          className={`w-full py-3 px-4 bg-gray-800 text-white font-medium rounded-md transition-all duration-200 ${
            isAnimated && isHovered 
              ? 'transform translate-y-0 opacity-100' 
              : 'transform translate-y-2 opacity-0'
          }`}
          onClick={handleAddToCart}
        >
          ADD TO CARD
        </button>
      )}
    </div>
  );
}

// Component to show both cards side by side as in the Figma design
export function ProductCardShowcase() {
  return (
    <div className="flex gap-8 items-center justify-center p-8 bg-gray-50 min-h-screen">
      {/* Static Card */}
      <ProductCard 
        title="Oxford Shoe"
        price="$99"
        image="/oxford-shoe.png"
        imageAlt="Oxford Shoe"
        showButton={false}
        isAnimated={false}
      />
      
      {/* Animated Card */}
      <ProductCard 
        title="Oxford Shoe"
        price="$99"
        image="/oxford-shoe.png"
        imageAlt="Oxford Shoe"
        showButton={true}
        isAnimated={true}
      />
    </div>
  );
}
