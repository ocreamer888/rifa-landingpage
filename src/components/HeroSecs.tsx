'use client';
import React from 'react';
import Image from "next/image";

interface HeroSecsProps {
  title?: React.ReactNode;
  description?: string;
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
  if (props.showOnMobile) classes.push('block sm:hidden');
  if (props.showOnTablet) classes.push('hidden sm:block lg:hidden');
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
  CardImageClassName?: string;
  // Add dynamic sizing props
  imageSize?: {
    mobile?: string;    // e.g., "w-4/5 h-4/5"
    tablet?: string;    // e.g., "w-3/5 h-3/5" (will add md: prefix)
    desktop?: string;   // e.g., "w-2/5 h-2/5" (will add lg: prefix)
  };
}> = ({ src, alt, visibility, imageSize, CardImageClassName }) => {
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
    <div className={`relative flex flex-col w-full z-10 h-full items-end p-2 lg:p-8 justify-center ${visibilityClasses}`}>
           <div className='flex flex-col items-center justify-end w-full h-full overflow-hidden rounded-full'>
        <Image
          src={src}
          alt={alt}
          height={400}
          width={400}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          quality={100}
          priority
          fetchPriority='high'
          className={`object-contain ${dynamicSizes} ${CardImageClassName}`}
        />
      </div>
    </div>
  );
};

const CardContent: React.FC<{ 
  title: React.ReactNode; 
  description?: string | undefined; 
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
}> = ({ title, description, buttonText, linkHref, visibility, CardContentClassName, buttonVariant, buttonSize, buttonRounded, buttonUppercase, buttonClassName, buttonOnClick }) => {
  const visibilityClasses = visibility ? getResponsiveVisibilityClasses(visibility) : '';
  const hasCustom = Boolean(buttonVariant || buttonSize || buttonRounded || typeof buttonUppercase !== 'undefined' || buttonClassName);
  const desktopDefault = "relative bg-purple-100 cursor-pointer hover:bg-purple-200 text-purple-900 font-bold px-8 py-4 rounded-full transition-colors duration-200";
  
  return (
    <div className={`z-20 rounded-3xl flex flex-col justify-center items-center md:items-start gap-4 ${visibilityClasses} ${CardContentClassName}`}>
      <h2 id="card-title" className="text-center md:text-start text-balance font-semibold text-5xl lg:text-7xl px-2 md:px-0">{title}</h2>
      {description && <p className="text-xl text-center md:text-start">{description}</p>}
      <a
        href={linkHref}
        onClick={buttonOnClick}
        className={`hidden md:block ${hasCustom ? getButtonClasses({ variant: buttonVariant, size: buttonSize, rounded: buttonRounded, uppercase: !!buttonUppercase, extra: '' }) : desktopDefault} ${buttonClassName || ''}`}
      >
        {buttonText}
      </a>
    </div>
  );
};

const CardButton: React.FC<{ 
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
}> = ({ buttonText, linkHref, visibility, buttonVariant, buttonSize, buttonRounded, buttonUppercase, buttonClassName, buttonOnClick }) => {
  const visibilityClasses = visibility ? getResponsiveVisibilityClasses(visibility) : '';
  const hasCustom = Boolean(buttonVariant || buttonSize || buttonRounded || typeof buttonUppercase !== 'undefined' || buttonClassName);
  const mobileDefault = "bg-yellow-500 hover:bg-purple-200 text-purple-900 uppercase font-bold px-6 py-4 rounded-full";
  
  return (
    <div className={`absolute md:relative z-50 w-full h-auto flex flex-col text-balance justify-end items-center md:items-start px-8 pb-8 ${visibilityClasses}`}>
      <a
        href={linkHref}
        onClick={buttonOnClick}
        className={`md:hidden ${hasCustom ? getButtonClasses({ variant: buttonVariant, size: buttonSize, rounded: buttonRounded, uppercase: !!buttonUppercase, extra: '' }) : mobileDefault} ${buttonClassName || ''}`}
      >
        {buttonText}
      </a>
    </div>
  );
};

class HeroSecs extends React.Component<HeroSecsProps> {
  static defaultProps = {
    title: "Default Title",
    description: "Default Description",
    imageSrc: "/default-image.webp",
    imageAlt: "Default Image",
    linkHref: "#",
    backgroundColor: "#f8f8f8",
    CardButton: "true",
  };

