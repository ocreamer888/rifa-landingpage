'use client';
import React, { memo, useMemo } from 'react';
import Image from "next/image";

interface HeroSecsProps {
  title?: React.ReactNode;
  description?: string | React.ReactNode;
  buttonText?: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  linkHref?: string;
  backgroundImage?: string;
  id?: string;
  backgroundColor?: string;
  cardButton?: string;
  backDropBlur?: string;
  className?: string;
  CardContentClassName?: string;
  CardImageClassName?: string;
  // Add the imageSize prop to the main interface
  imageSize?: {
    mobile?: string;    // e.g., "w-4/5 h-4/5"
    tablet?: string;    // e.g., "w-3/5 h-3/5"
    desktop?: string;   // e.g., "w-2/5 h-2/5"
  };
  
  // Individual visibility controls for each component
  imageVisibility?: {
    hideOnMobile?: boolean;
    hideOnTablet?: boolean;
    hideOnDesktop?: boolean;
    showOnMobile?: boolean;
    showOnTablet?: boolean;
    showOnDesktop?: boolean;
  };
  contentVisibility?: {
    hideOnMobile?: boolean;
    hideOnTablet?: boolean;
    hideOnDesktop?: boolean;
    showOnMobile?: boolean;
    showOnTablet?: boolean;
    showOnDesktop?: boolean;
  };
  buttonVisibility?: {
    hideOnMobile?: boolean;
    hideOnTablet?: boolean;
    hideOnDesktop?: boolean;
    showOnMobile?: boolean;
    showOnTablet?: boolean;
    showOnDesktop?: boolean;
  };
  backgroundVisibility?: {
    hideOnMobile?: boolean;
    hideOnTablet?: boolean;
    hideOnDesktop?: boolean;
    showOnMobile?: boolean;
    showOnTablet?: boolean;
    showOnDesktop?: boolean;
  };
  
  // Legacy props for backward compatibility (apply to all components)
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  hideOnDesktop?: boolean;
  showOnMobile?: boolean;
  showOnTablet?: boolean;
  showOnDesktop?: boolean;

