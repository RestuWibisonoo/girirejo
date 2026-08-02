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

const categories = [
  { nama_kategori: 'Makanan', slug: 'makanan' },
  { nama_kategori: 'Minuman', slug: 'minuman' },
  { nama_kategori: 'Kerajinan', slug: 'kerajinan' },
  { nama_kategori: 'Pertanian', slug: 'pertanian' },
  { nama_kategori: 'Jasa', slug: 'jasa' },
  { nama_kategori: 'Fashion', slug: 'fashion' },
  { nama_kategori: 'Lainnya', slug: 'lainnya' },
  { nama_kategori: 'Kuliner Tradisional', slug: 'kuliner-tradisional' }
];

const umkmData = [
    {
        kategori_nama: 'Lainnya',
        nama_usaha: 'SHOD KOPI dan SHOD STEAM',
        nama_pemilik: 'Pak Risodi',
        deskripsi: 'Alamat: Geger, Girirejo, Tegalrejo.\nHarga: Rp 170.000 (kopi bubuk), Rp 150.000 (kopi bean), dan Rp 30.000 per karpet (untuk jasa steam, tergantung ukuran).',
        harga_mulai: 30000,
        no_wa: '085876592753',
        foto_url: '',
        link_gmaps: ''
    },
    {
        kategori_nama: 'Makanan',
        nama_usaha: 'Rengginang Comel',
        nama_pemilik: 'Santo Khusnafi',
        deskripsi: 'Alamat: Kidul Kulon Geger II RT 3 RW 3, Girirejo, Tegalrejo.\nHarga: Comel Rp 35.000/kg, Putih Rp 13.000, Comel Rp 12.000 (2,5 ons).',
        harga_mulai: 12000,
        no_wa: '085624072899',
        foto_url: '',
        link_gmaps: ''
    },
    {
        kategori_nama: 'Jasa',
        nama_usaha: 'Bengkel Las, Pandai Besi, Tambal Ban',
        nama_pemilik: 'Bapak Teguh Rahayu',
        deskripsi: 'Alamat: Geger 2.\nHarga: Pisau kecil Rp 10.000, pisau besar Rp 15.000 (bervariasi tergantung jenisnya).',
        harga_mulai: 10000,
        no_wa: '085878028010',
        foto_url: '',
        link_gmaps: ''
    },
    {
        kategori_nama: 'Makanan',
        nama_usaha: 'Kerupuk Bintang Jaya',
        nama_pemilik: 'Pak Hamdani',
        deskripsi: 'Alamat: Geger II RT 2 Girirejo, Tegalrejo, Magelang.\nHarga: Rp 35.000 / 2kg.',
        harga_mulai: 35000,
        no_wa: '085643759093',
        foto_url: '',
        link_gmaps: ''
    },
    {
        kategori_nama: 'Makanan',
        nama_usaha: 'Ceker Tanpa Tulang',
        nama_pemilik: 'Pak Iwan',
        deskripsi: 'Alamat: Geger.\nHarga: Rp 70.000 / 1 kg.',
        harga_mulai: 70000,
        no_wa: '085865744691',
        foto_url: '',
        link_gmaps: ''
    },
    {
        kategori_nama: 'Makanan',
        nama_usaha: 'Sempol Ayam dan Ubi Lumer DA',
        nama_pemilik: 'Mba Anma',
        deskripsi: 'Alamat: Beran.\nHarga: Sempol Rp 1.500 (isi 3/mika), Ubi Lumer Rp 800. Sandwich Rp 2.500, Donat Rp 1.700.',
        harga_mulai: 800,
        no_wa: '08815396566',
        foto_url: '',
        link_gmaps: ''
    },
    {
        kategori_nama: 'Makanan',
        nama_usaha: 'Macam Macam Gorengan Mba Andin',
        nama_pemilik: 'Andin',
        deskripsi: 'Alamat: RT 2 Beran, Girirejo.\nHarga: Gorengan seribuan (dari Mba Andin Rp 800).',
        harga_mulai: 800,
        no_wa: '085876140006',
        foto_url: '',
        link_gmaps: ''
    },
    {
        kategori_nama: 'Kuliner Tradisional',
        nama_usaha: 'Jajanan Pasar Tenong (Produksi Lokal)',
        nama_pemilik: 'Bu Maryati',
        deskripsi: 'Alamat: RT 3 Beran, Girirejo.\nProduksi lokal dari ketela atau ubi. Mulai jualan keliling jam 6 pagi.\nHarga: Rp 1.000 - Rp 3.000.',
        harga_mulai: 1000,
        no_wa: '085727719193',
        foto_url: '',
        link_gmaps: ''
    },
    {
        kategori_nama: 'Kuliner Tradisional',
        nama_usaha: 'Jajan Pasar Bu Yati',
        nama_pemilik: 'Sri Nuryati',
        deskripsi: 'Alamat: RT 3 Beran, Girirejo.\nHarga: Seribuan.',
        harga_mulai: 1000,
        no_wa: '085715093346',
        foto_url: '',
        link_gmaps: ''
    },
    {
        kategori_nama: 'Kuliner Tradisional',
        nama_usaha: 'Jajanan Pasar Tenong',
        nama_pemilik: 'Bu Suprapti',
        deskripsi: 'Alamat: Beran, Girirejo.\nHarga: Rp 1.000 - Rp 3.000.',
        harga_mulai: 1000,
        no_wa: '085702121364',
        foto_url: '',
        link_gmaps: ''
    },
    {
        kategori_nama: 'Makanan',
        nama_usaha: 'Kerupuk Cap Udang Bintang',
        nama_pemilik: 'Ibu Sugiarti',
        deskripsi: 'Alamat: Geger.\nHarga: Rp 70.000 / 4kg.',
        harga_mulai: 70000,
        no_wa: '-',
        foto_url: '',
        link_gmaps: ''
    },
    {
        kategori_nama: 'Makanan',
        nama_usaha: 'Kerupuk Cap Jempol',
        nama_pemilik: 'Bapak Ghufron',
        deskripsi: 'Alamat: Geger 2.\nHarga: Rp 55.000 / 3kg.',
        harga_mulai: 55000,
        no_wa: '085740660580',
        foto_url: '',
        link_gmaps: ''
    },
    {
        kategori_nama: 'Makanan',
        nama_usaha: 'Kerupuk Udang Telur',
        nama_pemilik: 'Pak Anwari',
        deskripsi: 'Alamat: Geger 2.\nBerdiri sejak tahun 1970. Saat ini usaha diteruskan oleh anaknya.\nHarga: Dijual per 5kg (harga menyesuaikan).',
        harga_mulai: 0,
        no_wa: '-',
        foto_url: '',
        link_gmaps: ''
    },
    {
        kategori_nama: 'Makanan',
        nama_usaha: 'Jentik Manis',
        nama_pemilik: 'Yuni / Ruri',
        deskripsi: 'Alamat: Pending.\nBerdiri sejak 2012, sistem penjualan disetor ke penjual (tidak memasarkan sendiri).\nHarga: Rp 2.000 per mika (isi 5).',
        harga_mulai: 2000,
        no_wa: '087734031243',
        foto_url: '',
        link_gmaps: ''
    },
    {
        kategori_nama: 'Fashion',
        nama_usaha: 'RND Konfeksi',
        nama_pemilik: 'Bapak Yuniar',
        deskripsi: 'Menerima pembuatan kaos (anak/dewasa Rp 25.000 - 70.000), PDH bordir (Rp 120.000 - 135.000), Jaket (Rp 100.000 - 250.000 berbagai variasi).\nMinimal pembelian 12 pcs.',
        harga_mulai: 25000,
        no_wa: '081578781555',
        foto_url: '',
        link_gmaps: ''
    },
    {
        kategori_nama: 'Pertanian',
        nama_usaha: 'Buah Kelapa',
        nama_pemilik: 'Septi',
        deskripsi: 'Alamat: Kaliampo.\nMenjual kelapa muda dan tua.\nHarga: Kelapa muda Rp 6.000 - 8.000, kelapa tua Rp 5.000.',
        harga_mulai: 5000,
        no_wa: '08814157535',
        foto_url: '',
        link_gmaps: ''
    },
    {
        kategori_nama: 'Makanan',
        nama_usaha: 'Berkah Snack (Seriping & Opak)',
        nama_pemilik: 'Pak Rus / Ibu Rofiatun',
        deskripsi: 'Alamat: Kaliampo.\nProduk utama seriping dan opak. Dijual dalam ukuran besar (bal/partai) seharga Rp 55.000 (2kg), tersedia juga kemasan eceran Rp 1.000.',
        harga_mulai: 1000,
        no_wa: '085878529300',
        foto_url: '',
        link_gmaps: ''
    },
    {
        kategori_nama: 'Makanan',
        nama_usaha: 'Aedi Ice Cream Diamond',
        nama_pemilik: '-',
        deskripsi: 'Alamat: Kaliampo, Tegalrejo, Magelang.\nHarga: Penjualan per paket/box (ember 8 liter) sekitar Rp 300.000.\nMinimal pembelian 1 box sudah gratis antar.',
        harga_mulai: 300000,
        no_wa: '085877878504',
        foto_url: '',
        link_gmaps: ''
    },
    {
        kategori_nama: 'Kuliner Tradisional',
        nama_usaha: 'Berkah Jaya (Snack Kue Basah)',
        nama_pemilik: 'Ibu Siti Fatikah',
        deskripsi: 'Alamat: Kaliampo.\nMenjual aneka snack kue basah. Tidak ada minimal pesanan, namun untuk partai besar harus pesan jauh hari (tidak bisa mendadak).\nHarga: Mulai dari Rp 1.000.',
        harga_mulai: 1000,
        no_wa: '08564192672',
        foto_url: '',
        link_gmaps: ''
    },
    {
        kategori_nama: 'Makanan',
        nama_usaha: 'Gendhis Manis',
        nama_pemilik: 'Bapak Syarif Hidayat',
        deskripsi: 'Alamat: Kaliampo.\nMenjual gula jawa murni. Untuk pesanan partai besar harus pesan jauh hari (tidak bisa mendadak).\nHarga: Rp 18.000/kg.',
        harga_mulai: 18000,
        no_wa: '085643838008',
        foto_url: '',
        link_gmaps: ''
    },
    {
        kategori_nama: 'Makanan',
        nama_usaha: 'Berkah Telur',
        nama_pemilik: 'Ibu Novi',
        deskripsi: 'Alamat: Sindas.\nMenjual telur asin dan telur ayam biasa.\nHarga: Telur asin Rp 3.000/butir, telur biasa Rp 2.300/butir. Untuk partai besar harus pesan jauh hari. Dikenakan ongkir untuk pengiriman di luar area Girirejo.',
        harga_mulai: 2300,
        no_wa: '085741204484',
        foto_url: '',
        link_gmaps: ''
    }
];

