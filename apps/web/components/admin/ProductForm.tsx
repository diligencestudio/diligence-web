'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { CollectionDTO, ProductDTO, ProductSection } from '@diligence/contracts';
import { Button } from '@diligence/ui';
import { adminApi } from '@/lib/admin';

const field =
  'w-full border border-gunmetal bg-transparent px-3 py-2 text-sm text-pure outline-none focus:border-chrome';
const label = 'mb-1 block text-[11px] uppercase tracking-[0.2em] text-titanium';

interface Img {
  url: string;
  alt: string;
}

export function ProductForm({ product }: { product?: ProductDTO }) {
  const router = useRouter();
  const editing = !!product;
  const [collections, setCollections] = useState<CollectionDTO[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [f, setF] = useState({
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    description: product?.description ?? '',
    price: product ? String(product.priceInCents / 100) : '',
    compareAt: product?.compareAtPriceInCents ? String(product.compareAtPriceInCents / 100) : '',
    section: (product?.section ?? 'unisex') as ProductSection,
    category: product?.category ?? '',
    collection: product?.collection ?? '',
    sizes: product?.sizes.join(', ') ?? '',
    colors: product?.colors.join(', ') ?? '',
    stock: product ? String(product.stock) : '0',
    featured: product?.featured ?? false,
    isBasic: product?.isBasic ?? false,
    isBlank: product?.isBlank ?? false,
    onSale: product?.onSale ?? false,
    active: true,
  });
  const [images, setImages] = useState<Img[]>(product?.images ?? []);

  useEffect(() => {
    adminApi.listCollections().then(setCollections).catch(() => {});
  }, []);

  const set = (k: keyof typeof f, v: string | boolean) => setF((s) => ({ ...s, [k]: v }));

  const slugify = (v: string) =>
    v.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const onUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const url = await adminApi.uploadImage(file);
        setImages((prev) => [...prev, { url, alt: f.name || 'DILIGENCE' }]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error subiendo imagen');
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const body: Record<string, unknown> = {
      name: f.name,
      slug: f.slug || slugify(f.name),
      description: f.description,
      priceInCents: Math.round(Number(f.price) * 100),
      compareAtPriceInCents: f.compareAt ? Math.round(Number(f.compareAt) * 100) : null,
      section: f.section,
      category: f.category,
      collection: f.collection || null,
      sizes: f.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      colors: f.colors.split(',').map((s) => s.trim()).filter(Boolean),
      stock: Number(f.stock),
      featured: f.featured,
      isBasic: f.isBasic,
      isBlank: f.isBlank,
      onSale: f.onSale,
      active: f.active,
      images,
    };
    try {
      if (editing) await adminApi.updateProduct(product.id, body);
      else await adminApi.createProduct(body);
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error guardando');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <h1 className="wordmark text-2xl text-pure">
        {editing ? 'Editar producto' : 'Nuevo producto'}
      </h1>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className={label}>Nombre</label>
          <input className={field} required value={f.name}
            onChange={(e) => { set('name', e.target.value); if (!editing) set('slug', slugify(e.target.value)); }} />
        </div>
        <div>
          <label className={label}>Slug (URL)</label>
          <input className={field} value={f.slug} onChange={(e) => set('slug', e.target.value)} />
        </div>
      </div>

      <div>
        <label className={label}>Descripción</label>
        <textarea className={`${field} min-h-24`} value={f.description} onChange={(e) => set('description', e.target.value)} />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className={label}>Precio (COP)</label>
          <input className={field} type="number" min="0" required value={f.price} onChange={(e) => set('price', e.target.value)} />
        </div>
        <div>
          <label className={label}>Precio anterior (sale)</label>
          <input className={field} type="number" min="0" value={f.compareAt} onChange={(e) => set('compareAt', e.target.value)} />
        </div>
        <div>
          <label className={label}>Stock</label>
          <input className={field} type="number" min="0" value={f.stock} onChange={(e) => set('stock', e.target.value)} />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className={label}>Sección</label>
          <select className={field} value={f.section} onChange={(e) => set('section', e.target.value)}>
            <option value="hombre">Hombre</option>
            <option value="mujer">Mujer</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>
        <div>
          <label className={label}>Categoría</label>
          <input className={field} required placeholder="hoodies, denim…" value={f.category} onChange={(e) => set('category', e.target.value)} />
        </div>
        <div>
          <label className={label}>Colección</label>
          <select className={field} value={f.collection} onChange={(e) => set('collection', e.target.value)}>
            <option value="">— Ninguna —</option>
            {collections.map((c) => <option key={c.id} value={c.slug}>{c.title}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className={label}>Tallas (separadas por coma)</label>
          <input className={field} placeholder="S, M, L, XL" value={f.sizes} onChange={(e) => set('sizes', e.target.value)} />
        </div>
        <div>
          <label className={label}>Colores (separados por coma)</label>
          <input className={field} placeholder="Obsidian Black, Graphite" value={f.colors} onChange={(e) => set('colors', e.target.value)} />
        </div>
      </div>

      {/* Imágenes */}
      <div>
        <label className={label}>Imágenes</label>
        <div className="flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div key={i} className="relative h-28 w-24 overflow-hidden border border-gunmetal bg-gunmetal">
              <Image src={img.url} alt={img.alt} fill sizes="96px" className="object-cover" />
              <button type="button" onClick={() => setImages((p) => p.filter((_, idx) => idx !== i))}
                className="absolute right-1 top-1 bg-obsidian/80 px-1 text-xs text-pure">✕</button>
            </div>
          ))}
          <label className="flex h-28 w-24 cursor-pointer items-center justify-center border border-dashed border-titanium/50 text-center text-[10px] uppercase tracking-widest text-titanium hover:border-chrome hover:text-pure">
            {uploading ? 'Subiendo…' : '+ Subir'}
            <input type="file" accept="image/*" multiple hidden onChange={(e) => onUpload(e.target.files)} />
          </label>
        </div>
      </div>

      {/* Flags */}
      <div className="flex flex-wrap gap-6 text-sm text-chrome">
        {([['featured', 'Destacado'], ['onSale', 'En sale'], ['isBasic', 'Básico'], ['isBlank', 'Blank'], ['active', 'Visible']] as const).map(([k, lbl]) => (
          <label key={k} className="flex items-center gap-2">
            <input type="checkbox" checked={f[k] as boolean} onChange={(e) => set(k, e.target.checked)} />
            {lbl}
          </label>
        ))}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-4">
        <Button type="submit" variant="primary" disabled={saving || uploading}>
          {saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear producto'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push('/admin')}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
