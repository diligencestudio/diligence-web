/**
 * Modo "lanzamiento / coming soon".
 * Cuando NEXT_PUBLIC_LAUNCH_MODE === 'true', el sitio público muestra SOLO el
 * hero con el contador y bloquea el scroll. El resto del sitio sigue en el código
 * (no se pierde nada) y el panel /admin sigue funcionando normalmente.
 * Para abrir la tienda: pon la variable en 'false' (o quítala) y redeploy.
 */
export const LAUNCH_MODE = process.env.NEXT_PUBLIC_LAUNCH_MODE === 'true';
