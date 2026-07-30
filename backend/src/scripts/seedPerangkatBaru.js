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

const perangkatData = [
    { nama_lengkap: 'DHIKO SUTOPO, SH', jabatan: 'Kepala Desa', urutan_tampil: 1 },
    { nama_lengkap: 'MUH RIPTO', jabatan: 'Sekretaris Desa', urutan_tampil: 2 },
    { nama_lengkap: 'SRI ROCHAYANI', jabatan: 'Kaur Perencanaan', urutan_tampil: 3 },
    { nama_lengkap: 'AFIFUDIN ZUCHRI', jabatan: 'Kaur Keuangan', urutan_tampil: 4 },
    { nama_lengkap: 'ASTIN BINTARTI', jabatan: 'Kaur TU dan Umum', urutan_tampil: 5 },
    { nama_lengkap: 'AYAT SUPARI', jabatan: 'Kasi Pelayanan', urutan_tampil: 6 },
    { nama_lengkap: 'RACHMAT AGUS SANTOSO', jabatan: 'Kasi Kesra', urutan_tampil: 7 },
    { nama_lengkap: 'SAFIRA APRIYANDA ZAHRO', jabatan: 'Kasi Pemerintahan', urutan_tampil: 8 },
    { nama_lengkap: 'SAMSUDIN', jabatan: 'Kadus Geger I, Geger II', urutan_tampil: 9 },
    { nama_lengkap: 'HENDI BAGUS PRAYOGA', jabatan: 'Kadus Pending, Beran', urutan_tampil: 10 },
    { nama_lengkap: 'ACHMAD SOFA', jabatan: 'Kadus Salakan, Sobokarang', urutan_tampil: 11 }
];

async function seed() {
    try {
        console.log('Menghapus data perangkat desa yang lama...');
        await pool.query('TRUNCATE TABLE perangkat_desa');

        console.log('Memasukkan data perangkat desa yang baru...');
        for (const p of perangkatData) {
            await pool.query(
                'INSERT INTO perangkat_desa (nama_lengkap, jabatan, urutan_tampil) VALUES (?, ?, ?)',
                [p.nama_lengkap, p.jabatan, p.urutan_tampil]
            );
            console.log(`Berhasil insert: ${p.nama_lengkap}`);
        }
        
        console.log('✅ Selesai memperbarui data Perangkat Desa!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Gagal:', err);
        process.exit(1);
    }
}

seed();
