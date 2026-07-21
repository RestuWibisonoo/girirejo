require('dotenv').config();
const mysql = require('mysql2/promise');

async function main() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || '',
            database: process.env.DB_NAME || 'db_girirejo'
        });

        console.log('Menambahkan kolom nip ke tabel perangkat_desa...');
        
        try {
            await connection.query("ALTER TABLE perangkat_desa ADD COLUMN nip VARCHAR(50) DEFAULT NULL AFTER jabatan;");
            console.log('Kolom nip berhasil ditambahkan.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('Kolom nip sudah ada. Melewati proses ini.');
            } else {
                throw err;
            }
        }

        await connection.end();
        console.log('Selesai!');
    } catch (error) {
        console.error('Gagal:', error);
    }
}

main();
