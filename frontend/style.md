# UI/UX & Coding Guidelines: Frontend (Strict Anti-Generic AI Design)

## 1. Palet Warna & Estetika
- **DILARANG** menggunakan warna biru standar bawaan Tailwind (seperti `blue-500` atau `blue-600`) agar tidak terlihat monoton atau seperti template murahan.
- Gunakan palet alam yang modern:
  - **Primary:** `emerald-700` atau `teal-700` (Hijau elegan).
  - **Accent:** `orange-500` atau `orange-600` (Gunakan warna oranye ini untuk tombol *Call to Action* atau notifikasi agar mencolok dan segar).
  - **Background:** `bg-stone-50` atau `bg-slate-50`.
  - **Text:** `text-slate-800` (Heading) dan `text-slate-600` (Body).

## 2. Tata Letak (Layouting) & Whitespace
- Selalu berikan ruang kosong (*whitespace*) yang ekstensif. Gunakan padding besar (contoh: `py-20` atau `py-24`) antar section.
- Gunakan *rounded corners* yang modern (minimal `rounded-xl` atau `rounded-2xl`) pada kartu dan gambar.
- Bayangan elegan: Gunakan shadow custom lembut `shadow-[0_8px_30px_rgb(0,0,0,0.04)]`.

## 3. Interaksi Khusus: Foto Perangkat Desa
- Wajib menggunakan struktur berikut untuk kartu perangkat desa agar foto bisa berubah saat di-hover:
  ```html
  <div className="relative group overflow-hidden rounded-xl">
    <img src={fotoAwal} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0" alt="Foto Formal" />
    <img src={fotoHover} className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105" alt="Foto Interaktif" />
  </div>