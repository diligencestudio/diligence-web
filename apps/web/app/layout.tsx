import type { Metadata } from 'next';
import { Cinzel, Outfit } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SmoothScroll } from '@/components/SmoothScroll';
import './globals.css';

const display = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Outfit({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    default: 'DILIGENCE — Lujo oscuro. Precisión absoluta.',
    template: '%s · DILIGENCE',
  },
  description:
    'DILIGENCE — moda premium de estética monocromática. Cortes arquitectónicos, materiales de peso, acabados metálicos.',
  openGraph: {
    title: 'DILIGENCE',
    description: 'Lujo oscuro. Precisión absoluta.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <body className="bg-obsidian text-chrome antialiased">
        <SmoothScroll />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
