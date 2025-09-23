'use client';
import Image from "next/image";
import { useId, memo } from "react";

interface CardThreeProps {
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  linkHref?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  buttonText?: string;
  cardButton?: string;
  className?: string;
  imageSize?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
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
  imageSize?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  } | undefined;
}>(({ src, alt, visibility }) => {
  const visibilityClasses = visibility ? getResponsiveVisibilityClasses(visibility) : '';
  
  return (
    <div className={`relative flex flex-col w-full z-10 h-full items-center justify-end ${visibilityClasses}`}>
      <div className='flex flex-col items-center justify-end w-full h-full'>
        <Image
          src={src}
          alt={alt}
          height={400}
          width={400}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={85}
          priority
          fetchPriority='high'
          className="object-contain object-bottom w-full h-full px-4"
        />
      </div>
    </div>
  );
});

CardImage.displayName = 'CardImage';

const CardContent = memo<{ title: string | React.ReactNode; description: string | React.ReactNode; titleId: string }>(({ title, description, titleId }) => (
  <div className="absolute bottom-0 left-0 right-0 z-10 rounded-3xl w-full h-full flex flex-col justify-end p-8">
    <div id={titleId} className="font-semibold text-4xl lg:text-5xl">{title}</div>
    <p className="text-lg">{description}</p>
  </div>
));

CardContent.displayName = 'CardContent';

const CardThree = memo<CardThreeProps>(({
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
      className={`relative flex flex-col h-full w-full justify-end items-end text-white rounded-3xl flex-1 overflow-hidden bg-gradient-to-t from-purple-900 via-purple-300/90 to-purple-300/80 backdrop-blur-2xl ${className || ''}`}
      role="region"
      aria-labelledby={titleId}
    >
      <CardImage src={imageSrc} alt={imageAlt} imageSize={imageSize} />
      <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-purple-900 via-purple-500/20 to-transparent z-10"></div>
      <CardContent title={title} description={description} titleId={titleId} />
    </div>
  );
});

CardThree.displayName = 'CardThree';

export default CardThree;