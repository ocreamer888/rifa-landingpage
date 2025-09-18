"use client";
import HeroSecs from "@/components/HeroSecs";
import { ArrowDown } from "lucide-react";

export default function Home() {
  return (
   <div className="flex flex-col justify-center items-center">
  <HeroSecs 
    title={
      <div className="flex flex-col justify-top items-center lg:items-start leading-none tracking-tight text-balance w-full md:pt-0">
        <div className="whitespace-nowrap font-sans uppercase font-semibold tracking-[-0.04em] text-[clamp(2rem,3vw,4rem)]">
          ¡Gana un viaje a
        </div>
        <div className="whitespace-nowrap flex items-baseline gap-3">

          <span className="font-serif font-light italic tracking-[-0.06em] text-[clamp(4rem,5.8vw,9rem)]">
            Colombia !
          </span>
        </div>
      </div>
    }
    description={
        <div className="font-sans w-full">
          <p className="font-light ">
          ¡Sé el ganador de un viaje todo incluido para ti y un acompañante a Colombia más un diseño de sonrisa!
          </p>
        </div>
      
    }

    imageSrc="/Rifa-art-2.png"
    imageSize={{
      mobile: "w-full h-full",
      tablet: ""
      // Remove desktop property - it will use the default
    }}
    CardImageClassName="w-2/5 h-2/5"
    imageVisibility={{showOnMobile: true}}
    backgroundImage="/Rifa-art-5.png"
    backgroundVisibility={{hideOnMobile: false, hideOnTablet: false, hideOnDesktop: false}}
    backgroundColor=""
    buttonText={<span className="font-normal text-black">¡Participa ya!</span>}
    cardButton="hidden"
    buttonVisibility={{hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false}}
    buttonVariant="secondary"
    buttonSize="md"
    buttonRounded="full"
    buttonUppercase={true}
    buttonClassName="bg-orange-400 text-black hover:bg-black hover:text-orange-500 border border-white/90"
    className="p-4 lg:p-12 h-screen"
    CardContentClassName="h-auto flex flex-col justify-center items-center text-white backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-lg bg-black/40"
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
