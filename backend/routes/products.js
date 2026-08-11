const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
    readTable,
    writeTable,
    nextId,
} = require("../db");

const {
    protect,
    adminOnly,
} = require("../middleware/auth");

const router = express.Router();

// ==================================================
// UPLOAD DIRECTORIES
// ==================================================

const uploadsDir = path.join(
    __dirname,
    "..",
    "uploads"
);

const productUploadsDir = path.join(
    uploadsDir,
    "products"
);

if (!fs.existsSync(productUploadsDir)) {
    fs.mkdirSync(productUploadsDir, {
        recursive: true,
    });

    console.log(
        "✅ Product upload directory created:",
        productUploadsDir
    );
}

// ==================================================
// MULTER STORAGE
// ==================================================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, productUploadsDir);
    },

    filename: (req, file, cb) => {
        const ext = path
            .extname(file.originalname)
            .toLowerCase();

        const baseName = path
            .basename(file.originalname, ext)
            .replace(/[^a-zA-Z0-9-_]/g, "-")
            .substring(0, 50);

        const uniqueName =
            `${baseName}-${Date.now()}-${Math.round(
                Math.random() * 100000
            )}${ext}`;

        cb(null, uniqueName);
    },
});

// ==================================================
// FILE FILTER
// ==================================================

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/svg+xml",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only JPG, PNG, WEBP, GIF and SVG images are allowed."
            )
        );
    }
};

// ==================================================
// MULTER
// ==================================================

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

// ==================================================
// IMAGE URL HELPER
// ==================================================

function imageUrl(req, image) {
    if (!image) {
        return "";
    }

    const value = String(image).trim();

    if (!value) {
        return "";
    }

    // Already a complete URL
    if (
        value.startsWith("http://") ||
        value.startsWith("https://")
    ) {
        return value;
    }

    // Built-in Trackify assets
    if (value.startsWith("/assets/")) {
        return `${req.protocol}://${req.get("host")}${value}`;
    }

    // Uploaded image already has correct path
    if (value.startsWith("/uploads/products/")) {
        return `${req.protocol}://${req.get("host")}${value}`;
    }

    // Uploaded image using /uploads/ path
    if (value.startsWith("/uploads/")) {
        const filename = path.basename(value);

        return (
            `${req.protocol}://${req.get("host")}` +
            `/uploads/products/${encodeURIComponent(filename)}`
        );
    }

    // Filename only
    // Product images are stored in:
    // backend/uploads/products/
    const filename = path.basename(value);

    if (!filename) {
        return "";
    }

    return (
        `${req.protocol}://${req.get("host")}` +
        `/uploads/products/${encodeURIComponent(filename)}`
    );
}

// ==================================================
// REMOVE UPLOADED IMAGE
// ==================================================

function removeImage(image) {
    if (!image) {
        return;
    }

    const value = String(image).trim();

    // NEVER delete built-in assets
    if (value.startsWith("/assets/")) {
        return;
    }

    let filename = "";

    // Complete URL
    if (
        value.startsWith("http://") ||
        value.startsWith("https://")
    ) {
        try {
            const parsed = new URL(value);

            if (
                parsed.pathname.startsWith(
                    "/assets/"
                )
            ) {
                return;
            }

            filename = path.basename(
                parsed.pathname
            );
        } catch (error) {
            console.error(
                "Could not parse image URL:",
                error.message
            );

            return;
        }
    } else {
        filename = path.basename(value);
    }

    if (!filename) {
        return;
    }

    const filePath = path.join(
        productUploadsDir,
        filename
    );

    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);

            console.log(
                "🗑️ Removed product image:",
                filename
            );
        } catch (error) {
            console.error(
                "Could not remove image:",
                error.message
            );
        }
    }
}

// ==================================================
// GET ALL PRODUCTS
// GET /api/products
// ==================================================

