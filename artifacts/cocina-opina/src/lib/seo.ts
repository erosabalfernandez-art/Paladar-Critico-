/**
 * SEO utility — injects/updates <meta> tags and JSON-LD scripts dynamically.
 * Works with React SPAs (Google crawls JS-rendered content).
 */

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogType?: "website" | "article";
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleAuthor?: string;
  jsonLd?: object | object[];
}

const SITE_NAME = "Paladar Crítico";
const SITE_URL = "https://paladar-critico-web.onrender.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/hero.jpg`;

function setMeta(name: string, content: string, prop = false) {
  const attr = prop ? "property" : "name";
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function removeMeta(name: string, prop = false) {
  const attr = prop ? "property" : "name";
  const el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (el) el.remove();
}

function setLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function injectJsonLd(id: string, data: object | object[]) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(Array.isArray(data) ? data : data);
}

export function applySeo(config: SeoConfig) {
  const {
    title,
    description,
    keywords,
    canonical,
    ogImage = DEFAULT_OG_IMAGE,
    ogImageAlt,
    ogType = "website",
    articlePublishedTime,
    articleModifiedTime,
    articleAuthor,
    jsonLd,
  } = config;

  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;

  document.title = fullTitle;

  // Standard
  setMeta("description", description);
  if (keywords) setMeta("keywords", keywords);
  setMeta("robots", "index, follow");
  setMeta("author", SITE_NAME);

  // Canonical
  const canonicalHref = canonical ?? window.location.href.split("?")[0];
  setLink("canonical", canonicalHref);

  // Open Graph
  setMeta("og:title", fullTitle, true);
  setMeta("og:description", description, true);
  setMeta("og:type", ogType, true);
  setMeta("og:image", ogImage, true);
  setMeta("og:image:width", "1200", true);
  setMeta("og:image:height", "630", true);
  setMeta("og:image:alt", ogImageAlt || fullTitle, true);
  setMeta("og:site_name", SITE_NAME, true);
  setMeta("og:url", canonicalHref, true);
  setMeta("og:locale", "es_ES", true);

  // Article-specific Open Graph metas
  if (ogType === "article") {
    if (articlePublishedTime) setMeta("article:published_time", articlePublishedTime, true);
    if (articleModifiedTime) setMeta("article:modified_time", articleModifiedTime, true);
    if (articleAuthor) setMeta("article:author", articleAuthor, true);
    setMeta("article:section", "Reseñas culinarias", true);
  } else {
    removeMeta("article:published_time", true);
    removeMeta("article:modified_time", true);
    removeMeta("article:author", true);
    removeMeta("article:section", true);
  }

  // Twitter
  setMeta("twitter:card", "summary_large_image");
  setMeta("twitter:title", fullTitle);
  setMeta("twitter:description", description);
  setMeta("twitter:image", ogImage);
  setMeta("twitter:image:alt", ogImageAlt || fullTitle);
  setMeta("twitter:site", "@PaladarCritico");

  // JSON-LD
  if (jsonLd) {
    injectJsonLd("ld-json-page", jsonLd);
  }
}

// ── Shared structured data helpers ──────────────────────────────────────────

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  sameAs: [
    // Añade aquí tus redes sociales cuando las tengas:
    // "https://www.instagram.com/paladar_critico",
    // "https://www.youtube.com/@PaladarCritico",
  ],
  description:
    "La referencia número uno en reseñas de cursos de cocina, recetarios y métodos culinarios. Análisis profundos, honestos e independientes.",
};

// WebSite schema — sin SearchAction porque no existe página /buscar
export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
};

export const breadcrumbLd = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: item.url,
  })),
});

export const faqLd = (
  items: { question: string; answer: string }[]
) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
});

export const itemListLd = (
  items: { name: string; url: string; image?: string | null; position: number }[]
) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: items.map((item) => ({
    "@type": "ListItem",
    position: item.position,
    name: item.name,
    url: item.url,
    ...(item.image ? { image: item.image } : {}),
  })),
});

export const reviewArticleLd = (product: {
  title: string;
  slug: string;
  rating: number;
  description: string;
  coverImage?: string | null;
  createdAt?: string;
  updatedAt: string;
  authorName?: string | null;
}) => ({
  "@context": "https://schema.org",
  "@type": "Review",
  name: product.title,
  url: `${SITE_URL}/opiniones/${product.slug}`,
  reviewRating: {
    "@type": "Rating",
    ratingValue: product.rating,
    bestRating: 5,
    worstRating: 1,
  },
  author: {
    "@type": "Person",
    name: product.authorName || "Equipo Paladar Crítico",
  },
  publisher: organizationLd,
  description: product.description,
  datePublished: product.createdAt || product.updatedAt,
  dateModified: product.updatedAt,
  image: product.coverImage || `${SITE_URL}/hero.jpg`,
});
