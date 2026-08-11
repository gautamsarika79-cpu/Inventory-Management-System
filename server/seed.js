
/*
  TRACKIFY - LUXURY / GLOBAL DEMO DATA SEED

  IMPORTANT:
  1. Put this file in: Trackify/server/seed.js
  2. Make sure your existing server models are:
       server/models/Product.js
       server/models/Supplier.js
       server/config/database.js
  3. Run from Trackify/server:
       node seed.js

  This does NOT delete existing products or suppliers.
  Existing records with the same name/SKU are skipped.
*/

const sequelize = require("./config/database");
const Product = require("./models/Product");
const Supplier = require("./models/Supplier");

const suppliersData = [
  { name: "Global Luxury Imports", email: "luxury@globalimports.example", phone: "+971501000001", address: "Dubai, UAE" },
  { name: "Paris Fashion Distribution", email: "paris@fashion.example", phone: "+33140000002", address: "Paris, France" },
  { name: "Milan Luxury Goods", email: "milan@luxury.example", phone: "+39020000003", address: "Milan, Italy" },
  { name: "Dubai Premium Traders", email: "dubai@premium.example", phone: "+971501000004", address: "Dubai, UAE" },
  { name: "London Luxury Supply", email: "london@luxury.example", phone: "+442000000005", address: "London, UK" },
  { name: "New York Fashion Wholesale", email: "ny@fashion.example", phone: "+12120000006", address: "New York, USA" },
  { name: "Tokyo Electronics Distribution", email: "tokyo@electronics.example", phone: "+81300000007", address: "Tokyo, Japan" },
  { name: "Swiss Watch Traders", email: "swiss@watches.example", phone: "+41440000008", address: "Geneva, Switzerland" },
  { name: "Seoul Beauty Distribution", email: "seoul@beauty.example", phone: "+82200000009", address: "Seoul, South Korea" },
  { name: "Global Automotive Supply", email: "auto@global.example", phone: "+12120000010", address: "New York, USA" }
];

