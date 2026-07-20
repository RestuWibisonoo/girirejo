const db = require('../config/db');

const dummyData = [
  {
    judul: 'Penyaluran Bantuan Langsung Tunai (BLT) Dana Desa Tahap III Tahun 2026',
    slug: 'penyaluran-blt-dana-desa-tahap-iii-2026',
    tipe: 'berita',
    konten: 'Pemerintah Desa Girirejo kembali melaksanakan penyaluran Bantuan Langsung Tunai (BLT) Dana Desa Tahap III untuk tahun anggaran 2026. Penyaluran ini dilaksanakan di Balai Desa Girirejo dan dihadiri oleh perangkat desa, BPD, dan perwakilan dari kecamatan.\n\nSebanyak 85 Keluarga Penerima Manfaat (KPM) telah menerima bantuan ini. Kepala Desa Girirejo berharap bantuan ini dapat meringankan beban ekonomi masyarakat dan dapat digunakan untuk memenuhi kebutuhan pokok sehari-hari. Pelaksanaan penyaluran berjalan dengan tertib dan lancar sesuai dengan protokol yang berlaku.',
    tanggal_publikasi: '2026-07-15',
    tags: 'BLT, Bantuan Sosial, Dana Desa',
    views_count: 142
  },
  {
    judul: 'Kerja Bakti Massal Persiapan Peringatan HUT RI ke-81 di Lingkungan Girirejo',
    slug: 'kerja-bakti-massal-hut-ri-81-girirejo',
    tipe: 'kegiatan',
    konten: 'Menjelang peringatan Hari Ulang Tahun Republik Indonesia (HUT RI) ke-81, warga Desa Girirejo bergotong-royong melaksanakan kerja bakti massal. Kegiatan ini difokuskan pada pembersihan jalan utama desa, selokan, serta pemasangan umbul-umbul dan bendera merah putih.\n\nAntusiasme warga sangat tinggi, mulai dari anak-anak hingga orang tua turut serta. Kegiatan ini tidak hanya bertujuan untuk kebersihan dan keindahan desa, tetapi juga memupuk semangat nasionalisme dan kerukunan antarwarga. Acara ditutup dengan makan bersama dengan hidangan yang disediakan secara swadaya oleh masyarakat sekitar.',
    tanggal_publikasi: '2026-07-18',
    tags: 'Gotong Royong, HUT RI, Kegiatan Warga',
    views_count: 85
  },
  {
    judul: 'Laporan Pertanggungjawaban Realisasi APBDes Semester 1 Tahun 2026',
    slug: 'laporan-realisasi-apbdes-semester-1-2026',
    tipe: 'akuntabilitas',
    konten: 'Sebagai bentuk transparansi pemerintah desa kepada masyarakat, Pemerintah Desa Girirejo merilis Laporan Realisasi Anggaran Pendapatan dan Belanja Desa (APBDes) untuk Semester I Tahun Anggaran 2026.\n\nDalam laporan ini dirincikan pencapaian serapan anggaran yang meliputi bidang penyelenggaraan pemerintahan desa, pelaksanaan pembangunan desa, pembinaan kemasyarakatan, serta pemberdayaan masyarakat. Serapan anggaran hingga pertengahan tahun ini mencapai 45% dari total pagu anggaran. Dokumen lengkap dapat diakses dan dibaca oleh seluruh masyarakat desa di kantor balai desa.',
    tanggal_publikasi: '2026-07-10',
    tags: 'Transparansi, APBDes, Laporan',
    views_count: 210
  },
  {
    judul: 'Pelatihan Kewirausahaan untuk Pelaku UMKM Makanan Ringan Desa Girirejo',
    slug: 'pelatihan-kewirausahaan-umkm-girirejo-2026',
    tipe: 'kegiatan',
    konten: 'Dalam rangka meningkatkan kapasitas dan kualitas produk UMKM lokal, Desa Girirejo mengadakan Pelatihan Kewirausahaan khusus bagi pelaku UMKM makanan ringan. Pelatihan ini menghadirkan narasumber dari Dinas Koperasi dan UKM Kabupaten.\n\nMateri yang disampaikan meliputi teknik pengemasan (packaging) yang modern, strategi pemasaran digital melalui media sosial, hingga perhitungan Harga Pokok Penjualan (HPP). Peserta sangat antusias dan diharapkan setelah pelatihan ini produk-produk UMKM Girirejo dapat merambah pasar yang lebih luas di luar wilayah desa.',
    tanggal_publikasi: '2026-07-05',
    tags: 'UMKM, Pelatihan, Ekonomi',
    views_count: 120
  },
  {
    judul: 'Pembangunan Talud Jalan Dusun Krajan Telah Rampung 100%',
    slug: 'pembangunan-talud-jalan-dusun-krajan-selesai',
    tipe: 'berita',
    konten: 'Kabar gembira bagi warga Dusun Krajan, proyek pembangunan talud penahan jalan sepanjang 150 meter akhirnya telah rampung 100%. Pembangunan ini merupakan salah satu prioritas dalam RKPDes 2026 untuk mencegah longsor saat musim penghujan.\n\nDana pembangunan bersumber dari Dana Desa tahun 2026 sebesar Rp 45.000.000,-. Kepala Dusun Krajan menyampaikan rasa terima kasihnya kepada pemerintah desa dan seluruh warga yang telah membantu proses pembangunan baik berupa tenaga maupun dukungan lainnya. Jalan kini lebih aman untuk dilalui kendaraan.',
    tanggal_publikasi: '2026-07-01',
    tags: 'Infrastruktur, Pembangunan, Krajan',
    views_count: 345
  },
  {
    judul: 'Musyawarah Desa (Musdes) Penyusunan RKPDes Tahun Anggaran 2027',
    slug: 'musdes-penyusunan-rkpdes-2027-girirejo',
    tipe: 'berita',
    konten: 'Badan Permusyawaratan Desa (BPD) bersama Pemerintah Desa Girirejo telah menyelenggarakan Musyawarah Desa (Musdes) dalam rangka penyusunan Rencana Kerja Pemerintah Desa (RKPDes) untuk Tahun Anggaran 2027.\n\nMusdes ini dihadiri oleh tokoh masyarakat, ketua RT/RW, unsur perempuan, karang taruna, dan pendamping desa. Beberapa usulan prioritas mengemuka, di antaranya peningkatan fasilitas posyandu, perbaikan irigasi pertanian, dan program pencegahan stunting. Usulan ini akan digodok lebih lanjut oleh tim penyusun RKPDes.',
    tanggal_publikasi: '2026-06-25',
    tags: 'Musdes, RKPDes, Perencanaan',
    views_count: 176
  },
  {
    judul: 'Posyandu Balita dan Lansia Serentak di 4 Dusun Desa Girirejo',
    slug: 'posyandu-balita-lansia-serentak-girirejo',
    tipe: 'kegiatan',
    konten: 'Kader kesehatan Desa Girirejo secara serentak melaksanakan kegiatan Posyandu Balita dan Lansia di 4 dusun yang ada di wilayah Girirejo. Kegiatan rutin bulanan ini bertujuan untuk memantau tumbuh kembang balita serta kesehatan para lansia.\n\nPelayanan yang diberikan meliputi penimbangan berat badan, pengukuran tinggi badan balita, imunisasi dasar, serta pemeriksaan tekanan darah dan pemberian makanan tambahan (PMT) bergizi bagi para lansia. Pemerintah desa berkomitmen kuat untuk meningkatkan derajat kesehatan warganya melalui program-program preventif seperti ini.',
    tanggal_publikasi: '2026-06-20',
    tags: 'Kesehatan, Posyandu, Balita, Lansia',
    views_count: 231
  },
  {
    judul: 'Transparansi Realisasi Program Ketahanan Pangan Nabati dan Hewani',
    slug: 'transparansi-realisasi-ketahanan-pangan-girirejo',
    tipe: 'akuntabilitas',
    konten: 'Sesuai dengan amanat Peraturan Presiden, Pemerintah Desa Girirejo mengalokasikan minimal 20% dari Dana Desa untuk program Ketahanan Pangan Nabati dan Hewani. Kami menyampaikan realisasi program tersebut untuk tahap 1 tahun ini.\n\nProgram yang telah terealisasi meliputi pembagian 5.000 bibit tanaman buah alpukat kepada kelompok tani, serta pengadaan 20 ekor kambing ternak untuk dikelola oleh BUMDes. Diharapkan program ini tidak hanya menjaga ketersediaan pangan di tingkat desa tetapi juga menjadi stimulus ekonomi baru bagi warga.',
    tanggal_publikasi: '2026-06-12',
    tags: 'Ketahanan Pangan, Pertanian, Peternakan',
    views_count: 98
  },
  {
    judul: 'Karang Taruna Girirejo Gelar Turnamen Bola Voli Antar Dusun',
    slug: 'turnamen-bola-voli-antar-dusun-girirejo-2026',
    tipe: 'kegiatan',
    konten: 'Dalam rangka mempererat tali silaturahmi antar pemuda desa, Karang Taruna "Giri Sakti" Desa Girirejo menggelar Turnamen Bola Voli antar dusun memperebutkan Piala Kepala Desa 2026. Turnamen ini diadakan di lapangan utama desa.\n\nSebanyak 8 tim perwakilan dari masing-masing RT saling bertanding menunjukkan sportivitas dan semangat juang tinggi. Ratusan penonton memadati pinggir lapangan setiap sore hari. Pertandingan final yang mempertemukan Dusun Krajan vs Dusun Pucung berlangsung sengit, dan dimenangkan oleh tim dari Dusun Pucung.',
    tanggal_publikasi: '2026-06-05',
    tags: 'Olahraga, Karang Taruna, Pemuda',
    views_count: 512
  },
  {
    judul: 'Sosialisasi Pencegahan Demam Berdarah (DBD) Hadapi Musim Pancaroba',
    slug: 'sosialisasi-pencegahan-dbd-musim-pancaroba',
    tipe: 'berita',
    konten: 'Menghadapi musim pancaroba dengan curah hujan yang mulai tidak menentu, Bidan Desa bekerja sama dengan Puskesmas Kecamatan memberikan sosialisasi pencegahan penyakit Demam Berdarah Dengue (DBD) di Balai Desa Girirejo.\n\nMasyarakat diimbau untuk kembali menggalakkan gerakan 3M Plus: Menguras bak mandi, Menutup rapat tempat penampungan air, dan Mengubur barang bekas yang dapat menampung air hujan. Petugas juga mendistribusikan bubuk abate secara gratis kepada warga yang hadir. Mari bersama-sama kita jaga lingkungan agar bebas dari jentik nyamuk!',
    tanggal_publikasi: '2026-05-28',
    tags: 'Kesehatan, Sosialisasi, DBD',
    views_count: 145
  }
];

async function insertDummyData() {
    try {
        console.log("Memulai proses input 10 data dummy ke tabel publikasi...");
        
        let successCount = 0;
        
        for (const data of dummyData) {
            const query = `
                INSERT INTO publikasi (tipe, judul, slug, konten, tanggal_publikasi, tags, views_count, author_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            // Asumsi author_id = 1 (karena biasanya superadmin id 1)
            await db.query(query, [
                data.tipe, 
                data.judul, 
                data.slug, 
                data.konten, 
                data.tanggal_publikasi, 
                data.tags, 
                data.views_count,
                1 
            ]);
            
            successCount++;
        }
        
        console.log(`Berhasil memasukkan ${successCount} data dummy!`);
    } catch (error) {
        console.error("Gagal memasukkan data dummy:", error);
    } finally {
        if (db && db.end) await db.end();
        process.exit();
    }
}

insertDummyData();
