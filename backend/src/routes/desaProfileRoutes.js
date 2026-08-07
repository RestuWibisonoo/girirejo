const express = require('express');
const router = express.Router();
const desaProfileController = require('../controllers/desaProfileController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Endpoint publik untuk melihat profil desa
router.get('/', desaProfileController.getProfile);

// Endpoint private (butuh JWT) untuk mengubah profil desa
router.put('/', authMiddleware, upload.single('foto_bersama'), desaProfileController.updateProfile);

module.exports = router;
