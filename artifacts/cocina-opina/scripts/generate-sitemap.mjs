#!/usr/bin/env node
/**
 * Genera public/sitemap.xml ANTES del build de Vite.
 * Vite lo copia a dist/public/sitemap.xml automáticamente.
 * Reintenta hasta 5 veces para manejar el cold start del API en Render free.
 */
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const API_URL =
  process.env.VITE_API_URL || "https://paladar-critico-api.onrender.com";
const SITE_URL = "https://paladar-critico-web.onrender.com";
const OUT = resolve(__dirname, "../public/sitemap.xml");

async function fetchWithRetry(url, retries = 5, delayMs = 5000) {
  for (let i = 1; i <= retries; i++) {
    try {
      console.log(`[sitemap] Intento ${i}/${retries} → ${url}`);
      const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      if (!text.includes("<urlset")) throw new Error("Respuesta no es XML válido");
      return text;
    } catch (err) {
      console.warn(`[sitemap] Intento ${i} fallido: ${err.message}`);
      if (i < retries) {
        console.log(`[sitemap] Esperando ${delayMs / 1000}s...`);
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }
  throw new Error("No se pudo obtener el sitemap tras varios intentos");
}

const xml = (await fetchWithRetry(`${API_URL}/sitemap.xml`)).replaceAll(
  API_URL,
  SITE_URL
);
writeFileSync(OUT, xml, "utf-8");
console.log(`[sitemap] ✓ Guardado en ${OUT}`);
console.log(xml);
