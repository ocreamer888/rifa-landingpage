"use client";
import HeroSecs from "@/components/HeroSecs";

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
          <p className="font-normal ">
          ¡Sé el ganador de un viaje todo incluido para ti y un acompañante a Colombia más un diseño de sonrisa!
          </p>
        </div>
      
    }

    imageSrc="/Rifa-art-2.webp"
    imageSize={{
      mobile: "w-full h-full",
      tablet: ""
      // Remove desktop property - it will use the default
    }}
    CardImageClassName="w-2/5 h-2/5"
    imageVisibility={{showOnMobile: true}}
    backgroundImage="/Rifa-art-5.webp"
    backgroundVisibility={{hideOnMobile: false, hideOnTablet: false, hideOnDesktop: false}}
    backgroundColor=""
    buttonText={<span className="font-normal text-black">¡Participa ya!</span>}
    cardButton="block! bg-orange-400 text-white hover:bg-black hover:text-orange-500 border border-white/90"
    buttonVisibility={{hideOnDesktop: true, hideOnTablet: true, hideOnMobile: true}}
    buttonVariant="secondary"
    buttonSize="md"
    buttonRounded="full"
    buttonUppercase={true}
    buttonClassName="bg-orange-400 text-white hover:bg-black hover:text-orange-500 border border-white/90"
    className="p-4 lg:p-12 h-screen"
    CardContentClassName="h-auto flex flex-col justify-center items-center text-white backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-lg bg-black/40"
    linkHref="#ticket-grid"
    imageAlt="Design Studio - Graphic Design, Web Development and Digital Marketing Services"
  />
   </div>
  );
}
