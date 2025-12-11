'use client';
import CardThree from "./CardThree"
import VideoContainer from "./VideoContainer"

export default function DentalSection() {
    return (
        <div className="relative flex flex-col items-center w-full pt-8 px-4">
            {/* Content */}
            <div className="flex flex-col md:flex-row w-full items-center justify-around text-center gap-4 backdrop-blur p-8 rounded-3xl bg-black/50 border border-white/20 mb-8">
                {/* Section Title */}
                <div className="flex flex-col w-full lg:w-2/5 justify-center items-center md:items-start md:justify-start gap-4">
                <h2 
                    className="text-gray-100"
                    style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '36px',
                        fontWeight: 600,
                        lineHeight: '54px',
                        letterSpacing: '-1.8px'
                    }}
                >
                    Diseño de Sonrisa
                </h2>
                
                {/* Description */}
                <p 
                    className="text-gray-100 text-center md:text-left"
                    style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '18px',
                        fontWeight: 400,
                        lineHeight: '24px',
                        letterSpacing: '-0.8px'
                    }}
                >
                    El ganador tendrá un diseño de sonrisa para él o su acompañante realizado por el Doctor.
                </p>
                <VideoContainer
                    videoSrc="/video/dental.mp4"
                    posterSrc="/diseño-sonrisa.webp"
                    videoAlt="Rifa promotional video"
                    className="w-full rounded-3xl"
                    aspectRatio="16/9"
                    autoPlay={true}
                    loop={true}
                    muted={true}
                    backgroundColor="bg-black"
                
                />
                </div>

                {/* Doctor Card */}
                <div className="@container flex flex-col justify-center items-center gap-4 overflow-hidden w-full max-w-sm lg:max-w-md aspect-square lg:aspect-[4/3] min-h-[300px] lg:min-h-[400px]">
                <CardThree
                    title=
                    {
                        <h5 className="text-2xl md:text-3xl lg:text-4xl">Doc. Jose David Burbano</h5>
                    }
                    description="Odontólogo general y especialista en diseño de sonrisa."
                    imageSrc="/RifaDoc.webp"
                    imageAlt="Dentista estético Jose David Burbano"
                    className="h-full w-full pt-4"
                    /> 
                  
                  
                </div>
            
            </div>
            

        </div>
    )
}
