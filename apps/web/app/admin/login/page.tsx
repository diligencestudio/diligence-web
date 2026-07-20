'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, MetalText } from '@diligence/ui';
import { adminApi } from '@/lib/admin';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await adminApi.login(email, password);
      router.replace('/admin');
    } catch {
      setError('Credenciales incorrectas.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <MetalText as="h1" className="wordmark text-2xl">
            DILIGENCE
          </MetalText>
          <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-titanium">
            Panel de administración
          </p>
        </div>

        <label className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-titanium">
          Correo
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-5 w-full border border-gunmetal bg-transparent px-4 py-3 text-sm text-pure outline-none focus:border-chrome"
        />

        <label className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-titanium">
          Contraseña
        </label>
        <div className="relative mb-6">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gunmetal bg-transparent px-4 py-3 pr-16 text-sm text-pure outline-none focus:border-chrome"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute inset-y-0 right-0 flex items-center px-4 text-[10px] uppercase tracking-[0.2em] text-titanium hover:text-pure"
          >
            {showPassword ? 'Ocultar' : 'Ver'}
          </button>
        </div>

        {error && <p className="mb-4 text-xs text-red-400">{error}</p>}

        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
    </div>
  );
}
