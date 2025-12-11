"use client";
import Carousel from "./Carousel";

export default function TripSection() {
    return (
        <div className="relative h-auto pt-12 flex flex-col justify-center items-center px-4">
            {/* Content */}
            <div className="relative z-10 w-full h-full mx-auto text-center backdrop-blur rounded-3xl">
              <div className="flex flex-col w-full h-full items-center justify-center">
              
                <div className="flex md:flex-row flex-col items-around justify-around w-full h-auto">
                {/* Trip Details */}
                <div className="text-left flex flex-col text-gray-100 items-center justify-around p-4 md:p-8 bg-black/50 rounded-t-3xl md:rounded-l-3xl! md:rounded-r-none md:w-1/2 w-full h-auto" >
                <div className="flex flex-col items-start font-lg w-full gap-2 max-w-4/5 justify-center">
                <h2 className="text-gray-100 text-left font-semibold text-3xl md:text-4xl">
                    Premio Mayor
                </h2>
                <p className="text-gray-100 text-left text-lg">
                    ¡Un viaje todo incluido para dos personas a Colombia más un diseño de sonrisa!
                <br />
                    <span className="text-gray-200 text-md font-medium">
                        El premio incluye:
                    </span>
                 </p>
                    <p>• Tiquetes de avión</p>
                    <p>• Hotel todo incluído</p>
                    <p>• Comida</p>
                    <p>• Chofer privado</p>
                    <p>• Actividades</p>
                    <p>• Seguro de viaje</p>
                    <p>• Asistencia</p>
                    <p>• Diseño de sonrisa</p>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center md:w-1/2 w-full h-auto">
                    <Carousel />
                </div>
                </div>
                
            </div>
            </div>
        </div>
    )
}
