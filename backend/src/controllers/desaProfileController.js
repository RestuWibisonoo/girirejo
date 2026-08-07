const DesaProfileModel = require('../models/desaProfileModel');

const desaProfileController = {
    getProfile: async (req, res) => {
        try {
            const profile = await DesaProfileModel.getProfile();
            if (!profile) {
                return res.status(404).json({
                    status: "error",
                    message: "Profil desa belum diatur."
                });
            }
            return res.json({
                status: "success",
                message: "Berhasil mengambil data profil desa.",
                data: profile
            });
        } catch (error) {
            console.error("Get Profile Error:", error);
            return res.status(500).json({
                status: "error",
                message: "Terjadi kesalahan pada server saat mengambil data."
            });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const existingProfile = await DesaProfileModel.getProfile();
            
            // Validasi field minimal (opsional)
            const { nama_desa } = req.body;
            if (!nama_desa) {
                return res.status(400).json({
                    status: "error",
                    message: "Field nama_desa wajib diisi."
                });
            }

            if (req.file) {
                req.body.foto_bersama_url = `/uploads/images/${req.file.filename}`;
            }

            if (!existingProfile) {
                // Jika belum ada record sama sekali, buat baru
                await DesaProfileModel.createProfile(req.body);
                const newProfile = await DesaProfileModel.getProfile();
                return res.json({
                    status: "success",
                    message: "Profil desa berhasil dibuat.",
                    data: newProfile
                });
            } else {
                // Merge data lama dengan data baru agar tidak hilang
                const updatedData = {
                    ...existingProfile,
                    ...req.body
                };
                
                // Jika sudah ada, update record yang ada
                await DesaProfileModel.updateProfile(existingProfile.id, updatedData);
                const updatedProfile = await DesaProfileModel.getProfile();
                return res.json({
                    status: "success",
                    message: "Profil desa berhasil diperbarui.",
                    data: updatedProfile
                });
            }
        } catch (error) {
            console.error("Update Profile Error:", error);
            return res.status(500).json({
                status: "error",
                message: "Terjadi kesalahan pada server saat memperbarui data."
            });
        }
    }
};

module.exports = desaProfileController;
