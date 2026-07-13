const db = require('../config/db');

const KategoriUmkmModel = {
    getAll: async () => {
        const query = 'SELECT * FROM kategori_umkm ORDER BY nama_kategori ASC';
        const [rows] = await db.query(query);
        return rows;
    },

    getById: async (id) => {
        const query = 'SELECT * FROM kategori_umkm WHERE id = ?';
        const [rows] = await db.query(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    },

    create: async (data) => {
        const { nama_kategori, slug } = data;
        const query = 'INSERT INTO kategori_umkm (nama_kategori, slug) VALUES (?, ?)';
        const [result] = await db.query(query, [nama_kategori, slug]);
        return result.insertId;
    },

    update: async (id, data) => {
        const { nama_kategori, slug } = data;
        const query = 'UPDATE kategori_umkm SET nama_kategori = ?, slug = ? WHERE id = ?';
        const [result] = await db.query(query, [nama_kategori, slug, id]);
        return result.affectedRows;
    },

    delete: async (id) => {
        const query = 'DELETE FROM kategori_umkm WHERE id = ?';
        const [result] = await db.query(query, [id]);
        return result.affectedRows;
    }
};

module.exports = KategoriUmkmModel;
