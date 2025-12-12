import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Reglas del Sorteo - Sorteo Colombia Tour',
  description: 'Reglas y procedimientos del sorteo Colombia Tour. Conoce cómo funciona el sorteo y cómo participar.',
};

export default function ReglasPage() {
  return (
    <div className="min-h-screen flex flex-col items-center w-full px-4 py-8 md:py-16">
      <div className="w-full max-w-4xl">
        {/* Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-900 hover:text-white transition-colors duration-300 mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Volver al inicio</span>
        </Link>

        {/* Main Content */}
        <div className="backdrop-blur-md p-8 md:p-12 rounded-3xl bg-black/80 border border-white/20">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-2">
            REGLAMENTO OFICIAL DE SORTEO: "SORTEO COLOMBIA TOUR"
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            Última actualización: {new Date().toLocaleDateString('es-CR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>

          <div className="prose prose-invert max-w-none">
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <section>
                <h2 className="text-xl font-semibold text-gray-100 mb-3">
                  I. ORGANIZADOR Y OBJETO
                </h2>
                <p>
                  El presente reglamento establece los términos y condiciones que regirán la actividad promocional denominada "Sorteo Colombia Tour" (en adelante, el "Sorteo"), organizado por JEAN PIERRE SANCHEZ MOSQUERA, pasaporte BD203480, con domicilio en SAN JOSE, COSTA RICA (en adelante, el "Organizador").
                </p>
                <p className="mt-3">
                  La participación en este Sorteo implica el conocimiento y aceptación total de este reglamento.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-100 mb-3">
                  II. VIGENCIA Y ÁMBITO TERRITORIAL
                </h2>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li><strong>Inicio:</strong> 15 de diciembre de 2025.</li>
                  <li><strong>Cierre de ventas:</strong> 15 de marzo de 2026.</li>
                  <li><strong>Fecha del Sorteo:</strong> 15 de marzo de 2026.</li>
                  <li><strong>Ámbito:</strong> Válido dentro del territorio de la República de Costa Rica.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-100 mb-3">
                  III. ELEGIBILIDAD Y PARTICIPANTES
                </h2>
                <p>
                  Podrán participar personas nacionales o extranjeras, sin restricción de edad, que cumplan con la mecánica de compra.
                </p>
                <p className="mt-3">
                  <strong>Participación de Menores:</strong> En caso de que el ganador sea una persona menor de edad, el premio deberá ser reclamado y gestionado por su padre, madre o tutor legal debidamente acreditado. Para el disfrute del premio mayor (Viaje), el menor deberá contar con los permisos de salida del país correspondientes; el Organizador no se hace responsable por trámites migratorios denegados.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-100 mb-3">
                  IV. MECÁNICA DE PARTICIPACIÓN
                </h2>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li><strong>Adquisición:</strong> El participante adquiere un tiquete digital/acción numerada mediante compra directa.</li>
                  <li><strong>Medio de Pago:</strong> El pago se realizará exclusivamente vía SINPE Móvil al número oficial: 61139008 a nombre de JEAN PIERRE SANCHEZ MOSQUERA.</li>
                  <li><strong>Validación:</strong> Para que la participación sea válida, el usuario deberá agregar su nombre legal completo, el número de SINPE desde el que se hará el pago del tiquete y su correo electrónico. El ganador deberá enviar el comprobante de la transacción al +50661139008 indicando su nombre completo y número de cédula. El Organizador confirmará el número asignado.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-100 mb-3">
                  V. DINÁMICA DEL SORTEO
                </h2>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li><strong>Selección del Ganador:</strong> El sorteo se realizará mediante un software digital aleatorio (Random Number Generator) certificado o de uso público, el cual seleccionará el número ganador al azar.</li>
                  <li><strong>Transmisión:</strong> El sorteo será grabado/transmitido en vivo a través de INSTAGRAM/FACEBOOK/TIKTOK de la cuenta oficial.</li>
                  <li><strong>Ausencia de Ganador:</strong> Si el número seleccionado por el software corresponde a un tiquete no vendido o no pagado, se procederá a repetir el sorteo inmediatamente (generar un nuevo número aleatorio) en el mismo acto, tantas veces como sea necesario hasta obtener un ganador válido.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-100 mb-3">
                  VI. PREMIOS
                </h2>
                <p className="mb-3">
                  Se establecen dos (2) premios únicos e indivisibles:
                </p>
                
                <div className="ml-4 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100 mb-2">
                      1. PRIMER LUGAR (Premio Mayor): Paquete de viaje a Colombia para dos personas (Ganador + Acompañante) + Procedimiento Estético.
                    </h3>
                    <p className="mb-2">Incluye:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Tiquetes aéreos ida y vuelta (San José, CR - Colombia).</li>
                      <li>Hospedaje por 3 noches.</li>
                      <li>Viáticos para alimentación y transporte interno (monto estipulado por el Organizador).</li>
                      <li>Diseño de Sonrisa completo para 1 persona.</li>
                    </ul>
                    <p className="mt-2">
                      <strong>Condiciones del Viaje:</strong> El viaje debe programarse en temporada baja y está sujeto a disponibilidad. El premio es transferible a un tercero, previa notificación por escrito al Organizador con al menos 30 días de antelación al viaje.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-100 mb-2">
                      2. SEGUNDO LUGAR:
                    </h3>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Cupón de consumo en el Restaurante BUBALU.</li>
                      <li>Valor: ₡100.000 (Cien mil colones costarricenses).</li>
                      <li>Condiciones: Válido para canje según las políticas internas del restaurante. No canjeable por dinero en efectivo.</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-100 mb-3">
                  VII. RECLAMO DE PREMIOS
                </h2>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li>El ganador será contactado vía telefónica/WhatsApp según los datos registrados al comprar.</li>
                  <li>Dispondrá de 5 días hábiles para responder y coordinar la entrega. Si no aparece en este lapso, perderá el derecho al premio y el Organizador se reserva el derecho de disponer del mismo o volver a sortearlo.</li>
                  <li>El Organizador no cubre gastos de pasaporte, visas, seguros de viaje adicionales ni trámites migratorios.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-100 mb-3">
                  VIII. RESPONSABILIDAD Y EXONERACIÓN
                </h2>
                <p className="mb-3">
                  El Organizador se compromete a entregar los premios descritos. Sin embargo, no asume responsabilidad por accidentes, enfermedades, cancelaciones de vuelos por parte de aerolíneas, cierres de fronteras o situaciones de fuerza mayor que ocurran durante el disfrute del viaje.
                </p>
                <p>
                  El procedimiento estético (diseño de sonrisa) es responsabilidad exclusiva de la clínica proveedora. El Organizador actúa únicamente como facilitador del pago de dicho servicio y no responde por resultados médicos o insatisfacción estética.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-100 mb-3">
                  IX. PROTECCIÓN DE DATOS
                </h2>
                <p>
                  Los datos personales recolectados serán utilizados únicamente para la gestión del sorteo y comunicación con los participantes, en cumplimiento con la Ley de Protección de la Persona frente al Tratamiento de sus Datos Personales (Ley N.º 8968).
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-100 mb-3">
                  X. MODIFICACIONES
                </h2>
                <p>
                  El Organizador se reserva el derecho de modificar fechas o detalles no esenciales del sorteo por razones de fuerza mayor, comunicándolo oportunamente en sus canales oficiales.
                </p>
              </section>
            </div>
          </div>

          {/* Back to top link */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver al inicio</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
