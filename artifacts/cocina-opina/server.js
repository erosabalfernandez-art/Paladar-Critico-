import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const API_URL =
  process.env.VITE_API_URL || "https://paladar-critico-api.onrender.com";
const SITE_URL = "https://paladar-critico-web.onrender.com";

// ── Sitemap dinámico ─────────────────────────────────────────────────────────
app.get("/sitemap.xml", async (_req, res) => {
  try {
    const response = await fetch(`${API_URL}/sitemap.xml`);
    const xml = await response.text();
    // Reemplaza cualquier dominio del API por el del frontend
    const fixed = xml.replaceAll(API_URL, SITE_URL);
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(fixed);
  } catch (err) {
    res.status(503).send("<?xml version=\"1.0\"?><error>Sitemap no disponible</error>");
  }
});

// ── Archivos estáticos del build de Vite ────────────────────────────────────
const DIST = path.join(__dirname, "dist", "public");
app.use(express.static(DIST));

// ── SPA fallback (React Router / Wouter) ────────────────────────────────────
app.get("*", (_req, res) => {
  res.sendFile(path.join(DIST, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Frontend server running on port ${PORT}`);
});
