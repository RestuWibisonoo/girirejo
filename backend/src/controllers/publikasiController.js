const PublikasiModel = require('../models/publikasiModel');
const fs = require('fs');
const path = require('path');

// Helper pembuat Slug URL ramah SEO
const generateSlug = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

const hapusFileLama = (filename) => {
    if (!filename) return;
    const filePath = path.join(__dirname, '../../public/uploads', filename);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

const publikasiController = {
    getAll: async (req, res) => {
        try {
            const { tipe } = req.query; // Filter menggunakan ?tipe=berita
            const data = await PublikasiModel.getAll(tipe);
            return res.json({ status: "success", message: "Berhasil mengambil data publikasi.", data });
        } catch (error) {
            console.error("GetAll Publikasi Error:", error);
            return res.status(500).json({ status: "error", message: error.message });
        }
    },

    getDetail: async (req, res) => {
        try {
            // Bisa mencari memakai ID ataupun Slug
            const { idOrSlug } = req.params;
            const data = await PublikasiModel.getBySlugOrId(idOrSlug);
            if (!data) return res.status(404).json({ status: "error", message: "Publikasi tidak ditemukan." });
            return res.json({ status: "success", message: "Berhasil mengambil detail publikasi.", data });
        } catch (error) {
            console.error("GetDetail Publikasi Error:", error);
            return res.status(500).json({ status: "error", message: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const { tipe, judul, konten } = req.body;
            
            if (!tipe || !judul || !konten) {
                return res.status(400).json({ status: "error", message: "Field tipe, judul, dan konten wajib diisi." });
            }

            const validTypes = ['berita', 'kegiatan', 'akuntabilitas'];
            if (!validTypes.includes(tipe)) {
                return res.status(400).json({ status: "error", message: "Tipe publikasi tidak valid." });
            }

            // Buat slug unik dengan bantuan timestamp akhir agar menghindari bentrok
            const slug = generateSlug(judul) + '-' + Date.now().toString().slice(-4);

            let foto_url = null;
            let lampiran_url = null;

            if (req.files) {
                if (req.files['gambar'] && req.files['gambar'][0]) {
                    foto_url = req.files['gambar'][0].filename;
                }
                if (req.files['lampiran'] && req.files['lampiran'][0]) {
                    lampiran_url = req.files['lampiran'][0].filename;
                }
            }

            // Dapatkan ID admin dari token JWT
            const author_id = req.admin.id; 
            
            // Format YYYY-MM-DD
            const tanggal_publikasi = new Date().toISOString().split('T')[0];

            const newId = await PublikasiModel.create({
                tipe, judul, slug, konten, foto_url, lampiran_url, author_id, tanggal_publikasi
            });

            return res.status(201).json({ 
                status: "success", 
                message: "Publikasi berhasil ditambahkan.", 
                data: { id: newId, slug } 
            });
        } catch (error) {
            console.error("Create Publikasi Error:", error);
            return res.status(500).json({ status: "error", message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const existingData = await PublikasiModel.getBySlugOrId(id);
            if (!existingData) {
                return res.status(404).json({ status: "error", message: "Publikasi tidak ditemukan." });
            }

            const { tipe, judul, konten } = req.body;

            // Jika judul berubah, perbarui slug-nya
            const slug = judul ? (generateSlug(judul) + '-' + existingData.id) : existingData.slug;
            
            let foto_url = existingData.foto_url;
            let lampiran_url = existingData.lampiran_url;

            if (req.files) {
                if (req.files['gambar'] && req.files['gambar'][0]) {
                    hapusFileLama(foto_url);
                    foto_url = req.files['gambar'][0].filename;
                }
                if (req.files['lampiran'] && req.files['lampiran'][0]) {
                    hapusFileLama(lampiran_url);
                    lampiran_url = req.files['lampiran'][0].filename;
                }
            }

            await PublikasiModel.update(existingData.id, {
                tipe: tipe || existingData.tipe,
                judul: judul || existingData.judul,
                slug,
                konten: konten || existingData.konten,
                foto_url,
                lampiran_url,
                tanggal_publikasi: existingData.tanggal_publikasi
            });

            return res.json({ status: "success", message: "Publikasi berhasil diperbarui.", data: { slug } });
        } catch (error) {
            console.error("Update Publikasi Error:", error);
            return res.status(500).json({ status: "error", message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const existingData = await PublikasiModel.getBySlugOrId(id);
            if (!existingData) {
                return res.status(404).json({ status: "error", message: "Publikasi tidak ditemukan." });
            }

            hapusFileLama(existingData.foto_url);
            hapusFileLama(existingData.lampiran_url);

            await PublikasiModel.delete(existingData.id);

            return res.json({ status: "success", message: "Publikasi berhasil dihapus." });
        } catch (error) {
            console.error("Delete Publikasi Error:", error);
            return res.status(500).json({ status: "error", message: error.message });
        }
    }
};

module.exports = publikasiController;
