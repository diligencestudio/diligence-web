import type { Metadata } from 'next';
import Link from 'next/link';
import { InfoPage, InfoSection } from '@/components/layout/InfoPage';

export const metadata: Metadata = {
  title: 'Términos y condiciones',
  description: 'Términos y condiciones de compra en DILIGENCE.',
};

export default function TerminosPage() {
  return (
    <InfoPage eyebrow="Legal" title="Términos y condiciones">
      <InfoSection title="Compras">
        <p>
          Los precios están expresados en pesos colombianos (COP) e incluyen
          los impuestos aplicables. Un pedido se considera confirmado una vez
          la pasarela de pagos aprueba la transacción.
        </p>
      </InfoSection>

      <InfoSection title="Disponibilidad">
        <p>
          Nuestras colecciones se producen en tirajes limitados. Si por error
          de inventario un producto no está disponible tras tu compra, te lo
          notificaremos y reembolsaremos el valor total.
        </p>
      </InfoSection>

      <InfoSection title="Cambios y devoluciones">
        <p>
          Aplican las condiciones descritas en la página de{' '}
          <Link
            href="/devoluciones"
            className="text-chrome underline-offset-4 hover:underline"
          >
            cambios y devoluciones
          </Link>
          .
        </p>
      </InfoSection>

      <InfoSection title="Propiedad intelectual">
        <p>
          Todo el contenido de este sitio —marca, logotipos, fotografías y
          diseños— es propiedad de DILIGENCE y no puede reproducirse sin
          autorización escrita.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
