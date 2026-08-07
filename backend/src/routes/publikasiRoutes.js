const express = require('express');
const router = express.Router();
const publikasiController = require('../controllers/publikasiController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const resizeImage = require('../middlewares/resizeImageMiddleware');

// Konfigurasi Multer: Mendukung gambar_url (gambar) dan lampiran_url (pdf/doc)
const uploadFields = upload.fields([
    { name: 'gambar', maxCount: 1 },
    { name: 'lampiran', maxCount: 1 }
]);

// Route Publik
router.get('/', publikasiController.getAll);
router.get('/:idOrSlug', publikasiController.getDetail);

// Route Private (Hanya Admin)
router.post('/', authMiddleware, uploadFields, resizeImage, publikasiController.create);
router.put('/:id', authMiddleware, uploadFields, resizeImage, publikasiController.update);
router.delete('/:id', authMiddleware, publikasiController.delete);

module.exports = router;
