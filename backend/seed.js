const fs = require("fs");

const {
    readTable,
    writeTable,
    DATA_DIR
} = require("./db");

// ==================================================
// TRACKIFY SEED
// ==================================================

function seedIfNeeded() {

    console.log("");
    console.log("🌱 Checking Trackify seed data...");

    // ==================================================
    // MAKE SURE DATA DIRECTORY EXISTS
    // ==================================================

    if (!fs.existsSync(DATA_DIR)) {

        fs.mkdirSync(
            DATA_DIR,
            {
                recursive: true
            }
        );

        console.log(
            "✅ Data directory created:",
            DATA_DIR
        );
    }

    // ==================================================
    // CATEGORIES
    // ==================================================

    let categories =
        readTable("categories");

    if (categories.length === 0) {

        categories = [

            {
                id: 1,
                name: "Luxury Watches",
                icon: "⌚",
                description:
                    "Premium luxury watches."
            },

            {
                id: 2,
                name: "Electronics",
                icon: "💻",
                description:
                    "Computers, phones and electronic devices."
            },

            {
                id: 3,
                name: "Fashion",
                icon: "👕",
                description:
                    "Clothing, shoes and fashion products."
            },

            {
                id: 4,
                name: "Home & Living",
                icon: "🏠",
                description:
                    "Furniture and home products."
            },

            {
                id: 5,
                name: "Sports",
                icon: "⚽",
                description:
                    "Sports equipment and accessories."
            },

            {
                id: 6,
                name: "Beauty",
                icon: "💄",
                description:
                    "Beauty and personal care products."
            },

            {
                id: 7,
                name: "Automotive",
                icon: "🚗",
                description:
                    "Automotive products and accessories."
            },

            {
                id: 8,
                name: "Groceries",
                icon: "🛒",
                description:
                    "Food and grocery products."
            }

        ];

        writeTable(
            "categories",
            categories
        );

        console.log(
            "✅ Categories seeded"
        );
    }

    // ==================================================
    // SUPPLIERS
    // ==================================================

    let suppliers =
        readTable("suppliers");

    if (suppliers.length === 0) {

        suppliers = [

            {
                id: 1,
                name:
                    "Global Luxury Imports",
                email:
                    "sales@globalluxury.com",
                phone:
                    "+1 555 100 2000",
                country:
                    "United States",
                address:
                    "New York, USA",
                status:
                    "active",
                createdAt:
                    new Date().toISOString()
            },

            {
                id: 2,
                name:
                    "TechWorld Distribution",
                email:
                    "sales@techworld.com",
                phone:
                    "+44 20 7000 1000",
                country:
                    "United Kingdom",
                address:
                    "London, UK",
                status:
                    "active",
                createdAt:
                    new Date().toISOString()
            },

            {
                id: 3,
                name:
                    "Asia Pacific Traders",
                email:
                    "info@asiapacific.com",
                phone:
                    "+65 6000 3000",
                country:
                    "Singapore",
                address:
                    "Singapore",
                status:
                    "active",
                createdAt:
                    new Date().toISOString()
            },

            {
                id: 4,
                name:
                    "Nepal Premium Suppliers",
                email:
                    "sales@nepalpremium.com",
                phone:
                    "+977 9800000000",
                country:
                    "Nepal",
                address:
                    "Kathmandu, Nepal",
                status:
                    "active",
                createdAt:
                    new Date().toISOString()
            }

        ];

        writeTable(
            "suppliers",
            suppliers
        );

        console.log(
            "✅ Suppliers seeded"
        );
    }

    // ==================================================
    // PRODUCTS
    // ==================================================

    let products =
        readTable("products");

    if (products.length === 0) {

        products = [

            {
                id: 1,
                name:
                    "Rolex Submariner",
                category:
                    "Luxury Watches",
                price:
                    14500,
                stock:
                    8,
                lowStockThreshold:
                    5,
                supplierId:
                    1,
                sku:
                    "ROLEX-SUB-001",
                description:
                    "Luxury Swiss diving watch.",
                image:
                    "",
                createdAt:
                    new Date().toISOString(),
                updatedAt:
                    new Date().toISOString()
            },

            {
                id: 2,
                name:
                    "Apple MacBook Pro 16",
                category:
                    "Electronics",
                price:
                    2499,
                stock:
                    12,
                lowStockThreshold:
                    5,
                supplierId:
                    2,
                sku:
                    "APPLE-MBP-016",
                description:
                    "Professional Apple laptop.",
                image:
                    "",
                createdAt:
                    new Date().toISOString(),
                updatedAt:
                    new Date().toISOString()
            },

            {
                id: 3,
                name:
                    "iPhone 17 Pro Max",
                category:
                    "Electronics",
                price:
                    1399,
                stock:
                    15,
                lowStockThreshold:
                    5,
                supplierId:
                    2,
                sku:
                    "APPLE-IP17-PM",
                description:
                    "Premium Apple smartphone.",
                image:
                    "",
                createdAt:
                    new Date().toISOString(),
                updatedAt:
                    new Date().toISOString()
            },

            {
                id: 4,
                name:
                    "Nike Air Max",
                category:
                    "Fashion",
                price:
                    180,
                stock:
                    22,
                lowStockThreshold:
                    5,
                supplierId:
                    3,
                sku:
                    "NIKE-AIRMAX-001",
                description:
                    "Premium running shoes.",
                image:
                    "",
                createdAt:
                    new Date().toISOString(),
                updatedAt:
                    new Date().toISOString()
            },

            {
                id: 5,
                name:
                    "Samsung OLED TV",
                category:
                    "Electronics",
                price:
                    1899,
                stock:
                    4,
                lowStockThreshold:
                    5,
                supplierId:
                    3,
                sku:
                    "SAMSUNG-OLED-001",
                description:
                    "4K OLED smart television.",
                image:
                    "",
                createdAt:
                    new Date().toISOString(),
                updatedAt:
                    new Date().toISOString()
            }

        ];

        writeTable(
            "products",
            products
        );

        console.log(
            "✅ Products seeded"
        );
    }

    // ==================================================
    // STOCK MOVEMENTS
    // ==================================================

    let stockMovements =
        readTable("stockMovements");

    if (
        !Array.isArray(stockMovements)
    ) {

        stockMovements = [];

        writeTable(
            "stockMovements",
            stockMovements
        );
    }

    // ==================================================
    // USERS
    // ==================================================

    let users =
        readTable("users");

    if (
        !Array.isArray(users)
    ) {

        users = [];

        writeTable(
            "users",
            users
        );
    }

    // ==================================================
    // RESULT
    // ==================================================

    console.log("");
    console.log(
        "=========================================="
    );

    console.log(
        "🌱 TRACKIFY SEED CHECK COMPLETE"
    );

    console.log(
        "=========================================="
    );

    console.log(
        `📦 Products: ${products.length}`
    );

    console.log(
        `🏢 Suppliers: ${suppliers.length}`
    );

    console.log(
        `📂 Categories: ${categories.length}`
    );

    console.log(
        `👤 Users: ${users.length}`
    );

    console.log(
        "=========================================="
    );

    console.log("");
}

// ==================================================
// EXPORT
// ==================================================

module.exports = {
    seedIfNeeded
};