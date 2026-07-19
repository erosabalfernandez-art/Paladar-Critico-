import { Link, useLocation } from "wouter";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { useListCategories } from "@workspace/api-client-react";
import { MarqueeBanner } from "@/components/ui/marquee-banner";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: categories } = useListCategories();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="Paladar Crítico" className="h-20 w-20 object-contain transition-transform group-hover:scale-105" />
            <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
              Paladar Crítico<span className="text-primary">.</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {categories?.map((cat) => (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors tracking-wide uppercase"
              >
                {cat.name}
              </Link>
            ))}
            <button className="text-muted-foreground hover:text-primary transition-colors">
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </nav>

          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-4">
            {categories?.map((cat) => (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className="block text-sm font-medium text-foreground py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      <MarqueeBanner />

      <main className="flex-1">{children}</main>

      <footer className="bg-foreground text-background py-16">
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <img src="/logo.png" alt="Paladar Crítico" className="h-12 w-12 object-contain brightness-0 invert" />
              <span className="font-serif text-2xl font-bold tracking-tight">
                Paladar Crítico<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="text-muted max-w-sm font-serif italic">
              La referencia número uno en reseñas de productos culinarios, cursos y métodos. Analizamos el arte de cocinar para que tú solo disfrutes creando.
            </p>
          </div>
          <div>
            <h4 className="font-serif text-lg font-bold mb-6 text-primary">Navegación</h4>
            <ul className="space-y-4">
              {categories?.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/categoria/${cat.slug}`} className="text-muted hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-lg font-bold mb-6 text-primary">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="/privacidad" className="text-muted hover:text-white transition-colors">Aviso de Privacidad</Link></li>
              <li><Link href="/cookies" className="text-muted hover:text-white transition-colors">Política de Cookies</Link></li>
              <li><Link href="/afiliados" className="text-muted hover:text-white transition-colors">Aviso de Afiliados</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-6 mt-16 pt-8 border-t border-muted-foreground/20 text-sm text-muted text-center md:text-left">
          &copy; {new Date().getFullYear()} Paladar Crítico. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
