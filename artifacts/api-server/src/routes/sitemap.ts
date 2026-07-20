import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const SITE_URL = "https://paladar-critico-web.onrender.com";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

router.get("/sitemap.xml", async (_req, res) => {
  const [products, categories] = await Promise.all([
    db
      .select({
        slug: productsTable.slug,
        updatedAt: productsTable.updatedAt,
      })
      .from(productsTable)
      .where(eq(productsTable.published, true)),
    db.select({ slug: categoriesTable.slug }).from(categoriesTable),
  ]);

  const staticUrls = [
    { loc: `${SITE_URL}/`, changefreq: "weekly", priority: "1.0" },
  ];

  const categoryUrls = categories.map((cat) => ({
    loc: `${SITE_URL}/categoria/${escapeXml(cat.slug)}`,
    changefreq: "weekly",
    priority: "0.9",
  }));

  const productUrls = products.map((p) => ({
    loc: `${SITE_URL}/opiniones/${escapeXml(p.slug)}`,
    lastmod: p.updatedAt.toISOString().split("T")[0],
    changefreq: "monthly",
    priority: "0.8",
  }));

  const allUrls = [...staticUrls, ...categoryUrls, ...productUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(xml);
});

export default router;
