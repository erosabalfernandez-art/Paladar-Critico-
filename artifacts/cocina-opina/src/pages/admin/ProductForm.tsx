import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, useParams } from "wouter";
import { useCreateProduct, useUpdateProduct, useListCategories, useListAdminProducts } from "@workspace/api-client-react";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichEditor } from "@/components/ui/rich-editor";
import { ImageUpload } from "@/components/ui/image-upload";

const formSchema = z.object({
  title: z.string().min(2, "Título requerido"),
  slug: z.string().min(2, "Slug requerido"),
  categoryId: z.coerce.number().optional(),
  coverImage: z.string().optional(),
  rating: z.coerce.number().min(1).max(5).default(5),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  price: z.string().optional(),
  affiliateLink: z.string().optional(),
  affiliateLinkText: z.string().optional(),
  videoUrl: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  templateId: z.string().default("classic"),
  introduction: z.string().optional(),
  objective: z.string().optional(),
  authorName: z.string().optional(),
  authorBio: z.string().optional(),
  authorImage: z.string().optional(),
  pros: z.string().optional(),
  cons: z.string().optional(),
  methodology: z.string().optional(),
  support: z.string().optional(),
  timeDedication: z.string().optional(),
  testimonials: z.string().optional(),
  guarantee: z.string().optional(),
  whyImportant: z.string().optional(),
  bonuses: z.string().optional(),
  finalOpinion: z.string().optional(),
  comparisonProduct: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ProductForm() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const isEditing = Boolean(params.id && params.id !== "nuevo");
  const productId = isEditing ? parseInt(params.id as string) : null;

  const { data: categories } = useListCategories();
  const { data: allProducts } = useListAdminProducts({ query: { enabled: isEditing } });
  
  const product = useMemo(() => 
    isEditing ? allProducts?.find(p => p.id === productId) : null,
  [allProducts, productId, isEditing]);

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      rating: 5,
      published: false,
      featured: false,
      templateId: "classic",
      affiliateLinkText: "Ver Oferta",
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        title: product.title,
        slug: product.slug,
        categoryId: product.categoryId || undefined,
        coverImage: product.coverImage || "",
        rating: product.rating,
        published: product.published,
        featured: product.featured || false,
        price: product.price || "",
        affiliateLink: product.affiliateLink || "",
        affiliateLinkText: product.affiliateLinkText || "",
        videoUrl: product.videoUrl || "",
        seoTitle: product.seoTitle || "",
        seoDescription: product.seoDescription || "",
        seoKeywords: product.seoKeywords || "",
        templateId: product.templateId || "classic",
        introduction: product.introduction || "",
        objective: product.objective || "",
        authorName: product.authorName || "",
        authorBio: product.authorBio || "",
        authorImage: product.authorImage || "",
        pros: product.pros || "",
        cons: product.cons || "",
        methodology: product.methodology || "",
        support: product.support || "",
        timeDedication: product.timeDedication || "",
        testimonials: product.testimonials || "",
        guarantee: product.guarantee || "",
        whyImportant: product.whyImportant || "",
        bonuses: product.bonuses || "",
        finalOpinion: product.finalOpinion || "",
        comparisonProduct: product.comparisonProduct || "",
      });
    }
  }, [product, form]);

  // Auto-generate slug from title
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "title" && !isEditing) {
        const generatedSlug = value.title
          ?.toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
        if (generatedSlug) {
          form.setValue("slug", generatedSlug, { shouldValidate: true });
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, isEditing]);

  const onSubmit = (values: FormValues) => {
    if (isEditing && productId) {
      updateProduct.mutate(
        { id: productId, data: values },
        {
          onSuccess: () => {
            toast.success("Reseña actualizada");
            setLocation("/admin");
          },
          onError: () => toast.error("Error al actualizar"),
        }
      );
    } else {
      createProduct.mutate(
        { data: values },
        {
          onSuccess: () => {
            toast.success("Reseña creada");
            setLocation("/admin");
          },
          onError: () => toast.error("Error al crear"),
        }
      );
    }
  };

  const isPending = createProduct.isPending || updateProduct.isPending;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 -ml-2 rounded-full hover:bg-muted text-muted-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h2 className="text-3xl font-serif font-bold">
            {isEditing ? "Editar Reseña" : "Nueva Reseña"}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setLocation("/admin")}>
            Cancelar
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Guardar
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* MAIN COLUMN */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título de la Reseña</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Opiniones 2026 Programa Raio de Kale Anders" {...field} className="text-lg font-medium" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="opiniones-programa-raio" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoría</FormLabel>
                          <Select onValueChange={(v) => field.onChange(parseInt(v))} value={field.value?.toString() || ""}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona una categoría" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories?.map(c => (
                                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Cover Image Upload */}
                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Imagen de Portada</FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            label="Subir imagen de portada"
                          />
                        </FormControl>
                        <FormDescription>
                          También puedes pegar una URL directamente:
                        </FormDescription>
                        <Input
                          placeholder="https://..."
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="mt-1"
                        />
                      </FormItem>
                    )}
                  />

                  {/* Introduction — Rich Editor */}
                  <FormField
                    control={form.control}
                    name="introduction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Introducción</FormLabel>
                        <FormControl>
                          <RichEditor
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            placeholder="Escribe el párrafo introductorio de la reseña... Puedes poner texto en negrita, cambiar el tamaño, insertar fotos..."
                            minHeight={140}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Contenido</TabsTrigger>
                  <TabsTrigger value="author">Autor & Precio</TabsTrigger>
                  <TabsTrigger value="seo">SEO & Media</TabsTrigger>
                </TabsList>
                
                {/* CONTENT TAB */}
                <TabsContent value="content" className="space-y-6 mt-6">
                  <Card>
                    <CardContent className="pt-6 space-y-6">
                      <FormField
                        control={form.control}
                        name="objective"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>¿Cuál es el objetivo?</FormLabel>
                            <FormControl>
                              <RichEditor
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                placeholder="Explica el objetivo principal del producto o curso..."
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="pros"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ventajas (Pros)</FormLabel>
                              <FormDescription>Una por línea</FormDescription>
                              <FormControl>
                                <Textarea className="min-h-[120px]" placeholder="Ventaja 1&#10;Ventaja 2&#10;Ventaja 3" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="cons"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Desventajas (Contras)</FormLabel>
                              <FormDescription>Una por línea</FormDescription>
                              <FormControl>
                                <Textarea className="min-h-[120px]" placeholder="Desventaja 1&#10;Desventaja 2" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="methodology"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Metodología</FormLabel>
                            <FormControl>
                              <RichEditor
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                placeholder="Describe la metodología del curso o producto..."
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="support"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Soporte al alumno</FormLabel>
                              <FormControl>
                                <RichEditor
                                  value={field.value ?? ""}
                                  onChange={field.onChange}
                                  placeholder="¿Cómo es el soporte?"
                                  minHeight={100}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="timeDedication"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tiempo de dedicación</FormLabel>
                              <FormControl>
                                <RichEditor
                                  value={field.value ?? ""}
                                  onChange={field.onChange}
                                  placeholder="¿Cuánto tiempo hay que dedicar?"
                                  minHeight={100}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="whyImportant"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>¿Por qué es importante aprender esto?</FormLabel>
                            <FormControl>
                              <RichEditor
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                placeholder="Explica por qué es importante..."
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="bonuses"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bonus incluidos</FormLabel>
                              <FormControl>
                                <RichEditor
                                  value={field.value ?? ""}
                                  onChange={field.onChange}
                                  placeholder="Lista los bonus incluidos..."
                                  minHeight={100}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="guarantee"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Garantía</FormLabel>
                              <FormControl>
                                <RichEditor
                                  value={field.value ?? ""}
                                  onChange={field.onChange}
                                  placeholder="Detalles de la garantía..."
                                  minHeight={100}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="testimonials"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Testimonios destacados</FormLabel>
                            <FormControl>
                              <RichEditor
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                placeholder="Escribe aquí los testimonios más destacados..."
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="comparisonProduct"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Comparativa</FormLabel>
                            <FormControl>
                              <RichEditor
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                placeholder="Compara este producto con otros del mercado..."
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="finalOpinion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Opinión Final / Veredicto</FormLabel>
                            <FormControl>
                              <RichEditor
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                placeholder="Tu veredicto final sobre el producto o curso..."
                                minHeight={180}
                                className="border-primary/40"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* AUTHOR TAB */}
                <TabsContent value="author" className="space-y-6 mt-6">
                  <Card>
                    <CardContent className="pt-6 space-y-6">
                      <h3 className="font-serif text-lg font-bold">Información del Autor</h3>
                      <FormField
                        control={form.control}
                        name="authorName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre del Autor</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Author Image Upload */}
                      <FormField
                        control={form.control}
                        name="authorImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Foto del Autor</FormLabel>
                            <FormControl>
                              <ImageUpload
                                value={field.value}
                                onChange={field.onChange}
                                label="Subir foto del autor"
                              />
                            </FormControl>
                            <FormDescription>
                              También puedes pegar una URL:
                            </FormDescription>
                            <Input
                              placeholder="https://..."
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value)}
                              className="mt-1"
                            />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="authorBio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Biografía / Credenciales</FormLabel>
                            <FormControl>
                              <RichEditor
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                placeholder="Escribe aquí la biografía del autor, sus credenciales, experiencia..."
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6 space-y-6">
                      <h3 className="font-serif text-lg font-bold">Ventas y Afiliación</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Precio a mostrar</FormLabel>
                              <FormControl>
                                <Input placeholder="Ej: 497€ o $500" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="affiliateLinkText"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Texto del Botón CTA</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="affiliateLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Enlace de Afiliado (URL)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://go.hotmart.com/..." {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* SEO TAB */}
                <TabsContent value="seo" className="space-y-6 mt-6">
                  <Card>
                    <CardContent className="pt-6 space-y-6">
                      <FormField
                        control={form.control}
                        name="videoUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Video (URL YouTube)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6 space-y-6">
                      <h3 className="font-serif text-lg font-bold">Metadatos SEO</h3>
                      <FormField
                        control={form.control}
                        name="seoTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SEO Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>Si se deja vacío, se usará el título del producto.</FormDescription>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="seoDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SEO Meta Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="seoKeywords"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SEO Keywords</FormLabel>
                            <FormControl>
                              <Input placeholder="curso cocina, reseña, opiniones..." {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* SIDEBAR COLUMN */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-serif">Publicación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Publicado</FormLabel>
                          <FormDescription>
                            Visible para los lectores
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Destacado</FormLabel>
                          <FormDescription>
                            Mostrar en inicio
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valoración (Estrellas)</FormLabel>
                        <Select onValueChange={(v) => field.onChange(parseInt(v))} value={field.value?.toString() || "5"}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Puntuación" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="5">5 Estrellas (Excelente)</SelectItem>
                            <SelectItem value="4">4 Estrellas (Muy Bueno)</SelectItem>
                            <SelectItem value="3">3 Estrellas (Bueno)</SelectItem>
                            <SelectItem value="2">2 Estrellas (Regular)</SelectItem>
                            <SelectItem value="1">1 Estrella (Pobre)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="templateId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plantilla de Diseño</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona plantilla" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="classic">Clásica Editorial</SelectItem>
                            <SelectItem value="modern">Moderna y Limpia</SelectItem>
                            <SelectItem value="minimal">Minimalista</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

          </div>
        </form>
      </Form>
    </div>
  );
}
