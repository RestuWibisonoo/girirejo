# Project Context: Frontend Desa Girirejo (React + Vite + Tailwind CSS)

## 1. Deskripsi Aplikasi
Single Page Application (SPA) yang melayani dua antarmuka: Halaman Warga/Publik dan Dashboard Admin Desa.

## 2. Struktur 4 Fitur Utama (Publik)
- **Profil Desa (`/`):** Landing page berisi Hero Banner, infografis singkat, visi desa, dan deretan kartu Struktur Perangkat Desa (efek interaktif hover foto).
- **Katalog UMKM (`/umkm`):** Katalog produk warga. Wajib ada filter kategori, tombol "Beli via WA", dan tombol "Buka di Google Maps".
- **Berita & Kegiatan (`/publikasi`):** Halaman transparansi untuk menampilkan laporan **akuntabilitas** kegiatan desa, pencapaian, dan pengumuman.
- **Dashboard Admin (`/admin/*`):** Area terproteksi JWT untuk mengelola 4 entitas di atas (CRUD Profil, Perangkat, UMKM, Publikasi).

## 3. Struktur Direktori
- `src/components/`: UI reusable (Button, Modal, Navbar, UMKMCard).
- `src/layouts/`: `PublicLayout.jsx` & `AdminLayout.jsx`.
- `src/pages/`: Pemisahan folder `public/` dan `admin/`.
- `src/services/`: Konfigurasi Axios/Fetch untuk menembak endpoint API Backend.