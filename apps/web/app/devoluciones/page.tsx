import type { Metadata } from 'next';
import Link from 'next/link';
import { InfoPage, InfoSection } from '@/components/layout/InfoPage';

export const metadata: Metadata = {
  title: 'Cambios y devoluciones',
  description: 'Política de cambios y devoluciones de DILIGENCE.',
};

export default function DevolucionesPage() {
  return (
    <InfoPage eyebrow="Soporte" title="Cambios y devoluciones">
      <InfoSection title="Plazo">
        <p>
          Tienes 30 días calendario desde la fecha de entrega para solicitar un
          cambio de talla o referencia, y 5 días hábiles para ejercer el
          derecho de retracto según la ley colombiana.
        </p>
      </InfoSection>

      <InfoSection title="Condiciones">
        <p>
          La prenda debe estar sin uso, sin lavar y en perfecto estado, con sus
          etiquetas y empaque originales. Por higiene, algunas categorías pueden
          estar excluidas de cambio.
        </p>
      </InfoSection>

      <InfoSection title="Cómo solicitarlo">
        <p>
          Escríbenos a través de la página de{' '}
          <Link href="/contacto" className="text-chrome underline-offset-4 hover:underline">
            contacto
          </Link>{' '}
          indicando tu número de pedido y el motivo. Te responderemos con las
          instrucciones y la guía de envío correspondiente.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
