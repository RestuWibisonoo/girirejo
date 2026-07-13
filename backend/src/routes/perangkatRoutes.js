const express = require('express');
const router = express.Router();
const perangkatController = require('../controllers/perangkatController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Konfigurasi Multer untuk menerima 2 jenis foto
const uploadFields = upload.fields([
    { name: 'foto_awal', maxCount: 1 },
    { name: 'foto_hover', maxCount: 1 }
]);

// Publik: Bisa dilihat semua orang
router.get('/', perangkatController.getAll);

// Private: Hanya Admin yang bisa menambah, mengedit, dan menghapus
router.post('/', authMiddleware, uploadFields, perangkatController.create);
router.put('/:id', authMiddleware, uploadFields, perangkatController.update);
router.delete('/:id', authMiddleware, perangkatController.delete);

module.exports = router;
