'use client';

import { use, useEffect, useState } from 'react';
import type { ProductDTO } from '@diligence/contracts';
import { adminApi } from '@/lib/admin';
import { ProductForm } from '@/components/admin/ProductForm';

export default function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    adminApi
      .listProducts()
      .then((all) => {
        const found = all.find((p) => p.id === id);
        if (found) setProduct(found);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) return <p className="text-sm text-titanium">Producto no encontrado.</p>;
  if (!product) return <p className="text-sm text-titanium">Cargando…</p>;
  return <ProductForm product={product} />;
}