router.get(
    "/",
    protect,
    (req, res) => {
        let products = readTable("products");

        const {
            search,
            category,
            lowStock,
            sort,
        } = req.query;

        // SEARCH
        if (search) {
            const q = search
                .toLowerCase()
                .trim();

            products = products.filter(
                (p) =>
                    String(p.name || "")
                        .toLowerCase()
                        .includes(q) ||
                    String(p.sku || "")
                        .toLowerCase()
                        .includes(q) ||
                    String(
                        p.description || ""
                    )
                        .toLowerCase()
                        .includes(q)
            );
        }

        // CATEGORY
        if (
            category &&
            category !== "All"
        ) {
            products = products.filter(
                (p) =>
                    p.category ===
                    category
            );
        }

        // LOW STOCK
        if (lowStock === "true") {
            products = products.filter(
                (p) =>
                    Number(
                        p.stock ??
                        p.quantity ??
                        0
                    ) <=
                    Number(
                        p.lowStockThreshold ??
                        p.minimumStock ??
                        5
                    )
            );
        }

        // SORT
        if (sort === "price_asc") {
            products.sort(
                (a, b) =>
                    Number(a.price) -
                    Number(b.price)
            );
        }

        if (sort === "price_desc") {
            products.sort(
                (a, b) =>
                    Number(b.price) -
                    Number(a.price)
            );
        }

        if (sort === "stock_asc") {
            products.sort(
                (a, b) =>
                    Number(
                        a.stock ??
                        a.quantity ??
                        0
                    ) -
                    Number(
                        b.stock ??
                        b.quantity ??
                        0
                    )
            );
        }

        if (sort === "name_asc") {
            products.sort(
                (a, b) =>
                    String(
                        a.name || ""
                    ).localeCompare(
                        String(
                            b.name || ""
                        )
                    )
            );
        }

        // ADD CORRECT IMAGE URL
        const productsWithUrls =
            products.map((p) => ({
                ...p,

                stock:
                    p.stock ??
                    p.quantity ??
                    0,

                lowStockThreshold:
                    p.lowStockThreshold ??
                    p.minimumStock ??
                    5,

                image: p.image
                    ? imageUrl(
                          req,
                          p.image
                      )
                    : "",
            }));

        res.json({
            count:
                productsWithUrls.length,

            products:
                productsWithUrls,
        });
    }
);

// ==================================================
// GET SINGLE PRODUCT
// GET /api/products/:id
// ==================================================

router.get(
    "/:id",
    protect,
    (req, res) => {
        const products =
            readTable("products");

        const product =
            products.find(
                (p) =>
                    p.id ===
                    Number(
                        req.params.id
                    )
            );

        if (!product) {
            return res.status(404).json({
                error:
                    "Product not found.",
            });
        }

        const suppliers =
            readTable("suppliers");

        const supplier =
            suppliers.find(
                (s) =>
                    s.id ===
                    product.supplierId
            ) || null;

        const movements =
            readTable(
                "stockMovements"
            )
                .filter(
                    (m) =>
                        m.productId ===
                        product.id
                )
                .sort(
                    (a, b) =>
                        new Date(
                            b.date
                        ) -
                        new Date(
                            a.date
                        )
                );

        const result = {
            ...product,

            stock:
                product.stock ??
                product.quantity ??
                0,

            lowStockThreshold:
                product.lowStockThreshold ??
                product.minimumStock ??
                5,

            image: product.image
                ? imageUrl(
                      req,
                      product.image
                  )
                : "",
        };

        res.json({
            product: result,
            supplier,
            movements,
        });
    }
);

// ==================================================
// CREATE PRODUCT
// POST /api/products
// ==================================================

router.post(
    "/",
    protect,
    upload.single("image"),
    (req, res) => {
        try {
            const {
                name,
                category,
                price,
                stock,
                lowStockThreshold,
                supplierId,
                sku,
                description,
            } = req.body;

            if (
                !name ||
                !category ||
                price == null ||
                stock == null ||
                !sku
            ) {
                if (req.file) {
                    removeImage(
                        req.file.filename
                    );
                }

                return res.status(400).json({
                    error:
                        "name, category, price, stock and sku are required.",
                });
            }

            const products =
                readTable("products");

            const duplicate =
                products.find(
                    (p) =>
                        String(
                            p.sku || ""
                        )
                            .toLowerCase() ===
                        String(
                            sku
                        )
                            .toLowerCase()
                );

            if (duplicate) {
                if (req.file) {
                    removeImage(
                        req.file.filename
                    );
                }

                return res.status(409).json({
                    error:
                        "A product with this SKU already exists.",
                });
            }

            const image = req.file
                ? req.file.filename
                : "";

            const newProduct = {
                id: nextId(products),

                name: String(
                    name
                ).trim(),

                category: String(
                    category
                ).trim(),

                price: Number(price),

                stock: Number(stock),

                lowStockThreshold:
                    lowStockThreshold !=
                    null
                        ? Number(
                              lowStockThreshold
                          )
                        : 5,

                supplierId:
                    supplierId
                        ? Number(
                              supplierId
                          )
                        : null,

                sku: String(
                    sku
                ).trim(),

                description:
                    description || "",

                image,

                createdAt:
                    new Date().toISOString(),

                updatedAt:
                    new Date().toISOString(),
            };

            products.push(newProduct);

            writeTable(
                "products",
                products
            );

            res.status(201).json({
                product: {
                    ...newProduct,

                    image: image
                        ? imageUrl(
                              req,
                              image
                          )
                        : "",
                },
            });
        } catch (error) {
            console.error(
                "Create product error:",
                error
            );

            if (req.file) {
                removeImage(
                    req.file.filename
                );
            }

            res.status(500).json({
                error:
                    "Could not create product.",
                message:
                    error.message,
            });
        }
    }
);

