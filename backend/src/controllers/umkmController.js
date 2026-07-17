const UmkmModel = require('../models/umkmModel');
const fs = require('fs');
const path = require('path');

const hapusFileLama = (filename) => {
    if (!filename) return;
    const filePath = path.join(__dirname, '../../public/uploads', filename);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

const umkmController = {
    getAll: async (req, res) => {
        try {
            // Menerima query parameter ?kategori_id=xx
            const { kategori_id } = req.query; 
            const data = await UmkmModel.getAll(kategori_id);
            return res.json({ status: "success", message: "Berhasil mengambil data UMKM.", data });
        } catch (error) {
            console.error("GetAll UMKM Error:", error);
            return res.status(500).json({ status: "error", message: "Terjadi kesalahan server." });
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await UmkmModel.getById(id);
            if (!data) return res.status(404).json({ status: "error", message: "Data tidak ditemukan." });
            return res.json({ status: "success", message: "Berhasil mengambil detail UMKM.", data });
        } catch (error) {
            console.error("GetById UMKM Error:", error);
            return res.status(500).json({ status: "error", message: "Terjadi kesalahan server." });
        }
    },

    create: async (req, res) => {
        try {
            let { kategori_id, kategori, nama_usaha, nama_pemilik, deskripsi, harga_mulai, no_wa, link_gmaps } = req.body;
            if (!nama_usaha) {
                return res.status(400).json({ status: "error", message: "Field nama_usaha wajib diisi." });
            }

            if (!kategori_id && kategori) {
                const KategoriUmkmModel = require('../models/kategoriUmkmModel');
                const kats = await KategoriUmkmModel.getAll();
                let found = kats.find(k => k.nama_kategori.toLowerCase() === kategori.toLowerCase());
                if (!found) {
                    const slug = kategori.toLowerCase().replace(/\s+/g, '-');
                    kategori_id = await KategoriUmkmModel.create({ nama_kategori: kategori, slug });
                } else {
                    kategori_id = found.id;
                }
            }

            let foto_url = null;
            if (req.file) {
                foto_url = req.file.filename;
            }

            const newId = await UmkmModel.create({
                kategori_id, nama_usaha, nama_pemilik, deskripsi, harga_mulai, no_wa, foto_url, link_gmaps
            });

            return res.status(201).json({ status: "success", message: "Data UMKM berhasil ditambahkan.", data: { id: newId } });
        } catch (error) {
            console.error("Create UMKM Error:", error);
            return res.status(500).json({ status: "error", message: "Terjadi kesalahan server." });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const existingData = await UmkmModel.getById(id);
            if (!existingData) {
                return res.status(404).json({ status: "error", message: "Data tidak ditemukan." });
            }

            const body = req.body;
            let final_kategori_id = body.kategori_id !== undefined ? body.kategori_id : existingData.kategori_id;

            if (body.kategori && body.kategori !== existingData.kategori) {
                const KategoriUmkmModel = require('../models/kategoriUmkmModel');
                const kats = await KategoriUmkmModel.getAll();
                let found = kats.find(k => k.nama_kategori.toLowerCase() === body.kategori.toLowerCase());
                if (!found) {
                    const slug = body.kategori.toLowerCase().replace(/\s+/g, '-');
                    final_kategori_id = await KategoriUmkmModel.create({ nama_kategori: body.kategori, slug });
                } else {
                    final_kategori_id = found.id;
                }
            }
            let foto_url = existingData.foto_url;

            if (req.file) {
                hapusFileLama(foto_url); // Hapus foto lama
                foto_url = req.file.filename;
            }

            await UmkmModel.update(id, {
                kategori_id: final_kategori_id,
                nama_usaha: body.nama_usaha || existingData.nama_usaha,
                nama_pemilik: body.nama_pemilik || existingData.nama_pemilik,
                deskripsi: body.deskripsi || existingData.deskripsi,
                harga_mulai: body.harga_mulai || existingData.harga_mulai,
                no_wa: body.no_wa || existingData.no_wa,
                link_gmaps: body.link_gmaps || existingData.link_gmaps,
                foto_url
            });

            return res.json({ status: "success", message: "Data UMKM berhasil diperbarui." });
        } catch (error) {
            console.error("Update UMKM Error:", error);
            return res.status(500).json({ status: "error", message: "Terjadi kesalahan server." });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const existingData = await UmkmModel.getById(id);
            if (!existingData) {
                return res.status(404).json({ status: "error", message: "Data tidak ditemukan." });
            }

            hapusFileLama(existingData.foto_url);
            await UmkmModel.delete(id);

            return res.json({ status: "success", message: "Data UMKM berhasil dihapus." });
        } catch (error) {
            console.error("Delete UMKM Error:", error);
            return res.status(500).json({ status: "error", message: "Terjadi kesalahan server." });
        }
    }
};

module.exports = umkmController;
