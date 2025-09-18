import Image from "next/image"
import CardThree from "./CardThree"

export default function DentalSection() {
    return (
        <div className="relative flex flex-col items-center justify-between w-full py-20 px-4">
            {/* Coffee Bean Decoration */}
            <div className="absolute top-8 right-8">
                <Image 
                    src="/coffee bean 1.png" 
                    alt="Coffee Bean" 
                    width={29}
                    height={34}
                />
            </div>

            {/* Content */}
            <div className="flex flex-col md:flex-row h-3/5 w-full items-center justify-around text-center gap-4 backdrop-blur p-8 rounded-3xl bg-black/50">
                {/* Section Title */}
                <div className="flex flex-col w-full lg:w-2/5 justify-center items-center md:items-start md:justify-start gap-4">
                <h2 
                    className="text-white"
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
                    className="text-white text-center md:text-left"
                    style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '16px',
                        fontWeight: 400,
                        lineHeight: '24px',
                        letterSpacing: '-0.8px'
                    }}
                >
                    El ganador tendrá un diseño de sonrisa para él o su acompañante realizado por el Doctor.
                </p>
                </div>

                {/* Doctor Card */}
                <div className="flex flex-col justify-center items-center gap-4 overflow-hidden h-4/5 w-4/5 lg:h-2/6 lg:w-2/6">
                    {/* Gradient Background */}
                    <CardThree
                    title="Doc. Doctor"
                    description="Especialista en diseño de sonrisa."
                    imageSrc="/RifaDoc.png"
                    imageAlt="Example image three"

                    />

                </div>

              
            </div>
        </div>
    )
}
