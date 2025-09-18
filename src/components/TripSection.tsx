import Image from "next/image"

export default function TripSection() {
    return (
        <div className="relative h-screen flex flex-col justify-center items-center px-4">
            {/* Orchid Decorations */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Orchid 1 */}
                <Image 
                    src="/orchid1.png" 
                    alt="Orchid 1" 
                    width={74}
                    height={72}
                    className="absolute"
                    style={{ top: '0px', left: '200px' }}
                />
                {/* Orchid 3 */}
                <Image 
                    src="/orchid 3.png" 
                    alt="Orchid 3" 
                    width={58}
                    height={57}
                    className="absolute"
                    style={{ top: '4px', left: '71px' }}
                />
                {/* Orchid 4 */}
                <Image 
                    src="/orchid 4.png" 
                    alt="Orchid 4" 
                    width={48}
                    height={45}
                    className="absolute"
                    style={{ top: '42px', left: '44px' }}
                />
                {/* Orchid 5 */}
                <Image 
                    src="/orchid 4.png" 
                    alt="Orchid 5" 
                    width={61}
                    height={61}
                    className="absolute"
                    style={{ top: '65px', right: '27px' }}
                />
                {/* Orchid 6 */}
                <Image 
                    src="/orchid 4.png" 
                    alt="Orchid 6" 
                    width={56}
                    height={55}
                    className="absolute"
                    style={{ top: '102px', right: '48px' }}
                />
                {/* Orchid 1 (duplicate) */}
                <Image 
                    src="/orchid1.png" 
                    alt="Orchid 1 duplicate" 
                    width={74}
                    height={72}
                    className="absolute"
                    style={{ top: '66px', right: '13px' }}
                />
                {/* Coffee Bean 1 */}
                <Image 
                    src="/coffee bean 1.png" 
                    alt="Coffee Bean 1" 
                    width={29}
                    height={34}
                    className="absolute"
                    style={{ top: '271px', right: '27px' }}
                />
                {/* Coffee Bean 2 */}
                <Image 
                    src="/coffee bean 1.png" 
                    alt="Coffee Bean 2" 
                    width={29}
                    height={34}
                    className="absolute"
                    style={{ top: '545px', left: '47px' }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full h-4/5 md:h-3/5 mx-auto text-center backdrop-blur p-8 rounded-3xl bg-black/50">
                {/* Section Title */}
                <h2 
                    className="text-white mb-8"
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
                
                {/* Trip Details */}
                <div 
                    className="text-white text-left"
                    style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '20px',
                        fontWeight: 400,
                        lineHeight: '30px',
                        letterSpacing: '-1px'
                    }}
                >
                    <p>Tiquetes de avión.</p>
                    <p>Hotel todo incluído</p>
                    <p>Comida</p>
                    <p>Chofer privado</p>
                </div>
            </div>
        </div>
    )
}
