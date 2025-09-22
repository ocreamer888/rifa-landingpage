'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface StatData {
  id: string;
  title: string;
  percentage: string;
  description?: string;
  color?: string;
}

const statsData: StatData[] = [
  { id: 'consumer', title: 'Consumer fields', percentage: '18%', description: 'Retail and consumer goods sector', color: '#64748b' },
  { id: 'energy', title: 'Energy', percentage: '7%', description: 'Renewable and traditional energy', color: '#8b5cf6' },
  { id: 'finance', title: 'Finance', percentage: '21%', description: 'Banking and financial services', color: '#475569' },
  { id: 'business', title: 'Business services', percentage: '5%', description: 'Professional business solutions', color: '#6b7280' },
  { id: 'technology', title: 'Technology', percentage: '13%', description: 'Software and hardware innovation', color: '#64748b' },
  { id: 'manufacturing', title: 'Manufacturing', percentage: '16%', description: 'Industrial production and logistics', color: '#475569' },
  { id: 'health', title: 'Health', percentage: '7%', description: 'Healthcare and medical services', color: '#6b7280' },
  { id: 'government', title: 'Government', percentage: '13%', description: 'Public sector and administration', color: '#64748b' },
];

const PlusIcon = ({ isActive, className = '' }: { isActive: boolean; className?: string }) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 18 18" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`transform transition-all duration-500 ease-out ${isActive ? 'rotate-45 scale-110' : 'rotate-0 scale-100'} ${className}`}
    style={{ filter: isActive ? 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.8))' : 'none' }}
  >
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M18 9.89844L0 9.89844L-7.86805e-08 8.09844L18 8.09844L18 9.89844Z" 
      fill="currentColor"
      className="transition-all duration-500"
    />
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M8.09998 18L8.09998 0L9.89998 0L9.89998 18H8.09998Z" 
      fill="currentColor"
      className="transition-all duration-500"
      style={{ 
        opacity: isActive ? 0 : 1,
        transform: isActive ? 'scaleY(0)' : 'scaleY(1)',
        transformOrigin: 'center'
      }}
    />
  </svg>
);

