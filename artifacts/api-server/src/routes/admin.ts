import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import crypto from "crypto";

const router = Router();

// Simple password-based admin auth (password stored as env var, defaults to "admin")
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin";
// In-memory sessions (simple for a single-admin CMS)
const sessions = new Set<string>();

// POST /api/admin/login
router.post("/admin/login", async (req, res) => {
  const { password } = req.body as { password: string };
  if (password === ADMIN_PASSWORD) {
    const sessionId = crypto.randomUUID();
    sessions.add(sessionId);
    return res.json({ sessionId });
  }
  return res.status(401).json({ error: "Invalid password" });
});

// Middleware to check session
function requireAuth(req: any, res: any, next: any) {
  const sessionId = req.headers["x-session-id"] as string | undefined;
  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// Helper to enrich product with category name
function serializeProduct(p: typeof productsTable.$inferSelect & { categoryName?: string | null }) {
  return {
    ...p,
    categoryName: p.categoryName ?? null,
    updatedAt: p.updatedAt.toISOString(),
    createdAt: p.createdAt.toISOString(),
  };
}

// GET /api/admin/products
router.get("/admin/products", async (req, res) => {
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
    .orderBy(desc(productsTable.updatedAt));

  res.json(products.map(serializeProduct));
});

// POST /api/admin/products
router.post("/admin/products", async (req, res) => {
  const data = req.body as any;
  const now = new Date();
  const [product] = await db
    .insert(productsTable)
    .values({
      title: data.title,
      slug: data.slug,
      categoryId: data.categoryId ?? null,
      coverImage: data.coverImage ?? null,
      rating: data.rating ?? 5,
      published: data.published ?? false,
      featured: data.featured ?? false,
      price: data.price ?? null,
      affiliateLink: data.affiliateLink ?? null,
      affiliateLinkText: data.affiliateLinkText ?? null,
      videoUrl: data.videoUrl ?? null,
      seoTitle: data.seoTitle ?? null,
      seoDescription: data.seoDescription ?? null,
      seoKeywords: data.seoKeywords ?? null,
      templateId: data.templateId ?? "classic",
      introduction: data.introduction ?? null,
      objective: data.objective ?? null,
      authorName: data.authorName ?? null,
      authorBio: data.authorBio ?? null,
      authorImage: data.authorImage ?? null,
      pros: data.pros ?? null,
      cons: data.cons ?? null,
      methodology: data.methodology ?? null,
      support: data.support ?? null,
      timeDedication: data.timeDedication ?? null,
      testimonials: data.testimonials ?? null,
      guarantee: data.guarantee ?? null,
      whyImportant: data.whyImportant ?? null,
      bonuses: data.bonuses ?? null,
      finalOpinion: data.finalOpinion ?? null,
      comparisonProduct: data.comparisonProduct ?? null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  res.status(201).json(serializeProduct({ ...product, categoryName: null }));
});

// PATCH /api/admin/products/:id
router.patch("/admin/products/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const data = req.body as any;
  const now = new Date();

  const updateData: Partial<typeof productsTable.$inferInsert> = { updatedAt: now };
  const fields = [
    "title","slug","categoryId","coverImage","rating","published","featured",
    "price","affiliateLink","affiliateLinkText","videoUrl","seoTitle","seoDescription",
    "seoKeywords","templateId","introduction","objective","authorName","authorBio",
    "authorImage","pros","cons","methodology","support","timeDedication","testimonials",
    "guarantee","whyImportant","bonuses","finalOpinion","comparisonProduct"
  ];

  for (const field of fields) {
    if (field in data) {
      (updateData as any)[field] = data[field];
    }
  }

  const [updated] = await db
    .update(productsTable)
    .set(updateData)
    .where(eq(productsTable.id, id))
    .returning();

  if (!updated) return res.status(404).json({ error: "Not found" });

  // Get category name
  let categoryName: string | null = null;
  if (updated.categoryId) {
    const cat = await db.select().from(categoriesTable).where(eq(categoriesTable.id, updated.categoryId)).limit(1);
    categoryName = cat[0]?.name ?? null;
  }

  res.json(serializeProduct({ ...updated, categoryName }));
});

// DELETE /api/admin/products/:id
router.delete("/admin/products/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.delete(productsTable).where(eq(productsTable.id, id));
  res.status(204).send();
});

export default router;
