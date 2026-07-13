const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../../.env') }); // Perbaikan path dotenv jika dijalankan dari dalam script ini

async function importDatabase() {
    try {
        console.log("Menyiapkan koneksi ke MySQL...");
        
        // Koneksi awal (tanpa menentukan database, karena mungkin databasenya belum ada)
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || '',
            multipleStatements: true // Penting agar bisa eksekusi banyak query dari file SQL
        });

        const sqlFilePath = path.join(__dirname, '../../../database/db_girirejo.sql');
        console.log(`Membaca file SQL dari: ${sqlFilePath}`);
        
        const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

        console.log("Mengeksekusi SQL...");
        await connection.query(sqlContent);
        
        console.log("✅ Database dan tabel berhasil diimpor dengan sukses!");
        
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error("❌ Gagal mengimpor database:", error);
        process.exit(1);
    }
}

importDatabase();
