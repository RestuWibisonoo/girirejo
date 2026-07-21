const PerangkatModel = require('../models/perangkatModel');
const fs = require('fs');
const path = require('path');

// Helper untuk hapus file fisik saat update/delete
const hapusFileLama = (filename) => {
    if (!filename) return;
    const filePath = path.join(__dirname, '../../public/uploads', filename);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

const perangkatController = {
    getAll: async (req, res) => {
        try {
            const data = await PerangkatModel.getAll();
            return res.json({
                status: "success",
                message: "Berhasil mengambil data perangkat desa.",
                data: data
            });
        } catch (error) {
            console.error("GetAll Perangkat Error:", error);
            return res.status(500).json({ status: "error", message: "Terjadi kesalahan server." });
        }
    },

    create: async (req, res) => {
        try {
            const { nama_lengkap, jabatan, nip, urutan_tampil } = req.body;
            
            // Validasi manual
            if (!nama_lengkap || !jabatan) {
                return res.status(400).json({ status: "error", message: "Nama lengkap dan jabatan wajib diisi." });
            }

            let foto_awal_url = null;
            let foto_hover_url = null;

            // Jika ada file yang diunggah
            if (req.files) {
                if (req.files['foto_awal'] && req.files['foto_awal'][0]) {
                    foto_awal_url = req.files['foto_awal'][0].filename;
                }
                if (req.files['foto_hover'] && req.files['foto_hover'][0]) {
                    foto_hover_url = req.files['foto_hover'][0].filename;
                }
            }

            const newId = await PerangkatModel.create({
                nama_lengkap, jabatan, nip, urutan_tampil, foto_awal_url, foto_hover_url
            });

            return res.status(201).json({
                status: "success",
                message: "Perangkat desa berhasil ditambahkan.",
                data: { id: newId }
            });
        } catch (error) {
            console.error("Create Perangkat Error:", error);
            return res.status(500).json({ status: "error", message: "Terjadi kesalahan server." });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { nama_lengkap, jabatan, nip, urutan_tampil } = req.body;

            const existingData = await PerangkatModel.getById(id);
            if (!existingData) {
                return res.status(404).json({ status: "error", message: "Data perangkat tidak ditemukan." });
            }

            let foto_awal_url = existingData.foto_awal_url;
            let foto_hover_url = existingData.foto_hover_url;

            if (req.files) {
                if (req.files['foto_awal'] && req.files['foto_awal'][0]) {
                    hapusFileLama(foto_awal_url); // Hapus foto lama agar tidak menumpuk
                    foto_awal_url = req.files['foto_awal'][0].filename;
                }
                if (req.files['foto_hover'] && req.files['foto_hover'][0]) {
                    hapusFileLama(foto_hover_url);
                    foto_hover_url = req.files['foto_hover'][0].filename;
                }
            }

            await PerangkatModel.update(id, {
                nama_lengkap: nama_lengkap || existingData.nama_lengkap,
                jabatan: jabatan || existingData.jabatan,
                nip: nip !== undefined ? nip : existingData.nip,
                urutan_tampil: urutan_tampil || existingData.urutan_tampil,
                foto_awal_url,
                foto_hover_url
            });

            return res.json({
                status: "success",
                message: "Data perangkat desa berhasil diperbarui."
            });
        } catch (error) {
            console.error("Update Perangkat Error:", error);
            return res.status(500).json({ status: "error", message: "Terjadi kesalahan server." });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const existingData = await PerangkatModel.getById(id);
            
            if (!existingData) {
                return res.status(404).json({ status: "error", message: "Data tidak ditemukan." });
            }

            // Hapus file gambar fisiknya dari hard disk
            hapusFileLama(existingData.foto_awal_url);
            hapusFileLama(existingData.foto_hover_url);

            // Hapus baris di database
            await PerangkatModel.delete(id);

            return res.json({
                status: "success",
                message: "Data perangkat desa berhasil dihapus."
            });
        } catch (error) {
            console.error("Delete Perangkat Error:", error);
            return res.status(500).json({ status: "error", message: "Terjadi kesalahan server." });
        }
    }
};

module.exports = perangkatController;
