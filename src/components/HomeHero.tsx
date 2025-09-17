"use client";
import HeroSecs from "@/components/HeroSecs";
import { ArrowDown } from "lucide-react";

export default function Home() {
  return (
   <div className="flex flex-col justify-center items-center">
  <HeroSecs 
    title={
      <div className="flex flex-col justify-top items-center leading-none tracking-tight text-balance w-full pt-40 md:pt-0">
        <div className="whitespace-nowrap font-sans uppercase font-semibold tracking-[-0.04em] text-[clamp(3.6rem,5vw,7rem)]">
          ¡Ganate un
        </div>
        <div className="whitespace-nowrap flex items-baseline gap-3">
          <span className="tracking-[-0.03em] font-serif font-light text-[clamp(3.2rem,4.5vw,7rem)]">
            Viaje a
          </span>
          <span className="font-serif font-light italic tracking-[-0.06em] text-[clamp(3.2rem,4.5vw,7rem)]">
            Colombia!
          </span>
        </div>
      </div>
    }
    description="¡Gana un viaje todo incluido para dos personas a Colombia más un diseño de sonrisa!
"
    imageSrc="/RifaHero.png"
    imageSize={{
      mobile: "w-[clamp(36rem,70vw,50rem)] h-[clamp(36rem,70vw,50rem)]",
      tablet: "w-[clamp(20rem,50vw,35rem)] h-[clamp(20rem,50vw,35rem)]", 
      desktop: "w-[clamp(80rem,80vw,80rem)] h-[clamp(80rem,80vw,80rem)]"
    }}
    CardImageClassName="sm:landscape:w-4/5 sm:landscape:h-auto md:landscape:w-4/5 md:landscape:h-auto lg:landscape:w-5/6 lg:landscape:h-auto"
    imageVisibility={{}}
    backgroundImage=""
    backgroundVisibility={{hideOnMobile: false, hideOnTablet: false, hideOnDesktop: false}}
    backgroundColor=""
    buttonText={<span className="font-normal text-black">¡Participa ya!</span>}
    cardButton="hidden"
    buttonVisibility={{hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false}}
    buttonVariant="secondary"
    buttonSize="md"
    buttonRounded="full"
    buttonUppercase={true}
    buttonClassName="bg-orange-400 text-black hover:bg-black hover:text-orange-500"
    className="backdrop-blur-sm p-4 lg:p-12 h-screen"
    CardContentClassName="h-full text-white"
    linkHref="#ticket-grid"
    imageAlt="Design Studio - Graphic Design, Web Development and Digital Marketing Services"
  />   
  <div className="hidden lg:block left-32! bottom-0! z-50 absolute gap-4">
    <p className="text-white text-lg font-medium flex flex-row items-center gap-2">
    <ArrowDown size={40} className="w-8 h-8 animate-bounce" /> scroll to continue
    </p>
  </div>
   </div>
  );
}
