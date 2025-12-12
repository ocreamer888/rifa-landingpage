'use client';
import CardThree from "./CardThree"
import { MapPin } from 'lucide-react'

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

            {/* Map Section */}
            <div className="flex flex-col w-full items-center backdrop-blur p-8 rounded-3xl bg-black/50 border border-white/20 mb-8">
                {/* Title */}
                <div className="flex items-center gap-3 mb-6">
                    <MapPin className="w-8 h-8 text-blue-400" />
                    <h2 className="text-gray-100 font-semibold text-3xl md:text-4xl">
                        Ubicación del Restaurante
                    </h2>
                </div>

                {/* Map Container */}
                <div className="w-full max-w-4xl rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4155.157148029251!2d-84.065567!3d9.933886399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0e3e961b90ab3%3A0x98b3d5e91417da84!2sBubal%C3%BA%20Cocktail!5e1!3m2!1sen!2scr!4v1765516705764!5m2!1sen!2scr"
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full"
                    />
                </div>

                {/* Optional: Address and Link */}
                <div className="mt-6 flex flex-col items-center gap-3">
                    <p className="text-gray-300 text-lg text-center">
                        📍 Visita Bubalú y disfruta de una experiencia única
                    </p>
                    <a
                        href="https://maps.app.goo.gl/yzHYir7maS6gEqXo7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-300 underline"
                    >
                        Ver en Google Maps
                    </a>
                </div>
            </div>
        </div>
    )
}
