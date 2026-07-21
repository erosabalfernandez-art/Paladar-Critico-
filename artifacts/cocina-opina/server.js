import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const API_URL =
  process.env.VITE_API_URL || "https://paladar-critico-api.onrender.com";
const SITE_URL = "https://paladar-critico-web.onrender.com";
const DIST = path.join(__dirname, "dist", "public");

// Sitemap dinámico — va ANTES del static middleware
app.get("/sitemap.xml", async (_req, res) => {
  try {
    const upstream = await fetch(`${API_URL}/sitemap.xml`, {
      signal: AbortSignal.timeout(10000),
    });
    const xml = (await upstream.text()).replaceAll(API_URL, SITE_URL);
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(xml);
  } catch {
    res
      .status(503)
      .type("application/xml")
      .send(
        `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`
      );
  }
});

// Archivos estáticos
app.use(express.static(DIST));

// SPA fallback
app.get("*", (_req, res) => {
  res.sendFile(path.join(DIST, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server on port ${PORT}`);
});
