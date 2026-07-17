const db = require('../config/db');

const UmkmModel = {
    // Fungsi getAll disempurnakan dengan LEFT JOIN untuk menarik nama_kategori
    getAll: async (kategori_id) => {
        let query = `
            SELECT u.*, k.nama_kategori as kategori 
            FROM umkm_katalog u
            LEFT JOIN kategori_umkm k ON u.kategori_id = k.id
        `;
        const params = [];

        // Fitur filter berdasarkan kategori (berguna untuk frontend)
        if (kategori_id) {
            query += ' WHERE u.kategori_id = ?';
            params.push(kategori_id);
        }

        query += ' ORDER BY u.id DESC';
        const [rows] = await db.query(query, params);
        return rows;
    },

    getById: async (id) => {
        const query = `
            SELECT u.*, k.nama_kategori as kategori 
            FROM umkm_katalog u
            LEFT JOIN kategori_umkm k ON u.kategori_id = k.id
            WHERE u.id = ?
        `;
        const [rows] = await db.query(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    },

    create: async (data) => {
        const { kategori_id, nama_usaha, nama_pemilik, deskripsi, harga_mulai, no_wa, foto_url, link_gmaps } = data;
        const query = `
            INSERT INTO umkm_katalog (kategori_id, nama_usaha, nama_pemilik, deskripsi, harga_mulai, no_wa, foto_url, link_gmaps)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [kategori_id || null, nama_usaha, nama_pemilik, deskripsi, harga_mulai, no_wa, foto_url, link_gmaps]);
        return result.insertId;
    },

    update: async (id, data) => {
        const { kategori_id, nama_usaha, nama_pemilik, deskripsi, harga_mulai, no_wa, foto_url, link_gmaps } = data;
        const query = `
            UPDATE umkm_katalog 
            SET kategori_id = ?, nama_usaha = ?, nama_pemilik = ?, deskripsi = ?, harga_mulai = ?, no_wa = ?, foto_url = ?, link_gmaps = ?
            WHERE id = ?
        `;
        const [result] = await db.query(query, [kategori_id || null, nama_usaha, nama_pemilik, deskripsi, harga_mulai, no_wa, foto_url, link_gmaps, id]);
        return result.affectedRows;
    },

    delete: async (id) => {
        const query = 'DELETE FROM umkm_katalog WHERE id = ?';
        const [result] = await db.query(query, [id]);
        return result.affectedRows;
    }
};

module.exports = UmkmModel;
