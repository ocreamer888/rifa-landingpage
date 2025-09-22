'use client';

interface LoadingProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: string;
}

export default function Loading({ 
  size = 'md', 
  className = '',
  color = 'currentColor'
}: LoadingProps) {
  const sizeClasses = {
    xs: 'loading-xs',
    sm: 'loading-sm', 
    md: 'loading-md',
    lg: 'loading-lg',
    xl: 'loading-xl'
  };

  return (
    <span 
      className={`loading loading-infinity ${sizeClasses[size]} ${className}`}
      style={{ color }}
      aria-label="Loading"
    >
    </span>
  );
}

// Example usage component showing all sizes
export function LoadingShowcase() {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h2 className="text-2xl font-bold mb-4">Loading Component Sizes</h2>
      
      <div className="flex items-center gap-4">
        <Loading size="xs" />
        <span className="text-sm">Extra Small</span>
      </div>
      
      <div className="flex items-center gap-4">
        <Loading size="sm" />
        <span className="text-sm">Small</span>
      </div>
      
      <div className="flex items-center gap-4">
        <Loading size="md" />
        <span className="text-sm">Medium (default)</span>
      </div>
      
      <div className="flex items-center gap-4">
        <Loading size="lg" />
        <span className="text-sm">Large</span>
      </div>
      
      <div className="flex items-center gap-4">
        <Loading size="xl" />
        <span className="text-sm">Extra Large</span>
      </div>
      
      <div className="flex items-center gap-4 mt-4">
        <Loading size="md" color="#ef4444" />
        <span className="text-sm">Custom Color (Red)</span>
      </div>
    </div>
  );
}