const productsData = [
  ["Rolex Submariner", "LUX-WAT-001", "Luxury Watches", "Iconic luxury dive watch for premium inventory.", 14500, 4, 5, "rolex-submariner.svg", 7],
  ["Cartier Love Bracelet", "LUX-JWL-002", "Jewellery", "Luxury bracelet inspired by the iconic Love collection.", 7350, 6, 5, "cartier-love-bracelet.svg", 1],
  ["Tiffany Diamond Necklace", "LUX-JWL-003", "Jewellery", "Premium diamond necklace for high-end retail.", 12800, 3, 5, "tiffany-necklace.svg", 1],
  ["Van Cleef Alhambra Bracelet", "LUX-JWL-004", "Jewellery", "Elegant clover-inspired luxury jewellery piece.", 5900, 7, 5, "van-cleef-bracelet.svg", 3],
  ["Bulgari Serpenti Watch", "LUX-WAT-005", "Luxury Watches", "Statement luxury watch with a distinctive design.", 9800, 2, 5, "bulgari-watch.svg", 3],

  ["Louis Vuitton Neverfull Bag", "FAS-BAG-006", "Luxury Fashion", "Premium designer tote for luxury fashion inventory.", 1850, 9, 5, "lv-neverfull.svg", 3],
  ["Chanel Classic Flap Bag", "FAS-BAG-007", "Luxury Fashion", "Timeless quilted luxury handbag.", 7200, 3, 5, "chanel-flap.svg", 2],
  ["Gucci GG Marmont Bag", "FAS-BAG-008", "Luxury Fashion", "Designer shoulder bag with signature styling.", 2650, 8, 5, "gucci-marmont.svg", 3],
  ["Dior Saddle Bag", "FAS-BAG-009", "Luxury Fashion", "Iconic structured designer saddle bag.", 4100, 4, 5, "dior-saddle.svg", 2],
  ["Hermes Birkin Bag", "FAS-BAG-010", "Luxury Fashion", "Ultra-premium statement handbag for luxury retail.", 22000, 2, 5, "hermes-birkin.svg", 4],

  ["Burberry Trench Coat", "FAS-CLT-011", "Clothing", "Classic premium outerwear piece.", 2290, 11, 5, "burberry-trench.svg", 5],
  ["Prada Re-Nylon Jacket", "FAS-CLT-012", "Clothing", "Modern designer jacket for premium fashion retail.", 2450, 6, 5, "prada-jacket.svg", 3],
  ["Moncler Puffer Jacket", "FAS-CLT-013", "Clothing", "Premium winter outerwear.", 1950, 5, 5, "moncler-jacket.svg", 5],
  ["Ralph Lauren Polo Shirt", "FAS-CLT-014", "Clothing", "Classic premium casualwear.", 120, 25, 5, "polo-shirt.svg", 6],
  ["Armani Formal Suit", "FAS-CLT-015", "Fashion", "Premium formal suit for professional wardrobes.", 1890, 4, 5, "armani-suit.svg", 5],

  ["Dior Rouge Lipstick", "BEA-MUP-016", "Makeup", "Luxury lipstick for premium beauty inventory.", 48, 18, 5, "dior-lipstick.svg", 9],
  ["Chanel Les Beiges Foundation", "BEA-MUP-017", "Makeup", "Premium complexion makeup.", 72, 12, 5, "chanel-foundation.svg", 9],
  ["Tom Ford Lip Color", "BEA-MUP-018", "Makeup", "Luxury lipstick with premium finish.", 60, 4, 5, "tom-ford-lipstick.svg", 9],
  ["Charlotte Tilbury Foundation", "BEA-MUP-019", "Makeup", "High-end foundation for everyday glam.", 58, 21, 5, "charlotte-foundation.svg", 9],
  ["Estée Lauder Double Wear", "BEA-MUP-020", "Makeup", "Long-wear premium foundation.", 52, 3, 5, "estee-foundation.svg", 9],

  ["La Mer Moisturizing Cream", "SKN-CRM-021", "Skin Care", "Luxury moisturizing cream for premium skincare.", 380, 4, 5, "la-mer-cream.svg", 9],
  ["SK-II Facial Treatment Essence", "SKN-SER-022", "Skin Care", "Premium Japanese skincare essence.", 210, 8, 5, "skii-essence.svg", 9],
  ["Advanced Night Repair Serum", "SKN-SER-023", "Skin Care", "Premium nighttime repair serum.", 125, 13, 5, "night-repair.svg", 9],
  ["Lancôme Advanced Genifique", "SKN-SER-024", "Skin Care", "Luxury anti-aging skincare serum.", 115, 7, 5, "lancome-serum.svg", 9],
  ["Shiseido Ultimune Serum", "SKN-SER-025", "Skin Care", "Japanese premium skincare serum.", 105, 2, 5, "shiseido-serum.svg", 9],

  ["MacBook Pro", "ELE-LAP-026", "Electronics", "Professional laptop for premium technology inventory.", 2499, 10, 5, "macbook-pro.svg", 7],
  ["iPhone 16 Pro", "ELE-PHN-027", "Electronics", "Premium smartphone with advanced camera system.", 1199, 14, 5, "iphone-pro.svg", 7],
  ["Samsung Galaxy S25 Ultra", "ELE-PHN-028", "Electronics", "Flagship Android smartphone.", 1299, 7, 5, "galaxy-ultra.svg", 7],
  ["Sony WH-1000XM5", "ELE-AUD-029", "Electronics", "Premium noise-cancelling headphones.", 399, 19, 5, "sony-headphones.svg", 7],
  ["iPad Pro", "ELE-TAB-030", "Electronics", "Professional premium tablet.", 1099, 3, 5, "ipad-pro.svg", 7],

  ["Porsche 911", "AUT-CAR-031", "Automotive", "Luxury performance sports car inventory record.", 125000, 2, 3, "porsche-911.svg", 10],
  ["Mercedes-Benz S-Class", "AUT-CAR-032", "Automotive", "Premium executive luxury vehicle.", 118000, 3, 3, "mercedes-s-class.svg", 10],
  ["BMW 7 Series", "AUT-CAR-033", "Automotive", "Luxury executive sedan.", 105000, 4, 3, "bmw-7-series.svg", 10],
  ["Range Rover Autobiography", "AUT-CAR-034", "Automotive", "Premium luxury SUV.", 165000, 2, 3, "range-rover.svg", 10],
  ["Lamborghini Urus", "AUT-CAR-035", "Automotive", "High-performance luxury SUV.", 245000, 1, 3, "lamborghini-urus.svg", 10],

  ["Lindt Excellence Chocolate", "FOO-CHO-036", "Food & Beverages", "Premium dark chocolate inventory.", 12.5, 35, 5, "lindt-chocolate.svg", 4],
  ["Ferrero Rocher", "FOO-CHO-037", "Food & Beverages", "Premium boxed chocolate confectionery.", 18, 4, 5, "ferrero-rocher.svg", 4],
  ["Nespresso Coffee Capsules", "FOO-COF-038", "Food & Beverages", "Premium coffee capsules.", 24, 22, 5, "nespresso.svg", 4],
  ["Twinings Premium Tea", "FOO-TEA-039", "Food & Beverages", "Premium tea collection.", 15, 18, 5, "twinings-tea.svg", 4],
  ["Godiva Chocolate Box", "FOO-CHO-040", "Food & Beverages", "Luxury chocolate assortment.", 35, 3, 5, "godiva.svg", 4],

  ["Dyson Airwrap", "HOM-BEA-041", "Home & Living", "Premium hair styling appliance.", 599, 8, 5, "dyson-airwrap.svg", 1],
  ["Bang & Olufsen Speaker", "HOM-AUD-042", "Home & Living", "Premium home audio speaker.", 799, 3, 5, "bang-olufsen.svg", 1],
  ["KitchenAid Artisan Mixer", "HOM-KIT-043", "Home & Living", "Premium kitchen stand mixer.", 449, 9, 5, "kitchenaid.svg", 4],
  ["Le Creuset Cookware Set", "HOM-KIT-044", "Home & Living", "Premium cookware set.", 650, 4, 5, "le-creuset.svg", 4],
  ["Dyson Purifier", "HOM-AIR-045", "Home & Living", "Premium air purification appliance.", 549, 6, 5, "dyson-purifier.svg", 1],

  ["Nike Air Max", "SPT-SHO-046", "Sports & Fitness", "Premium athletic footwear.", 180, 24, 5, "nike-airmax.svg", 6],
  ["Adidas Ultraboost", "SPT-SHO-047", "Sports & Fitness", "Premium running footwear.", 190, 4, 5, "adidas-ultraboost.svg", 5],
  ["Apple Watch Ultra", "SPT-WAT-048", "Sports & Fitness", "Premium smartwatch for fitness and outdoor use.", 799, 2, 5, "apple-watch-ultra.svg", 7],
  ["Garmin Fenix", "SPT-WAT-049", "Sports & Fitness", "Premium multisport GPS watch.", 699, 6, 5, "garmin-fenix.svg", 7],
  ["Peloton Bike", "SPT-GYM-050", "Sports & Fitness", "Premium connected indoor cycling equipment.", 1895, 2, 3, "peloton-bike.svg", 5]
];