// ==================================================
// UPDATE PRODUCT
// PUT /api/products/:id
// ==================================================

router.put(
    "/:id",
    protect,
    upload.single("image"),
    (req, res) => {
        try {
            const products =
                readTable("products");

            const idx =
                products.findIndex(
                    (p) =>
                        p.id ===
                        Number(
                            req.params.id
                        )
                );

            if (idx === -1) {
                if (req.file) {
                    removeImage(
                        req.file.filename
                    );
                }

                return res.status(404).json({
                    error:
                        "Product not found.",
                });
            }

            const oldImage =
                products[idx].image;

            const fields = [
                "name",
                "category",
                "price",
                "stock",
                "lowStockThreshold",
                "supplierId",
                "sku",
                "description",
            ];

            fields.forEach(
                (field) => {
                    if (
                        req.body[field] !==
                        undefined
                    ) {
                        if (
                            [
                                "price",
                                "stock",
                                "lowStockThreshold",
                                "supplierId",
                            ].includes(
                                field
                            )
                        ) {
                            products[idx][
                                field
                            ] =
                                req.body[
                                    field
                                ] === ""
                                    ? null
                                    : Number(
                                          req.body[
                                              field
                                          ]
                                      );
                        } else {
                            products[idx][
                                field
                            ] =
                                req.body[
                                    field
                                ];
                        }
                    }
                }
            );

            const duplicate =
                products.find(
                    (p, i) =>
                        i !== idx &&
                        String(
                            p.sku || ""
                        )
                            .toLowerCase() ===
                        String(
                            products[idx]
                                .sku || ""
                        )
                            .toLowerCase()
                );

            if (duplicate) {
                if (req.file) {
                    removeImage(
                        req.file.filename
                    );
                }

                return res.status(409).json({
                    error:
                        "A product with this SKU already exists.",
                });
            }

            if (req.file) {
                products[idx].image =
                    req.file.filename;

                if (
                    oldImage &&
                    oldImage !==
                        req.file.filename
                ) {
                    removeImage(
                        oldImage
                    );
                }
            }

            products[idx].updatedAt =
                new Date().toISOString();

            writeTable(
                "products",
                products
            );

            res.json({
                product: {
                    ...products[idx],

                    image:
                        products[idx]
                            .image
                            ? imageUrl(
                                  req,
                                  products[
                                      idx
                                  ].image
                              )
                            : "",
                },
            });
        } catch (error) {
            console.error(
                "Update product error:",
                error
            );

            if (req.file) {
                removeImage(
                    req.file.filename
                );
            }

            res.status(500).json({
                error:
                    "Could not update product.",
                message:
                    error.message,
            });
        }
    }
);

// ==================================================
// DELETE PRODUCT
// DELETE /api/products/:id
// ==================================================

router.delete(
    "/:id",
    protect,
    adminOnly,
    (req, res) => {
        const products =
            readTable("products");

        const idx =
            products.findIndex(
                (p) =>
                    p.id ===
                    Number(
                        req.params.id
                    )
            );

        if (idx === -1) {
            return res.status(404).json({
                error:
                    "Product not found.",
            });
        }

        const [removed] =
            products.splice(idx, 1);

        if (removed.image) {
            removeImage(
                removed.image
            );
        }

        writeTable(
            "products",
            products
        );

        res.json({
            deleted: removed,
        });
    }
);

// ==================================================
// MULTER ERROR HANDLER
// ==================================================

router.use(
    (error, req, res, next) => {
        if (
            error instanceof
            multer.MulterError
        ) {
            if (
                error.code ===
                "LIMIT_FILE_SIZE"
            ) {
                return res.status(400).json({
                    error:
                        "Image is too large. Maximum size is 5MB.",
                });
            }

            return res.status(400).json({
                error:
                    error.message,
            });
        }

        if (error) {
            return res.status(400).json({
                error:
                    error.message,
            });
        }

        next();
    }
);

module.exports = router;