'use client';
import React from 'react';

interface VideoContainerProps {
  // Video source
  videoSrc: string;
  posterSrc?: string; // Optional poster image
  videoAlt?: string;
  
  // Container styling
  className?: string;
  containerClassName?: string;
  videoClassName?: string;
  
  // Video attributes
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  
  // Responsive visibility
  visibility?: {
    hideOnMobile?: boolean;
    hideOnTablet?: boolean;
    hideOnDesktop?: boolean;
    showOnMobile?: boolean;
    showOnTablet?: boolean;
    showOnDesktop?: boolean;
  };
  
  // Aspect ratio
  aspectRatio?: '16/9' | '4/3' | '1/1' | '21/9' | 'custom';
  customAspectRatio?: string; // For custom aspect ratios like "3/2"
  
  // Background and overlay
  backgroundColor?: string;
  overlay?: React.ReactNode;
  overlayClassName?: string;
}

// Helper function to generate responsive visibility classes
const getResponsiveVisibilityClasses = (props: {
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  hideOnDesktop?: boolean;
  showOnMobile?: boolean;
  showOnTablet?: boolean;
  showOnDesktop?: boolean;
}) => {
  const classes = [];
  
  // Hide classes
  if (props.hideOnMobile) classes.push('hidden sm:block');
  if (props.hideOnTablet) classes.push('sm:hidden lg:block');
  if (props.hideOnDesktop) classes.push('lg:hidden');
  
  // Show classes (override hide classes)
  if (props.showOnMobile) classes.push('block lg:hidden');
  if (props.showOnTablet) classes.push('hidden md:block lg:hidden');
  if (props.showOnDesktop) classes.push('hidden lg:block');
  
  return classes.join(' ');
};

// Get aspect ratio classes
const getAspectRatioClass = (aspectRatio: string, customAspectRatio?: string) => {
  switch (aspectRatio) {
    case '16/9':
      return 'aspect-video';
    case '4/3':
      return 'aspect-[4/3]';
    case '1/1':
      return 'aspect-square';
    case '21/9':
      return 'aspect-[21/9]';
    case 'custom':
      return customAspectRatio ? `aspect-[${customAspectRatio}]` : 'aspect-video';
    default:
      return 'aspect-video';
  }
};

// Get video MIME type based on file extension
const getVideoMimeType = (src: string): string => {
  const extension = src.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'mp4':
      return 'video/mp4';
    case 'mov':
      return 'video/quicktime';
    case 'webm':
      return 'video/webm';
    case 'ogg':
      return 'video/ogg';
    case 'avi':
      return 'video/x-msvideo';
    case 'wmv':
      return 'video/x-ms-wmv';
    default:
      return 'video/mp4'; // Default fallback
  }
};

const VideoContainer: React.FC<VideoContainerProps> = ({
  videoSrc,
  posterSrc,
  videoAlt = "Video content",
  className = "",
  containerClassName = "",
  videoClassName = "",
  autoPlay = false,
  loop = false,
  muted = true,
  controls = true,
  visibility,
  aspectRatio = '16/9',
  customAspectRatio,
  backgroundColor = "bg-black",
  overlay,
  overlayClassName = "",
}) => {
  const visibilityClasses = visibility ? getResponsiveVisibilityClasses(visibility) : '';
  const aspectRatioClass = getAspectRatioClass(aspectRatio, customAspectRatio);
  const mimeType = getVideoMimeType(videoSrc);

  return (
    <div className={`relative w-full ${aspectRatioClass} ${backgroundColor} ${visibilityClasses} ${className}`}>
      <div className={`relative w-full h-full ${containerClassName}`}>
        <video
          className={`w-full h-full object-cover rounded-3xl! pointer-events-none select-none ${videoClassName}`}
          poster={posterSrc}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          controls={false}
          playsInline
          disablePictureInPicture
          onContextMenu={(e) => e.preventDefault()}
          onMouseDown={(e) => e.preventDefault()}
          onMouseUp={(e) => e.preventDefault()}
          onClick={(e) => e.preventDefault()}
          onDoubleClick={(e) => e.preventDefault()}
          aria-label={videoAlt}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
          }}
        >
          <source src={videoSrc} type={mimeType} />
          Your browser does not support the video tag.
        </video>

        {/* Overlay */}
        {overlay && (
          <div className={`absolute inset-0 ${overlayClassName}`}>
            {overlay}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoContainer;
