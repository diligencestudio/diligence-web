import { z } from 'zod';

/**
 * Esquema único y tipado de todas las variables de entorno.
 * Si falta o es inválida una variable, la app no arranca (fail-fast).
 */
export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  API_PORT: z.coerce.number().int().positive().default(4000),

  MONGODB_URI: z.string().min(1, 'MONGODB_URI es obligatoria'),

  WEB_URL: z.string().url().default('http://localhost:3000'),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:3000')
    .transform((value) => value.split(',').map((o) => o.trim()).filter(Boolean)),

  // Wompi (sandbox). Opcionales en arranque para no bloquear Fases 0-3.
  WOMPI_BASE_URL: z.string().url().default('https://sandbox.wompi.co/v1'),
  WOMPI_PUBLIC_KEY: z.string().default(''),
  WOMPI_PRIVATE_KEY: z.string().default(''),
  WOMPI_INTEGRITY_SECRET: z.string().default(''),
  WOMPI_EVENTS_SECRET: z.string().default(''),
  WOMPI_CHECKOUT_URL: z.string().url().default('https://checkout.wompi.co/p/'),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const parsed = envSchema.safeParse(config);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`Variables de entorno inválidas:\n${issues}`);
  }
  return parsed.data;
}
