import { useState } from "react";
import { useListCategories } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2, Plus, Loader2, Tags, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

async function createCategory(data: { name: string; slug: string; description?: string }) {
  const sessionId = localStorage.getItem("admin-session");
  const res = await fetch(`${API_BASE}/api/admin/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(sessionId ? { "x-session-id": sessionId } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear la categoría");
  return res.json();
}

async function deleteCategory(id: number) {
  const sessionId = localStorage.getItem("admin-session");
  const res = await fetch(`${API_BASE}/api/admin/categories/${id}`, {
    method: "DELETE",
    headers: sessionId ? { "x-session-id": sessionId } : {},
  });
  if (!res.ok) throw new Error("Error al eliminar la categoría");
}

function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function AdminCategories() {
  const { data: categories, isLoading, refetch } = useListCategories();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const queryClient = useQueryClient();

  const handleNameChange = (v: string) => {
    setName(v);
    setSlug(toSlug(v));
  };

  const handleCreate = async () => {
    if (!name.trim() || !slug.trim()) {
      toast.error("Nombre y slug son obligatorios");
      return;
    }
    setCreating(true);
    try {
      await createCategory({ name: name.trim(), slug: slug.trim(), description: description.trim() || undefined });
      toast.success("Categoría creada");
      setName("");
      setSlug("");
      setDescription("");
      await refetch();
      queryClient.invalidateQueries();
    } catch {
      toast.error("Error al crear la categoría");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number, catName: string) => {
    try {
      await deleteCategory(id);
      toast.success(`"${catName}" eliminada`);
      await refetch();
      queryClient.invalidateQueries();
    } catch {
      toast.error("Error al eliminar la categoría");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link
          href="/admin"
          className="p-2 -ml-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground flex items-center gap-3">
            <Tags className="h-7 w-7 text-primary" />
            Categorías
          </h2>
          <p className="text-muted-foreground mt-1">
            Organiza tus reseñas por categorías.
          </p>
        </div>
      </div>

      {/* Create form */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-serif">Nueva Categoría</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Nombre *</label>
              <Input
                placeholder="Ej: Cursos de Cocina"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Slug (URL) *</label>
              <Input
                placeholder="cursos-de-cocina"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Descripción <span className="text-muted-foreground font-normal">(opcional)</span>
            </label>
            <Input
              placeholder="Descripción corta de la categoría..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button onClick={handleCreate} disabled={creating || !name.trim()}>
            {creating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Añadir Categoría
          </Button>
        </CardContent>
      </Card>

      {/* List */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-serif">
            Categorías existentes ({categories?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              Cargando...
            </div>
          ) : !categories?.length ? (
            <p className="text-muted-foreground text-sm py-4">
              No hay categorías todavía. Crea la primera arriba.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {categories.map((cat) => (
                <li key={cat.id} className="flex items-center justify-between py-3 gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">/{cat.slug}</p>
                    {cat.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {cat.description}
                      </p>
                    )}
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive shrink-0">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esto eliminará la categoría <strong>"{cat.name}"</strong>. Las reseñas
                          que usen esta categoría quedarán sin categoría asignada.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => handleDelete(cat.id, cat.name)}
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
