import { Link } from "wouter";
import { useListAdminProducts, useDeleteProduct, getListAdminProductsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, FileText, Plus, Star, Tags, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function AdminDashboard() {
  const { data: products, isLoading } = useListAdminProducts();
  const deleteProduct = useDeleteProduct();
  const queryClient = useQueryClient();

  const handleDelete = (id: number) => {
    deleteProduct.mutate(
      { id },
      {
        onSuccess: () => {
          toast.success("Producto eliminado");
          queryClient.invalidateQueries({ queryKey: getListAdminProductsQueryKey() });
        },
        onError: () => {
          toast.error("Error al eliminar el producto");
        }
      }
    );
  };

  const total = products?.length || 0;
  const published = products?.filter(p => p.published).length || 0;
  const drafts = total - published;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground">Catálogo de Reseñas</h2>
          <p className="text-muted-foreground mt-1">Gestiona los productos, cursos y métodos.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/categorias" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            <Tags className="h-4 w-4 mr-2" />
            Categorías
          </Link>
          <Link href="/admin/productos/nuevo" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Reseña
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reseñas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{isLoading ? "-" : total}</div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Publicadas</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{isLoading ? "-" : published}</div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Borradores</CardTitle>
            <div className="h-4 w-4 rounded-full bg-amber-500/20 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{isLoading ? "-" : drafts}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Valoración</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : products?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No hay reseñas creadas. Comienza creando una nueva.
                </TableCell>
              </TableRow>
            ) : (
              products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{product.title}</span>
                      <span className="text-xs text-muted-foreground">/{product.slug}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.categoryName ? (
                      <Badge variant="secondary" className="font-normal">{product.categoryName}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-amber-500">
                      <span className="font-bold mr-1">{product.rating}</span>
                      <Star className="h-3 w-3 fill-current" />
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.published ? (
                      <Badge className="bg-green-500 hover:bg-green-600 text-white border-transparent">Publicado</Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/20">Borrador</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/productos/${product.id}/editar`} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted h-9 w-9 text-muted-foreground hover:text-foreground">
                        <Edit className="h-4 w-4" />
                      </Link>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar reseña?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará permanentemente la reseña "{product.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(product.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
