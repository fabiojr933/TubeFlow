const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/downloadController');
const authMiddleware = require('../middlewares/authMiddleware');

// POST /api/download/mp3
router.post('/mp3', authMiddleware,  downloadController.downloadMp3);

// POST /api/download/mp4
router.post('/mp4', authMiddleware, downloadController.downloadMp4);

// GET /api/download/status - verifica se API está online
router.get('/status', (req, res) => {
  res.json({ status: 'ok', message: 'Download service is running' });
});

module.exports = router;