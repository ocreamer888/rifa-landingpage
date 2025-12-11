'use client';
import CardThree from "./CardThree"

export default function SegundoPremio() {
    return (
        <div className="relative flex flex-col items-center w-full px-4">
            {/* Content */}
            <div className="flex flex-col md:flex-row w-full items-center justify-around text-center gap-4 backdrop-blur p-8 rounded-3xl bg-black/50 border border-white/20 mb-8">
                {/* Section Title */}
                <div className="flex flex-col w-full lg:w-2/5 justify-center items-center md:items-start md:justify-start gap-4">
                <h2 className="text-gray-100 text-left font-semibold text-4xl">
                    2do Lugar
                </h2>
                
                {/* Description */}
                <p 
                    className="text-gray-100 text-center md:text-left text-lg"
                >
                    El ganador del segundo lugar recibirá $200 dólares para gastar en el restaurante Bubalú.
                </p>
               
                </div>
                {/* Doctor Card */}
                <div className="@container flex flex-col justify-center items-center gap-4 overflow-hidden w-full max-w-sm lg:max-w-md aspect-square lg:aspect-[4/3] min-h-[300px] lg:min-h-[400px]">
                <CardThree
                    title=
                    {
                        <h5 className="text-2xl md:text-3xl lg:text-4xl"></h5>
                    }
                    description=""
                    imageSrc="/bubalu-png-05.png"
                    imageAlt=""
                    className="h-full w-full pt-4"
                    />           
                </div>     
            </div>
        </div>
    )
}
