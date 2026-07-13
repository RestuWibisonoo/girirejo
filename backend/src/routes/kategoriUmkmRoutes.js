const express = require('express');
const router = express.Router();
const kategoriController = require('../controllers/kategoriUmkmController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', kategoriController.getAll);
router.post('/', authMiddleware, kategoriController.create);
router.put('/:id', authMiddleware, kategoriController.update);
router.delete('/:id', authMiddleware, kategoriController.delete);

module.exports = router;