 override render() {
    const { 
      title, 
      description, 
      imageSrc, 
      imageAlt, 
      linkHref, 
      backgroundImage, 
      backgroundColor, 
      backDropBlur, 
      buttonText, 
      cardButton, 
      className,
      CardContentClassName,
      CardImageClassName,
      // Individual visibility controls
      imageVisibility,
      contentVisibility,
      buttonVisibility,
      backgroundVisibility,
      // Legacy props for backward compatibility
      hideOnMobile,
      hideOnTablet,
      hideOnDesktop,
      showOnMobile,
      showOnTablet,
      showOnDesktop
    } = this.props;

    // Legacy visibility props (apply to all if no individual controls are set)
       const legacyVisibility: {
        hideOnMobile?: boolean;
        hideOnTablet?: boolean;
        hideOnDesktop?: boolean;
        showOnMobile?: boolean;
        showOnTablet?: boolean;
        showOnDesktop?: boolean;
      } = {
        ...(hideOnMobile !== undefined && { hideOnMobile }),
        ...(hideOnTablet !== undefined && { hideOnTablet }),
        ...(hideOnDesktop !== undefined && { hideOnDesktop }),
        ...(showOnMobile !== undefined && { showOnMobile }),
        ...(showOnTablet !== undefined && { showOnTablet }),
        ...(showOnDesktop !== undefined && { showOnDesktop }),
      };

    // Use individual visibility props if provided, otherwise fall back to legacy props
    const finalImageVisibility = imageVisibility || legacyVisibility;
    const finalContentVisibility = contentVisibility || legacyVisibility;
    const finalButtonVisibility = buttonVisibility || legacyVisibility;
    const finalBackgroundVisibility = backgroundVisibility || legacyVisibility;

    return (
      <div className='relative flex flex-col h-screen w-full rounded-b-3xl z-30'>
        {backgroundImage && (
          <Image 
            src={backgroundImage}
            alt="Background image"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={80}
            loading="lazy"
            className={`relative object-top object-cover rounded-b-3xl backdrop-blur ${getResponsiveVisibilityClasses(finalBackgroundVisibility)}`}
          />
        )}
        <div className={`relative flex flex-col sm:landscape:flex-row md:flex-row overflow-hidden justify-center items-center ${className} ${backDropBlur} ${backgroundColor}`} role="region" aria-labelledby="card-title">      
        <div className='relative sm:landscape:relative md:relative order-1 sm:landscape:order-1 md:order-1 flex flex-col flex-1 h-auto sm:landscape:h-auto justify-center items-center'>
          {title && linkHref && buttonText && CardContentClassName && (
            <CardContent 
              title={title} 
              description={description} 
              buttonText={buttonText} 
              linkHref={linkHref}
              visibility={finalContentVisibility}
              CardContentClassName={CardContentClassName}
              buttonVariant={this.props.buttonVariant}
              buttonSize={this.props.buttonSize}
              buttonRounded={this.props.buttonRounded}
              buttonUppercase={this.props.buttonUppercase}
              buttonClassName={this.props.buttonClassName}
              buttonOnClick={this.props.buttonOnClick}
            />
          )}
        </div>
        <div className='relative flex flex-col w-full sm:hidden md:block order-2 sm:landscape:order-2 md:order-2 sm:landscape:flex-1 flex-1  sm:landscape:h-auto justify-center items-center'>
          {imageSrc && imageAlt && CardImageClassName && (
            <CardImage 
              src={imageSrc} 
              alt={imageAlt}
              visibility={finalImageVisibility}
              {...(this.props.imageSize !== undefined ? { imageSize: this.props.imageSize } : {})}
              {...(this.props.CardImageClassName !== undefined ? { CardImageClassName: this.props.CardImageClassName } : {})}
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
              buttonVariant={this.props.buttonVariant}
              buttonSize={this.props.buttonSize}
              buttonRounded={this.props.buttonRounded}
              buttonUppercase={this.props.buttonUppercase}
              buttonClassName={this.props.buttonClassName}
              buttonOnClick={this.props.buttonOnClick}
            />
          )}
        </div>
      </div>
    );
  }
}

export default HeroSecs;