import { Link } from "wouter";
import { useEffect, useRef } from "react";
import { useGetFeaturedProducts, useListCategories, useListProducts } from "@workspace/api-client-react";
import { ArrowRight, Star, ChevronRight, PlayCircle, ChefHat, GraduationCap, BookOpen, Flame, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarqueeBanner } from "@/components/ui/marquee-banner";
import { FaqSection, FAQ_ITEMS } from "@/components/sections/FaqSection";
import { applySeo, faqLd, websiteLd, organizationLd, itemListLd } from "@/lib/seo";

/* ─── Fade-up wrapper ─────────────────────────────────────────────────────── */
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`${className}`}
      style={{
        animation: `fadeUp 0.7s ease-out both`,
        animationDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Section divider wave ────────────────────────────────────────────────── */
function WaveDivider({ fill = "#faf9f7", from = "transparent" }: { fill?: string; from?: string }) {
  return (
    <div className="relative h-16 overflow-hidden -mb-1" style={{ background: from }}>
      <svg viewBox="0 0 1440 64" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
        <path
          d="M0,32 C240,64 480,0 720,32 C960,64 1200,0 1440,32 L1440,64 L0,64 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────────────────── */
export function Home() {
  const { data: featured } = useGetFeaturedProducts();
  const { data: categories } = useListCategories();
  const { data: latestProducts } = useListProducts({ limit: 4 });

  useEffect(() => {
    const jsonLd: object[] = [websiteLd, organizationLd, faqLd(FAQ_ITEMS)];

    const allProducts = [
      ...(featured ?? []),
      ...(latestProducts?.products ?? []),
    ];
    const uniqueProducts = allProducts.filter(
      (p, i, arr) => arr.findIndex((x) => x.id === p.id) === i
    );
    if (uniqueProducts.length > 0) {
      jsonLd.push(
        itemListLd(
          uniqueProducts.map((p, i) => ({
            position: i + 1,
            name: p.title,
            url: `https://paladar-critico-web.onrender.com/opiniones/${p.slug}`,
            image: p.coverImage,
          }))
        )
      );
    }

    applySeo({
      title: "Paladar Crítico | Reseñas de Cursos de Cocina, Recetarios y Métodos",
      description:
        "Reseñas honestas y análisis profundos de los mejores cursos de cocina online, recetarios y métodos culinarios. Descubre qué vale la pena comprar antes de invertir.",
      keywords:
        "cursos de cocina online, reseñas cursos cocina, mejores libros de cocina, recetarios recomendados, opiniones cursos gastronomía, aprender a cocinar, cursos cocina profesional",
      canonical: "https://paladar-critico-web.onrender.com/",
      jsonLd,
    });
  }, [featured, latestProducts]);

  return (
    <div className="w-full overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#2A1810] z-0" />
        <div className="absolute inset-0 z-10">
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A1810] via-black/50 to-black/20 z-10" />
          <img src="/hero.jpg" alt="Alta cocina" className="w-full h-full object-cover opacity-90" />
        </div>
        {/* hero content animates on mount */}
        <div className="container relative z-20 mx-auto px-4 md:px-6 pt-20 pb-12 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-black/30 backdrop-blur-md px-4 py-1.5 text-sm text-white/90 mb-10 gap-2">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            La Autoridad #1 en Reseñas Culinarias
          </div>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white max-w-5xl leading-[1.05] mb-6">
            Descubre el arte <br className="hidden md:block" />
            <span className="text-primary italic">de cocinar mejor.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mb-10 font-light tracking-wide">
            Análisis profundos, reseñas honestas y comparativas de los mejores cursos, recetas y métodos del mundo gastronómico.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" className="h-14 px-8 text-base bg-primary hover:bg-primary/90 text-primary-foreground border-none shadow-lg shadow-primary/30">
              Ver Mejores Cursos
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base border-white/20 text-white hover:bg-white/10 backdrop-blur-sm">
              Explorar Metodologías
            </Button>
          </div>
        </div>
      </section>

      {/* wave transition hero → categories */}
      <WaveDivider fill="hsl(40 43% 98%)" from="#2A1810" />

      {/* ── CATEGORIES ────────────────────────────────────────────────────── */}
      <section className="pt-4 pb-28 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <FadeUp className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.3em] font-bold text-primary mb-3">Explora por sección</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">¿Qué estás buscando?</h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories?.map((cat, index) => {
              const config: Record<string, { icon: React.ReactNode; desc: string; gradient: string; accent: string; num: string }> = {
                cursos: {
                  icon: <GraduationCap strokeWidth={1.2} className="w-10 h-10" />,
                  desc: "Analizamos los mejores programas formativos para que inviertas donde de verdad vale la pena.",
                  gradient: "from-[#2A1810] to-[#4a2218]",
                  accent: "text-primary",
                  num: "01",
                },
                metodos: {
                  icon: <Flame strokeWidth={1.2} className="w-10 h-10" />,
                  desc: "Técnicas culinarias probadas en profundidad: sous vide, fermentación, brasa y más.",
                  gradient: "from-[#1a1a2e] to-[#2d2d4a]",
                  accent: "text-blue-300",
                  num: "02",
                },
                recetas: {
                  icon: <BookOpen strokeWidth={1.2} className="w-10 h-10" />,
                  desc: "Los mejores libros de cocina y colecciones gastronómicas analizados con rigor.",
                  gradient: "from-[#1a2a1a] to-[#2d4a2d]",
                  accent: "text-emerald-300",
                  num: "03",
                },
              };
              const cfg = config[cat.slug] ?? {
                icon: <ChefHat strokeWidth={1.2} className="w-10 h-10" />,
                desc: "Descubre los mejores recursos culinarios.",
                gradient: "from-[#2A1810] to-[#4a2218]",
                accent: "text-primary",
                num: "0" + (index + 1),
              };
              return (
                <FadeUp key={cat.id} delay={index * 120}>
                  <Link
                    href={`/categoria/${cat.slug}`}
                    className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${cfg.gradient} p-8 md:p-10 flex flex-col justify-between min-h-[320px] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl block`}
                  >
                    <span className="absolute top-6 right-8 font-serif text-7xl font-bold text-white/5 select-none leading-none">
                      {cfg.num}
                    </span>
                    <div className={`${cfg.accent} mb-6`}>{cfg.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">{cat.name}</h3>
                      <p className="text-white/60 text-sm leading-relaxed font-light">{cfg.desc}</p>
                    </div>
                    <div className={`mt-8 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest ${cfg.accent} group-hover:gap-4 transition-all duration-300`}>
                      Explorar <ArrowRight className="w-4 h-4" />
                    </div>
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-white/25 transition-all duration-300 pointer-events-none" />
                  </Link>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* wave transition categories → featured */}
      <WaveDivider fill="hsl(40 30% 99%)" from="hsl(40 43% 98%)" />

      {/* ── FEATURED REVIEWS ──────────────────────────────────────────────── */}
      {featured && featured.length > 0 && (
        <section className="pt-4 pb-28 bg-card">
          <div className="container mx-auto px-4 md:px-6">
            <FadeUp className="flex items-end justify-between mb-14">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] font-bold text-primary mb-2">Selección del Editor</p>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">Lo más valorado</h2>
              </div>
            </FadeUp>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {featured.map((product, index) => (
                <FadeUp key={product.id} delay={index * 150}>
                  <Link
                    href={`/opiniones/${product.slug}`}
                    className="group flex flex-col md:flex-row gap-6 items-start block"
                  >
                    <div className="w-full md:w-2/5 aspect-[4/5] overflow-hidden rounded-xl shrink-0 bg-muted">
                      <img
                        src={product.coverImage || "/hero.jpg"}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="flex flex-col flex-1 py-4">
                      <div className="flex items-center gap-2 mb-4">
                        {product.categoryName && (
                          <span className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">{product.categoryName}</span>
                        )}
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <div className="flex items-center text-primary">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < product.rating ? "fill-primary" : "fill-muted text-muted"}`} />
                          ))}
                        </div>
                      </div>
                      <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground leading-tight mb-4 group-hover:text-primary transition-colors duration-300">
                        {product.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-3 mb-8">
                        {product.introduction || "Análisis en profundidad, ventajas, desventajas y nuestra opinión sincera."}
                      </p>
                      <div className="mt-auto flex items-center font-medium text-sm text-foreground uppercase tracking-widest group-hover:text-primary group-hover:gap-3 gap-2 transition-all duration-300">
                        Leer Reseña Completa <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* wave transition featured → latest */}
      <WaveDivider fill="hsl(40 43% 98%)" from="hsl(40 30% 99%)" />

      {/* ── LATEST REVIEWS ────────────────────────────────────────────────── */}
      <section className="pt-4 pb-28 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <FadeUp className="flex items-end justify-between mb-14">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Últimas Reseñas</h2>
            <Link href="/categoria/cursos" className="hidden md:flex items-center text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest gap-1">
              Ver todo <ChevronRight className="w-4 h-4" />
            </Link>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {latestProducts?.products?.map((product, index) => (
              <FadeUp key={product.id} delay={index * 100}>
                <Link href={`/opiniones/${product.slug}`} className="group block space-y-4">
                  <div className="aspect-[4/3] overflow-hidden rounded-xl bg-muted relative">
                    <img
                      src={product.coverImage || "/hero.jpg"}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.videoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                        <PlayCircle className="w-12 h-12 text-white/90" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      <span>{product.categoryName}</span>
                      <span className="flex items-center text-primary gap-0.5">
                        <Star className="w-3 h-3 fill-primary" /> {product.rating}
                      </span>
                    </div>
                    <h4 className="font-serif text-lg font-bold leading-tight group-hover:text-primary transition-colors duration-300">
                      {product.title}
                    </h4>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* wave transition latest → newsletter */}
      <WaveDivider fill="#0e0a07" from="hsl(40 43% 98%)" />

      {/* ── NEWSLETTER — Rediseño premium oscuro ──────────────────────────── */}
      <section className="relative py-36 bg-[#0e0a07] overflow-hidden">
        {/* Ambient glow blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-600/15 rounded-full blur-[100px] pointer-events-none" />

        {/* Fine grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="container mx-auto px-4 relative z-10 max-w-3xl text-center">
          <FadeUp>
            {/* Icon badge */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 border border-primary/30 mb-10 mx-auto">
              <Sparkles className="w-7 h-7 text-primary" strokeWidth={1.5} />
            </div>

            {/* Label */}
            <p className="text-xs uppercase tracking-[0.35em] font-bold text-primary/80 mb-5">Lista exclusiva</p>

            {/* Title with gradient */}
            <h2 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-[1.05]"
              style={{
                background: "linear-gradient(135deg, #fff 30%, #c8966a 70%, #e8b57a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              El paladar<br />se educa.
            </h2>

            {/* Decorative line */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-primary/50" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="h-px w-16 bg-gradient-to-l from-transparent to-primary/50" />
            </div>

            <p className="text-lg md:text-xl font-serif italic text-white/60 mb-12 max-w-xl mx-auto leading-relaxed">
              Únete a nuestra lista selecta y recibe reseñas exclusivas, comparativas y descuentos en los mejores cursos antes que nadie.
            </p>

            {/* Form */}
            <form
              className="flex flex-col sm:flex-row max-w-lg mx-auto gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Correo electrónico"
                className="flex-1 h-14 px-6 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/60 focus:bg-white/8 transition-all font-medium text-sm"
              />
              <Button
                size="lg"
                className="h-14 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest text-sm shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-primary/50 hover:scale-[1.02]"
              >
                Suscribirme
              </Button>
            </form>

            <p className="mt-6 text-xs text-white/25 tracking-wide">
              Sin spam. Puedes darte de baja cuando quieras.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* wave transition newsletter → faq */}
      <WaveDivider fill="hsl(40 43% 98%)" from="#0e0a07" />

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <FaqSection />

      {/* wave transition faq → second marquee */}
      <WaveDivider fill="#0e0a07" from="hsl(40 43% 98%)" />

      {/* ── SECOND MARQUEE — after faq ────────────────────────────────────── */}
      <MarqueeBanner dark />

    </div>
  );
}
