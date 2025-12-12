import React from 'react'
import { MessageCircle, Instagram, Music, Mail } from 'lucide-react'

function ContactInfo() {
  const contactLinks = [
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      href: 'https://wa.me/50661139008',
      color: 'text-green-400 hover:text-green-300',
      bgColor: 'hover:bg-green-500/10'
    },
    {
      icon: Mail,
      label: 'Email',
      href: 'mailto:Jeanpemos2@gmail.com',
      color: 'text-blue-400 hover:text-blue-300',
      bgColor: 'hover:bg-blue-500/10'
    },
    {
      icon: Instagram,
      label: 'Instagram Bubalu',
      href: 'https://www.instagram.com/bubalucocktail/',
      color: 'text-pink-400 hover:text-pink-300',
      bgColor: 'hover:bg-pink-500/10'
    },
    {
      icon: Instagram,
      label: 'Instagram Jean Pierre',
      href: 'https://www.instagram.com/jeanp277/',
      color: 'text-pink-400 hover:text-pink-300',
      bgColor: 'hover:bg-pink-500/10'
    },
    {
      icon: Music,
      label: 'TikTok Jean Pierre',
      href: 'https://www.tiktok.com/@jeanpierrre277',
      color: 'text-white hover:text-gray-200',
      bgColor: 'hover:bg-white/10'
    },
    {
      icon: Music,
      label: 'TikTok Bubalu',
      href: 'https://www.tiktok.com/@bubalucocktail',
      color: 'text-white hover:text-gray-200',
      bgColor: 'hover:bg-white/10'
    }
  ]

  return (
    <div className="relative flex flex-col items-center w-full px-4">
      {/* Content */}
      <div className="flex flex-col md:flex-row w-full items-center justify-around text-center gap-8 backdrop-blur p-8 rounded-3xl bg-black/50 border border-white/20 mb-8">
        {/* Section Title */}
        <div className="flex flex-col w-full lg:w-2/5 justify-center items-center md:items-start md:justify-start gap-4">
          <h2 className="text-gray-100 text-center md:text-left font-semibold text-4xl">
            Contacto
          </h2>
          
          {/* Description */}
          <p className="text-gray-100 text-center md:text-left text-lg">
            Síguenos en nuestras redes sociales o contáctanos directamente
          </p>
        </div>

        {/* Contact Buttons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full lg:w-3/5">
          {contactLinks.map((contact) => {
            const Icon = contact.icon
            return (
              <a
                key={contact.label}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={contact.label}
                className={`
                  flex flex-col items-center justify-center gap-3 p-6 
                  rounded-2xl border border-white/10 
                  ${contact.bgColor} 
                  backdrop-blur-sm
                  transition-all duration-300 
                  hover:scale-105 hover:border-white/30 hover:shadow-lg
                `}
              >
                <Icon className={`w-8 h-8 ${contact.color} transition-colors duration-300`} />
                <span className="text-gray-100 text-sm font-medium">
                  {contact.label}
                </span>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ContactInfo