const db = require('../config/db');

const PerangkatModel = {
    getAll: async () => {
        const query = 'SELECT * FROM perangkat_desa ORDER BY urutan_tampil ASC, id ASC';
        const [rows] = await db.query(query);
        return rows;
    },

    getById: async (id) => {
        const query = 'SELECT * FROM perangkat_desa WHERE id = ?';
        const [rows] = await db.query(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    },

    create: async (data) => {
        const { nama_lengkap, jabatan, nip, urutan_tampil, foto_awal_url, foto_hover_url } = data;
        const query = `
            INSERT INTO perangkat_desa (nama_lengkap, jabatan, nip, urutan_tampil, foto_awal_url, foto_hover_url)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [nama_lengkap, jabatan, nip || null, urutan_tampil || 0, foto_awal_url, foto_hover_url]);
        return result.insertId;
    },

    update: async (id, data) => {
        const { nama_lengkap, jabatan, nip, urutan_tampil, foto_awal_url, foto_hover_url } = data;
        const query = `
            UPDATE perangkat_desa 
            SET nama_lengkap = ?, jabatan = ?, nip = ?, urutan_tampil = ?, foto_awal_url = ?, foto_hover_url = ?
            WHERE id = ?
        `;
        const [result] = await db.query(query, [nama_lengkap, jabatan, nip !== undefined ? nip : null, urutan_tampil || 0, foto_awal_url, foto_hover_url, id]);
        return result.affectedRows;
    },

    delete: async (id) => {
        const query = 'DELETE FROM perangkat_desa WHERE id = ?';
        const [result] = await db.query(query, [id]);
        return result.affectedRows;
    }
};

module.exports = PerangkatModel;
