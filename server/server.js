require("dotenv").config({
  path: require("path").join(__dirname, "..", ".env"),
});

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const { seedIfNeeded } = require("./seed");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const supplierRoutes = require("./routes/suppliers");
const categoryRoutes = require("./routes/categories");
const stockMovementRoutes = require("./routes/stockMovements");
const userRoutes = require("./routes/users");
const statsRoutes = require("./routes/stats");

const app = express();
const PORT = process.env.PORT || 4000;

// ==================================================
// PATHS
// ==================================================

const backendDir = __dirname;
const frontendDir = path.resolve(__dirname, "..", "frontend");
const uploadsDir = path.join(__dirname, "uploads");

console.log("==========================================");
console.log("📁 TRACKIFY PATHS");
console.log("==========================================");
console.log("Backend directory:", backendDir);
console.log("Frontend directory:", frontendDir);
console.log("Uploads directory:", uploadsDir);
console.log("==========================================");

// ==================================================
// CHECK FRONTEND DIRECTORY
// ==================================================

if (!fs.existsSync(frontendDir)) {
  console.error("❌ FRONTEND DIRECTORY NOT FOUND:");
  console.error(frontendDir);
} else {
  console.log("✅ Frontend directory found");
}

// ==================================================
// CREATE UPLOADS DIRECTORY
// ==================================================

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, {
    recursive: true,
  });

  console.log("✅ Uploads directory created");
} else {
  console.log("✅ Uploads directory already exists");
}

// ==================================================
// SEED DATA
// ==================================================

try {
  seedIfNeeded();
  console.log("✅ Seed check completed");
} catch (error) {
  console.error("❌ Seed error:", error);
}

// ==================================================
// MIDDLEWARE
// ==================================================

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(
  express.json({
    limit: "10mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  }),
);

// ==================================================
// UPLOADED PRODUCT IMAGES
// ==================================================
//
// Browser example:
//
// http://localhost:4000/uploads/example.jpg
//
// ==================================================

app.use(
  "/uploads",
  express.static(uploadsDir, {
    maxAge: "1d",
    fallthrough: false,
  }),
);

// ==================================================
// FRONTEND ASSETS
// ==================================================
//
// This allows:
//
// /css/style.css
// /js/app.js
// /assets/...
// /images/...
//
// ==================================================

app.use(
  express.static(frontendDir, {
    index: false,
    extensions: ["html"],
  }),
);

// ==================================================
// API ROUTES
// ==================================================

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/suppliers", supplierRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/stock-movements", stockMovementRoutes);

app.use("/api/users", userRoutes);

app.use("/api/stats", statsRoutes);

// ==================================================
// HEALTH CHECK
// ==================================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    name: "Trackify API",
    port: PORT,
    frontend: fs.existsSync(frontendDir),
    uploads: fs.existsSync(uploadsDir),
  });
});

// ==================================================
// UPLOADS TEST
// ==================================================
//
// Open:
// http://localhost:4000/api/uploads-test
//
// ==================================================

app.get("/api/uploads-test", (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);

    res.json({
      success: true,
      uploadsDirectory: uploadsDir,
      fileCount: files.length,
      files: files,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ==================================================
// EXPLICIT FRONTEND PAGES
// ==================================================

app.get("/login.html", (req, res) => {
  res.sendFile(path.join(frontendDir, "login.html"));
});

app.get("/register.html", (req, res) => {
  res.sendFile(path.join(frontendDir, "register.html"));
});

app.get("/index.html", (req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

// ==================================================
// ROOT
// ==================================================

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendDir, "login.html"));
});

// ==================================================
// FRONTEND FALLBACK
// ==================================================

app.get("*", (req, res) => {
  // Never send index.html for API requests
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({
      error: "API endpoint not found",
    });
  }

  // Don't interfere with uploads
  if (req.path.startsWith("/uploads/")) {
    return res.status(404).send("Image not found");
  }

  const requestedFile = path.join(frontendDir, req.path);

  // If the requested file actually exists, serve it
  if (fs.existsSync(requestedFile) && fs.statSync(requestedFile).isFile()) {
    return res.sendFile(requestedFile);
  }

  // Otherwise load the dashboard
  res.sendFile(path.join(frontendDir, "index.html"));
});

// ==================================================
// ERROR HANDLER
// ==================================================

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      error: "Image is too large. Maximum size is 5MB.",
    });
  }

  if (err.message === "Only image files are allowed.") {
    return res.status(400).json({
      error: err.message,
    });
  }

  res.status(500).json({
    error: "Something went wrong on the server.",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ==================================================
// START SERVER
// ==================================================

const server = app.listen(PORT, () => {
  console.log("");
  console.log("==========================================");
  console.log("🚀 TRACKIFY SERVER RUNNING");
  console.log("==========================================");

  console.log(`🌐 Main:     http://localhost:${PORT}`);
  console.log(`🔐 Login:    http://localhost:${PORT}/login.html`);
  console.log(`📝 Register: http://localhost:${PORT}/register.html`);
  console.log(`🏠 Index:    http://localhost:${PORT}/index.html`);
  console.log(`❤️ Health:   http://localhost:${PORT}/api/health`);
  console.log(`🖼️ Uploads:  http://localhost:${PORT}/uploads/`);
  console.log(`🧪 Test:     http://localhost:${PORT}/api/uploads-test`);

  console.log("==========================================");
  console.log("");
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use.`);
    console.error("Stop the existing Trackify server and try again.");
  } else {
    console.error("❌ Server error:", err);
  }
});