const StatBar = ({ 
  stat, 
  index, 
  isActive, 
  onClick, 
  activeIndex,
  isAnimating
}: { 
  stat: StatData; 
  index: number; 
  isActive: boolean; 
  onClick: () => void;
  activeIndex: number;
  isAnimating: boolean;
}) => {
  const barRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const distanceFromActive = Math.abs(index - activeIndex);

  // Calculate content height for smooth transitions
  useEffect(() => {
    if (contentRef.current && isActive) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isActive]);

  const getGrayIntensity = useCallback(() => {
    if (isActive) return 'bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800'; 
    if (distanceFromActive === 1) return 'bg-gradient-to-br from-gray-400 to-gray-500'; // Light gray for adjacent
    if (distanceFromActive === 2) return 'bg-gradient-to-br from-gray-500 to-gray-600'; // Medium gray
    return 'bg-gradient-to-br from-gray-600 to-gray-700'; // Dark gray for far items
  }, [isActive, distanceFromActive]);

  const getBarStyles = useCallback(() => {
    const baseWidth = isActive ? 400 : 80; // Much more dramatic difference
    const baseHeight = isActive ? 120 : 80; // Height grows when active
    
    return {
      width: `${baseWidth}px`,
      height: `${baseHeight}px`,
      transform: isActive ? 'scale(1.02)' : 'scale(1)',
      zIndex: isActive ? 10 : distanceFromActive === 1 ? 5 : 1,
      boxShadow: isActive 
        ? '0 20px 40px rgba(139, 92, 246, 0.4), 0 0 0 1px rgba(139, 92, 246, 0.2)' 
        : distanceFromActive === 1 
          ? '0 8px 16px rgba(0, 0, 0, 0.2)' 
          : '0 4px 8px rgba(0, 0, 0, 0.1)',
    };
  }, [isActive, distanceFromActive]);

  const barStyles = getBarStyles();

  return (
    <div 
      ref={barRef}
      className={`
        relative flex items-center cursor-pointer group overflow-hidden
        ${getGrayIntensity()}
        rounded-2xl transition-all duration-700 ease-out
        ${isActive ? 'ring-2 ring-purple-400 ring-opacity-50' : ''}
        ${isAnimating ? 'pointer-events-none' : ''}
      `}
      style={{
        ...barStyles,
        viewTransitionName: `stat-bar-${stat.id}`,
        minWidth: '80px',
        willChange: 'transform, width, height, box-shadow',
      }}
      onClick={onClick}
    >
      {/* Animated background pattern - Fixed CSS properties */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: isActive 
            ? 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%)'
            : 'none',
          backgroundSize: isActive ? '20px 20px' : 'auto',
          backgroundRepeat: isActive ? 'repeat' : 'no-repeat',
          animation: isActive ? 'moveBackground 2s linear infinite' : 'none',
        }}
      />
      
      {/* Content container with dynamic height */}
      <div 
        ref={contentRef}
        className="relative z-10 flex items-center justify-between w-full px-4 py-3"
        style={{
          height: isActive ? 'auto' : '100%',
          minHeight: isActive ? `${contentHeight}px` : 'auto',
        }}
      >
        {/* Expanded content */}
        <div 
          className={`flex flex-col text-white transition-all duration-700 ${
            isActive ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-4 pointer-events-none'
          }`}
          style={{
            width: isActive ? 'calc(100% - 60px)' : '0px',
            overflow: 'hidden',
          }}
        >
          <div className="text-sm font-semibold mb-2 leading-tight">{stat.title}</div>
          <div className="text-3xl font-bold mb-1 leading-none">{stat.percentage}</div>
          {stat.description && (
            <div className="text-xs text-purple-200 opacity-90 leading-tight">{stat.description}</div>
          )}
        </div>
        
        {/* Handler with icon and vertical text */}
        <div className="flex flex-col items-center justify-center ml-auto">
          <div className="flex items-center justify-center text-white mb-2">
            <PlusIcon isActive={isActive} />
          </div>
          
          {/* Vertical text for collapsed state */}
          <div 
            className={`text-white text-xs font-medium transition-all duration-700 ${
              isActive ? 'opacity-0 transform rotate-90 scale-50' : 'opacity-100 transform rotate-0 scale-100'
            }`}
            style={{ 
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: !isActive ? 'rotate(180deg)' : 'rotate(90deg) scale(0.5)',
              fontSize: '10px',
              lineHeight: '1.2',
              whiteSpace: 'nowrap',
              transformOrigin: 'center',
            }}
          >
            {stat.title}
          </div>
        </div>
      </div>

      {/* Hover glow effect */}
      <div 
        className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
          isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
        }`}
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default function StatsSection() {
  const [activeIndex, setActiveIndex] = useState(1); // Energy is active by default
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Enhanced click handler with View Transition API
  const handleStatClick = useCallback((index: number) => {
    if (index === activeIndex || isAnimating) return;

    setIsAnimating(true);

    // Check if View Transition API is supported
    if ('startViewTransition' in document) {
      (document as any).startViewTransition(() => {
        setActiveIndex(index);
      }).finished.finally(() => {
        setTimeout(() => setIsAnimating(false), 100);
      });
    } else {
      // Fallback for browsers without View Transition API
      setActiveIndex(index);
      setTimeout(() => setIsAnimating(false), 700);
    }
  }, [activeIndex, isAnimating]);

  // Auto-focus the active element for accessibility
  useEffect(() => {
    if (!isAnimating && containerRef.current) {
      const activeElement = containerRef.current.querySelector(`[data-index="${activeIndex}"]`) as HTMLElement;
      activeElement?.focus();
    }
  }, [activeIndex, isAnimating]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8 overflow-hidden">
      <div className="w-full max-w-8xl">
        <div className="text-center mb-16">
          <h2 
            className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight"
            style={{ viewTransitionName: 'section-title' }}
          >
            Industry Statistics
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Click on any sector to explore detailed insights and market analysis
          </p>
        </div>
        
        <div 
          ref={containerRef}
          className="flex items-center justify-center gap-3 overflow-x-auto pb-8 px-4"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {statsData.map((stat, index) => (
            <StatBar
              key={stat.id}
              stat={stat}
              index={index}
              isActive={index === activeIndex}
              onClick={() => handleStatClick(index)}
              activeIndex={activeIndex}
              isAnimating={isAnimating}
              data-index={index}
            />
          ))}
        </div>
        
        {/* Enhanced info panel */}
        <div 
          className="mt-12 text-center"
          style={{ viewTransitionName: 'info-panel' }}
        >
          <div 
            className="inline-block bg-gradient-to-r from-gray-800 to-gray-900 rounded-full px-8 py-6 shadow-2xl"
            style={{
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <p className="text-white text-xl mb-2">
              <span className="font-bold text-2xl text-purple-400">
                {statsData[activeIndex]?.percentage}
              </span>{' '}
              of total market share
            </p>
            <p className="text-gray-400 text-base">
              {statsData[activeIndex]?.title} • {statsData[activeIndex]?.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
