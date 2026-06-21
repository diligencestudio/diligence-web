'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { CollectionDTO } from '@diligence/contracts';
import { Button } from '@diligence/ui';
import { adminApi } from '@/lib/admin';

const field =
  'w-full border border-gunmetal bg-transparent px-3 py-2 text-sm text-pure outline-none focus:border-chrome';
const label = 'mb-1 block text-[11px] uppercase tracking-[0.2em] text-titanium';

const slugify = (v: string) =>
  v.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export function CollectionForm({ collection }: { collection?: CollectionDTO }) {
  const router = useRouter();
  const editing = !!collection;
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [f, setF] = useState({
    title: collection?.title ?? '',
    slug: collection?.slug ?? '',
    description: collection?.description ?? '',
    order: collection ? String(collection.order) : '0',
  });
  const [heroImage, setHeroImage] = useState<string | null>(collection?.heroImage ?? null);

  const set = (k: keyof typeof f, v: string) => setF((s) => ({ ...s, [k]: v }));

  const onUpload = async (file?: File | null) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      setHeroImage(await adminApi.uploadImage(file));
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
      title: f.title,
      slug: f.slug || slugify(f.title),
      description: f.description,
      order: Number(f.order),
      heroImage,
    };
    try {
      if (editing) await adminApi.updateCollection(collection.id, body);
      else await adminApi.createCollection(body);
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error guardando');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-xl space-y-6">
      <h1 className="wordmark text-2xl text-pure">
        {editing ? 'Editar colección' : 'Nueva colección'}
      </h1>

      <div>
        <label className={label}>Título</label>
        <input className={field} required value={f.title}
          onChange={(e) => { set('title', e.target.value); if (!editing) set('slug', slugify(e.target.value)); }} />
      </div>
      <div>
        <label className={label}>Slug (URL)</label>
        <input className={field} value={f.slug} onChange={(e) => set('slug', e.target.value)} />
      </div>
      <div>
        <label className={label}>Descripción</label>
        <textarea className={`${field} min-h-20`} value={f.description} onChange={(e) => set('description', e.target.value)} />
      </div>
      <div>
        <label className={label}>Orden</label>
        <input className={field} type="number" value={f.order} onChange={(e) => set('order', e.target.value)} />
      </div>

      <div>
        <label className={label}>Imagen hero</label>
        <div className="flex items-end gap-4">
          {heroImage && (
            <div className="relative h-28 w-40 overflow-hidden border border-gunmetal bg-gunmetal">
              <Image src={heroImage} alt="hero" fill sizes="160px" className="object-cover" />
              <button type="button" onClick={() => setHeroImage(null)} className="absolute right-1 top-1 bg-obsidian/80 px-1 text-xs text-pure">✕</button>
            </div>
          )}
          <label className="flex h-28 w-40 cursor-pointer items-center justify-center border border-dashed border-titanium/50 text-[10px] uppercase tracking-widest text-titanium hover:border-chrome hover:text-pure">
            {uploading ? 'Subiendo…' : heroImage ? 'Reemplazar' : '+ Subir'}
            <input type="file" accept="image/*" hidden onChange={(e) => onUpload(e.target.files?.[0])} />
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-4">
        <Button type="submit" variant="primary" disabled={saving || uploading}>
          {saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear colección'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push('/admin')}>Cancelar</Button>
      </div>
    </form>
  );
}
