import type { Metadata } from 'next';
import { InfoPage, InfoSection } from '@/components/layout/InfoPage';

export const metadata: Metadata = {
  title: 'Política de privacidad',
  description: 'Tratamiento de datos personales en DILIGENCE.',
};

export default function PrivacidadPage() {
  return (
    <InfoPage eyebrow="Legal" title="Política de privacidad">
      <InfoSection title="Datos que recolectamos">
        <p>
          Al comprar o crear una cuenta recolectamos los datos necesarios para
          procesar tu pedido: nombre, documento, correo, teléfono y dirección
          de entrega. Los pagos son procesados por pasarelas certificadas; no
          almacenamos datos de tarjetas.
        </p>
      </InfoSection>

      <InfoSection title="Uso de la información">
        <p>
          Usamos tus datos para gestionar pedidos, envíos, cambios y soporte, y
          —solo si lo autorizas— para enviarte novedades y lanzamientos. Nunca
          vendemos tu información a terceros.
        </p>
      </InfoSection>

      <InfoSection title="Tus derechos (Habeas Data)">
        <p>
          De acuerdo con la Ley 1581 de 2012, puedes conocer, actualizar,
          rectificar o solicitar la eliminación de tus datos personales en
          cualquier momento escribiéndonos desde la página de contacto.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
