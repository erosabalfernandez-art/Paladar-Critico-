import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable } from "@workspace/db";
import { eq, and, desc, sql } from "drizzle-orm";

const router = Router();

// Helper to enrich product with category name
async function enrichProduct(product: typeof productsTable.$inferSelect) {
  let categoryName: string | null = null;
  if (product.categoryId) {
    const cat = await db.select().from(categoriesTable).where(eq(categoriesTable.id, product.categoryId)).limit(1);
    categoryName = cat[0]?.name ?? null;
  }
  return {
    ...product,
    categoryName,
    updatedAt: product.updatedAt.toISOString(),
    createdAt: product.createdAt.toISOString(),
  };
}

// GET /api/categories
router.get("/categories", async (req, res) => {
  const cats = await db.select().from(categoriesTable).orderBy(categoriesTable.name);
  res.json(cats);
});

// GET /api/products/featured
router.get("/products/featured", async (req, res) => {
  const products = await db
    .select({
      id: productsTable.id,
      title: productsTable.title,
      slug: productsTable.slug,
      categoryId: productsTable.categoryId,
      coverImage: productsTable.coverImage,
      rating: productsTable.rating,
      published: productsTable.published,
      featured: productsTable.featured,
      videoUrl: productsTable.videoUrl,
      introduction: productsTable.introduction,
      updatedAt: productsTable.updatedAt,
      categoryName: categoriesTable.name,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(and(eq(productsTable.published, true), eq(productsTable.featured, true)))
    .orderBy(desc(productsTable.updatedAt))
    .limit(6);

  res.json(products.map(p => ({
    ...p,
    categoryName: p.categoryName ?? null,
    updatedAt: p.updatedAt.toISOString(),
  })));
});

// GET /api/products
router.get("/products", async (req, res) => {
  const { category, limit } = req.query as { category?: string; limit?: string };

  let query = db
    .select({
      id: productsTable.id,
      title: productsTable.title,
      slug: productsTable.slug,
      categoryId: productsTable.categoryId,
      coverImage: productsTable.coverImage,
      rating: productsTable.rating,
      published: productsTable.published,
      featured: productsTable.featured,
      videoUrl: productsTable.videoUrl,
      introduction: productsTable.introduction,
      updatedAt: productsTable.updatedAt,
      categoryName: categoriesTable.name,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.published, true))
    .orderBy(desc(productsTable.updatedAt))
    .$dynamic();

  const products = await query;

  let filtered = products;
  if (category) {
    filtered = filtered.filter(p => {
      // Find slug of this category
      return true; // will filter below after getting slug
    });
    // Re-query with category filter
    const catRow = await db.select().from(categoriesTable).where(eq(categoriesTable.slug, category)).limit(1);
    if (catRow.length > 0) {
      const catId = catRow[0].id;
      const catProducts = await db
        .select({
          id: productsTable.id,
          title: productsTable.title,
          slug: productsTable.slug,
          categoryId: productsTable.categoryId,
          coverImage: productsTable.coverImage,
          rating: productsTable.rating,
          published: productsTable.published,
          featured: productsTable.featured,
          videoUrl: productsTable.videoUrl,
          introduction: productsTable.introduction,
          updatedAt: productsTable.updatedAt,
          categoryName: categoriesTable.name,
        })
        .from(productsTable)
        .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
        .where(and(eq(productsTable.published, true), eq(productsTable.categoryId, catId)))
        .orderBy(desc(productsTable.updatedAt));
      return res.json({
        products: catProducts.map(p => ({
          ...p,
          categoryName: p.categoryName ?? null,
          updatedAt: p.updatedAt.toISOString(),
        }))
      });
    }
    return res.json({ products: [] });
  }

  let result = filtered;
  if (limit) {
    result = result.slice(0, parseInt(limit));
  }

  res.json({
    products: result.map(p => ({
      ...p,
      categoryName: p.categoryName ?? null,
      updatedAt: p.updatedAt.toISOString(),
    }))
  });
});

// GET /api/products/:slug
router.get("/products/:slug", async (req, res) => {
  const { slug } = req.params;
  const rows = await db
    .select({
      id: productsTable.id,
      title: productsTable.title,
      slug: productsTable.slug,
      categoryId: productsTable.categoryId,
      coverImage: productsTable.coverImage,
      rating: productsTable.rating,
      published: productsTable.published,
      featured: productsTable.featured,
      price: productsTable.price,
      affiliateLink: productsTable.affiliateLink,
      affiliateLinkText: productsTable.affiliateLinkText,
      videoUrl: productsTable.videoUrl,
      seoTitle: productsTable.seoTitle,
      seoDescription: productsTable.seoDescription,
      seoKeywords: productsTable.seoKeywords,
      templateId: productsTable.templateId,
      introduction: productsTable.introduction,
      objective: productsTable.objective,
      authorName: productsTable.authorName,
      authorBio: productsTable.authorBio,
      authorImage: productsTable.authorImage,
      pros: productsTable.pros,
      cons: productsTable.cons,
      methodology: productsTable.methodology,
      support: productsTable.support,
      timeDedication: productsTable.timeDedication,
      testimonials: productsTable.testimonials,
      guarantee: productsTable.guarantee,
      whyImportant: productsTable.whyImportant,
      bonuses: productsTable.bonuses,
      finalOpinion: productsTable.finalOpinion,
      comparisonProduct: productsTable.comparisonProduct,
      updatedAt: productsTable.updatedAt,
      createdAt: productsTable.createdAt,
      categoryName: categoriesTable.name,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.slug, slug))
    .limit(1);

  if (!rows.length) return res.status(404).json({ error: "Not found" });

  const p = rows[0];
  res.json({
    ...p,
    categoryName: p.categoryName ?? null,
    updatedAt: p.updatedAt.toISOString(),
    createdAt: p.createdAt.toISOString(),
  });
});

export default router;
