import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Proxy endpoint to fetch Google Drive models without CORS issues
  app.get("/api/drive-proxy", async (req, res) => {
    const fileId = req.query.id;
    if (!fileId || typeof fileId !== "string") {
      res.status(400).json({ error: "Missing file id parameter" });
      return;
    }

    try {
      const driveUrl = `https://docs.google.com/uc?export=download&id=${fileId}`;
      const response = await fetch(driveUrl);
      
      if (!response.ok) {
        res.status(response.status).send(`Failed to fetch from Google Drive: ${response.statusText}`);
        return;
      }

      const buffer = await response.arrayBuffer();
      
      // Set headers for binary STL download
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.send(Buffer.from(buffer));
    } catch (error: any) {
      console.error("Error proxying Google Drive file:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
