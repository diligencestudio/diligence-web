import type { Metadata } from 'next';
import { InfoPage, InfoSection } from '@/components/layout/InfoPage';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Habla con el equipo DILIGENCE.',
};

// TODO: confirmar correo y redes definitivas de la marca.
const CONTACT_EMAIL = 'contacto@diligence.com.co';
const INSTAGRAM_URL = 'https://instagram.com/diligence';

export default function ContactoPage() {
  return (
    <InfoPage eyebrow="Soporte" title="Contacto">
      <InfoSection title="Correo">
        <p>
          Para pedidos, cambios, alianzas o prensa, escríbenos a{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-chrome underline-offset-4 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
          . Respondemos en un plazo máximo de 2 días hábiles.
        </p>
      </InfoSection>

      <InfoSection title="Redes">
        <p>
          Síguenos en{' '}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-chrome underline-offset-4 hover:underline"
          >
            Instagram
          </a>{' '}
          para lanzamientos, drops y contenido de la marca.
        </p>
      </InfoSection>

      <InfoSection title="Horario de atención">
        <p>Lunes a viernes, 9:00 a. m. — 6:00 p. m. (hora Colombia).</p>
      </InfoSection>
    </InfoPage>
  );
}
