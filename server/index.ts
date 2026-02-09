import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { storage } from "./storage";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    limit: '10mb',
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false, limit: '10mb' }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // In production, serve static web client if available
  // In development, set up Vite for the web client if available
  // For mobile-only mode, skip web client serving entirely
  if (process.env.NODE_ENV === "production") {
    try {
      serveStatic(app);
    } catch (e) {
      log("No web client build found - running as API-only server");
    }
  } else if (process.env.API_ONLY !== "true") {
    try {
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
    } catch (e) {
      log("Vite setup skipped - running as API-only server for mobile app");
      app.get("/", (_req, res) => {
        res.json({ status: "ok", message: "REWIRE API Server", mode: "api-only" });
      });
    }
  } else {
    app.get("/", (_req, res) => {
      res.json({ status: "ok", message: "REWIRE API Server", mode: "api-only" });
    });
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    async () => {
      log(`serving on port ${port}`);

      // Auto-seed practices if the practice library is empty
      try {
        const existingPractices = await storage.getAllPractices({ limit: 1 } as any);
        if (!existingPractices || existingPractices.length === 0) {
          log("No practices found, seeding default practices...");
          await storage.seedDefaultPractices();
          log("Default practices seeded successfully");
        }
      } catch (error) {
        log(`Practice seeding check failed: ${error}`, "warning");
      }
    },
  );
})();
