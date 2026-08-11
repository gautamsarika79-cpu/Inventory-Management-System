require("dotenv").config({
    path: require("path").join(__dirname, "..", ".env")
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
const productUploadsDir = path.join(uploadsDir, "products");

console.log("==========================================");
console.log("TRACKIFY PATHS");
console.log("==========================================");
console.log("Backend directory:", backendDir);
console.log("Frontend directory:", frontendDir);
console.log("Uploads directory:", uploadsDir);
console.log("Product images:", productUploadsDir);
console.log("==========================================");

// ==================================================
// CHECK DIRECTORIES
// ==================================================

if (!fs.existsSync(frontendDir)) {
    console.error("ERROR: Frontend directory does not exist:");
    console.error(frontendDir);
} else {
    console.log("Frontend directory found.");
}

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("Created uploads directory:", uploadsDir);
}

if (!fs.existsSync(productUploadsDir)) {
    fs.mkdirSync(productUploadsDir, { recursive: true });
    console.log("Created product uploads directory:", productUploadsDir);
}

// ==================================================
// MIDDLEWARE
// ==================================================

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ==================================================
// STATIC FILES
// ==================================================

// Frontend files
app.use(express.static(frontendDir));

// Original upload path
// Example:
// /uploads/products/rolex-submariner.svg
app.use(
    "/uploads",
    express.static(uploadsDir)
);

// Assets path
// Your database currently stores paths such as:
// /assets/products/rolex-submariner.svg
app.use(
    "/assets",
    express.static(uploadsDir)
);

// Explicit product image route
// This guarantees:
// /uploads/products/file.svg
// and
// /assets/products/file.svg
// both point to backend/uploads/products/file.svg
app.use(
    "/uploads/products",
    express.static(productUploadsDir)
);

app.use(
    "/assets/products",
    express.static(productUploadsDir)
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
    res.json({
        success: true,
        message: "Trackify API is running",
        timestamp: new Date().toISOString()
    });
});

// ==================================================
// IMAGE TEST
// ==================================================

app.get("/api/uploads-test", (req, res) => {
    try {
        const files = fs.readdirSync(productUploadsDir);

        res.json({
            success: true,
            directory: productUploadsDir,
            count: files.length,
            files: files
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ==================================================
// ROOT
// ==================================================

app.get("/", (req, res) => {
    const indexPath = path.join(frontendDir, "index.html");

    if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
    }

    res.json({
        message: "Trackify backend is running",
        frontend: frontendDir
    });
});

// ==================================================
// FRONTEND FALLBACK
// ==================================================

app.get("*", (req, res, next) => {
    // Never intercept API requests
    if (req.path.startsWith("/api/")) {
        return next();
    }

    // Don't intercept static files
    if (path.extname(req.path)) {
        return next();
    }

    const indexPath = path.join(frontendDir, "index.html");

    if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
    }

    next();
});

// ==================================================
// ERROR HANDLER
// ==================================================

app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err);

    res.status(err.status || 500).json({
        error: err.message || "Internal server error"
    });
});

// ==================================================
// START SERVER
// ==================================================

async function startServer() {
    try {
        // Seed database if needed
        if (typeof seedIfNeeded === "function") {
            await seedIfNeeded();
        }

        const server = app.listen(PORT, () => {
            console.log("");
            console.log("==========================================");
            console.log("TRACKIFY SERVER RUNNING");
            console.log("==========================================");
            console.log(`Server:   http://localhost:${PORT}`);
            console.log(`Frontend: http://localhost:${PORT}/index.html`);
            console.log(`Health:   http://localhost:${PORT}/api/health`);
            console.log(`Uploads:  http://localhost:${PORT}/uploads/`);
            console.log(`Assets:   http://localhost:${PORT}/assets/`);
            console.log(`Images:   http://localhost:${PORT}/assets/products/`);
            console.log(`Test:     http://localhost:${PORT}/api/uploads-test`);
            console.log("==========================================");
            console.log("");
        });

        server.on("error", (err) => {
            if (err.code === "EADDRINUSE") {
                console.error(`ERROR: Port ${PORT} is already in use.`);
                console.error("Stop the existing Trackify server and try again.");
            } else {
                console.error("Server error:", err);
            }
        });

    } catch (error) {
        console.error("Failed to start Trackify server:");
        console.error(error);
        process.exit(1);
    }
}

startServer();