import type { Metadata } from 'next';
import Link from 'next/link';
import { Button, MetalText } from '@diligence/ui';

export const metadata: Metadata = {
  title: 'Cuenta',
  description: 'Tu cuenta DILIGENCE.',
};

export default function CuentaPage() {
  return (
    <div className="mx-auto max-w-md px-6 pb-24 pt-40 text-center">
      <MetalText as="h1" className="wordmark text-3xl">
        Cuenta
      </MetalText>
      <p className="mt-5 text-sm text-titanium">
        El acceso a cuentas estará disponible próximamente. Por ahora puedes comprar
        como invitado: tus datos se piden al finalizar la compra.
      </p>
      <Link href="/tienda" className="mt-8 inline-block">
        <Button variant="outline">Ir a la tienda</Button>
      </Link>
    </div>
  );
}
