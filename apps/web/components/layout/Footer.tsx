import Link from "next/link";
import { LogoChrome } from "@/components/brand/LogoChrome";

export function Footer() {
  return (
    <footer className="border-t border-gunmetal/60 bg-obsidian">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" aria-label="DILIGENCE — inicio">
            <LogoChrome width={300} />
          </Link>
          <p className="mt-1 max-w-xs text-sm leading-relaxed text-titanium">
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
              <span className="cursor-default">Envíos</span>
            </li>
            <li>
              <span className="cursor-default">Cambios y devoluciones</span>
            </li>
            <li>
              <span className="cursor-default">Contacto</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gunmetal/40 px-6 py-6 text-center text-[11px] uppercase tracking-[0.2em] text-titanium/60">
        © {new Date().getFullYear()} DILIGENCE — Todos los derechos reservados
      </div>
    </footer>
  );
}
