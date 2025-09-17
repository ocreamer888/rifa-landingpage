import Image from "next/image"

export default function HeroSection() {
    return (
        <div className="relative flex flex-col md:flex-row items-center justify-between h-screen w-full bg-[#080808] overflow-hidden">
            {/* Background Images */}
            <div className="absolute flex flex-col items-center justify-center w-full h-full inset-0">
              
                <Image 
                    src="/RifaHero.png" 
                    alt="Rifa Hero" 
                    width={600}
                    height={600}
                    className="object-contain inset-0"
                />
            </div>
            
            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center justify-between h-screen text-center px-4">
                {/* Main Title */}
                <h1 
                    className="text-white top-0"
                    style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '128px',
                        fontWeight: 600,
                        lineHeight: '128px',
                        letterSpacing: '-3px'
                    }}
                >
                    Sorteo
                </h1>
                
                {/* Subtitle */}
                <p 
                    className="text-white text-center pb-16 max-w-[500px]"
                    style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '20px',
                        fontWeight: 400,
                        lineHeight: '21px',
                        letterSpacing: '-1.2px'
                    }}
                >
                    ¡Gana un viaje todo incluido para dos personas a Colombia más un diseño de sonrisa!
                </p>
            </div>
        </div>
    )
}