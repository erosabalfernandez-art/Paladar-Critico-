import { useState } from "react";
import { useLocation } from "wouter";
import { useAdminLogin } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AdminLogin() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const login = useAdminLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      { data: { password } },
      {
        onSuccess: (data) => {
          if (data.sessionId) {
            localStorage.setItem("admin-session", data.sessionId);
          }
          toast.success("Bienvenido de nuevo");
          setLocation("/admin");
        },
        onError: () => {
          toast.error("Contraseña incorrecta");
        },
      }
    );
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-6">
          <img src="/logo.png" alt="Paladar Crítico" className="h-20 w-20 object-contain" />
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-tight">Paladar Crítico</h1>
        <p className="text-muted-foreground uppercase tracking-widest text-sm mt-2 font-medium">Panel de Administración</p>
      </div>

      <Card className="w-full max-w-sm border-none shadow-xl shadow-foreground/5 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="font-serif text-2xl">Acceso Seguro</CardTitle>
          <CardDescription>Introduce tu contraseña para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-center text-lg tracking-widest bg-background"
                disabled={login.isPending}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full text-base" 
              disabled={!password || login.isPending}
            >
              {login.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
