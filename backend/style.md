# Coding Guidelines: Backend

1. **Response Format:** Wajib mengembalikan JSON seragam: 
   `{ "status": "success/error", "message": "...", "data": [...] }`
2. **Error Handling:** Setiap controller wajib dibungkus dengan blok `try...catch`. Kembalikan HTTP status code yang sesuai (400 untuk bad request, 404 untuk not found, 500 untuk server error).
3. **Database Queries:** Wajib menggunakan *parameterized queries* (`?`) pada `mysql2` untuk mencegah SQL Injection. Dilarang keras melakukan concatenasi string untuk query SQL.
4. **Naming Convention:** Gunakan `camelCase` untuk variabel/fungsi JavaScript dan `snake_case` untuk nama kolom/tabel database.
5. **Clean Code:** Pastikan controller tetap tipis (*fat models, skinny controllers*). Pindahkan logika query rumit ke dalam file Model.