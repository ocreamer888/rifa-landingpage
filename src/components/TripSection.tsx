import Image from "next/image"

export default function TripSection() {
    return (
        <div className="relative h-auto py-12 flex flex-col justify-center items-center px-4">
            {/* Content */}
            <div className="relative z-10 w-full h-auto gap-4 mx-auto text-center backdrop-blur p-4 py-8 md:p-8 rounded-3xl bg-black/50">
              <div className="flex flex-col w-full h-full items-center p-4 md:p-8 justify-center">
              <div className="flex flex-col items-center justify-center">
                {/* Section Title */}
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
                    ¿Qué incluye el viaje?
                </h2>
                </div>
                <div className="flex md:flex-row flex-col h-full items-around justify-around w-full">
                {/* Trip Details */}
                <div 
                    className="text-white text-left flex flex-col items-start justify-center p-4"
                    style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '20px',
                        fontWeight: 400,
                        lineHeight: '30px',
                        letterSpacing: '-1px'
                    }}
                >
                    <p>• Tiquetes de avión</p>
                    <p>• Hotel todo incluído</p>
                    <p>• Comida</p>
                    <p>• Chofer privado</p>
                    <p>• Actividades</p>
                    <p>• Seguro de viaje</p>
                    <p>• Asistencia</p>
                    <p>• Diseño de sonrisa</p>
                    
                </div>
                <div className="flex flex-col items-center justify-center">
                    <Image src="/Rifa-art-1.png" alt="Line" width={400} height={400} className="w-full h-full" />
                </div>
                </div>
                
            </div>
            </div>
        </div>
    )
}
