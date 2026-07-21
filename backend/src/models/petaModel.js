const db = require('../config/db');

const petaModel = {
  // --- KATEGORI PETA ---
  getAllKategori: async () => {
    const [rows] = await db.query('SELECT * FROM kategori_peta ORDER BY nama_kategori ASC');
    return rows;
  },
  
  createKategori: async (data) => {
    const { nama_kategori, ikon_warna } = data;
    const [result] = await db.query(
      'INSERT INTO kategori_peta (nama_kategori, ikon_warna) VALUES (?, ?)',
      [nama_kategori, ikon_warna]
    );
    return result.insertId;
  },

  updateKategori: async (id, data) => {
    const { nama_kategori, ikon_warna } = data;
    const [result] = await db.query(
      'UPDATE kategori_peta SET nama_kategori = ?, ikon_warna = ? WHERE id = ?',
      [nama_kategori, ikon_warna, id]
    );
    return result.affectedRows;
  },

  deleteKategori: async (id) => {
    const [result] = await db.query('DELETE FROM kategori_peta WHERE id = ?', [id]);
    return result.affectedRows;
  },

  // --- LOKASI PETA ---
  getAllLokasi: async () => {
    const query = `
      SELECT l.*, k.nama_kategori, k.ikon_warna 
      FROM lokasi_peta l
      LEFT JOIN kategori_peta k ON l.kategori_id = k.id
      ORDER BY l.id DESC
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  getLokasiById: async (id) => {
    const [rows] = await db.query('SELECT * FROM lokasi_peta WHERE id = ?', [id]);
    return rows[0];
  },

  createLokasi: async (data) => {
    const { kategori_id, nama_lokasi, deskripsi, alamat, latitude, longitude, foto_url } = data;
    const [result] = await db.query(
      `INSERT INTO lokasi_peta (kategori_id, nama_lokasi, deskripsi, alamat, latitude, longitude, foto_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [kategori_id, nama_lokasi, deskripsi, alamat, latitude, longitude, foto_url]
    );
    return result.insertId;
  },

  updateLokasi: async (id, data) => {
    const { kategori_id, nama_lokasi, deskripsi, alamat, latitude, longitude, foto_url } = data;
    const [result] = await db.query(
      `UPDATE lokasi_peta 
       SET kategori_id = ?, nama_lokasi = ?, deskripsi = ?, alamat = ?, latitude = ?, longitude = ?, foto_url = ? 
       WHERE id = ?`,
      [kategori_id, nama_lokasi, deskripsi, alamat, latitude, longitude, foto_url, id]
    );
    return result.affectedRows;
  },

  deleteLokasi: async (id) => {
    const [result] = await db.query('DELETE FROM lokasi_peta WHERE id = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = petaModel;
