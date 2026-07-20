const db = require('../config/db');

const PublikasiModel = {
    // Menarik semua publikasi, opsi filter ENUM tipe, di-JOIN dengan admins
    getAll: async (tipe) => {
        let query = `
            SELECT p.*, a.nama_lengkap AS pembuat
            FROM publikasi p
            LEFT JOIN admins a ON p.author_id = a.id
        `;
        const params = [];

        if (tipe) {
            query += ' WHERE p.tipe = ?';
            params.push(tipe);
        }

        query += ' ORDER BY p.tanggal_publikasi DESC, p.id DESC';
        const [rows] = await db.query(query, params);
        return rows;
    },

    // Memungkinkan pencarian berdasarkan ID maupun Slug (URL friendly)
    getBySlugOrId: async (identifier) => {
        const isNumeric = !isNaN(identifier) && !isNaN(parseFloat(identifier));
        
        let query = `
            SELECT p.*, a.nama_lengkap AS pembuat
            FROM publikasi p
            LEFT JOIN admins a ON p.author_id = a.id
        `;
        
        if (isNumeric) {
            query += ' WHERE p.id = ?';
        } else {
            query += ' WHERE p.slug = ?';
        }

        const [rows] = await db.query(query, [identifier]);
        return rows.length > 0 ? rows[0] : null;
    },

    create: async (data) => {
        const { tipe, judul, slug, konten, foto_url, lampiran_url, author_id, tanggal_publikasi, tags } = data;
        const query = `
            INSERT INTO publikasi (tipe, judul, slug, konten, foto_url, lampiran_url, author_id, tanggal_publikasi, tags)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [tipe, judul, slug, konten, foto_url, lampiran_url, author_id, tanggal_publikasi, tags]);
        return result.insertId;
    },

    update: async (id, data) => {
        const { tipe, judul, slug, konten, foto_url, lampiran_url, tanggal_publikasi, tags } = data;
        const query = `
            UPDATE publikasi 
            SET tipe = ?, judul = ?, slug = ?, konten = ?, foto_url = ?, lampiran_url = ?, tanggal_publikasi = ?, tags = ?
            WHERE id = ?
        `;
        const [result] = await db.query(query, [tipe, judul, slug, konten, foto_url, lampiran_url, tanggal_publikasi, tags, id]);
        return result.affectedRows;
    },

    delete: async (id) => {
        const query = 'DELETE FROM publikasi WHERE id = ?';
        const [result] = await db.query(query, [id]);
        return result.affectedRows;
    },

    incrementViews: async (id) => {
        const query = 'UPDATE publikasi SET views_count = views_count + 1 WHERE id = ?';
        const [result] = await db.query(query, [id]);
        return result.affectedRows;
    }
};

module.exports = PublikasiModel;
