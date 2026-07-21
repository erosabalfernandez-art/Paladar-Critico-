import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Archivos estáticos del build de Vite (incluye sitemap.xml generado en el build)
const DIST = path.join(__dirname, "dist", "public");
app.use(express.static(DIST));

// SPA fallback: todas las rutas devuelven index.html
app.get("*", (_req, res) => {
  res.sendFile(path.join(DIST, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Frontend server running on port ${PORT}`);
});
