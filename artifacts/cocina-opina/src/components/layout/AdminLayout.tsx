import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { BookOpen, FolderTree, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const sessionId = localStorage.getItem("admin-session");
    if (!sessionId) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const sessionId = localStorage.getItem("admin-session");
  if (!sessionId) return null;

  const handleLogout = () => {
    localStorage.removeItem("admin-session");
    setLocation("/admin/login");
  };

  return (
    <div className="min-h-[100dvh] flex bg-muted/30">
      <aside className="w-64 bg-background border-r border-border flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2">
            <img src="/logo.png" alt="Paladar Crítico" className="h-8 w-8 object-contain" />
            <span className="font-serif text-lg font-bold">
              Paladar Crítico{" "}
              <span className="text-primary text-xs ml-1 uppercase tracking-widest font-sans">Admin</span>
            </span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-foreground">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-primary/10 text-primary">
            <BookOpen className="h-4 w-4" />
            Productos
          </Link>
          <span className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-foreground opacity-50 cursor-not-allowed">
            <FolderTree className="h-4 w-4" />
            Categorías
          </span>
          <span className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-foreground opacity-50 cursor-not-allowed">
            <Settings className="h-4 w-4" />
            Configuración
          </span>
        </nav>
        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <header className="h-16 bg-background border-b border-border flex items-center px-8 justify-between shrink-0">
          <h1 className="font-serif text-xl">Panel de Control</h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-serif italic">
              A
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
