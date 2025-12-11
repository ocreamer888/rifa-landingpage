import React, { useState, useEffect, useCallback, memo } from 'react';
import Image from 'next/image';

const FadeCarousel = memo(() => {
  // Sample images - replace with your own
  const images = [
    '/rifa-trip-1.webp',
    '/rifa-trip-2.webp',
    '/rifa-trip-3.webp',
    '/rifa-trip-5.webp',
    '/rifa-trip-6.webp',
    '/rifa-trip-7.webp',
    '/rifa-trip-8.webp'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsTransitioning(false);
      }, 300); // Half of transition duration
    }
  }, [isTransitioning, images.length]);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="relative w-full bg-gray-900 overflow-hidden rounded-b-3xl md:rounded-b-none md:rounded-r-3xl! shadow-2xl">
      {/* Main carousel container */}
      <div className="relative h-96 md:h-[500px]">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex 
                ? `opacity-100 ${isTransitioning ? 'opacity-0' : ''}` 
                : 'opacity-0'
            }`}
          >
            <Image
              src={image}
              alt={`Trip slide ${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              quality={85}
              loading={index === 0 ? "eager" : "lazy"}
              priority={index === 0}
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
});

FadeCarousel.displayName = 'FadeCarousel';

export default FadeCarousel;