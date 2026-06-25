'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { AccountDTO, OrderDTO, OrderStatus } from '@diligence/contracts';
import { Button, MetalText } from '@diligence/ui';
import { accountApi, accountToken } from '@/lib/account';
import { formatCOP } from '@/lib/format';

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobado',
  DECLINED: 'Rechazado',
  VOIDED: 'Anulado',
  ERROR: 'Error',
};

const inputCls =
  'w-full border border-gunmetal bg-transparent px-4 py-3 text-sm text-pure outline-none transition-colors focus:border-chrome';
const labelCls = 'mb-2 block text-[11px] uppercase tracking-[0.25em] text-titanium';

export default function CuentaPage() {
  return (
    <Suspense fallback={<div className="pt-40 text-center text-sm text-titanium">Cargando…</div>}>
      <CuentaContent />
    </Suspense>
  );
}

function CuentaContent() {
  const params = useSearchParams();
  // Cuando se llega desde el CTA de lanzamiento (/cuenta?registro=1) abrimos
  // directamente el formulario de registro.
  const initialMode = params.get('registro') === '1' ? 'register' : 'login';
  const [ready, setReady] = useState(false);
  const [account, setAccount] = useState<AccountDTO | null>(null);
  const [orders, setOrders] = useState<OrderDTO[]>([]);

  useEffect(() => {
    if (!accountToken.get()) {
      setReady(true);
      return;
    }
    accountApi
      .me()
      .then(async (acc) => {
        setAccount(acc);
        setOrders(await accountApi.orders().catch(() => []));
      })
      .catch(() => accountToken.clear())
      .finally(() => setReady(true));
  }, []);

  const onAuth = async (acc: AccountDTO) => {
    setAccount(acc);
    setOrders(await accountApi.orders().catch(() => []));
  };

  const logout = () => {
    accountApi.logout();
    setAccount(null);
    setOrders([]);
  };

  if (!ready) {
    return <div className="pt-40 text-center text-sm text-titanium">Cargando…</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-6 pb-24 pt-32">
      {account ? (
        <Dashboard account={account} orders={orders} onLogout={logout} />
      ) : (
        <AuthForms onAuth={onAuth} initialMode={initialMode} />
      )}
    </div>
  );
}

/* ── Login / Registro ──────────────────────────────────────────────────────── */

function AuthForms({
  onAuth,
  initialMode = 'login',
}: {
  onAuth: (a: AccountDTO) => void;
  initialMode?: 'login' | 'register';
}) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [form, setForm] = useState({ email: '', password: '', fullName: '', phone: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res =
        mode === 'login'
          ? await accountApi.login(form.email, form.password)
          : await accountApi.register(form);
      onAuth(res.account);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error');
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-10 text-center">
        <MetalText as="h1" className="wordmark text-3xl">
          {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
        </MetalText>
        <p className="mt-3 text-sm text-titanium">
          {mode === 'login'
            ? 'Accede a tu cuenta DILIGENCE.'
            : 'Únete a DILIGENCE y sigue tus pedidos.'}
        </p>
      </div>

      <form onSubmit={submit} className="space-y-5">
        {mode === 'register' && (
          <div>
            <label className={labelCls}>Nombre completo</label>
            <input required className={inputCls} value={form.fullName} onChange={set('fullName')} />
          </div>
        )}
        <div>
          <label className={labelCls}>Correo electrónico</label>
          <input required type="email" className={inputCls} value={form.email} onChange={set('email')} />
        </div>
        {mode === 'register' && (
          <div>
            <label className={labelCls}>Teléfono</label>
            <input type="tel" className={inputCls} value={form.phone} onChange={set('phone')} />
          </div>
        )}
        <div>
          <label className={labelCls}>Contraseña</label>
          <input
            required
            type="password"
            minLength={6}
            className={inputCls}
            value={form.password}
            onChange={set('password')}
          />
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? 'Un momento…' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
        </Button>
      </form>

      <button
        onClick={() => {
          setMode((m) => (m === 'login' ? 'register' : 'login'));
          setError(null);
        }}
        className="mt-8 w-full text-center text-[11px] uppercase tracking-[0.2em] text-titanium hover:text-pure"
      >
        {mode === 'login'
          ? '¿No tienes cuenta? Crear una'
          : '¿Ya tienes cuenta? Inicia sesión'}
      </button>
    </div>
  );
}

/* ── Dashboard ─────────────────────────────────────────────────────────────── */

function Dashboard({
  account,
  orders,
  onLogout,
}: {
  account: AccountDTO;
  orders: OrderDTO[];
  onLogout: () => void;
}) {
  return (
    <div>
      <div className="mb-12 flex items-end justify-between border-b border-gunmetal/60 pb-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.4em] text-titanium">Tu cuenta</p>
          <MetalText as="h1" className="mt-2 wordmark text-3xl">
            {account.fullName}
          </MetalText>
        </div>
        <button
          onClick={onLogout}
          className="text-[11px] uppercase tracking-[0.2em] text-titanium hover:text-pure"
        >
          Cerrar sesión
        </button>
      </div>

      <section className="mb-12">
        <h2 className="mb-4 text-[11px] uppercase tracking-[0.3em] text-chrome">Datos</h2>
        <dl className="space-y-2 text-sm text-titanium">
          <div className="flex justify-between">
            <dt>Correo</dt>
            <dd className="text-pure">{account.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Teléfono</dt>
            <dd className="text-pure">{account.phone || '—'}</dd>
          </div>
        </dl>
      </section>

      <section>
        <h2 className="mb-4 text-[11px] uppercase tracking-[0.3em] text-chrome">
          Historial de pedidos
        </h2>
        {orders.length === 0 ? (
          <p className="py-10 text-center text-sm text-titanium">
            Aún no tienes pedidos.
          </p>
        ) : (
          <ul className="divide-y divide-gunmetal/50">
            {orders.map((o) => (
              <li key={o.id} className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm text-pure">{o.reference}</p>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-titanium">
                    {new Date(o.createdAt).toLocaleDateString('es-CO')} ·{' '}
                    {o.items.reduce((n, i) => n + i.quantity, 0)} artículo(s)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-chrome">{formatCOP(o.amountInCents)}</p>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-titanium">
                    {STATUS_LABEL[o.status]}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
