import Link from 'next/link'
import { MapPin, Award } from 'lucide-react'

function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { label: 'Inicio', href: '#home' },
    { label: 'Premios', href: '#premios' },
    { label: 'Patrocinadores', href: '#patrocinadores' },
    { label: 'Contacto', href: '#contacto' },
  ]

  const legalLinks = [
    { label: 'Términos y Condiciones', href: '/terminos' },
    { label: 'Política de Privacidad', href: '/privacidad' },
    { label: 'Reglas del Sorteo', href: '/reglas' },
  ]

  return (
    <footer className="relative flex flex-col items-center w-full px-4 py-8">
      {/* Main Footer Content */}
      <div className="w-full backdrop-blur-md p-8 md:p-12 rounded-3xl bg-black/50 border border-white/20">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
          {/* About/Branding Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-6 h-6 text-blue-400" />
              <h3 className="text-2xl font-bold text-gray-100">
                Sorteo Colombia Tour
              </h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Gana un viaje todo incluido para dos personas a Colombia más un diseño de sonrisa completo. ¡Solo 500 números disponibles!
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-300 text-sm font-medium">
                Sorteo Transparente y Seguro
              </span>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold text-gray-100 mb-2">
              Navegación
            </h4>
            <nav className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-300 hover:text-white transition-colors duration-300 text-sm hover:translate-x-1 transform inline-block"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Legal Links Section */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold text-gray-100 mb-2">
              Legal
            </h4>
            <nav className="flex flex-col gap-3">
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-gray-300 hover:text-white transition-colors duration-300 text-sm hover:translate-x-1 transform inline-block"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Sorteo Colombia Tour. Todos los derechos reservados.
            </p>
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
              
              <span className="hidden md:inline text-gray-600">•</span>
              <a 
                href="https://www.ocreamer.studio/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-100 hover:text-white text-xs transition-colors duration-300"
              >
                Creado por <span className="font-semibold text-white hover:text-gray-200 hover:underline transition-colors duration-300 text-lg">Ocreamer Studio</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