async function seed() {
    try {
        console.log('Memastikan Kategori UMKM tersedia...');
        const catMap = {};
        for (const cat of categories) {
            const [existing] = await pool.query('SELECT id FROM kategori_umkm WHERE nama_kategori = ?', [cat.nama_kategori]);
            
            let catId;
            if (existing && existing.length > 0) {
                catId = existing[0].id;
            } else {
                const [result] = await pool.query('INSERT INTO kategori_umkm (nama_kategori, slug) VALUES (?, ?)', [cat.nama_kategori, cat.slug]);
                catId = result.insertId;
            }
            catMap[cat.nama_kategori] = catId;
        }

        console.log('Menghapus data UMKM lama...');
        await pool.query('TRUNCATE TABLE umkm_katalog');

        console.log('Memasukkan kumpulan data UMKM baru...');
        for (const u of umkmData) {
            const kategori_id = catMap[u.kategori_nama] || catMap['Lainnya'];
            await pool.query(
                'INSERT INTO umkm_katalog (kategori_id, nama_usaha, nama_pemilik, deskripsi, harga_mulai, no_wa, foto_url, link_gmaps) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [kategori_id, u.nama_usaha, u.nama_pemilik, u.deskripsi, u.harga_mulai, u.no_wa, u.foto_url, u.link_gmaps]
            );
            console.log(`Berhasil insert: ${u.nama_usaha}`);
        }
        
        console.log('✅ Selesai memasukkan 21 data UMKM!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Gagal:', err);
        process.exit(1);
    }
}

seed();
