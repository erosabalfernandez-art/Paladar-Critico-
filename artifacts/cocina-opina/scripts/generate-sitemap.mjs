#!/usr/bin/env node
/**
 * Genera public/sitemap.xml fetcheando el sitemap dinámico del API.
 * Se ejecuta como parte del build para que el archivo quede en dist/public/sitemap.xml.
 */
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const API_URL =
  process.env.VITE_API_URL || "https://paladar-critico-api.onrender.com";
const SITE_URL = "https://paladar-critico-web.onrender.com";
const OUT = resolve(__dirname, "../dist/public/sitemap.xml");

console.log(`[sitemap] Fetching from ${API_URL}/sitemap.xml ...`);

const res = await fetch(`${API_URL}/sitemap.xml`);
if (!res.ok) throw new Error(`HTTP ${res.status}`);

const xml = (await res.text()).replaceAll(API_URL, SITE_URL);
writeFileSync(OUT, xml, "utf-8");

console.log(`[sitemap] Saved to ${OUT}`);
console.log(xml);
