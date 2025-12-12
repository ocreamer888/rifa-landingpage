import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidad - Sorteo Colombia Tour',
  description: 'Política de privacidad del sorteo Colombia Tour. Conoce cómo protegemos y utilizamos tu información personal.',
};

export default function PrivacidadPage() {
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
            Política de Privacidad y Tratamiento de Datos Personales
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
                  1. Identidad del Responsable
                </h2>
                <p>
                  El presente sitio web, <strong>https://sorteocolombiatour.com/</strong> (en adelante, "el Sitio"), es operado por <strong>JEAN PIERRE SANCHEZ MOSQUERA</strong>, con documento de identidad N.º <strong>BD203480</strong> (en adelante, "el Responsable"), con domicilio físico para efectos de notificaciones en <strong>Restaurante Bubalú, Barrio Escalante, San José, Costa Rica</strong>.
                </p>
                <p className="mt-3">
                  El Responsable se compromete a proteger la privacidad de los usuarios de conformidad con la Ley de Protección de la Persona frente al Tratamiento de sus Datos Personales (Ley N.º 8968) de la República de Costa Rica y su Reglamento.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-100 mb-3">
                  2. Datos que Recolectamos
                </h2>
                <p>
                  Para participar en los sorteos y actividades del Sitio, solicitamos los siguientes datos de carácter personal ("Datos Personales"):
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li><strong>Datos de Identificación y Contacto:</strong> Nombre completo, dirección de correo electrónico y número de teléfono.</li>
                  <li><strong>Información Transaccional:</strong> Comprobantes de pago vía SINPE Móvil (que pueden incluir el nombre del titular de la cuenta bancaria y número de teléfono asociado).</li>
                  <li><strong>Datos de Navegación:</strong> Dirección IP, tipo de navegador y comportamiento en el sitio (a través de Pixels de seguimiento).</li>
                </ul>
                <p className="mt-3">
                  <strong>Nota sobre Datos Sensibles:</strong> El Sitio NO recolecta datos sensibles (como origen racial, opiniones políticas o datos de salud) en la fase de registro. Sin embargo, para la ejecución del premio (procedimientos dentales o viajes), se podrá solicitar información de salud o pasaportes posteriormente, la cual será tratada con la máxima confidencialidad y únicamente para la prestación del servicio.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-100 mb-3">
                  3. Finalidad del Tratamiento
                </h2>
                <p>
                  Los Datos Personales recolectados serán utilizados para las siguientes finalidades:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li><strong>Gestión del Sorteo:</strong> Procesar la compra de tickets, verificar pagos vía SINPE, seleccionar a los ganadores y coordinar la entrega de premios.</li>
                  <li><strong>Comunicación:</strong> Contactar al usuario en caso de resultar ganador o para resolver dudas sobre su participación.</li>
                  <li><strong>Marketing y Publicidad:</strong> Enviar información sobre futuros sorteos, promociones y novedades relacionadas con Sorteo Colombia Tour o sus aliados comerciales (ej. Restaurante Bubalú), siempre que el usuario no haya solicitado la baja.</li>
                  <li><strong>Análisis y Mejora:</strong> Uso del Pixel de Meta (Facebook) para medir la efectividad de nuestra publicidad y mejorar la experiencia del usuario.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-100 mb-3">
                  4. Almacenamiento y Seguridad de los Datos
                </h2>
                <p>
                  El Responsable informa que los datos son almacenados en bases de datos gestionadas por terceros proveedores de servicios ("Encargados del Tratamiento"), quienes cumplen con estándares internacionales de seguridad:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li><strong>Supabase:</strong> Para la gestión de la base de datos de la aplicación web.</li>
                  <li><strong>Google LLC (Google Sheets/Drive):</strong> Para respaldos administrativos y control de gestión.</li>
                </ul>
                <p className="mt-3">
                  Aunque realizamos nuestros mejores esfuerzos para proteger su información, la transmisión de información a través de internet no es completamente segura. El usuario acepta el riesgo inherente a la transmisión de datos vía web.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-100 mb-3">
                  5. Medios de Pago (SINPE Móvil)
                </h2>
                <p>
                  El Sitio utiliza SINPE Móvil como medio de pago exclusivo. El Responsable NO tiene acceso ni almacena números de tarjetas de crédito o débito completos.
                </p>
                <p className="mt-3">
                  Al realizar un pago por SINPE, el usuario entiende que la entidad bancaria procesa la transacción.
                </p>
                <p className="mt-3">
                  El Sitio únicamente recolecta el comprobante de la transferencia para efectos de conciliación y validación del ticket.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-100 mb-3">
                  6. Participación de Menores de Edad
                </h2>
                <p>
                  El Sitio permite la participación de menores de edad (menores de 18 años). Sin embargo:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li>Al facilitar sus datos, el menor garantiza que cuenta con el consentimiento previo de sus padres o tutores legales.</li>
                  <li>En caso de que un menor de edad resulte ganador de un premio, este deberá ser reclamado obligatoriamente por su padre, madre o tutor legal, quien deberá acreditar su identidad y la representación legal del menor.</li>
                  <li>El Responsable se reserva el derecho de solicitar la validación de edad y el consentimiento parental en cualquier momento.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-100 mb-3">
                  7. Cookies y Pixel de Meta
                </h2>
                <p>
                  Este sitio utiliza el Pixel de Meta (Facebook) y tecnologías similares para rastrear la actividad de los visitantes, crear audiencias personalizadas y mostrar anuncios relevantes.
                </p>
                <p className="mt-3">
                  Al navegar en el sitio, usted acepta el uso de estas tecnologías.
                </p>
                <p className="mt-3">
                  Puede configurar su navegador o sus preferencias de anuncios en Facebook para rechazar este seguimiento.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-100 mb-3">
                  8. Transferencia Internacional de Datos
                </h2>
                <p>
                  Dado que el premio principal se ejecuta en Colombia (servicios turísticos y dentales), el usuario acepta expresamente que, en caso de resultar ganador, sus datos básicos (nombre, pasaporte, contacto) sean transferidos a los proveedores en Colombia (hoteles, aerolíneas, clínica dental del Dr. Jose David Burbano) únicamente con el fin de agendar y ejecutar el premio.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-100 mb-3">
                  9. Derechos ARCO (Sus Derechos)
                </h2>
                <p>
                  Usted tiene derecho a <strong>Acceder</strong>, <strong>Rectificar</strong>, <strong>Cancelar</strong> (eliminar) u <strong>Oponerse</strong> al tratamiento de sus datos personales. Para ejercer estos derechos, o si no desea recibir más correos promocionales, envíe una solicitud a:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li><strong>Dirección física:</strong> Restaurante Bubalú, Barrio Escalante, San José.</li>
                  <li><strong>Correo electrónico:</strong> <a href="mailto:Jeanpemos2@gmail.com" className="text-blue-400 hover:text-blue-300 underline">Jeanpemos2@gmail.com</a></li>
                </ul>
                <p className="mt-3">
                  El Responsable atenderá su solicitud en el plazo estipulado por la Ley 8968 (normalmente 5 días hábiles para consultas internas).
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
