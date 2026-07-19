import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const categoriesTable = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
});

export const insertCategorySchema = createInsertSchema(categoriesTable).omit({ id: true });
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categoriesTable.$inferSelect;

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  categoryId: integer("category_id").references(() => categoriesTable.id),
  coverImage: text("cover_image"),
  rating: integer("rating").notNull().default(5),
  published: boolean("published").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
  price: text("price"),
  affiliateLink: text("affiliate_link"),
  affiliateLinkText: text("affiliate_link_text"),
  videoUrl: text("video_url"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  seoKeywords: text("seo_keywords"),
  templateId: text("template_id").default("classic"),
  introduction: text("introduction"),
  objective: text("objective"),
  authorName: text("author_name"),
  authorBio: text("author_bio"),
  authorImage: text("author_image"),
  pros: text("pros"),
  cons: text("cons"),
  methodology: text("methodology"),
  support: text("support"),
  timeDedication: text("time_dedication"),
  testimonials: text("testimonials"),
  guarantee: text("guarantee"),
  whyImportant: text("why_important"),
  bonuses: text("bonuses"),
  finalOpinion: text("final_opinion"),
  comparisonProduct: text("comparison_product"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
