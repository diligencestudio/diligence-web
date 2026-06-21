'use client';

import { use, useEffect, useState } from 'react';
import type { CollectionDTO } from '@diligence/contracts';
import { adminApi } from '@/lib/admin';
import { CollectionForm } from '@/components/admin/CollectionForm';

export default function EditarColeccionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [collection, setCollection] = useState<CollectionDTO | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    adminApi
      .listCollections()
      .then((all) => {
        const found = all.find((c) => c.id === id);
        if (found) setCollection(found);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) return <p className="text-sm text-titanium">Colección no encontrada.</p>;
  if (!collection) return <p className="text-sm text-titanium">Cargando…</p>;
  return <CollectionForm collection={collection} />;
}
