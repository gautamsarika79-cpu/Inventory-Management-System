const fs = require("fs");
const path = require("path");

// ==================================================
// TRACKIFY DATABASE DIRECTORY
// ==================================================

const DATA_DIR = path.join(__dirname, "data");

// Create data directory automatically
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, {
        recursive: true
    });

    console.log("✅ Data directory created:", DATA_DIR);
}

// ==================================================
// FILE PATH
// ==================================================

function filePath(name) {
    return path.join(DATA_DIR, `${name}.json`);
}

// ==================================================
// READ TABLE
// ==================================================

function readTable(name) {
    const fp = filePath(name);

    if (!fs.existsSync(fp)) {
        return [];
    }

    try {
        const raw = fs.readFileSync(fp, "utf8").trim();

        if (!raw) {
            return [];
        }

        const data = JSON.parse(raw);

        return Array.isArray(data) ? data : [];

    } catch (error) {
        console.error(
            `❌ Error reading ${name}.json:`,
            error.message
        );

        return [];
    }
}

// ==================================================
// WRITE TABLE
// ==================================================

function writeTable(name, data) {
    const fp = filePath(name);

    if (!Array.isArray(data)) {
        throw new Error(
            `${name} must be an array.`
        );
    }

    try {
        fs.writeFileSync(
            fp,
            JSON.stringify(data, null, 2),
            "utf8"
        );

    } catch (error) {

        console.error(
            `❌ Error writing ${name}.json:`,
            error.message
        );

        throw error;
    }
}

// ==================================================
// NEXT ID
// ==================================================

function nextId(rows) {

    if (
        !Array.isArray(rows) ||
        rows.length === 0
    ) {
        return 1;
    }

    return (
        rows.reduce(
            (max, row) => {

                const id =
                    Number(row?.id) || 0;

                return Math.max(
                    max,
                    id
                );
            },
            0
        ) + 1
    );
}

// ==================================================
// EXPORTS
// ==================================================

module.exports = {
    readTable,
    writeTable,
    nextId,
    DATA_DIR
};