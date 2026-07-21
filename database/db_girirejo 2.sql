CREATE DATABASE db_girirejo;
USE db_girirejo;

CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nama_lengkap VARCHAR(100),
    role ENUM('superadmin', 'admin_desa') DEFAULT 'admin_desa'
);

CREATE TABLE desa_profile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_desa VARCHAR(100) DEFAULT 'Girirejo',
    deskripsi_singkat TEXT,
    sambutan_kades TEXT,
    alamat TEXT,
    kontak_wa VARCHAR(20),
    embed_map_url TEXT
);

CREATE TABLE perangkat_desa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_lengkap VARCHAR(100) NOT NULL,
    jabatan VARCHAR(100) NOT NULL,
    nip VARCHAR(50) DEFAULT NULL,
    urutan_tampil INT DEFAULT 0,
    foto_awal_url VARCHAR(255),
    foto_hover_url VARCHAR(255)
);

CREATE TABLE kategori_umkm (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_kategori VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE umkm_katalog (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kategori_id INT,
    nama_usaha VARCHAR(100) NOT NULL,
    nama_pemilik VARCHAR(100),
    deskripsi TEXT,
    harga_mulai DECIMAL(10,2),
    no_wa VARCHAR(20),
    foto_url VARCHAR(255),
    link_gmaps TEXT,
    FOREIGN KEY (kategori_id) REFERENCES kategori_umkm(id) ON DELETE SET NULL
);

CREATE TABLE publikasi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    tipe ENUM('berita', 'kegiatan', 'akuntabilitas') NOT NULL,
    konten TEXT,
    tanggal_publikasi DATE,
    foto_url VARCHAR(255),
    author_id INT,
    FOREIGN KEY (author_id) REFERENCES admins(id) ON DELETE SET NULL
);