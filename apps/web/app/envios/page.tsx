import type { Metadata } from 'next';
import { InfoPage, InfoSection } from '@/components/layout/InfoPage';

export const metadata: Metadata = {
  title: 'Envíos',
  description: 'Cobertura, tiempos de entrega y seguimiento de pedidos DILIGENCE.',
};

export default function EnviosPage() {
  return (
    <InfoPage eyebrow="Soporte" title="Envíos">
      <InfoSection title="Cobertura">
        <p>
          Realizamos envíos a todo Colombia a través de transportadoras aliadas.
          Cada pedido se despacha desde nuestra bodega una vez confirmado el
          pago.
        </p>
      </InfoSection>

      <InfoSection title="Tiempos de entrega">
        <p>
          En ciudades principales la entrega toma entre 2 y 4 días hábiles. En
          el resto del país, entre 4 y 8 días hábiles según la zona. Los
          tiempos se cuentan a partir de la confirmación del pago.
        </p>
        <p>
          Durante lanzamientos y fechas de alta demanda los despachos pueden
          tomar tiempo adicional; te mantendremos informado en todo momento.
        </p>
      </InfoSection>

      <InfoSection title="Seguimiento">
        <p>
          Al despachar tu pedido recibirás por correo el número de guía para
          rastrearlo directamente con la transportadora. También puedes
          consultar el estado de tus pedidos desde tu cuenta.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
