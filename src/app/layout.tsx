import type { Metadata } from 'next';
import { Poppins, Playfair_Display } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const playfairDisplay = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Sorteo - Gana un viaje a Colombia + Diseño de Sonrisa',
  description: '¡Gana un viaje todo incluido para dos personas a Colombia más un diseño de sonrisa! Sortearemos únicamente 500 números.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <Script
          src="https://app.tilopay.com/sdk/v2/sdk_tpay.min.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${poppins.variable} ${playfairDisplay.variable}`}>
        {children}
      </body>
    </html>
  )
}