# Project Context: Backend Desa Girirejo (Node.js + Express + MySQL)

## 1. Deskripsi & Tujuan
Backend ini melayani REST API untuk website publik dan sistem informasi manajemen (Dashboard Admin) Desa Girirejo. Fokus utama sistem ini adalah menunjang **akuntabilitas** publik (melalui pelaporan detail kegiatan desa) dan promosi ekonomi (Katalog UMKM). 

## 2. Alur Request & Siklus Hidup
Setiap request HTTP akan melewati alur berikut:
1. **Route Match:** Diterima oleh `src/routes/`.
2. **Middleware:** 
   - Public Route: Langsung diteruskan ke Controller.
   - Protected Route (Admin): Masuk ke `authMiddleware` untuk verifikasi token JWT.
3. **Controller:** `src/controllers/` menerima request, memvalidasi input, lalu memanggil Model.
4. **Model:** `src/models/` mengeksekusi query SQL mentah menggunakan `mysql2/promise` ke database.
5. **Response:** Controller mengembalikan data berformat JSON standar.

## 3. Struktur Direktori
- `src/config/`: Koneksi database (`db.js`) & variabel env.
- `src/middlewares/`: `authMiddleware.js` (JWT), `uploadMiddleware.js` (Multer).
- `src/models/`: `adminModel.js`, `umkmModel.js`, `perangkatModel.js`, `publikasiModel.js`.
- `src/controllers/`: `adminController.js`, `umkmController.js`, dll.
- `src/routes/`: `index.js`, `adminRoutes.js`, dll.
- `src/utils/`: Helper functions.

## 4. Fitur Utama API
- CRUD 4 Entitas Utama: Profil Desa, Perangkat Desa (dengan URL foto ganda), UMKM (dengan URL Google Maps), dan Publikasi Akuntabilitas.
- Autentikasi Admin via JWT.