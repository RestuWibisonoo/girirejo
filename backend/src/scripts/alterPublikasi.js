const db = require('../config/db');

async function alterTable() {
    try {
        console.log("Menambahkan kolom lampiran_url ke tabel publikasi...");
        await db.query("ALTER TABLE publikasi ADD COLUMN lampiran_url VARCHAR(255);");
        console.log("Kolom berhasil ditambahkan.");
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log("Kolom lampiran_url sudah ada.");
        } else {
            console.error("Gagal alter table:", error);
        }
    } finally {
        if (db && db.end) await db.end();
        process.exit();
    }
}

alterTable();
