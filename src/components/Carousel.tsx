import React, { useState, useEffect, useCallback } from 'react';

const FadeCarousel = () => {
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
    <div className="relative w-full bg-gray-900 overflow-hidden rounded-3xl md:rounded-r-3xl md:rounded-l-none shadow-2xl">
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
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FadeCarousel;