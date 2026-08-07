const db = require('../config/db');

const AdminModel = {
    findByUsername: async (username) => {
        const query = 'SELECT * FROM admins WHERE username = ?';
        const [rows] = await db.query(query, [username]);
        return rows.length > 0 ? rows[0] : null;
    },
    
    createAdmin: async (adminData) => {
        const { username, password_hash, nama_lengkap, role } = adminData;
        const query = 'INSERT INTO admins (username, password_hash, nama_lengkap, role) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(query, [username, password_hash, nama_lengkap, role]);
        return result.insertId;
    },

    getAllAdmins: async () => {
        const query = 'SELECT id, username, nama_lengkap, role, created_at FROM admins ORDER BY id ASC';
        const [rows] = await db.query(query);
        return rows;
    },

    deleteAdmin: async (id) => {
        const query = 'DELETE FROM admins WHERE id = ?';
        const [result] = await db.query(query, [id]);
        return result.affectedRows;
    }
};

module.exports = AdminModel;
