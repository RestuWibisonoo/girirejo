const express = require('express');
const router = express.Router();
const umkmController = require('../controllers/umkmController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const resizeImage = require('../middlewares/resizeImageMiddleware');

// Route Publik
router.get('/', umkmController.getAll);
router.get('/:id', umkmController.getById);

// Route Private (Admin)
// Menggunakan upload.single('foto') karena hanya 1 file foto yang diunggah
router.post('/', authMiddleware, upload.single('foto'), resizeImage, umkmController.create);
router.put('/:id', authMiddleware, upload.single('foto'), resizeImage, umkmController.update);
router.delete('/:id', authMiddleware, umkmController.delete);

module.exports = router;
