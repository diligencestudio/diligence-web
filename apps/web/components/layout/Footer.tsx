import Link from "next/link";
import { LogoChrome } from "@/components/brand/LogoChrome";

export function Footer() {
  return (
    <footer className="border-t border-gunmetal/60 bg-obsidian">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          {/* Pequeño a propósito: el video fuente es de 414px y a más tamaño se pixela. */}
          <Link href="/" aria-label="DILIGENCE — inicio" className="inline-block">
            <LogoChrome width={140} />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-titanium">
            Luxury streetwear. El éxito atrae la mirada; la diligencia lo
            sostiene. Cada prenda, una representación del poder, la disciplina y
            la ambición.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-[11px] uppercase tracking-[0.25em] text-chrome">
            Tienda
          </h4>
          <ul className="space-y-3 text-sm text-titanium">
            <li>
              <Link href="/hombre" className="hover:text-pure">
                Hombre
              </Link>
            </li>
            <li>
              <Link href="/mujer" className="hover:text-pure">
                Mujer
              </Link>
            </li>
            <li>
              <Link href="/colecciones" className="hover:text-pure">
                Colecciones
              </Link>
            </li>
            <li>
              <Link href="/basicos" className="hover:text-pure">
                Básicos
              </Link>
            </li>
            <li>
              <Link href="/blanks" className="hover:text-pure">
                Blanks
              </Link>
            </li>
            <li>
              <Link href="/sale" className="hover:text-pure">
                Sale
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-[11px] uppercase tracking-[0.25em] text-chrome">
            Soporte
          </h4>
          <ul className="space-y-3 text-sm text-titanium">
            <li>
              <Link href="/envios" className="hover:text-pure">
                Envíos
              </Link>
            </li>
            <li>
              <Link href="/devoluciones" className="hover:text-pure">
                Cambios y devoluciones
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:text-pure">
                Contacto
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center gap-3 border-t border-gunmetal/40 px-6 py-6 text-center text-[11px] uppercase tracking-[0.2em] text-titanium/60 md:flex-row md:justify-between">
        <span>
          © {new Date().getFullYear()} DILIGENCE — Todos los derechos reservados
        </span>
        <nav className="flex items-center gap-5">
          <Link href="/privacidad" className="hover:text-pure">
            Privacidad
          </Link>
          <Link href="/terminos" className="hover:text-pure">
            Términos
          </Link>
        </nav>
      </div>
    </footer>
  );
}
