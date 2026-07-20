const db = require('../config/db');

const categories = [
  { nama_kategori: 'Makanan', slug: 'makanan' },
  { nama_kategori: 'Minuman', slug: 'minuman' },
  { nama_kategori: 'Kerajinan', slug: 'kerajinan' },
  { nama_kategori: 'Pertanian', slug: 'pertanian' },
  { nama_kategori: 'Jasa', slug: 'jasa' },
  { nama_kategori: 'Fashion', slug: 'fashion' },
  { nama_kategori: 'Lainnya', slug: 'lainnya' }
];

const umkmData = [
  {
    kategori_nama: 'Makanan',
    nama_usaha: 'Warung Makan Bu Tejo',
    nama_pemilik: 'Bu Tejo',
    deskripsi: 'Warung makan legendaris di Girirejo yang menyajikan masakan khas rumahan. Terkenal dengan oseng mercon dan ayam geprek sambal bawang yang super pedas. Cocok untuk makan siang bersama keluarga. Kami melayani pesanan katering dan nasi box untuk acara arisan atau syukuran.',
    harga_mulai: 10000,
    no_wa: '081234567890',
    link_gmaps: 'https://goo.gl/maps/example1'
  },
  {
    kategori_nama: 'Makanan',
    nama_usaha: 'Keripik Tempe Suka Rasa',
    nama_pemilik: 'Bapak Sudarso',
    deskripsi: 'Produksi keripik tempe renyah asli Girirejo. Dibuat dengan kedelai pilihan dan bumbu rempah alami tanpa bahan pengawet. Tersedia rasa original, balado, dan sapi panggang. Sangat pas untuk oleh-oleh atau camilan bersantai di rumah. Menerima reseller dari luar kota.',
    harga_mulai: 15000,
    no_wa: '085678901234',
    link_gmaps: ''
  },
  {
    kategori_nama: 'Minuman',
    nama_usaha: 'Kopi Susu Girirejo',
    nama_pemilik: 'Mas Dimas',
    deskripsi: 'Kedai kopi kekinian yang menyajikan es kopi susu gula aren, matcha latte, dan berbagai minuman segar lainnya. Tempat nyaman untuk nongkrong pemuda pemudi desa. Menyediakan free wifi dan tempat yang instagramable.',
    harga_mulai: 12000,
    no_wa: '082211334455',
    link_gmaps: 'https://goo.gl/maps/example2'
  },
  {
    kategori_nama: 'Kerajinan',
    nama_usaha: 'Batik Tulis Sekar Giri',
    nama_pemilik: 'Ibu Ratna',
    deskripsi: 'Pengrajin batik tulis asli dengan motif khas kearifan lokal Girirejo. Menerima pesanan seragam batik untuk instansi, sekolah, maupun hajatan. Kualitas kain terjamin, halus dan warna tidak mudah luntur. Hasil karya ibu-ibu PKK Desa Girirejo.',
    harga_mulai: 150000,
    no_wa: '089988776655',
    link_gmaps: 'https://goo.gl/maps/example3'
  },
  {
    kategori_nama: 'Kerajinan',
    nama_usaha: 'Anyaman Bambu Kreatif',
    nama_pemilik: 'Mbah Karto',
    deskripsi: 'Memproduksi berbagai macam kerajinan dari anyaman bambu seperti tampah, tenggok, kap lampu, dan hiasan dinding estetis. Anyaman bambu dibuat secara tradisional dan tahan lama. Siap menerima pesanan partai besar untuk restoran bergaya klasik.',
    harga_mulai: 25000,
    no_wa: '081122334455',
    link_gmaps: ''
  },
  {
    kategori_nama: 'Pertanian',
    nama_usaha: 'Sayur Organik Makmur',
    nama_pemilik: 'Kelompok Tani Makmur',
    deskripsi: 'Menyediakan sayur-sayuran segar organik langsung dari kebun. Bebas pestisida kimia. Ada bayam, kangkung, tomat, dan cabai rawit. Kami melayani pengantaran langsung ke rumah setiap pagi untuk warga desa dan sekitarnya.',
    harga_mulai: 5000,
    no_wa: '087766554433',
    link_gmaps: 'https://goo.gl/maps/example4'
  },
  {
    kategori_nama: 'Jasa',
    nama_usaha: 'Bengkel Motor Berkah Jaya',
    nama_pemilik: 'Kang Slamet',
    deskripsi: 'Melayani servis rutin, ganti oli, tambal ban, hingga turun mesin untuk segala jenis sepeda motor. Mekanik berpengalaman dan harga bersahabat. Buka setiap hari dari jam 08:00 hingga 17:00.',
    harga_mulai: 40000,
    no_wa: '082133445566',
    link_gmaps: 'https://goo.gl/maps/example5'
  },
  {
    kategori_nama: 'Fashion',
    nama_usaha: 'Penjahit Bu Nining',
    nama_pemilik: 'Bu Nining',
    deskripsi: 'Menerima jasa jahit pakaian pria dan wanita. Bisa custom model kebaya, gamis, jas, seragam sekolah, dan permak jeans. Jahitan rapi, cepat, dan pas di badan.',
    harga_mulai: 75000,
    no_wa: '081299887766',
    link_gmaps: ''
  },
];

async function seedData() {
  try {
    console.log("Memulai proses seeder untuk Kategori & UMKM...");

    // 1. Insert Categories first, ignoring duplicates if possible or just checking them
    const catMap = {};
    for (const cat of categories) {
      // Check if category exists
      const [existing] = await db.query('SELECT id FROM kategori_umkm WHERE nama_kategori = ?', [cat.nama_kategori]);
      
      let catId;
      if (existing && existing.length > 0) {
        catId = existing[0].id;
      } else {
        const [result] = await db.query('INSERT INTO kategori_umkm (nama_kategori, slug) VALUES (?, ?)', [cat.nama_kategori, cat.slug]);
        catId = result.insertId;
      }
      catMap[cat.nama_kategori] = catId;
    }
    console.log("Kategori UMKM berhasil dipastikan/di-insert.");

    // 2. Clear existing UMKM data (Optional, tapi lebih aman untuk test data)
    // await db.query('DELETE FROM umkm_katalog'); // Uncomment if you want to clear old data
    
    // 3. Insert UMKM data
    let successCount = 0;
    for (const data of umkmData) {
      const kategori_id = catMap[data.kategori_nama] || catMap['Lainnya'];
      
      const query = `
        INSERT INTO umkm_katalog (kategori_id, nama_usaha, nama_pemilik, deskripsi, harga_mulai, no_wa, link_gmaps)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      await db.query(query, [
        kategori_id,
        data.nama_usaha,
        data.nama_pemilik,
        data.deskripsi,
        data.harga_mulai,
        data.no_wa,
        data.link_gmaps
      ]);
      
      successCount++;
    }

    console.log(`Berhasil memasukkan ${successCount} data dummy UMKM!`);
  } catch (error) {
    console.error("Gagal memasukkan data dummy:", error);
  } finally {
    if (db && db.end) await db.end();
    process.exit();
  }
}

seedData();
