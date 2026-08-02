const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const umkmData = [
    { 
        // 1 - Kuliner Tradisional
        kategori_id: 1, 
        nama_usaha: 'Getuk Mba Elin', 
        nama_pemilik: 'Elin',
        deskripsi: 'Alamat: Geger 2, Girirejo.\nJual keliling sendiri di pengajian. Berdiri sejak tahun 2010.\nHarga bervariasi: per mika (Rp 2.000 - Rp 5.000) / tampah buat manten (Rp 85.000 - Rp 120.000 tergantung eblek dan isi getuk).',
        harga_mulai: 2000,
        no_wa: '089524537582',
        foto_url: '',
        link_gmaps: ''
    }
];

async function seed() {
    try {
        console.log('Memasukkan data UMKM...');
        for (const u of umkmData) {
            await pool.query(
                'INSERT INTO umkm_katalog (kategori_id, nama_usaha, nama_pemilik, deskripsi, harga_mulai, no_wa, foto_url, link_gmaps) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [u.kategori_id, u.nama_usaha, u.nama_pemilik, u.deskripsi, u.harga_mulai, u.no_wa, u.foto_url, u.link_gmaps]
            );
            console.log(`Berhasil insert: ${u.nama_usaha}`);
        }
        
        console.log('✅ Selesai memasukkan data UMKM!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Gagal:', err);
        process.exit(1);
    }
}

seed();