function imagePath(file) {
  return `/assets/products/${file}`;
}

async function createSupplier(data) {
  const where = {};
  if (Supplier.rawAttributes.name) where.name = data.name;
  const existing = await Supplier.findOne({ where });
  if (existing) return existing;

  const attrs = {};
  for (const [key, value] of Object.entries(data)) {
    if (Supplier.rawAttributes[key]) attrs[key] = value;
  }
  return Supplier.create(attrs);
}

async function run() {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");

    const suppliers = [];
    for (const data of suppliersData) {
      suppliers.push(await createSupplier(data));
    }

    const supplierBySeedIndex = suppliers;

    let created = 0;
    let skipped = 0;

    for (const row of productsData) {
      const [name, sku, category, description, price, quantity, minimumStock, image, supplierIndex] = row;

      const existing = await Product.findOne({ where: { sku } });
      if (existing) {
        skipped++;
        continue;
      }

      const supplier = supplierBySeedIndex[supplierIndex - 1];
      if (!supplier) {
        console.log(`Skipped ${name}: supplier not available.`);
        skipped++;
        continue;
      }

      await Product.create({
        name,
        sku,
        category,
        description,
        price,
        quantity,
        minimumStock,
        image: imagePath(image),
        supplierId: supplier.id
      });

      created++;
      console.log(`Added: ${name}`);
    }

    console.log("\n========================================");
    console.log("Trackify demo data completed.");
    console.log(`Suppliers available: ${suppliers.length}`);
    console.log(`Products created: ${created}`);
    console.log(`Products skipped: ${skipped}`);
    console.log("========================================\n");

    await sequelize.close();
  } catch (error) {
    console.error("\nSeed failed:");
    console.error(error);
    process.exitCode = 1;
  }
}

run();
