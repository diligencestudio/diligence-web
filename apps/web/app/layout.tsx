import type { Metadata } from 'next';
import { Cinzel, Outfit } from 'next/font/google';
import { StorefrontChrome } from '@/components/layout/StorefrontChrome';
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'DILIGENCE — Luxury streetwear',
    template: '%s · DILIGENCE',
  },
  description:
    'DILIGENCE — luxury streetwear. El éxito atrae la mirada; la diligencia lo sostiene. Cada prenda es una representación del poder, la disciplina y la ambición.',
  openGraph: {
    title: 'DILIGENCE — Luxury streetwear',
    description: 'El éxito atrae la mirada. La diligencia lo sostiene.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <body className="bg-obsidian text-chrome antialiased">
        <StorefrontChrome>{children}</StorefrontChrome>
      </body>
    </html>
  );
}
