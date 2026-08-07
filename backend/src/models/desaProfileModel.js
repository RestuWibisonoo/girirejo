const db = require('../config/db');

const DesaProfileModel = {
    getProfile: async () => {
        const query = 'SELECT * FROM desa_profile ORDER BY id ASC LIMIT 1';
        const [rows] = await db.query(query);
        return rows.length > 0 ? rows[0] : null;
    },
    
    updateProfile: async (id, data) => {
        const { nama_desa, deskripsi_singkat, sambutan_kades, alamat, kontak_wa, embed_map_url, foto_bersama_url } = data;
        const query = `
            UPDATE desa_profile 
            SET nama_desa = ?, deskripsi_singkat = ?, sambutan_kades = ?, alamat = ?, kontak_wa = ?, embed_map_url = ?, foto_bersama_url = COALESCE(?, foto_bersama_url)
            WHERE id = ?
        `;
        const [result] = await db.query(query, [nama_desa, deskripsi_singkat, sambutan_kades, alamat, kontak_wa, embed_map_url, foto_bersama_url, id]);
        return result.affectedRows;
    },

    createProfile: async (data) => {
        const { nama_desa, deskripsi_singkat, sambutan_kades, alamat, kontak_wa, embed_map_url, foto_bersama_url } = data;
        const query = `
            INSERT INTO desa_profile (nama_desa, deskripsi_singkat, sambutan_kades, alamat, kontak_wa, embed_map_url, foto_bersama_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [nama_desa, deskripsi_singkat, sambutan_kades, alamat, kontak_wa, embed_map_url, foto_bersama_url]);
        return result.insertId;
    }
};

module.exports = DesaProfileModel;
