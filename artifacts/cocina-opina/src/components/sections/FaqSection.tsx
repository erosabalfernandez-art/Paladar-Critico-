import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "¿Por qué las recetas gratuitas de internet no son suficientes para aprender a cocinar bien?",
    answer:
      "Las recetas gratuitas en internet están incompletas por diseño: carecen de explicaciones técnicas, de la teoría detrás de cada paso y del contexto que transforma un cocinero mediocre en uno solvente. Te dicen el qué, nunca el por qué. Un buen curso o recetario profesional te enseña técnica, temperatura, textura y las razones científicas que hacen que un plato funcione. La diferencia entre seguir instrucciones y realmente cocinar es exactamente esa.",
  },
  {
    question: "¿Vale la pena pagar por un curso de cocina online?",
    answer:
      "Absolutamente. Un curso bien estructurado te ahorra años de prueba y error. En Paladar Crítico analizamos cursos que han sido impartidos por chefs con estrella Michelin y formadores con décadas de experiencia. El precio de un curso de calidad equivale a pocos salidas a restaurantes, pero te proporciona un conocimiento que puedes usar toda la vida. El retorno de inversión es incalculable si cocinas con frecuencia.",
  },
  {
    question: "¿Cuál es la diferencia entre un recetario profesional y las recetas gratis?",
    answer:
      "Un recetario profesional es un sistema de aprendizaje. Tiene coherencia temática, progresión pedagógica, técnicas explicadas paso a paso y proporcionadas con precisión. Las recetas gratuitas son fragmentos dispersos sin hilo conductor, escritas a menudo por personas sin formación culinaria real. Comprar un recetario de calidad es invertir en una biblioteca de conocimiento culinario ordenado y verificado.",
  },
  {
    question: "¿Por qué recomiendan comprar cursos y libros en lugar de simplemente buscar en YouTube?",
    answer:
      "YouTube es útil para recetas puntuales, pero carece de estructura curricular. Ver vídeos aleatorios no construye una base sólida. Los cursos y recetarios que recomendamos están diseñados con una progresión lógica: empiezas desde la base y avanzas de forma coherente. Además, los mejores cursos incluyen comunidades de aprendizaje, resolución de dudas y materiales complementarios que ningún vídeo gratuito ofrece.",
  },
  {
    question: "¿Cómo sé que las reseñas de Paladar Crítico son fiables?",
    answer:
      "Cada producto que analizamos es probado durante semanas antes de publicar nuestra opinión. Nuestro equipo tiene formación culinaria real y hemos rechazado colaboraciones con marcas que no cumplen nuestros estándares. Somos transparentes sobre nuestros enlaces de afiliado (declarados en nuestra política), pero eso nunca determina nuestra valoración: un producto malo recibe una mala reseña independientemente de la comisión.",
  },
  {
    question: "¿Los cursos y recetarios que recomendáis son solo para cocineros avanzados?",
    answer:
      "No. Tenemos recomendaciones para todos los niveles: desde quienes nunca han preparado más que un huevo frito hasta cocineros intermedios que quieren dominar técnicas avanzadas. En cada reseña indicamos claramente el nivel requerido y el perfil de alumno al que va dirigido el curso o recetario.",
  },
  {
    question: "¿Con qué frecuencia actualizáis las reseñas?",
    answer:
      "Revisamos y actualizamos nuestras reseñas cada vez que el producto cambia significativamente: nueva edición de un libro, actualización de contenidos de un curso o cambio relevante en precio o acceso. Todas las reseñas muestran la fecha de última actualización para que siempre tengas información vigente.",
  },
  {
    question: "¿Por qué los cursos y recetarios recomendados aquí son los mejores del mercado?",
    answer:
      "Porque los evaluamos con criterios rigurosos: calidad del contenido, solidez pedagógica, credenciales del autor, relación calidad-precio, soporte post-compra y resultados reales de alumnos. No recomendamos todo lo que llega a nuestra redacción — de media, rechazamos 7 de cada 10 propuestas porque no alcanzan nuestro listón de calidad.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-28 bg-background" id="faq">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-primary mb-3">
            Preguntas frecuentes
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-5">
            Todo lo que necesitas saber
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Resolvemos las dudas más habituales sobre por qué aprender a cocinar
            de verdad requiere más que recetas gratuitas.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="border border-border rounded-2xl overflow-hidden transition-all duration-200 hover:border-primary/30"
            >
              <button
                className="w-full flex items-start justify-between gap-6 px-7 py-6 text-left group"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="font-serif text-lg font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
                  {item.question}
                </span>
                <ChevronDown
                  className={`shrink-0 w-5 h-5 text-primary mt-0.5 transition-transform duration-300 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  open === i ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-7 pb-7">
                  <div className="h-px bg-border mb-5" />
                  <p className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center p-10 rounded-3xl bg-primary/5 border border-primary/10">
          <p className="font-serif text-2xl font-bold text-foreground mb-3">
            ¿Tienes más dudas?
          </p>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Explora nuestras reseñas detalladas y encuentra el curso o recetario
            perfecto para tu nivel y objetivos.
          </p>
          <a
            href="/categoria/cursos"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors"
          >
            Ver todas las reseñas
          </a>
        </div>
      </div>
    </section>
  );
}
