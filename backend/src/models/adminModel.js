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
    }
};

module.exports = AdminModel;
