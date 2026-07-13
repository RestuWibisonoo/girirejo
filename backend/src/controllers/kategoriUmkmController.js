const KategoriUmkmModel = require('../models/kategoriUmkmModel');

// Helper untuk membuat slug ramah-URL
const generateSlug = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Ganti spasi dengan -
        .replace(/[^\w\-]+/g, '')       // Hapus karakter selain kata dan -
        .replace(/\-\-+/g, '-')         // Ganti beberapa - menjadi satu -
        .replace(/^-+/, '')             // Hapus - di awal
        .replace(/-+$/, '');            // Hapus - di akhir
};

const kategoriUmkmController = {
    getAll: async (req, res) => {
        try {
            const data = await KategoriUmkmModel.getAll();
            return res.json({ status: "success", message: "Berhasil mengambil data kategori.", data });
        } catch (error) {
            console.error("GetAll Kategori Error:", error);
            return res.status(500).json({ status: "error", message: "Terjadi kesalahan server." });
        }
    },

    create: async (req, res) => {
        try {
            const { nama_kategori } = req.body;
            if (!nama_kategori) {
                return res.status(400).json({ status: "error", message: "Field nama_kategori wajib diisi." });
            }

            const slug = generateSlug(nama_kategori);
            const newId = await KategoriUmkmModel.create({ nama_kategori, slug });
            
            return res.status(201).json({ 
                status: "success", 
                message: "Kategori berhasil ditambahkan.", 
                data: { id: newId, nama_kategori, slug } 
            });
        } catch (error) {
            console.error("Create Kategori Error:", error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ status: "error", message: "Kategori dengan nama/slug ini sudah ada." });
            }
            return res.status(500).json({ status: "error", message: "Terjadi kesalahan server." });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { nama_kategori } = req.body;

            const existingData = await KategoriUmkmModel.getById(id);
            if (!existingData) {
                return res.status(404).json({ status: "error", message: "Kategori tidak ditemukan." });
            }

            const slug = nama_kategori ? generateSlug(nama_kategori) : existingData.slug;
            
            await KategoriUmkmModel.update(id, { 
                nama_kategori: nama_kategori || existingData.nama_kategori, 
                slug 
            });

            return res.json({ status: "success", message: "Kategori berhasil diperbarui." });
        } catch (error) {
            console.error("Update Kategori Error:", error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ status: "error", message: "Kategori dengan nama/slug ini sudah ada." });
            }
            return res.status(500).json({ status: "error", message: "Terjadi kesalahan server." });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const existingData = await KategoriUmkmModel.getById(id);
            if (!existingData) {
                return res.status(404).json({ status: "error", message: "Kategori tidak ditemukan." });
            }

            await KategoriUmkmModel.delete(id);
            return res.json({ status: "success", message: "Kategori berhasil dihapus." });
        } catch (error) {
            console.error("Delete Kategori Error:", error);
            // Constraint error diatasi di MySQL lewat ON DELETE SET NULL, 
            // Namun jika ingin ketat (ON DELETE RESTRICT), maka code ini penting.
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(400).json({ status: "error", message: "Kategori ini masih digunakan oleh UMKM." });
            }
            return res.status(500).json({ status: "error", message: "Terjadi kesalahan server." });
        }
    }
};

module.exports = kategoriUmkmController;
