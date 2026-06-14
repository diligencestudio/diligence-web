# DILIGENCE

E-commerce premium de estética monocromática (lujo oscuro). Monorepo full-TypeScript
con **Next.js** (storefront), **NestJS + MongoDB** (API) y pagos con **Wompi** (Colombia),
aplicando **SOLID / Clean Architecture**.

## Stack

| Capa        | Tecnología |
|-------------|------------|
| Frontend    | Next.js 15 (App Router), Tailwind v4, Framer Motion, Zustand, Lenis |
| Backend     | NestJS 10, Mongoose, Swagger, Zod (validación de env), Pino |
| Base datos  | MongoDB 7 (docker) |
| Pagos       | Wompi — Web Checkout + webhooks firmados |
| Monorepo    | npm workspaces + Turborepo |

## Estructura

```
diligence/
├── apps/
│   ├── web/   # Storefront Next.js
│   └── api/   # API NestJS (módulos catalog · orders · payments)
├── packages/
│   ├── ui/        # Design system de marca (tokens, MetalText, Wordmark, Button)
│   ├── contracts/ # Tipos/DTOs compartidos web ↔ api
│   └── config/    # tsconfig base compartido
└── docker-compose.yml
```

Cada módulo de la API sigue 4 capas: `domain` (entidades + puertos) ·
`application` (casos de uso) · `infrastructure` (Mongoose, Wompi) · `presentation`
(controllers). La lógica depende de **abstracciones** (`ProductRepository`,
`PaymentProvider`), enlazadas a la implementación concreta vía DI (DIP/OCP/LSP).

## Puesta en marcha

```bash
# 1. Variables de entorno
cp .env.example .env          # ajusta las llaves de Wompi (sandbox)

# 2. Dependencias
npm install

# 3. Base de datos (MongoDB en el puerto host 27018)
npm run db:up

# 4. Datos demo
npm run seed

# 5. Levantar todo (web :3000 + api :4000)
npm run dev
```

- Storefront: http://localhost:3000
- API: http://localhost:4000/api
- Swagger: http://localhost:4000/docs
- Mongo Express (opcional): `docker compose up -d mongo-express` → http://localhost:8081

## Configurar Wompi (sandbox)

En `.env` completa con las llaves del ambiente de pruebas de tu dashboard de Wompi:

```
WOMPI_PUBLIC_KEY=pub_test_...
WOMPI_PRIVATE_KEY=prv_test_...
WOMPI_INTEGRITY_SECRET=test_integrity_...
WOMPI_EVENTS_SECRET=test_events_...
```

Flujo: `POST /api/checkout` recalcula el monto desde la BD, crea la orden (`PENDING`),
genera la **firma de integridad** `SHA256(reference+amount+currency+secret)` y devuelve
la URL del Web Checkout. Wompi notifica el resultado en `POST /api/payments/wompi/webhook`
(checksum verificado) y la orden pasa a `APPROVED`/`DECLINED`.

> El webhook necesita ser accesible públicamente para recibir eventos reales de Wompi:
> usa un túnel (p.ej. `cloudflared`/`ngrok`) apuntando a `:4000` durante el desarrollo.

## Tests

```bash
npm test -w @diligence/api    # unit: firma Wompi, verificador de webhook, checkout
```

## Scripts útiles

| Comando | Acción |
|---------|--------|
| `npm run dev` | Web + API en paralelo (Turbo) |
| `npm run build` | Build de todo el monorepo |
| `npm run db:up` / `db:down` | Arranca/baja MongoDB |
| `npm run seed` | Carga colecciones y productos demo |
