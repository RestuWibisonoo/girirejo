const bcrypt = require('bcryptjs');
const AdminModel = require('../models/adminModel');
const db = require('../config/db');

async function seedAdmin() {
    try {
        console.log("Mencari admin default...");
        const existingAdmin = await AdminModel.findByUsername('admin');
        
        if (existingAdmin) {
            console.log("✅ Admin default sudah ada di database!");
            console.log("Username: admin");
        } else {
            console.log("⏳ Membuat admin default...");
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash('girirejo123', salt); // Password default
            
            await AdminModel.createAdmin({
                username: 'admin',
                password_hash: password_hash,
                nama_lengkap: 'Administrator Desa',
                role: 'superadmin'
            });
            console.log("✅ Admin default berhasil dibuat!");
            console.log("Username: admin");
            console.log("Password: girirejo123");
        }
    } catch (error) {
        console.error("❌ Gagal membuat admin:", error);
    } finally {
        // Tutup koneksi agar script selesai dengan bersih
        if (db && db.end) {
            await db.end();
        }
        process.exit();
    }
}

seedAdmin();
