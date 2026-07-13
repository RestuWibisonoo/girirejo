const express = require('express');
const router = express.Router();
const desaProfileController = require('../controllers/desaProfileController');
const authMiddleware = require('../middlewares/authMiddleware');

// Endpoint publik untuk melihat profil desa
router.get('/', desaProfileController.getProfile);

// Endpoint private (butuh JWT) untuk mengubah profil desa
router.put('/', authMiddleware, desaProfileController.updateProfile);

module.exports = router;
