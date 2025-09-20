import Image from "next/image"
import CardThree from "./CardThree"

export default function DentalSection() {
    return (
        <div className="relative flex flex-col items-center justify-between w-full py-20 px-4">
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
                <div className="@container flex flex-col justify-center items-center gap-4 overflow-hidden w-full max-w-sm lg:max-w-md aspect-square lg:aspect-[4/3] min-h-[300px] lg:min-h-[400px]">
                    {/* Gradient Background */}
                    <CardThree
                    title=
                    {
                        <h5 className="text-2xl md:text-3xl lg:text-4xl">Doc. Jose David Burbano</h5>
                    }
                    description="Odontólogo general y especialista en diseño de sonrisa."
                    imageSrc="/RifaDoc.png"
                    imageAlt="Dentista estético Jose David Burbano"
                    className="h-full w-full pt-4"

                    />

                </div>

              
            </div>
        </div>
    )
}
