const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminModel = require('../models/adminModel');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const authController = {
    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            
            if (!username || !password) {
                return res.status(400).json({
                    status: "error",
                    message: "Username dan password wajib diisi."
                });
            }

            const admin = await AdminModel.findByUsername(username);
            if (!admin) {
                return res.status(401).json({
                    status: "error",
                    message: "Username atau password salah."
                });
            }

            const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
            if (!isPasswordValid) {
                return res.status(401).json({
                    status: "error",
                    message: "Username atau password salah."
                });
            }

            // Generate JWT Token
            const token = jwt.sign(
                { id: admin.id, username: admin.username, role: admin.role },
                process.env.JWT_SECRET,
                { expiresIn: '1d' } // Token berlaku selama 1 hari
            );

            return res.json({
                status: "success",
                message: "Login berhasil.",
                data: {
                    token: token,
                    user: {
                        id: admin.id,
                        username: admin.username,
                        nama_lengkap: admin.nama_lengkap,
                        role: admin.role
                    }
                }
            });

        } catch (error) {
            console.error("Login Error:", error);
            return res.status(500).json({
                status: "error",
                message: "Terjadi kesalahan pada server."
            });
        }
    }
};

module.exports = authController;
