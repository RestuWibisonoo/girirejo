const petaModel = require('../models/petaModel');
const path = require('path');
const fs = require('fs');

const petaController = {
  // --- KATEGORI PETA ---
  getAllKategori: async (req, res) => {
    try {
      const kategori = await petaModel.getAllKategori();
      res.json(kategori);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  createKategori: async (req, res) => {
    try {
      const { nama_kategori, ikon_warna } = req.body;
      if (!nama_kategori) return res.status(400).json({ message: 'Nama kategori wajib diisi' });
      
      const id = await petaModel.createKategori({ nama_kategori, ikon_warna: ikon_warna || 'blue' });
      res.status(201).json({ id, message: 'Kategori berhasil ditambahkan' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  updateKategori: async (req, res) => {
    try {
      const { id } = req.params;
      const { nama_kategori, ikon_warna } = req.body;
      const affected = await petaModel.updateKategori(id, { nama_kategori, ikon_warna });
      if (affected === 0) return res.status(404).json({ message: 'Kategori tidak ditemukan' });
      res.json({ message: 'Kategori berhasil diupdate' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  deleteKategori: async (req, res) => {
    try {
      const { id } = req.params;
      const affected = await petaModel.deleteKategori(id);
      if (affected === 0) return res.status(404).json({ message: 'Kategori tidak ditemukan' });
      res.json({ message: 'Kategori berhasil dihapus' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // --- LOKASI PETA ---
  getAllLokasi: async (req, res) => {
    try {
      const lokasi = await petaModel.getAllLokasi();
      res.json(lokasi);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  createLokasi: async (req, res) => {
    try {
      const { kategori_id, nama_lokasi, deskripsi, alamat, latitude, longitude } = req.body;
      const foto_url = req.file ? `/uploads/peta/${req.file.filename}` : null;
      
      if (!nama_lokasi || !latitude || !longitude) {
        return res.status(400).json({ message: 'Nama lokasi, latitude, dan longitude wajib diisi' });
      }

      const id = await petaModel.createLokasi({
        kategori_id: kategori_id || null,
        nama_lokasi,
        deskripsi,
        alamat,
        latitude,
        longitude,
        foto_url
      });
      res.status(201).json({ id, message: 'Lokasi berhasil ditambahkan' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  updateLokasi: async (req, res) => {
    try {
      const { id } = req.params;
      const { kategori_id, nama_lokasi, deskripsi, alamat, latitude, longitude } = req.body;
      
      const oldLokasi = await petaModel.getLokasiById(id);
      if (!oldLokasi) return res.status(404).json({ message: 'Lokasi tidak ditemukan' });

      let foto_url = oldLokasi.foto_url;
      if (req.file) {
        foto_url = `/uploads/peta/${req.file.filename}`;
        // Hapus foto lama jika ada
        if (oldLokasi.foto_url) {
          const oldPath = path.join(__dirname, '../../public', oldLokasi.foto_url);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      }

      await petaModel.updateLokasi(id, {
        kategori_id: kategori_id || null,
        nama_lokasi,
        deskripsi,
        alamat,
        latitude,
        longitude,
        foto_url
      });
      res.json({ message: 'Lokasi berhasil diupdate' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  deleteLokasi: async (req, res) => {
    try {
      const { id } = req.params;
      const oldLokasi = await petaModel.getLokasiById(id);
      
      const affected = await petaModel.deleteLokasi(id);
      if (affected === 0) return res.status(404).json({ message: 'Lokasi tidak ditemukan' });

      if (oldLokasi && oldLokasi.foto_url) {
        const oldPath = path.join(__dirname, '../../public', oldLokasi.foto_url);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      res.json({ message: 'Lokasi berhasil dihapus' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = petaController;
