const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireSuperAdmin } = require('../middlewares/authMiddleware');

// Semua route di sini dilindungi oleh authMiddleware + requireSuperAdmin
router.use(requireSuperAdmin);

router.get('/', adminController.getAll);
router.post('/', adminController.create);
router.delete('/:id', adminController.delete);

module.exports = router;
