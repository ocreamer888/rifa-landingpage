'use client';
import Image from "next/image";
import { useId } from "react";

interface CardThreeProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  linkHref?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  buttonText?: string;
  cardButton?: string;
  className?: string;
  imageSize?: {
    mobile?: string;    // e.g., "w-4/5 h-4/5"
    tablet?: string;    // e.g., "w-3/5 h-3/5" (will add md: prefix)
    desktop?: string;   // e.g., "w-2/5 h-2/5" (will add lg: prefix)
  };
}

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
  if (props.showOnMobile) classes.push('block sm:hidden');
  if (props.showOnTablet) classes.push('hidden sm:block lg:hidden');
  if (props.showOnDesktop) classes.push('hidden lg:block');
  
  return classes.join(' ');
};

const CardImage: React.FC<{ 
  src: string; 
  alt: string;
  visibility?: {
    hideOnMobile?: boolean;
    hideOnTablet?: boolean;
    hideOnDesktop?: boolean;
    showOnMobile?: boolean;
    showOnTablet?: boolean;
    showOnDesktop?: boolean;
  };
  imageSize?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  } | undefined;
}> = ({ src, alt, visibility, imageSize }) => {
  const visibilityClasses = visibility ? getResponsiveVisibilityClasses(visibility) : '';
  
    // Build dynamic sizes with proper responsive prefixes
    const buildDynamicSizes = () => {
      if (!imageSize) {
        return "w-4/5 h-4/5 md:w-3/5 md:h-3/5 lg:w-2/5 lg:h-2/5";
      }
      
      const mobile = imageSize.mobile || "w-4/5 h-4/5";
      const tablet = imageSize.tablet ? imageSize.tablet.replace(/\b(w-|h-)/g, 'md:$1') : "";
      const desktop = imageSize.desktop ? imageSize.desktop.replace(/\b(w-|h-)/g, 'lg:$1') : "";
      
      return [mobile, tablet, desktop].filter(Boolean).join(' ');
    };
    
    const dynamicSizes = buildDynamicSizes();
  
  return (
    <div className={`relative flex flex-col w-full z-10 h-full items-center justify-end ${visibilityClasses}`}>
      <div className='flex flex-col items-center justify-end w-full h-full'>
        <Image
          src={src}
          alt={alt}
          height={400}
          width={400}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          quality={100}
          priority
          fetchPriority='high'
          className={`object-contain object-bottom w-full h-full  ${dynamicSizes} sm:landscape:w-full sm:landscape:h-auto px-4`}
        />
      </div>
    </div>
  );
};

const CardContent: React.FC<{ title: string; description: string; titleId: string }> = ({ title, description, titleId }) => (
  <div className="absolute bottom-0 left-0 right-0 z-10 rounded-3xl w-full h-full flex flex-col justify-end p-8">
    <h2 id={titleId} className="font-semibold text-4xl lg:text-5xl">{title}</h2>
    <p className="text-lg">{description}</p>
  </div>
);

const CardThree: React.FC<CardThreeProps> = ({
  title = "Default Title",
  description = "Default Description",
  imageSrc = "/default-image.webp",
  imageAlt = "Default Image",
  className,
  imageSize,
}) => {
  const titleId = useId();

  return (
    <div
      className={`relative flex flex-col h-[50vh] w-full justify-end items-end text-white rounded-3xl flex-1 overflow-hidden bg-gradient-to-t from-purple-900 via-purple-300/90 to-purple-300/80 backdrop-blur-2xl ${className || ''}`}
      role="region"
      aria-labelledby={titleId}
    >
      <CardImage src={imageSrc} alt={imageAlt} imageSize={imageSize} />
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-purple-900 via-purple-500/20 to-transparent z-10"></div>
      <CardContent title={title} description={description} titleId={titleId} />
    </div>
  );
};

export default CardThree;