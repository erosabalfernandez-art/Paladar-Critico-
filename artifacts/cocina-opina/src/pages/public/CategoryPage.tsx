import { useParams, Link } from "wouter";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { Star, PlayCircle, ArrowRight } from "lucide-react";
import { useEffect, useMemo } from "react";
import { applySeo, breadcrumbLd } from "@/lib/seo";

export function CategoryPage() {
  const { slug } = useParams();
  const { data: categories } = useListCategories();
  const { data: response, isLoading } = useListProducts({ category: slug });
  
  const category = useMemo(() => 
    categories?.find(c => c.slug === slug), 
  [categories, slug]);

  useEffect(() => {
    if (category) {
      applySeo({
        title: `${category.name} | Reseñas y Opiniones`,
        description:
          category.description ||
          `Las mejores reseñas de ${category.name.toLowerCase()} analizadas en profundidad. Descubre qué vale la pena comprar antes de invertir.`,
        keywords: `${category.name.toLowerCase()}, reseñas ${category.name.toLowerCase()}, mejores ${category.name.toLowerCase()}, comparativa ${category.name.toLowerCase()}`,
        canonical: `https://www.paladar-critico.com/categoria/${category.slug}`,
        jsonLd: breadcrumbLd([
          { name: "Inicio", url: "https://www.paladar-critico.com/" },
          { name: category.name, url: `https://www.paladar-critico.com/categoria/${category.slug}` },
        ]),
      });
    }
  }, [category]);

  const products = response?.products || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Category Hero */}
      <section className="bg-[#2A1810] text-white py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img 
            src={`/attached_assets/generated_images/${slug || 'recetas'}.jpg`} 
            alt="Category Cover" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay grayscale"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/attached_assets/generated_images/hero-magazine.jpg";
            }}
          />
        </div>
        <div className="container mx-auto px-4 relative z-20 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">
            Explora la categoría
          </span>
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 capitalize text-white">
            {category?.name || slug}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-light">
            {category?.description || `Las reseñas más detalladas y honestas sobre ${category?.name?.toLowerCase() || slug}. Evaluamos cada detalle para que tomes la mejor decisión.`}
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-32 bg-card rounded-2xl border border-border">
              <h3 className="text-2xl font-serif font-bold mb-2">No hay reseñas todavía</h3>
              <p className="text-muted-foreground mb-6">Estamos cocinando nuevo contenido para esta categoría.</p>
              <Link href="/" className="text-primary font-medium hover:underline inline-flex items-center">
                Volver al inicio <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {products.map((product, index) => (
                <Link 
                  key={product.id} 
                  href={`/opiniones/${product.slug}`} 
                  className="group flex flex-col h-full bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
                  style={{ animationDelay: `${150 * index}ms` }}
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img 
                      src={product.coverImage || "/attached_assets/generated_images/extra-olive-oil.jpg"} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur text-foreground px-3 py-1 rounded-full text-sm font-bold flex items-center shadow-sm">
                      <Star className="w-4 h-4 fill-primary text-primary mr-1" />
                      {product.rating}
                    </div>
                    {product.videoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                        <PlayCircle className="w-14 h-14 text-white/90 drop-shadow-md" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-serif text-2xl font-bold leading-tight mb-4 group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3 mb-6 flex-1">
                      {product.introduction || "Análisis exhaustivo, pros, contras y veredicto final sobre esta opción culinaria."}
                    </p>
                    <div className="pt-4 border-t border-border flex items-center justify-between text-sm font-bold uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">
                      <span>Leer Reseña</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
