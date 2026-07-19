import React from "react";
import { Star } from "lucide-react";

const ITEMS = [
  "⭐ «Las reseñas más honestas que he encontrado en internet»",
  "🍳 «Gracias a Paladar Crítico elegí el curso perfecto y valió cada euro»",
  "🔥 «Análisis profundos que ningún otro blog ofrece»",
  "⭐ «Mi referencia número uno antes de comprar cualquier curso de cocina»",
  "🎖️ «Por fin alguien que dice la verdad sin venderte nada raro»",
  "🍽️ «Llevo 2 años siguiéndoles y nunca me han fallado»",
  "⭐ «La mejor guía para aprender a cocinar de verdad»",
  "🔪 «Gracias a ellos descubrí técnicas que no sabía ni que existían»",
  "🏆 «Paladar Crítico es lo que debería ser todo periodismo gastronómico»",
  "⭐ «Increíble nivel de detalle en cada análisis»",
];

interface MarqueeBannerProps {
  dark?: boolean;
}

export function MarqueeBanner({ dark = false }: MarqueeBannerProps) {
  // Duplicate items for seamless loop
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div
      className={`w-full overflow-hidden py-2.5 border-y ${
        dark
          ? "bg-[#0e0a07] border-white/10"
          : "bg-primary/5 border-primary/10"
      }`}
    >
      <div className="flex items-center gap-0 animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <React.Fragment key={i}>
            <span
              className={`text-xs font-medium tracking-wide px-2 ${
                dark ? "text-white/50" : "text-foreground/60"
              }`}
            >
              {item}
            </span>
            <span
              className={`mx-4 text-primary text-xs select-none ${
                dark ? "opacity-40" : "opacity-60"
              }`}
            >
              ✦
            </span>
          </React.Fragment>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
          display: inline-flex;
          will-change: transform;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
