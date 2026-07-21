const express = require('express');
const router = express.Router();
const petaController = require('../controllers/petaController');
const { verifyToken } = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Konfigurasi Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads/peta'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `peta-${Date.now()}-${uniqueSuffix}${ext}`);
  }
});
const upload = multer({ storage });

// --- Kategori Routes ---
router.get('/kategori', petaController.getAllKategori);
router.post('/kategori', verifyToken, petaController.createKategori);
router.put('/kategori/:id', verifyToken, petaController.updateKategori);
router.delete('/kategori/:id', verifyToken, petaController.deleteKategori);

// --- Lokasi Routes ---
router.get('/lokasi', petaController.getAllLokasi);
router.post('/lokasi', verifyToken, upload.single('foto'), petaController.createLokasi);
router.put('/lokasi/:id', verifyToken, upload.single('foto'), petaController.updateLokasi);
router.delete('/lokasi/:id', verifyToken, petaController.deleteLokasi);

module.exports = router;