  // Button customization
  buttonVariant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  buttonSize?: 'sm' | 'md' | 'lg';
  buttonRounded?: 'full' | 'lg' | 'md' | 'none';
  buttonUppercase?: boolean;
  buttonClassName?: string;
  buttonOnClick?: React.MouseEventHandler<HTMLAnchorElement>;
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

// Button class generator (keeps old defaults unless you pass customization props)
const getButtonClasses = ({
  variant = 'primary',
  size = 'md',
  rounded = 'full',
  uppercase = false,
  extra = '',
}: {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | undefined;
  size?: 'sm' | 'md' | 'lg' | undefined;
  rounded?: 'full' | 'lg' | 'md' | 'none' | undefined;
  uppercase?: boolean | undefined;
  extra?: string | undefined;
}) => {
  const base = 'relative cursor-pointer transition-colors duration-200 font-bold';
  const variants: Record<string,string> = {
    primary: 'bg-purple-100 hover:bg-purple-200 text-purple-900',
    secondary: 'bg-black text-white hover:bg-gray-800',
    outline: 'border border-current bg-transparent hover:bg-black/5',
    ghost: 'bg-transparent hover:bg-black/10 text-current',
  };
  const sizes: Record<string,string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  const radius: Record<string,string> = {
    full: 'rounded-full',
    lg: 'rounded-lg',
    md: 'rounded-md',
    none: 'rounded-none',
  };
  return [base, variants[variant], sizes[size], radius[rounded], uppercase ? 'uppercase' : '', extra]
    .filter(Boolean).join(' ');
};

// Memoized CardImage component
const CardImage = memo<{ 
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
  CardImageClassName?: string;
  imageSize?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  priority?: boolean;
}>(({ src, alt, visibility, imageSize, CardImageClassName, priority = false }) => {
  const visibilityClasses = useMemo(() => 
    visibility ? getResponsiveVisibilityClasses(visibility) : '', 
    [visibility]
  );
  
  // Build dynamic sizes with proper responsive prefixes
  const dynamicSizes = useMemo(() => {
    if (!imageSize) {
      return "w-4/5 h-4/5 md:w-3/5 md:h-3/5 lg:w-2/5 lg:h-2/5";
    }
    
    const mobile = imageSize.mobile || "w-4/5 h-4/5";
    const tablet = imageSize.tablet ? imageSize.tablet.replace(/\b(w-|h-)/g, 'md:$1') : "";
    const desktop = imageSize.desktop ? imageSize.desktop.replace(/\b(w-|h-)/g, 'lg:$1') : "";
    
    return [mobile, tablet, desktop].filter(Boolean).join(' ');
  }, [imageSize]);
  
  return (
    <div className={`relative flex flex-col w-full z-10 h-full items-end p-2 lg:p-8 justify-center ${visibilityClasses}`}>
      <div className='flex flex-col items-center justify-end w-full h-full overflow-hidden'>
        <Image
          src={src}
          alt={alt}
          height={600}
          width={600}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={95}
          loading="lazy"
          className={`object-contain ${dynamicSizes} ${CardImageClassName || ''}`}
        />
      </div>
    </div>
  );
});

CardImage.displayName = 'CardImage';

// Memoized CardContent component
const CardContent = memo<{ 
  title: React.ReactNode; 
  description?: string | React.ReactNode | undefined; 
  buttonText: React.ReactNode; 
  linkHref: string;
  CardContentClassName?: string | undefined;
  visibility?: {
    hideOnMobile?: boolean;
    hideOnTablet?: boolean;
    hideOnDesktop?: boolean;
    showOnMobile?: boolean;
    showOnTablet?: boolean;
    showOnDesktop?: boolean;
  } | undefined;
  buttonVariant?: 'primary' | 'secondary' | 'outline' | 'ghost' | undefined;
  buttonSize?: 'sm' | 'md' | 'lg' | undefined;
  buttonRounded?: 'full' | 'lg' | 'md' | 'none' | undefined;
  buttonUppercase?: boolean | undefined;
  buttonClassName?: string | undefined;
  buttonOnClick?: React.MouseEventHandler<HTMLAnchorElement> | undefined;
}>(({ title, description, buttonText, linkHref, visibility, CardContentClassName, buttonVariant, buttonSize, buttonRounded, buttonUppercase, buttonClassName, buttonOnClick }) => {
  const visibilityClasses = useMemo(() => 
    visibility ? getResponsiveVisibilityClasses(visibility) : '', 
    [visibility]
  );
  
  const hasCustom = useMemo(() => 
    Boolean(buttonVariant || buttonSize || buttonRounded || typeof buttonUppercase !== 'undefined' || buttonClassName),
    [buttonVariant, buttonSize, buttonRounded, buttonUppercase, buttonClassName]
  );
  
  const desktopDefault = "relative bg-purple-100 cursor-pointer hover:bg-purple-200 text-purple-900 font-bold px-8 py-4 rounded-full transition-colors duration-200";
  
  const buttonClasses = useMemo(() => {
    if (hasCustom) {
      return getButtonClasses({ 
        variant: buttonVariant, 
        size: buttonSize, 
        rounded: buttonRounded, 
        uppercase: !!buttonUppercase, 
        extra: '' 
      });
    }
    return desktopDefault;
  }, [hasCustom, buttonVariant, buttonSize, buttonRounded, buttonUppercase]);
  
  return (
    <div className={`z-20 rounded-3xl flex flex-col justify-center items-center lg:items-start gap-4 ${visibilityClasses} ${CardContentClassName}`}>
      <h2 id="card-title" className="text-center text-balance font-semibold text-5xl lg:text-7xl px-2 md:px-0">{title}</h2>
      {description && <div className="text-xl text-center lg:text-start">{description}</div>}
      <a
        href={linkHref}
        onClick={buttonOnClick}
        className={`${buttonClasses} ${buttonClassName || ''}`}
      >
        {buttonText}
      </a>
    </div>
  );
});

CardContent.displayName = 'CardContent';

// Memoized CardButton component
const CardButton = memo<{ 
  buttonText: React.ReactNode; 
  linkHref: string;
  visibility?: {
    hideOnMobile?: boolean;
    hideOnTablet?: boolean;
    hideOnDesktop?: boolean;
    showOnMobile?: boolean;
    showOnTablet?: boolean;
    showOnDesktop?: boolean;
  };
  buttonVariant?: 'primary' | 'secondary' | 'outline' | 'ghost' | undefined;
  buttonSize?: 'sm' | 'md' | 'lg' | undefined;
  buttonRounded?: 'full' | 'lg' | 'md' | 'none' | undefined;
  buttonUppercase?: boolean | undefined;
  buttonClassName?: string | undefined;
  buttonOnClick?: React.MouseEventHandler<HTMLAnchorElement> | undefined;
}>(({ buttonText, linkHref, visibility, buttonVariant, buttonSize, buttonRounded, buttonUppercase, buttonClassName, buttonOnClick }) => {
  const visibilityClasses = useMemo(() => 
    visibility ? getResponsiveVisibilityClasses(visibility) : '', 
    [visibility]
  );
  
  const hasCustom = useMemo(() => 
    Boolean(buttonVariant || buttonSize || buttonRounded || typeof buttonUppercase !== 'undefined' || buttonClassName),
    [buttonVariant, buttonSize, buttonRounded, buttonUppercase, buttonClassName]
  );
  
  const mobileDefault = "bg-yellow-500 hover:bg-purple-200 text-purple-900 uppercase font-bold px-6 py-4 rounded-full";
  
  const buttonClasses = useMemo(() => {
    if (hasCustom) {
      return getButtonClasses({ 
        variant: buttonVariant, 
        size: buttonSize, 
        rounded: buttonRounded, 
        uppercase: !!buttonUppercase, 
        extra: '' 
      });
    }
    return mobileDefault;
  }, [hasCustom, buttonVariant, buttonSize, buttonRounded, buttonUppercase]);
  
  return (
    <div className={`absolute md:relative z-50 w-full h-auto flex flex-col text-balance justify-end items-center md:items-start px-8 pb-8 ${visibilityClasses}`}>
      <a
        href={linkHref}
        onClick={buttonOnClick}
        className={`md:hidden ${buttonClasses} ${buttonClassName || ''}`}
      >
        {buttonText}
      </a>
    </div>
  );
});

CardButton.displayName = 'CardButton';

// Main HeroSecs component with memoization
const HeroSecs = memo<HeroSecsProps>(({
  title = "Default Title",
  description = "Default Description",
  imageSrc = "/default-image.webp",
  imageAlt = "Default Image",
  linkHref = "#",
  backgroundColor = "#f8f8f8",
  cardButton = "true",
  backgroundImage,
  backDropBlur,
  buttonText,
  className,
  CardContentClassName,
  CardImageClassName,
  imageSize,
  imageVisibility,
  contentVisibility,
  buttonVisibility,
  backgroundVisibility,
  hideOnMobile,
  hideOnTablet,
  hideOnDesktop,
  showOnMobile,
  showOnTablet,
  showOnDesktop,
  buttonVariant,
  buttonSize,
  buttonRounded,
  buttonUppercase,
  buttonClassName,
  buttonOnClick,
}) => {
  // Memoize legacy visibility props
  const legacyVisibility = useMemo(() => ({
    ...(hideOnMobile !== undefined && { hideOnMobile }),
    ...(hideOnTablet !== undefined && { hideOnTablet }),
    ...(hideOnDesktop !== undefined && { hideOnDesktop }),
    ...(showOnMobile !== undefined && { showOnMobile }),
    ...(showOnTablet !== undefined && { showOnTablet }),
    ...(showOnDesktop !== undefined && { showOnDesktop }),
  }), [hideOnMobile, hideOnTablet, hideOnDesktop, showOnMobile, showOnTablet, showOnDesktop]);

  // Memoize final visibility props
  const finalImageVisibility = useMemo(() => imageVisibility || legacyVisibility, [imageVisibility, legacyVisibility]);
  const finalContentVisibility = useMemo(() => contentVisibility || legacyVisibility, [contentVisibility, legacyVisibility]);
  const finalButtonVisibility = useMemo(() => buttonVisibility || legacyVisibility, [buttonVisibility, legacyVisibility]);
  const finalBackgroundVisibility = useMemo(() => backgroundVisibility || legacyVisibility, [backgroundVisibility, legacyVisibility]);

  // Memoize background image classes
  const backgroundImageClasses = useMemo(() => 
    backgroundImage ? getResponsiveVisibilityClasses(finalBackgroundVisibility) : '',
    [backgroundImage, finalBackgroundVisibility]
  );

  return (
    <div className='relative flex flex-col h-screen w-full rounded-b-3xl z-30'>
      {backgroundImage && (
        <Image 
          src={backgroundImage}
          alt="Background image"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
          quality={95}
          priority
          fetchPriority="high"
          className={`relative object-top object-cover rounded-b-3xl backdrop-blur ${backgroundImageClasses}`}
        />
      )}
      <div className={`relative flex flex-col sm:landscape:flex-row lg:flex-row overflow-hidden justify-center items-center ${className} ${backDropBlur} ${backgroundColor}`} role="region" aria-labelledby="card-title">      
        <div className='relative sm:landscape:relative md:relative order-1 sm:landscape:order-1 md:order-1 flex flex-col flex-1 h-auto sm:landscape:h-auto justify-center items-center'>
          {title && linkHref && buttonText && CardContentClassName && (
            <CardContent 
              title={title} 
              description={description} 
              buttonText={buttonText} 
              linkHref={linkHref}
              visibility={finalContentVisibility}
              CardContentClassName={CardContentClassName}
              buttonVariant={buttonVariant}
              buttonSize={buttonSize}
              buttonRounded={buttonRounded}
              buttonUppercase={buttonUppercase}
              buttonClassName={buttonClassName}
              buttonOnClick={buttonOnClick}
            />
          )}
        </div>
        <div className='relative flex flex-col w-full lg:block order-2 sm:landscape:order-2 md:order-2 sm:landscape:flex-1 flex-1 sm:landscape:h-auto justify-center items-center'>
        {imageSrc && imageAlt && (
            <CardImage 
              src={imageSrc} 
              alt={imageAlt}
              visibility={finalImageVisibility}
              {...(imageSize ? { imageSize } : {})}
              {...(CardImageClassName ? { CardImageClassName } : {})}
            />
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row w-full justify-end items-center">
        {cardButton && linkHref && buttonText && (
          <CardButton 
            buttonText={buttonText} 
            linkHref={linkHref}
            visibility={finalButtonVisibility}
            buttonVariant={buttonVariant}
            buttonSize={buttonSize}
            buttonRounded={buttonRounded}
            buttonUppercase={buttonUppercase}
            buttonClassName={buttonClassName}
            buttonOnClick={buttonOnClick}
          />
        )}
      </div>
    </div>
  );
});

HeroSecs.displayName = 'HeroSecs';

export default HeroSecs;