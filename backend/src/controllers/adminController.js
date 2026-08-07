const AdminModel = require('../models/adminModel');
const bcrypt = require('bcryptjs');

const adminController = {
    getAll: async (req, res) => {
        try {
            const admins = await AdminModel.getAllAdmins();
            return res.json({
                status: "success",
                message: "Berhasil mengambil daftar admin.",
                data: admins
            });
        } catch (error) {
            console.error("GetAll Admin Error:", error);
            return res.status(500).json({ status: "error", message: "Terjadi kesalahan server." });
        }
    },

    create: async (req, res) => {
        try {
            const { username, password, nama_lengkap, role } = req.body;
            
            if (!username || !password || !nama_lengkap) {
                return res.status(400).json({ status: "error", message: "Semua field (username, password, nama_lengkap) wajib diisi." });
            }

            // Check if username already exists
            const existingAdmin = await AdminModel.findByUsername(username);
            if (existingAdmin) {
                return res.status(400).json({ status: "error", message: "Username sudah digunakan." });
            }

            // Default role is admin_desa if not provided or not superadmin
            const finalRole = role === 'superadmin' ? 'superadmin' : 'admin_desa';

            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);

            const newId = await AdminModel.createAdmin({
                username, password_hash, nama_lengkap, role: finalRole
            });

            return res.status(201).json({
                status: "success",
                message: "Admin berhasil ditambahkan.",
                data: { id: newId, username, role: finalRole }
            });

        } catch (error) {
            console.error("Create Admin Error:", error);
            return res.status(500).json({ status: "error", message: "Terjadi kesalahan server." });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            
            // Prevent deleting the main superadmin or oneself
            if (parseInt(id) === req.admin.id) {
                return res.status(403).json({ status: "error", message: "Anda tidak dapat menghapus akun Anda sendiri." });
            }

            const affected = await AdminModel.deleteAdmin(id);
            if (affected === 0) {
                return res.status(404).json({ status: "error", message: "Admin tidak ditemukan." });
            }

            return res.json({ status: "success", message: "Admin berhasil dihapus." });
        } catch (error) {
            console.error("Delete Admin Error:", error);
            return res.status(500).json({ status: "error", message: "Terjadi kesalahan server." });
        }
    }
};

module.exports = adminController;
