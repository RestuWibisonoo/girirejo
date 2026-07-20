const db = require('../config/db');

async function alterTable() {
    try {
        console.log("Menambahkan kolom views_count dan tags ke tabel publikasi...");
        await db.query("ALTER TABLE publikasi ADD COLUMN views_count INT DEFAULT 0;");
        console.log("Kolom views_count berhasil ditambahkan.");
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log("Kolom views_count sudah ada.");
        } else {
            console.error("Gagal alter table (views_count):", error);
        }
    }

    try {
        await db.query("ALTER TABLE publikasi ADD COLUMN tags VARCHAR(255);");
        console.log("Kolom tags berhasil ditambahkan.");
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log("Kolom tags sudah ada.");
        } else {
            console.error("Gagal alter table (tags):", error);
        }
    }

    if (db && db.end) await db.end();
    process.exit();
}

alterTable();
