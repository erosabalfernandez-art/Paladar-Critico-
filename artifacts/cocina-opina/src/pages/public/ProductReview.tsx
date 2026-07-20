import { useLocation, useParams } from "wouter";
import { useGetProductBySlug, getGetProductBySlugQueryKey } from "@workspace/api-client-react";
import { useEffect } from "react";
import { applySeo, reviewArticleLd, breadcrumbLd, organizationLd } from "@/lib/seo";
import { Star, CheckCircle2, XCircle, ChevronRight, ShieldCheck, Clock, MessageCircle, PlayCircle, ExternalLink, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductReview() {
  const { slug } = useParams();
  const { data: product, isLoading } = useGetProductBySlug(slug as string, { 
    query: { enabled: !!slug, queryKey: getGetProductBySlugQueryKey(slug as string) } 
  });

  useEffect(() => {
    if (product) {
      const description =
        product.seoDescription ||
        `Análisis completo de ${product.title}: ventajas, desventajas, precio y nuestra opinión honesta. ¿Vale la pena? Te lo contamos todo.`;
      applySeo({
        title: product.seoTitle || `${product.title} — Reseña y Opiniones`,
        description,
        keywords:
          product.seoKeywords ||
          `${product.title}, reseña ${product.title}, opiniones ${product.title}, análisis ${product.title}`,
        canonical: `https://paladar-critico-web.onrender.com/opiniones/${product.slug}`,
        ogImage: product.coverImage || undefined,
        ogImageAlt: `Reseña de ${product.title} — Paladar Crítico`,
        ogType: "article",
        articlePublishedTime: product.createdAt,
        articleModifiedTime: product.updatedAt,
        articleAuthor: product.authorName || "Equipo Paladar Crítico",
        jsonLd: [
          reviewArticleLd({
            title: product.title,
            slug: product.slug,
            rating: product.rating,
            description:
              product.seoDescription ||
              product.introduction ||
              `Reseña completa de ${product.title}`,
            coverImage: product.coverImage,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            authorName: product.authorName,
          }),
          breadcrumbLd([
            { name: "Inicio", url: "https://paladar-critico-web.onrender.com/" },
            ...(product.categoryName
              ? [{ name: product.categoryName, url: `https://paladar-critico-web.onrender.com/categoria/${product.categoryId}` }]
              : []),
            { name: product.title, url: `https://paladar-critico-web.onrender.com/opiniones/${product.slug}` },
          ]),
          organizationLd,
        ],
      });
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-serif font-bold mb-4">Reseña no encontrada</h1>
        <p className="text-muted-foreground mb-8">No pudimos encontrar la reseña que buscas.</p>
        <Button onClick={() => window.location.href = "/"}>Volver al inicio</Button>
      </div>
    );
  }

  const CtaButton = ({ className = "" }) => (
    <Button 
      size="lg" 
      className={`bg-[#D4AF37] hover:bg-[#C5A028] text-black font-bold uppercase tracking-widest px-8 py-6 h-auto shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${className}`}
      onClick={() => product.affiliateLink && window.open(product.affiliateLink, '_blank')}
    >
      {product.affiliateLinkText || "Ver Precio Especial"}
      <ExternalLink className="ml-2 w-5 h-5" />
    </Button>
  );

  const prosList = product.pros?.split('\n').filter(Boolean) || [];
  const consList = product.cons?.split('\n').filter(Boolean) || [];
  
  // Format date
  const lastUpdated = new Date(product.updatedAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // TOC Generation
  const sections = [
    { id: 'introduccion', label: 'Introducción', show: !!product.introduction },
    { id: 'objetivo', label: '¿Cuál es el objetivo?', show: !!product.objective },
    { id: 'autor', label: `¿Quién es ${product.authorName || 'el autor'}?`, show: !!(product.authorName || product.authorBio) },
    { id: 'ventajas-desventajas', label: 'Ventajas y Desventajas', show: prosList.length > 0 || consList.length > 0 },
    { id: 'metodologia', label: 'Metodología', show: !!product.methodology },
    { id: 'soporte', label: 'Soporte', show: !!product.support },
    { id: 'tiempo', label: 'Tiempo de dedicación', show: !!product.timeDedication },
    { id: 'testimonios', label: 'Testimonios', show: !!product.testimonials },
    { id: 'garantia', label: 'Garantía', show: !!product.guarantee },
    { id: 'importancia', label: '¿Por qué aprender esto?', show: !!product.whyImportant },
    { id: 'bonus', label: 'Bonus Incluidos', show: !!product.bonuses },
    { id: 'precio', label: 'Precio', show: !!product.price },
    { id: 'comparativa', label: 'Comparativa', show: !!product.comparisonProduct },
    { id: 'opinion', label: 'Veredicto Final', show: !!product.finalOpinion },
  ].filter(s => s.show);

  // Template styles (Simple implementation)
  const isMinimal = product.templateId === 'minimal';
  const isModern = product.templateId === 'modern';
  
  const headerClass = isMinimal ? "py-16 bg-background" : 
                      isModern ? "py-24 bg-card border-b border-border" : 
                      "py-24 bg-[#2A1810] text-white";

  return (
    <article className="min-h-screen bg-background">
      {/* HERO SECTION */}
      <header className={`relative ${headerClass} overflow-hidden`}>
        {!isMinimal && !isModern && (
          <>
            <div className="absolute inset-0 bg-black/60 z-10" />
            <img 
              src={product.coverImage || "/attached_assets/generated_images/recetas.jpg"} 
              alt={product.title}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
          </>
        )}
        
        <div className={`container mx-auto px-4 relative z-20 max-w-4xl text-center ${isMinimal || isModern ? 'text-foreground' : 'text-white'}`}>
          <div className="flex items-center justify-center gap-4 mb-6">
            {product.categoryName && (
              <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${isMinimal || isModern ? 'bg-primary/10 text-primary' : 'bg-primary text-white'}`}>
                {product.categoryName}
              </span>
            )}
            <div className={`flex items-center ${isMinimal || isModern ? 'text-primary' : 'text-[#D4AF37]'}`}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < product.rating ? "fill-current" : "fill-transparent border-current"}`} />
              ))}
              <span className={`ml-2 text-sm font-medium ${isMinimal || isModern ? 'text-muted-foreground' : 'text-white/80'}`}>({product.rating}/5)</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-6 leading-tight text-balance">
            {product.title}
          </h1>
          
          <div className={`flex items-center justify-center gap-4 text-sm font-medium ${isMinimal || isModern ? 'text-muted-foreground' : 'text-white/70'} mb-10`}>
            <span>Última actualización: {lastUpdated}</span>
            <span>•</span>
            <span className="flex items-center"><Award className="w-4 h-4 mr-1" /> Reseña Independiente</span>
          </div>
          
          {product.affiliateLink && (
            <CtaButton />
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row gap-12 max-w-6xl">
        {/* SIDEBAR TOC */}
        <aside className="lg:w-1/4 hidden lg:block">
          <div className="sticky top-28 bg-card rounded-xl p-6 border border-border shadow-sm">
            <h4 className="font-serif text-lg font-bold mb-4 flex items-center">
              <MenuIcon className="w-5 h-5 mr-2 text-primary" />
              Índice de contenidos
            </h4>
            <nav className="space-y-2">
              {sections.map(section => (
                <a 
                  key={section.id} 
                  href={`#${section.id}`}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 leading-snug"
                >
                  {section.label}
                </a>
              ))}
            </nav>
            {product.affiliateLink && (
              <div className="mt-8 pt-6 border-t border-border">
                <CtaButton className="w-full text-xs px-4 py-3" />
              </div>
            )}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="lg:w-3/4 max-w-3xl mx-auto space-y-16 prose prose-lg prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary/80">
          
          {product.introduction && (
            <section id="introduccion" className="text-xl leading-relaxed text-foreground font-medium">
              <RichContent html={product.introduction} />
            </section>
          )}

          {product.objective && (
            <section id="objetivo">
              <h2>¿Cuál es el objetivo principal?</h2>
              <RichContent html={product.objective} />
            </section>
          )}

          {(product.authorName || product.authorBio) && (
            <section id="autor" className="bg-card p-8 rounded-2xl border border-border shadow-sm my-12">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {product.authorImage && (
                  <img 
                    src={product.authorImage} 
                    alt={product.authorName} 
                    className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-md shrink-0"
                  />
                )}
                <div>
                  <h3 className="text-2xl font-serif font-bold mb-2 mt-0">
                    Conoce a {product.authorName || 'el autor'}
                  </h3>
                  <RichContent html={product.authorBio} className="text-muted-foreground text-base m-0" />
                </div>
              </div>
            </section>
          )}

          {(prosList.length > 0 || consList.length > 0) && (
            <section id="ventajas-desventajas" className="my-16">
              <h2 className="text-center mb-8">Ventajas y Desventajas</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {prosList.length > 0 && (
                  <div className="bg-green-50/50 dark:bg-green-950/20 p-6 rounded-2xl border border-green-100 dark:border-green-900">
                    <h3 className="text-green-800 dark:text-green-400 font-bold flex items-center mt-0 mb-6 text-xl">
                      <CheckCircle2 className="w-6 h-6 mr-2" /> Lo que más nos gusta
                    </h3>
                    <ul className="space-y-4 m-0 p-0 list-none">
                      {prosList.map((pro, i) => (
                        <li key={i} className="flex items-start text-green-900 dark:text-green-300 text-base m-0 leading-tight">
                          <span className="mr-3 text-green-500 mt-0.5">•</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {consList.length > 0 && (
                  <div className="bg-red-50/50 dark:bg-red-950/20 p-6 rounded-2xl border border-red-100 dark:border-red-900">
                    <h3 className="text-red-800 dark:text-red-400 font-bold flex items-center mt-0 mb-6 text-xl">
                      <XCircle className="w-6 h-6 mr-2" /> Puntos de mejora
                    </h3>
                    <ul className="space-y-4 m-0 p-0 list-none">
                      {consList.map((con, i) => (
                        <li key={i} className="flex items-start text-red-900 dark:text-red-300 text-base m-0 leading-tight">
                          <span className="mr-3 text-red-500 mt-0.5">•</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* MID-ARTICLE CTA */}
          {product.affiliateLink && (
            <div className="flex justify-center my-12 py-8 border-y border-border">
              <CtaButton />
            </div>
          )}

          {product.methodology && (
            <section id="metodologia">
              <h2>¿Cómo es la Metodología?</h2>
              <RichContent html={product.methodology} />
            </section>
          )}

          <div className="grid md:grid-cols-2 gap-8 my-12">
            {product.support && (
              <section id="soporte" className="bg-card p-6 rounded-2xl border border-border">
                <h3 className="flex items-center mt-0 text-xl font-serif">
                  <MessageCircle className="w-5 h-5 mr-2 text-primary" /> Soporte
                </h3>
                <RichContent html={product.support} className="text-base m-0" />
              </section>
            )}

            {product.timeDedication && (
              <section id="tiempo" className="bg-card p-6 rounded-2xl border border-border">
                <h3 className="flex items-center mt-0 text-xl font-serif">
                  <Clock className="w-5 h-5 mr-2 text-primary" /> Tiempo requerido
                </h3>
                <RichContent html={product.timeDedication} className="text-base m-0" />
              </section>
            )}
          </div>

          {product.testimonials && (
            <section id="testimonios" className="my-16">
              <blockquote className="border-l-4 border-primary pl-6 py-2 italic bg-muted/30 p-6 rounded-r-2xl m-0 shadow-sm text-foreground/80 font-serif text-xl leading-relaxed">
                <RichContent html={product.testimonials} />
              </blockquote>
            </section>
          )}

          {product.guarantee && (
            <section id="garantia" className="flex items-center gap-6 bg-[#2A1810] text-white p-8 rounded-2xl my-12">
              <ShieldCheck className="w-16 h-16 text-[#D4AF37] shrink-0" />
              <div>
                <h3 className="text-[#D4AF37] font-bold text-xl mt-0 mb-2">Garantía Protegida</h3>
                <RichContent html={product.guarantee} className="m-0 text-white/80" />
              </div>
            </section>
          )}

          {product.whyImportant && (
            <section id="importancia">
              <h2>¿Por qué es importante aprender esto ahora?</h2>
              <RichContent html={product.whyImportant} />
            </section>
          )}

          {product.bonuses && (
            <section id="bonus" className="my-12 p-8 border-2 border-primary/20 rounded-2xl bg-primary/5 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground font-bold px-6 py-1 rounded-full uppercase tracking-wider text-sm">
                Material Extra Incluido
              </div>
              <h2 className="mt-4 mb-6 text-center text-primary">Bonus Gratuitos</h2>
              <RichContent html={product.bonuses} />
            </section>
          )}

          {product.videoUrl && (
            <section id="video" className="my-16">
              <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg border border-border flex items-center justify-center relative group cursor-pointer"
                   onClick={() => window.open(product.videoUrl, '_blank')}>
                 <img 
                    src={product.coverImage || "/attached_assets/generated_images/recetas.jpg"} 
                    alt="Video thumbnail"
                    className="absolute inset-0 w-full h-full object-cover opacity-50 transition-opacity group-hover:opacity-40"
                  />
                 <PlayCircle className="w-20 h-20 text-white z-10 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
              </div>
            </section>
          )}

          {product.comparisonProduct && (
            <section id="comparativa">
              <h2>Comparativa</h2>
              <RichContent html={product.comparisonProduct} className="bg-card p-8 rounded-2xl border border-border" />
            </section>
          )}

          {product.price && (
            <section id="precio" className="text-center my-16">
              <h2 className="mb-4">Inversión</h2>
              <div className="inline-block bg-background border-2 border-border shadow-sm px-12 py-8 rounded-3xl">
                <span className="block text-sm text-muted-foreground uppercase tracking-widest font-bold mb-2">Precio Actual</span>
                <span className="text-5xl font-bold text-foreground">{product.price}</span>
              </div>
            </section>
          )}

          {product.finalOpinion && (
            <section id="opinion" className="bg-card p-10 rounded-3xl border border-border shadow-md my-16 text-center">
              <h2 className="mt-0 mb-6 text-3xl">Nuestro Veredicto Final</h2>
              <RichContent html={product.finalOpinion} className="text-lg leading-relaxed text-muted-foreground mb-10 text-left" />
              
              <div className="flex flex-col items-center">
                <p className="font-serif font-bold text-xl mb-6">¿Merece la pena?</p>
                <div className="flex items-center justify-center gap-1 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-8 h-8 ${i < product.rating ? "fill-[#D4AF37] text-[#D4AF37]" : "fill-transparent text-muted"}`} />
                  ))}
                </div>
                
                {product.affiliateLink && (
                  <CtaButton className="text-lg px-12 py-6 animate-pulse" />
                )}
              </div>
            </section>
          )}

        </main>
      </div>
    </article>
  );
}

/** Renders either HTML (from rich editor) or plain text, auto-detected */
function RichContent({ html, className }: { html?: string | null; className?: string }) {
  if (!html) return null;
  const isHtml = /<[a-z][\s\S]*>/i.test(html);
  if (isHtml) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        className={className ?? "whitespace-pre-wrap"}
      />
    );
  }
  return <div className={`whitespace-pre-wrap ${className ?? ""}`}>{html}</div>;
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}
