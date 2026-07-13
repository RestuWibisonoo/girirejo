# Dokumentasi API Desa Girirejo

Base URL: `http://localhost:5001`

Semua respons dari API ini menggunakan format JSON standar:
```json
{
  "status": "success", // atau "error"
  "message": "Pesan deskriptif",
  "data": { ... } // (Opsional) Objek atau Array data
}
```

---

## 1. Autentikasi (Admin)

### `POST /api/auth/login`
Digunakan oleh Admin untuk login dan mendapatkan token JWT.
- **Tipe:** Public
- **Headers:** `Content-Type: application/json`
- **Body JSON:**
  ```json
  {
    "username": "admin",
    "password": "password123"
  }
  ```
- **Respons Sukses (200):** Mengembalikan data user dan `token` yang akan digunakan untuk endpoint private (Headers: `Authorization: Bearer <token>`).

---

## 2. Profil Desa

### `GET /api/desa-profile`
Mengambil data profil dan identitas Desa Girirejo.
- **Tipe:** Public
- **Respons Sukses (200):**
  Mengembalikan objek data profil (nama desa, alamat, sambutan kades, Gmaps, dll).

### `PUT /api/desa-profile`
Memperbarui data profil Desa Girirejo.
- **Tipe:** Private (Butuh Header `Authorization: Bearer <token>`)
- **Headers:** `Content-Type: application/json`
- **Body JSON:**
  ```json
  {
    "nama_desa": "Desa Girirejo Update",
    "deskripsi_singkat": "...",
    "sambutan_kades": "...",
    "alamat": "...",
    "kontak_wa": "0812...",
    "embed_map_url": "https://gmaps..."
  }
  ```

---

## 3. Perangkat Desa (Struktur Organisasi)

### `GET /api/perangkat-desa`
Mengambil seluruh daftar perangkat desa beserta link foto-fotonya.
- **Tipe:** Public
- **Respons Sukses (200):** Mengembalikan Array dari objek perangkat desa, diurutkan berdasarkan `urutan_tampil`.

### `POST /api/perangkat-desa`
Menambahkan data perangkat desa baru beserta file fotonya.
- **Tipe:** Private (Butuh Token)
- **Headers:** `Content-Type: multipart/form-data`
- **Form Data (Body):**
  - `nama_lengkap` (Teks, Wajib)
  - `jabatan` (Teks, Wajib)
  - `urutan_tampil` (Angka)
  - `foto_awal` (File Gambar JPG/PNG)
  - `foto_hover` (File Gambar JPG/PNG)

### `PUT /api/perangkat-desa/:id`
Memperbarui data perangkat desa. Jika mengupload foto baru, foto lama di server otomatis terhapus.
- **Tipe:** Private (Butuh Token)
- **Parameter URL:** `id` (ID dari perangkat desa)
- **Headers:** `Content-Type: multipart/form-data`
- **Form Data (Body):** Sama seperti pada proses POST, bersifat opsional (hanya diisi jika ingin diubah).

### `DELETE /api/perangkat-desa/:id`
Menghapus data perangkat desa secara permanen (termasuk file fotonya).
- **Tipe:** Private (Butuh Token)
- **Parameter URL:** `id` (ID dari perangkat desa)

---

## 4. Kategori UMKM

### `GET /api/kategori-umkm`
Mengambil seluruh daftar kategori UMKM.
- **Tipe:** Public

### `POST /api/kategori-umkm`
Menambahkan kategori baru.
- **Tipe:** Private (Butuh Token)
- **Headers:** `Content-Type: application/json`
- **Body JSON:** `{"nama_kategori": "Kuliner"}`

### `PUT /api/kategori-umkm/:id`
Memperbarui nama kategori.
- **Tipe:** Private (Butuh Token)

### `DELETE /api/kategori-umkm/:id`
Menghapus kategori.
- **Tipe:** Private (Butuh Token)

---

## 5. Katalog UMKM

### `GET /api/umkm`
Mengambil semua data UMKM. Anda juga bisa memfilter berdasarkan kategori.
- **Tipe:** Public
- **Query Parameter (Opsional):** `?kategori_id=1`

### `GET /api/umkm/:id`
Mengambil detail satu UMKM.
- **Tipe:** Public

### `POST /api/umkm`
Menambahkan data UMKM beserta satu buah foto usaha.
- **Tipe:** Private (Butuh Token)
- **Headers:** `Content-Type: multipart/form-data`
- **Form Data:**
  - `nama_usaha` (Teks, Wajib)
  - `kategori_id` (Angka)
  - `nama_pemilik`, `deskripsi`, `harga_mulai`, `no_wa`, `link_gmaps` (Teks)
  - `foto` (File Gambar)

### `PUT /api/umkm/:id`
Memperbarui data UMKM beserta foto barunya.
- **Tipe:** Private (Butuh Token)
- **Headers:** `Content-Type: multipart/form-data`

### `DELETE /api/umkm/:id`
Menghapus UMKM beserta file fotonya.
- **Tipe:** Private (Butuh Token)

---

## 6. Publikasi (Berita, Kegiatan, Akuntabilitas)

### `GET /api/publikasi`
Mengambil seluruh publikasi terbaru.
- **Tipe:** Public
- **Query Parameter (Opsional):** `?tipe=berita` atau `?tipe=kegiatan` atau `?tipe=akuntabilitas`

### `GET /api/publikasi/:idOrSlug`
Mengambil detail publikasi berdasarkan ID maupun Slug (SEO URL).
- **Tipe:** Public

### `POST /api/publikasi`
Membuat publikasi baru.
- **Tipe:** Private (Butuh Token Admin)
- **Headers:** `Content-Type: multipart/form-data`
- **Form Data:**
  - `tipe` (Wajib, harus diisi dengan: `berita`, `kegiatan`, atau `akuntabilitas`)
  - `judul` (Teks, Wajib)
  - `konten` (Teks, Wajib)
  - `gambar` (File Gambar, Opsional)
  - `lampiran` (File PDF/Doc, Opsional - Sangat disarankan untuk tipe akuntabilitas)

### `PUT /api/publikasi/:id`
Mengubah konten publikasi. 
- **Tipe:** Private (Butuh Token)

### `DELETE /api/publikasi/:id`
Menghapus publikasi beserta gambar dan lampiran PDF-nya.
- **Tipe:** Private (Butuh Token)
