import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Términos y Condiciones - Sorteo Colombia Tour',
  description: 'Términos y condiciones del sorteo Colombia Tour. Lee los términos completos antes de participar.',
};

export default function TerminosPage() {
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
            REGLAMENTO DE TÉRMINOS Y CONDICIONES – SORTEO COLOMBIA TOUR
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            Última actualización: 12 de Diciembre de 2025
          </p>

          <div className="prose prose-invert max-w-none">
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p className="mb-6">
                El presente reglamento (en adelante, el "Reglamento") establece los términos, condiciones y normas que regirán la actividad promocional denominada "Sorteo Colombia Tour" (en adelante, el "Sorteo"). La participación en esta actividad implica el conocimiento y aceptación total e incondicional de las presentes reglas.
              </p>

              <section>
                <h2 className="text-xl font-semibold text-gray-100 mb-3">
                  1. DEL ORGANIZADOR
                </h2>
                <p>
                  La actividad es organizada y operada por JEAN PIERRE SANCHEZ MOSQUERA cédula de identidad número BD203480 (en adelante, el "Organizador").
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-100 mb-3">
                  2. VIGENCIA
                </h2>
                <p>
                  El Sorteo tendrá la siguiente vigencia:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Fecha de inicio de venta: 15 de diciembre de 2025.</li>
                  <li>Fecha de cierre de venta: 15 de marzo de 2026.</li>
                  <li>Fecha del Sorteo: Se anunciará a través de las redes sociales oficiales, a realizarse posterior al cierre de ventas.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-100 mb-3">
                  3. ELEGIBILIDAD Y PARTICIPANTES
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Podrán participar personas nacionales o extranjeras, sin restricción de nacionalidad.</li>
                  <li>No existen restricciones de edad para la compra del boleto. Sin embargo, si el ganador resulta ser una persona menor de edad (menor de 18 años), el premio deberá ser reclamado, gestionado y aceptado por su padre, madre o tutor legal debidamente acreditado, quien deberá acompañar al menor en el disfrute del premio o designar un acompañante mayor de edad.</li>
                  <li>Es requisito indispensable contar con pasaporte vigente y en buen estado para poder hacer efectivo el premio del viaje.</li>
                  <li>Es requisito indispensable tener el carné de vacunación contra la fiebre amarilla al día.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-red-400 mb-3">
                  4. MECÁNICA DE COMPRA Y PAGOS (CLÁUSULA CRÍTICA)
                </h2>
                <p>
                  La participación se adquiere a través del sitio web https://sorteocolombiatour.com/. El proceso de validación es estricto y se rige por las siguientes normas:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li><strong>Reservación:</strong> El usuario selecciona su(s) número(s) en la plataforma.</li>
                  <li><strong>Ventana de Pago (10 Minutos):</strong> A partir del momento en que se genera la reservación en el sitio web, el usuario dispone de 10 minutos exactos para realizar el pago vía SINPE Móvil y enviar el comprobante.</li>
                  <li><strong>Envío de Comprobante:</strong> El comprobante de pago debe enviarse vía WhatsApp al número +50661139008 indicando el nombre completo y número de pedido.</li>
                  <li><strong>Liberación de Números:</strong> Si transcurridos los 10 minutos el Organizador no ha recibido el comprobante válido, el sistema liberará automáticamente los números reservados, dejándolos disponibles para otro comprador. El Organizador no se hace responsable si el usuario paga después de este tiempo y pierde su número.</li>
                  <li><strong>Política de No Reembolso:</strong> Una vez confirmado el pago y emitido el boleto digital, el dinero no es reembolsable bajo ninguna circunstancia.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-100 mb-3">
                  5. DESCRIPCIÓN DEL PREMIO MAYOR
                </h2>
                <p className="mb-3">
                  Se sorteará un (1) paquete turístico para el ganador y un (1) acompañante a Colombia.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-200 mb-2 mt-4">
                  5.1. El Premio INCLUYE:
                </h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Tiquetes aéreos ida y vuelta (Ruta: San José SJO – Cali y luego Medellín, según disponibilidad).</li>
                  <li>Hospedaje para dos personas.</li>
                  <li>Alimentación (según el plan del tour seleccionado por el Organizador).</li>
                  <li>Traslados internos necesarios para el itinerario del tour.</li>
                  <li>Tours y actividades turísticas programadas.</li>
                  <li>Exclusivo para el Ganador Titular: Un procedimiento de "Diseño de Sonrisa".</li>
                  <li>Cupo para un (1) acompañante con los mismos beneficios de viaje (excluyendo el tratamiento dental).</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-200 mb-2 mt-4">
                  5.2. El Premio NO INCLUYE:
                </h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Tramitación o costos de Pasaporte.</li>
                  <li>Seguro de viaje o asistencia médica internacional (se recomienda encarecidamente adquirir uno).</li>
                  <li>Gastos personales, compras, propinas o alimentación fuera del itinerario.</li>
                  <li>Tratamiento de diseño de sonrisa para el acompañante.</li>
                  <li>Costos migratorios o impuestos de salida no especificados en el tiquete.</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-200 mb-2 mt-4">
                  5.3. Fechas de Viaje:
                </h3>
                <p>
                  Las fechas son abiertas a elección del ganador, sujetas a disponibilidad de vuelos y hoteles. El ganador deberá notificar su intención de viaje con al menos 14 días de anticipación.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-100 mb-3">
                  6. DESCRIPCIÓN DEL SEGUNDO PREMIO
                </h2>
                <p className="mb-3">
                  Se sorteará un cupón equivalente a cien mil colones costarricenses para comer en el restaurante BUBALU.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-200 mb-2 mt-4">
                  6.1. El Premio INCLUYE:
                </h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Un cupón equivalente a cien mil colones consumibles el mismo día que se reclama.</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-200 mb-2 mt-4">
                  6.2. El Premio NO INCLUYE:
                </h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Gastos personales, compras, propinas o transporte.</li>
                  <li>Cualquier tipo de costo externo a los cien mil colones del cupón.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-100 mb-3">
                  7. SELECCIÓN DEL GANADOR
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>El sorteo se realizará mediante una aplicación digital certificada de selección aleatoria ("Random Picker" o similar).</li>
                  <li>La selección se transmitirá en vivo (Live) a través de las cuentas oficiales de Facebook y/o Tik Tok de la marca.</li>
                  <li>Se seleccionará un único ganador titular. En caso de no poder contactar al ganador en un plazo de 72 horas, o que este no cumpla los requisitos, se procederá a sortear nuevamente o seleccionar un suplente (a discreción del Organizador).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-yellow-400 mb-3">
                  8. EXONERACIÓN DE RESPONSABILIDAD (IMPORTANTE)
                </h2>
                <p className="mb-2">
                  El participante acepta y reconoce que:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Responsabilidad Médica:</strong> El Organizador actúa únicamente como facilitador del premio. El procedimiento de "Diseño de Sonrisa" es realizado por profesionales odontológicos independientes en Colombia. El Organizador no asume responsabilidad alguna por resultados médicos, insatisfacción estética, complicaciones de salud o diagnósticos que impidan realizar el procedimiento (ej. si el ganador no es apto médicamente para el diseño).</li>
                  <li><strong>Responsabilidad de Viaje:</strong> El Organizador no es responsable por retrasos de aerolíneas, pérdida de equipaje, o negativa de ingreso al país por parte de Migración Colombia. Es responsabilidad exclusiva del ganador y su acompañante cumplir con los requisitos migratorios de Colombia (pasaporte vigente, Check-Mig, etc.).</li>
                  <li><strong>Fuerza Mayor:</strong> En caso de eventos de fuerza mayor (pandemias, cierres de fronteras, desastres naturales), el viaje podrá ser reprogramado, pero no se reembolsará dinero en efectivo.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-100 mb-3">
                  9. DERECHOS DE IMAGEN
                </h2>
                <p>
                  Al participar en este Sorteo, el usuario acepta que, en caso de resultar ganador, es obligatorio permitir la captura de fotografías, videos y testimonios de su experiencia y la recepción del premio. El ganador cede al Organizador, de manera gratuita e irrevocable, los derechos de uso de su imagen para ser publicada en redes sociales, sitio web y material publicitario con fines comerciales y de transparencia del sorteo.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-100 mb-3">
                  10. PRIVACIDAD Y DATOS PERSONALES
                </h2>
                <p>
                  De conformidad con la Ley de Protección de la Persona frente al Tratamiento de sus Datos Personales (Ley No. 8968 de Costa Rica), la información recolectada (nombre, cédula, teléfono) será utilizada exclusivamente para la gestión del sorteo y comunicación con los participantes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-100 mb-3">
                  11. CONTACTO
                </h2>
                <p>
                  Para consultas relacionadas con este reglamento o el estado de su pedido, puede contactar al soporte a través de:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>WhatsApp: <a href="https://wa.me/50661139008" className="text-blue-400 hover:text-blue-300 underline">+50661139008</a></li>
                  <li>Correo Electrónico: <a href="mailto:JEANPEMOS2@GMAIL.COM" className="text-blue-400 hover:text-blue-300 underline">JEANPEMOS2@GMAIL.COM</a></li>
                </ul>
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
