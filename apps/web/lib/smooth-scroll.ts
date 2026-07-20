import type Lenis from 'lenis';

/**
 * Singleton de la instancia global de Lenis. `SmoothScroll` la registra al montar
 * y componentes como el Hero la usan para hacer scroll programático suave.
 */
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const getLenis = () => instance;
