const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');

// Record a visit (POST)
router.post('/', visitorController.record);

// Get visitor stats (GET)
router.get('/stats', visitorController.getStats);

module.exports = router;
